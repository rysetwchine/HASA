import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Target,
} from "lucide-react";
import Alert from "../../components/ui/Alert.jsx";
import Chip from "../../components/ui/Chip.jsx";
import DemoNotice from "../../components/ui/DemoNotice.jsx";
import { useProgress } from "../../app/ProgressProvider.jsx";
import {
  LESSON_STATES,
  getLesson,
  getLessons,
} from "../../services/lessonService.js";
import { LESSON_CONTENT_STATUS } from "../../data/lessonContent.js";
import { cx } from "../../utils/cx.js";

const DIFFICULTY_TONE = {
  easy: "success",
  medium: "warning",
  hard: "muted",
};

export default function LessonDetailPage() {
  const { lessonId } = useParams();
  const { progress } = useProgress();
  const lesson = getLesson(lessonId, progress);
  const lessons = getLessons(progress);

  if (!lesson) {
    return (
      <div className="space-y-4">
        <Alert variant="warning" title="Hindi mahanap ang aralin">
          Walang aralin na may kodigong “{lessonId}”. Tingnan ang buong listahan
          ng mga aralin.
        </Alert>
        <Link
          to="/mga-aralin"
          className="inline-flex items-center gap-2 rounded-lg bg-plum-800 px-4 py-2 text-sm font-semibold text-canvas hover:bg-plum-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Bumalik sa mga aralin
        </Link>
      </div>
    );
  }

  const index = lessons.findIndex((entry) => entry.id === lesson.id);
  const previous = index > 0 ? lessons[index - 1] : null;
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null;
  const state = LESSON_STATES[lesson.state.key] ?? LESSON_STATES["not-started"];
  const content = lesson.content;

  return (
    <div className="space-y-5">
      <Link
        to="/mga-aralin"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-deep hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Lahat ng Aralin
      </Link>

      {/* Ulo ng aralin */}
      <header className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-plum-800 px-2 py-0.5 text-[11px] font-bold text-canvas">
                Aralin {lesson.no}
              </span>
              <Chip tone={DIFFICULTY_TONE[lesson.difficultyKey] ?? "muted"}>
                {lesson.difficulty}
              </Chip>
              <Chip tone={lesson.state.key === "completed" ? "success" : "brand"}>
                {state.label}
              </Chip>
            </div>
            <h1 className="mt-2 text-[24px] font-black leading-tight tracking-tight text-ink sm:text-[30px]">
              {lesson.title}
            </h1>
            {content ? (
              <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
                {content.objective}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_270px]">
        {/* Nilalaman */}
        <div className="min-w-0 space-y-4">
          {content ? (
            <>
              {content.sections.map((section, sectionIndex) => (
                <section
                  key={section.heading}
                  aria-labelledby={`seksyon-${sectionIndex}`}
                  className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5"
                >
                  <h2
                    id={`seksyon-${sectionIndex}`}
                    className="flex items-start gap-2 text-[16px] font-bold leading-snug text-ink sm:text-[17px]"
                  >
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-lav-200/70 text-[11px] font-black text-plum-800"
                      aria-hidden="true"
                    >
                      {sectionIndex + 1}
                    </span>
                    {section.heading}
                  </h2>
                  <div className="mt-2 space-y-2">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 40)}
                        className="text-[13.5px] leading-7 text-ink/85"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}

              <section
                aria-labelledby="talasalitaan-heading"
                className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5"
              >
                <h2
                  id="talasalitaan-heading"
                  className="flex items-center gap-2 text-[16px] font-bold text-ink"
                >
                  <BookOpen className="h-4 w-4 text-accent" aria-hidden="true" />
                  Mahahalagang Salita
                </h2>
                <dl className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {content.keyTerms.map((term) => (
                    <div
                      key={term.word}
                      className="rounded-xl border border-line bg-canvas/60 p-3"
                    >
                      <dt className="text-[13px] font-bold text-brand-800">
                        {term.word}
                      </dt>
                      <dd className="mt-1 text-[12.5px] leading-relaxed text-ink/80">
                        {term.meaning}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </>
          ) : (
            <Alert variant="warning" title="Wala pang nilalaman ang aralin">
              May tanong na pagsusulit ang araling ito, ngunit wala pang
              nakatalang teksto ng aralin.
            </Alert>
          )}

          <Alert variant="info" title="Draft na nilalaman">
            {LESSON_CONTENT_STATUS}
          </Alert>
        </div>

        {/* Aside: katayuan at aksyon */}
        <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
            <p className="flex items-center gap-1.5 text-[13px] font-bold text-ink">
              <Target className="h-4 w-4 text-accent" aria-hidden="true" />
              Katayuan
            </p>

            <dl className="mt-3 space-y-1.5 text-[12.5px]">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted">Kalagayan</dt>
                <dd className="font-semibold text-ink">{state.label}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted">Mga pagtatangka</dt>
                <dd className="font-semibold text-ink">{lesson.attempts}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted">Pinakamahusay</dt>
                <dd className="font-semibold text-ink">
                  {lesson.bestPercent === null ? "—" : `${lesson.bestPercent}%`}
                </dd>
              </div>
            </dl>

            {lesson.activityId ? (
              <Link
                to={`/aktibidad?activity=${lesson.activityId}`}
                className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-plum-800 px-3 text-[13.5px] font-semibold text-canvas transition-colors hover:bg-plum-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                {state.action} — Pagsusulit
              </Link>
            ) : (
              <Alert variant="warning" className="mt-3">
                Wala pang nakaugnay na pagsusulit ang araling ito.
              </Alert>
            )}

            <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
              Ang XP at marka ay naka-save lamang sa browser na ito.
            </p>
          </div>

          {/* Previous / next */}
          <nav aria-label="Iba pang aralin" className="flex flex-col gap-2">
            {previous ? (
              <Link
                to={previous.to}
                className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-[12.5px] font-semibold text-ink shadow-card hover:border-line-dark"
              >
                <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-[10px] font-medium text-muted">
                    Nakaraang aralin
                  </span>
                  <span className="block truncate">{previous.title}</span>
                </span>
              </Link>
            ) : null}
            {next ? (
              <Link
                to={next.to}
                className="flex items-center justify-end gap-2 rounded-xl border border-line bg-white px-3 py-2 text-right text-[12.5px] font-semibold text-ink shadow-card hover:border-line-dark"
              >
                <span className="min-w-0">
                  <span className="block text-[10px] font-medium text-muted">
                    Susunod na aralin
                  </span>
                  <span className="block truncate">{next.title}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            ) : null}
          </nav>
        </aside>
      </div>

      <DemoNotice />
    </div>
  );
}
