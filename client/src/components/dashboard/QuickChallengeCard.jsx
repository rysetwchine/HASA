import { ArrowRight, MessageCircleQuestion, Sparkles } from "lucide-react";
import { Link } from "react-router";
import Card from "../ui/Card.jsx";
import Chip from "../ui/Chip.jsx";
import { buttonClasses } from "../ui/Button.jsx";

export default function QuickChallengeCard({ question, totalQuestions }) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">
            Mabilisang Hamon
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-ink">
            Subukan ang pag-unawa
          </h2>
        </div>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-brand-700"
          aria-hidden="true"
        >
          <Sparkles className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-line bg-canvas/70 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="accent">
            <MessageCircleQuestion className="h-3 w-3" aria-hidden="true" />
            Halimbawang tanong
          </Chip>
          <span className="text-[10px] font-medium text-muted">
            {totalQuestions} tanong
          </span>
        </div>
        <p className="mt-2 text-sm font-medium leading-relaxed text-ink">
          {question.prompt}
        </p>
      </div>

      <div className="mt-auto pt-4">
        <Link
          to="/aktibidad"
          className={buttonClasses({ variant: "secondary", className: "w-full" })}
        >
          Simulan ang hamon
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}
