import {
  BookMarked,
  BookOpen,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  Play,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router";
import Card from "../ui/Card.jsx";
import Chip from "../ui/Chip.jsx";
import ProgressBar from "../ui/ProgressBar.jsx";
import { buttonClasses } from "../ui/Button.jsx";
import { cx } from "../../lib/cx.js";

const ICONS = {
  book: BookOpen,
  words: BookMarked,
  check: ClipboardCheck,
};

const GRADIENTS = {
  book: "from-brand-500 to-plum-800",
  words: "from-gold-500 to-gold-700",
  check: "from-plum-600 to-brand-700",
};

const STATUS_META = {
  completed: {
    label: "Natapos na",
    tone: "success",
    action: "Balikan",
    variant: "secondary",
    Icon: RotateCcw,
  },
  "in-progress": {
    label: "Kasalukuyang ginagawa",
    tone: "warning",
    action: "Ipagpatuloy",
    variant: "primary",
    Icon: Play,
  },
  "not-started": {
    label: "Hindi pa nasisimulan",
    tone: "muted",
    action: "Simulan",
    variant: "soft",
    Icon: Play,
  },
};

const DIFFICULTY_TONES = {
  Madali: "success",
  Katamtaman: "warning",
  Mahirap: "neutral",
};

/**
 * Isang aralin sa grid o list view.
 * Ang status ay galing sa demoLessons, na hinango sa mga hakbang
 * ng misyon at sa umiiral na talaan ng aktibidad.
 */
export default function LessonCard({ lesson, view = "grid" }) {
  const { number, title, description, unit, difficulty, kind, minutes, icon, status, progress, to } =
    lesson;
  const statusMeta = STATUS_META[status] ?? STATUS_META["not-started"];
  const Icon = ICONS[icon] ?? BookOpen;
  const StatusIcon = statusMeta.Icon;
  const titleId = `lesson-title-${lesson.id}`;
  const isList = view === "list";

  return (
    <Card
      as="article"
      aria-labelledby={titleId}
      className={cx(
        "flex h-full flex-col overflow-hidden p-0 transition hover:-translate-y-0.5 hover:shadow-lifted motion-reduce:hover:translate-y-0",
        isList && "sm:flex-row",
      )}
    >
      <div
        className={cx(
          "relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br text-white",
          GRADIENTS[icon] ?? GRADIENTS.book,
          isList ? "h-24 sm:h-auto sm:w-40" : "h-28",
        )}
      >
        <div
          aria-hidden="true"
          className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-10 -left-4 h-24 w-24 rounded-full bg-white/10"
        />
        <Icon
          className={cx(
            "relative",
            isList ? "h-9 w-9 sm:h-10 sm:w-10" : "h-11 w-11",
          )}
          aria-hidden="true"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide backdrop-blur">
          Aralin {number}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">
          {unit}
        </p>
        <h3
          id={titleId}
          className="mt-1.5 text-base font-bold leading-snug tracking-tight text-ink"
        >
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
          {description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Chip tone={DIFFICULTY_TONES[difficulty] ?? "neutral"}>
            {difficulty}
          </Chip>
          <Chip tone={statusMeta.tone}>{statusMeta.label}</Chip>
        </div>

        <p className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-medium text-muted">
          {status === "completed" ? (
            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
          ) : (
            <Clock className="h-3 w-3" aria-hidden="true" />
          )}
          {kind} · {minutes} minuto
        </p>

        {status === "in-progress" ? (
          <ProgressBar
            className="mt-3"
            value={progress}
            max={100}
            size="sm"
            tone="warning"
            label="Pag-unlad ng aralin"
          />
        ) : null}

        <div className="mt-auto pt-4">
          <Link
            to={to}
            className={buttonClasses({
              variant: statusMeta.variant,
              size: "sm",
              className: "w-full",
            })}
            aria-label={`${statusMeta.action}: ${title}`}
          >
            <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {statusMeta.action}
          </Link>
        </div>
      </div>
    </Card>
  );
}
