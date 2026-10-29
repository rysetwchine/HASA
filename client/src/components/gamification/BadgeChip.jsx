import {
  Award,
  BookOpenCheck,
  Check,
  Compass,
  Footprints,
  Lock,
  Sparkles,
} from "lucide-react";
import Chip from "../ui/Chip.jsx";
import { cx } from "../../lib/cx.js";

const BADGE_ICONS = [Footprints, BookOpenCheck, Compass, Sparkles, Award];

export default function BadgeChip({
  name,
  description,
  earned = false,
  xp,
  index = 0,
  compact = false,
  className,
}) {
  const Icon = BADGE_ICONS[index % BADGE_ICONS.length] ?? Award;

  return (
    <div
      className={cx(
        "flex items-start gap-3 rounded-2xl border transition-colors",
        compact ? "p-3" : "p-4",
        earned
          ? "border-cream-200 bg-cream-50 hover:border-brand-200 hover:shadow-card"
          : "border-dashed border-cream-300 bg-cream-50/50",
        className,
      )}
    >
      <span
        className={cx(
          "relative flex shrink-0 items-center justify-center rounded-2xl",
          compact ? "h-9 w-9" : "h-11 w-11",
          earned ? "bg-accent text-brand-700" : "bg-cream-200 text-muted/60",
        )}
      >
        <Icon
          className={compact ? "h-4 w-4" : "h-5 w-5"}
          aria-hidden="true"
        />
        <span
          className={cx(
            "absolute -bottom-1 -right-1 flex items-center justify-center rounded-full ring-2 ring-white",
            compact ? "h-3.5 w-3.5" : "h-4 w-4",
            earned
              ? "bg-emerald-500 text-white"
              : "bg-cream-300 text-muted",
          )}
          aria-hidden="true"
        >
          {earned ? (
            <Check className={compact ? "h-2 w-2" : "h-2.5 w-2.5"} />
          ) : (
            <Lock className={compact ? "h-2 w-2" : "h-2.5 w-2.5"} />
          )}
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className={cx("font-semibold text-ink", compact ? "text-xs" : "text-sm")}>
            {name}
          </p>
          <Chip
            tone={earned ? "success" : "muted"}
            className="px-2 py-0 text-[9px] uppercase tracking-wide"
          >
            {earned ? "Nakamit" : "Nakakandado"}
          </Chip>
          {xp ? (
            <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[9px] font-bold text-gold-700">
              +{xp} XP
            </span>
          ) : null}
        </div>
        <p
          className={cx(
            "mt-1 text-xs leading-relaxed text-muted",
            compact ? "line-clamp-2" : "",
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
