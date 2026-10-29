import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-line bg-white/50 px-6 py-10 text-center">
      <Icon className="h-9 w-9 text-lav-400" aria-hidden="true" />
      <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-md text-sm leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
