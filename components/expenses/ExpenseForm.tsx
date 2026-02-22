"use client";

import { useState } from "react";
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES } from "@/types";
import { getTodayKey } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface Props {
  initial?: Expense;
  onSave: (data: Omit<Expense, "id" | "createdAt">) => void;
  onCancel: () => void;
}

export default function ExpenseForm({ initial, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<ExpenseCategory>(
    initial?.category ?? "other"
  );
  const [amount, setAmount] = useState(initial?.amount?.toString() ?? "");
  const [date, setDate] = useState(initial?.date ?? getTodayKey());
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [error, setError] = useState("");

  function handleSave() {
    if (!title.trim()) return setError("Title is required");
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return setError("Enter a valid amount");
    setError("");
    onSave({ title: title.trim(), category, amount: amt, date, notes: notes.trim() || undefined });
  }

  const inputStyle = {
    background: "var(--bg-primary)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
  };

  return (
    <div
      className="rounded-2xl p-4 space-y-3"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
    >
      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        {initial ? "Edit Expense" : "Add Expense"}
      </p>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Expense title"
        className="w-full px-3 py-2.5 rounded-xl outline-none text-sm"
        style={inputStyle}
      />

      <div className="grid grid-cols-2 gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          className="px-3 py-2.5 rounded-xl outline-none text-sm"
          style={inputStyle}
        >
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value} style={{ background: "var(--bg-card)" }}>
              {c.label}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount ₹"
          className="px-3 py-2.5 rounded-xl outline-none text-sm"
          style={inputStyle}
        />
      </div>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl outline-none text-sm"
        style={inputStyle}
      />

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        rows={2}
        className="w-full px-3 py-2.5 rounded-xl outline-none text-sm resize-none"
        style={inputStyle}
      />

      {error && <p className="text-xs" style={{ color: "var(--red)" }}>{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          <Check size={14} /> Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95"
          style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
        >
          <X size={14} /> Cancel
        </button>
      </div>
    </div>
  );
}
