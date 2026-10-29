import { Link, NavLink, useNavigate } from "react-router";
import {
  EXTRA_NAV_ITEMS,
  LOGO_IMAGE,
  PRIMARY_NAV_ITEMS,
} from "../../config/navigation.js";
import logoutIcon from "../../assets/images/layout/icon-logout.png";
import { cx } from "../../utils/cx.js";
import { useSession } from "../../app/SessionProvider.jsx";

/**
 * Sidebar ng mag-aaral.
 *
 * Sukat: 240px sa desktop (xl) at 260px sa malaking monitor (2xl). Dati
 * 340–420px ito, na masyadong malaki para sa 1366×768 at 1440×900.
 * Ang lahat ng sukat ng teksto at icon ay umangkop sa bagong lapad.
 *
 * Ang `onNavigate` ay isinasara ang mobile drawer (kung mayroon).
 */
export default function Sidebar({ onNavigate }) {
  const { signOut } = useSession();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    onNavigate?.();
    navigate("/login");
  }

  return (
    <aside className="hidden w-[240px] shrink-0 xl:block 2xl:w-[260px]">
      <nav
        aria-label="Pangunahing nabigasyon"
        className="has-scrollbar sticky top-0 flex h-screen w-full flex-col overflow-y-auto bg-plum-800 px-4 py-5"
      >
        {/* Tatak */}
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5"
          aria-label="HASA — pangunahing pahina ng mag-aaral"
        >
          <img
            src={LOGO_IMAGE}
            alt=""
            className="h-[52px] w-[52px] shrink-0 object-contain"
            aria-hidden="true"
          />
          <span className="min-w-0">
            <span className="block font-mono text-[26px] font-bold leading-none tracking-tight text-ink">
              HASA
            </span>
            <span className="mt-0.5 block text-[11px] font-semibold uppercase leading-tight tracking-[0.14em] text-lav-200">
              Student
            </span>
          </span>
        </Link>

        <div className="mt-3 h-[2px] w-full bg-ink/80" aria-hidden="true" />

        {/* Mga link sa nabigasyon */}
        <ul className="mt-4 space-y-1">
          {PRIMARY_NAV_ITEMS.map(({ to, label, fullLabel, Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                aria-label={fullLabel}
                className={({ isActive }) =>
                  cx(
                    "flex min-h-[42px] items-center gap-3 rounded-[11px] px-3 text-[14px] font-medium leading-tight transition-colors",
                    isActive
                      ? "bg-lav-400/70 text-accent-deep"
                      : "text-canvas hover:bg-white/10",
                  )
                }
              >
                <img
                  src={Icon}
                  alt=""
                  className="h-[22px] w-[22px] shrink-0"
                  aria-hidden="true"
                />
                <span className="min-w-0 truncate">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mga pahinang wala sa pangunahing panel. */}
        <div className="mt-5 border-t border-white/15 pt-3">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-canvas/50">
            Iba pang pahina
          </p>
          <ul className="mt-1.5 space-y-0.5">
            {EXTRA_NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cx(
                      "block truncate rounded-[9px] px-3 py-1.5 text-[13px] font-semibold transition-colors",
                      isActive
                        ? "bg-lav-400/70 text-accent-deep"
                        : "text-canvas/75 hover:bg-white/10 hover:text-canvas",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Paa: logout */}
        <div className="mt-auto border-t border-white/15 pt-3">
          <button
            type="button"
            onClick={handleSignOut}
            title="Inaalis ang naka-save na demo account at ibinabalik sa pahina ng pag-log in"
            className="flex w-full min-h-[42px] items-center gap-3 rounded-[11px] px-3 text-[14px] font-medium text-canvas transition-colors hover:bg-white/10"
          >
            <img
              src={logoutIcon}
              alt=""
              className="h-[22px] w-[22px] opacity-80"
              aria-hidden="true"
            />
            Mag-logout
          </button>
          <p className="px-3 pt-1 text-[10px] leading-relaxed text-canvas/50">
            Prototype lamang. Walang totoong datos ng mag-aaral.
          </p>
        </div>
      </nav>
    </aside>
  );
}
