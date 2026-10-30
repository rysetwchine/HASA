import { Link } from "react-router";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ClipboardCheck,
  GraduationCap,
  Layers,
  LockKeyhole,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import Seo from "../../components/Seo.jsx";
import Logo from "../../components/Logo.jsx";
import { buttonClass, Card, Chip } from "../../components/ui.jsx";

const LEVELS = [
  {
    name: "Malayang Pagbasa",
    tag: "Independent",
    text: "Umusbong ang mga unang lungsod sa tabi ng mga ilog dahil may tubig at matabang lupa para sa agrikultura. Nang magkaroon ng sobrang ani at espesyalisasyon sa trabaho, lumitaw ang pamahalaan, batas, at sistema ng pagsulat.",
  },
  {
    name: "May Gabay na Pagbasa",
    tag: "Instructional",
    text: "Umusbong ang mga unang lungsod sa tabi ng mga ilog dahil may tubig at matabang lupa. Dahil may sobrang pagkain, may mga taong naging artisano at tagapagtala.",
  },
  {
    name: "Nahihirapang Pagbasa",
    tag: "Frustration",
    text: "May tubig sa ilog. May matabang lupa rin. Kaya nagtanim ng pagkain ang mga tao. Dito nagsimula ang mga lungsod.",
  },
];

const FEATURES = [
  {
    icon: Layers,
    title: "Tatlong antas ng teksto",
    body: "Ang bawat aralin ay may bersyon para sa malaya, may gabay, at nahihirapang pagbasa. Pumipili ang mag-aaral; hindi ito diagnosis.",
  },
  {
    icon: ClipboardCheck,
    title: "Tunay na pagsusulit",
    body: "May mga tanong na may paliwanag sa sagot. Isang beses lang ibinibigay ang XP kapag naipasa, at hindi ito makukuha sa browser.",
  },
  {
    icon: BarChart3,
    title: "Malinaw na progreso",
    body: "Nakikita ng mag-aaral ang mga natapos na aralin, iskor, at badge. Nakikita ng guro ang buong klase sa isang lugar.",
  },
  {
    icon: LockKeyhole,
    title: "Ligtas na account",
    body: "Server-side ang session at password. Hindi kayang buksan ng mag-aaral ang mga pahina o rekord ng guro at ng kaklase.",
  },
];

const STEPS = [
  {
    title: "Gumawa ng account",
    body: "Kumuha ng kodigo ng klase sa iyong guro, pumili ng antas ng pagbasa, at magsimula.",
  },
  {
    title: "Magbasa at sumagot",
    body: "Pumili ng aralin, basahin ang bersyong akma sa iyo, at subukan ang aktibidad o pagsusulit.",
  },
  {
    title: "Tingnan ang progreso",
    body: "Bumalik sa dashboard upang makita ang susunod na aralin, mga badge, at puntos na tunay na nakuha.",
  },
];

