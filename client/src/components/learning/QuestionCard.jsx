import { cx } from "../../lib/cx.js";

const LETTERS = ["A", "B", "C", "D", "E"];

/**
 * Presentational na tanong na multiple choice.
 * Sa Stage 1 ay walang pagsusuri — ang backend ang magsasabi kung tama.
 */
export default function QuestionCard({
  question,
  selectedIndex,
  onSelect,
  disabled = false,
  number,
}) {
  return (
    <fieldset className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
      <legend className="sr-only">
        {number ? `Tanong ${number}: ` : ""}
        {question.prompt}
      </legend>

      <div className="flex items-start gap-3">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700"
          aria-hidden="true"
        >
          {number}
        </span>
        <p className="text-sm font-semibold leading-relaxed text-ink sm:text-[15px]">
          {question.prompt}
        </p>
      </div>

      <div className="mt-4 space-y-2">
        {question.options.map((option, index) => {
          const id = `${question.id}-option-${index}`;
          const checked = selectedIndex === index;
          return (
            <label
              key={id}
              htmlFor={id}
              className={cx(
                "flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 text-sm transition-colors",
                checked
                  ? "border-brand-500 bg-brand-50/70 ring-1 ring-brand-500"
                  : "border-line bg-white hover:border-brand-200 hover:bg-cream-50",
                disabled ? "cursor-not-allowed opacity-70" : "",
              )}
            >
              <input
                id={id}
                type="radio"
                name={question.id}
                checked={checked}
                disabled={disabled}
                onChange={() => onSelect?.(index)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
              />
              <span
                className={cx(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold",
                  checked
                    ? "bg-brand-600 text-white"
                    : "bg-cream-100 text-muted",
                )}
                aria-hidden="true"
              >
                {LETTERS[index] ?? index + 1}
              </span>
              <span className="leading-relaxed text-ink/80">{option}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
