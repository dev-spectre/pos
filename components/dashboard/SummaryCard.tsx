"use client";

interface SummaryCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  subtitle?: string;
}

export default function SummaryCard({
  label,
  value,
  icon,
  color,
  bgColor,
  subtitle,
}: SummaryCardProps) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: bgColor, color }}
        >
          {icon}
        </div>
        {subtitle && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: bgColor, color }}
          >
            {subtitle}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          {value}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}
