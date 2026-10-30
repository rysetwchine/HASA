import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { ChevronRight, Flame, LogOut, Menu, Star, X } from "lucide-react";
import { useAuth } from "../../app/AuthProvider.jsx";
import { navForRole } from "../../config/navigation.js";
import { cx } from "../../utils/cx.js";
import { formatNumber } from "../../lib/format.js";
import Logo from "../Logo.jsx";

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function AppLayout({ role }) {
  const { user, stats, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const items = navForRole(role);
  const current =
    [...items].sort((a, b) => b.to.length - a.to.length).find((item) =>
      location.pathname.startsWith(item.to),
    ) || items[0];

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-canvas lg:flex">
      <a
        href="#nilalaman"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-plum-900 focus:shadow"
      >
        Lumaktaw sa nilalaman
      </a>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-plum-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Isara ang menu"
        />
      ) : null}

      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-40 flex w-72 transform flex-col bg-plum-900 text-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Pangunahing nabigasyon"
      >
        <div className="flex items-center justify-between px-5 pb-6 pt-6">
          <Logo to={role === "teacher" ? "/teacher/dashboard" : "/student/dashboard"} tone="dark" />
          <button
            type="button"
            className="rounded-lg p-2 text-plum-200 hover:bg-white/10 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Isara ang menu"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mx-5 mb-5 rounded-2xl border border-white/10 bg-white/5 p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-plum-300">
            {role === "teacher" ? "Klase" : "Antas ng pagbasa"}
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-white">
            {role === "teacher"
              ? user?.class?.name || "Walang klase"
              : user?.readingLevel === "independent"
                ? "Malayang Pagbasa"
                : user?.readingLevel === "frustration"
                  ? "Nahihirapang Pagbasa"
                  : "May Gabay na Pagbasa"}
          </p>
          {role === "teacher" && user?.class?.joinCode ? (
            <p className="mt-1 font-mono text-xs text-gold">{user.class.joinCode}</p>
          ) : null}
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4" aria-label="Mga pahina">
          <p className="px-2.5 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-plum-400">
            {role === "teacher" ? "Pamamahala" : "Pag-aaral"}
          </p>
          <ul className="space-y-1">
            {items.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    cx(
                      // 200ms: swabe sa mata, hindi mabagal.
                      "group flex min-h-11 items-center gap-3 rounded-xl px-2.5 py-1.5 text-sm font-semibold",
                      "transition-[background-color,color,box-shadow,transform] duration-200 ease-out",
                      "motion-reduce:transition-none motion-reduce:transform-none",
                      "active:scale-[0.985]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-plum-900",
                      isActive
                        ? "bg-white text-plum-900 shadow-[0_10px_22px_-16px_rgba(0,0,0,0.85)]"
                        : "text-plum-100 hover:bg-white/10 hover:text-white",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={cx(
                          "grid size-8 shrink-0 place-items-center rounded-lg",
                          "transition-[background-color,color,transform,box-shadow] duration-200 ease-out",
                          "motion-reduce:transition-none motion-reduce:transform-none",
                          "group-hover:scale-105 group-active:scale-95 motion-reduce:group-hover:scale-100 motion-reduce:group-active:scale-100",
                          isActive
                            ? "bg-accent text-white shadow-[0_6px_14px_-6px_rgba(138,56,245,0.9)]"
                            : // Puting lalagyan para kitang-kita ang itim na outline icon
                              // sa madilim na plum sidebar.
                              "bg-cream-50 text-ink shadow-sm ring-1 ring-black/10",
                        )}
                      >
                        <Icon
                          className="size-[17px]"
                          strokeWidth={isActive ? 2.4 : 1.9}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="truncate">{label}</span>
                      {isActive ? (
                        <ChevronRight
                          className="ml-auto size-4 shrink-0 text-plum-400"
                          aria-hidden="true"
                        />
                      ) : null}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            to={role === "teacher" ? "/teacher/profile" : "/student/profile"}
            className="flex items-center gap-3 rounded-xl p-2 transition-colors duration-200 ease-out hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-plum-900 motion-reduce:transition-none"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold text-sm font-bold text-brown">
              {initials(user?.displayName)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-white">
                {user?.displayName}
              </span>
              <span className="block text-xs capitalize text-plum-300">
                {role === "teacher" ? "Guro" : "Mag-aaral"}
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="group mt-2 flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-semibold text-plum-200 transition-[background-color,color,transform] duration-200 ease-out hover:bg-white/10 hover:text-white active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-plum-900 motion-reduce:transition-none motion-reduce:transform-none"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-plum-100 transition-[background-color,transform] duration-200 ease-out group-hover:scale-105 group-hover:bg-white/15 group-active:scale-95 motion-reduce:transition-none motion-reduce:transform-none">
              <LogOut className="size-[17px]" strokeWidth={1.9} aria-hidden="true" />
            </span>
            Mag-log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-plum-100 bg-canvas/90 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-10">
            <button
              type="button"
              className="rounded-lg border border-plum-200 bg-white p-2 text-plum-800 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Buksan ang menu"
              aria-expanded={open}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                {role === "teacher" ? "Guro" : "Mag-aaral"}
              </p>
              <p className="truncate text-sm font-bold text-ink">{current.label}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {role === "student" && stats ? (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-strong/30 bg-gold-soft px-2.5 py-1 text-xs font-bold text-brown">
                    <Star className="size-3.5" aria-hidden="true" />
                    {formatNumber(stats.points)} XP
                  </span>
                  <span className="hidden items-center gap-1.5 rounded-full border border-plum-100 bg-white px-2.5 py-1 text-xs font-bold text-plum-700 sm:inline-flex">
                    <Flame className="size-3.5 text-danger" aria-hidden="true" />
                    {stats.streak} araw
                  </span>
                </>
              ) : null}
              <Link
                to={role === "teacher" ? "/teacher/profile" : "/student/profile"}
                className="grid size-9 place-items-center rounded-full bg-plum-800 text-xs font-bold text-white"
                aria-label="Buksan ang profile"
              >
                {initials(user?.displayName)}
              </Link>
            </div>
          </div>
        </header>

        <main id="nilalaman" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <Outlet />
        </main>
        <footer className="border-t border-plum-100 px-4 py-5 text-center text-xs text-muted">
          HASA · Pantulong sa Araling Panlipunan para sa Baitang 8
        </footer>
      </div>
    </div>
  );
}
