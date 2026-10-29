import { Check, Star } from "lucide-react";
import { cx } from "../../lib/cx.js";

export default function QuestStep({ step, number }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={cx(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          step.completed
            ? "bg-success text-emerald-700"
            : "bg-cream-100 text-muted",
        )}
        aria-hidden="true"
      >
        {step.completed ? <Check className="h-4 w-4" /> : number}
      </span>

      <div className="min-w-0 flex-1 rounded-xl border border-line bg-white p-3.5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-ink">
              Hakbang {number}: {step.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {step.instructions}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-bold text-gold-700">
            <Star className="h-3 w-3 fill-gold-500 text-gold-500" aria-hidden="true" />
            {step.points} puntos
          </span>
        </div>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide">
          {step.completed ? (
            <span className="text-emerald-700">Natapos</span>
          ) : (
            <span className="text-muted">Hindi pa tapos</span>
          )}
        </p>
      </div>
    </li>
  );
}
