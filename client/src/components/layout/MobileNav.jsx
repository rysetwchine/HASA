import { NavLink } from "react-router";
import { PRIMARY_NAV_ITEMS, EXTRA_NAV_ITEMS } from "./navigation.js";
import { cx } from "../../lib/cx.js";

function NavBottomItem({ item, onNavigate, end }) {
  return (
    <NavLink
      to={item.to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cx(
          "flex min-w-[46px] flex-col items-center gap-0.5 rounded-xl px-1.5 py-1 transition-colors",
          isActive ? "bg-lav-400/70 text-accent-deep" : "text-canvas",
        )
      }
    >
      {({ isActive }) => (
        <>
          <img src={item.Icon} alt="" className="h-6 w-6" aria-hidden="true" />
          <span
            className={cx(
              "max-w-[62px] truncate text-[9px] font-semibold",
              isActive ? "text-accent-deep" : "text-canvas/80",
            )}
          >
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
}

function TextLink({ item, onNavigate }) {
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cx(
          "truncate rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors",
          isActive ? "bg-lav-400/70 text-accent-deep" : "text-canvas/80 hover:text-canvas",
        )
      }
    >
      {item.label}
    </NavLink>
  );
}

/**
 * Para sa maliliit na screen: pababang bar ng nabigasyon (kapareho ng
 * anim na item ng sidebar) at mga pahina na wala sa Figma panel.
 */
export default function MobileNav({ onNavigate }) {
  return (
    <nav
      aria-label="Nabigasyon sa mobile"
      className="sticky bottom-0 z-40 bg-plum-800 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 xl:hidden"
    >
      <ul className="flex items-start justify-around gap-1">
        {PRIMARY_NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavBottomItem item={item} onNavigate={onNavigate} end={item.end} />
          </li>
        ))}
      </ul>
      <ul className="flex items-center justify-center gap-1 overflow-x-auto pt-1">
        {EXTRA_NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <TextLink item={item} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
