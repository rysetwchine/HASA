import { Compass, Flag, Star } from "lucide-react";
import { Link } from "react-router";
import PageHeader from "../components/ui/PageHeader.jsx";
import Card from "../components/ui/Card.jsx";
import Alert from "../components/ui/Alert.jsx";
import Chip from "../components/ui/Chip.jsx";
import DemoNotice from "../components/ui/DemoNotice.jsx";
import ProgressBar from "../components/ui/ProgressBar.jsx";
import QuestCard from "../components/gamification/QuestCard.jsx";
import { buttonClasses } from "../components/ui/Button.jsx";
import { demoQuests } from "../features/demo/demoData.js";

export default function QuestPage() {
  const quest = demoQuests[0];
  const completedSteps = quest.steps.filter((step) => step.completed).length;
  const earnedPoints = quest.steps
    .filter((step) => step.completed)
    .reduce((sum, step) => sum + step.points, 0);
  const remainingPoints = quest.steps
    .filter((step) => !step.completed)
    .reduce((sum, step) => sum + step.points, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <PageHeader
        eyebrow="Misyon"
        title="Mga Misyon"
        description="Tapusin ang mga hakbang ng misyon para makakuha ng puntos at sagisag. Halimbawa lamang ang lahat ng hakbang."
        actions={<Chip tone="brand">{completedSteps}/{quest.steps.length} hakbang</Chip>}
      />

      <DemoNotice />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-brand-700">
            <Compass className="h-4 w-4" aria-hidden="true" />
          </span>
          <p className="mt-3 text-2xl font-bold tracking-tight text-ink">
            {completedSteps}
            <span className="text-base font-medium text-muted">
              {" "}
              / {quest.steps.length}
            </span>
          </p>
          <p className="mt-0.5 text-xs text-muted">Hakbang na natapos</p>
        </Card>
        <Card>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success text-emerald-700">
            <Star className="h-4 w-4" aria-hidden="true" />
          </span>
          <p className="mt-3 text-2xl font-bold tracking-tight text-ink">
            {earnedPoints}
          </p>
          <p className="mt-0.5 text-xs text-muted">Puntos na nakuha</p>
        </Card>
        <Card>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Flag className="h-4 w-4" aria-hidden="true" />
          </span>
          <p className="mt-3 text-2xl font-bold tracking-tight text-ink">
            {remainingPoints}
          </p>
          <p className="mt-0.5 text-xs text-muted">Puntos na natitira</p>
        </Card>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">
            Kasalukuyang misyon
          </h2>
          <Chip tone="brand">Halimbawa</Chip>
        </div>
        <ProgressBar
          value={completedSteps}
          max={quest.steps.length}
          label="Pag-unlad ng misyon"
        />
      </div>

      <QuestCard quest={quest} />

      <Alert variant="info" title="Hindi pa aktibo ang pagkumpleto">
        Ang pagtatala ng natapos na hakbang at pagbibigay ng puntos ay
        magaganap sa server sa susunod na yugto. Ang mga hakbang sa itaas ay
        halimbawa lamang.
      </Alert>

      <div className="flex flex-wrap gap-2.5">
        <Link
          to="/mga-aralin"
          className={buttonClasses({ variant: "secondary" })}
        >
          Tingnan ang mga aralin
        </Link>
        <Link
          to="/mga-nakamit"
          className={buttonClasses({ variant: "ghost" })}
        >
          Tingnan ang mga gantimpala
        </Link>
      </div>
    </div>
  );
}
