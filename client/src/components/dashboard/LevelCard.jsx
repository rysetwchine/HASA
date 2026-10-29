import { Flame, Sparkles } from "lucide-react";
import { cx } from "../../lib/cx.js";
import { demoStudent, getLevelProgress } from "../../features/demo/demoData.js";

/**
 * Antas/XP banner para sa dashboard.
 * Ang XP ay hinango sa 120 puntos ng halimbawang mag-aaral, kaya
 * malinaw na halimbawa lamang ito at hindi totoong pag-unlad.
 */
export default function LevelCard({ className }) {
  const progress = getLevelProgress(demoStudent.points);
  const remaining = progress.xpForNextLevel - progress.xpIntoLevel;
  const percent = Math.round(
    (progress.xpIntoLevel / progress.xpForNextLevel) * 100,
  );

  return (
    <section
      aria-labelledby="level-heading"
      className={cx(
        "relative overflow-hidden rounded-3xl border border-plum-800 bg-plum-900 px-5 py-5 text-white shadow-card sm:px-6",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-16 h-40 w-40 rounded-full bg-brand-500/30 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-gold-500/15 blur-2xl"
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="level-heading"
            className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-200"
          >
            Iyong antas
          </h2>
          <div className="mt-1 flex items-baseline gap-2.5">
            <p className="font-display text-3xl font-bold tracking-tight">
              Antas {progress.level}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/70">
              <Flame className="h-3.5 w-3.5 text-gold-500" aria-hidden="true" />
              {progress.totalXp} XP
            </span>
          </div>
          <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-white/40">
            <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
            Halimbawang XP ng prototype
          </p>
        </div>

        <div className="w-full sm:max-w-sm">
          <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-white/70">
            <span>
              {progress.xpIntoLevel} / {progress.xpForNextLevel} XP
            </span>
            <span>{remaining} XP para sa Antas {progress.level + 1}</span>
          </div>
          <div
            className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/15"
            role="progressbar"
            aria-valuenow={progress.xpIntoLevel}
            aria-valuemin={0}
            aria-valuemax={progress.xpForNextLevel}
            aria-label="XP patungo sa susunod na antas"
          >
            <div
              className="h-full rounded-full bg-gold-500 transition-[width] duration-500 motion-reduce:transition-none"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10px] leading-relaxed text-white/40">
            Batay sa 100 XP bawat antas. Hindi ito totoong tracking.
          </p>
        </div>
      </div>
    </section>
  );
}
