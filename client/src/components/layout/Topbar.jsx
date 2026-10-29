import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Award, ChevronDown, LogOut, TrendingUp, UserRound } from "lucide-react";
import NotificationBell from "../dashboard/NotificationBell.jsx";
import { useProgress } from "../../app/ProgressProvider.jsx";
import { useSession } from "../../app/SessionProvider.jsx";
import { DEMO_STUDENT_LABEL, getLevelProgress } from "../../data/demoData.js";
import { cx } from "../../utils/cx.js";

/**
 * Pahabang bahagi ng itaas: antas ng XP sa kaliwa, kampanilya at profile
 * sa kanan. Nasa normal na daloy (hindi absolute) ito kaya hindi ito
 * nagpapatong sa banner o nilalaman sa ibaba.
 */
export default function Topbar() {
  const { progress } = useProgress();
  const { student, signOut } = useSession();
  const level = getLevelProgress(progress.xp);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onPointerDown = (event) => {
      if (
        !menuRef.current?.contains(event.target) &&
        !buttonRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const percent = Math.min(
    100,
    Math.round((level.xpIntoLevel / level.xpForNextLevel) * 100),
  );

  const name = student?.displayName ?? "Bisita";

  function handleSignOut() {
    setMenuOpen(false);
    signOut();
    navigate("/login");
  }

  return (
    <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 pb-4">
      {/* Pangkat ng antas */}
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className="pointer-events-none flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-full bg-canvas shadow-[0_0_0_3px_#aeaec4]"
          aria-hidden="true"
        >
          <span className="text-[13px] font-extrabold leading-none text-plum-800">
            {level.level}
          </span>
          <span className="text-[8px] leading-none text-ink/80">Antas</span>
        </div>
        <div className="min-w-0">
          <div
            className="h-1.5 w-[110px] max-w-full overflow-hidden rounded-full bg-[#c4c4c4] sm:w-[130px]"
            role="progressbar"
            aria-label="XP patungo sa susunod na antas"
            aria-valuenow={level.xpIntoLevel}
            aria-valuemin={0}
            aria-valuemax={level.xpForNextLevel}
          >
            <div
              className="h-full rounded-full bg-plum-800"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-1 truncate text-[11px] font-medium text-ink">
            {level.xpIntoLevel.toLocaleString()} /{" "}
            {level.xpForNextLevel.toLocaleString()} XP
            <span className="text-ink/70"> para sa antas {level.level + 1}</span>
          </p>
        </div>
      </div>

      {/* Kampanilya + profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationBell bare />

        <div className="relative">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-controls="profile-menu"
            aria-label={`Menu ng profile ni ${name}`}
            className="flex items-center gap-2 rounded-full px-1 py-1 transition-colors hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lav-400 text-lg font-bold text-canvas"
              aria-hidden="true"
            >
              {student?.avatarInitials ?? <UserRound className="h-5 w-5" />}
            </span>
            <span className="hidden min-w-0 text-left sm:block">
              <span className="block max-w-[130px] truncate text-[14px] font-semibold leading-tight text-ink">
                {name}
              </span>
              <span className="block text-[11px] font-light leading-tight text-ink/80">
                {student
                  ? `${student.gradeShort} · ${student.sectionShort}`
                  : "Walang naka-log in"}
              </span>
            </span>
            <ChevronDown
              className={cx(
                "hidden h-4 w-4 text-ink/60 transition-transform sm:block",
                menuOpen && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>

          {menuOpen ? (
            <div
              ref={menuRef}
              id="profile-menu"
              role="menu"
              aria-label="Menu ng profile"
              className="absolute right-0 z-40 mt-2 w-[240px] overflow-hidden rounded-xl border border-line bg-white shadow-lifted"
            >
              <div className="border-b border-line bg-canvas/70 px-4 py-3">
                <p className="truncate text-sm font-bold text-ink">{name}</p>
                <p className="mt-0.5 text-[11px] text-muted">
                  {student
                    ? `${student.gradeShort} · ${student.sectionShort} · Antas ${level.level}`
                    : "Prototype na walang totoong session"}
                </p>
              </div>

              <div className="p-1.5">
                <Link
                  to="/pag-unlad"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-cream-100"
                >
                  <TrendingUp className="h-4 w-4 text-accent" aria-hidden="true" />
                  Aking Pag-unlad
                </Link>
                <Link
                  to="/mga-nakamit"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-cream-100"
                >
                  <Award className="h-4 w-4 text-accent" aria-hidden="true" />
                  Mga Gantimpala
                </Link>
                <Link
                  to="/login"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-cream-100"
                >
                  <UserRound className="h-4 w-4 text-accent" aria-hidden="true" />
                  Pahina ng Pag-log in
                </Link>

                <div className="my-1 h-px bg-line" aria-hidden="true" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-semibold text-danger-deep hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Mag-logout
                </button>
              </div>

              <p className="border-t border-line px-4 py-2 text-[10px] leading-relaxed text-muted">
                Prototype: walang totoong account o session. Inaalis lamang ng
                logout ang naka-save na demo account sa browser na ito.
              </p>
            </div>
          ) : null}
        </div>

        <span className="sr-only">{DEMO_STUDENT_LABEL}</span>
      </div>
    </div>
  );
}
