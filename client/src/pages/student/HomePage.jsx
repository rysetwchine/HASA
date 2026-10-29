import { useState } from "react";
import { Link } from "react-router";
import DemoNotice from "../../components/ui/DemoNotice.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { cx } from "../../utils/cx.js";
import { useProgress } from "../../app/ProgressProvider.jsx";
import {
  demoFigmaAnnouncements,
  demoLearningProgress,
  getLevelProgress,
} from "../../data/demoData.js";
import { localDateKey } from "../../services/progressStore.js";
import { getLessons } from "../../services/lessonService.js";

import mascotHello from "../../assets/images/dashboard/mascot-hello.png";
import iconRosette from "../../assets/images/dashboard/icon-trophy.png";
import iconTrophy from "../../assets/images/dashboard/icon-medal.png";
import iconBookSparkle from "../../assets/images/dashboard/icon-megaphone.png";
import iconMegaphone from "../../assets/images/dashboard/icon-book.png";

/**
 * Pangunahing pahina (Dashboard) — anyo mula sa Figma frame "dashboard",
 * na inangkop sa mas maliit na desktop (1366×768).
 */
const ACHIEVEMENT_ICONS = {
  trophy: { src: iconTrophy, tile: "bg-lav-200/60" },
  medal: { src: iconBookSparkle, tile: "bg-[#f2e3a9]/60" },
};

const ACHIEVEMENT_HEADER = { src: iconRosette };

