import { Link, Outlet } from "react-router";
import { ArrowRight, BookOpen, ShieldCheck } from "lucide-react";
import Logo from "../Logo.jsx";
import { buttonClass } from "../ui.jsx";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <header className="sticky top-0 z-30 border-b border-plum-100/70 bg-cream-50/90 backdrop-blur">
        <div className="mx-auto flex h-18 w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Logo />
          <nav className="ml-auto hidden items-center gap-6 text-sm font-semibold text-plum-700 md:flex" aria-label="Pangunahing nabigasyon">
            <a href="#paano" className="hover:text-plum-900">Paano ito gumagana</a>
            <a href="#para-sa-guro" className="hover:text-plum-900">Para sa guro</a>
            <Link to="/login" className="hover:text-plum-900">Mag-log in</Link>
          </nav>
          <Link to="/register" className={buttonClass({ size: "sm", className: "ml-auto md:ml-0" })}>
            Gumawa ng account
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-plum-100 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Pantulong na kagamitan sa Araling Panlipunan para sa Baitang 8. May tatlong
              antas ng pagbasa, tunay na pagsusulit, at progresong nakikita ng guro.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Mag-aaral</h2>
            <ul className="mt-3 space-y-2 text-sm text-plum-700">
              <li><Link to="/student/aralin" className="hover:text-plum-900">Mga aralin</Link></li>
              <li><Link to="/student/pagsusulit" className="hover:text-plum-900">Mga pagsusulit</Link></li>
              <li><Link to="/student/progreso" className="hover:text-plum-900">Progreso</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Impormasyon</h2>
            <ul className="mt-3 space-y-2 text-sm text-plum-700">
              <li className="flex items-center gap-2"><BookOpen className="size-4 text-accent" aria-hidden="true" /> Araling Panlipunan 8</li>
              <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-success" aria-hidden="true" /> Secure na session</li>
              <li><Link to="/login" className="hover:text-plum-900">Mag-log in</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-plum-100 px-4 py-4 text-center text-xs text-muted">
          © {new Date().getFullYear()} HASA. Para sa layuning pang-edukasyon.
        </div>
      </footer>
    </div>
  );
}
