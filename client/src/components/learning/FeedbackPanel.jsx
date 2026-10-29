import { CheckCircle2, XCircle } from "lucide-react";
import { cx } from "../../utils/cx.js";

/**
 * Puna pagkatapos sagutin ang isang tanong.
 * Sa totoong app, galing ito sa server. Sa Stage 1, halimbawa lamang.
 */
export default function FeedbackPanel({ correct, explanation }) {
  const Icon = correct ? CheckCircle2 : XCircle;

  return (
    <div
      role="status"
      className={cx(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
        correct
          ? "border-emerald-200 bg-success text-emerald-900"
          : "border-rose-200 bg-rose-50 text-rose-900",
      )}
    >
      <Icon
        className={cx(
          "mt-0.5 h-5 w-5 shrink-0",
          correct ? "text-emerald-600" : "text-rose-600",
        )}
        aria-hidden="true"
      />
      <div className="leading-relaxed">
        <p className="font-semibold">{correct ? "Tama!" : "Hindi tama."}</p>
        {explanation ? <p className="mt-1">{explanation}</p> : null}
      </div>
    </div>
  );
}
