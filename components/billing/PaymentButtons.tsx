"use client";

import { PaymentMode } from "@/types";
import { Banknote, Smartphone, CreditCard } from "lucide-react";

interface PaymentButtonsProps {
  onPay: (mode: PaymentMode) => void;
  disabled?: boolean;
}

const PAYMENT_OPTIONS: {
  mode: PaymentMode;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}[] = [
  {
    mode: "cash",
    label: "Cash",
    icon: <Banknote size={22} />,
    color: "var(--green)",
    bg: "var(--green-soft)",
  },
  {
    mode: "upi",
    label: "UPI",
    icon: <Smartphone size={22} />,
    color: "var(--yellow)",
    bg: "var(--yellow-soft)",
  },
  {
    mode: "card",
    label: "Card",
    icon: <CreditCard size={22} />,
    color: "var(--blue)",
    bg: "var(--blue-soft)",
  },
];

export default function PaymentButtons({ onPay, disabled }: PaymentButtonsProps) {
  return (
    <div>
      <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
        Select Payment
      </p>
      <div className="grid grid-cols-3 gap-2">
        {PAYMENT_OPTIONS.map(({ mode, label, icon, color, bg }) => (
          <button
            key={mode}
            onClick={() => !disabled && onPay(mode)}
            disabled={disabled}
            className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-40"
            style={{ background: bg, color, border: `1.5px solid ${color}40` }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
