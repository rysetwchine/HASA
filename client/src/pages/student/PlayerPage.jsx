import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  ListChecks,
  Loader2,
  Medal,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Swords,
  Target,
  Trophy,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useAuth } from "../../app/AuthProvider.jsx";
import Seo from "../../components/Seo.jsx";
import { Alert, Button, Card, Chip, Loading, ProgressBar, buttonClass } from "../../components/ui.jsx";
import { api, errorMessage } from "../../lib/api.js";
import { useApi } from "../../lib/useApi.js";
import { cx } from "../../utils/cx.js";

const CONFETTI_COLORS = ["#f4c95d", "#8a38f5", "#2b8320", "#3e7cb1", "#ff9f43"];
const CONFETTI_PIECES = Array.from({ length: 24 }, (_, index) => ({
  left: `${(index * 37 + 9) % 100}%`,
  delay: `${(index % 8) * 0.22}s`,
  duration: `${2.6 + (index % 5) * 0.35}s`,
  drift: `${((index % 7) - 3) * 16}px`,
  color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
  size: index % 3 === 0 ? "size-2.5 rounded-sm" : "size-2 rounded-full",
}));

function formatClock(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function starsFor(percent, passed) {
  const value = Number(percent) || 0;
  if (value >= 90) return 3;
  if (passed) return 2;
  if (value >= 40) return 1;
  return 0;
}

function StarMeter({ value, dark = false, size = "md", className = "" }) {
  const sizes = { sm: "size-4", md: "size-5", lg: "size-9" };
  return (
    <span
      className={cx("inline-flex items-center justify-center gap-1", className)}
      role="img"
      aria-label={`${value} sa 3 bituin`}
    >
      {[0, 1, 2].map((index) => (
        <Star
          key={index}
          className={cx(
            sizes[size],
            index < value
              ? "animate-star fill-current text-gold-strong"
              : dark
                ? "text-white/20"
                : "text-plum-200",
          )}
          style={index < value ? { animationDelay: `${index * 120}ms` } : undefined}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {CONFETTI_PIECES.map((piece, index) => (
        <span
          key={index}
          className={cx("animate-confetti absolute top-0", piece.size)}
          style={{
            left: piece.left,
            backgroundColor: piece.color,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            "--drift": piece.drift,
          }}
        />
      ))}
    </div>
  );
}

export default function PlayerPage() {
  const { id } = useParams();
  const { refresh } = useAuth();
  const { data, error, loading } = useApi(`/student/activities/${id}`);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState(null);
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [validation, setValidation] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const answersRef = useRef({});
  const submittedRef = useRef(false);

  const activity = data?.activity;
  const isQuiz = activity?.kind === "quiz";
  const basePath = isQuiz ? "/student/pagsusulit" : "/student/aktibidad";

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const handleSubmit = useCallback(
    async (timedOut = false) => {
      if (!attempt || submittedRef.current) return;
      submittedRef.current = true;
      setPending(true);
      setSubmitError("");
      setValidation("");
      try {
        const payload = await api.post(`/student/attempts/${attempt.attemptId}/submit`, {
          answers: Object.entries(answersRef.current).map(([questionId, selectedIndex]) => ({
            questionId: Number(questionId),
            selectedIndex,
          })),
          timedOut,
        });
        setResult(payload);
        await refresh();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (requestError) {
        submittedRef.current = false;
        setSubmitError(errorMessage(requestError));
      } finally {
        setPending(false);
      }
    },
    [attempt, refresh],
  );

  useEffect(() => {
    if (!attempt?.activity?.timerSeconds || result) return undefined;
    const started = new Date(attempt.startedAt).getTime();
    const total = Number(attempt.activity.timerSeconds);
    let interval = null;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil(total - (Date.now() - started) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        if (interval) clearInterval(interval);
        handleSubmit(true);
      }
    };
    tick();
    interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [attempt, handleSubmit, result]);

  const questions = attempt?.questions || [];
  const question = questions[current];
  const answeredCount = Object.keys(answers).length;

  const startAttempt = async () => {
    setPending(true);
    setSubmitError("");
    setValidation("");
    try {
      const payload = await api.post(`/student/activities/${id}/start`);
      submittedRef.current = false;
      setAttempt(payload);
      setAnswers({});
      setCurrent(0);
      setResult(null);
      setTimeLeft(payload.activity?.timerSeconds ?? null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (requestError) {
      setSubmitError(errorMessage(requestError));
    } finally {
      setPending(false);
    }
  };

  const choose = (questionId, optionIndex) => {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [questionId]: optionIndex }));
    setValidation("");
  };

  const goNext = () => {
    if (current < questions.length - 1) setCurrent((index) => index + 1);
  };
  const goBack = () => {
    if (current > 0) setCurrent((index) => index - 1);
  };

  const submitNow = () => {
    if (answeredCount < questions.length) {
      setValidation(`May ${questions.length - answeredCount} pang tanong na hindi nasasagot. Sagutin ang lahat bago isumite.`);
      const firstUnanswered = questions.findIndex((item) => answers[item.id] === undefined);
      if (firstUnanswered >= 0) setCurrent(firstUnanswered);
      return;
    }
    handleSubmit(false);
  };

  const feedbackMap = useMemo(() => {
    const map = new Map();
    for (const item of result?.feedback || []) map.set(item.questionId, item);
    return map;
  }, [result]);

  if (loading) return <Loading label="Binubuksan ang gawain…" />;
  if (error) return <Alert tone="danger" title="Hindi mabuksan ang gawain">{errorMessage(error)}</Alert>;
  if (!activity) return <Loading label="Binubuksan ang gawain…" />;

  if (result) {
    const attemptResult = result.attempt;
    const passed = attemptResult.passed;
    const stars = starsFor(attemptResult.percent, passed);
    return (
      <>
        <Seo
          title={`Resulta: ${activity.title}`}
          description="Resulta ng iyong pagsusulit sa HASA."
          noindex
          path={`${basePath}/${id}`}
        />
        <div className="mx-auto max-w-3xl">
          <Card className={cx("animate-pop overflow-hidden p-0", passed ? "border-success/30" : "border-plum-200")}>
            <div className={cx("relative overflow-hidden px-5 py-8 text-center text-white sm:px-8 sm:py-10", passed ? "bg-plum-900" : "bg-plum-950")}>
              <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-40" aria-hidden="true" />
              <div
                className={cx(
                  "pointer-events-none absolute -left-16 top-0 size-52 rounded-full blur-3xl",
                  passed ? "bg-gold/20" : "bg-accent/20",
                )}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -right-20 bottom-0 size-56 rounded-full bg-accent/20 blur-3xl"
                aria-hidden="true"
              />
              {passed ? <Confetti /> : null}

              <div className="relative">
                <span
                  className={cx(
                    "mx-auto grid size-16 place-items-center rounded-3xl shadow-lg",
                    passed ? "animate-float bg-gold text-brown" : "bg-white/10 text-gold",
                  )}
                >
                  {passed ? <Trophy className="size-8" aria-hidden="true" /> : <Target className="size-8" aria-hidden="true" />}
                </span>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
                  {passed ? "Hamon kumpleto" : attemptResult.timedOut ? "Naubos ang oras" : "Laban pa"}
                </p>
                <p className="mt-1 text-6xl font-black tracking-tight sm:text-7xl">{attemptResult.percent}%</p>
                <StarMeter value={stars} size="lg" dark className="mt-2" />
                <p className="mt-2 text-sm font-medium text-plum-200">
                  {attemptResult.score} ng {attemptResult.total} ang tama · Layunin {activity.passPercent}%
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white">
                    <Trophy className="size-3.5 text-gold" aria-hidden="true" />
                    {attemptResult.xpAwarded > 0 ? `+${attemptResult.xpAwarded} XP` : "Walang bagong XP"}
                  </span>
                  <span
                    className={cx(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold text-white",
                      passed ? "border-success/40 bg-success/20" : "border-white/15 bg-white/10",
                    )}
                  >
                    {passed ? <CheckCircle2 className="size-3.5" aria-hidden="true" /> : <XCircle className="size-3.5" aria-hidden="true" />}
                    {passed ? "Pumasa" : `Kailangan ng ${activity.passPercent}%`}
                  </span>
                  {attemptResult.timedOut ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-danger/40 bg-danger/20 px-3 py-1.5 text-xs font-bold text-white">
                      <Clock3 className="size-3.5" aria-hidden="true" /> Naubos ang oras
                    </span>
                  ) : null}
                  {attemptResult.alreadyPassed && !attemptResult.firstPass ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white">
                      Napasa mo na ito dati
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <h1 className="text-xl font-bold text-ink">{attemptResult.title}</h1>
              {attemptResult.firstPass ? (
                <Alert tone="success" className="mt-4" title="Unang pagkakapasa">
                  Nakuha mo ang {attemptResult.activityXp} XP para sa gawaing ito
                  {attemptResult.badgeXp > 0 ? ` at ${attemptResult.badgeXp} XP mula sa mga badge` : ""}.
                  Ang XP ay hindi na mauulit sa susunod na pagtatangka.
                </Alert>
              ) : (
                <Alert tone="info" className="mt-4" title="Walang bagong XP">
                  {attemptResult.alreadyPassed
                    ? "Naipasa mo na ang gawaing ito noon. Maaari mong subukan muli para sa praktis, ngunit isang beses lang ang XP."
                    : "Hindi pa naabot ang porsyentong kailangan upang pumasa. Maaari mong balikan ang aralin at subukan muli."}
                </Alert>
              )}
              {result.newBadges?.length > 0 ? (
                <div className="animate-rise mt-4 rounded-xl border border-gold-strong/30 bg-gold-soft p-4">
                  <p className="text-sm font-bold text-brown">Mga bagong badge</p>
                  <ul className="mt-2 space-y-1.5">
                    {result.newBadges.map((badge) => (
                      <li key={badge.id} className="flex items-center gap-2 text-sm font-medium text-brown">
                        <Trophy className="size-4" aria-hidden="true" /> {badge.name} (+{badge.xp} XP)
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link to={basePath} className={buttonClass({ variant: "secondary", className: "flex-1" })}>
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  {isQuiz ? "Bumalik sa arena" : "Bumalik sa listahan"}
                </Link>
                <Button
                  variant={isQuiz ? "gold" : undefined}
                  className="flex-1"
                  onClick={() => {
                    setResult(null);
                    setAttempt(null);
                    setAnswers({});
                    submittedRef.current = false;
                  }}
                >
                  <RotateCcw className="size-4" aria-hidden="true" /> {isQuiz ? "Laban muli" : "Subukan muli"}
                </Button>
              </div>
            </div>
          </Card>

          <Card className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-strong">Balik-aral</p>
                <h2 className="mt-1 text-base font-bold text-ink">Paliwanag sa bawat tanong</h2>
              </div>
              <StarMeter value={stars} size="sm" />
            </div>
            <ol className="stagger-list mt-4 space-y-3">
              {attempt.questions.map((item, index) => {
                const feedback = feedbackMap.get(item.id);
                const selected = feedback?.selectedIndex;
                return (
                  <li key={item.id} className="rounded-xl border border-plum-100 p-4">
                    <div className="flex items-start gap-3">
                      <span className={cx("grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold text-white", feedback?.correct ? "bg-success" : "bg-danger")}>
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-ink">{item.prompt}</p>
                        <p className="mt-1 text-xs text-muted">
                          Iyong sagot: {selected === null || selected === undefined ? "Walang sagot" : item.options[selected]}
                        </p>
                        {!feedback?.correct ? (
                          <p className="mt-0.5 text-xs font-medium text-success-strong">
                            Tamang sagot: {item.options[feedback?.correctIndex]}
                          </p>
                        ) : null}
                        {feedback?.explanation ? (
                          <p className="mt-2 rounded-lg bg-cream-50 p-2.5 text-xs leading-relaxed text-muted">
                            {feedback.explanation}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>
        </div>
      </>
    );
  }

  if (attempt) {
    const progress = questions.length ? ((current + 1) / questions.length) * 100 : 0;
    const urgent = Boolean(attempt.activity.timerSeconds) && timeLeft !== null && timeLeft <= 30;
    return (
      <>
        <Seo
          title={`Sagutan: ${activity.title}`}
          description="Sagutan ang aktibidad o pagsusulit sa HASA."
          noindex
          path={`${basePath}/${id}`}
        />
        <div className="mx-auto max-w-3xl">
          <div className="animate-pop relative overflow-hidden rounded-3xl bg-plum-950 p-4 text-white shadow-[0_18px_40px_-22px_rgba(30,25,54,0.7)] sm:p-5">
            <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-60" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-10 -top-14 size-40 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />

            <div className="relative flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                  {isQuiz ? <Swords className="size-3.5" aria-hidden="true" /> : <ListChecks className="size-3.5" aria-hidden="true" />}
                  {isQuiz ? "Hamon" : "Aktibidad"} · Tanong {current + 1} ng {questions.length}
                </p>
                <h1 className="mt-1 truncate text-lg font-bold sm:text-xl">{activity.title}</h1>
              </div>
              <div className="flex items-center gap-2">
                {attempt.activity.timerSeconds ? (
                  <span
                    className={cx(
                      "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-extrabold tabular-nums",
                      urgent ? "animate-urgent bg-danger text-white" : "bg-white/10 text-gold",
                    )}
                    aria-label={`Natitirang oras: ${formatClock(timeLeft ?? attempt.activity.timerSeconds)}`}
                  >
                    <Clock3 className="size-4" aria-hidden="true" />
                    {formatClock(timeLeft ?? attempt.activity.timerSeconds)}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white">
                  <ListChecks className="size-4 text-gold" aria-hidden="true" /> {answeredCount}/{questions.length}
                </span>
              </div>
            </div>

            <div className="relative mt-4">
              <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-plum-300">
                <span>Paglalakbay sa hamon</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <ProgressBar value={progress} tone="gold" />
            </div>
          </div>

          {submitError ? <Alert tone="danger" className="mt-4" title="Hindi naisumite">{submitError}</Alert> : null}
          {validation ? <Alert tone="warning" className="mt-4">{validation}</Alert> : null}

          <Card key={question.id} className="animate-question mt-4 overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-base font-extrabold text-accent-deep">
                  {current + 1}
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-strong">
                    Tanong {current + 1}
                  </p>
                  <p className="text-[11px] text-muted">
                    {answers[question.id] !== undefined ? "Nasagot na" : "Piliin ang tamang sagot"}
                  </p>
                </div>
              </div>
              {answers[question.id] !== undefined ? (
                <Chip tone="success" className="text-[10px]">
                  <CheckCircle2 className="size-3" aria-hidden="true" /> Nasagot
                </Chip>
              ) : (
                <Chip tone="gold" className="text-[10px]">
                  <Sparkles className="size-3" aria-hidden="true" /> Bagong tanong
                </Chip>
              )}
            </div>

            <h2 className="mt-4 text-lg font-bold leading-snug text-ink sm:text-xl">{question.prompt}</h2>

            <div className="mt-5 space-y-2.5" role="radiogroup" aria-label={`Mga pagpipilian para sa tanong ${current + 1}`}>
              {question.options.map((option, index) => {
                const selected = answers[question.id] === index;
                return (
                  <label
                    key={index}
                    className={cx(
                      "group flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3.5 transition-[transform,border-color,background-color,box-shadow] duration-200 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30 focus-within:ring-offset-2",
                      selected
                        ? "-translate-y-0.5 border-accent bg-accent-soft shadow-[0_0_0_4px_rgba(138,56,245,0.08)]"
                        : "border-plum-100 bg-white hover:-translate-y-0.5 hover:border-plum-300 hover:shadow-md",
                    )}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={index}
                      checked={selected}
                      onChange={() => choose(question.id, index)}
                      className="sr-only"
                    />
                    <span
                      className={cx(
                        "grid size-8 shrink-0 place-items-center rounded-xl border-2 text-sm font-extrabold transition-colors duration-200",
                        selected
                          ? "border-accent bg-accent text-white"
                          : "border-plum-200 bg-cream-50 text-plum-600 group-hover:border-accent/40",
                      )}
                    >
                      {selected ? <CheckCircle2 className="size-4" aria-hidden="true" /> : String.fromCharCode(65 + index)}
                    </span>
                    <span className="min-w-0 flex-1 pt-1 text-sm leading-relaxed text-ink">{option}</span>
                  </label>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-plum-100 pt-4">
              <Button variant="secondary" onClick={goBack} disabled={current === 0}>
                <ArrowLeft className="size-4" aria-hidden="true" /> Bumalik
              </Button>
              <div className="flex gap-2">
                {current < questions.length - 1 ? (
                  <Button onClick={goNext}>
                    Susunod <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                ) : (
                  <Button variant={isQuiz ? "gold" : undefined} onClick={submitNow} disabled={pending}>
                    {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
                    {pending ? "Isinusumite…" : isQuiz ? "Isumite ang hamon" : "Isumite ang sagot"}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <div className="mt-4 rounded-2xl border border-plum-100 bg-white/80 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Mga antas ng tanong</p>
              <p className="text-xs font-semibold text-ink">
                {answeredCount} nasagot · {questions.length - answeredCount} natitira
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Mga bilang ng tanong">
              {questions.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrent(index)}
                  className={cx(
                    "grid size-9 place-items-center rounded-xl text-xs font-bold transition-all duration-200",
                    index === current
                      ? "bg-plum-800 text-white ring-2 ring-gold-strong ring-offset-2"
                      : answers[item.id] !== undefined
                        ? "bg-success text-white hover:-translate-y-0.5"
                        : "bg-white text-muted ring-1 ring-plum-200 hover:-translate-y-0.5 hover:bg-plum-50",
                  )}
                  aria-label={`Pumunta sa tanong ${index + 1}${answers[item.id] !== undefined ? " (nasagot)" : ""}`}
                  aria-current={index === current ? "step" : undefined}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-plum-100 pt-3 text-[11px] text-muted">
              <Zap className="size-3.5 shrink-0 text-gold-strong" aria-hidden="true" />
              {activity.xp} XP ang gantimpala kapag napasa mo ang hamon. Isang beses lang ito ibinibigay.
            </div>
          </div>
        </div>
      </>
    );
  }

  const stars = starsFor(activity.bestPercent, activity.passed);
  const facts = [
    { Icon: Trophy, label: "Gantimpala", value: `${activity.xp} XP` },
    { Icon: ListChecks, label: "Mga tanong", value: activity.questionCount },
    { Icon: Target, label: "Layunin", value: `${activity.passPercent}%` },
    {
      Icon: Clock3,
      label: "Oras",
      value: activity.timerSeconds ? `${Math.max(1, Math.round(activity.timerSeconds / 60))} min` : "Walang limit",
    },
  ];

  return (
    <>
      <Seo title={activity.title} description={activity.description} noindex path={`${basePath}/${id}`} />
      <Link to={basePath} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {isQuiz ? "Bumalik sa arena" : "Bumalik sa listahan"}
      </Link>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.9fr]">
        <section className="animate-rise relative overflow-hidden rounded-3xl bg-plum-950 p-5 text-white sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-60" aria-hidden="true" />
          <div className="animate-float-slow pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-24 left-1/4 size-56 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
          <Swords className="pointer-events-none absolute right-5 top-5 hidden size-24 rotate-12 text-white/[0.04] sm:block" aria-hidden="true" />

          <div className="relative">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-strong/30 bg-gold/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
                <ShieldCheck className="size-3.5" aria-hidden="true" /> {isQuiz ? "Hamon ng guro" : "Gawa ng guro"}
              </span>
              {activity.isClassContent ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white">
                  <Users className="size-3.5 text-gold" aria-hidden="true" /> Para sa inyong klase
                </span>
              ) : null}
              {activity.passed ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/20 px-3 py-1.5 text-[11px] font-semibold text-white">
                  <CheckCircle2 className="size-3.5" aria-hidden="true" /> Napasa na
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{activity.title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-plum-200">{activity.description}</p>
            {activity.lesson ? (
              <p className="mt-3 flex items-start gap-1.5 text-xs font-medium text-plum-300">
                <BookOpen className="mt-0.5 size-3.5 shrink-0 text-gold" aria-hidden="true" />
                <span className="line-clamp-2">{activity.lesson.title}</span>
              </p>
            ) : null}

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {facts.map((fact) => {
                const FactIcon = fact.Icon;
                return (
                  <div key={fact.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <FactIcon className="size-4 text-gold" aria-hidden="true" />
                    <p className="mt-2 text-lg font-extrabold leading-none">{fact.value}</p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-plum-300">{fact.label}</p>
                  </div>
                );
              })}
            </div>

            {submitError ? <Alert tone="danger" className="mt-4">{submitError}</Alert> : null}

            <Button
              variant="gold"
              size="lg"
              className="mt-6 w-full sm:w-auto"
              onClick={startAttempt}
              disabled={pending || activity.questionCount === 0}
            >
              {pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Play className="size-5" aria-hidden="true" />}
              {pending ? "Inihahanda ang hamon…" : isQuiz ? "Simulan ang hamon" : "Simulan ang aktibidad"}
            </Button>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-plum-300">
              <Zap className="size-3.5 text-gold" aria-hidden="true" />
              {isQuiz ? "Isang beses lang ibinibigay ang XP, sa unang pagkakapasa." : "Ang XP ay ibinibigay isang beses lamang."}
            </p>
            {activity.questionCount === 0 ? (
              <p className="mt-2 text-xs font-medium text-danger-soft">Wala pang tanong ang gawang ito.</p>
            ) : null}
          </div>
        </section>

        <div className="space-y-4">
          <Card className="animate-rise" style={{ animationDelay: "80ms" }}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-strong">Rekord</p>
                <h2 className="mt-1 text-lg font-bold text-ink">Iyong progreso</h2>
              </div>
              <span className="grid size-10 place-items-center rounded-2xl bg-gold-soft text-brown">
                <Medal className="size-5" aria-hidden="true" />
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-3xl font-extrabold tracking-tight text-ink">
                  {activity.attempts > 0 ? `${activity.bestPercent}%` : "—"}
                </p>
                <p className="text-xs text-muted">
                  {activity.attempts > 0 ? "Pinakamahusay na iskor" : "Wala pang iskor"}
                </p>
              </div>
              <StarMeter value={stars} />
            </div>
            <ProgressBar value={activity.bestPercent} tone={activity.passed ? "success" : "gold"} className="mt-3" />

            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-cream-50 p-2.5">
                <p className="text-lg font-bold text-ink">{activity.attempts}</p>
                <p className="text-[9px] font-bold uppercase tracking-wide text-muted">Pagtatangka</p>
              </div>
              <div className="rounded-xl bg-cream-50 p-2.5">
                <p className="text-lg font-bold text-ink">
                  {activity.passed ? "Pumasa" : activity.attempts > 0 ? "Laban pa" : "Bago"}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-wide text-muted">Katayuan</p>
              </div>
            </div>

            {activity.attempts > 0 ? (
              <Alert
                tone={activity.passed ? "success" : "info"}
                className="mt-3"
                title={activity.passed ? "Napasa mo na ito" : "May nakaraang pagtatangka ka na"}
              >
                {activity.passed
                  ? "Maaari ka pang magsanay muli. Ang XP ay ibinibigay lamang sa unang pagkakapasa."
                  : `Ang pinakamahusay mong iskor ay ${activity.bestPercent}%. Kailangan ng ${activity.passPercent}% upang pumasa.`}
              </Alert>
            ) : (
              <p className="mt-3 rounded-xl bg-gold-soft p-3 text-xs font-medium leading-relaxed text-brown">
                <Sparkles className="mr-1 inline size-3.5" aria-hidden="true" />
                Wala ka pang rekord sa hamon na ito. Simulan ang laban para makakuha ng unang bituin.
              </p>
            )}
          </Card>

          <Card className="animate-rise" style={{ animationDelay: "140ms" }}>
            <h2 className="text-base font-bold text-ink">
              {isQuiz ? "Mga patakaran ng hamon" : "Mga paalala"}
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted">
              <li className="flex gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                May paliwanag ang bawat tanong pagkatapos mong isumite.
              </li>
              <li className="flex gap-2.5">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-gold-strong" aria-hidden="true" />
                Sagutin ang lahat ng tanong bago isumite.
              </li>
              {activity.timerSeconds ? (
                <li className="flex gap-2.5">
                  <Clock3 className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden="true" />
                  May orasan na {Math.max(1, Math.round(activity.timerSeconds / 60))} minuto. Awtomatikong isusumite kapag naubos.
                </li>
              ) : (
                <li className="flex gap-2.5">
                  <Clock3 className="mt-0.5 size-4 shrink-0 text-sky" aria-hidden="true" />
                  Walang limitasyon sa oras. Mag-isip nang mabuti bago sumagot.
                </li>
              )}
              <li className="flex gap-2.5">
                <Trophy className="mt-0.5 size-4 shrink-0 text-gold-strong" aria-hidden="true" />
                Isang beses lang ibinibigay ang XP, sa unang pagkakapasa.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
