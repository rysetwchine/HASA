import { NavLink, Link, useNavigate } from "react-router";
import { PRIMARY_NAV_ITEMS } from "../../config/navigation.js";
import { cx } from "../../utils/cx.js";
import { useSession } from "../../app/SessionProvider.jsx";
import { LogOut } from "lucide-react";

function NavBottomItem({ item, onNavigate }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      aria-label={item.fullLabel}
      className={({ isActive }) =>
        cx(
          "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1 transition-colors",
          isActive ? "bg-lav-400/70 text-accent-deep" : "text-canvas",
        )
      }
    >
      {({ isActive }) => (
        <>
          <img src={item.Icon} alt="" className="h-5 w-5" aria-hidden="true" />
          <span
            className={cx(
              "w-full truncate text-center text-[8.5px] font-semibold leading-tight",
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

/**
 * Para sa maliliit na screen: pababang bar ng nabigasyon (anim na item),
 * mga dagdag na pahina, at logout.
 */
export default function MobileNav({ onNavigate }) {
  const { signOut } = useSession();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate("/login");
  }

  return (
    <nav
      aria-label="Nabigasyon sa mobile"
      className="sticky bottom-0 z-40 border-t border-white/10 bg-plum-800 pb-[max(env(safe-area-inset-bottom),6px)] pt-1.5 xl:hidden"
    >
      <ul className="flex items-start gap-0.5 px-1">
        {PRIMARY_NAV_ITEMS.map((item) => (
          <li key={item.to} className="min-w-0 flex-1">
            <NavBottomItem item={item} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>

      <div className="mt-1 flex items-center justify-center gap-1 border-t border-white/10 px-2 pt-1">
        <Link
          to="/misyon"
          onClick={onNavigate}
          className="truncate rounded-full px-2.5 py-1 text-[10px] font-semibold text-canvas/80 hover:text-canvas"
        >
          Misyon
        </Link>
        <Link
          to="/guro"
          onClick={onNavigate}
          className="truncate rounded-full px-2.5 py-1 text-[10px] font-semibold text-canvas/80 hover:text-canvas"
        >
          Tanawan ng Guro
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold text-canvas/80 hover:text-canvas"
        >
          <LogOut className="h-3 w-3" aria-hidden="true" />
          Mag-logout
        </button>
      </div>
    </nav>
  );
}
