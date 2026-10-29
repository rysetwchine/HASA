import { cx } from "../../utils/cx.js";

/**
 * Pabagu-bagong spinner. Dekorasyon lamang ito (aria-hidden), kaya ang
 * nagboboto ng "Naglo-load…" na teksto ang dapat magbigay ng label.
 */
export default function Spinner({ className }) {
  return (
    <svg
      className={cx("animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
