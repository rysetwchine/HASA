import { Link, NavLink } from "react-router";
import { LOGO_IMAGE, PRIMARY_NAV_ITEMS } from "./navigation.js";
import logoutIcon from "../../assets/figma/icon-logout.png";
import { cx } from "../../lib/cx.js";

/**
 * Ang sidebar ay batay sa frame "dashboard" ng Figma:
 * lapad 420px (1658px na frame), kulay #3e3e75, mga item na 79px ang taas,
 * aktibong pil ay #8b8bba sa ~67% opacity r15, teksto ng item ay 25px.
 */
export default function Sidebar({ onNavigate }) {
  return (
    <aside className="hidden w-[340px] shrink-0 xl:flex 2xl:w-[420px]">
      <nav
        aria-label="Pangunahing nabigasyon"
        className="has-scrollbar sticky top-0 flex h-screen w-full flex-col overflow-y-auto bg-plum-800 px-7 py-9"
      >
        {/* Tatak */}
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-end gap-2"
          aria-label="HASA — student dashboard"
        >
          <img src={LOGO_IMAGE} alt="" className="h-[120px] w-[108px] shrink-0" aria-hidden="true" />
          <span className="min-w-0 pt-8">
            <span className="block font-mono text-[46px] font-bold leading-none tracking-tight text-ink">
              HASA
            </span>
            <span className="mt-1 block text-[17px] font-semibold leading-tight text-lav-200">
              STUDENT
            </span>
          </span>
        </Link>
        <div className="ml-40 mt-1 h-[3px] w-[180px] shrink-0 bg-ink" aria-hidden="true" />

        {/* Mga link sa nabigasyon */}
        <ul className="mt-10 space-y-2.5">
          {PRIMARY_NAV_ITEMS.map(({ to, label, Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                aria-current={undefined}
                className={({ isActive }) =>
                  cx(
                    "flex min-h-[66px] items-center gap-4 rounded-[15px] px-5 text-[23px] font-medium transition-colors",
                    isActive
                      ? "bg-lav-400/70 text-accent-deep"
                      : "text-canvas hover:bg-white/10",
                  )
                }
              >
                <img src={Icon} alt="" className="h-10 w-10 shrink-0" aria-hidden="true" />
                <span className="truncate">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Paa: logout */}
        <div className="mt-auto flex min-h-[66px] items-center gap-4 px-5 pt-8">
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Hindi pa available sa prototype"
            className="flex cursor-not-allowed items-center gap-4 text-[23px] font-medium text-canvas/70"
          >
            <img src={logoutIcon} alt="" className="h-10 w-10 opacity-60" aria-hidden="true" />
            Logout
          </button>
        </div>
        <p className="px-5 pt-3 pb-1 text-[11px] leading-relaxed text-canvas/50">
          Prototype lamang. Walang totoong datos ng mag-aaral.
        </p>
      </nav>
    </aside>
  );
}