const DATE_FORMAT = new Intl.DateTimeFormat("fil-PH", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function relativeDay(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const today = localDateKey();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = localDateKey(yesterdayDate);
  const key = localDateKey(date);

  if (key === today) return "NGAYON";
  if (key === yesterday) return "KAHAPON";
  return DATE_FORMAT.format(date);
}

export default function HomePage() {
  const { progress } = useProgress();
  const levelProgress = getLevelProgress(progress.xp);
  const [announcementsOpen, setAnnouncementsOpen] = useState(false);

  const recentActivities = [...progress.history]
    .slice(-2)
    .reverse()
    .map((entry) => ({
      id: entry.id,
      icon: entry.passed ? "trophy" : "medal",
      title: entry.title,
      detail: `${entry.correct}/${entry.total || entry.correct} tamang sagot · ${
        entry.percent
      }%${entry.xpAwarded > 0 ? "" : " · walang bagong XP"}`,
      xpLabel: entry.xpAwarded > 0 ? `+${entry.xpAwarded} XP` : "Walang XP",
      when: relativeDay(entry.completedAt),
    }));

  const lessons = getLessons(progress);
  const activeLesson =
    lessons.find((lesson) => lesson.state.key === "in-progress") ??
    lessons.find((lesson) => lesson.state.key === "not-started") ??
    lessons[0];

  const bannerPercent =
    activeLesson.state.key === "completed"
      ? 100
      : (activeLesson.bestPercent ?? 0);
  const bannerLabel =
    activeLesson.state.key === "completed"
      ? "Natapos na ang araling ito sa browser na ito"
      : activeLesson.bestPercent === null
        ? "Wala pang pagtatangka sa pagsusulit — simulan ang aralin"
        : `${bannerPercent}% ang pinakamahusay na sagot sa pagsusulit ng aralin`;

  return (
    <div className="space-y-4 pt-1">
      {/* Maligayang pagbabalik */}
      <header className="flex items-center gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-[32px] 2xl:text-[36px]">
            Maligayang pagbabalik, Siri!
          </h1>
          <p className="mt-0.5 text-[13.5px] font-light text-ink sm:text-[15px]">
            Ipagpatuloy natin ang iyong pag-aaral ngayong araw
          </p>
        </div>
        <img
          src={mascotHello}
          alt=""
          className="h-[52px] w-auto shrink-0 sm:h-[64px]"
          aria-hidden="true"
        />
      </header>

      {/* Magpatuloy sa pag-aaral — ang porsiyento ay mula sa tunay na
          pagtatangka sa pagsusulit ng aralin, hindi sa halimbawang numero. */}
      <section
        aria-labelledby="continue-learning-heading"
        className="rounded-2xl bg-plum-800 px-4 py-5 shadow-card sm:px-7 sm:py-6"
      >
        <h2 id="continue-learning-heading" className="sr-only">
          Magpatuloy sa pag-aaral
        </h2>

        <span className="inline-flex items-center justify-center rounded-lg bg-lav-400 px-3 py-1">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink/90">
            Magpatuloy sa Pag-aaral
          </span>
        </span>

        <p className="mt-3 text-[20px] font-bold leading-tight tracking-tight text-white sm:text-[26px] 2xl:text-[30px]">
          {activeLesson.label} · {activeLesson.title}
        </p>
        <p className="mt-1.5 text-[13px] text-[#c8c8c8] sm:text-[15px]">
          {activeLesson.content?.objective ?? demoLearningProgress.module}
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <div className="min-w-0 flex-1">
            <div
              className="h-2.5 w-full overflow-hidden rounded-[4px] bg-plum-1000"
              role="progressbar"
              aria-valuenow={bannerPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progreso ng aralin"
            >
              <div
                className="h-full rounded-[4px] bg-canvas"
                style={{ width: `${bannerPercent}%` }}
              />
            </div>
            <p className="mt-1.5 text-[12px] text-white">{bannerLabel}</p>
          </div>

          <Link
            to={activeLesson.to}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-lav-400 px-5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-[#9b9bc7]"
          >
            {activeLesson.state.action} ang Aralin
          </Link>
        </div>
      </section>

      {/* Mga nakaraang nakamit */}
      <section aria-labelledby="recent-achievements-heading">
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img
              src={ACHIEVEMENT_HEADER.src}
              alt=""
              className="h-7 w-7"
              aria-hidden="true"
            />
            <h2
              id="recent-achievements-heading"
              className="text-[16px] font-black tracking-tight text-ink sm:text-[18px]"
            >
              Mga Nakaraang Nakamit
            </h2>
          </div>
          <Link
            to="/pag-unlad"
            className="text-[12.5px] font-medium text-accent-strong hover:underline"
          >
            Tingnan lahat
          </Link>
        </div>

        <div className="rounded-2xl border border-ink/70 bg-canvas px-4 py-1.5 shadow-card sm:px-6">
          {recentActivities.length > 0 ? (
            <ul className="divide-y divide-ink/10">
              {recentActivities.map((item) => {
                const icon =
                  ACHIEVEMENT_ICONS[item.icon] ?? ACHIEVEMENT_ICONS.trophy;
                return (
                  <li key={item.id} className="flex items-center gap-3 py-3">
                    <span
                      className={cx(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-ink/60",
                        icon.tile,
                      )}
                      aria-hidden="true"
                    >
                      <img src={icon.src} alt="" className="h-7 w-7" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium leading-tight text-ink sm:text-[15px]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[11.5px] font-light text-ink/80">
                        {item.detail}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[14px] font-semibold text-accent sm:text-[15px]">
                        {item.xpLabel}
                      </p>
                      <p className="mt-0.5 text-[10.5px] font-medium text-ink/80">
                        {item.when}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="my-3 rounded-xl border border-dashed border-ink/30 bg-white/40 px-4 py-6 text-center">
              <p className="text-[14px] font-semibold text-ink">
                Wala pang natapos na aktibidad
              </p>
              <p className="mx-auto mt-1 max-w-md text-[12px] leading-relaxed text-muted">
                Pumili ng hamon sa Pagsasanay. Lalabas dito ang tunay na resulta
                at XP mula sa browser na ito.
              </p>
              <Link
                to="/aktibidad"
                className="mt-3 inline-flex rounded-lg bg-plum-800 px-4 py-2 text-[12.5px] font-semibold text-canvas transition-colors hover:bg-plum-900"
              >
                Pumunta sa Pagsasanay
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Mga anunsyo */}
      <section aria-labelledby="announcement-heading">
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img
              src={iconMegaphone}
              alt=""
              className="h-7 w-7"
              aria-hidden="true"
            />
            <h2
              id="announcement-heading"
              className="text-[16px] font-black tracking-tight text-ink sm:text-[18px]"
            >
              Mga Anunsyo
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setAnnouncementsOpen(true)}
            className="text-[12.5px] font-semibold text-accent-strong hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Tingnan lahat
          </button>
        </div>

        <div className="rounded-2xl border border-ink/70 bg-canvas px-4 py-1.5 shadow-card sm:px-6">
          <ul className="divide-y divide-ink/10">
            {demoFigmaAnnouncements.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <span
                  className={cx(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-ink/60",
                    item.isNew ? "bg-[#a591d8]/60" : "bg-[#ebe0e2]",
                  )}
                  aria-hidden="true"
                >
                  {item.isNew ? (
                    <span className="text-[11px] font-bold text-accent">
                      BAGO
                    </span>
                  ) : null}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold leading-snug text-ink">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[11.5px] font-light leading-relaxed text-ink/80">
                    {item.detail}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-ink/70">
                    {item.date}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="text-[11px] leading-relaxed text-muted">
        Antas {levelProgress.level} · {levelProgress.xpIntoLevel.toLocaleString()}{" "}
        / {levelProgress.xpForNextLevel.toLocaleString()} XP — kasama ang
        panimulang demo XP at ang mga aktibidad na natapos sa browser na ito.
        Hindi ito totoong rekord ng mag-aaral.
      </p>

      <DemoNotice />

      <Modal
        open={announcementsOpen}
        onClose={() => setAnnouncementsOpen(false)}
        title="Mga Anunsyo"
        eyebrow="Prototype"
        size="md"
      >
        <Alert variant="info" title="Walang live na feed ng anunsyo">
          Walang notification system o backend para sa mensahe ng guro sa
          prototype. Ang mga nasa ibaba ay halimbawang nilalaman mula sa Figma,
          hindi tunay na anunsyo.
        </Alert>

        <ul className="mt-4 space-y-3">
          {demoFigmaAnnouncements.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-line bg-canvas/60 p-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-ink">{item.title}</p>
                <span className="text-[10px] font-medium text-muted">
                  {item.date}
                </span>
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}
