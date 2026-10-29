import { useMemo, useState } from "react";
import DemoNotice from "../../components/ui/DemoNotice.jsx";
import Alert from "../../components/ui/Alert.jsx";
import { cx } from "../../utils/cx.js";
import { demoFigmaLessons } from "../../data/demoData.js";

import bannerLessons from "../../assets/images/lessons/banner-lessons.png";
import searchIcon from "../../assets/images/lessons/search.png";
import gridIcon from "../../assets/images/lessons/view-grid.png";
import listIcon from "../../assets/images/lessons/view-list.png";
import tipIcon from "../../assets/images/lessons/tip-icon.png";
import booksIcon from "../../assets/images/lessons/icon-header-lessons.png";
import diffEasy from "../../assets/images/lessons/diff-easy.png";
import diffMedium from "../../assets/images/lessons/diff-medium.png";
import diffHard from "../../assets/images/lessons/diff-hard.png";
import actionReview from "../../assets/images/lessons/action-review.png";

import thumb1 from "../../assets/images/lessons/thumb-1.png";
import thumb2 from "../../assets/images/lessons/thumb-2.png";
import thumb3 from "../../assets/images/lessons/thumb-3.png";
import thumb4 from "../../assets/images/lessons/thumb-4.png";
import thumb5 from "../../assets/images/lessons/thumb-5.png";
import thumb6 from "../../assets/images/lessons/thumb-6.png";

const THUMBS = {
  "thumb-1": thumb1,
  "thumb-2": thumb2,
  "thumb-3": thumb3,
  "thumb-4": thumb4,
  "thumb-5": thumb5,
  "thumb-6": thumb6,
};

const FILTERS = [
  { id: "all", label: "All units" },
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
  { id: "completed", label: "Completed" },
];

/**
 * Mga kulay ng status/chip mula sa Figma frame "Lessons":
 * completed = berde (#2b8320), hindi pa = pula (#832020),
 * sinisimulan pa lamang = dilaw (#f0b511).
 */
const STATUS_STYLES = {
  completed: {
    badge: "bg-[#2b8320]/70 text-[#0e4007]",
  },
  "not-started": {
    badge: "bg-canvas/60 border border-danger-deep text-danger-deep",
  },
  "in-progress": {
    badge: "bg-gold-strong/70 text-brown",
  },
};

const DIFFICULTY = {
  easy: { icon: diffEasy, label: "text-[#2b8320]" },
  medium: { icon: diffMedium, label: "text-gold-strong" },
  hard: { icon: diffHard, label: "text-[#832020]" },
};

