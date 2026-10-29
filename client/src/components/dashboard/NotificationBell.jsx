import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Bell, X } from "lucide-react";
import { demoFigmaAnnouncements } from "../../data/demoData.js";
import bellIcon from "../../assets/images/layout/icon-bell.png";
import { cx } from "../../utils/cx.js";

/**
 * Kampanilya na may panel ng mga abiso.
 *
 * May laman ang panel mula sa `demoFigmaAnnouncements` (halimbawang
 * nilalaman mula sa Figma), at may malinaw na paalala na walang live na
 * feed. Hindi ito nagpapanggap na totoong anunsyo.
 */
export default function NotificationBell({ bare = false }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
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

  const items = demoFigmaAnnouncements;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="notification-panel"
        aria-label="Mga Abiso"
        className={cx(
          "relative inline-flex items-center justify-center rounded-xl text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          bare
            ? "h-10 w-10 hover:bg-white/50"
            : "h-11 w-11 border border-line bg-white shadow-sm hover:bg-cream-50",
        )}
      >
        {bare ? (
          <img
            src={bellIcon}
            alt=""
            className="h-[26px] w-[26px] opacity-90"
            aria-hidden="true"
          />
        ) : (
          <Bell className="h-5 w-5" aria-hidden="true" />
        )}
        {items.length > 0 ? (
          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-canvas"
            aria-hidden="true"
          />
        ) : null}
      </button>

      {open ? (
        <div
          id="notification-panel"
          role="dialog"
          aria-label="Mga Abiso"
          className="absolute right-0 z-40 mt-2 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-line bg-white shadow-lifted"
        >
          <div className="flex items-start justify-between gap-2 border-b border-line bg-canvas/70 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-ink">Mga Abiso</p>
              <p className="mt-0.5 text-[11px] text-muted">
                {items.length} halimbawang anunsyo
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
              aria-label="Isara ang mga abiso"
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-cream-100 hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {items.length > 0 ? (
            <ul className="max-h-[300px] divide-y divide-line overflow-y-auto">
              {items.map((item) => (
                <li key={item.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-semibold leading-snug text-ink">
                      {item.title}
                    </p>
                    {item.isNew ? (
                      <span className="shrink-0 rounded-full bg-accent/10 px-1.5 py-0.5 text-[9px] font-bold text-accent-deep">
                        BAGO
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
                    {item.detail}
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-muted/80">
                    {item.date}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center">
              <Bell
                className="mx-auto h-6 w-6 text-brand-300"
                aria-hidden="true"
              />
              <p className="mt-2 text-sm font-semibold text-ink">
                Wala pang abiso
              </p>
            </div>
          )}

          <div className="border-t border-line px-4 py-2.5">
            <p className="text-[10px] leading-relaxed text-muted">
              Walang live na notification system sa prototype. Halimbawa lamang
              ang mga ito mula sa Figma.
            </p>
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="mt-1.5 inline-block text-[11px] font-semibold text-accent-deep hover:underline"
            >
              Tingnan ang lahat sa dashboard
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
