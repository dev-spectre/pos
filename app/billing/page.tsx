"use client";

import { useState, useCallback } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useBill } from "@/hooks/useBill";
import { useTransactions } from "@/hooks/useTransactions";
import { PaymentMode, Product } from "@/types";
import CategoryTabs from "@/components/billing/CategoryTabs";
import SearchBar from "@/components/billing/SearchBar";
import ProductCard from "@/components/billing/ProductCard";
import BillPanel from "@/components/billing/BillPanel";
import PaymentButtons from "@/components/billing/PaymentButtons";
import { CheckCircle } from "lucide-react";

export default function BillingPage() {
  const { products, categories, initialized, getProductsByCategory, incrementFrequency } =
    useProducts();
  const {
    items,
    grandTotal,
    addItem,
    updateQuantity,
    removeItem,
    clearBill,
    toBillRecords,
    isEmpty,
  } = useBill();
  const { saveTransaction } = useTransactions();

  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0]?.id ?? "starters"
  );
  const [toast, setToast] = useState<string | null>(null);
  const [billOpen, setBillOpen] = useState(false);

  // Use initialized categories
  const displayCategories =
    categories.length > 0 ? categories : [{ id: "starters", name: "Starters" }];

  // Ensure activeCategoryId is valid
  const resolvedCategoryId =
    displayCategories.find((c) => c.id === activeCategoryId)?.id ??
    displayCategories[0]?.id ??
    "starters";

  const activeProducts = initialized
    ? getProductsByCategory(resolvedCategoryId)
    : [];

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handlePay = useCallback(
    (mode: PaymentMode) => {
      if (isEmpty) return;
      const records = toBillRecords();
      saveTransaction(records, grandTotal, mode);
      const ids = items.map((i) => i.product.id);
      incrementFrequency(ids);
      clearBill();
      setBillOpen(false);
      showToast(`₹${grandTotal.toFixed(2)} paid via ${mode.toUpperCase()} ✓`);
    },
    [
      isEmpty,
      toBillRecords,
      saveTransaction,
      grandTotal,
      items,
      incrementFrequency,
      clearBill,
      showToast,
    ]
  );

  const getQuantityInBill = (productId: string) =>
    items.find((i) => i.product.id === productId)?.quantity ?? 0;

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="flex flex-col h-full relative">
      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed top-14 left-0 right-0 z-50 flex justify-center pointer-events-none"
        >
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl animate-pulse"
            style={{ background: "var(--green)", color: "#fff", maxWidth: "90vw" }}
          >
            <CheckCircle size={18} />
            <span className="font-semibold text-sm">{toast}</span>
          </div>
        </div>
      )}

      {/* Product Section */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Search */}
        <div className="pt-2">
          <SearchBar
            products={products.filter((p) => p.active)}
            onSelect={(p: Product) => addItem(p)}
          />
        </div>

        {/* Category Tabs */}
        <CategoryTabs
          categories={displayCategories}
          activeId={resolvedCategoryId}
          onSelect={setActiveCategoryId}
        />

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          {activeProducts.length === 0 ? (
            <div
              className="flex items-center justify-center h-24 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              No active products in this category
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {activeProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addItem}
                  quantity={getQuantityInBill(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bill Sheet Trigger */}
      <div
        className="shrink-0 px-4 py-3"
        style={{ borderTop: "1px solid var(--border)", background: "var(--bg-secondary)" }}
      >
        {!billOpen ? (
          <button
            onClick={() => setBillOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95"
            style={{
              background: isEmpty ? "var(--bg-elevated)" : "var(--accent)",
              color: isEmpty ? "var(--text-muted)" : "#fff",
              border: isEmpty ? "1px solid var(--border)" : "none",
            }}
          >
            <span>{isEmpty ? "No items in bill" : `View Bill (${totalItems} items)`}</span>
            {!isEmpty && (
              <span className="font-extrabold">₹{grandTotal.toFixed(2)}</span>
            )}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                Current Bill
              </h3>
              <button
                onClick={() => setBillOpen(false)}
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                ▲ Collapse
              </button>
            </div>
            <BillPanel
              items={items}
              grandTotal={grandTotal}
              onUpdateQty={updateQuantity}
              onRemove={removeItem}
              onClear={clearBill}
            />
            <PaymentButtons onPay={handlePay} disabled={isEmpty} />
          </div>
        )}
      </div>
    </div>
  );
}
