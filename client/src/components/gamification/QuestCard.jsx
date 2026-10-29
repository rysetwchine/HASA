import { Compass } from "lucide-react";
import Card from "../ui/Card.jsx";
import Chip from "../ui/Chip.jsx";
import ProgressBar from "../ui/ProgressBar.jsx";
import QuestStep from "./QuestStep.jsx";

export default function QuestCard({ quest }) {
  const total = quest.steps.length;
  const completed = quest.steps.filter((step) => step.completed).length;
  const isDone = total > 0 && completed === total;

  return (
    <Card as="section" className="overflow-hidden p-0">
      <div className="border-b border-line bg-canvas/70 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-brand-700">
              <Compass className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-bold tracking-tight text-ink">
                {quest.title}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
                {quest.narrative}
              </p>
            </div>
          </div>
          <Chip tone={isDone ? "success" : "brand"}>
            {isDone ? "Natapos" : "Kasalukuyan"}
          </Chip>
        </div>

        <ProgressBar
          className="mt-5 max-w-xl"
          value={completed}
          max={total}
          tone={isDone ? "success" : "brand"}
          label={`${completed} sa ${total} hakbang`}
        />
      </div>

      <ol className="space-y-3 p-5 sm:p-6">
        {quest.steps.map((step, index) => (
          <QuestStep key={step.id} step={step} number={index + 1} />
        ))}
      </ol>
    </Card>
  );
}
