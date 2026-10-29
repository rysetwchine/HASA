import { useState } from "react";
import { Link } from "react-router";
import {
  Award,
  CheckCircle2,
  Flame,
  History,
  ListChecks,
  RotateCcw,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import DemoNotice from "../../components/ui/DemoNotice.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Card from "../../components/ui/Card.jsx";
import Chip from "../../components/ui/Chip.jsx";
import ProgressBar from "../../components/ui/ProgressBar.jsx";
import Modal from "../../components/ui/Modal.jsx";
import Button from "../../components/ui/Button.jsx";
import { useProgress } from "../../app/ProgressProvider.jsx";
import { getLevelProgress } from "../../data/demoData.js";
import {
  PROGRESS_STORAGE_NOTE,
  getBadgeStates,
  getCompletedActivities,
  getXpBreakdown,
} from "../../services/progressStore.js";

const DATE_FORMAT = new Intl.DateTimeFormat("en-PH", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatDate(value) {
  if (!value) return "Walang petsa";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Walang petsa";
  return DATE_FORMAT.format(date);
}

/**
 * Progress — lokal na XP, streak, best scores, at kasaysayan ng aktibidad.
 * Malinaw na nakasaad na temporaryong localStorage ang persistence.
 */
export default function ProgressPage() {
  const { progress, resetProgress, storageAvailable } = useProgress();
  const [resetOpen, setResetOpen] = useState(false);
  const level = getLevelProgress(progress.xp);
  const badges = getBadgeStates(progress);
  const earnedBadges = badges.filter((badge) => badge.earned);
  const completedActivities = getCompletedActivities(progress);
  const xpBreakdown = getXpBreakdown(progress);
  const history = [...progress.history].reverse();
  const levelPercent = Math.min(
    100,
    Math.round((level.xpIntoLevel / level.xpForNextLevel) * 100),
  );

  return (
    <div className="space-y-6 pt-1">
      <PageHeader
        icon={<TrendingUp className="h-12 w-12" strokeWidth={2.5} />}
        kicker="IYONG PAGLALAKBAY"
        title="AKING PAG-UNLAD"
        description="Tingnan ang iyong XP, streak, at mga natapos na aktibidad."
      />

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-600">
              Iyong Antas
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-3">
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
                Antas {level.level}
              </h2>
              <span className="text-sm font-semibold text-muted">
                {level.xpIntoLevel.toLocaleString()} /{" "}
                {level.xpForNextLevel.toLocaleString()} XP
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              {level.xpToNext.toLocaleString()} XP pa para sa Antas{" "}
              {level.level + 1}.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Chip tone="brand">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              +{xpBreakdown.activityXp + xpBreakdown.badgeXp} XP mula sa Pagsasanay
            </Chip>
            <button
              type="button"
              onClick={() => setResetOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-line-dark hover:text-ink"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              I-reset ang pag-unlad
            </button>
          </div>
        </div>

        <ProgressBar
          className="mt-5"
          value={levelPercent}
          max={100}
          label={`XP sa Antas ${level.level}`}
          tone="brand"
        />

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-canvas/60 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
              Panimulang Demo XP
            </p>
            <p className="mt-1 text-lg font-bold text-ink">
              {xpBreakdown.startingXp.toLocaleString()} XP
            </p>
          </div>
          <div className="rounded-xl border border-line bg-canvas/60 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
              Mula sa mga aktibidad
            </p>
            <p className="mt-1 text-lg font-bold text-ink">
              {xpBreakdown.activityXp.toLocaleString()} XP
            </p>
          </div>
          <div className="rounded-xl border border-line bg-canvas/60 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
              Mula sa mga badge
            </p>
            <p className="mt-1 text-lg font-bold text-ink">
              {xpBreakdown.badgeXp.toLocaleString()} XP
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">
            <Flame className="h-4 w-4 text-gold-strong" aria-hidden="true" />
            Sunod-sunod na Araw
          </p>
          <p className="mt-2 text-3xl font-black tracking-tight text-plum-800">
            {progress.streak} araw
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Dinadagdagan ng isang araw kapag may natapos na aktibidad ngayong
            araw.
          </p>
        </Card>

        <Card>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">
            <ListChecks className="h-4 w-4" aria-hidden="true" />
            Natapos
          </p>
          <p className="mt-2 text-3xl font-black tracking-tight text-plum-800">
            {completedActivities.length}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Natapos na gawain sa Pagsasanay. Ang muling pagsubok ay hindi nagbibigay ng
            bagong XP.
          </p>
        </Card>

        <Card>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">
            <Award className="h-4 w-4" aria-hidden="true" />
            Mga badge
          </p>
          <p className="mt-2 text-3xl font-black tracking-tight text-plum-800">
            {earnedBadges.length} / {badges.length}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Ang bawat badge ay may one-time XP bonus.
          </p>
        </Card>
      </div>

      <section aria-labelledby="best-scores-heading" className="space-y-3">
        <h2
          id="best-scores-heading"
          className="font-display text-xl font-bold tracking-tight text-ink"
        >
          Pinakamahusay na Marka
        </h2>

        {completedActivities.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {completedActivities.map((completion) => (
              <li key={completion.id}>
                <Card className="h-full">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-snug text-ink">
                        {completion.title}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {completion.attempts} pagtatangka ·{" "}
                        {completion.bestCorrect}/{completion.total} tamang sagot
                      </p>
                    </div>
                    <Chip tone="success">{completion.bestPercent}%</Chip>
                  </div>
                  <p className="mt-3 text-[10px] text-muted">
                    Unang natapos: {formatDate(completion.completedAt)}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <Card>
            <div className="flex flex-col items-center rounded-xl border border-dashed border-line bg-cream-50/60 px-5 py-8 text-center">
              <ListChecks className="h-8 w-8 text-lav-400" aria-hidden="true" />
              <p className="mt-2 text-sm font-semibold text-ink">
                Wala pang natapos na aktibidad
              </p>
              <p className="mt-1 max-w-md text-xs leading-relaxed text-muted">
                Pumunta sa Pagsasanay at tapusin ang unang hamon para
                lumabas dito ang pinakamahusay na marka mo.
              </p>
              <Link
                to="/aktibidad"
                className="mt-4 rounded-xl bg-plum-800 px-4 py-2 text-sm font-semibold text-canvas hover:bg-plum-900"
              >
                Pumunta sa Pagsasanay
              </Link>
            </div>
          </Card>
        )}
      </section>

      <section aria-labelledby="history-heading" className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2
            id="history-heading"
            className="font-display text-xl font-bold tracking-tight text-ink"
          >
            Kasaysayan ng aktibidad
          </h2>
          <Chip tone="muted">
            <History className="h-3 w-3" aria-hidden="true" />
            {history.length} pagtatangka
          </Chip>
        </div>

        {history.length > 0 ? (
          <Card className="p-0">
            <ul className="divide-y divide-line">
              {history.map((entry) => (
                <li
                  key={entry.id ?? `${entry.activityId}-${entry.completedAt}`}
                  className="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5"
                >
                  <span
                    className={
                      entry.passed
                        ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"
                        : "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700"
                    }
                    aria-hidden="true"
                  >
                    {entry.passed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">
                      {entry.title}
                    </p>
                    <p className="text-[11px] text-muted">
                      {formatDate(entry.completedAt)}
                      {entry.timedOut ? " · naubos ang oras" : ""}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-semibold text-ink">
                      {entry.correct}/{entry.total}
                    </span>
                    <Chip tone={entry.passed ? "success" : "warning"}>
                      {entry.percent}%
                    </Chip>
                    <Chip tone={entry.xpAwarded > 0 ? "brand" : "muted"}>
                      {entry.xpAwarded > 0
                        ? `+${entry.xpAwarded} XP`
                        : "Walang bagong XP"}
                    </Chip>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <Card>
            <p className="text-sm text-muted">
              Wala pang naitalang pagtatangka. Ang bawat submit at resulta ay
              lalabas dito.
            </p>
          </Card>
        )}
      </section>

      <Alert variant="info" title="Pansamantalang lokal na pag-save">
        {PROGRESS_STORAGE_NOTE}
      </Alert>

      <DemoNotice>
        Ang panimulang XP ay halimbawa; ang mga bagong XP at resulta ay galing
        sa iyong mga aktibidad sa browser na ito. Hindi ito totoong rekord ng
        mag-aaral at walang backend.
      </DemoNotice>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        size="sm"
        eyebrow="Imbakan ng browser"
        title="I-reset ang pag-unlad?"
        subtitle="Pansamantala lamang ito para sa prototype. Walang server na maaapektuhan."
      >
        <p className="text-sm leading-relaxed text-muted">
          Burahin ang XP, streak, mga badge, pinakamahusay na marka, at kasaysayan ng
          aktibidad na naka-save sa browser na ito. Hindi na ito maibabalik.
        </p>

        {storageAvailable ? null : (
          <Alert variant="warning" title="Naka-block ang storage" className="mt-3">
            Hindi maisave ang pag-unlad sa browser na ito, kaya wala ring
            maibabalik sa dating halaga.
          </Alert>
        )}

        <div className="mt-5 flex flex-wrap gap-2.5">
          <Button
            variant="danger"
            onClick={() => {
              resetProgress();
              setResetOpen(false);
            }}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Oo, i-reset
          </Button>
          <Button variant="secondary" onClick={() => setResetOpen(false)}>
            Kanselahin
          </Button>
        </div>
      </Modal>
    </div>
  );
}
