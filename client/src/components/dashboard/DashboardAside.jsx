import {
  ArrowUpRight,
  Award,
  CalendarDays,
  Compass,
} from "lucide-react";
import { Link } from "react-router";
import Card from "../ui/Card.jsx";
import Chip from "../ui/Chip.jsx";
import ProgressBar from "../ui/ProgressBar.jsx";
import { buttonClasses } from "../ui/Button.jsx";
import {
  demoBadges,
  demoQuests,
  demoWeeklyActivity,
} from "../../features/demo/demoData.js";

export default function DashboardAside() {
  const quest = demoQuests[0];
  const completedSteps = quest.steps.filter((step) => step.completed).length;
  const nextStep = quest.steps.find((step) => !step.completed);
  const earnedBadges = demoBadges.filter((badge) => badge.earned).length;
  const nextBadge = demoBadges.find((badge) => !badge.earned);

  const maxMinutes = Math.max(
    ...demoWeeklyActivity.map((day) => day.minutes),
    1,
  );
  const activeDays = demoWeeklyActivity.filter((day) => day.minutes > 0).length;
  const totalMinutes = demoWeeklyActivity.reduce(
    (sum, day) => sum + day.minutes,
    0,
  );
  const totalActivities = demoWeeklyActivity.reduce(
    (sum, day) => sum + day.activities,
    0,
  );

  return (
    <aside
      className="space-y-5 xl:sticky xl:top-6 xl:self-start"
      aria-label="Karagdagang impormasyon"
    >
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">
              Aktibidad Ngayong Linggo
            </p>
            <h2 className="mt-1 text-base font-bold tracking-tight text-ink">
              Linggong pag-aaral
            </h2>
          </div>
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-700"
            aria-hidden="true"
          >
            <CalendarDays className="h-4 w-4" />
          </span>
        </div>

        <ul
          className="mt-5 flex items-end justify-between gap-1.5"
          aria-label="Minuto ng aktibidad bawat araw"
        >
          {demoWeeklyActivity.map((day) => {
            const height =
              day.minutes === 0
                ? 4
                : Math.max(12, Math.round((day.minutes / maxMinutes) * 100));
            return (
              <li
                key={day.day}
                className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
              >
                <div className="flex h-16 w-full items-end rounded-lg bg-slate-100/80 p-0.5">
                  <div
                    className={
                      day.minutes > 0
                        ? "w-full rounded-md bg-brand-500"
                        : "w-full rounded-md bg-slate-200"
                    }
                    style={{ height: `${height}%` }}
                    title={`${day.day}: ${day.minutes} minuto`}
                  />
                </div>
                <span className="text-[9px] font-semibold text-muted">
                  {day.short}
                </span>
                <span className="sr-only">
                  {day.day}: {day.minutes} minuto, {day.activities} aktibidad
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 grid grid-cols-3 divide-x divide-line rounded-xl border border-line bg-canvas/60 py-2.5 text-center">
          <div className="px-1">
            <p className="text-base font-bold text-ink">{activeDays}</p>
            <p className="text-[9px] font-medium leading-tight text-muted">
              Araw aktibo
            </p>
          </div>
          <div className="px-1">
            <p className="text-base font-bold text-ink">{totalMinutes}</p>
            <p className="text-[9px] font-medium leading-tight text-muted">
              Minuto
            </p>
          </div>
          <div className="px-1">
            <p className="text-base font-bold text-ink">{totalActivities}</p>
            <p className="text-[9px] font-medium leading-tight text-muted">
              Aktibidad
            </p>
          </div>
        </div>

        <p className="mt-2.5 text-[10px] leading-relaxed text-slate-400">
          Halimbawang datos lamang. Hindi sinusukat ng HASA ang kakayahan sa
          pagbasa.
        </p>
      </Card>

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">
              Kasalukuyang Misyon
            </p>
            <h2 className="mt-1 text-base font-bold leading-snug tracking-tight text-ink">
              {quest.title}
            </h2>
          </div>
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-700"
            aria-hidden="true"
          >
            <Compass className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Chip tone="brand">Kasalukuyan</Chip>
          <span className="text-[10px] font-medium text-muted">
            {completedSteps} sa {quest.steps.length} hakbang
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">
          {nextStep?.instructions ?? quest.narrative}
        </p>

        <ProgressBar
          className="mt-4"
          value={completedSteps}
          max={quest.steps.length}
          label="Pag-unlad ng misyon"
        />

        <Link
          to="/misyon"
          className={buttonClasses({
            variant: "soft",
            size: "sm",
            className: "mt-4 w-full",
          })}
        >
          Buksan ang misyon
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </Card>

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">
              Mga Nakamit
            </p>
            <h2 className="mt-1 text-base font-bold tracking-tight text-ink">
              {earnedBadges} sa {demoBadges.length} sagisag
            </h2>
          </div>
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-700"
            aria-hidden="true"
          >
            <Award className="h-4 w-4" />
          </span>
        </div>

        <ProgressBar
          className="mt-4"
          value={earnedBadges}
          max={demoBadges.length}
          tone="accent"
          label="Mga sagisag na nakamit"
        />

        {nextBadge ? (
          <div className="mt-4 rounded-xl bg-canvas px-3 py-2.5">
            <p className="text-[9px] font-bold uppercase tracking-wide text-muted">
              Susunod na makakamit
            </p>
            <p className="mt-0.5 text-xs font-semibold text-ink">
              {nextBadge.name}
            </p>
            <p className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-muted">
              {nextBadge.description}
            </p>
          </div>
        ) : null}

        <Link
          to="/mga-nakamit"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800"
        >
          Tingnan ang lahat
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </Card>
    </aside>
  );
}
