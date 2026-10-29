import { ArrowUpRight, Award } from "lucide-react";
import { Link } from "react-router";
import Card from "../ui/Card.jsx";
import Chip from "../ui/Chip.jsx";
import BadgeChip from "../gamification/BadgeChip.jsx";

export default function AchievementsPreview({ badges }) {
  const earned = badges.filter((badge) => badge.earned).length;

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">
            Aking mga Nakamit
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-ink">
            Mga sagisag na nakuha
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Chip tone="muted">
            {earned}/{badges.length}
          </Chip>
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-brand-700"
            aria-hidden="true"
          >
            <Award className="h-5 w-5" />
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {badges.map((badge, index) => (
          <BadgeChip key={badge.id} {...badge} index={index} compact />
        ))}
      </div>

      <Link
        to="/mga-nakamit"
        className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-semibold text-brand-700 hover:text-brand-800"
      >
        Tingnan lahat ng nakamit
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </Card>
  );
}
