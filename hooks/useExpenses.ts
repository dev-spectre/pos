"use client";

import { useState, useEffect, useCallback } from "react";
import { Expense, ExpenseCategory } from "@/types";
import { getItem, setItem, KEYS } from "@/lib/storage";
import { getTodayKey, generateId } from "@/lib/utils";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const load = useCallback((): Expense[] => {
    return getItem<Expense[]>(KEYS.EXPENSES) ?? [];
  }, []);

  useEffect(() => {
    setExpenses(load());
  }, [load]);

  const persist = useCallback((updated: Expense[]) => {
    setItem(KEYS.EXPENSES, updated);
    setExpenses(updated);
  }, []);

  const addExpense = useCallback(
    (data: Omit<Expense, "id" | "createdAt">) => {
      const all = load();
      const newExpense: Expense = {
        ...data,
        id: generateId(),
        createdAt: Date.now(),
      };
      persist([...all, newExpense]);
    },
    [load, persist]
  );

  const updateExpense = useCallback(
    (id: string, data: Partial<Omit<Expense, "id" | "createdAt">>) => {
      const all = load();
      const updated = all.map((e) => (e.id === id ? { ...e, ...data } : e));
      persist(updated);
    },
    [load, persist]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      const all = load();
      persist(all.filter((e) => e.id !== id));
    },
    [load, persist]
  );

  const getTodayExpenses = useCallback((): Expense[] => {
    const today = getTodayKey();
    return (getItem<Expense[]>(KEYS.EXPENSES) ?? []).filter(
      (e) => e.date === today
    );
  }, []);

  const getTotalToday = useCallback((): number => {
    return getTodayExpenses().reduce((sum, e) => sum + e.amount, 0);
  }, [getTodayExpenses]);

  const getExpensesByDate = useCallback((date: string): Expense[] => {
    return (getItem<Expense[]>(KEYS.EXPENSES) ?? []).filter(
      (e) => e.date === date
    );
  }, []);

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getTodayExpenses,
    getTotalToday,
    getExpensesByDate,
  };
}
