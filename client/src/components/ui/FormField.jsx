import { cx } from "../../utils/cx.js";

export const fieldClasses =
  "w-full rounded-[15px] border border-[#9d9d9d] bg-canvas px-3.5 py-2.5 text-[15px] text-ink transition placeholder:text-[#717171] focus:border-plum-800 focus:outline-none disabled:cursor-not-allowed disabled:bg-cream-100 disabled:text-muted";

/**
 * Label + input + hint + error, nakaayos para sa screen reader.
 * Ang `children` ang input/textarea/select.
 */
export default function FormField({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  className,
  children,
}) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div className={cx("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
        {required ? (
          <span className="ml-1 text-rose-600" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="text-xs leading-relaxed text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="flex items-start gap-1 text-xs font-medium text-rose-700">
          <span aria-hidden="true">•</span>
          {error}
        </p>
      ) : null}
    </div>
  );
}
