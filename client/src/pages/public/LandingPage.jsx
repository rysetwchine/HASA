import { Link } from "react-router";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ClipboardCheck,
  Layers,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import Seo from "../../components/Seo.jsx";
import { buttonClass, Chip } from "../../components/ui.jsx";

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
        <div className="relative mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <div className="animate-rise">
            <Chip tone="gold" className="mb-5">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Araling Panlipunan · Baitang 8
            </Chip>
            <h1 className="mx-auto max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              Mas malinaw ang kasaysayan kapag naiintindihan mo ito.
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted">
              Isang aralin, tatlong antas ng pagbasa. Piliin ang bersyong akma sa iyo,
              sagutin ang mga tanong, at sundan ang tunay na progreso kasama ang guro.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/register" className={buttonClass({ size: "lg" })}>
                Simulan ang pag-aaral
                <ArrowRight className="size-4.5" aria-hidden="true" />
              </Link>
              <Link to="/login" className={buttonClass({ size: "lg", variant: "secondary" })}>
                May account na ako
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-plum-700">
              <li className="flex items-center gap-2"><Check className="size-4 text-success" aria-hidden="true" /> Walang bayad</li>
              <li className="flex items-center gap-2"><Check className="size-4 text-success" aria-hidden="true" /> Para sa mag-aaral at guro</li>
              <li className="flex items-center gap-2"><Check className="size-4 text-success" aria-hidden="true" /> Tagalog ang buong app</li>
            </ul>
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
    </>
  );
}
