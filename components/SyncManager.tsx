"use client";

import { useEffect, useRef, useCallback } from "react";
import { getItem, setItem, KEYS } from "@/lib/storage";
import { Category, Product, Transaction, Expense, DailyReport } from "@/types";

export function SyncManager() {
  const syncInProgress = useRef(false);

  const attemptSync = useCallback(async () => {
    if (syncInProgress.current || !navigator.onLine) return;
    syncInProgress.current = true;

    try {
      // 1. Sync Categories (No relational dependencies)
      let allCategories = getItem<Category[]>(KEYS.CATEGORIES) ?? [];
      let pendingCategories = allCategories.filter((c) => c.syncStatus !== "synced");
      
      if (pendingCategories.length > 0) {
        const resCat = await fetch("/api/sync/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categories: pendingCategories }),
        });
        if (resCat.ok) {
          const { syncedIds } = await resCat.json();
          const syncedIdsSet = new Set(syncedIds);
          allCategories = allCategories.map((c) =>
            syncedIdsSet.has(c.id) ? { ...c, syncStatus: "synced" as const } : c
          );
          setItem(KEYS.CATEGORIES, allCategories);
        }
      }

      // 2. Sync Products (Depends on Categories)
      let allProducts = getItem<Product[]>(KEYS.PRODUCTS) ?? [];
      let pendingProducts = allProducts.filter((p) => p.syncStatus !== "synced");

      if (pendingProducts.length > 0) {
        const resProd = await fetch("/api/sync/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products: pendingProducts }),
        });
        if (resProd.ok) {
          const { syncedIds } = await resProd.json();
          const syncedIdsSet = new Set(syncedIds);
          allProducts = allProducts.map((p) =>
            syncedIdsSet.has(p.id) ? { ...p, syncStatus: "synced" as const } : p
          );
          setItem(KEYS.PRODUCTS, allProducts);
        }
      }

      // 3. Sync Transactions (Depends on Products)
      let allTxns = getItem<Transaction[]>(KEYS.TRANSACTIONS) ?? [];
      let pendingTxns = allTxns.filter((t) => t.syncStatus !== "synced");

      if (pendingTxns.length > 0) {
        const resTxn = await fetch("/api/sync/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactions: pendingTxns }),
        });

        if (resTxn.ok) {
          const { syncedIds } = await resTxn.json();
          const syncedIdsSet = new Set(syncedIds);
          allTxns = allTxns.map((t) =>
            syncedIdsSet.has(t.id) ? { ...t, syncStatus: "synced" as const } : t
          );
          setItem(KEYS.TRANSACTIONS, allTxns);
        }
      }

      // 4. Sync Expenses (Independent)
      let allExpenses = getItem<Expense[]>(KEYS.EXPENSES) ?? [];
      let pendingExpenses = allExpenses.filter((e) => e.syncStatus !== "synced");

      if (pendingExpenses.length > 0) {
        const resExp = await fetch("/api/sync/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expenses: pendingExpenses }),
        });

        if (resExp.ok) {
          const { syncedIds } = await resExp.json();
          const syncedIdsSet = new Set(syncedIds);
          allExpenses = allExpenses.map((e) =>
            syncedIdsSet.has(e.id) ? { ...e, syncStatus: "synced" as const } : e
          );
          setItem(KEYS.EXPENSES, allExpenses);
        }
      }

      // 5. Sync Daily Reports (Archived history)
      let allReports = getItem<DailyReport[]>(KEYS.ARCHIVED_REPORTS) ?? [];
      let pendingReports = allReports.filter((r) => r.syncStatus !== "synced");

      if (pendingReports.length > 0) {
        const resRep = await fetch("/api/sync/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reports: pendingReports }),
        });

        if (resRep.ok) {
          const { syncedIds } = await resRep.json();
          const syncedIdsSet = new Set(syncedIds);
          allReports = allReports.map((r) =>
            syncedIdsSet.has(r.id) ? { ...r, syncStatus: "synced" as const } : r
          );
          setItem(KEYS.ARCHIVED_REPORTS, allReports);
        }
      }

    } catch (error) {
      console.error("SyncManager: Sync failed", error);
    } finally {
      syncInProgress.current = false;
    }
  }, []);

  useEffect(() => {
    // Attempt sync on mount
    attemptSync();

    // Listen for online events
    const handleOnline = () => attemptSync();
    window.addEventListener("online", handleOnline);

    // Listen for manual sync triggers from hooks
    window.addEventListener("syncRequested", attemptSync);

    // Periodic background sync every 30 seconds
    const intervalId = setInterval(attemptSync, 30_000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("syncRequested", attemptSync);
      clearInterval(intervalId);
    };
  }, [attemptSync]);

  return null; // Silent logic-only component
}
