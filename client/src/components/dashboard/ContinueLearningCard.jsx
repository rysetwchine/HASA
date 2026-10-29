import { ArrowRight, BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import Card from "../ui/Card.jsx";
import Chip from "../ui/Chip.jsx";
import ProgressBar from "../ui/ProgressBar.jsx";
import { buttonClasses } from "../ui/Button.jsx";
import hasaStudent from "../../assets/hasa-student.png";

/**
 * Malaking learning card. Ang pindutang Resume Lesson ay papunta sa
 * aktwal na aralin na may natitirang hakbang.
 */
export default function ContinueLearningCard({
  module,
  lesson,
  description,
  to,
  completedSteps,
  totalSteps,
  nextStep,
}) {
  const percent =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <Card className="overflow-hidden p-0">
      <div className="grid md:grid-cols-[minmax(0,1fr)_210px]">
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="brand">Continue Learning</Chip>
            <Chip tone="muted">Halimbawa</Chip>
          </div>

          <h2 className="font-display mt-4 text-2xl font-bold tracking-tight text-ink sm:text-[1.7rem]">
            Ipagpatuloy ang Pag-aaral
          </h2>

          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">
            {module}
          </p>

          <div className="mt-4 flex items-start gap-3.5">
            <span
              className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-brand-700 sm:flex"
              aria-hidden="true"
            >
              <BookOpen className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold leading-relaxed text-ink sm:text-base">
                {lesson}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-5 max-w-xl">
            <ProgressBar
              value={completedSteps}
              max={totalSteps}
              label={`${completedSteps} sa ${totalSteps} hakbang · ${percent}%`}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <Link to={to} className={buttonClasses({ variant: "primary" })}>
              Resume Lesson
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/mga-aralin"
              className={buttonClasses({ variant: "ghost" })}
            >
              Tingnan ang mga aralin
            </Link>
          </div>
        </div>

        <div className="hidden flex-col justify-between border-l border-cream-200 bg-cream-50 p-5 md:flex">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-x-2 bottom-0 h-16 rounded-full bg-gold-100 blur-xl"
            />
            <img
              src={hasaStudent}
              alt=""
              aria-hidden="true"
              className="blend-on-cream relative mx-auto h-28 w-auto"
            />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
              Susunod na hakbang
            </p>
            <p className="mt-1.5 text-sm font-semibold leading-snug text-ink">
              {nextStep?.title ?? "Tapos na ang lahat ng hakbang"}
            </p>
            {nextStep ? (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                {nextStep.instructions}
              </p>
            ) : null}
            <Link
              to={to}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800"
            >
              Buksan ang aralin
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
