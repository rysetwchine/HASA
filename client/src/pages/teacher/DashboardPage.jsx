import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Check,
  GraduationCap,
  TrendingUp,
  Trophy,
  UserRound,
  Users,
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
import { formatDate, firstName } from "../../lib/format.js";
import { useApi } from "../../lib/useApi.js";

export default function TeacherDashboard() {
  const { data, error, loading } = useApi("/teacher/dashboard");
  const [copied, setCopied] = useState(false);

  if (loading) return <Loading label="Inihahanda ang pangunahing pahina ng guro…" />;
  if (error) return <Alert tone="danger" title="Hindi mabuksan ang pangunahing pahina">{errorMessage(error)}</Alert>;

  const { class: cls, counts, averages, students, recentAttempts } = data;
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(cls.joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <Seo
        title="Pangunahing Pahina ng Guro"
        description="Tingnan ang buod ng iyong klase, aktibidad ng mag-aaral, at resulta sa HASA."
        noindex
        path="/teacher/dashboard"
      />
      <PageHeader
        eyebrow={cls.name}
        title="Pangunahing Pahina ng Guro"
        description="Malinaw na tanawin ng gawain, progreso, at resulta ng iyong klase."
        actions={
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex items-center gap-2 rounded-xl border border-plum-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-plum-800 hover:border-plum-400"
          >
            <span className="text-xs font-medium text-muted">Kodigo:</span>
            <span className="font-mono font-bold">{cls.joinCode}</span>
            {copied ? <Check className="size-4 text-success" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Mga mag-aaral" value={counts.students} tone="plum" />
        <StatCard icon={BookOpen} label="Mga aralin" value={counts.lessons} hint="Pangkalahatan at para sa klase" tone="accent" />
        <StatCard icon={ClipboardCheck} label="Mga gawain" value={counts.assessments} hint="Aktibidad at pagsusulit" tone="gold" />
        <StatCard icon={TrendingUp} label="Aktibo ngayong linggo" value={counts.activeThisWeek} hint="May gawain sa huling 7 araw" tone="success" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-ink">Kalagayan ng klase</h2>
              <p className="mt-0.5 text-xs text-muted">Batay sa mga naisumiteng gawain at natapos na aralin</p>
            </div>
            <BarChart3 className="size-5 text-plum-400" aria-hidden="true" />
          </div>
          <div className="mt-5 space-y-5">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-ink">Average na iskor sa gawain</span>
                <span className="font-bold text-ink">{averages.studentScore}%</span>
              </div>
              <ProgressBar value={averages.studentScore} tone={averages.studentScore >= 75 ? "success" : "gold"} />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-ink">Pagkumpleto ng aralin</span>
                <span className="font-bold text-ink">{averages.lessonCompletion}%</span>
              </div>
              <ProgressBar value={averages.lessonCompletion} tone="accent" />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-ink">Average na puntos</span>
                <span className="font-bold text-ink">{averages.points} XP</span>
              </div>
              <ProgressBar value={Math.min(100, averages.points / 3)} tone="plum" />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/teacher/mga-mag-aaral" className={buttonClass({ size: "sm" })}>
              Tingnan ang mga mag-aaral <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link to="/teacher/mga-ulat" className={buttonClass({ size: "sm", variant: "secondary" })}>
              Buong ulat
            </Link>
          </div>
        </Card>

        <Card className="bg-plum-900 text-white">
          <GraduationCap className="size-6 text-gold" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-bold">Paano sumali ang mag-aaral?</h2>
          <p className="mt-2 text-sm leading-relaxed text-plum-200">
            Ibahagi ang kodigo ng klase. Kailangan ito ng mag-aaral sa paggawa ng account.
            Maaari mong palitan ang kodigo anumang oras sa profile.
          </p>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/10 p-3">
            <span className="font-mono text-lg font-bold tracking-wide text-gold">{cls.joinCode}</span>
            <button
              type="button"
              onClick={copyCode}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold hover:bg-white/20"
            >
              {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
              {copied ? "Nakopya" : "Kopyahin"}
            </button>
          </div>
          <Link to="/teacher/profile" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-white">
            Pamahalaan ang klase <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-ink">Nangungunang mag-aaral</h2>
            <Link to="/teacher/mga-mag-aaral" className="text-xs font-semibold text-accent-strong hover:text-accent-deep">Lahat</Link>
          </div>
          {students.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Wala pang mag-aaral"
              description="Ibahagi ang kodigo ng klase upang makapagrehistro ang mga mag-aaral."
            />
          ) : (
            <ul className="mt-3 divide-y divide-plum-100">
              {students.map((student, index) => (
                <li key={student.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-plum-100 text-xs font-bold text-plum-700">{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <Link to={`/teacher/mga-mag-aaral/${student.id}`} className="block truncate text-sm font-semibold text-ink hover:text-accent-strong">
                      {student.displayName}
                    </Link>
                    <p className="text-[11px] text-muted">{student.lessonsCompleted} aralin · {student.attempts} pagtatangka</p>
                  </div>
                  <Chip tone="gold">{student.points} XP</Chip>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-ink">Huling isinumite</h2>
            <Link to="/teacher/mga-ulat" className="text-xs font-semibold text-accent-strong hover:text-accent-deep">Ulat</Link>
          </div>
          {recentAttempts.length === 0 ? (
            <p className="mt-3 rounded-xl bg-cream-50 p-4 text-sm text-muted">
              Wala pang naisumiteng gawain ang klase. Kapag nagsimula na ang mga mag-aaral,
              lalabas dito ang kanilang resulta.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-plum-100">
              {recentAttempts.map((attempt) => (
                <li key={attempt.id} className="flex flex-wrap items-center gap-2 py-2.5 first:pt-0 last:pb-0">
                  <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${attempt.passed ? "bg-success-soft text-success-strong" : "bg-danger-soft text-danger-deep"}`}>
                    {attempt.passed ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <Trophy className="size-4" aria-hidden="true" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{attempt.studentName}</p>
                    <p className="truncate text-[11px] text-muted">{attempt.title} · {formatDate(attempt.completedAt, { withTime: true })}</p>
                  </div>
                  <Chip tone={attempt.passed ? "success" : "danger"}>{attempt.percent}%</Chip>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
