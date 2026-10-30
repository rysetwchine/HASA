import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock3,
  ListChecks,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { useAuth } from "../../app/AuthProvider.jsx";
import Seo from "../../components/Seo.jsx";
import {
  Alert,
  Button,
  Card,
  Chip,
  Loading,
  ProgressBar,
  buttonClass,
} from "../../components/ui.jsx";
import { api, errorMessage } from "../../lib/api.js";
import { DIFFICULTY_LABELS, READING_LEVELS } from "../../lib/format.js";
import { useApi } from "../../lib/useApi.js";
import { cx } from "../../utils/cx.js";

function Paragraphs({ text }) {
  const paragraphs = useMemo(
    () => String(text || "").split(/\n{2,}/).map((part) => part.trim()).filter(Boolean),
    [text],
  );
  return (
    <div className="reading-text text-[15px] sm:text-base">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

export default function LessonDetailPage() {
  const { id } = useParams();
  const { refresh } = useAuth();
  const { data, error, loading, reload } = useApi(`/student/lessons/${id}`);
  const activities = useApi("/student/activities?kind=activity");
  const quizzes = useApi("/student/activities?kind=quiz");
  const [level, setLevel] = useState("instructional");
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (data?.lesson?.defaultLevel) setLevel(data.lesson.defaultLevel);
  }, [data?.lesson?.defaultLevel]);

  // Itinatala ang pagbukas ng aralin bilang "in_progress" (walang XP).
  // Ang guro ay nakikita ito sa Progreso ng Mag-aaral.
  useEffect(() => {
    if (!data?.lesson?.id) return;
    const controller = new AbortController();
    api
      .post(`/student/lessons/${data.lesson.id}/start`, undefined, {
        signal: controller.signal,
      })
      .catch(() => {});
    return () => controller.abort();
  }, [data?.lesson?.id]);

  if (loading) return <Loading label="Binubuksan ang aralin…" />;
  if (error) return <Alert tone="danger" title="Hindi mabuksan ang aralin">{errorMessage(error)}</Alert>;

  const lesson = data.lesson;
  const isCompleted = lesson.progress?.status === "completed";
  const currentLevel = READING_LEVELS.find((item) => item.value === level) || READING_LEVELS[1];
  const related = [
    ...(activities.data?.activities || []).filter((item) => item.lesson?.id === lesson.id),
    ...(quizzes.data?.activities || []).filter((item) => item.lesson?.id === lesson.id),
  ];

  const handleComplete = async () => {
    setCompleteError("");
    setCompleting(true);
    try {
      const payload = await api.post(`/student/lessons/${lesson.id}/complete`);
      setResult(payload);
      await refresh();
      reload();
    } catch (requestError) {
      setCompleteError(errorMessage(requestError));
    } finally {
      setCompleting(false);
    }
  };

  return (
    <>
      <Seo
        title={lesson.title}
        description={lesson.description}
        noindex
        path={`/student/aralin/${lesson.id}`}
      />
      <Link to="/student/aralin" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" /> Bumalik sa mga aralin
      </Link>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-5">
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="accent">{lesson.unit}</Chip>
              <Chip>{DIFFICULTY_LABELS[lesson.difficulty] || lesson.difficulty}</Chip>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
                <Clock3 className="size-3.5" aria-hidden="true" /> {lesson.estimatedMinutes} min
              </span>
              {isCompleted ? (
                <Chip tone="success"><CheckCircle2 className="size-3.5" aria-hidden="true" /> Tapos na</Chip>
              ) : (
                <Chip tone="gold"><Star className="size-3.5" aria-hidden="true" /> {lesson.xp} XP</Chip>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{lesson.title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">{lesson.description}</p>

            <div className="mt-6 border-t border-plum-100 pt-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-bold text-ink">Pumili ng antas ng pagbasa</h2>
                  <p className="mt-0.5 text-xs text-muted">Pinipili ito, hindi sinusukat. Palitan anumang oras.</p>
                </div>
                <Chip tone="info">{currentLevel.english}</Chip>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3" role="tablist" aria-label="Antas ng pagbasa">
                {READING_LEVELS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    role="tab"
                    aria-selected={level === item.value}
                    onClick={() => setLevel(item.value)}
                    className={cx(
                      "rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-colors",
                      level === item.value
                        ? "border-accent bg-accent-soft text-accent-deep"
                        : "border-plum-200 bg-white text-plum-700 hover:border-plum-400",
                    )}
                  >
                    {item.label}
                    <span className="mt-0.5 block text-[10px] font-medium text-muted">{item.english}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted">{currentLevel.description}</p>
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-2 border-b border-plum-100 pb-3">
              <BookOpen className="size-4.5 text-accent" aria-hidden="true" />
              <h2 className="text-sm font-bold uppercase tracking-wide text-ink">Teksto ng aralin</h2>
            </div>
            <Paragraphs text={lesson.contents?.[level]} />
          </Card>

          {lesson.vocabulary?.length > 0 ? (
            <Card>
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="size-4.5 text-accent" aria-hidden="true" />
                <h2 className="text-base font-bold text-ink">Mahahalagang salita</h2>
              </div>
              <dl className="grid gap-3 sm:grid-cols-2">
                {lesson.vocabulary.map((item) => (
                  <div key={item.word} className="rounded-xl border border-plum-100 bg-cream-50 p-3.5">
                    <dt className="text-sm font-bold text-ink">{item.word}</dt>
                    <dd className="mt-1 text-xs leading-relaxed text-muted">{item.explanation}</dd>
                    {item.example ? (
                      <dd className="mt-1.5 text-xs italic leading-relaxed text-plum-600">Hal.: {item.example}</dd>
                    ) : null}
                  </div>
                ))}
              </dl>
            </Card>
          ) : null}
        </div>

        <div className="space-y-5">
          <Card>
            <h2 className="text-base font-bold text-ink">Katayuan ng aralin</h2>
            <div className="mt-3">
              <ProgressBar value={isCompleted ? 100 : 0} label="Pagkumpleto" tone={isCompleted ? "success" : "plum"} />
            </div>
            {result ? (
              <Alert tone="success" title={result.alreadyCompleted ? "Tapos na ang araling ito" : "Nakumpleto ang aralin!"} className="mt-4">
                {result.alreadyCompleted ? (
                  "Naitala na ang araling ito. Maaari mo pa ring balikan ang teksto."
                ) : (
                  <>Nakuha mo ang <strong>{result.lessonXp} XP</strong> para sa aralin.</>
                )}
                {result.newBadges?.length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {result.newBadges.map((badge) => (
                      <li key={badge.id} className="flex items-center gap-1.5 font-medium">
                        <Trophy className="size-3.5" aria-hidden="true" /> Bagong badge: {badge.name} (+{badge.xp} XP)
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Alert>
            ) : null}
            {completeError ? <Alert tone="danger" className="mt-4">{completeError}</Alert> : null}
            {isCompleted && !result ? (
              <Alert tone="success" className="mt-4">
                Naisumite mo na ang araling ito. Maaari mong balikan ang teksto anumang oras.
              </Alert>
            ) : null}
            {!isCompleted && !result ? (
              <Button className="mt-4 w-full" onClick={handleComplete} disabled={completing}>
                <CheckCircle2 className="size-4.5" aria-hidden="true" />
                {completing ? "Isinusumite…" : "Markahan na tapos"}
              </Button>
            ) : null}
            <p className="mt-2 text-center text-[11px] text-muted">Isa lang ang XP na ibinibigay sa bawat aralin.</p>
          </Card>

          {related.length > 0 ? (
            <Card>
              <h2 className="text-base font-bold text-ink">Kaugnay na gawain</h2>
              <ul className="mt-3 space-y-2.5">
                {related.map((item) => (
                  <li key={`${item.kind}-${item.id}`}>
                    <Link
                      to={`/student/${item.kind === "quiz" ? "pagsusulit" : "aktibidad"}/${item.id}`}
                      className="flex items-center gap-3 rounded-xl border border-plum-100 p-3 hover:border-plum-300 hover:bg-plum-50/50"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-plum-100 text-plum-700">
                        {item.kind === "quiz" ? <ListChecks className="size-4.5" aria-hidden="true" /> : <ClipboardList className="size-4.5" aria-hidden="true" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink">{item.title}</span>
                        <span className="text-xs text-muted">{item.questionCount} tanong · {item.xp} XP</span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-plum-400" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          <Card className="bg-plum-900 text-white">
            <h2 className="text-base font-bold text-gold">Paalala</h2>
            <p className="mt-2 text-sm leading-relaxed text-plum-200">
              Ang antas ng pagbasa ay gabay lamang. Kung mas malinaw para sa iyo ang ibang
              bersyon, gamitin ito. Hindi ito pagsusukat ng kakayahan.
            </p>
            <Link to="/student/pasimplehin" className={buttonClass({ variant: "secondary", size: "sm", className: "mt-3 border-white/20 bg-transparent text-white hover:bg-white/10" })}>
              Kailangan ng AI na tulong? <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </Card>
        </div>
      </div>
    </>
  );
}
