import { BookOpen, Check } from "lucide-react";
import { READING_LEVELS } from "../../lib/readingLevels.js";
import { cx } from "../../lib/cx.js";

/**
 * Pinipili ng mag-aaral ang antas. HINDI ito sinusukat ng HASA,
 * kaya ang tanong ay "gusto mong basahin", hindi "antas mo".
 */
export default function LevelPicker({
  value,
  onChange,
  disabled = false,
  name = "reading-level",
}) {
  return (
    <fieldset disabled={disabled} className="min-w-0 space-y-3">
      <legend className="text-sm font-semibold text-ink">
        Anong antas ang gusto mong basahin?
      </legend>
      <p className="text-xs leading-relaxed text-muted">
        Ikaw ang pumipili ng antas. Hindi sinusukat ng HASA ang iyong kakayahan
        sa pagbasa.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {READING_LEVELS.map((level) => {
          const checked = value === level.key;
          return (
            <label
              key={level.key}
              className={cx(
                "relative flex cursor-pointer flex-col rounded-2xl border p-4 transition-colors",
                checked
                  ? "border-brand-500 bg-brand-50/70 ring-1 ring-brand-500"
                  : "border-line bg-white hover:border-brand-300 hover:bg-cream-50",
                disabled ? "cursor-not-allowed opacity-60" : "",
              )}
            >
              <span className="flex items-start justify-between gap-2">
                <span
                  className={cx(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    checked
                      ? "bg-white text-brand-600 shadow-sm"
                      : "bg-cream-100 text-muted",
                  )}
                  aria-hidden="true"
                >
                  <BookOpen className="h-4 w-4" />
                </span>
                <input
                  type="radio"
                  name={name}
                  value={level.key}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => onChange?.(level.key)}
                  className="mt-1 h-4 w-4 accent-brand-600"
                />
              </span>
              <span className="mt-3 block text-sm font-semibold leading-snug text-ink">
                {level.label}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">
                {level.description}
              </span>
              {checked ? (
                <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-700">
                  <Check className="h-3 w-3" aria-hidden="true" />
                  Napili
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
