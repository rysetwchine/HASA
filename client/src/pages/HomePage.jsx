import { Link } from "react-router";
import DemoNotice from "../components/ui/DemoNotice.jsx";
import { cx } from "../lib/cx.js";
import {
  demoStudent,
  demoLearningProgress,
  demoRecentAchievements,
  demoFigmaAnnouncements,
  getLevelProgress,
} from "../features/demo/demoData.js";

import mascotHello from "../assets/figma/mascot-hello.png";
import iconRosette from "../assets/figma/icon-trophy.png";
import iconTrophy from "../assets/figma/icon-medal.png";
import iconBookSparkle from "../assets/figma/icon-megaphone.png";
import iconMegaphone from "../assets/figma/icon-book.png";

/**
 * Dashboard — eksaktong anyo ng Figma frame "dashboard" (42:107):
 * Welcome row na may mascot, malaking module card (#3e3e75 r30),
 * Recent Achievements card, at Announcement card.
 */
const ACHIEVEMENT_ICONS = {
  trophy: { src: iconTrophy, tile: "bg-lav-200/60" },
  medal: { src: iconBookSparkle, tile: "bg-[#f2e3a9]/60" },
};

const ACHIEVEMENT_HEADER = { src: iconRosette };

export default function HomePage() {
  const progress = getLevelProgress(demoStudent.points);

  return (
    <div className="space-y-6 pt-2">
      {/* Maligayang pagbabalik + mascot */}
      <header>
        <div className="flex items-center gap-5">
          <h1 className="font-display text-[40px] font-bold leading-[1.15] tracking-tight text-ink sm:text-[48px] 2xl:text-[55px]">
            Welcome back, {demoStudent.displayName}!
          </h1>
          <img
            src={mascotHello}
            alt=""
            className="h-[70px] w-auto shrink-0 sm:h-[84px] 2xl:h-[104px]"
            aria-hidden="true"
          />
        </div>
        <p className="mt-1 text-[18px] font-light text-ink sm:text-[20px]">
          Let&rsquo;s continue your learning journey today
        </p>
      </header>

      {/* Continue Learning card (#3e3e75 r30) */}
      <section
        aria-labelledby="continue-learning-heading"
        className="rounded-[30px] bg-plum-800 px-6 py-8 shadow-card sm:px-11 sm:py-10"
      >
        <h2 id="continue-learning-heading" className="sr-only">
          Continue learning
        </h2>

        {/* Eyebrow pill */}
        <span className="inline-flex min-w-[220px] items-center justify-center rounded-[12px] bg-lav-400 px-7 py-1.5">
          <span className="text-[13px] font-semibold tracking-[0.08em] text-ink/90">
            CONTINUE LEARNING
          </span>
        </span>

        <p className="mt-5 max-w-[950px] text-[30px] font-bold leading-[1.2] tracking-tight text-white sm:text-[40px] 2xl:text-[48px]">
          {demoLearningProgress.module}
        </p>

        <p className="mt-4 text-[19px] text-[#c8c8c8] sm:text-[24px]">
          {demoLearningProgress.lesson}
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <div
              className="h-[15px] w-full overflow-hidden rounded-[5px] bg-plum-1000"
              role="progressbar"
              aria-valuenow={demoLearningProgress.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progreso ng aralin"
            >
              <div
                className="h-full rounded-[5px] bg-canvas"
                style={{ width: `${demoLearningProgress.percent}%` }}
              />
            </div>
            <p className="mt-3 text-[19px] text-white 2xl:text-[24px]">
              {demoLearningProgress.percent}%
              <span className="ml-1.5"> complete</span>
            </p>
          </div>

          <Link
            to={demoLearningProgress.to}
            className="inline-flex h-[56px] shrink-0 items-center justify-center rounded-[23px] bg-lav-400 px-9 text-[19px] font-medium text-ink transition-colors hover:bg-[#9b9bc7] sm:h-[64px] sm:text-[22px]"
          >
            {demoLearningProgress.cta}
          </Link>
        </div>
      </section>

      {/* Recent Achievements */}
      <section aria-labelledby="recent-achievements-heading">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={ACHIEVEMENT_HEADER.src}
              alt=""
              className="h-[42px] w-[42px]"
              aria-hidden="true"
            />
            <h2
              id="recent-achievements-heading"
              className="text-[20px] font-black tracking-tight text-ink sm:text-[22px]"
            >
              Recent Achievements
            </h2>
          </div>
          <Link
            to="/mga-nakamit"
            className="text-[15px] font-medium text-accent-strong hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="rounded-[25px] border border-ink bg-canvas px-6 py-7 shadow-card sm:px-10">
          <ul className="divide-ink/0">
            {demoRecentAchievements.map((item, index) => {
              const icon = ACHIEVEMENT_ICONS[item.icon] ?? ACHIEVEMENT_ICONS.trophy;
              return (
                <li
                  key={item.id}
                  className={cx(
                    "flex items-center gap-5 py-4",
                    index > 0 && "mt-2",
                  )}
                >
                  <span
                    className={cx(
                      "flex h-[56px] w-[54px] shrink-0 items-center justify-center rounded-[5px] border border-ink",
                      icon.tile,
                    )}
                    aria-hidden="true"
                  >
                    <img src={icon.src} alt="" className="h-[40px] w-[40px]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[21px] font-medium leading-tight text-ink sm:text-[25px]">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[15px] font-light text-ink">
                      {item.detail}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[21px] font-medium text-accent sm:text-[25px]">
                      {item.xpLabel}
                    </p>
                    <p className="mt-0.5 text-[13px] font-medium 2xl:text-[15px]">
                      {item.when}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Announcement */}
      <section aria-labelledby="announcement-heading">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={iconMegaphone}
              alt=""
              className="h-[42px] w-[42px]"
              aria-hidden="true"
            />
            <h2
              id="announcement-heading"
              className="text-[20px] font-black tracking-tight text-ink sm:text-[22px]"
            >
              Announcement
            </h2>
          </div>
          <button
            type="button"
            disabled
            title="Wala pang pahina ang mga anunsyo sa prototype"
            className="cursor-not-allowed text-[15px] font-semibold text-accent-strong/60"
          >
            View all
          </button>
        </div>

        <div className="rounded-[25px] border border-ink bg-canvas px-6 py-7 shadow-card sm:px-10">
          <ul>
            {demoFigmaAnnouncements.map((item, index) => (
              <li
                key={item.id}
                className={cx("flex items-center gap-5 py-4", index > 0 && "mt-2")}
              >
                <span
                  className={cx(
                    "flex h-[56px] w-[54px] shrink-0 items-center justify-center rounded-[5px] border border-ink",
                    item.isNew ? "bg-[#a591d8]/60" : "bg-[#ebe0e2]",
                  )}
                  aria-hidden="true"
                >
                  {item.isNew ? (
                    <span className="text-[18px] font-bold text-accent">NEW</span>
                  ) : null}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[18px] font-semibold leading-snug text-ink">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[13px] font-light text-ink sm:text-[15px]">
                    {item.detail}
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-ink/80">
                    {item.date}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="text-[11px] leading-relaxed text-muted">
        {/* Ipinapakita rin ang XP bilang halimbawa. */}
        Antas {progress.level} · {progress.xpIntoLevel.toLocaleString()} /{" "}
        {progress.xpForNextLevel.toLocaleString()} XP — halimbawa lamang lahat ng
        datos sa pahinang ito at hindi totoong datos ng mag-aaral.
      </p>

      <DemoNotice />
    </div>
  );
}
