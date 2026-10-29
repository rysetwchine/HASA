import { Link, NavLink } from "react-router";
import {
  EXTRA_NAV_ITEMS,
  LOGO_IMAGE,
  PRIMARY_NAV_ITEMS,
} from "../../config/navigation.js";
import logoutIcon from "../../assets/images/layout/icon-logout.png";
import { cx } from "../../utils/cx.js";

/**
 * Ang sidebar ay batay sa frame "dashboard" ng Figma:
 * lapad 420px (1658px na frame), kulay #3e3e75, mga item na 79px ang taas,
 * aktibong pil ay #8b8bba sa ~67% opacity r15, teksto ng item ay 25px.
 *
 * Ang lapad ay 340px sa xl at 420px sa 2xl upang hindi maging masikip ang
 * nilalaman sa mas maliit na desktop. Ang mga sukat ng tatak at ng linya
 * sa ilalim nito ay umaangkop sa parehong lapad.
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
          <img
            src={LOGO_IMAGE}
            alt=""
            className="h-[104px] w-auto shrink-0 object-contain"
            aria-hidden="true"
          />
          <span className="min-w-0 pt-6">
            <span className="block font-mono text-[42px] font-bold leading-none tracking-tight text-ink 2xl:text-[46px]">
              HASA
            </span>
            <span className="mt-1 block text-[16px] font-semibold leading-tight text-lav-200 2xl:text-[17px]">
              STUDENT
            </span>
          </span>
        </Link>

        {/* Linya sa ilalim ng tatak: dating `ml-40 w-[180px]` na lumalabis
            sa 340px na sidebar at nagdudulot ng horizontal scrollbar. */}
        <div
          className="mt-1 ml-auto h-[3px] w-full max-w-[180px] shrink-0 bg-ink"
          aria-hidden="true"
        />

        {/* Mga link sa nabigasyon */}
        <ul className="mt-8 space-y-2.5">
          {PRIMARY_NAV_ITEMS.map(({ to, label, Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cx(
                    "flex min-h-[62px] items-center gap-4 rounded-[15px] px-5 text-[22px] font-medium transition-colors 2xl:min-h-[66px] 2xl:text-[23px]",
                    isActive
                      ? "bg-lav-400/70 text-accent-deep"
                      : "text-canvas hover:bg-white/10",
                  )
                }
              >
                <img
                  src={Icon}
                  alt=""
                  className="h-10 w-10 shrink-0"
                  aria-hidden="true"
                />
                <span className="truncate">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/*
         * Ang /misyon at /guro ay nasa MobileNav noon pero wala sa sidebar,
         * kaya hindi sila maabot sa desktop maliban sa pagta-type ng URL.
         */}
        <div className="mt-auto border-t border-white/15 pt-4">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-canvas/50">
            Iba pang pahina
          </p>
          <ul className="mt-2 space-y-1">
            {EXTRA_NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cx(
                      "block truncate rounded-[12px] px-3 py-2 text-[15px] font-semibold transition-colors",
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
        <div className="flex items-center gap-4 px-5 pt-6">
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Walang authentication sa prototype, kaya hindi pa available ang logout"
            className="flex cursor-not-allowed items-center gap-4 text-[23px] font-medium text-canvas/70"
          >
            <img
              src={logoutIcon}
              alt=""
              className="h-10 w-10 opacity-60"
              aria-hidden="true"
            />
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
