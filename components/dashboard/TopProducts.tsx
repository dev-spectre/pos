"use client";

import { useMemo } from "react";
import { Transaction, ProductSalesStat } from "@/types";
import { formatCurrencyShort } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface Props {
  transactions: Transaction[];
}

export default function TopProducts({ transactions }: Props) {
  const topProducts = useMemo<ProductSalesStat[]>(() => {
    const map: Record<string, ProductSalesStat> = {};

    for (const txn of transactions) {
      for (const item of txn.items) {
        if (!map[item.productId]) {
          map[item.productId] = {
            productId: item.productId,
            productName: item.productName,
            quantity: 0,
            revenue: 0,
          };
        }
        map[item.productId].quantity += item.quantity;
        map[item.productId].revenue += item.subtotal;
      }
    }

    return Object.values(map)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [transactions]);

  if (topProducts.length === 0) {
    return null;
  }

  const maxQty = topProducts[0]?.quantity ?? 1;

  const barColors = [
    "var(--accent)",
    "var(--green)",
    "var(--blue)",
    "var(--yellow)",
    "var(--purple)",
  ];

  return (
    <div
      className="rounded-2xl p-4 space-y-3"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "var(--accent-soft)" }}
        >
          <TrendingUp size={15} style={{ color: "var(--accent)" }} />
        </div>
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Top Selling Products
        </p>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          Today
        </span>
      </div>

      {/* Product rows */}
      <div className="space-y-2.5">
        {topProducts.map((item, idx) => {
          const pct = Math.max(8, (item.quantity / maxQty) * 100);
          const color = barColors[idx] ?? "var(--accent)";
          return (
            <div key={item.productId}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: `${color}20`, color }}
                  >
                    {idx + 1}
                  </span>
                  <p
                    className="text-xs font-medium truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.productName}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className="text-xs font-semibold" style={{ color }}>
                    ×{item.quantity}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {formatCurrencyShort(item.revenue)}
                  </span>
                </div>
              </div>
              {/* Bar */}
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "var(--bg-elevated)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
