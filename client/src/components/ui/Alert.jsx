import { CheckCircle2, Info, AlertTriangle, XCircle } from "lucide-react";
import { cx } from "../../utils/cx.js";

const VARIANTS = {
  info: {
    wrap: "border-plum-800/25 bg-lav-200/60 text-ink",
    icon: "text-accent-strong",
    Icon: Info,
  },
  success: {
    wrap: "border-success/40 bg-success/15 text-success-strong",
    icon: "text-success-strong",
    Icon: CheckCircle2,
  },
  warning: {
    wrap: "border-gold-strong/50 bg-gold-soft/60 text-brown",
    icon: "text-gold-strong",
    Icon: AlertTriangle,
  },
  error: {
    wrap: "border-rose-200 bg-rose-50 text-rose-900",
    icon: "text-danger",
    Icon: XCircle,
  },
};

export default function Alert({
  variant = "info",
  title,
  children,
  className,
}) {
  const { wrap, icon, Icon } = VARIANTS[variant] ?? VARIANTS.info;
  const isUrgent = variant === "error";

  return (
    <div
      role={isUrgent ? "alert" : "status"}
      className={cx(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
        wrap,
        className,
      )}
    >
      <Icon
        className={cx("mt-0.5 h-5 w-5 shrink-0", icon)}
        aria-hidden="true"
      />
      <div className="min-w-0 space-y-0.5">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
