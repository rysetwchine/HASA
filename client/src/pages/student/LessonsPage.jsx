import { useMemo, useState } from "react";
import { Link } from "react-router";
import { LayoutGrid, List, Play, RotateCcw, Search } from "lucide-react";
import DemoNotice from "../../components/ui/DemoNotice.jsx";
import Alert from "../../components/ui/Alert.jsx";
import { cx } from "../../utils/cx.js";
import { useProgress } from "../../app/ProgressProvider.jsx";
import { filterLessons, getLessons } from "../../services/lessonService.js";
import { LESSON_CONTENT_STATUS } from "../../data/lessonContent.js";

import bannerLessons from "../../assets/images/lessons/banner-lessons.png";
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
  { id: "all", label: "Lahat ng Yunit" },
  { id: "easy", label: "Madali" },
  { id: "medium", label: "Katamtaman" },
  { id: "hard", label: "Mahirap" },
  { id: "completed", label: "Natapos Na" },
];

const DIFFICULTY = {
  easy: { icon: diffEasy, label: "text-[#2b8320]" },
  medium: { icon: diffMedium, label: "text-gold-strong" },
  hard: { icon: diffHard, label: "text-[#832020]" },
};

/** Maliit na chip para sa katayuan ng aralin. */
function StatusChip({ state, className }) {
  return (
    <span
      className={cx(
        "inline-flex h-[22px] shrink-0 items-center justify-center whitespace-nowrap rounded-full border px-2 text-[10px] font-bold leading-none",
        state.chip,
        className,
      )}
    >
      {state.label}
    </span>
  );
}

