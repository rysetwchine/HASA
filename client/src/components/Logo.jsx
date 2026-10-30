import { Link } from "react-router";
import { BookOpen } from "lucide-react";
import { cx } from "../utils/cx.js";

export default function Logo({ to = "/", tone = "light", compact = false, className = "" }) {
  const dark = tone === "dark";
  return (
    <Link
      to={to}
      className={cx("inline-flex items-center gap-2.5 rounded-lg", className)}
      aria-label="HASA — Simula"
    >
      <span
        className={cx(
          "grid size-10 shrink-0 place-items-center rounded-xl shadow-sm",
          dark ? "bg-white text-plum-800" : "bg-plum-800 text-gold",
        )}
      >
        <BookOpen className="size-5" aria-hidden="true" />
      </span>
      <span className="leading-none">
        <span
          className={cx(
            "block text-xl font-extrabold tracking-tight",
            dark ? "text-white" : "text-ink",
          )}
        >
          HASA
        </span>
        {!compact ? (
          <span
            className={cx(
              "mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em]",
              dark ? "text-plum-200" : "text-muted",
            )}
          >
            Araling Panlipunan 8
          </span>
        ) : null}
      </span>
    </Link>
  );
}
