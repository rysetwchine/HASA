import { Link } from "react-router";
import { ArrowLeft, Compass } from "lucide-react";
import { buttonClasses } from "../components/ui/Button.jsx";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-accent text-white">
        <Compass className="h-8 w-8" aria-hidden="true" />
      </span>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-accent-deep">
        404
      </p>
      <h1 className="font-display mt-1 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Hindi mahanap ang pahina
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
        Maaaring mali ang link o tinanggal na ang pahinang hinahanap mo. Bumalik
        sa dashboard o tingnan ang mga aralin.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <Link to="/" className={buttonClasses({ variant: "primary" })}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Bumalik sa Dashboard
        </Link>
        <Link to="/mga-aralin" className={buttonClasses({ variant: "secondary" })}>
          Tingnan ang mga aralin
        </Link>
      </div>
    </div>
  );
}
