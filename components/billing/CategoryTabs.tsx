"use client";

import { Category } from "@/types";

interface CategoryTabsProps {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function CategoryTabs({ categories, activeId, onSelect }: CategoryTabsProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto px-4 py-2 shrink-0"
      style={{ scrollbarWidth: "none" }}
    >
      {categories.map((cat) => {
        const active = cat.id === activeId;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-95"
            style={{
              background: active ? "var(--accent)" : "var(--bg-elevated)",
              color: active ? "#fff" : "var(--text-secondary)",
              border: active ? "1px solid var(--accent)" : "1px solid var(--border)",
            }}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
