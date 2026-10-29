import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  BookOpen,
  Check,
  Copy,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Button from "../../components/ui/Button.jsx";
import Chip from "../../components/ui/Chip.jsx";
import DemoNotice from "../../components/ui/DemoNotice.jsx";
import ReadingLevelLabel from "../../components/learning/ReadingLevelLabel.jsx";
import { buttonClasses } from "../../components/ui/Button.jsx";
import { demoRoster, demoStudent } from "../../data/demoData.js";

const CLASS_CODE = "HASA-8A";

function fallbackCopy(text) {
  if (typeof document === "undefined") return false;

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand?.("copy") ?? false;
  } catch {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
}

export default function TeacherPage() {
  const [copyState, setCopyState] = useState("idle");
  const resetTimer = useRef(null);

  useEffect(
    () => () => {
      window.clearTimeout(resetTimer.current);
    },
    [],
  );

  async function copyClassCode() {
    setCopyState("copying");

    let copied = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(CLASS_CODE);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) copied = fallbackCopy(CLASS_CODE);

    setCopyState(copied ? "copied" : "error");
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopyState("idle"), 2500);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <PageHeader
        eyebrow="Guro"
        title="Tanawan ng Guro"
        description="Pamahalaan ang klase, tingnan ang pag-unlad ng mga mag-aaral, at magtalaga ng materyal. Prototype lamang ang mga aksyon."
        actions={
          <>
            <Button
              variant="secondary"
              disabled
              title="Kailangan ng backend at teacher authentication bago makagawa ng klase"
            >
              Gumawa ng klase
            </Button>
            <Button
              disabled
              title="Kailangan ng backend upang makapagtalaga ng materyal sa klase"
            >
              Magtalaga ng materyal
            </Button>
          </>
        }
      />

      <Alert variant="info" title="Hiwalay na karanasan ng guro">
        Ang page na ito ay para sa guro. Sa totoong deployment, tanging
        authenticated na teacher account ang makakapasok dito at makakakita ng
        datos ng klase.
      </Alert>

      <DemoNotice>
        Makikita lamang ng guro ang sariling klase kapag aktibo na ang backend.
      </DemoNotice>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                Kodigo ng Klase
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <code className="rounded-lg bg-brand-50 px-3 py-2 text-lg font-bold tracking-widest text-brand-800">
                  {CLASS_CODE}
                </code>
                <button
                  type="button"
                  onClick={copyClassCode}
                  disabled={copyState === "copying"}
                  aria-label={`Kopyahin ang kodigo ng klase ${CLASS_CODE}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-line-dark hover:text-ink disabled:cursor-wait disabled:opacity-60"
                >
                  {copyState === "copied" ? (
                    <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span aria-live="polite">
                    {copyState === "copied"
                      ? "Nakopya!"
                      : copyState === "error"
                        ? "Hindi makopya"
                        : copyState === "copying"
                          ? "Kinokopya…"
                          : "Kopyahin ang kodigo"}
                  </span>
                </button>
              </div>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-700">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Ito ang ilalagay ng mag-aaral sa Gumawa ng account. Ang pagpapalit
            ng kodigo ay magagamit sa susunod na yugto.
          </p>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                Klase
              </p>
              <p className="mt-2 text-lg font-bold tracking-tight text-ink">
                {demoStudent.className}
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted">
                <Users className="h-4 w-4" aria-hidden="true" />
                {demoRoster.length} mag-aaral
              </p>
            </div>
            <Chip tone="muted">Halimbawa</Chip>
          </div>
        </Card>
      </div>

      <section aria-labelledby="roster-heading" className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2
              id="roster-heading"
              className="font-display text-xl font-bold tracking-tight text-ink"
            >
              Mga Mag-aaral sa Klase
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              Halimbawang listahan lamang; walang totoong mag-aaral sa
              prototype.
            </p>
          </div>
          <Chip tone="muted">
            <ShieldCheck className="h-3 w-3" aria-hidden="true" />
            Guro lamang
          </Chip>
        </div>
        <ul className="space-y-3 sm:hidden">
          {demoRoster.map((student) => (
            <li
              key={student.username}
              className="rounded-2xl border border-line bg-white p-4 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">
                    {student.displayName}
                  </p>
                  <p className="truncate text-xs text-muted">
                    @{student.username}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-line bg-cream-50 px-2.5 py-1 text-xs font-bold text-ink">
                  {student.points} puntos
                </span>
              </div>
              <div className="mt-2.5">
                <ReadingLevelLabel level={student.level} />
              </div>
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto rounded-2xl border border-line bg-white shadow-card sm:block">
          <table className="min-w-full divide-y divide-line text-sm">
            <caption className="sr-only">
              Talaan ng mga mag-aaral sa klase
            </caption>
            <thead className="bg-cream-50 text-left text-[10px] uppercase tracking-wide text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Mag-aaral
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Username
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Antas na Pinili
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Puntos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {demoRoster.map((student) => (
                <tr
                  key={student.username}
                  className="transition-colors hover:bg-cream-50/70"
                >
                  <td className="px-4 py-3 font-medium text-ink">
                    {student.displayName}
                  </td>
                  <td className="px-4 py-3 text-muted">{student.username}</td>
                  <td className="px-4 py-3">
                    <ReadingLevelLabel level={student.level} />
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink">
                    {student.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="assigned-heading" className="space-y-3">
        <h2
          id="assigned-heading"
          className="font-display text-xl font-bold tracking-tight text-ink"
        >
          Itinalagang Materyal
        </h2>
        <Card>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-brand-700">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">
                Halimbawang Materyal: Ang Kahalagahan ng Tubig sa Kapaligiran
              </p>
              <p className="mt-1 text-xs text-muted">
                Nakatalaga sa {demoRoster.length} mag-aaral · Halimbawa lamang
              </p>
            </div>
          </div>
        </Card>
      </section>

      <Alert variant="info" title="Hindi pa available">
        Ang paggawa ng klase, pagpapalit ng kodigo, at pagtatalaga ng materyal ay
        magagamit kapag naisagawa na ang backend at ang pagsusuri ng
        pahintulot.
      </Alert>

      <Link
        to="/"
        className={buttonClasses({ variant: "secondary", size: "sm" })}
      >
        Bumalik sa student dashboard
      </Link>
    </div>
  );
}
