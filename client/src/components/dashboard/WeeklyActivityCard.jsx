import { CalendarDays } from "lucide-react";
import Card from "../ui/Card.jsx";
import { demoWeeklyActivity } from "../../data/demoData.js";

export default function WeeklyActivityCard() {
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
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-600">
            Aktibidad ngayong linggo
          </p>
          <h2 className="font-display mt-1 text-xl font-bold tracking-tight text-ink">
            Linggong pag-aaral
          </h2>
        </div>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-brand-700"
          aria-hidden="true"
        >
          <CalendarDays className="h-5 w-5" />
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
              <div className="flex h-20 w-full items-end rounded-lg bg-cream-100 p-0.5">
                <div
                  className={
                    day.minutes > 0
                      ? "w-full rounded-md bg-brand-500"
                      : "w-full rounded-md bg-cream-300"
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

      <div className="mt-4 grid grid-cols-3 divide-x divide-line rounded-xl border border-line bg-cream-50 py-2.5 text-center">
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

      <p className="mt-2.5 text-[10px] leading-relaxed text-muted">
        Halimbawang datos lamang. Hindi sinusukat ng HASA ang kakayahan sa
        pagbasa.
      </p>
    </Card>
  );
}
