"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Product } from "@/types";

interface SearchBarProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export default function SearchBar({ products, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const suggestions = query.trim()
    ? products
        .filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8)
    : [];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSelect(product: Product) {
    onSelect(product);
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative px-4 pb-2 shrink-0">
      <div
        className="flex items-center gap-2 rounded-xl px-3"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          height: "42px",
        }}
      >
        <Search size={16} style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search products..."
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: "var(--text-primary)" }}
        />
        {query && (
          <button onClick={() => setQuery("")}>
            <X size={16} style={{ color: "var(--text-muted)" }} />
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div
          className="absolute left-4 right-4 top-full z-50 rounded-xl overflow-hidden shadow-2xl"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            marginTop: "4px",
          }}
        >
          {suggestions.map((p) => (
            <button
              key={p.id}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors text-left"
              onClick={() => handleSelect(p)}
            >
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {p.name}
              </span>
              <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>
                ₹{p.price}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
