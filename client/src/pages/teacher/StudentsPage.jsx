import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Search, Users, Award, TrendingUp, CalendarDays } from "lucide-react";
import Seo from "../../components/Seo.jsx";
import { Alert, Card, Chip, EmptyState, Input, Loading, PageHeader, buttonClass } from "../../components/ui.jsx";
import { errorMessage } from "../../lib/api.js";
import { formatDate, readingLevelLabel } from "../../lib/format.js";
import { useApi } from "../../lib/useApi.js";

export default function StudentsPage() {
  const { data, error, loading } = useApi("/teacher/students");
  const [query, setQuery] = useState("");

  const students = useMemo(() => {
    const list = data?.students || [];
    const term = query.trim().toLowerCase();
    if (!term) return list;
    return list.filter((student) =>
      `${student.displayName} ${student.username}`.toLowerCase().includes(term),
    );
  }, [data, query]);

  if (loading) return <Loading label="Kinukuha ang mga mag-aaral…" />;
  if (error) return <Alert tone="danger" title="Hindi mabuksan ang listahan">{errorMessage(error)}</Alert>;

  return (
    <>
      <Seo
        title="Mga Mag-aaral"
        description="Tingnan ang mga mag-aaral sa iyong klase, kanilang progreso, iskor, at huling aktibidad."
        noindex
        path="/teacher/mga-mag-aaral"
      />
      <PageHeader
        eyebrow={data.class.name}
        title="Mga Mag-aaral"
        description="Ito lamang ang mga mag-aaral sa iyong klase. Hindi mo makikita ang ibang klase."
        actions={<Chip tone="gold"><Users className="size-3.5" aria-hidden="true" /> {data.students.length} mag-aaral</Chip>}
      />

      <Card className="mb-5">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
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
          description={query ? "Subukan ang ibang pangalan o username." : `Ibahagi ang kodigo ng klase (${data.class.joinCode}) upang makapagrehistro ang mga mag-aaral.`}
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-plum-50/70">
                <tr className="text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-5 py-3">Mag-aaral</th>
                  <th className="px-3 py-3">Antas ng pagbasa</th>
                  <th className="px-3 py-3">XP</th>
                  <th className="px-3 py-3">Aralin</th>
                  <th className="px-3 py-3">Average</th>
                  <th className="px-3 py-3">Badge</th>
                  <th className="px-3 py-3">Huling aktibo</th>
                  <th className="px-5 py-3 text-right">Aksyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-plum-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-plum-50/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-plum-100 text-xs font-bold text-plum-700">
                          {student.displayName.slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-ink">{student.displayName}</p>
                          <p className="text-xs text-muted">@{student.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5"><Chip tone="info">{readingLevelLabel(student.readingLevel)}</Chip></td>
                    <td className="px-3 py-3.5 font-semibold text-ink">{student.points}</td>
                    <td className="px-3 py-3.5 text-muted">{student.lessonsCompleted}</td>
                    <td className="px-3 py-3.5">
                      <span className={student.averageScore >= 75 ? "font-semibold text-success-strong" : "font-semibold text-ink"}>
                        {student.averageScore}%
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-muted">{student.badges}</td>
                    <td className="px-3 py-3.5 text-xs text-muted">
                      {student.lastActiveAt ? formatDate(student.lastActiveAt, { withTime: true }) : "Wala pa"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link to={`/teacher/mga-mag-aaral/${student.id}`} className={buttonClass({ size: "sm", variant: "secondary" })}>
                        Tingnan <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5"><Award className="size-3.5" aria-hidden="true" /> Ang badge at XP ay mula sa tunay na pagtatangka.</span>
        <span className="inline-flex items-center gap-1.5"><TrendingUp className="size-3.5" aria-hidden="true" /> Ang average ay sa lahat ng naisumiteng gawain.</span>
        <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" aria-hidden="true" /> Huling aktibo: pagtatangka o aralin.</span>
      </div>
    </>
  );
}
