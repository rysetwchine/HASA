import { Link } from "react-router";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Flame,
  ListChecks,
  Star,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Seo from "../../components/Seo.jsx";
import {
  Alert,
  Card,
  Chip,
  EmptyState,
  Loading,
  PageHeader,
  ProgressBar,
  StatCard,
  buttonClass,
} from "../../components/ui.jsx";
import { errorMessage } from "../../lib/api.js";
import { formatDate, formatNumber } from "../../lib/format.js";
import { useApi } from "../../lib/useApi.js";
import { cx } from "../../utils/cx.js";

const REASONS = {
  lesson_completed: "Nakumpletong aralin",
  activity_passed: "Naipasang aktibidad o pagsusulit",
  badge_awarded: "Gantimpalang badge",
};

export default function ProgressPage() {
  const { data, error, loading } = useApi("/student/progress");

  if (loading) return <Loading label="Kinukuha ang iyong progreso…" />;
  if (error) return <Alert tone="danger" title="Hindi mabuksan ang progreso">{errorMessage(error)}</Alert>;

  const { stats, lessons, attemptHistory, pointsHistory } = data;
  const completed = lessons.filter((lesson) => lesson.progress === "completed");
  const inProgress = lessons.filter((lesson) => lesson.progress === "in_progress");
  const passedAttempts = attemptHistory.filter((attempt) => attempt.passed);

  return (
    <>
      <Seo
        title="Aking Pag-unlad"
        description="Tingnan ang iyong mga natapos na aralin, iskor sa pagsusulit, puntos, at kasaysayan ng pag-aaral."
        noindex
        path="/student/progreso"
      />
      <PageHeader
        eyebrow="Pag-unlad"
        title="Aking Pag-unlad"
        description="Tunay na datos mula sa iyong account. Dito makikita ang mga aralin, pagtatangka, at puntos na iyong nakuha."
        actions={<Chip tone="gold"><Star className="size-3.5" aria-hidden="true" /> Antas {stats.level}</Chip>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookOpen} label="Natapos na aralin" value={`${stats.lessonsCompleted}/${stats.lessonsTotal}`} tone="success" />
        <StatCard icon={Target} label="Average na iskor" value={`${stats.averageScore}%`} hint={`${attemptHistory.length} pagtatangka`} />
        <StatCard icon={Flame} label="Sunod-sunod na araw" value={stats.streak} tone="gold" />
        <StatCard icon={Trophy} label="Kabuuang puntos" value={formatNumber(stats.points)} hint={`Antas ${stats.level}`} tone="plum" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-ink">Pagkumpleto ng mga aralin</h2>
              <p className="mt-0.5 text-xs text-muted">{completed.length} natapos · {inProgress.length} sinimulan</p>
            </div>
            <BarChart3 className="size-5 text-plum-400" aria-hidden="true" />
          </div>
          <ProgressBar value={stats.lessonProgressPercent} label="Kabuuang progreso" className="mt-4" tone="success" />
          {lessons.length === 0 ? (
            <EmptyState icon={BookOpen} title="Wala pang aralin" description="Magdagdag ang iyong guro ng aralin para sa klase." />
          ) : (
            <ul className="mt-4 space-y-2">
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    to={`/student/aralin/${lesson.id}`}
                    className="flex items-center gap-3 rounded-xl border border-plum-100 p-3 hover:border-plum-300 hover:bg-plum-50/40"
                  >
                    <span className={cx("grid size-9 shrink-0 place-items-center rounded-lg", lesson.progress === "completed" ? "bg-success-soft text-success-strong" : "bg-plum-100 text-plum-700")}>
                      {lesson.progress === "completed" ? <CheckCircle2 className="size-4.5" aria-hidden="true" /> : <BookOpen className="size-4.5" aria-hidden="true" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">{lesson.title}</span>
                      <span className="text-xs text-muted">{lesson.unit}</span>
                    </span>
                    <Chip tone={lesson.progress === "completed" ? "success" : lesson.progress === "in_progress" ? "info" : "neutral"}>
                      {lesson.progress === "completed" ? "Tapos" : lesson.progress === "in_progress" ? "Sinimulan" : "Hindi pa"}
                    </Chip>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-5">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-ink">Puntos kamakailan</h2>
              <TrendingUp className="size-5 text-plum-400" aria-hidden="true" />
            </div>
            {pointsHistory.length === 0 ? (
              <p className="mt-3 rounded-xl bg-cream-50 p-3.5 text-sm text-muted">
                Wala pang puntos. Magsimula sa isang aralin o aktibidad.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-plum-100">
                {pointsHistory.map((entry, index) => (
                  <li key={`${entry.createdAt}-${index}`} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold-soft text-brown">
                      <Star className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{REASONS[entry.reason] || entry.reason}</p>
                      <p className="text-[11px] text-muted">{formatDate(entry.createdAt, { withTime: true })}</p>
                    </div>
                    <span className="text-sm font-bold text-success-strong">+{entry.delta} XP</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="text-base font-bold text-ink">Buod ng pagsusulit</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted"><ClipboardList className="size-4" aria-hidden="true" /> Aktibidad na napasa</dt>
                <dd className="font-bold text-ink">{stats.activitiesPassed}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted"><ListChecks className="size-4" aria-hidden="true" /> Pagsusulit na napasa</dt>
                <dd className="font-bold text-ink">{stats.quizzesPassed}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted"><Trophy className="size-4" aria-hidden="true" /> Mga badge</dt>
                <dd className="font-bold text-ink">{stats.badgesEarned}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted"><CheckCircle2 className="size-4" aria-hidden="true" /> Napasang pagtatangka</dt>
                <dd className="font-bold text-ink">{passedAttempts.length}</dd>
              </div>
            </dl>
            <Link to="/student/mga-gantimpala" className={buttonClass({ variant: "secondary", size: "sm", className: "mt-4 w-full" })}>
              Tingnan ang mga gantimpala <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </Card>
        </div>
      </div>

      <Card className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-ink">Kasaysayan ng pagtatangka</h2>
            <p className="mt-0.5 text-xs text-muted">Huling {attemptHistory.length} naisumiteng gawain</p>
          </div>
          <ListChecks className="size-5 text-plum-400" aria-hidden="true" />
        </div>
        {attemptHistory.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Wala pang pagtatangka"
            description="Pumili ng aktibidad o pagsusulit upang simulan ang iyong kasaysayan."
            action={<Link to="/student/pagsusulit" className={buttonClass()}>Tingnan ang mga pagsusulit</Link>}
          />
        ) : (
          <div className="mt-4 overflow-x-auto">
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
                {attemptHistory.map((attempt) => (
                  <tr key={attempt.id}>
                    <td className="py-3 pr-4 font-semibold text-ink">{attempt.title}{attempt.timedOut ? <span className="ml-1 text-[10px] font-medium text-danger">(naubos ang oras)</span> : null}</td>
                    <td className="py-3 pr-4 text-muted">{attempt.kind === "quiz" ? "Pagsusulit" : "Aktibidad"}</td>
                    <td className="py-3 pr-4 font-semibold text-ink">{attempt.score}/{attempt.total} ({attempt.percent}%)</td>
                    <td className="py-3 pr-4"><Chip tone={attempt.passed ? "success" : "danger"}>{attempt.passed ? "Pumasa" : "Hindi"}</Chip></td>
                    <td className="py-3 text-muted">{formatDate(attempt.completedAt, { withTime: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
