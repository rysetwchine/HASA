import { useMemo, useState } from "react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import DemoNotice from "../../components/ui/DemoNotice.jsx";
import { cx } from "../../utils/cx.js";
import { demoChallenges } from "../../data/demoData.js";

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
  { id: "all", label: "All Challenges" },
  { id: "quiz", label: "Quiz" },
  { id: "skill", label: "Skill lab" },
];

/**
 * Practice — eksakto sa Figma frame "practice" (65:5):
 * Daily Streak card (#dcd7eb r20), featured na "HISTORY HOT SEAT"
 * (#291f47 r20 na may gintong accent), at anim na challenge card.
 */
function ChallengeCard({ challenge, showReadyLavender }) {
  const icon = CHALLENGE_ICONS[challenge.icon] ?? challenge1;
  const isDarkAccent = challenge.accent === "#3e3e75";
  const band = isDarkAccent ? "#000000" : challenge.accent;

  return (
    <article
      className="rounded-[25px] px-0 pt-[7px] shadow-card"
      style={{
        backgroundColor: band,
        boxShadow: `0 0 0 1px ${challenge.accent}`,
      }}
    >
      <div
        className="rounded-[25px] bg-white px-6 pb-6 pt-3"
        style={{ boxShadow: `inset 0 0 0 1px ${challenge.accent}` }}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className="flex h-[36px] w-[42px] items-center justify-center rounded-[6px] bg-chip-cool/60"
            aria-hidden="true"
          >
            <img src={icon} alt="" className="h-[28px] w-[28px] object-contain" />
          </span>
          {challenge.starred ? (
            <span className="pr-1 text-[15px] leading-none text-[#555555]" aria-hidden="true">
              ★
            </span>
          ) : null}
        </div>

        <p
          className="mt-3 text-[11px] font-bold leading-none"
          style={{ color: challenge.accent }}
        >
          {challenge.kind}
        </p>
        <h3 className="mt-1 text-[18px] font-semibold leading-snug text-ink">
          {challenge.title}
        </h3>
        <p className="mt-1 text-[11px] font-semibold text-[#555555]">
          {challenge.detail}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span
            className={cx(
              "text-[10.5px] font-semibold",
              showReadyLavender ? "text-lav-400" : "text-[#555555]",
            )}
          >
            Ready
          </span>
          <button
            type="button"
            disabled
            title="Hindi pa available ang mga laro sa prototype"
            className="flex h-[25px] cursor-not-allowed items-center gap-1 rounded-[7px] px-3 text-[10.5px] font-bold"
            style={{
              backgroundColor: isDarkAccent ? "rgb(113 113 113 / 0.31)" : `${challenge.accent}8c`,
              color: challenge.accent,
            }}
          >
            Play now
            {challenge.starred ? (
              <img src={playArrow} alt="" className="h-[10px] w-[10px]" aria-hidden="true" />
            ) : null}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ActivityPage() {
  const [filter, setFilter] = useState("all");

  const challenges = useMemo(() => {
    if (filter === "quiz") {
      return demoChallenges.filter((c) => c.kind === "Quiz");
    }
    if (filter === "skill") {
      return demoChallenges.filter((c) => c.kind === "Skill Lab");
    }
    return demoChallenges;
  }, [filter]);

  return (
    <div className="space-y-6 pt-1">
      <PageHeader
        icon={iconHeaderPractice}
        kicker="Practice Arena"
        title="PRACTICE"
        description="Play your way through Araling Panlipunan and build your streak."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* DAILY STREAK card */}
        <section className="relative overflow-hidden rounded-[20px] bg-card-cool px-7 pb-8 pt-6 sm:px-10">
          <img
            src={sparkleImg}
            alt=""
            className="pointer-events-none absolute right-2 top-6 h-[110px] w-auto opacity-90"
            aria-hidden="true"
          />

          <p className="flex items-center gap-2 text-[12px] font-bold tracking-wide text-plum-700">
            <img
              src={streakFire}
              alt=""
              className="h-[15px] w-[15px]"
              aria-hidden="true"
            />
            DAILY STREAK
            <span className="pl-3">4 DAYS</span>
          </p>

          <h2 className="mt-4 max-w-[420px] text-[34px] font-bold leading-[1.15] tracking-tight text-plum-700 sm:text-[40px]">
            Ready for a quick
            <br />
            brain boost?
          </h2>
          <p className="mt-3 max-w-[380px] text-[13px] leading-relaxed text-muted-faint">
            Pick a challenge, earn XP, and keep your learning streak alive.
          </p>

          {/* XP bar sa ilalim na kanan */}
          <div className="mt-8 flex justify-end">
            <div className="w-[240px]">
              <div className="flex items-end justify-between">
                <span className="text-[10px] font-bold text-lav-400">Level 4</span>
                <span className="text-[10px] font-bold text-accent">1,200 XP</span>
              </div>
              <div
                className="mt-1 h-2 overflow-hidden rounded-[5px] bg-[#c4c4c4]"
                role="progressbar"
                aria-valuenow={80}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="XP sa antas 5"
              >
                <div className="h-full rounded-[5px] bg-plum-800" style={{ width: "80%" }} />
              </div>
              <p className="mt-1 text-right text-[10px] text-[#555555]">
                300 XP to level 5
              </p>
            </div>
          </div>
        </section>

        {/* HISTORY HOT SEAT (featured) */}
        <section className="relative overflow-hidden rounded-[20px] bg-plum-950 px-7 pb-8 pt-7 sm:px-9">
          {/* mga palamuting singsing */}
          <div
            className="pointer-events-none absolute -right-16 -bottom-28 h-[300px] w-[300px] rounded-full opacity-70"
            style={{
              background: "linear-gradient(160deg, #d3a24e, #57451f)",
              WebkitMask: "radial-gradient(closest-side, transparent 66%, black 68%)",
              mask: "radial-gradient(closest-side, transparent 66%, black 68%)",
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-24 -bottom-36 h-[380px] w-[380px] rounded-full opacity-40"
            style={{
              background: "linear-gradient(160deg, #d3a24e, #57451f)",
              WebkitMask: "radial-gradient(closest-side, transparent 80%, black 82%)",
              mask: "radial-gradient(closest-side, transparent 80%, black 82%)",
            }}
            aria-hidden="true"
          />

          <img
            src={featuredBadge}
            alt=""
            className="h-[55px] w-[57px] rounded-[10px]"
            aria-hidden="true"
          />

          <h2 className="mt-6 text-[24px] font-black tracking-tight text-gold">
            HISTORY HOT SEAT
          </h2>
          <p className="mt-2 max-w-[300px] text-[12.5px] leading-relaxed text-white">
            Can you answer 5 questions before the timer runs out?
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5">
              <img
                src={questionIcon}
                alt=""
                className="h-[20px] w-[20px] rounded-full"
                aria-hidden="true"
              />
              <span className="text-[11.5px] font-semibold text-gold">
                5 Questions
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <img
                src={xpIcon}
                alt=""
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              />
              <span className="text-[11.5px] font-semibold text-gold">+50 XP</span>
            </span>
          </div>

          <button
            type="button"
            disabled
            title="Hindi pa available ang mga laro sa prototype"
            className="mt-7 flex h-[31px] cursor-not-allowed items-center justify-between rounded-[10px] bg-gold px-4 text-[11px] font-semibold text-plum-800"
          >
            Play featured challange
            <img src={playArrow} alt="" className="h-2.5 w-2.5" aria-hidden="true" />
          </button>
        </section>
      </div>

      {/* Choose your next move + filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img
            src={moveToIcon}
            alt=""
            className="h-[25px] w-[25px] rounded-full"
            aria-hidden="true"
          />
          <h2 className="text-[22px] font-bold text-plum-800 sm:text-[23px]">
            Choose your next move
          </h2>
        </div>

        <div
          role="group"
          aria-label="I-filter ang mga hamon"
          className="flex items-center gap-1 rounded-[15px] bg-[#d5d5d5] p-2"
        >
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
              className={cx(
                "rounded-[10px] px-4 py-2 text-[12px] font-bold transition-colors",
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

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge, index) => (
          <li key={challenge.id}>
            <ChallengeCard
              challenge={challenge}
              showReadyLavender={filter === "all" && index < 2}
            />
          </li>
        ))}
      </ul>

      <DemoNotice />
    </div>
  );
}