function LessonCard({ lesson }) {
  const status = STATUS_STYLES[lesson.status] ?? STATUS_STYLES.completed;
  const diff = DIFFICULTY[lesson.difficultyKey] ?? DIFFICULTY.easy;

  return (
    <article className="flex min-h-[308px] flex-col rounded-[25px] border border-line bg-canvas p-4 shadow-card">
      <div className="relative">
        <img
          src={THUMBS[lesson.thumb]}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-[188px] w-full rounded-[15px] object-cover"
          aria-hidden="true"
        />
        {/* Bilang ng aralin (kaliwa) */}
        <span
          className={cx(
            "absolute left-3 top-3 flex h-[25px] min-w-[45px] items-center justify-center rounded-[10px] px-2 text-[14px] font-black leading-none",
            lesson.status === "completed"
              ? "bg-[#2b8320]/70 text-canvas"
              : lesson.status === "in-progress"
                ? "bg-gold-strong/70 text-canvas"
                : "bg-danger-deep/60 text-canvas",
          )}
        >
          {lesson.no}
        </span>
        {/* Estado (kanan) */}
        <span
          className={cx(
            "absolute right-3 top-3 flex h-[20px] items-center justify-center rounded-[12px] px-2.5 text-[11px] font-black leading-none",
            status.badge,
          )}
        >
          {lesson.statusLabel}
        </span>
      </div>

      <div className="mt-4 flex min-w-0 flex-1 flex-col">
        <p className="text-[12px] font-medium text-muted">{lesson.label}</p>
        <h3 className="mt-0.5 text-[15px] font-bold leading-snug text-ink">
          {lesson.title}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-5">
          <span className="flex items-center gap-1.5">
            <img
              src={diff.icon}
              alt=""
              className="h-[14px] w-[14px]"
              aria-hidden="true"
            />
            <span className={cx("text-[13px] font-bold", diff.label)}>
              {lesson.difficulty}
            </span>
          </span>

          <button
            type="button"
            disabled
            title="Wala pang lesson detail content sa prototype, kaya hindi pa mabubuksan ang aralin"
            className={cx(
              "flex h-[27px] cursor-not-allowed items-center gap-1.5 rounded-[10px] px-3 text-[11.5px] font-semibold",
              lesson.action === "Review"
                ? "border border-[#0e4007] bg-[#2b8320]/70 text-[#0e4007]"
                : lesson.status === "in-progress"
                  ? "border border-gold-strong bg-white text-brown"
                  : "border border-danger-deep bg-canvas text-danger-deep",
            )}
          >
            {lesson.action === "Review" ? (
              <img
                src={actionReview}
                alt=""
                className="h-[15px] w-[15px]"
                aria-hidden="true"
              />
            ) : (
              <span
                className={cx(
                  "inline-block h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent",
                  lesson.action === "Start" ? "border-l-danger-deep" : "border-l-gold-strong",
                )}
                aria-hidden="true"
              />
            )}
            {lesson.action}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function LessonsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("grid");

  const lessons = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demoFigmaLessons.filter((lesson) => {
      if (
        q &&
        !lesson.title.toLowerCase().includes(q) &&
        !lesson.label.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (filter === "all") return true;
      if (filter === "completed") return lesson.status === "completed";
      return lesson.difficultyKey === filter;
    });
  }, [query, filter]);

  return (
    <div className="space-y-6">
      <h1 className="sr-only">Araling Panlipunan</h1>

      {/*
       * Banner na may nakaukit na pamagat mula sa Figma — huwag magdagdag
       * ng teksto sa ibabaw para walang dobleng teksto.
       * Full-bleed lamang sa gilid: dating may `-mt-5/-mt-7` din ito, na
       * humihila sa banner pataas at nagpapatong dito sa Topbar.
       */}
      <div className="-mx-4 sm:-mx-6 xl:-mx-12 2xl:-mx-14">
        <img
          src={bannerLessons}
          alt="Araling Panlipunan — Hi, Siri! Continue your lesson and learn something new."
          width={2470}
          height={576}
          fetchPriority="high"
          className="w-full object-cover"
        />
      </div>

      <Alert variant="info" title="Hindi pa mabubuksan ang mga aralin">
        Gumagana ang search, filters, at grid/list view. Wala pang aktwal na
        lesson detail content sa prototype, kaya nananatiling disabled ang
        Start, Review, at Continue. Hindi ito dinadaan sa pekeng alert o
        gawa-gawang aralin.
      </Alert>

      {/* Bar ng mga filter */}
      <div className="flex flex-col gap-3 rounded-[15px] border border-line-dark bg-lav-500/70 p-3 sm:flex-row sm:items-center lg:gap-5">
        {/* Hanapin */}
        <label className="relative flex min-w-0 flex-1 items-center">
          <img
            src={searchIcon}
            alt=""
            className="pointer-events-none absolute left-3.5 h-[20px] w-[20px]"
            aria-hidden="true"
          />
          <span className="sr-only">Search lessons</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search lessons.."
            className="h-9 w-full rounded-[11px] border-0 bg-lav-500 pl-11 pr-4 text-[13px] font-medium text-ink placeholder:text-ink/70 focus:outline-none focus:ring-2 focus:ring-plum-800/40"
          />
        </label>

        <span
          className="hidden w-px self-stretch bg-[#000000]/30 lg:block"
          aria-hidden="true"
        />

        <div
          role="group"
          aria-label="I-filter ang mga aralin"
          className="flex flex-wrap items-center gap-1"
        >
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
              className={cx(
                "rounded-[15px] px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                filter === id
                  ? "bg-plum-800 text-canvas"
                  : "text-ink/75 hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Ulo ng listahan + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-end gap-3">
          <img
            src={booksIcon}
            alt=""
            className="mb-1 h-[41px] w-[41px]"
            aria-hidden="true"
          />
          <h2 className="border-b-4 border-plum-800 pb-1 text-[25px] font-semibold text-ink/85">
            All Lessons
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
            className={cx(
              "flex items-center gap-2 rounded-[20px] px-4 py-2 text-[15px] font-medium transition-colors",
              view === "grid"
                ? "bg-plum-800 text-canvas"
                : "text-[#a2a2a2] hover:text-ink",
            )}
          >
            <img
              src={gridIcon}
              alt=""
              className="h-[19px] w-[19px]"
              aria-hidden="true"
            />
            Grid View
          </button>
          <button
            type="button"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            className={cx(
              "flex items-center gap-2 rounded-[20px] px-4 py-2 text-[15px] font-medium transition-colors",
              view === "list"
                ? "bg-plum-800 text-canvas"
                : "text-[#a2a2a2] hover:text-ink",
            )}
          >
            <img
              src={listIcon}
              alt=""
              className="h-[21px] w-[21px]"
              aria-hidden="true"
            />
            List View
          </button>
        </div>
      </div>

      {/* Grid ng mga aralin */}
      {lessons.length > 0 ? (
        <ul
          className={cx(
            "grid gap-6",
            view === "grid"
              ? "sm:grid-cols-2 lg:grid-cols-3"
              : "sm:grid-cols-1 lg:grid-cols-2",
          )}
        >
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <LessonCard lesson={lesson} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-[20px] border border-line bg-white/50 px-5 py-8 text-center">
          <p className="text-[15px] text-muted">
            Walang aralin na tugma sa hinanap o filter. Subukan ang ibang salita.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="mt-3 rounded-[12px] bg-plum-800 px-4 py-2 text-[13px] font-semibold text-canvas hover:bg-plum-900"
          >
            I-reset ang mga filter
          </button>
        </div>
      )}

      {/* Study Tip card */}
      <aside className="flex items-start gap-4 rounded-[20px] border border-line-dark bg-gold-soft/55 px-6 py-6 sm:px-10">
        <img
          src={tipIcon}
          alt=""
          className="mt-1 h-[33px] w-[33px] shrink-0"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="text-[20px] font-black text-ink sm:text-[22px]">
            Study Tip
          </p>
          <p className="mt-2 text-[14px] font-semibold text-ink">
            Learn one small topic at a time.
          </p>
          <p className="mt-0.5 text-[11px] text-ink">
            Take your time—you don&rsquo;t have to finish everything at once.
          </p>
        </div>
      </aside>

      <DemoNotice />
    </div>
  );
}
