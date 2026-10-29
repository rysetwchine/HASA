import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import PageHeader from "../../components/ui/PageHeader.jsx";
import DemoNotice from "../../components/ui/DemoNotice.jsx";
import Alert from "../../components/ui/Alert.jsx";
import ActivityPlayer from "../../components/practice/ActivityPlayer.jsx";
import { cx } from "../../utils/cx.js";
import { useProgress } from "../../app/ProgressProvider.jsx";
import { getLevelProgress } from "../../data/demoData.js";
import {
  FEATURED_ACTIVITY,
  PRACTICE_ACTIVITIES,
  getActivity,
} from "../../data/activityCatalog.js";
import { PROGRESS_STORAGE_NOTE } from "../../services/progressStore.js";

import iconHeaderPractice from "../../assets/images/practice/icon-header-practice.png";
import streakFire from "../../assets/images/practice/streak-fire.png";
import sparkleImg from "../../assets/images/practice/practice-trophy.png";
import featuredBadge from "../../assets/images/practice/practice-badge.png";
import questionIcon from "../../assets/images/practice/practice-q.png";
import xpIcon from "../../assets/images/practice/practice-xp.png";
import playArrow from "../../assets/images/practice/practice-play.png";
import moveToIcon from "../../assets/images/practice/challenge-check.png";

import challenge1 from "../../assets/images/practice/challenge-1.png";
import challenge2 from "../../assets/images/practice/challenge-2.png";
import challenge3 from "../../assets/images/practice/challenge-3.png";
import challenge4 from "../../assets/images/practice/challenge-4.png";
import challenge5 from "../../assets/images/practice/challenge-5.png";
import challenge6 from "../../assets/images/practice/challenge-6.png";

const CHALLENGE_ICONS = {
  "challenge-1": challenge1,
  "challenge-2": challenge2,
  "challenge-3": challenge3,
  "challenge-4": challenge4,
  "challenge-5": challenge5,
  "challenge-6": challenge6,
};

const FILTERS = [
  { id: "all", label: "Lahat ng Hamon" },
  { id: "quiz", label: "Pagsusulit" },
  { id: "skill", label: "Gawaing Kasanayan" },
];

/** Pang-uri ng klase mula sa metadata ng hamon. */
const KIND_LABEL = {
  Quiz: "Pagsusulit",
  "Skill Lab": "Gawaing Kasanayan",
};

/**
 * Pagsasanay (Practice) — anyo mula sa Figma frame "practice", na
 * inangkop sa mas maliit na desktop. Isang card = isang aktibidad na
 * tunay na nabubuksan sa ActivityPlayer.
 */
