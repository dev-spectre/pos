"use client";

import { useMemo, useState } from "react";
import { Product, Transaction } from "@/types";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  products: Product[];
  transactions: Transaction[];
  threshold?: number; // default 2 — flag if qty sold < threshold
}

interface SlowProduct {
  productId: string;
  productName: string;
  qtySold: number;
}

export default function SlowMovingAlert({ products, transactions, threshold = 2 }: Props) {
  const [open, setOpen] = useState(false);

  const slowProducts = useMemo<SlowProduct[]>(() => {
    // Build today qty map
    const qtyMap: Record<string, number> = {};
    for (const txn of transactions) {
      for (const item of txn.items) {
        qtyMap[item.productId] = (qtyMap[item.productId] ?? 0) + item.quantity;
      }
    }

    return products
      .filter((p) => p.active)
      .map((p) => ({
        productId: p.id,
        productName: p.name,
        qtySold: qtyMap[p.id] ?? 0,
      }))
      .filter((p) => p.qtySold < threshold)
      .sort((a, b) => a.qtySold - b.qtySold);
  }, [products, transactions, threshold]);

  if (slowProducts.length === 0) return null;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--bg-card)", border: "1px solid var(--yellow-soft)" }}
    >
      {/* Toggle header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-3"
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "var(--yellow-soft)" }}
        >
          <AlertTriangle size={14} style={{ color: "var(--yellow)" }} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Low Performance Products
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {slowProducts.length} product{slowProducts.length !== 1 ? "s" : ""} with &lt;{threshold} sales today
          </p>
        </div>
        {open ? (
          <ChevronUp size={16} style={{ color: "var(--text-muted)" }} />
        ) : (
          <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />
        )}
      </button>

      {open && (
        <div
          className="px-4 pb-3 space-y-2"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {slowProducts.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between py-1.5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: item.qtySold === 0 ? "var(--red)" : "var(--yellow)",
                  }}
                />
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.productName}
                </p>
              </div>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2"
                style={{
                  background: item.qtySold === 0 ? "var(--red-soft)" : "var(--yellow-soft)",
                  color: item.qtySold === 0 ? "var(--red)" : "var(--yellow)",
                }}
              >
                {item.qtySold === 0 ? "No sales" : `${item.qtySold} sold`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
