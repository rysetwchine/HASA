import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Download,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import Seo from "../../components/Seo.jsx";
import {
  Alert,
  Card,
  Chip,
  EmptyState,
  Input,
  Loading,
  PageHeader,
  ProgressBar,
  StatCard,
  buttonClass,
} from "../../components/ui.jsx";
import { errorMessage } from "../../lib/api.js";
import { readingLevelLabel } from "../../lib/format.js";
import { useApi } from "../../lib/useApi.js";

const STATUS_META = {
  completed: {
    label: "Tapos na",
    icon: CheckCircle2,
    className: "bg-success-soft text-success-strong border-success/30",
  },
  in_progress: {
    label: "Isinasagawa",
    icon: Clock3,
    className: "bg-gold-soft text-brown border-gold-strong/40",
  },
  not_started: {
    label: "Hindi pa nasimulan",
    icon: CircleDashed,
    className: "bg-plum-50 text-muted border-plum-200",
  },
};

function toCsv(payload) {
  const header = [
    "Mag-aaral",
    "Username",
    "Antas ng pagbasa",
    "XP",
    "Antas",
    "Araling tapos",
    "Araling isinasagawa",
    "Aktibidad na naipasa",
    "Porsyento ng pag-unlad",
    "Average",
    "Streak",
    "Huling aktibo",
  ];
  const rows = payload.students.map((student) => [
    student.displayName,
    student.username,
    readingLevelLabel(student.readingLevel),
    student.points,
    student.level,
    student.lessonsCompleted,
    student.lessonsInProgress,
    student.activitiesPassed,
    `${student.completionPercent}%`,
    `${student.averageScore}%`,
    student.streak,
    student.lastActiveAt ?? "",
  ]);
  return [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

export default function ClassProgressPage() {
  const { data, error, loading } = useApi("/teacher/progress");
  const [query, setQuery] = useState("");

  const students = useMemo(() => {
    const list = data?.students || [];
    const term = query.trim().toLowerCase();
    if (!term) return list;
    return list.filter((student) =>
      `${student.displayName} ${student.username}`.toLowerCase().includes(term),
    );
  }, [data, query]);

  if (loading) return <Loading label="Kinukuha ang progreso ng klase…" />;
  if (error) {
    return (
      <Alert tone="danger" title="Hindi mabuksan ang progreso">
        {errorMessage(error)}
      </Alert>
    );
  }

  const downloadCsv = () => {
    const blob = new Blob([`\ufeff${toCsv(data)}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hasa-progreso-${data.class.joinCode}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Seo
        title="Progreso ng Mag-aaral"
        description="Sundan ang pag-unlad ng bawat mag-aaral sa aralin at aktibidad ng inyong klase."
        noindex
        path="/teacher/progreso"
      />

      <PageHeader
        eyebrow={data.class.name}
        title="Progreso ng Mag-aaral"
        description="Tunay na rekord mula sa database: bawat marka ay galing sa aktwal na pagtatangka ng mag-aaral."
        actions={
          <div className="flex flex-wrap gap-2">
            <Chip tone="gold">
              <Users className="size-3.5" aria-hidden="true" /> {data.totals.students} mag-aaral
            </Chip>
            <button
              type="button"
              onClick={downloadCsv}
              className={buttonClass({ size: "sm", variant: "secondary" })}
            >
              <Download className="size-3.5" aria-hidden="true" /> I-download ang CSV
            </button>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={TrendingUp}
          label="Karaniwang pag-unlad"
          value={`${data.totals.averageCompletion}%`}
          hint="Aralin at aktibidad na natapos"
        />
        <StatCard icon={Users} label="Mag-aaral" value={data.totals.students} tone="gold" hint="Aktibong account sa klase" />
        <StatCard icon={CheckCircle2} label="Mga aralin" value={data.totals.lessons} tone="success" hint="Nakikita ng klase" />
        <StatCard icon={CircleDashed} label="Mga aktibidad" value={data.totals.activities} tone="sky" hint="Pagsasanay at pagsusulit" />
      </div>

      <Card className="mb-5">
        <div className="relative max-w-sm">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Maghanap ng pangalan o username…"
            className="pl-10"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Maghanap ng mag-aaral"
          />
        </div>
      </Card>

      {students.length === 0 ? (
        <EmptyState
          icon={Users}
          title={query ? "Walang nahanap na mag-aaral" : "Wala pang mag-aaral sa klase"}
          description={
            query
              ? "Subukan ang ibang pangalan o username."
              : `Ibahagi ang kodigo ng klase (${data.class.joinCode}) upang makapagrehistro ang mga mag-aaral.`
          }
          action={
            query ? null : (
              <Link to="/teacher/mga-mag-aaral" className={buttonClass({ variant: "secondary" })}>
                Tingnan ang mga mag-aaral
              </Link>
            )
          }
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-plum-50/70">
                <tr className="text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-5 py-3">Mag-aaral</th>
                  <th className="px-3 py-3">Pag-unlad</th>
                  {data.lessons.map((lesson, index) => (
                    <th
                      key={lesson.id}
                      className="px-2 py-3 text-center"
                      title={`${lesson.unit} · ${lesson.title}`}
                    >
                      A{index + 1}
                    </th>
                  ))}
                  <th className="px-3 py-3">Aktibidad</th>
                  <th className="px-3 py-3">Average</th>
                  <th className="px-5 py-3 text-right">Aksyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-plum-100">
                {students.map((student) => (
                  <tr key={student.id} className="align-middle hover:bg-plum-50/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-plum-100 text-xs font-bold text-plum-700">
                          {student.displayName.slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-ink">{student.displayName}</p>
                          <p className="truncate text-xs text-muted">
                            {readingLevelLabel(student.readingLevel)} · {student.points} XP · Antas{" "}
                            {student.level}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="w-32">
                        <ProgressBar value={student.completionPercent} />
                        <p className="mt-1 text-xs text-muted">
                          {student.lessonsCompleted}/{student.lessonsTotal} aralin ·{" "}
                          {student.activitiesPassed}/{student.activitiesTotal} aktibidad
                        </p>
                      </div>
                    </td>
                    {student.lessonStatus.map((status, index) => {
                      const meta = STATUS_META[status] ?? STATUS_META.not_started;
                      const Icon = meta.icon;
                      return (
                        <td key={`${student.id}-${index}`} className="px-2 py-3.5 text-center">
                          <span
                            className={`mx-auto grid size-7 place-items-center rounded-full border ${meta.className}`}
                            title={`Aralin ${index + 1}: ${meta.label}`}
                          >
                            <Icon className="size-3.5" aria-hidden="true" />
                            <span className="sr-only">
                              Aralin {index + 1}: {meta.label}
                            </span>
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-3 py-3.5 text-muted">
                      {student.activitiesPassed}/{student.activitiesTotal}
                    </td>
                    <td className="px-3 py-3.5">
                      <span
                        className={
                          student.attempts > 0
                            ? student.averageScore >= 75
                              ? "font-semibold text-success-strong"
                              : "font-semibold text-ink"
                            : "text-muted"
                        }
                      >
                        {student.attempts > 0 ? `${student.averageScore}%` : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to={`/teacher/mga-mag-aaral/${student.id}`}
                        className={buttonClass({ size: "sm", variant: "secondary" })}
                      >
                        Detalye <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
        {Object.entries(STATUS_META).map(([key, meta]) => {
          const Icon = meta.icon;
          return (
            <span key={key} className="inline-flex items-center gap-1.5">
              <Icon className="size-3.5" aria-hidden="true" /> {meta.label}
            </span>
          );
        })}
        <span className="inline-flex items-center gap-1.5">
          Ang huling aktibidad ay batay sa pinakahuling pagtatangka o aralin.
        </span>
      </div>
    </>
  );
}
