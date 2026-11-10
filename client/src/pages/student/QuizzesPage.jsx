import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Compass,
  Crown,
  Flame,
  Flag,
  Globe2,
  Landmark,
  ListChecks,
  Map,
  Play,
  RotateCcw,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Star,
  Swords,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import Seo from "../../components/Seo.jsx";
import {
  Alert,
  Card,
  Chip,
  EmptyState,
  Loading,
  ProgressBar,
  buttonClass,
} from "../../components/ui.jsx";
import { errorMessage } from "../../lib/api.js";
import { formatNumber } from "../../lib/format.js";
import { useApi } from "../../lib/useApi.js";
import { cx } from "../../utils/cx.js";

const QUEST_ICONS = [Landmark, ScrollText, Swords, Globe2, Crown, Flag, Compass, Map];

const QUEST_THEMES = [
  {
    icon: "bg-accent-soft text-accent-deep",
    glow: "bg-accent/15",
    border: "hover:border-accent/40",
    dot: "bg-accent",
    bar: "accent",
  },
  {
    icon: "bg-gold-soft text-brown",
    glow: "bg-gold/25",
    border: "hover:border-gold-strong/50",
    dot: "bg-gold-strong",
    bar: "gold",
  },
  {
    icon: "bg-sky-soft text-sky-dark",
    glow: "bg-sky/15",
    border: "hover:border-sky/40",
    dot: "bg-sky",
    bar: "plum",
  },
  {
    icon: "bg-success-soft text-success-strong",
    glow: "bg-success/15",
    border: "hover:border-success/40",
    dot: "bg-success",
    bar: "success",
  },
];

const STEPS = [
  {
    title: "Pumili ng hamon",
    text: "Tingnan ang antas ng hirap, gantimpala, at layunin bago sumabak.",
  },
  {
    title: "Sagutin ang lahat",
    text: "May paliwanag ang bawat tanong pagkatapos ng laban para mas matuto ka.",
  },
  {
    title: "Kunin ang XP",
    text: "Pumasa para makakuha ng XP at bituin. Isang beses lang ang XP.",
  },
];

function questRank(item) {
  if (item.timerSeconds || item.xp >= 60) {
    return { label: "Mahirap", tone: "danger", Icon: Flame };
  }
  if (item.passPercent >= 70 || item.questionCount >= 8) {
    return { label: "Katamtaman", tone: "gold", Icon: Swords };
  }
  return { label: "Pasimula", tone: "success", Icon: Sparkles };
}

function questStars(item) {
  if (!item.attempts) return 0;
  if (item.bestPercent >= 90) return 3;
  if (item.passed) return 2;
  return 1;
}

