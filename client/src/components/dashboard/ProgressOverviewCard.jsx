import { Info } from "lucide-react";
import Card from "../ui/Card.jsx";
import ProgressBar from "../ui/ProgressBar.jsx";

export default function ProgressOverviewCard({ items, overall }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">
            Pag-unlad sa Pag-aaral
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-ink">
            Mga natapos mong gawain
          </h2>
        </div>
        <span className="text-[10px] font-medium text-muted">
          Halimbawang datos
        </span>
      </div>

      <div className="mt-5 grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <div
          className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(var(--color-brand-600) ${overall}%, var(--color-line) 0)`,
          }}
          role="img"
          aria-label={`Kabuuang pag-unlad: ${overall}%`}
        >
          <div className="flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full bg-white">
            <span className="text-2xl font-bold tracking-tight text-ink">
              {overall}%
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wide text-muted">
              Kabuuan
            </span>
          </div>
        </div>

        <div className="space-y-3.5">
          {items.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-slate-600">{item.label}</span>
                <span className="font-semibold text-ink">
                  {item.value}/{item.max}
                </span>
              </div>
              <ProgressBar
                className="mt-1.5"
                value={item.value}
                max={item.max}
                tone={item.tone}
                size="sm"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 flex items-start gap-1.5 rounded-xl bg-canvas px-3 py-2.5 text-[11px] leading-relaxed text-muted">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Batay ito sa mga natapos na aktibidad at hakbang ng misyon — hindi ito
        pagsukat ng kakayahan sa pagbasa.
      </p>
    </Card>
  );
}