export default function LandingPage() {
  return (
    <>
      <Seo
        title="Pantulong sa Araling Panlipunan para sa Baitang 8"
        description="HASA ay isang pantulong sa Araling Panlipunan 8 na may tatlong antas ng pagbasa, aktibidad, pagsusulit, at progresong nakikita ng guro."
        path="/"
      />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 size-[28rem] rounded-full bg-gold/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-32 top-48 size-[24rem] rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="animate-rise">
            <Chip tone="gold" className="mb-5">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Araling Panlipunan · Baitang 8
            </Chip>
            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              Mas malinaw ang kasaysayan kapag naiintindihan mo ito.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
              Isang aralin, tatlong antas ng pagbasa. Piliin ang bersyong akma sa iyo,
              sagutin ang mga tanong, at sundan ang tunay na progreso kasama ang guro.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className={buttonClass({ size: "lg" })}>
                Simulan ang pag-aaral
                <ArrowRight className="size-4.5" aria-hidden="true" />
              </Link>
              <Link to="/login" className={buttonClass({ size: "lg", variant: "secondary" })}>
                May account na ako
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-plum-700">
              <li className="flex items-center gap-2"><Check className="size-4 text-success" aria-hidden="true" /> Walang bayad</li>
              <li className="flex items-center gap-2"><Check className="size-4 text-success" aria-hidden="true" /> Para sa mag-aaral at guro</li>
              <li className="flex items-center gap-2"><Check className="size-4 text-success" aria-hidden="true" /> Tagalog ang buong app</li>
            </ul>
          </div>

          <div className="relative animate-rise-late">
            <div className="absolute -right-4 -top-5 hidden rotate-3 rounded-2xl border border-gold-strong/30 bg-gold-soft px-4 py-3 shadow-sm sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brown">Bonus</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-brown">
                <Trophy className="size-4" aria-hidden="true" /> Mga badge sa bawat hakbang
              </p>
            </div>

            <Card className="relative overflow-hidden border-plum-200/80 bg-white p-0 shadow-[0_24px_60px_-24px_rgba(46,40,87,0.35)]">
              <div className="flex items-center justify-between border-b border-plum-100 bg-plum-50/70 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-danger/70" aria-hidden="true" />
                  <span className="size-2.5 rounded-full bg-gold" aria-hidden="true" />
                  <span className="size-2.5 rounded-full bg-success/70" aria-hidden="true" />
                </div>
                <p className="text-xs font-semibold text-muted">Halimbawa ng aralin</p>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-strong">
                  Yunit 1 · Sinaunang Sibilisasyon
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-ink">
                  Heograpiya at ang Simula ng Sibilisasyon
                </h2>
                <div className="mt-4 space-y-2.5">
                  {LEVELS.map((level, index) => (
                    <div
                      key={level.name}
                      className={
                        index === 1
                          ? "rounded-xl border border-accent/30 bg-accent-soft p-3.5"
                          : "rounded-xl border border-plum-100 bg-cream-50 p-3.5"
                      }
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-ink">{level.name}</p>
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                          {level.tag}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted">{level.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-plum-900 px-4 py-3 text-white">
                  <span className="flex items-center gap-2 text-xs font-semibold">
                    <BookOpen className="size-4 text-gold" aria-hidden="true" />
                    Basahin ang aralin
                  </span>
                  <ArrowRight className="size-4 text-plum-300" aria-hidden="true" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-y border-plum-100 bg-white" aria-label="Mga tampok">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-plum-100 bg-cream-50 p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-plum-800 text-gold">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-3.5 text-base font-bold text-ink">{title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="paano" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-strong">Paano ito gumagana</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink">Tatlong hakbang, malinaw na simula</h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Hindi kailangan ng kumplikadong setup. Kodigo ng klase lang ang kailangan ng mag-aaral.
          </p>
        </div>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative rounded-2xl border border-plum-100 bg-white p-6">
              <span className="grid size-10 place-items-center rounded-full bg-gold text-sm font-extrabold text-brown">
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="para-sa-guro" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="overflow-hidden rounded-3xl bg-plum-900">
          <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
            <div>
              <Chip tone="gold" className="border-white/10 bg-white/10 text-gold">Para sa guro</Chip>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
                Isang malinaw na tanawin ng buong klase.
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-plum-200">
                Gumawa ng klase, ibahagi ang kodigo, at tingnan ang tunay na gawain ng mga
                mag-aaral. Maaaring magdagdag ng sariling aralin, aktibidad, at pagsusulit.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link to="/register?role=teacher" className={buttonClass({ variant: "gold", size: "lg" })}>
                  Gumawa ng account ng guro
                  <ArrowRight className="size-4.5" aria-hidden="true" />
                </Link>
                <Link to="/login" className={buttonClass({ variant: "secondary", size: "lg", className: "border-white/20 bg-transparent text-white hover:bg-white/10" })}>
                  Mag-log in
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { icon: Users, text: "Tingnan ang progreso ng bawat mag-aaral sa iyong klase" },
                { icon: BookOpen, text: "I-edit ang mga aralin na ikaw mismo ang gumawa" },
                { icon: ClipboardCheck, text: "Lumikha ng pagsusulit at tingnan ang iskor at pumasa" },
                { icon: GraduationCap, text: "I-reset ang password ng mag-aaral nang ligtas" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-gold">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <p className="pt-1 text-sm font-medium leading-relaxed text-plum-100">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-plum-100 bg-white">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-strong">
            <GraduationCap className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink">Handa ka na bang magsimula?</h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted">
            Kunin ang kodigo ng klase sa iyong guro, gumawa ng account, at pumili ng antas ng
            pagbasa. Maaari mo itong palitan anumang oras sa iyong profile.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/register" className={buttonClass({ size: "lg" })}>
              Gumawa ng account
              <ArrowRight className="size-4.5" aria-hidden="true" />
            </Link>
            <Link to="/login" className={buttonClass({ variant: "secondary", size: "lg" })}>
              Mag-log in
            </Link>
          </div>
          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted">
            <Logo compact to="/" />
            <span>· Pantulong sa Araling Panlipunan 8</span>
          </div>
        </div>
      </section>
    </>
  );
}
