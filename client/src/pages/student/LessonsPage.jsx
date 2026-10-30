import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Search, SlidersHorizontal, Star } from "lucide-react";
import Seo from "../../components/Seo.jsx";
import { Alert, Card, Chip, EmptyState, Input, Loading, PageHeader, ProgressBar, buttonClass } from "../../components/ui.jsx";
import { errorMessage } from "../../lib/api.js";
import { DIFFICULTY_LABELS } from "../../lib/format.js";
import { useApi } from "../../lib/useApi.js";
import { cx } from "../../utils/cx.js";

const FILTERS = [
  { value: "all", label: "Lahat" },
  { value: "open", label: "Hindi pa tapos" },
  { value: "done", label: "Tapos na" },
];

export default function LessonsPage() {
  const { data, error, loading } = useApi("/student/lessons");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const lessons = useMemo(() => {
    const all = data?.lessons || [];
    return all.filter((lesson) => {
      const matchesQuery = `${lesson.title} ${lesson.unit} ${lesson.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      const matchesFilter =
        filter === "all" || (filter === "done" ? lesson.progress === "completed" : lesson.progress !== "completed");
      return matchesQuery && matchesFilter;
    });
  }, [data, query, filter]);

  if (loading) return <Loading label="Nilinog ang mga aralin…" />;
  if (error) return <Alert tone="danger" title="Hindi mabuksan ang mga aralin">{errorMessage(error)}</Alert>;

  const total = data?.lessons.length || 0;
  const done = data?.lessons.filter((lesson) => lesson.progress === "completed").length || 0;

  return (
    <>
      <Seo
        title="Mga Aralin"
        description="Basahin ang mga aralin sa Araling Panlipunan 8 sa antas ng pagbasang akma sa iyo."
        noindex
        path="/student/aralin"
      />
      <PageHeader
        eyebrow="Araling Panlipunan 8"
        title="Mga Aralin"
        description="Tatlong antas ng teksto sa bawat aralin. Piliin ang pinakamalinaw para sa iyo at magpatuloy sa sariling bilis."
        actions={<Chip tone="gold"><CheckCircle2 className="size-3.5" aria-hidden="true" /> {done}/{total} natapos</Chip>}
      />

      <Card className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Maghanap ng aralin o yunit…"
            className="pl-10"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Maghanap ng aralin"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar" role="group" aria-label="Salain ang mga aralin">
          <SlidersHorizontal className="mr-1 size-4 shrink-0 text-muted" aria-hidden="true" />
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={cx(
                "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                filter === item.value ? "bg-plum-800 text-white" : "bg-plum-50 text-plum-700 hover:bg-plum-100",
              )}
              aria-pressed={filter === item.value}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Card>

      {lessons.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Walang nahanap na aralin"
          description={query ? "Subukan ang ibang salita o alisin ang filter." : "Wala pang aralin sa iyong klase."}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {lessons.map((lesson, index) => (
            <Card key={lesson.id} className="group flex flex-col p-0">
              <div className={cx("relative h-28 overflow-hidden rounded-t-2xl", ["bg-plum-800", "bg-accent-strong", "bg-plum-700", "bg-sky-dark"][index % 4])}>
                <div className="absolute -right-8 -top-10 size-32 rounded-full bg-white/10" aria-hidden="true" />
                <div className="absolute -bottom-12 left-10 size-28 rounded-full bg-gold/20" aria-hidden="true" />
                <div className="relative flex h-full items-end justify-between gap-3 p-4">
                  <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    {lesson.unit}
                  </span>
                  {lesson.progress === "completed" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-[10px] font-bold text-white">
                      <CheckCircle2 className="size-3" aria-hidden="true" /> Tapos na
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-brown">
                      <Star className="size-3" aria-hidden="true" /> {lesson.xp} XP
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip>{DIFFICULTY_LABELS[lesson.difficulty] || lesson.difficulty}</Chip>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
                    <Clock3 className="size-3.5" aria-hidden="true" /> {lesson.estimatedMinutes} min
                  </span>
                  {lesson.isClassContent ? <Chip tone="accent">Mula sa guro</Chip> : null}
                </div>
                <h2 className="mt-2.5 text-lg font-bold leading-snug text-ink">{lesson.title}</h2>
                <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted">{lesson.description}</p>
                <div className="mt-auto pt-4">
                  {lesson.progress === "completed" ? (
                    <ProgressBar value={100} label="Progreso" tone="success" />
                  ) : (
                    <p className="text-xs font-medium text-muted">
                      {lesson.progress === "in_progress" ? "Sinimulan na — maaari mong ipagpatuloy." : "Hindi pa sinimulan."}
                    </p>
                  )}
                  <Link to={`/student/aralin/${lesson.id}`} className={buttonClass({ variant: "secondary", className: "mt-3 w-full" })}>
                    {lesson.progress === "completed" ? "Balikan ang aralin" : lesson.progress === "in_progress" ? "Ipagpatuloy" : "Buksan ang aralin"}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
