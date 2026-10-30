import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  KeyRound,
  ShieldAlert,
  Star,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import Seo from "../../components/Seo.jsx";
import {
  Alert,
  Button,
  Card,
  Chip,
  EmptyState,
  Loading,
  Modal,
  PageHeader,
  ProgressBar,
  buttonClass,
} from "../../components/ui.jsx";
import { api, errorMessage } from "../../lib/api.js";
import { formatDate, readingLevelLabel } from "../../lib/format.js";
import { useApi } from "../../lib/useApi.js";
import { cx } from "../../utils/cx.js";

export default function StudentDetailPage() {
  const { id } = useParams();
  const { data, error, loading, reload } = useApi(`/teacher/students/${id}`);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState("");
  const [temporary, setTemporary] = useState("");
  const [copied, setCopied] = useState(false);

  if (loading) return <Loading label="Binubuksan ang rekord ng mag-aaral…" />;
  if (error) {
    if (error.status === 404) {
      return (
        <EmptyState
          icon={ShieldAlert}
          title="Hindi mahanap ang mag-aaral"
          description="Maaaring wala ito sa iyong klase o naalis na ang account."
          action={<Link to="/teacher/mga-mag-aaral" className={buttonClass()}>Bumalik sa listahan</Link>}
        />
      );
    }
    return <Alert tone="danger" title="Hindi mabuksan ang rekord">{errorMessage(error)}</Alert>;
  }

  const { student, progress, achievements } = data;
  const stats = progress.stats;
  const earned = achievements.badges.filter((badge) => badge.earned);

  const resetPassword = async () => {
    setResetting(true);
    setResetError("");
    try {
      const payload = await api.post(`/teacher/students/${student.id}/reset-password`);
      setTemporary(payload.temporaryPassword);
      setResetOpen(false);
      reload();
    } catch (requestError) {
      setResetError(errorMessage(requestError));
    } finally {
      setResetting(false);
    }
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(temporary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <Seo
        title={`Rekord ni ${student.displayName}`}
        description="Detalyadong progreso at resulta ng mag-aaral para sa guro."
        noindex
        path={`/teacher/mga-mag-aaral/${student.id}`}
      />
      <Link to="/teacher/mga-mag-aaral" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" /> Bumalik sa mga mag-aaral
      </Link>

      <Card className="mb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-plum-800 text-lg font-bold text-white">
              {student.displayName.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-ink">{student.displayName}</h1>
              <p className="text-sm text-muted">@{student.username} · {student.class?.name}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Chip tone="info">{readingLevelLabel(student.readingLevel)}</Chip>
                <Chip tone="gold"><Star className="size-3.5" aria-hidden="true" /> {stats.points} XP · Antas {stats.level}</Chip>
                <Chip>Miyembro mula {formatDate(student.createdAt)}</Chip>
              </div>
            </div>
          </div>
          <Button variant="secondary" onClick={() => { setResetError(""); setResetOpen(true); }}>
            <KeyRound className="size-4" aria-hidden="true" /> I-reset ang password
          </Button>
        </div>
      </Card>

      {temporary ? (
        <Alert tone="warning" className="mb-5" title="Pansamantalang password na ginawa">
          <p>Ibigay ito sa mag-aaral at ipachange agad pagkatapos mag-log in. Hindi na ito muling ipapakita.</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <code className="rounded-lg bg-white px-3 py-1.5 font-mono text-sm font-bold text-ink">{temporary}</code>
            <button type="button" onClick={copyPassword} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-plum-800">
              {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
              {copied ? "Nakopya" : "Kopyahin"}
            </button>
            <button type="button" onClick={() => setTemporary("")} className="text-xs font-semibold underline">Isara</button>
          </div>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted">Natapos na aralin</p><p className="mt-1 text-2xl font-bold text-ink">{stats.lessonsCompleted}/{stats.lessonsTotal}</p></Card>
        <Card className="p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted">Average na iskor</p><p className="mt-1 text-2xl font-bold text-ink">{stats.averageScore}%</p></Card>
        <Card className="p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted">Naipasang gawain</p><p className="mt-1 text-2xl font-bold text-ink">{stats.activitiesPassed}</p></Card>
        <Card className="p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted">Sunod-sunod</p><p className="mt-1 text-2xl font-bold text-ink">{stats.streak} araw</p></Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex items-center gap-2">
            <BookOpen className="size-4.5 text-accent" aria-hidden="true" />
            <h2 className="text-lg font-bold text-ink">Mga aralin</h2>
          </div>
          {progress.lessons.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Wala pang aralin sa klase.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {progress.lessons.map((lesson) => (
                <li key={lesson.id} className="flex items-center gap-3 rounded-xl border border-plum-100 p-3">
                  <span className={cx("grid size-8 shrink-0 place-items-center rounded-lg", lesson.progress === "completed" ? "bg-success-soft text-success-strong" : "bg-plum-100 text-plum-600")}>
                    {lesson.progress === "completed" ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <BookOpen className="size-4" aria-hidden="true" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{lesson.title}</p>
                    <p className="text-[11px] text-muted">{lesson.unit}</p>
                  </div>
                  <Chip tone={lesson.progress === "completed" ? "success" : "neutral"}>
                    {lesson.progress === "completed" ? "Tapos" : lesson.progress === "in_progress" ? "Sinimulan" : "Hindi pa"}
                  </Chip>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <Trophy className="size-4.5 text-gold-strong" aria-hidden="true" />
            <h2 className="text-lg font-bold text-ink">Mga badge</h2>
          </div>
          {earned.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Wala pang badge ang mag-aaral.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {earned.map((badge) => (
                <li key={badge.id} className="flex items-center gap-3 rounded-xl border border-gold-strong/25 bg-gold-soft p-3">
                  <Award className="size-4.5 shrink-0 text-brown" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">{badge.name}</p>
                    <p className="text-[11px] text-brown">{formatDate(badge.earnedAt)} · +{badge.xp} XP</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 border-t border-plum-100 pt-3">
            <div className="mb-1.5 flex justify-between text-xs text-muted"><span>Pagkumpleto ng aralin</span><span>{stats.lessonProgressPercent}%</span></div>
            <ProgressBar value={stats.lessonProgressPercent} tone="success" />
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <div className="flex items-center gap-2">
          <Target className="size-4.5 text-accent" aria-hidden="true" />
          <h2 className="text-lg font-bold text-ink">Kasaysayan ng pagtatangka</h2>
        </div>
        {progress.attemptHistory.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Wala pang naisumiteng gawain.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-plum-200 text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="pb-2.5 pr-4">Gawain</th>
                  <th className="pb-2.5 pr-4">Uri</th>
                  <th className="pb-2.5 pr-4">Iskor</th>
                  <th className="pb-2.5 pr-4">Resulta</th>
                  <th className="pb-2.5">Petsa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-plum-100">
                {progress.attemptHistory.map((attempt) => (
                  <tr key={attempt.id}>
                    <td className="py-3 pr-4 font-semibold text-ink">{attempt.title}</td>
                    <td className="py-3 pr-4 text-muted">{attempt.kind === "quiz" ? "Pagsusulit" : "Aktibidad"}</td>
                    <td className="py-3 pr-4">{attempt.score}/{attempt.total} ({attempt.percent}%)</td>
                    <td className="py-3 pr-4">
                      <Chip tone={attempt.passed ? "success" : "danger"}>
                        {attempt.passed ? <CheckCircle2 className="size-3.5" aria-hidden="true" /> : <XCircle className="size-3.5" aria-hidden="true" />}
                        {attempt.passed ? "Pumasa" : "Hindi"}
                      </Chip>
                    </td>
                    <td className="py-3 text-muted">{formatDate(attempt.completedAt, { withTime: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="I-reset ang password?"
        description={`Gagawa ng pansamantalang password para kay ${student.displayName}.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setResetOpen(false)}>Kanselahin</Button>
            <Button variant="danger" onClick={resetPassword} disabled={resetting}>
              {resetting ? "Ginagawa…" : "Oo, i-reset"}
            </Button>
          </>
        }
      >
        <Alert tone="warning" title="Mahalagang paalala">
          Mawawala ang lahat ng kasalukuyang session ng mag-aaral. Ibigay sa kanya ang
          pansamantalang password at ipachange agad ito sa profile.
        </Alert>
        {resetError ? <Alert tone="danger" className="mt-3">{resetError}</Alert> : null}
      </Modal>
    </>
  );
}