/** Pare-parehong sukat ng card sa grid: larawan, pamagat, meta, aksyon. */
function LessonCard({ lesson }) {
  const diff = DIFFICULTY[lesson.difficultyKey] ?? DIFFICULTY.easy;

  return (
    <Link
      to={lesson.to}
      aria-label={`${lesson.label}: ${lesson.title} — ${lesson.state.action}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-canvas shadow-card transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0"
    >
      <div className="relative">
        <img
          src={THUMBS[lesson.thumb]}
          alt=""
          loading="lazy"
          decoding="async"
          className="aspect-[16/9] w-full object-cover"
          aria-hidden="true"
        />
        <span
          className={cx(
            "absolute left-2 top-2 flex h-[22px] min-w-[38px] items-center justify-center rounded-md px-1.5 text-[12px] font-black leading-none",
            lesson.state.numberChip,
          )}
        >
          {lesson.no}
        </span>
        <StatusChip
          state={lesson.state}
          className="absolute right-2 top-2 shadow-sm"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3.5">
        <p className="text-[11px] font-medium text-muted">
          Aralin {lesson.no}
        </p>
        {/* Ang line-clamp ay pumipigil sa paghaba ng card kapag mahaba
            ang pamagat, kaya pantay-pantay ang taas sa grid. */}
        <h3 className="mt-0.5 line-clamp-2 min-h-[2.4em] text-[14px] font-bold leading-snug text-ink">
          {lesson.title}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="flex min-w-0 items-center gap-1.5">
            <img
              src={diff.icon}
              alt=""
              className="h-[13px] w-[13px]"
              aria-hidden="true"
            />
            <span className={cx("truncate text-[11.5px] font-bold", diff.label)}>
              {lesson.difficulty}
            </span>
          </span>

          <span className="inline-flex h-[26px] shrink-0 items-center gap-1.5 rounded-lg bg-plum-800 px-2.5 text-[11px] font-semibold text-canvas transition-colors group-hover:bg-plum-900">
            {lesson.state.key === "completed" ? (
              <img
                src={actionReview}
                alt=""
                className="h-[13px] w-[13px]"
                aria-hidden="true"
              />
            ) : (
              <Play className="h-3 w-3 fill-current" aria-hidden="true" />
            )}
            {lesson.state.action}
          </span>
        </div>

        {lesson.isRealProgress && lesson.bestPercent !== null ? (
          <p className="mt-2 text-[10px] font-semibold text-muted">
            Pinakamahusay: {lesson.bestPercent}%
          </p>
        ) : null}
      </div>
    </Link>
  );
}

/** Masikip na bersyon para sa list view: isang linya bawat aralin. */
function LessonRow({ lesson }) {
  const diff = DIFFICULTY[lesson.difficultyKey] ?? DIFFICULTY.easy;

  return (
    <Link
      to={lesson.to}
      aria-label={`${lesson.label}: ${lesson.title} — ${lesson.state.action}`}
      className="group flex items-center gap-3 rounded-xl border border-line bg-canvas p-2.5 shadow-card transition-colors hover:border-line-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:gap-4 sm:p-3"
    >
      <img
        src={THUMBS[lesson.thumb]}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-16 w-24 shrink-0 rounded-lg object-cover sm:h-[72px] sm:w-32"
        aria-hidden="true"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[11px] font-medium text-muted">
            Aralin {lesson.no}
          </span>
          <StatusChip state={lesson.state} />
        </div>
        <h3 className="mt-0.5 line-clamp-2 text-[14px] font-bold leading-snug text-ink">
          {lesson.title}
        </h3>
        <span className="mt-1 flex items-center gap-1.5">
          <img
            src={diff.icon}
            alt=""
            className="h-[12px] w-[12px]"
            aria-hidden="true"
          />
          <span className={cx("text-[11px] font-bold", diff.label)}>
            {lesson.difficulty}
          </span>
        </span>
      </div>

      <span className="hidden shrink-0 items-center gap-1.5 rounded-lg bg-plum-800 px-3 py-1.5 text-[11.5px] font-semibold text-canvas group-hover:bg-plum-900 sm:inline-flex">
        <Play className="h-3 w-3 fill-current" aria-hidden="true" />
        {lesson.state.action}
      </span>
    </Link>
  );
}

export default function LessonsPage() {
  const { progress } = useProgress();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("grid");

  const lessons = useMemo(() => filterLessons(getLessons(progress), { query, filter }), [progress, query, filter]);

  return (
    <div className="space-y-5">
      <h1 className="sr-only">Mga Aralin sa Araling Panlipunan</h1>

      {/* Banner ng Araling Panlipunan.
          Dating iisang PNG ang pamagat at ang subtitle, kaya Ingles ang
          nakalitaw na teksto at hindi ito maisasalin. Dito, tunay na DOM
          text ang Filipino na kopya, at ang ilustrasyon (monumento at watawat)
          na lamang ang galing sa umiiral na asset — naka-crop sa kanan gamit
          ang object-position, walang absolute positioning. */}
      <section
        aria-labelledby="banner-araling-panlipunan"
        className="-mx-4 flex items-center gap-4 overflow-hidden bg-[#fdf6e9] px-4 py-4 sm:-mx-6 sm:px-6 sm:py-5 xl:-mx-8 xl:px-8 2xl:-mx-10 2xl:px-10"
      >
        <div className="min-w-0 flex-1">
          <p
            id="banner-araling-panlipunan"
            className="font-display text-[22px] font-black uppercase leading-none tracking-tight text-ink sm:text-[28px] xl:text-[34px]"
          >
            Araling Panlipunan
          </p>
          <p className="mt-2 text-[13.5px] font-bold text-ink sm:text-[15px]">
            Kumusta, Siri!
          </p>
          <p className="mt-0.5 max-w-[420px] text-[12px] leading-relaxed text-ink/80 sm:text-[13px]">
            Ipagpatuloy ang iyong aralin at may matututuhan kang bago.
          </p>
        </div>

        <img
          src={bannerLessons}
          alt=""
          width={2470}
          height={576}
          fetchPriority="high"
          aria-hidden="true"
          className="hidden h-[104px] w-[240px] shrink-0 rounded-xl object-cover object-right md:block xl:h-[120px] xl:w-[300px] 2xl:w-[360px]"
        />
      </section>

      <Alert variant="info" title="Draft pa ang nilalaman ng mga aralin">
        {LESSON_CONTENT_STATUS} Nabubuksan na ang bawat aralin at ang pagsusulit
        nito, ngunit hindi pa ito naipasa sa pagsusuri ng guro.
      </Alert>

      {/* Bar ng mga filter */}
      <div className="flex flex-col gap-2.5 rounded-xl border border-line-dark bg-lav-500/70 p-2.5 sm:flex-row sm:items-center sm:gap-3">
        <label className="relative flex min-w-0 flex-1 items-center">
          <Search
            className="pointer-events-none absolute left-3 h-4 w-4 text-ink/70"
            aria-hidden="true"
          />
          <span className="sr-only">Maghanap ng Aralin</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Maghanap ng aralin…"
            className="h-9 w-full rounded-lg border-0 bg-white/80 pl-9 pr-3 text-[13px] font-medium text-ink placeholder:text-ink/60 focus:outline-none focus:ring-2 focus:ring-plum-800/40"
          />
        </label>

        <div
          role="group"
          aria-label="Salain ang mga aralin"
          className="flex flex-wrap items-center gap-1"
        >
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
              className={cx(
                "rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors",
                filter === id
                  ? "bg-plum-800 text-canvas"
                  : "text-ink/75 hover:bg-white/50 hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Ulo ng listahan + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <img
            src={booksIcon}
            alt=""
            className="h-8 w-8"
            aria-hidden="true"
          />
          <h2 className="border-b-[3px] border-plum-800 pb-0.5 text-[19px] font-semibold text-ink/85">
            Lahat ng Aralin
          </h2>
          <span className="text-[12px] font-medium text-muted">
            ({lessons.length})
          </span>
        </div>

        <div
          role="group"
          aria-label="Ayos ng listahan"
          className="flex items-center gap-1"
        >
          <button
            type="button"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
            className={cx(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors",
              view === "grid"
                ? "bg-plum-800 text-canvas"
                : "text-[#8a8a8a] hover:text-ink",
            )}
          >
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            Grid na Ayos
          </button>
          <button
            type="button"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            className={cx(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors",
              view === "list"
                ? "bg-plum-800 text-canvas"
                : "text-[#8a8a8a] hover:text-ink",
            )}
          >
            <List className="h-4 w-4" aria-hidden="true" />
            Listahang Ayos
          </button>
        </div>
      </div>

      {/* Listahan ng mga aralin */}
      {lessons.length > 0 ? (
        view === "grid" ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <li key={lesson.id} className="min-w-0">
                <LessonCard lesson={lesson} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-2.5">
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <LessonRow lesson={lesson} />
              </li>
            ))}
          </ul>
        )
      ) : (
        <div className="rounded-2xl border border-line bg-white/50 px-5 py-8 text-center">
          <p className="text-[14px] text-muted">
            Walang aralin na tumugma sa hinanap o sa napiling salaan.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-plum-800 px-4 py-2 text-[13px] font-semibold text-canvas hover:bg-plum-900"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            I-reset ang mga salaan
          </button>
        </div>
      )}

      {/* Tip sa pag-aaral */}
      <aside className="flex items-start gap-3 rounded-2xl border border-line-dark bg-gold-soft/55 px-4 py-4 sm:px-6">
        <img
          src={tipIcon}
          alt=""
          className="mt-0.5 h-7 w-7 shrink-0"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="text-[16px] font-black text-ink">Tip sa Pag-aaral</p>
          <p className="mt-1 text-[13px] font-semibold text-ink">
            Isang maliit na paksa lang muna sa bawat pagkakataon.
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-ink/80">
            Maglaan ng sapat na oras. Hindi kailangang tapusin ang lahat nang
            sabay-sabay.
          </p>
        </div>
      </aside>

      <DemoNotice />
    </div>
  );
}
