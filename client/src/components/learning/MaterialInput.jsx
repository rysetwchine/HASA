import { useState } from "react";
import { ClipboardPaste, Info, Upload } from "lucide-react";
import Alert from "../ui/Alert.jsx";
import Chip from "../ui/Chip.jsx";
import { fieldClasses } from "../ui/FormField.jsx";
import { cx } from "../../lib/cx.js";

const TABS = [
  {
    id: "paste",
    label: "I-paste ang teksto",
    shortLabel: "I-paste",
    Icon: ClipboardPaste,
  },
  {
    id: "upload",
    label: "Mag-upload ng file",
    shortLabel: "Mag-upload",
    Icon: Upload,
  },
];

/**
 * Unang hakbang: static lamang. Ang upload ay naka-disable dahil wala pang
 * file validation at text extraction sa backend.
 */
export default function MaterialInput({ value = "", onChange, disabled = false }) {
  const [tab, setTab] = useState("paste");

  return (
    <div className="space-y-4">
      <div
        role="tablist"
        aria-label="Paraan ng paglalagay ng materyal"
        className="grid grid-cols-2 gap-1 rounded-xl bg-cream-100 p-1"
      >
        {TABS.map(({ id, label, shortLabel, Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-label={label}
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            onClick={() => setTab(id)}
            className={cx(
              "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold transition-colors sm:px-3 sm:text-sm",
              tab === id
                ? "bg-white text-brand-700 shadow-sm"
                : "text-muted hover:text-ink",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap sm:hidden">{shortLabel}</span>
            <span className="hidden sm:inline">{label}</span>
            {id === "upload" ? (
              <Chip tone="muted" className="hidden px-1.5 py-0 text-[9px] sm:inline-flex">
                Hindi pa
              </Chip>
            ) : null}
          </button>
        ))}
      </div>

      {tab === "paste" ? (
        <div
          role="tabpanel"
          id="panel-paste"
          aria-labelledby="tab-paste"
          className="space-y-2"
        >
          <div className="flex flex-wrap items-end justify-between gap-2">
            <label htmlFor="material-text" className="block text-sm font-medium text-ink">
              Teksto mula sa modyul
            </label>
            <span className="text-[10px] font-medium text-muted">
              {value.length} karakter
            </span>
          </div>
          <textarea
            id="material-text"
            rows={10}
            value={value}
            disabled={disabled}
            onChange={(event) => onChange?.(event.target.value)}
            placeholder="I-paste dito ang teksto mula sa iyong modyul…"
            className={cx(
              fieldClasses,
              "min-h-[220px] resize-y text-sm leading-relaxed sm:min-h-[260px]",
            )}
          />
          <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Huwag maglagay ng pangalan, tirahan, o iba pang personal na
            impormasyon.
          </p>
        </div>
      ) : (
        <div
          role="tabpanel"
          id="panel-upload"
          aria-labelledby="tab-upload"
          className="space-y-3"
        >
          <label htmlFor="material-file" className="block text-sm font-medium text-ink">
            PDF o Word na dokumento
          </label>
          <input
            id="material-file"
            type="file"
            accept=".pdf,.doc,.docx"
            disabled
            className="block w-full cursor-not-allowed rounded-xl border border-line bg-cream-100 px-3 py-10 text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-cream-200 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-ink"
          />
          <Alert variant="info" title="Hindi pa available sa yugtong ito">
            Magagamit ang pag-upload kapag naisagawa na ang ligtas na
            pagsusuri ng file at pagkuha ng teksto. Hindi pa sinusuportahan ang
            mga scanned na PDF na walang OCR.
          </Alert>
        </div>
      )}
    </div>
  );
}
