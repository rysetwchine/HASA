import { FlaskConical } from "lucide-react";
import { cx } from "../../lib/cx.js";
import { DEMO_NOTICE } from "../../features/demo/demoData.js";

/**
 * Siksik na paalala para sa mga pahinang puno ng halimbawang datos.
 * Hindi ito nagpapanggap na totoong impormasyon ang nilalaman.
 */
export default function DemoNotice({ className, children = DEMO_NOTICE }) {
  return (
    <div
      className={cx(
        "flex items-start gap-2.5 rounded-[15px] border border-line-dark bg-gold-soft/70 px-3.5 py-2.5 text-xs leading-relaxed text-brown",
        className,
      )}
    >
      <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>
        <span className="font-semibold">Prototype lamang. </span>
        {children}
      </p>
    </div>
  );
}