function StarMeter({ value, label }) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-0.5"
      role="img"
      aria-label={label || `${value} sa 3 bituin`}
    >
      {[0, 1, 2].map((index) => (
        <Star
          key={index}
          className={cx(
            "size-4",
            index < value ? "fill-current text-gold-strong" : "text-plum-200",
          )}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function QuestCard({ item, index }) {
  const theme = QUEST_THEMES[index % QUEST_THEMES.length];
  const Icon = QUEST_ICONS[index % QUEST_ICONS.length];
  const rank = questRank(item);
  const RankIcon = rank.Icon;
  const stars = questStars(item);
  const status = item.passed
    ? { label: "Napasa", tone: "success" }
    : item.attempts > 0
      ? { label: "Subukan muli", tone: "warning" }
      : { label: "Bagong hamon", tone: "accent" };

  return (
    <article
      className={cx(
        "group animate-rise relative flex flex-col overflow-hidden rounded-3xl border border-plum-100 bg-white p-5 shadow-[0_1px_2px_rgba(41,31,71,0.05)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(41,31,71,0.28)]",
        theme.border,
      )}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div
        className={cx(
          "pointer-events-none absolute -right-12 -top-14 size-36 rounded-full opacity-70 blur-3xl transition-opacity duration-300 group-hover:opacity-100",
          theme.glow,
        )}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cx("relative grid size-12 shrink-0 place-items-center rounded-2xl", theme.icon)}>
            <Icon className="size-6" aria-hidden="true" />
            <span
              className={cx(
                "absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full text-[10px] font-extrabold text-white ring-2 ring-white",
                theme.dot,
              )}
            >
              {index + 1}
            </span>
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
              Hamon {index + 1}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Chip tone={rank.tone} className="px-2 py-0.5 text-[10px]">
                <RankIcon className="size-3" aria-hidden="true" /> {rank.label}
              </Chip>
              <Chip tone={status.tone} className="px-2 py-0.5 text-[10px]">
                {status.label}
              </Chip>
            </div>
          </div>
        </div>
        <StarMeter
          value={stars}
          label={`${stars} sa 3 bituin para sa hamon ${index + 1}`}
        />
      </div>

      <h3 className="relative mt-4 text-lg font-extrabold leading-snug text-ink transition-colors duration-200 group-hover:text-accent-deep">
        {item.title}
      </h3>
      <p className="relative mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
        {item.description}
      </p>
      {item.lesson ? (
        <p className="relative mt-2 flex items-start gap-1.5 text-xs font-medium text-plum-600">
          <BookOpen className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span className="line-clamp-1">{item.lesson.title}</span>
        </p>
      ) : null}

      <div className="relative mt-4 flex flex-wrap gap-1.5">
        <Chip tone="gold" className="px-2 py-0.5 text-[10px]">
          <ShieldCheck className="size-3" aria-hidden="true" /> Gawa ng guro
        </Chip>
        {item.isClassContent ? (
          <Chip tone="info" className="px-2 py-0.5 text-[10px]">
            <Users className="size-3" aria-hidden="true" /> Para sa inyong klase
          </Chip>
        ) : null}
        <Chip className="px-2 py-0.5 text-[10px]">
          <Target className="size-3" aria-hidden="true" /> {item.passPercent}% layunin
        </Chip>
      </div>

      <div className="relative mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-gold-soft/80 p-2.5 text-center">
          <Trophy className="mx-auto size-4 text-brown" aria-hidden="true" />
          <p className="mt-1 text-sm font-extrabold text-brown">{item.xp} XP</p>
          <p className="text-[9px] font-bold uppercase tracking-wide text-brown/70">Gantimpala</p>
        </div>
        <div className="rounded-2xl bg-plum-50 p-2.5 text-center">
          <ListChecks className="mx-auto size-4 text-plum-600" aria-hidden="true" />
          <p className="mt-1 text-sm font-extrabold text-ink">{item.questionCount}</p>
          <p className="text-[9px] font-bold uppercase tracking-wide text-muted">Tanong</p>
        </div>
        <div className="rounded-2xl bg-plum-50 p-2.5 text-center">
          <Clock3 className="mx-auto size-4 text-plum-600" aria-hidden="true" />
          <p className="mt-1 text-sm font-extrabold text-ink">
            {item.timerSeconds ? `${Math.max(1, Math.round(item.timerSeconds / 60))} min` : "Walang"}
          </p>
          <p className="text-[9px] font-bold uppercase tracking-wide text-muted">Limitasyon</p>
        </div>
      </div>

      <div className="relative mt-3 rounded-2xl border border-plum-100 bg-cream-50/70 p-3">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-ink">
            {item.attempts > 0 ? "Pinakamahusay" : "Layunin"}
          </span>
          <span className="font-extrabold text-ink">
            {item.attempts > 0 ? `${item.bestPercent}%` : `${item.passPercent}% upang pumasa`}
          </span>
        </div>
        <ProgressBar
          value={item.attempts > 0 ? item.bestPercent : 0}
          tone={item.passed ? "success" : theme.bar}
          className="mt-2"
        />
        <p className="mt-1.5 text-[10px] leading-relaxed text-muted">
          {item.attempts > 0
            ? `${item.attempts} pagtatangka · ${item.passed ? "Napasa mo na ang hamon na ito" : "Kulang pa ang iskor para pumasa"}`
            : "Wala pang pagtatangka · Ikaw ang unang lalaban"}
        </p>
      </div>

      <div className="relative mt-auto flex items-center justify-between gap-2 pt-4">
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
          {item.passed ? (
            <CheckCircle2 className="size-3.5 text-success" aria-hidden="true" />
          ) : (
            <Sparkles className="size-3.5 text-gold-strong" aria-hidden="true" />
          )}
          {item.passed ? "Kumpleto na" : item.attempts > 0 ? "Subukan muli" : "Bagong hamon"}
        </span>
        <Link
          to={`/student/pagsusulit/${item.id}`}
          className={buttonClass({
            variant: item.passed ? "secondary" : "accent",
            size: "sm",
            className: "group/cta shrink-0",
          })}
          aria-label={`${item.passed ? "Laruin muli" : item.attempts > 0 ? "Subukan muli" : "Simulan"} ang ${item.title}`}
        >
          {item.attempts > 0 ? (
            <RotateCcw className="size-3.5" aria-hidden="true" />
          ) : (
            <Play className="size-3.5" aria-hidden="true" />
          )}
          {item.passed ? "Laruin muli" : item.attempts > 0 ? "Subukan muli" : "Simulan"}
          <ArrowRight
            className="size-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}

export default function QuizzesPage() {
  const { data, error, loading } = useApi("/student/activities?kind=quiz");
  const dashboard = useApi("/student/dashboard");
  const [filter, setFilter] = useState("all");

  if (loading) return <Loading label="Inihahanda ang arena…" />;
  if (error) {
    return (
      <Alert tone="danger" title="Hindi mabuksan ang arena">
        {errorMessage(error)}
      </Alert>
    );
  }

  const items = data?.activities || [];
  const passed = items.filter((item) => item.passed).length;
  const remaining = items.filter((item) => !item.passed);
  const totalXp = items.reduce((sum, item) => sum + item.xp, 0);
  const totalQuestions = items.reduce((sum, item) => sum + item.questionCount, 0);
  const progress = items.length ? Math.round((passed / items.length) * 100) : 0;
  const stats = dashboard.data?.stats;

  const filters = [
    { value: "all", label: "Lahat", count: items.length },
    { value: "open", label: "Hindi pa napasa", count: items.filter((item) => !item.passed).length },
    { value: "passed", label: "Napasa", count: passed },
  ];
  const visibleItems = items.filter((item) => {
    if (filter === "passed") return item.passed;
    if (filter === "open") return !item.passed;
    return true;
  });

  return (
    <>
      <Seo
        title="Arena ng Pagsusulit"
        description="Pumili ng hamon na ginawa ng iyong guro, sumagot ng mga tanong, at mangolekta ng XP at bituin sa HASA."
        noindex
        path="/student/pagsusulit"
      />

      <section className="animate-rise relative overflow-hidden rounded-3xl bg-plum-950 px-5 py-7 text-white sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-70" aria-hidden="true" />
        <div
          className="animate-float-slow pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-accent/25 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="animate-float pointer-events-none absolute -bottom-28 left-1/4 size-64 rounded-full bg-gold/10 blur-3xl"
          aria-hidden="true"
        />
        <Swords
          className="pointer-events-none absolute right-6 top-8 hidden size-24 rotate-12 text-white/[0.04] sm:block"
          aria-hidden="true"
        />
        <Crown
          className="pointer-events-none absolute bottom-6 left-1/2 hidden size-20 -rotate-12 text-white/[0.04] lg:block"
          aria-hidden="true"
        />

        <div className="relative grid gap-7 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-strong/30 bg-gold/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
              <Sparkles className="size-3.5" aria-hidden="true" /> Arena ng Kaalaman
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Handa ka na ba sa <span className="text-gold">hamon</span>?
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-plum-200">
              Bawat pagsusulit dito ay ginawa ng iyong guro bilang isang hamon. Pumili ng laban,
              sagutin ang mga tanong, at mangolekta ng XP at bituin para umakyat sa ranggo.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {stats ? (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                    <Star className="size-4 text-gold" aria-hidden="true" /> Antas {stats.level}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                    <Flame className="size-4 text-gold" aria-hidden="true" /> {stats.streak} araw na sunod-sunod
                  </span>
                </>
              ) : null}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                <ListChecks className="size-4 text-gold" aria-hidden="true" /> {items.length} hamon
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                <Zap className="size-4 text-gold" aria-hidden="true" /> {formatNumber(totalXp)} XP na premyo
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <a href="#mga-hamon" className={buttonClass({ variant: "gold" })}>
                Pumili ng hamon <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <Link to="/student/aralin" className={buttonClass({ variant: "inverse" })}>
                <BookOpen className="size-4" aria-hidden="true" /> Balikan ang aralin
              </Link>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs font-medium text-plum-300">
              <ShieldCheck className="size-4 text-gold" aria-hidden="true" />
              Gawa ng guro · Para sa inyong klase
            </p>
          </div>

          <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-plum-300">
                Iyong ranggo
              </p>
              <Trophy className="size-4 text-gold" aria-hidden="true" />
            </div>
            <div className="mt-4 flex items-center justify-center">
              <div
                className="relative grid size-36 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(#f4c95d ${progress * 3.6}deg, rgba(255,255,255,0.12) 0deg)`,
                }}
              >
                <div className="grid size-[6.4rem] place-items-center rounded-full bg-plum-950 text-center shadow-[inset_0_0_20px_rgba(0,0,0,0.35)]">
                  <div>
                    <p className="text-3xl font-extrabold leading-none">
                      {passed}
                      <span className="text-base font-bold text-plum-300">/{items.length}</span>
                    </p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-plum-300">
                      Hamon napasa
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {stats ? (
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-white/5 p-2">
                  <p className="text-sm font-extrabold text-white">{stats.level}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-plum-300">Antas</p>
                </div>
                <div className="rounded-xl bg-white/5 p-2">
                  <p className="text-sm font-extrabold text-white">{formatNumber(stats.points)}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-plum-300">XP</p>
                </div>
                <div className="rounded-xl bg-white/5 p-2">
                  <p className="text-sm font-extrabold text-white">{stats.badgesEarned}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-plum-300">Badge</p>
                </div>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-xl bg-white/5 p-2">
                  <p className="text-sm font-extrabold text-white">{totalQuestions}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-plum-300">Tanong</p>
                </div>
                <div className="rounded-xl bg-white/5 p-2">
                  <p className="text-sm font-extrabold text-white">{formatNumber(totalXp)}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-plum-300">XP</p>
                </div>
              </div>
            )}

            <div className="mt-3 rounded-xl bg-white/5 px-3 py-2.5 text-center text-[11px] leading-relaxed text-plum-200">
              {remaining.length > 0
                ? `${remaining.length} hamon pa ang naghihintay sa iyo`
                : items.length > 0
                  ? "Napasa mo na ang lahat ng hamon. Kampeon!"
                  : "Hintayin ang unang hamon mula sa iyong guro"}
            </div>
          </div>
        </div>
      </section>

      <section id="mga-hamon" className="mt-8 scroll-mt-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-accent-strong">
              Mapa ng hamon
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Piliin ang susunod mong laban
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
              Ang mga tanong at paliwanag ay mula sa iyong guro. Ikaw ang magpapasya kung aling
              hamon ang lalabanin mo ngayon.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Salain ang mga hamon">
            {filters.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                aria-pressed={filter === option.value}
                className={cx(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors duration-200",
                  filter === option.value
                    ? "bg-plum-800 text-white shadow-sm"
                    : "bg-white text-plum-700 ring-1 ring-plum-200 hover:bg-plum-50",
                )}
              >
                {option.label}
                <span
                  className={cx(
                    "rounded-full px-1.5 py-0.5 text-[10px]",
                    filter === option.value
                      ? "bg-white/15 text-white"
                      : "bg-plum-50 text-plum-600",
                  )}
                >
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              icon={Swords}
              title="Wala pang hamon"
              description="Magdagdag ang iyong guro ng pagsusulit para sa klase. Balikan ito mamaya para sa unang laban."
              action={
                <Link to="/student/aralin" className={buttonClass()}>
                  Magbasa muna ng aralin
                </Link>
              }
            />
          </div>
        ) : visibleItems.length === 0 ? (
          <Card className="mt-5 border-dashed bg-white/60 text-center">
            <p className="text-sm font-semibold text-ink">Walang hamon sa salang ito</p>
            <p className="mt-1 text-sm text-muted">
              Subukan ang ibang salain o pumili ng bagong hamon mamaya.
            </p>
          </Card>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
              <QuestCard key={item.id} item={item} index={items.indexOf(item)} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="animate-rise">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-strong">
            Gabay sa arena
          </p>
          <h2 className="mt-1 text-lg font-bold text-ink">Paano maglaro</h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-plum-100 bg-cream-50/70 p-3.5">
                <span className="grid size-8 place-items-center rounded-xl bg-plum-800 text-xs font-extrabold text-white">
                  {index + 1}
                </span>
                <p className="mt-2.5 text-sm font-bold text-ink">{step.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </Card>

        <Card
          className="animate-rise relative overflow-hidden border-plum-800 bg-plum-900 text-white"
          style={{ animationDelay: "120ms" }}
        >
          <div
            className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-gold/15 blur-2xl"
            aria-hidden="true"
          />
          <span className="relative grid size-11 place-items-center rounded-2xl bg-gold text-brown">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <h2 className="relative mt-3 text-lg font-bold">Gawa ng guro, para sa klase</h2>
          <p className="relative mt-2 text-sm leading-relaxed text-plum-200">
            Ang bawat tanong, tamang sagot, paliwanag, XP, oras, at porsyentong pumasa ay
            itinakda ng iyong guro. Bawat hamon dito ay inihanda para sa inyong klase.
          </p>
          <Link
            to="/student/aralin"
            className={buttonClass({ variant: "inverse", size: "sm", className: "relative mt-4" })}
          >
            <BookOpen className="size-4" aria-hidden="true" /> Magbasa muna ng aralin
          </Link>
        </Card>
      </section>
    </>
  );
}
