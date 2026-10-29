import { Star } from "lucide-react";
import { cx } from "../../utils/cx.js";

export default function PointsPill({ points = 0, compact = false }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border border-gold-200 bg-gold-100 font-bold text-gold-700",
        compact ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
      )}
      aria-label={`${points} XP`}
    >
      <Star
        className={cx(
          "fill-gold-500 text-gold-500",
          compact ? "h-3.5 w-3.5" : "h-4 w-4",
        )}
        aria-hidden="true"
      />
      {points}
      {compact ? <span className="font-semibold">XP</span> : (
        <span className="font-medium text-gold-700">XP</span>
      )}
    </span>
  );
}
