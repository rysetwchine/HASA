import { cx } from "../../lib/cx.js";

export default function WorkspaceStep({
  number,
  title,
  description,
  children,
  className,
}) {
  const titleId = `workspace-step-${number}`;

  return (
    <section
      aria-labelledby={titleId}
      className={cx(
        "rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6",
        className,
      )}
    >
      <div className="flex items-start gap-3.5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xs font-bold text-brand-700"
          aria-hidden="true"
        >
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id={titleId}
            className="text-lg font-bold leading-snug tracking-tight text-ink"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-4 sm:ml-[50px]">{children}</div>
    </section>
  );
}
