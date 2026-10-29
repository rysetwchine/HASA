import Card from "../ui/Card.jsx";
import { cx } from "../../lib/cx.js";

const TONES = {
  brand: "bg-brand-50 text-brand-600",
  accent: "bg-accent text-brand-700",
  success: "bg-success text-emerald-700",
  gold: "bg-gold-100 text-gold-700",
  slate: "bg-cream-100 text-muted",
};

export default function SummaryCard({
  label,
  value,
  hint,
  Icon,
  tone = "brand",
  className,
}) {
  return (
    <Card
      className={cx(
        "flex flex-col gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-lifted motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-bold uppercase leading-relaxed tracking-[0.12em] text-muted">
          {label}
        </p>
        <span
          className={cx(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            TONES[tone] ?? TONES.brand,
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold tracking-tight text-ink">{value}</p>
        {hint ? (
          <p className="mt-0.5 truncate text-xs font-medium text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
