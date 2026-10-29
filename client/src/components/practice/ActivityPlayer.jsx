import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Flame,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import Alert from "../ui/Alert.jsx";
import Button from "../ui/Button.jsx";
import Chip from "../ui/Chip.jsx";
import Modal from "../ui/Modal.jsx";
import ProgressBar from "../ui/ProgressBar.jsx";
import QuestionCard from "../learning/QuestionCard.jsx";
import FeedbackPanel from "../learning/FeedbackPanel.jsx";
import { useProgress } from "../../app/ProgressProvider.jsx";
import { PROGRESS_STORAGE_NOTE } from "../../services/progressStore.js";
import { cx } from "../../utils/cx.js";

function formatTime(seconds) {
  const safe = Math.max(0, Math.round(Number(seconds) || 0));
  const minutes = Math.floor(safe / 60);
  const remainder = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

/**
 * Ang aktwal na laro: tanong, sagot, feedback, timer, score, results,
 * retry, at one-time XP. Walang network call; ang progress ay lokal.
 */
export default function ActivityPlayer({ activity, onClose }) {
  const { completeActivity, progress, storageAvailable } = useProgress();
  const questions = activity?.questions ?? [];
  const totalQuestions = questions.length;
  const timerSeconds = Number.isFinite(activity?.timerSeconds)
    ? activity.timerSeconds
    : null;

  const [phase, setPhase] = useState("playing");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [outcome, setOutcome] = useState(null);

  const answersRef = useRef([]);
  const finishedRef = useRef(false);

  const finish = useCallback(
    (timedOut = false) => {
      if (finishedRef.current || totalQuestions === 0) return;

      finishedRef.current = true;
      const correct = answersRef.current.filter((answer) => answer.correct).length;
      const result = completeActivity(activity, correct, totalQuestions, {
        timedOut,
      });

      setOutcome({ ...result, timedOut });
      setPhase("results");
    },
    [activity, completeActivity, totalQuestions],
  );

  useEffect(() => {
    if (phase !== "playing" || timeLeft === null || totalQuestions === 0) {
      return undefined;
    }

    if (timeLeft <= 0) {
      finish(true);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((value) => (value === null ? null : Math.max(0, value - 1)));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [phase, timeLeft, totalQuestions, finish]);

  const resetRun = useCallback(() => {
    answersRef.current = [];
    finishedRef.current = false;
    setCurrent(0);
    setSelected(null);
    setSubmitted(false);
    setAnswers([]);
    setTimeLeft(timerSeconds);
    setOutcome(null);
    setPhase("playing");
  }, [timerSeconds]);

  const question = questions[current];
  const isLastQuestion = current === totalQuestions - 1;
  const isCorrect = submitted && selected === question?.correctIndex;
  const correctCount = answers.filter((answer) => answer.correct).length;
  const passPercent = Math.min(
    100,
    Math.max(0, Number(activity?.passPercent) || 60),
  );
  const completion = progress?.completions?.[activity?.id];

  function submitAnswer() {
    if (selected === null || submitted || !question) return;

    const record = {
      questionId: question.id,
      selectedIndex: selected,
      correctIndex: question.correctIndex,
      correct: selected === question.correctIndex,
    };
    const nextAnswers = [...answersRef.current, record];
    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);
    setSubmitted(true);
  }

  function goNext() {
    if (!submitted) return;

    if (isLastQuestion) {
      finish(false);
      return;
    }

    setCurrent((value) => value + 1);
    setSelected(null);
    setSubmitted(false);
  }

  if (!activity) return null;

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      eyebrow="Practice activity"
      title={activity.title}
      subtitle={`${totalQuestions} questions · pass mark ${passPercent}% · +${activity.xp} XP`}
    >
      {phase === "playing" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-strong">
                Question {current + 1} of {totalQuestions}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Sagutin ang bawat tanong at i-submit bago lumipat sa susunod.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {completion?.completed ? (
                <Chip tone="success">
                  Best {completion.bestCorrect}/{completion.total}
                </Chip>
              ) : null}
              {timeLeft !== null ? (
                <span
                  role="timer"
                  aria-label="Natitirang oras"
                  className={cx(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-bold tabular-nums",
                    timeLeft <= 15
                      ? "border-rose-300 bg-rose-50 text-rose-700"
                      : "border-line bg-cream-50 text-ink",
                  )}
                >
                  <Clock3 className="h-4 w-4" aria-hidden="true" />
                  {formatTime(timeLeft)}
                </span>
              ) : null}
            </div>
          </div>

          <ProgressBar
            // Bilang ng nasagutan, hindi index ng tanong: dating 0% ito sa
            // unang tanong kahit nakabukas na ang player.
            value={current + (submitted ? 1 : 0)}
            max={Math.max(1, totalQuestions)}
            tone="brand"
            size="sm"
            label={`Tanong ${current + 1} / ${totalQuestions}`}
          />

          {timeLeft !== null && timeLeft <= 15 && timeLeft > 0 ? (
            <p role="status" className="text-xs font-semibold text-rose-700">
              Malapit nang maubos ang oras. I-submit ang sagot bago ito
              matapos.
            </p>
          ) : null}

          {question ? (
            <QuestionCard
              question={question}
              number={current + 1}
              selectedIndex={selected}
              onSelect={setSelected}
              disabled={submitted}
              revealAnswer={submitted}
            />
          ) : (
            <Alert variant="warning" title="Walang tanong">
              Wala pang tanong ang aktibidad na ito. Bumalik na lang sa
              Practice.
            </Alert>
          )}

          {submitted ? (
            <FeedbackPanel
              correct={isCorrect}
              explanation={question?.explanation}
            />
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <p className="text-xs font-medium text-muted" aria-live="polite">
              Tamang sagot: {correctCount} / {answers.length} nasagot
            </p>

            {!submitted ? (
              <Button
                onClick={submitAnswer}
                disabled={selected === null || !question}
                size="lg"
              >
                Submit answer
              </Button>
            ) : (
              <Button onClick={goNext} size="lg">
                {isLastQuestion ? "See results" : "Next question"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      ) : null}

      {phase === "results" && outcome ? (
        <div className="space-y-5">
          <div className="text-center">
            <span
              className={cx(
                "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
                outcome.passed
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gold-100 text-gold-700",
              )}
              aria-hidden="true"
            >
              {outcome.passed ? (
                <Trophy className="h-8 w-8" />
              ) : (
                <RotateCcw className="h-8 w-8" />
              )}
            </span>
            <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink">
              {outcome.passed ? "Activity complete!" : "Keep practicing"}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {outcome.passed
                ? "Nakumpleto mo ang aktibidad."
                : `Kailangan ng ${outcome.passPercent}% para pumasa.`}
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-canvas/60 p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-strong">
                  Resulta
                </p>
                <p className="mt-1 text-3xl font-black tracking-tight text-plum-800">
                  {outcome.percent}%
                </p>
              </div>
              <p className="text-sm font-semibold text-ink">
                {outcome.correct} / {outcome.total} correct
              </p>
            </div>
            <ProgressBar
              className="mt-3"
              value={outcome.percent}
              max={100}
              tone={outcome.passed ? "success" : "warning"}
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Chip tone={outcome.passed ? "success" : "warning"}>
                {outcome.passed ? "Passed" : "Not passed"}
              </Chip>
              <Chip tone="muted">
                Attempt {outcome.attempts}
              </Chip>
              <Chip tone="muted">
                Best {outcome.bestCorrect}/{outcome.total}
              </Chip>
            </div>
          </div>

          {outcome.timedOut ? (
            <Alert variant="warning" title="Naubos ang oras">
              Isinumite ang mga nasagutan bago matapos ang timer. Maaari mong
              subukan muli.
            </Alert>
          ) : null}

          {outcome.xpAwarded > 0 ? (
            <Alert
              variant="success"
              title={`You earned +${outcome.xpAwarded} XP`}
            >
              {outcome.activityXp > 0
                ? `${outcome.activityXp} XP mula sa aktibidad.`
                : null}
              {outcome.badgeXp > 0
                ? ` ${outcome.badgeXp} XP mula sa bagong badge.`
                : null}
            </Alert>
          ) : outcome.alreadyCompleted ? (
            <Alert variant="info" title="No new XP">
              Nakuha mo na ang XP para sa aktibidad na ito. Ang retry ay
              nagpapabuti lamang ng best score at hindi na nagbibigay ng
              panibagong XP.
            </Alert>
          ) : (
            <Alert variant="warning" title="No XP this time">
              Kailangan ng hindi bababa sa {outcome.passPercent}% para makakuha
              ng XP. Subukan muli kapag handa ka na.
            </Alert>
          )}

          {outcome.newBadges?.length > 0 ? (
            <div className="rounded-2xl border border-gold-strong/40 bg-gold-soft/50 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-brown">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Bagong badge
              </p>
              <ul className="mt-2 space-y-1.5">
                {outcome.newBadges.map((badge) => (
                  <li key={badge.id} className="text-sm text-ink">
                    <span className="font-semibold">{badge.name}</span>
                    <span className="text-muted"> · +{badge.xp} XP</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-white p-3">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted">
                <Flame className="h-3.5 w-3.5 text-gold-strong" aria-hidden="true" />
                Streak
              </p>
              <p className="mt-1 text-lg font-bold text-ink">
                {outcome.streak} araw
              </p>
              <p className="text-[10px] text-muted">
                {outcome.streakIncreased
                  ? "Umakyat ng isang araw."
                  : outcome.streakReset
                    ? "Nagsimula muli ngayong araw."
                    : "Nabibilang na ngayong araw."}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                Level
              </p>
              <p className="mt-1 text-lg font-bold text-ink">
                Level {outcome.level}
              </p>
              <p className="text-[10px] text-muted">
                {outcome.totalXp.toLocaleString()} XP total
              </p>
            </div>
            <div className="rounded-xl border border-line bg-white p-3">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                Best score
              </p>
              <p className="mt-1 text-lg font-bold text-ink">
                {outcome.bestPercent}%
              </p>
              <p className="text-[10px] text-muted">
                {outcome.bestCorrect}/{outcome.total} correct
              </p>
            </div>
          </div>

          {outcome.leveledUp ? (
            <Alert variant="success" title="Level up!">
              Umakyat ka sa Level {outcome.level}.
            </Alert>
          ) : null}

          <div className="flex flex-wrap items-center gap-2.5 border-t border-line pt-4">
            <Button onClick={resetRun} size="lg">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Try again
            </Button>
            <Button variant="secondary" onClick={onClose} size="lg">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Practice
            </Button>
          </div>

          <p
            className={cx(
              "text-[11px] leading-relaxed",
              storageAvailable ? "text-muted" : "font-semibold text-rose-700",
            )}
          >
            {storageAvailable
              ? PROGRESS_STORAGE_NOTE
              : "Hindi maisave ang progress sa browser na ito. Maaaring naka-block ang local storage."}
          </p>
        </div>
      ) : null}
    </Modal>
  );
}
