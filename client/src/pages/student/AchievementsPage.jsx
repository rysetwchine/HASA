import PageHeader from "../../components/ui/PageHeader.jsx";
import DemoNotice from "../../components/ui/DemoNotice.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Card from "../../components/ui/Card.jsx";
import Chip from "../../components/ui/Chip.jsx";
import ProgressBar from "../../components/ui/ProgressBar.jsx";
import BadgeChip from "../../components/gamification/BadgeChip.jsx";
import { useProgress } from "../../app/ProgressProvider.jsx";
import {
  PROGRESS_STORAGE_NOTE,
  getBadgeStates,
} from "../../services/progressStore.js";
import iconHeaderRewards from "../../assets/images/rewards/icon-header-rewards.png";

const DATE_FORMAT = new Intl.DateTimeFormat("en-PH", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatEarnedDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return DATE_FORMAT.format(date);
}

/**
 * Rewards — ang mga sagisag ay tunay na nakabatay sa mga aktibidad na
 * natapos sa browser. Ang XP ng bawat badge ay ibinibigay nang isang beses
 * lamang kapag naunlock ito.
 */
export default function AchievementsPage() {
  const { progress } = useProgress();
  const badges = getBadgeStates(progress);
  const earned = badges.filter((badge) => badge.earned);
  const earnedBadgeXp = earned.reduce(
    (sum, badge) => sum + (Number(badge.xp) || 0),
    0,
  );
  const completionPercent = Math.round(
    (earned.length / Math.max(1, badges.length)) * 100,
  );

  return (
    <div className="space-y-6 pt-1">
      <PageHeader
        icon={iconHeaderRewards}
        kicker="YOUR COLLECTION"
        title="REWARDS"
        description="Celebrate the milestones you earn while learning."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">
                Koleksyon ng sagisag
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-ink">
                {earned.length} / {badges.length} nakamit
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Binubuksan ang bawat sagisag kapag natapos mo ang tamang
                bilang ng Practice activities.
              </p>
            </div>
            <Chip tone="brand">+{earnedBadgeXp} badge XP</Chip>
          </div>

          <ProgressBar
            className="mt-5"
            value={earned.length}
            max={badges.length}
            label="Mga nakamit na sagisag"
            tone="accent"
          />

          <p className="mt-3 text-xs leading-relaxed text-muted">
            Ang badge XP ay nakasama na sa iyong kabuuang XP. Hindi ito
            nabibigay muli kapag nag-retry.
          </p>
        </Card>

        <Card>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">
            Kalagayan
          </p>
          <p className="mt-1 text-3xl font-black tracking-tight text-plum-800">
            {completionPercent}%
          </p>
          <p className="mt-1 text-sm text-muted">
            ng koleksyon ang nabuksan
          </p>
          <div className="mt-4 space-y-1.5 text-xs text-muted">
            <p>
              Natapos na aktibidad:{" "}
              <span className="font-semibold text-ink">
                {Object.values(progress.completions).filter(
                  (completion) => completion.completed,
                ).length}
              </span>
            </p>
            <p>
              Kasalukuyang streak:{" "}
              <span className="font-semibold text-ink">
                {progress.streak} araw
              </span>
            </p>
          </div>
        </Card>
      </div>

      <section aria-labelledby="badges-heading" className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2
            id="badges-heading"
            className="font-display text-xl font-bold tracking-tight text-ink"
          >
            Mga sagisag
          </h2>
          <Chip tone="muted">Temporary local progress</Chip>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {badges.map((badge) => {
            const earnedDate = formatEarnedDate(badge.earnedAt);
            return (
              <li key={badge.id}>
                <BadgeChip
                  name={badge.name}
                  description={`${badge.description} (${badge.progress}/${badge.target})${
                    earnedDate ? ` · Nakamit ${earnedDate}` : ""
                  }`}
                  earned={badge.earned}
                  xp={badge.xp}
                  index={badge.index}
                />
              </li>
            );
          })}
        </ul>
      </section>

      <Alert variant="info" title="Temporary local persistence">
        {PROGRESS_STORAGE_NOTE}
      </Alert>

      <DemoNotice />
    </div>
  );
}
