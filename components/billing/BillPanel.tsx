"use client";

import { BillItem } from "@/types";
import { formatCurrency, formatCurrencyShort } from "@/lib/utils";
import { Minus, Plus, X, ShoppingCart } from "lucide-react";

interface BillPanelProps {
  items: BillItem[];
  grandTotal: number;
  onUpdateQty: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
}

export default function BillPanel({
  items,
  grandTotal,
  onUpdateQty,
  onRemove,
  onClear,
}: BillPanelProps) {
  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 py-8"
        style={{ color: "var(--text-muted)" }}
      >
        <ShoppingCart size={40} strokeWidth={1.2} />
        <p className="text-sm">No items added yet</p>
        <p className="text-xs">Tap a product to add it to the bill</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0">
      {/* Items list */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3" style={{ maxHeight: "220px" }}>
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center gap-2 p-2 rounded-xl"
            style={{ background: "var(--bg-elevated)" }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                {item.product.name}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {formatCurrencyShort(item.product.price)} × {item.quantity}
              </p>
            </div>

            {/* Qty Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <Minus size={12} style={{ color: "var(--text-secondary)" }} />
              </button>
              <input
                type="number"
                value={item.quantity}
                min={1}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v > 0) onUpdateQty(item.product.id, v);
                }}
                className="w-9 h-7 rounded-lg text-center text-sm font-bold bg-transparent outline-none"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--accent)",
                  color: "var(--text-primary)",
                }}
              />
              <button
                onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Subtotal */}
            <span
              className="text-sm font-bold w-14 text-right shrink-0"
              style={{ color: "var(--text-primary)" }}
            >
              {formatCurrencyShort(item.product.price * item.quantity)}
            </span>

            <button
              onClick={() => onRemove(item.product.id)}
              className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
              style={{ color: "var(--red)" }}
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Grand Total */}
      <div
        className="rounded-2xl p-4 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)",
        }}
      >
        <div>
          <p className="text-white/70 text-xs font-medium">Grand Total</p>
          <p className="text-white text-3xl font-extrabold tracking-tight">
            {formatCurrency(grandTotal)}
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="text-white/60 text-xs hover:text-white/90 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
