import {
  ArrowUpRight,
  Award,
  BookOpenCheck,
  CalendarDays,
  Compass,
  Footprints,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";
import Card from "../ui/Card.jsx";
import Chip from "../ui/Chip.jsx";
import { buttonClasses } from "../ui/Button.jsx";
import { demoBadges } from "../../features/demo/demoData.js";

const MONTHS = [
  "Ene",
  "Peb",
  "Mar",
  "Abr",
  "May",
  "Hun",
  "Hul",
  "Ago",
  "Set",
  "Okt",
  "Nob",
  "Dis",
];

const ICONS = [Footprints, BookOpenCheck, Compass, Sparkles, Award];

function formatDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-");
  const monthLabel = MONTHS[Number(month) - 1];
  if (!monthLabel || !day || !year) return value;
  return `${monthLabel} ${Number(day)}, ${year}`;
}

export default function RecentAchievementsCard({ badges = demoBadges }) {
  const earned = [...badges]
    .filter((badge) => badge.earned)
    .sort((a, b) => (b.earnedAt ?? "").localeCompare(a.earnedAt ?? ""));

  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-600">
            Recent Achievements
          </p>
          <h2 className="font-display mt-1 text-xl font-bold tracking-tight text-ink">
            Mga kamakailang nakamit
          </h2>
        </div>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gold-100 text-gold-700"
          aria-hidden="true"
        >
          <Award className="h-5 w-5" />
        </span>
      </div>

      {earned.length > 0 ? (
        <ul className="mt-4 space-y-2.5">
          {earned.map((badge, index) => {
            const Icon = ICONS[index % ICONS.length] ?? Award;
            const date = formatDate(badge.earnedAt);

            return (
              <li
                key={badge.id}
                className="flex items-start gap-3 rounded-2xl border border-cream-200 bg-cream-50 p-3"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-700"
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-sm font-semibold text-ink">
                      {badge.name}
                    </p>
                    {badge.xp ? (
                      <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-bold text-gold-700">
                        +{badge.xp} XP
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">
                    {badge.description}
                  </p>
                  {date ? (
                    <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-muted">
                      <CalendarDays className="h-3 w-3" aria-hidden="true" />
                      <time dateTime={badge.earnedAt}>{date}</time>
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-cream-300 bg-cream-50 px-4 py-8 text-center">
          <Award className="h-8 w-8 text-brand-300" aria-hidden="true" />
          <p className="mt-2 text-sm font-semibold text-ink">
            Wala pang nakamit
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Kumpletuhin ang isang aralin para makakuha ng unang sagisag.
          </p>
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
        <Chip tone="muted">
          {earned.length}/{badges.length} nakamit
        </Chip>
        <Link
          to="/mga-nakamit"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800"
        >
          Tingnan lahat ng nakamit
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <Link
        to="/pag-unlad"
        className={buttonClasses({
          variant: "secondary",
          size: "sm",
          className: "mt-3 w-full",
        })}
      >
        Buksan ang aking pag-unlad
      </Link>
    </Card>
  );
}