function ChallengeCard({ challenge, showReadyLavender, completion, onOpen }) {
  const icon = CHALLENGE_ICONS[challenge.icon] ?? challenge1;
  const isDarkAccent = challenge.accent === "#3e3e75";
  const band = isDarkAccent ? "#000000" : challenge.accent;
  const statusLabel = completion?.completed
    ? `Pinakamahusay ${completion.bestCorrect}/${completion.total}`
    : completion?.attempts
      ? `Subukan muli · best ${completion.bestCorrect}/${completion.total}`
      : "Handa";

  return (
    <article
      className="flex h-full flex-col rounded-2xl pt-[6px] shadow-card transition-transform motion-safe:hover:-translate-y-0.5"
      style={{
        backgroundColor: band,
        boxShadow: `0 0 0 1px ${challenge.accent}`,
      }}
    >
      <div
        className="flex h-full flex-col rounded-2xl bg-white px-4 pb-4 pt-2.5"
        style={{ boxShadow: `inset 0 0 0 1px ${challenge.accent}` }}
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className="flex h-[30px] w-[34px] items-center justify-center rounded-md bg-chip-cool/60"
            aria-hidden="true"
          >
            <img src={icon} alt="" className="h-[22px] w-[22px] object-contain" />
          </span>
          {challenge.starred ? (
            <span
              className="pt-0.5 text-[13px] leading-none text-[#555555]"
              aria-hidden="true"
            >
              ★
            </span>
          ) : null}
        </div>

        <p
          className="mt-2.5 text-[10px] font-bold uppercase leading-none tracking-wide"
          style={{ color: challenge.accent }}
        >
          {KIND_LABEL[challenge.kind] ?? challenge.kind}
        </p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.4em] text-[14px] font-semibold leading-snug text-ink">
          {challenge.title}
        </h3>
        <p className="mt-1 text-[10.5px] font-semibold text-[#555555]">
          {challenge.detail}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span
            className={cx(
              "truncate text-[10px] font-semibold",
              showReadyLavender ? "text-lav-400" : "text-[#555555]",
            )}
          >
            {statusLabel}
          </span>
          <button
            type="button"
            onClick={() => onOpen(challenge.id)}
            aria-label={`Laruin ang ${challenge.title}`}
            className="flex h-[26px] shrink-0 items-center gap-1 rounded-md px-2.5 text-[10.5px] font-bold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            style={{
              backgroundColor: isDarkAccent
                ? "rgb(113 113 113 / 0.31)"
                : `${challenge.accent}8c`,
              color: challenge.accent,
            }}
          >
            Laruin
            {challenge.starred ? (
              <img
                src={playArrow}
                alt=""
                className="h-[9px] w-[9px]"
                aria-hidden="true"
              />
            ) : null}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ActivityPage() {
  const [filter, setFilter] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const { progress } = useProgress();
  const level = getLevelProgress(progress.xp);
  const xpPercent = Math.min(
    100,
    Math.round((level.xpIntoLevel / level.xpForNextLevel) * 100),
  );

  const selectedId = searchParams.get("activity");
  const selectedActivity = getActivity(selectedId);

  const challenges = useMemo(() => {
    if (filter === "quiz") {
      return PRACTICE_ACTIVITIES.filter((activity) => activity.kind === "Quiz");
    }
    if (filter === "skill") {
      return PRACTICE_ACTIVITIES.filter(
        (activity) => activity.kind === "Skill Lab",
      );
    }
    return PRACTICE_ACTIVITIES;
  }, [filter]);

  function openActivity(activityId) {
    const next = new URLSearchParams(searchParams);
    next.set("activity", activityId);
    setSearchParams(next);
  }

  function closeActivity() {
    const next = new URLSearchParams(searchParams);
    next.delete("activity");
    setSearchParams(next, { replace: true });
  }

  return (
    <div className="space-y-5 pt-1">
      <PageHeader
        icon={iconHeaderPractice}
        kicker="Arena ng Pagsasanay"
        title="PAGSASANAY"
        description="Maglaro habang nag-aaral ng Araling Panlipunan at panatilihing buhay ang iyong sunod-sunod na araw."
      />

      {selectedId && !selectedActivity ? (
        <Alert variant="warning" title="Hindi mahanap ang aktibidad">
          <p>
            Wala sa prototype ang aktibidad na “{selectedId}”. Pumili na lang
            mula sa mga card sa ibaba.
          </p>
          <button
            type="button"
            onClick={closeActivity}
            className="mt-2 rounded-lg border border-gold-strong/50 bg-white px-3 py-1.5 text-xs font-semibold text-brown hover:bg-gold-soft/40"
          >
            Isara ang mensahe
          </button>
        </Alert>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Sunod-sunod na araw */}
        <section className="relative overflow-hidden rounded-2xl bg-card-cool px-5 pb-5 pt-4 sm:px-7">
          <img
            src={sparkleImg}
            alt=""
            className="pointer-events-none absolute right-1 top-4 h-[72px] w-auto opacity-90"
            aria-hidden="true"
          />

          <p className="flex flex-wrap items-center gap-2 text-[11px] font-bold tracking-wide text-plum-700">
            <img
              src={streakFire}
              alt=""
              className="h-[13px] w-[13px]"
              aria-hidden="true"
            />
            SUNOD-SUNOD NA ARAW
            <span className="pl-1">{progress.streak} ARAW</span>
          </p>

          {/* pr-20: nakalaan ang puwang para sa pandekorasyong tropeo sa kanan
              upang hindi ito magpatong sa teksto kahit makitid ang card. */}
          <h2 className="mt-2.5 max-w-[360px] pr-20 text-[22px] font-bold leading-tight tracking-tight text-plum-700 sm:text-[26px]">
            Handa ka na ba sa mabilis na pagsasanay ng isip?
          </h2>
          <p className="mt-1.5 max-w-[340px] pr-16 text-[12px] leading-relaxed text-muted-faint">
            Pumili ng hamon, kumita ng XP, at panatilihing buhay ang iyong
            sunod-sunod na araw.
          </p>

          <div className="mt-5 flex justify-start sm:justify-end">
            <div className="w-full max-w-[220px]">
              <div className="flex items-end justify-between">
                <span className="text-[10px] font-bold text-lav-400">
                  Antas {level.level}
                </span>
                <span className="text-[10px] font-bold text-accent">
                  {level.xpIntoLevel.toLocaleString()} XP
                </span>
              </div>
              <div
                className="mt-1 h-2 overflow-hidden rounded-[4px] bg-[#c4c4c4]"
                role="progressbar"
                aria-valuenow={xpPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`XP para sa antas ${level.level + 1}`}
              >
                <div
                  className="h-full rounded-[4px] bg-plum-800 transition-[width] duration-500 motion-reduce:transition-none"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <p className="mt-1 text-right text-[10px] text-[#555555]">
                {level.xpToNext} XP para sa antas {level.level + 1}
              </p>
            </div>
          </div>
        </section>

        {/* Tampok na hamon */}
        <section className="relative overflow-hidden rounded-2xl bg-plum-950 px-5 pb-5 pt-5 sm:px-7">
          <div
            className="pointer-events-none absolute -bottom-24 -right-14 h-[220px] w-[220px] rounded-full opacity-70"
            style={{
              background: "linear-gradient(160deg, #d3a24e, #57451f)",
              WebkitMask:
                "radial-gradient(closest-side, transparent 66%, black 68%)",
              mask: "radial-gradient(closest-side, transparent 66%, black 68%)",
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-32 -right-20 h-[280px] w-[280px] rounded-full opacity-40"
            style={{
              background: "linear-gradient(160deg, #d3a24e, #57451f)",
              WebkitMask:
                "radial-gradient(closest-side, transparent 80%, black 82%)",
              mask: "radial-gradient(closest-side, transparent 80%, black 82%)",
            }}
            aria-hidden="true"
          />

          <img
            src={featuredBadge}
            alt=""
            className="h-10 w-10 rounded-lg"
            aria-hidden="true"
          />

          <h2 className="mt-3 text-[18px] font-black leading-tight tracking-tight text-gold sm:text-[20px]">
            {FEATURED_ACTIVITY.title}
          </h2>
          <p className="mt-1.5 max-w-[300px] text-[12px] leading-relaxed text-white">
            {FEATURED_ACTIVITY.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <img
                src={questionIcon}
                alt=""
                className="h-4 w-4 rounded-full"
                aria-hidden="true"
              />
              <span className="text-[11px] font-semibold text-gold">
                {FEATURED_ACTIVITY.questions.length} Tanong
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <img
                src={xpIcon}
                alt=""
                className="h-4 w-4"
                aria-hidden="true"
              />
              <span className="text-[11px] font-semibold text-gold">
                +{FEATURED_ACTIVITY.xp} XP
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => openActivity(FEATURED_ACTIVITY.id)}
            className="mt-4 flex h-9 items-center justify-between gap-3 rounded-lg bg-gold px-3.5 text-[11.5px] font-semibold text-plum-800 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-plum-950"
          >
            Laruin ang tampok na hamon
            <img
              src={playArrow}
              alt=""
              className="h-2.5 w-2.5"
              aria-hidden="true"
            />
          </button>
        </section>
      </div>

      {/* Piliin ang susunod na hamon + salaan */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <img
            src={moveToIcon}
            alt=""
            className="h-5 w-5 rounded-full"
            aria-hidden="true"
          />
          <h2 className="text-[17px] font-bold text-plum-800 sm:text-[19px]">
            Piliin ang susunod na hamon
          </h2>
        </div>

        <div
          role="group"
          aria-label="Salain ang mga hamon"
          className="flex items-center gap-1 rounded-xl bg-[#d5d5d5] p-1.5"
        >
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
              className={cx(
                "rounded-lg px-2.5 py-1.5 text-[11.5px] font-bold transition-colors",
                filter === id
                  ? "border border-plum-700 bg-lav-400 text-white"
                  : "text-muted-faint hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge, index) => (
          <li key={challenge.id} className="min-w-0">
            <ChallengeCard
              challenge={challenge}
              completion={progress.completions[challenge.id]}
              showReadyLavender={filter === "all" && index < 2}
              onOpen={openActivity}
            />
          </li>
        ))}
      </ul>

      <p className="text-[11px] leading-relaxed text-muted">
        {PROGRESS_STORAGE_NOTE}
      </p>

      <DemoNotice />

      {selectedActivity ? (
        <ActivityPlayer
          key={selectedActivity.id}
          activity={selectedActivity}
          onClose={closeActivity}
        />
      ) : null}
    </div>
  );
}
