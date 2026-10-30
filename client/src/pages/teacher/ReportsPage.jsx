import {
  BarChart3,
  CheckCircle2,
  Download,
  FileText,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Seo from "../../components/Seo.jsx";
import {
  Alert,
  Button,
  Card,
  Chip,
  EmptyState,
  Loading,
  PageHeader,
  ProgressBar,
  StatCard,
} from "../../components/ui.jsx";
import { errorMessage } from "../../lib/api.js";
import { readingLevelLabel } from "../../lib/format.js";
import { useApi } from "../../lib/useApi.js";

function downloadCsv(students, className) {
  const header = ["Mag-aaral", "Username", "Antas ng pagbasa", "XP", "Aralin na tapos", "Pagtatangka", "Average", "Badge"];
  const rows = students.map((student) => [
    student.displayName,
    student.username,
    readingLevelLabel(student.readingLevel),
    student.points,
    student.lessonsCompleted,
    student.attempts,
    `${student.averageScore}%`,
    student.badges,
  ]);
  const escape = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const csv = [header, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `hasa-ulat-${className.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { data, error, loading } = useApi("/teacher/reports");

  if (loading) return <Loading label="Inihahanda ang mga ulat…" />;
  if (error) return <Alert tone="danger" title="Hindi mabuksan ang mga ulat">{errorMessage(error)}</Alert>;

  const { class: cls, summary, students, assessments } = data;

  return (
    <>
      <Seo title="Mga Ulat ng Klase" description="Buong ulat ng progreso at resulta ng iyong klase sa HASA." noindex path="/teacher/mga-ulat" />
      <PageHeader
        eyebrow={cls.name}
        title="Mga Ulat"
        description="Buod ng tunay na gawain ng klase. Maaaring i-download ang listahan ng mag-aaral bilang CSV."
        actions={
          <Button variant="secondary" onClick={() => downloadCsv(students, cls.name)} disabled={students.length === 0}>
            <Download className="size-4" aria-hidden="true" /> I-download ang CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Mga mag-aaral" value={summary.students} tone="plum" />
        <StatCard icon={FileText} label="Kabuuang pagtatangka" value={summary.totalAttempts} tone="accent" />
        <StatCard icon={Target} label="Average na iskor" value={`${summary.averageScore}%`} tone="success" />
        <StatCard icon={TrendingUp} label="Average na puntos" value={`${summary.averagePoints} XP`} tone="gold" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-ink">Progreso ng bawat mag-aaral</h2>
            <BarChart3 className="size-5 text-plum-400" aria-hidden="true" />
          </div>
          {students.length === 0 ? (
            <EmptyState icon={Users} title="Wala pang mag-aaral" description="Ibahagi ang kodigo ng klase upang makapagrehistro ang mga mag-aaral." />
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b border-plum-200 text-xs font-semibold uppercase tracking-wide text-muted">
                    <th className="pb-2.5 pr-4">Mag-aaral</th>
                    <th className="pb-2.5 pr-4">Average</th>
                    <th className="pb-2.5 pr-4">Aralin</th>
                    <th className="pb-2.5 pr-4">Pagtatangka</th>
                    <th className="pb-2.5 pr-4">XP</th>
                    <th className="pb-2.5">Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-plum-100">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="py-3 pr-4">
                        <p className="font-semibold text-ink">{student.displayName}</p>
                        <p className="text-[11px] text-muted">{readingLevelLabel(student.readingLevel)}</p>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="w-10 font-semibold text-ink">{student.averageScore}%</span>
                          <div className="w-20"><ProgressBar value={student.averageScore} tone={student.averageScore >= 75 ? "success" : "gold"} /></div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-muted">{student.lessonsCompleted}</td>
                      <td className="py-3 pr-4 text-muted">{student.attempts}</td>
                      <td className="py-3 pr-4 font-semibold text-ink">{student.points}</td>
                      <td className="py-3">{student.badges}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-ink">Buod</h2>
          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-sm"><span className="text-muted">Average ng klase</span><span className="font-bold text-ink">{summary.averageScore}%</span></div>
              <ProgressBar value={summary.averageScore} tone={summary.averageScore >= 75 ? "success" : "gold"} />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-sm"><span className="text-muted">Mga aktibong mag-aaral</span><span className="font-bold text-ink">{students.filter((student) => student.attempts > 0).length}/{students.length}</span></div>
              <ProgressBar value={students.length ? (students.filter((student) => student.attempts > 0).length / students.length) * 100 : 0} />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-sm"><span className="text-muted">Mga gawaing may pagtatangka</span><span className="font-bold text-ink">{assessments.filter((item) => item.attempts > 0).length}/{assessments.length}</span></div>
              <ProgressBar value={assessments.length ? (assessments.filter((item) => item.attempts > 0).length / assessments.length) * 100 : 0} tone="plum" />
            </div>
          </div>
          <div className="mt-5 rounded-xl bg-cream-50 p-3.5 text-xs leading-relaxed text-muted">
            Ang ulat ay gumagamit ng pinakamahusay na iskor sa bawat gawain para sa pass rate at
            ng lahat ng naisumiteng pagtatangka para sa average ng mag-aaral.
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-ink">Resulta ng mga gawain</h2>
            <p className="mt-0.5 text-xs text-muted">Pass rate at average sa bawat aktibidad at pagsusulit</p>
          </div>
          <FileText className="size-5 text-plum-400" aria-hidden="true" />
        </div>
        {assessments.length === 0 ? (
          <EmptyState icon={FileText} title="Wala pang gawain" description="Gumawa ng aktibidad o pagsusulit sa mga pahina ng pamamahala." />
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-plum-200 text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="pb-2.5 pr-4">Gawain</th>
                  <th className="pb-2.5 pr-4">Uri</th>
                  <th className="pb-2.5 pr-4">Tanong</th>
                  <th className="pb-2.5 pr-4">Pagtatangka</th>
                  <th className="pb-2.5 pr-4">Pass rate</th>
                  <th className="pb-2.5">Average</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-plum-100">
                {assessments.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 pr-4 font-semibold text-ink">{item.title}</td>
                    <td className="py-3 pr-4"><Chip tone={item.kind === "quiz" ? "accent" : "info"}>{item.kind === "quiz" ? "Pagsusulit" : "Aktibidad"}</Chip></td>
                    <td className="py-3 pr-4 text-muted">{item.questionCount}</td>
                    <td className="py-3 pr-4 text-muted">{item.attempts}</td>
                    <td className="py-3 pr-4">
                      <span className={item.passRate >= 75 ? "font-semibold text-success-strong" : "font-semibold text-ink"}>{item.passRate}%</span>
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                        {item.average}% {item.average >= 75 ? <CheckCircle2 className="size-4 text-success" aria-hidden="true" /> : null}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
