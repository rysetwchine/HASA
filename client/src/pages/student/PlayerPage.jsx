import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  ListChecks,
  Loader2,
  RotateCcw,
  Send,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../app/AuthProvider.jsx";
import Seo from "../../components/Seo.jsx";
import { Alert, Button, Card, Chip, Loading, ProgressBar, buttonClass } from "../../components/ui.jsx";
import { api, errorMessage } from "../../lib/api.js";
import { useApi } from "../../lib/useApi.js";
import { cx } from "../../utils/cx.js";

function formatClock(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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
    if (!attempt?.activity?.timerSeconds) return undefined;
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
  }, [attempt, handleSubmit]);

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

  if (result) {
    const attemptResult = result.attempt;
    return (
      <>
        <Seo title={`Resulta: ${activity.title}`} description="Resulta ng iyong pagsusulit sa HASA." noindex path={`${basePath}/${id}`} />
        <div className="mx-auto max-w-3xl">
          <Card className={cx("overflow-hidden p-0", attemptResult.passed ? "border-success/30" : "border-danger/20")}>
            <div className={cx("px-6 py-8 text-center text-white", attemptResult.passed ? "bg-success" : "bg-plum-800")}>
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white/15">
                {attemptResult.passed ? <Trophy className="size-7" aria-hidden="true" /> : <Target className="size-7" aria-hidden="true" />}
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                {attemptResult.passed ? "Napasa mo!" : "Subukan muli"}
              </p>
              <p className="mt-2 text-5xl font-extrabold tracking-tight">{attemptResult.percent}%</p>
              <p className="mt-1 text-sm font-medium text-white/80">
                {attemptResult.score} ng {attemptResult.total} ang tama
              </p>
            </div>
            <div className="p-5 sm:p-6">
              <h1 className="text-xl font-bold text-ink">{attemptResult.title}</h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip tone={attemptResult.passed ? "success" : "danger"}>
                  {attemptResult.passed ? <CheckCircle2 className="size-3.5" aria-hidden="true" /> : <XCircle className="size-3.5" aria-hidden="true" />}
                  {attemptResult.passed ? "Pumasa" : `Kailangan ng ${activity.passPercent}%`}
                </Chip>
                <Chip tone="gold"><Trophy className="size-3.5" aria-hidden="true" /> +{attemptResult.xpAwarded} XP</Chip>
                {attemptResult.timedOut ? <Chip tone="warning"><Clock3 className="size-3.5" aria-hidden="true" /> Naubos ang oras</Chip> : null}
                {attemptResult.alreadyPassed && !attemptResult.firstPass ? (
                  <Chip>Naipasa mo na ito dati</Chip>
                ) : null}
              </div>
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
                <div className="mt-4 rounded-xl border border-gold-strong/30 bg-gold-soft p-4">
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
                  <ArrowLeft className="size-4" aria-hidden="true" /> Bumalik sa listahan
                </Link>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setResult(null);
                    setAttempt(null);
                    setAnswers({});
                    submittedRef.current = false;
                  }}
                >
                  <RotateCcw className="size-4" aria-hidden="true" /> Subukan muli
                </Button>
              </div>
            </div>
          </Card>

          <Card className="mt-5">
            <h2 className="text-base font-bold text-ink">Paliwanag sa bawat tanong</h2>
            <ol className="mt-4 space-y-3">
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
    return (
      <>
        <Seo title={`Sagutan: ${activity.title}`} description="Sagutan ang aktibidad o pagsusulit sa HASA." noindex path={`${basePath}/${id}`} />
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-strong">
                {isQuiz ? "Pagsusulit" : "Aktibidad"}
              </p>
              <h1 className="mt-1 text-xl font-bold text-ink">{activity.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              {attempt.activity.timerSeconds ? (
                <Chip tone={timeLeft !== null && timeLeft <= 30 ? "danger" : "warning"}>
                  <Clock3 className="size-3.5" aria-hidden="true" /> {formatClock(timeLeft ?? attempt.activity.timerSeconds)}
                </Chip>
              ) : null}
              <Chip tone="gold">{answeredCount}/{questions.length} nasagot</Chip>
            </div>
          </div>

          <ProgressBar value={progress} className="mb-4" />

          {submitError ? <Alert tone="danger" className="mb-4" title="Hindi naisumite">{submitError}</Alert> : null}
          {validation ? <Alert tone="warning" className="mb-4">{validation}</Alert> : null}

          <Card>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Tanong {current + 1} ng {questions.length}</p>
              {answers[question.id] !== undefined ? <Chip tone="success" className="text-[10px]"><CheckCircle2 className="size-3" aria-hidden="true" /> Nasagot</Chip> : null}
            </div>
            <h2 className="mt-3 text-lg font-bold leading-snug text-ink sm:text-xl">{question.prompt}</h2>
            <div className="mt-5 space-y-2.5" role="radiogroup" aria-label={`Mga pagpipilian para sa tanong ${current + 1}`}>
              {question.options.map((option, index) => {
                const selected = answers[question.id] === index;
                return (
                  <label
                    key={index}
                    className={cx(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors",
                      selected ? "border-accent bg-accent-soft" : "border-plum-200 hover:border-plum-400 hover:bg-plum-50/40",
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
                    <span className={cx("grid size-6 shrink-0 place-items-center rounded-full border text-xs font-bold", selected ? "border-accent bg-accent text-white" : "border-plum-300 text-plum-600")}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="pt-0.5 text-sm leading-relaxed text-ink">{option}</span>
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
                  <Button onClick={submitNow} disabled={pending}>
                    {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
                    {pending ? "Isinusumite…" : "Isumite ang sagot"}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Mga bilang ng tanong">
            {questions.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrent(index)}
                className={cx(
                  "grid size-8 place-items-center rounded-lg text-xs font-bold transition-colors",
                  index === current
                    ? "bg-plum-800 text-white"
                    : answers[item.id] !== undefined
                      ? "bg-success-soft text-success-strong"
                      : "bg-white text-muted ring-1 ring-plum-200",
                )}
                aria-label={`Pumunta sa tanong ${index + 1}`}
                aria-current={index === current ? "step" : undefined}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title={activity.title} description={activity.description} noindex path={`${basePath}/${id}`} />
      <Link to={basePath} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" /> Bumalik sa listahan
      </Link>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone={isQuiz ? "accent" : "info"}>{isQuiz ? "Pagsusulit" : "Aktibidad"}</Chip>
            <Chip tone="gold"><Trophy className="size-3.5" aria-hidden="true" /> {activity.xp} XP</Chip>
            <Chip><Target className="size-3.5" aria-hidden="true" /> {activity.passPercent}% upang pumasa</Chip>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{activity.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{activity.description}</p>
          {activity.lesson ? <p className="mt-3 text-xs font-medium text-plum-600">Kaugnay na aralin: {activity.lesson.title}</p> : null}

          <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-cream-50 p-3 text-center">
            <div>
              <p className="text-xl font-bold text-ink">{activity.questionCount}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Tanong</p>
            </div>
            <div>
              <p className="text-xl font-bold text-ink">{activity.attempts}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Pagtatangka</p>
            </div>
            <div>
              <p className="text-xl font-bold text-ink">{activity.bestPercent}%</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Pinakamahusay</p>
            </div>
          </div>

          {activity.attempts > 0 ? (
            <Alert tone={activity.passed ? "success" : "info"} className="mt-4" title={activity.passed ? "Napasa mo na ito" : "May nakaraang pagtatangka ka na"}>
              {activity.passed
                ? "Maaari ka pang magsanay muli. Ang XP ay ibinibigay lamang sa unang pagkakapasa."
                : `Ang pinakamahusay mong iskor ay ${activity.bestPercent}%. Kailangan ng ${activity.passPercent}% upang pumasa.`}
            </Alert>
          ) : null}

          {submitError ? <Alert tone="danger" className="mt-4">{submitError}</Alert> : null}

          <Button size="lg" className="mt-5 w-full" onClick={startAttempt} disabled={pending || activity.questionCount === 0}>
            {pending ? <Loader2 className="size-4.5 animate-spin" aria-hidden="true" /> : <ListChecks className="size-4.5" aria-hidden="true" />}
            {pending ? "Inihahanda…" : activity.attempts > 0 ? "Simulan ang bagong pagtatangka" : "Simulan"}
          </Button>
          {activity.questionCount === 0 ? <p className="mt-2 text-center text-xs text-danger">Wala pang tanong ang gawaing ito.</p> : null}
        </Card>

        <Card>
          <h2 className="text-base font-bold text-ink">Mga paalala</h2>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted">
            <li className="flex gap-2.5"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" /> May paliwanag ang bawat tanong pagkatapos mong isumite.</li>
            <li className="flex gap-2.5"><AlertCircle className="mt-0.5 size-4 shrink-0 text-gold-strong" aria-hidden="true" /> Sagutin ang lahat ng tanong bago isumite.</li>
            {activity.timerSeconds ? (
              <li className="flex gap-2.5"><Clock3 className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden="true" /> May timer na {Math.round(activity.timerSeconds / 60)} minuto. Awtomatikong isusumite kapag naubos.</li>
            ) : null}
            <li className="flex gap-2.5"><Trophy className="mt-0.5 size-4 shrink-0 text-gold-strong" aria-hidden="true" /> Isang beses lang ibinibigay ang XP, sa unang pagkakapasa.</li>
          </ul>
        </Card>
      </div>
    </>
  );
}
