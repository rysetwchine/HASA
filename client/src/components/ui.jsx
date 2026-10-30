import { useEffect } from "react";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { cx } from "../utils/cx.js";

const BUTTON_STYLES = {
  primary:
    "bg-plum-800 text-white hover:bg-plum-900 shadow-sm disabled:bg-plum-400",
  accent:
    "bg-accent text-white hover:bg-accent-strong shadow-sm disabled:bg-accent/50",
  secondary:
    "border border-plum-200 bg-white text-plum-800 hover:border-plum-400 hover:bg-plum-50",
  ghost: "text-plum-700 hover:bg-plum-100",
  danger: "bg-danger text-white hover:bg-danger-deep disabled:bg-danger/50",
  gold: "bg-gold text-brown hover:bg-gold-strong shadow-sm",
};

const BUTTON_SIZES = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
};

export function buttonClass({ variant = "primary", size = "md", className = "" } = {}) {
  return cx(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed",
    BUTTON_STYLES[variant],
    BUTTON_SIZES[size],
    className,
  );
}

export function Button({ variant, size, className, type = "button", ...props }) {
  return <button type={type} className={buttonClass({ variant, size, className })} {...props} />;
}

export function Card({ as: Tag = "section", className = "", children, ...props }) {
  return (
    <Tag
      className={cx(
        "rounded-2xl border border-plum-100 bg-white p-5 shadow-[0_1px_2px_rgba(41,31,71,0.04)] sm:p-6",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Chip({ tone = "neutral", className = "", children }) {
  const tones = {
    neutral: "bg-plum-50 text-plum-700 border-plum-100",
    accent: "bg-accent-soft text-accent-deep border-accent/20",
    gold: "bg-gold-soft text-brown border-gold-strong/30",
    success: "bg-success-soft text-success-strong border-success/20",
    danger: "bg-danger-soft text-danger-deep border-danger/20",
    info: "bg-sky-soft text-sky-dark border-sky/20",
    warning: "bg-gold-soft text-brown border-gold-strong/30",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value = 0, label, tone = "accent", className = "" }) {
  const safe = Math.max(0, Math.min(100, Number(value) || 0));
  const colors = {
    accent: "bg-accent",
    success: "bg-success",
    gold: "bg-gold-strong",
    plum: "bg-plum-700",
  };
  return (
    <div className={className}>
      {label ? (
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
          <span>{label}</span>
          <span>{safe}%</span>
        </div>
      ) : null}
      <div
        className="h-2.5 overflow-hidden rounded-full bg-plum-100"
        role="progressbar"
        aria-valuenow={safe}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progreso"}
      >
        <div
          className={cx("h-full rounded-full transition-[width] duration-500", colors[tone])}
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, hint, tone = "accent" }) {
  const tones = {
    accent: "bg-accent-soft text-accent-deep",
    gold: "bg-gold-soft text-brown",
    plum: "bg-plum-100 text-plum-800",
    success: "bg-success-soft text-success-strong",
    sky: "bg-sky-soft text-sky-dark",
  };
  return (
    <Card className="flex items-start gap-4 p-4 sm:p-5">
      <span className={cx("grid size-11 shrink-0 place-items-center rounded-xl", tones[tone])}>
        {Icon ? <Icon className="size-5" aria-hidden="true" /> : null}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-ink">{value}</p>
        {hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}
      </div>
    </Card>
  );
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-accent-strong">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Alert({ tone = "danger", title, children, onClose, className = "" }) {
  const tones = {
    danger: "border-danger/20 bg-danger-soft text-danger-deep",
    success: "border-success/20 bg-success-soft text-success-strong",
    info: "border-sky/20 bg-sky-soft text-sky-dark",
    warning: "border-gold-strong/30 bg-gold-soft text-brown",
  };
  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;
  return (
    <div
      className={cx("flex items-start gap-3 rounded-xl border p-3.5 text-sm", tones[tone], className)}
      role={tone === "danger" ? "alert" : "status"}
    >
      <Icon className="mt-0.5 size-4.5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={cx(title && "mt-0.5", "leading-relaxed")}>{children}</div> : null}
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 hover:bg-black/5"
          aria-label="Isara ang mensahe"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-plum-200 bg-white/60 px-6 py-12 text-center">
      {Icon ? (
        <span className="grid size-12 place-items-center rounded-2xl bg-plum-50 text-plum-600">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      ) : null}
      <h2 className="mt-4 text-base font-bold text-ink">{title}</h2>
      {description ? <p className="mt-1 max-w-md text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function Loading({ label = "Naglo-load…" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm font-medium text-muted" role="status">
      <Loader2 className="size-5 animate-spin text-accent" aria-hidden="true" />
      {label}
    </div>
  );
}

export function Field({ label, htmlFor, hint, error, children, className = "" }) {
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
          {label}
        </label>
      ) : null}
      {children}
      {hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
      {error ? <p className="mt-1.5 text-xs font-medium text-danger">{error}</p> : null}
    </div>
  );
}

const CONTROL =
  "w-full rounded-xl border border-plum-200 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-plum-400 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15 disabled:bg-plum-50 disabled:text-muted";

export function Input({ className = "", ...props }) {
  return <input className={cx(CONTROL, className)} {...props} />;
}

export function Textarea({ className = "", ...props }) {
  return <textarea className={cx(CONTROL, "min-h-28 resize-y", className)} {...props} />;
}

export function Select({ className = "", children, ...props }) {
  return (
    <select className={cx(CONTROL, "appearance-none", className)} {...props}>
      {children}
    </select>
  );
}

export function Checkbox({ label, className = "", ...props }) {
  return (
    <label className={cx("flex cursor-pointer items-center gap-2.5 text-sm text-ink", className)}>
      <input
        type="checkbox"
        className="size-4 rounded border-plum-300 text-accent focus:ring-accent"
        {...props}
      />
      {label}
    </label>
  );
}

export function Modal({ open, onClose, title, description, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;
  const sizes = { md: "max-w-lg", lg: "max-w-3xl", xl: "max-w-5xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-plum-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Isara ang dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cx(
          "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl",
          sizes[size],
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-plum-100 px-5 py-4 sm:px-6">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-ink">
              {title}
            </h2>
            {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted hover:bg-plum-50 hover:text-ink"
            aria-label="Isara"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer ? (
          <div className="flex flex-wrap justify-end gap-2 border-t border-plum-100 bg-plum-50/60 px-5 py-4 sm:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
