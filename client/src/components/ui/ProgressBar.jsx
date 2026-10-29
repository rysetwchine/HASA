import { cx } from "../../lib/cx.js";

const TONES = {
  brand: "bg-plum-800",
  success: "bg-success",
  accent: "bg-accent",
  warning: "bg-gold-strong",
  muted: "bg-brand-300",
};

const SIZES = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3",
};

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  tone = "brand",
  size = "md",
  className,
  trackClassName,
}) {
  const safeMax = max > 0 ? max : 1;
  const percent = Math.min(100, Math.max(0, Math.round((value / safeMax) * 100)));

  return (
    <div className={cx("space-y-1.5", className)}>
      {label ? (
        <div className="flex items-center justify-between gap-3 text-xs font-medium text-muted">
          <span>{label}</span>
          <span className="shrink-0 font-semibold text-ink">{percent}%</span>
        </div>
      ) : null}
      <div
        className={cx(
          "w-full overflow-hidden rounded-full bg-cream-200",
          SIZES[size] ?? SIZES.md,
          trackClassName,
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? "Pag-unlad"}
      >
        <div
          className={cx(
            "h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none",
            TONES[tone] ?? TONES.brand,
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
