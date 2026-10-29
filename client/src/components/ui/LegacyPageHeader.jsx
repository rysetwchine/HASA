export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display mt-1 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
