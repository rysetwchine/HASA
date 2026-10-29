import { cx } from "../../utils/cx.js";

const TONES = {
  neutral: "border-transparent bg-white/70 text-ink",
  brand: "border-line-dark/25 bg-lav-200/70 text-accent-deep",
  accent: "border-transparent bg-accent text-canvas",
  success: "border-success/30 bg-success/15 text-success-strong",
  warning: "border-gold-strong/40 bg-gold-soft/70 text-brown",
  muted: "border-line bg-white/50 text-muted",
  dark: "border-white/15 bg-white/10 text-white",
};

export default function Chip({ tone = "neutral", className, children }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        TONES[tone] ?? TONES.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}
