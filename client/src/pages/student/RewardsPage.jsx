import {
  Award,
  CheckCircle2,
  Flame,
  Lock,
  Star,
  Target,
  Trophy,
} from "lucide-react";
import Seo from "../../components/Seo.jsx";
import { Alert, Card, Chip, Loading, PageHeader, ProgressBar, StatCard } from "../../components/ui.jsx";
import { errorMessage } from "../../lib/api.js";
import { formatDate, formatNumber } from "../../lib/format.js";
import { useApi } from "../../lib/useApi.js";
import { cx } from "../../utils/cx.js";

const CRITERIA = {
  activities_passed: "aktibidad o pagsusulit na napasa",
  lessons_completed: "aralin na natapos",
  streak: "araw na sunod-sunod",
  quizzes_passed: "pagsusulit na napasa",
  perfect_quiz: "perpektong iskor sa pagsusulit",
};

export default function RewardsPage() {
  const { data, error, loading } = useApi("/student/achievements");

  if (loading) return <Loading label="Kinukuha ang mga gantimpala…" />;
  if (error) return <Alert tone="danger" title="Hindi mabuksan ang mga gantimpala">{errorMessage(error)}</Alert>;

  const badges = data.badges || [];
  const earned = badges.filter((badge) => badge.earned);
  const locked = badges.filter((badge) => !badge.earned);

  return (
    <>
      <Seo
        title="Mga Gantimpala"
        description="Tingnan ang iyong mga badge at puntos sa HASA. Ang mga gantimpala ay ibinibigay batay sa tunay na gawain."
        noindex
        path="/student/mga-gantimpala"
      />
      <PageHeader
        eyebrow="Pagsisikap na may gantimpala"
        title="Mga Gantimpala"
        description="Ang bawat badge ay may malinaw na layunin. Nakuha mo lang ang mga ito sa pamamagitan ng tunay na pagtatangka at pagkumpleto."
        actions={<Chip tone="gold"><Trophy className="size-3.5" aria-hidden="true" /> {data.earnedCount}/{badges.length} badge</Chip>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Star} label="Kabuuang puntos" value={formatNumber(data.points)} tone="gold" />
        <StatCard icon={Award} label="Antas" value={data.level} hint={`${data.points % 300}/300 XP sa antas`} tone="accent" />
        <StatCard icon={Trophy} label="Nakuha na badge" value={`${data.earnedCount}/${badges.length}`} tone="success" />
      </div>

      <section className="mt-5">
        <h2 className="text-lg font-bold text-ink">Nakuha na</h2>
        {earned.length === 0 ? (
          <Card className="mt-3">
            <p className="text-sm leading-relaxed text-muted">
              Wala ka pang badge. Ang unang badge ay makukuha kapag nakapasa ka sa isang
              aktibidad o pagsusulit. Pumunta sa <strong className="font-semibold text-ink">Mga Pagsusulit</strong> upang magsimula.
            </p>
          </Card>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {earned.map((badge) => (
              <Card key={badge.id} className="border-gold-strong/30 bg-gold-soft/60">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold text-brown">
                    <Trophy className="size-5.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-ink">{badge.name}</h3>
                      <Chip tone="success" className="text-[10px]"><CheckCircle2 className="size-3" aria-hidden="true" /> Nakuha</Chip>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{badge.description}</p>
                    <p className="mt-2 text-[11px] font-semibold text-brown">+{badge.xp} XP · {formatDate(badge.earnedAt)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-bold text-ink">Susunod na makukuha</h2>
        {locked.length === 0 ? (
          <Card className="mt-3">
            <p className="flex items-center gap-2 text-sm font-medium text-success-strong">
              <CheckCircle2 className="size-4.5" aria-hidden="true" /> Nakuha mo na ang lahat ng badge. Magaling!
            </p>
          </Card>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {locked.map((badge) => (
              <Card key={badge.id}>
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-plum-100 text-plum-500">
                    <Lock className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-ink">{badge.name}</h3>
                      <span className="text-xs font-semibold text-gold-strong">+{badge.xp} XP</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{badge.description}</p>
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-[11px] text-muted">
                        <span>{badge.progress} / {badge.target}</span>
                        <span>{CRITERIA[badge.criteriaType] || "kinakailangan"}</span>
                      </div>
                      <ProgressBar value={(badge.progress / badge.target) * 100} />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Card className="mt-6 bg-plum-900 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-base font-bold text-gold">
              <Flame className="size-4.5" aria-hidden="true" /> Paano tumaas ang antas?
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-plum-200">
              Bawat 300 XP ay nagpapataas ng antas. Nakakakuha ka ng XP sa unang pagkakumpleto
              ng aralin at unang pagkakapasa sa aktibidad o pagsusulit. May bonus XP ang bawat badge.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white">
            <Target className="size-4.5 text-gold" aria-hidden="true" /> {300 - (data.points % 300)} XP sa susunod na antas
          </span>
        </div>
      </Card>
    </>
  );
}
