"use client";

import { Product } from "@/types";
import { formatCurrencyShort } from "@/lib/utils";
import { Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  quantity?: number;
}

export default function ProductCard({ product, onAdd, quantity }: ProductCardProps) {
  return (
    <button
      onClick={() => onAdd(product)}
      className="relative flex flex-col items-start p-3 rounded-2xl text-left transition-all duration-150 active:scale-95 w-full"
      style={{
        background: quantity ? "var(--accent-soft)" : "var(--bg-elevated)",
        border: quantity
          ? "1px solid var(--accent)"
          : "1px solid var(--border)",
      }}
    >
      {quantity !== undefined && quantity > 0 && (
        <span
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white font-bold"
          style={{ background: "var(--accent)", fontSize: "11px" }}
        >
          {quantity}
        </span>
      )}
      <span
        className="text-sm font-semibold leading-tight pr-6"
        style={{ color: "var(--text-primary)" }}
      >
        {product.name}
      </span>
      <div className="flex items-center justify-between w-full mt-2">
        <span
          className="text-base font-bold"
          style={{ color: "var(--accent)" }}
        >
          {formatCurrencyShort(product.price)}
        </span>
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          <Plus size={14} />
        </div>
      </div>
    </button>
  );
}
