import { Link } from "react-router";
import { ArrowLeft, Compass } from "lucide-react";
import Seo from "../components/Seo.jsx";
import Logo from "../components/Logo.jsx";
import { buttonClass } from "../components/ui.jsx";

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Hindi mahanap ang pahina"
        description="Hindi mahanap ang hinahanap mong pahina sa HASA."
        noindex
      />
      <main className="grid min-h-screen place-items-center bg-cream-50 px-4 py-16">
        <div className="w-full max-w-lg text-center">
          <div className="flex justify-center"><Logo /></div>
          <span className="mx-auto mt-10 grid size-16 place-items-center rounded-2xl bg-accent-soft text-accent-strong">
            <Compass className="size-8" aria-hidden="true" />
          </span>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-accent-strong">404</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Hindi mahanap ang pahina
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted">
            Maaaring mali ang link, nailipat ang pahina, o wala ka pang access dito. Bumalik
            sa simula at magpatuloy mula roon.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/" className={buttonClass({ size: "lg" })}>
              <ArrowLeft className="size-4.5" aria-hidden="true" />
              Bumalik sa simula
            </Link>
            <Link to="/login" className={buttonClass({ variant: "secondary", size: "lg" })}>
              Mag-log in
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
