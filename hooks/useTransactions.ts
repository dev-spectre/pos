"use client";

import { useState, useEffect, useCallback } from "react";
import { Transaction, BillItemRecord, PaymentMode, DailySummary } from "@/types";
import { getItem, setItem, KEYS } from "@/lib/storage";
import { getTodayKey, generateId } from "@/lib/utils";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadToday = useCallback(() => {
    const all = getItem<Transaction[]>(KEYS.TRANSACTIONS) ?? [];
    const today = getTodayKey();
    return all.filter((t) => t.date === today);
  }, []);

  useEffect(() => {
    setTransactions(loadToday());
  }, [loadToday]);

  const saveTransaction = useCallback(
    (items: BillItemRecord[], total: number, paymentMode: PaymentMode): Transaction => {
      const all = getItem<Transaction[]>(KEYS.TRANSACTIONS) ?? [];
      const txn: Transaction = {
        id: generateId(),
        date: getTodayKey(),
        timestamp: Date.now(),
        items,
        total,
        paymentMode,
        syncStatus: "pending",
      };
      const updated = [...all, txn];
      setItem(KEYS.TRANSACTIONS, updated);
      setTransactions(updated.filter((t) => t.date === getTodayKey()));
      
      // Trigger global sync event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("syncRequested"));
      }

      return txn;
    },
    []
  );

  const deleteTransaction = useCallback((id: string) => {
    const all = getItem<Transaction[]>(KEYS.TRANSACTIONS) ?? [];
    const updated = all.filter((t) => t.id !== id);
    setItem(KEYS.TRANSACTIONS, updated);
    setTransactions(updated.filter((t) => t.date === getTodayKey()));
  }, []);

  const getDailySummary = useCallback((): DailySummary => {
    const today = loadToday();
    return {
      totalSales: today.reduce((s, t) => s + t.total, 0),
      cashSales: today
        .filter((t) => t.paymentMode === "cash")
        .reduce((s, t) => s + t.total, 0),
      upiSales: today
        .filter((t) => t.paymentMode === "upi")
        .reduce((s, t) => s + t.total, 0),
      cardSales: today
        .filter((t) => t.paymentMode === "card")
        .reduce((s, t) => s + t.total, 0),
      totalItems: today.reduce(
        (s, t) => s + t.items.reduce((is, i) => is + i.quantity, 0),
        0
      ),
    };
  }, [loadToday]);

  const getTransactionsByDate = useCallback((date: string): Transaction[] => {
    const all = getItem<Transaction[]>(KEYS.TRANSACTIONS) ?? [];
    return all.filter((t) => t.date === date);
  }, []);

  return {
    transactions,
    saveTransaction,
    deleteTransaction,
    getDailySummary,
    getTransactionsByDate,
    refreshTransactions: () => setTransactions(loadToday()),
  };
}
