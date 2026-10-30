import { Link } from "react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Flame,
  ListChecks,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useAuth } from "../../app/AuthProvider.jsx";
import Seo from "../../components/Seo.jsx";
import {
  Alert,
  Card,
  Chip,
  EmptyState,
  Loading,
  ProgressBar,
  StatCard,
  buttonClass,
} from "../../components/ui.jsx";
import { errorMessage } from "../../lib/api.js";
import { formatDate, formatNumber, firstName } from "../../lib/format.js";
import { useApi } from "../../lib/useApi.js";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, error, loading } = useApi("/student/dashboard");
  const achievements = useApi("/student/achievements");

  if (loading) return <Loading label="Inihahanda ang dashboard…" />;
  if (error) {
    return <Alert tone="danger" title="Hindi mabuksan ang dashboard">{errorMessage(error)}</Alert>;
  }

  const stats = data.stats;
  const withinLevel = stats.points % 300;
  const nextBadges = (achievements.data?.badges || []).filter((badge) => !badge.earned).slice(0, 3);
  const earnedBadges = (achievements.data?.badges || []).filter((badge) => badge.earned).slice(0, 3);

  return (
    <>
      <Seo
        title="Dashboard ng Mag-aaral"
        description="Tingnan ang iyong susunod na aralin, aktibidad, puntos, at progreso sa HASA."
        noindex
        path="/student/dashboard"
      />

      <section className="relative overflow-hidden rounded-3xl bg-plum-900 px-5 py-6 text-white sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-accent/30 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 size-56 rounded-full bg-gold/15 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
              {new Intl.DateTimeFormat("fil-PH", { weekday: "long", month: "long", day: "numeric", timeZone: "Asia/Manila" }).format(new Date())}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Magandang araw, {firstName(user?.displayName)}!
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-plum-200">
              Narito ang iyong pag-aaral sa Araling Panlipunan. Ipagpatuloy ang aralin o subukan
              ang susunod na pagsusulit.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                <Star className="size-4 text-gold" aria-hidden="true" /> Antas {stats.level}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                <Flame className="size-4 text-gold" aria-hidden="true" /> {stats.streak} araw na sunod-sunod
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                <Award className="size-4 text-gold" aria-hidden="true" /> {stats.badgesEarned} badge
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-white">Papunta sa Antas {stats.level + 1}</span>
              <span className="text-plum-200">{formatNumber(stats.points)} XP</span>
            </div>
            <ProgressBar value={withinLevel / 3} tone="gold" className="mt-3" />
            <p className="mt-2 text-xs text-plum-300">{300 - withinLevel} XP pa para sa susunod na antas</p>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Natapos na aralin" value={`${stats.lessonsCompleted}/${stats.lessonsTotal}`} tone="success" />
        <StatCard icon={ClipboardList} label="Naipasang aktibidad" value={stats.activitiesPassed} tone="accent" />
        <StatCard icon={ListChecks} label="Naipasang pagsusulit" value={stats.quizzesPassed} tone="plum" />
        <StatCard icon={Trophy} label="Kabuuang badge" value={stats.badgesEarned} tone="gold" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
        <div className="space-y-5">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-strong">Ipagpatuloy</p>
                <h2 className="mt-1 text-lg font-bold text-ink">Susunod na aralin</h2>
              </div>
              <BookOpen className="size-5 text-plum-400" aria-hidden="true" />
            </div>
            {data.continueLesson ? (
              <div className="mt-4 rounded-2xl border border-plum-100 bg-cream-50 p-4 sm:p-5">
                <div className="flex flex-wrap gap-2">
                  <Chip tone="accent">{data.continueLesson.unit}</Chip>
                  <Chip>{data.continueLesson.estimatedMinutes} min</Chip>
                  <Chip tone="gold">{data.continueLesson.xp} XP</Chip>
                </div>
                <h3 className="mt-3 text-lg font-bold text-ink">{data.continueLesson.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{data.continueLesson.description}</p>
                <Link to={`/student/aralin/${data.continueLesson.id}`} className={buttonClass({ className: "mt-4" })}>
                  {data.continueLesson.progress === "in_progress" ? "Ipagpatuloy ang pagbasa" : "Simulan ang aralin"}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <EmptyState
                icon={CheckCircle2}
                title="Natapos mo na ang lahat ng aralin"
                description="Maaari ka pa ring bumalik sa mga aralin o subukan ang mga aktibidad."
                action={<Link to="/student/aralin" className={buttonClass()}>Tingnan ang mga aralin</Link>}
              />
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-strong">Hamon</p>
                <h2 className="mt-1 text-lg font-bold text-ink">Susunod na pagsusulit o aktibidad</h2>
              </div>
              <Target className="size-5 text-plum-400" aria-hidden="true" />
            </div>
            {data.nextAssessment ? (
              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-plum-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip tone={data.nextAssessment.kind === "quiz" ? "accent" : "info"}>
                      {data.nextAssessment.kind === "quiz" ? "Pagsusulit" : "Aktibidad"}
                    </Chip>
                    <span className="text-xs font-semibold text-muted">{data.nextAssessment.xp} XP</span>
                  </div>
                  <p className="mt-2 font-semibold text-ink">{data.nextAssessment.title}</p>
                </div>
                <Link
                  to={`/student/${data.nextAssessment.kind === "quiz" ? "pagsusulit" : "aktibidad"}/${data.nextAssessment.id}`}
                  className={buttonClass({ variant: "secondary", size: "sm", className: "shrink-0" })}
                >
                  Simulan <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <p className="mt-4 rounded-xl bg-success-soft p-3.5 text-sm font-medium text-success-strong">
                Napasa mo na ang lahat ng kasalukuyang aktibidad at pagsusulit. Magaling!
              </p>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-ink">Mga badge</h2>
              <Link to="/student/mga-gantimpala" className="text-xs font-semibold text-accent-strong hover:text-accent-deep">
                Tingnan lahat
              </Link>
            </div>
            {earnedBadges.length > 0 ? (
              <ul className="mt-3 space-y-2.5">
                {earnedBadges.map((badge) => (
                  <li key={badge.id} className="flex items-center gap-3 rounded-xl border border-gold-strong/25 bg-gold-soft p-3">
                    <span className="grid size-9 place-items-center rounded-full bg-gold text-brown">
                      <Trophy className="size-4.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">{badge.name}</p>
                      <p className="text-xs text-muted">Nakuha na</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 rounded-xl bg-cream-50 p-3.5 text-sm leading-relaxed text-muted">
                Wala ka pang badge. Matatanggap mo ang una kapag nakapasa ka sa isang aktibidad o pagsusulit.
              </p>
            )}
            {nextBadges.length > 0 ? (
              <div className="mt-4 border-t border-plum-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Susunod na makukuha</p>
                <ul className="mt-2 space-y-2">
                  {nextBadges.slice(0, 2).map((badge) => (
                    <li key={badge.id}>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium text-ink">{badge.name}</span>
                        <span className="text-muted">{badge.progress}/{badge.target}</span>
                      </div>
                      <ProgressBar value={(badge.progress / badge.target) * 100} className="mt-1" />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Card>

          <Card>
            <h2 className="text-base font-bold text-ink">Aking klase</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Klase</dt>
                <dd className="text-right font-semibold text-ink">{user?.class?.name || "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Guro</dt>
                <dd className="text-right font-semibold text-ink">{user?.class?.teacherName || "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Antas ng pagbasa</dt>
                <dd className="text-right font-semibold text-ink">
                  {user?.readingLevel === "independent" ? "Malaya" : user?.readingLevel === "frustration" ? "Nahihirapan" : "May gabay"}
                </dd>
              </div>
            </dl>
            <Link to="/student/profile" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-strong hover:text-accent-deep">
              I-edit ang profile <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </Card>
        </div>
      </div>

      <Card className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-strong">Kasaysayan</p>
            <h2 className="mt-1 text-lg font-bold text-ink">Mga huling pagsusulit at aktibidad</h2>
          </div>
          <Link to="/student/progreso" className="text-xs font-semibold text-accent-strong hover:text-accent-deep">
            Tingnan ang progreso
          </Link>
        </div>
        {data.recentAttempts.length === 0 ? (
          <p className="mt-4 rounded-xl bg-cream-50 p-4 text-sm text-muted">
            Wala pang naisumiteng aktibidad o pagsusulit. Pumili ng hamon sa itaas upang magsimula.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-plum-100">
            {data.recentAttempts.map((attempt) => (
              <li key={attempt.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${attempt.passed ? "bg-success-soft text-success-strong" : "bg-danger-soft text-danger-deep"}`}>
                  {attempt.passed ? <CheckCircle2 className="size-4.5" aria-hidden="true" /> : <TrendingUp className="size-4.5" aria-hidden="true" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{attempt.title}</p>
                  <p className="text-xs text-muted">{formatDate(attempt.completedAt, { withTime: true })}</p>
                </div>
                <span className="text-sm font-bold text-ink">{attempt.score}/{attempt.total}</span>
                <Chip tone={attempt.passed ? "success" : "danger"}>{attempt.percent}%</Chip>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
