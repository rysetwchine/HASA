import { useEffect, useRef, useState } from "react";
import { Bell, X } from "lucide-react";
import { demoAnnouncements } from "../../data/demoData.js";
import bellIcon from "../../assets/images/layout/icon-bell.png";
import { cx } from "../../utils/cx.js";

/**
 * Bell na may popover. Walang announcement data sa prototype kaya
 * malinaw na empty state ang ipinapakita, hindi gawa-gawang anunsyo.
 * Ang `bare` ay para sa Topbar upang mapanatili ang dating itsura.
 */
export default function NotificationBell({ bare = false }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onPointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="notification-panel"
        aria-label="Mga abiso"
        className={cx(
          "inline-flex items-center justify-center rounded-xl text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          bare
            ? "h-10 w-10 hover:bg-white/50"
            : "h-11 w-11 border border-line bg-white shadow-sm hover:bg-cream-50",
        )}
      >
        {bare ? (
          <img
            src={bellIcon}
            alt=""
            className="h-[30px] w-[30px] opacity-90"
            aria-hidden="true"
          />
        ) : (
          <Bell className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {open ? (
        <div
          id="notification-panel"
          role="dialog"
          aria-label="Mga abiso"
          className="absolute right-0 z-30 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-line bg-white p-4 shadow-lifted"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display text-base font-bold text-ink">
                Mga abiso
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {demoAnnouncements.length} anunsyo
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Isara ang mga abiso"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-cream-100 hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 rounded-xl border border-dashed border-cream-300 bg-cream-50 px-4 py-6 text-center">
            <Bell className="mx-auto h-7 w-7 text-brand-300" aria-hidden="true" />
            <p className="mt-2 text-sm font-semibold text-ink">
              Wala pang anunsyo
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Lalabas dito ang mga bagong aralin at mensahe ng guro kapag
              aktibo na ang backend.
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-muted">
              Hindi nag-imbento ng anunsyo ang prototype.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
