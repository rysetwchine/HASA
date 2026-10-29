import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cx } from "../../utils/cx.js";

const SIZES = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible na modal para sa activity player, anunsyo, at iba pang
 * pansamantalang panel. Isinasara sa Escape, sa backdrop, o sa X button.
 */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  eyebrow,
  children,
  footer,
  size = "lg",
  className,
}) {
  const titleId = useId();
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const previouslyFocused = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open || typeof document === "undefined") return undefined;

    previouslyFocused.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll(FOCUSABLE),
      ).filter((element) => element.offsetParent !== null || element === closeRef.current);

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-plum-950/60 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCloseRef.current?.();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cx(
          "my-auto flex max-h-[92vh] w-full flex-col overflow-hidden rounded-[25px] border border-line-dark bg-white shadow-lifted",
          SIZES[size] ?? SIZES.lg,
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line bg-canvas/70 px-5 py-4 sm:px-7">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-strong">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2
                id={titleId}
                className="mt-0.5 text-xl font-bold leading-tight tracking-tight text-ink sm:text-2xl"
              >
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {subtitle}
              </p>
            ) : null}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => onCloseRef.current?.()}
            aria-label="Isara ang dialog"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-muted shadow-sm transition-colors hover:border-line-dark hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {children}
        </div>

        {footer ? (
          <div className="border-t border-line bg-canvas/50 px-5 py-4 sm:px-7">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
