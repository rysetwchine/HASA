import Spinner from "./Spinner.jsx";
import { cx } from "../../utils/cx.js";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none";

const VARIANTS = {
  primary:
    "bg-plum-800 text-canvas shadow-card hover:bg-plum-900 active:bg-plum-950",
  secondary:
    "border border-line bg-white text-ink shadow-card hover:border-line-dark hover:bg-gold-soft/30 active:bg-gold-soft/60",
  soft: "bg-lav-200/70 text-accent-deep hover:bg-lav-300/70 active:bg-lav-300",
  ghost: "text-accent-strong hover:bg-lav-200/40",
  danger: "bg-danger text-white hover:bg-danger-deep active:bg-danger-deep",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "min-h-10 px-4 py-2.5 text-sm",
  lg: "min-h-12 px-5 py-3 text-base",
};

/** Pinagsasaluhang estilo para sa <button> at router <Link> na CTA. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
} = {}) {
  return cx(BASE, VARIANTS[variant] ?? VARIANTS.primary, SIZES[size], className);
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled = false,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      {loading ? <Spinner className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}
