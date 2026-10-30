import { Link } from "react-router";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  ListChecks,
  RotateCcw,
  Target,
  Trophy,
} from "lucide-react";
import Seo from "../Seo.jsx";
import { Alert, Card, Chip, EmptyState, Loading, PageHeader, buttonClass } from "../ui.jsx";
import { errorMessage } from "../../lib/api.js";
import { useApi } from "../../lib/useApi.js";

export default function AssessmentList({ kind }) {
  const isQuiz = kind === "quiz";
  const { data, error, loading } = useApi(`/student/activities?kind=${kind}`);
  const basePath = isQuiz ? "/student/pagsusulit" : "/student/aktibidad";

  if (loading) return <Loading label={isQuiz ? "Nilinog ang mga pagsusulit…" : "Nilinog ang pagsasanay…"} />;
  if (error) return <Alert tone="danger" title="Hindi mabuksan ang listahan">{errorMessage(error)}</Alert>;

  const items = data?.activities || [];
  const passed = items.filter((item) => item.passed).length;

  return (
    <>
      <Seo
        title={isQuiz ? "Mga Pagsusulit" : "Pagsasanay"}
        description={isQuiz ? "Subukan ang mga pagsusulit sa Araling Panlipunan 8 at tingnan ang paliwanag sa bawat sagot." : "Magsanay sa mga aktibidad sa Araling Panlipunan 8."}
        noindex
        path={basePath}
      />
      <PageHeader
        eyebrow={isQuiz ? "Sukatin ang pag-unawa" : "Magsanay muna"}
        title={isQuiz ? "Mga Pagsusulit" : "Pagsasanay"}
        description={
          isQuiz
            ? "May paliwanag ang bawat tanong pagkatapos mong sumagot. Ang XP ay ibinibigay isang beses lamang kapag naipasa."
            : "Maikling gawain para sanayin ang mga konseptong nabasa mo sa mga aralin."
        }
        actions={<Chip tone="gold"><Trophy className="size-3.5" aria-hidden="true" /> {passed}/{items.length} napasa</Chip>}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={isQuiz ? ListChecks : ClipboardList}
          title={isQuiz ? "Wala pang pagsusulit" : "Wala pang pagsasanay"}
          description="Magdagdag ang iyong guro ng gawain para sa klase. Balikan ito mamaya."
          action={<Link to="/student/aralin" className={buttonClass()}>Magbasa muna ng aralin</Link>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone={isQuiz ? "accent" : "info"}>{isQuiz ? "Pagsusulit" : "Aktibidad"}</Chip>
                  {item.passed ? <Chip tone="success"><CheckCircle2 className="size-3.5" aria-hidden="true" /> Napasa</Chip> : null}
                  {item.isClassContent ? <Chip>Mula sa guro</Chip> : null}
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gold-soft px-2.5 py-1 text-xs font-bold text-brown">
                  <Trophy className="size-3.5" aria-hidden="true" /> {item.xp} XP
                </span>
              </div>
              <h2 className="mt-3 text-lg font-bold leading-snug text-ink">{item.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>
              {item.lesson ? <p className="mt-2 text-xs font-medium text-plum-600">Kaugnay: {item.lesson.title}</p> : null}

              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-cream-50 p-3 text-center">
                <div>
                  <p className="text-lg font-bold text-ink">{item.questionCount}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Tanong</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-ink">{item.passPercent}%</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Pumasa</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-ink">{item.attempts}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Pagtatangka</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
                {item.timerSeconds ? (
                  <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" aria-hidden="true" /> {Math.round(item.timerSeconds / 60)} min</span>
                ) : (
                  <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" aria-hidden="true" /> Walang timer</span>
                )}
                {item.attempts > 0 ? (
                  <span className="inline-flex items-center gap-1"><Target className="size-3.5" aria-hidden="true" /> Pinakamahusay: {item.bestPercent}%</span>
                ) : (
                  <span>Hindi pa nasubukan</span>
                )}
              </div>

              <Link to={`${basePath}/${item.id}`} className={buttonClass({ className: "mt-4 w-full" })}>
                {item.attempts > 0 ? <RotateCcw className="size-4" aria-hidden="true" /> : <ArrowRight className="size-4" aria-hidden="true" />}
                {item.attempts > 0 ? "Subukan muli" : "Simulan"}
              </Link>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
