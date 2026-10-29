import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Button from "../../components/ui/Button.jsx";
import Chip from "../../components/ui/Chip.jsx";
import DemoNotice from "../../components/ui/DemoNotice.jsx";
import { buttonClasses } from "../../components/ui/Button.jsx";
import LevelPicker from "../../components/learning/LevelPicker.jsx";
import MaterialInput from "../../components/learning/MaterialInput.jsx";
import ReadingLevelLabel from "../../components/learning/ReadingLevelLabel.jsx";
import VocabularyItem from "../../components/learning/VocabularyItem.jsx";
import WorkspaceStep from "../../components/learning/WorkspaceStep.jsx";
import { DEFAULT_READING_LEVEL } from "../../utils/readingLevels.js";
import {
  DEMO_AI_NOTICE,
  demoMaterial,
  demoSimplified,
  demoVocabulary,
} from "../../data/demoData.js";

const WORKSPACE_STEPS = [
  { number: "01", label: "Ilagay o i-upload ang materyal" },
  { number: "02", label: "Piliin ang antas ng pagbasa" },
  { number: "03", label: "Pasimplehin ang materyal" },
  { number: "04", label: "Basahin ang resulta at sagutin ang mga tanong" },
];

export default function SimplifyPage() {
  const [text, setText] = useState(demoMaterial.originalText);
  const [level, setLevel] = useState(DEFAULT_READING_LEVEL);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <PageHeader
        eyebrow="Kagamitang Pampagkatuto"
        title="AI Simplifier"
        description="I-paste ang teksto mula sa iyong modyul, piliin ang antas ng pagbasa, at tingnan ang halimbawang resulta. Wala pang aktibong AI provider sa prototype."
      />

      <DemoNotice />

      <Alert variant="warning" title="Wala pang aktibong AI provider">
        Ang pindutang Pasimplehin at ang halimbawang teksto sa ibaba ay hindi
        gumagawa ng bagong paliwanag. Ipapakita lamang ng prototype ang
        magiging anyo ng feature kapag nakakonekta na ang AI.
      </Alert>

      <ol
        aria-label="Apat na hakbang sa Pasimplehin"
        className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4"
      >
        {WORKSPACE_STEPS.map((step) => (
          <li
            key={step.number}
            className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2.5 shadow-card"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-[10px] font-bold text-brand-700">
              {step.number}
            </span>
            <span className="text-xs font-semibold leading-snug text-muted">
              {step.label}
            </span>
          </li>
        ))}
      </ol>

      <WorkspaceStep
        number="01"
        title="Ilagay o i-upload ang materyal"
        description="Maaari mong i-paste ang teksto mula sa modyul. Hindi pa available ang pag-upload ng file."
      >
        <MaterialInput value={text} onChange={setText} />
      </WorkspaceStep>

      <WorkspaceStep
        number="02"
        title="Piliin ang antas ng pagbasa"
        description="Ikaw ang pipili ng paraan ng pagpapasimple. Hindi ito diagnosis o pagsukat ng kakayahan."
      >
        <LevelPicker value={level} onChange={setLevel} />
      </WorkspaceStep>

      <WorkspaceStep
        number="03"
        title="Pasimplehin ang materyal"
        description="Dito ilalagay ang AI provider kapag aktibo na ang backend. Sa ngayon, hindi pa ito magagamit."
      >
        <div className="rounded-xl border border-line bg-canvas/60 p-4">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <label
                htmlFor="ai-provider"
                className="block text-sm font-semibold text-ink"
              >
                AI provider
              </label>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Kapag aktibo na, maaari mong piliin kung Gemini o OpenAI ang
                gagamitin. Nasa server ang mga API key at hindi makikita sa
                browser.
              </p>
              <select
                id="ai-provider"
                disabled
                defaultValue="gemini"
                aria-describedby="ai-provider-note"
                className="mt-2 w-full max-w-xs cursor-not-allowed rounded-xl border border-line bg-cream-100 px-3 py-2.5 text-sm text-muted"
              >
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI</option>
              </select>
            </div>

            <Button disabled size="lg" className="w-full md:w-auto">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Pasimplehin
            </Button>
          </div>

          <p
            id="ai-provider-note"
            className="mt-3 flex items-start gap-1.5 text-xs font-medium text-gold-700"
          >
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Hindi naka-configure ang AI provider sa yugtong ito. Magagamit ang
            pagpapasimple kapag nakakonekta na ang AI provider.
          </p>
        </div>
      </WorkspaceStep>

      <WorkspaceStep
        number="04"
        title="Basahin ang resulta at sagutin ang mga tanong"
        description="Ito ay STATIC na halimbawa mula sa demo data. Hindi ito ang output ng pindutang Pasimplehin."
      >
        <Alert variant="warning" title="Hindi gawa ng AI">
          {DEMO_AI_NOTICE} Hindi rin ito nagbabago ayon sa antas na pinili mo sa
          hakbang 02 — iisa ang halimbawang teksto sa prototype.
        </Alert>

        <div
          id="teksto"
          className="mt-4 scroll-mt-24 rounded-xl border border-line bg-white p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-700">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-base font-bold leading-snug tracking-tight text-ink">
                  Pinasimpleng Teksto
                </h3>
                <p className="mt-1 text-xs text-muted">
                  Para sa: {demoMaterial.title}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ReadingLevelLabel level={demoSimplified.readingLevel} />
              <Chip tone="muted">Halimbawa</Chip>
            </div>
          </div>

          <p className="mt-4 rounded-xl bg-cream-50 p-4 text-sm leading-7 text-ink/80 sm:text-[15px]">
            {demoSimplified.text}
          </p>

          <div id="talasalitaan" className="mt-5 scroll-mt-24">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-bold text-ink">Talasalitaan</h4>
              <span className="text-[10px] font-medium text-muted">
                {demoVocabulary.length} salita
              </span>
            </div>
            <ul className="mt-3 grid gap-3 md:grid-cols-2">
              {demoVocabulary.map((item) => (
                <VocabularyItem key={item.word} {...item} />
              ))}
            </ul>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <Link
              to="/aktibidad?activity=reading-water"
              className={buttonClasses({ variant: "primary" })}
            >
              <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              Sagutin ang mga tanong
            </Link>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              Ang mga tanong ay halimbawa lamang sa prototype.
            </span>
          </div>
        </div>
      </WorkspaceStep>
    </div>
  );
}
