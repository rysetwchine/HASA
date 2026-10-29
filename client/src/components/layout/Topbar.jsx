import {
  demoStudent,
  DEMO_STUDENT_LABEL,
  getLevelProgress,
} from "../../data/demoData.js";
import NotificationBell from "../dashboard/NotificationBell.jsx";
import { useProgress } from "../../app/ProgressProvider.jsx";

/**
 * Ang upuan sa itaas ng nilalaman ay hango sa Figma: antas ng XP sa kaliwa,
 * kampanilya at silweta ng mag-aaral sa kanan. Ang XP ay lokal na
 * naka-save at nagbabago kapag may natapos na aktibidad.
 */
export default function Topbar() {
  const { progress: savedProgress } = useProgress();
  const progress = getLevelProgress(savedProgress.xp);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
      {/* Pangkat ng antas */}
      <div className="flex items-center gap-3">
        <div
          className="pointer-events-none flex h-[52px] w-[52px] shrink-0 flex-col items-center justify-center rounded-full bg-canvas shadow-[0_0_0_5px_#aeaec4]"
          aria-hidden="true"
        >
          <span className="text-[15px] font-extrabold leading-none text-plum-800">
            {progress.level}
          </span>
          <span className="text-[10px] leading-none text-ink/80">Level</span>
        </div>
        <div className="min-w-0">
          <div
            className="h-2 w-[140px] overflow-hidden rounded-full bg-[#c4c4c4]"
            role="progressbar"
            aria-label="XP patungo sa susunod na antas"
            aria-valuenow={progress.xpIntoLevel}
            aria-valuemin={0}
            aria-valuemax={progress.xpForNextLevel}
          >
            <div
              className="h-full rounded-full bg-plum-800"
              style={{
                width: `${Math.round((progress.xpIntoLevel / progress.xpForNextLevel) * 100)}%`,
              }}
            />
          </div>
          <p className="mt-1 text-[11.5px] font-medium text-ink">
            {progress.xpIntoLevel.toLocaleString()} / {progress.xpForNextLevel.toLocaleString()} XP
            to level {progress.level + 1}
          </p>
        </div>
      </div>

      {/* Kampanilya + silweta */}
      <div className="flex items-center gap-5">
        <NotificationBell bare />

        <div className="flex items-center gap-3">
          <span
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-lav-400 text-[24px] font-bold text-canvas"
            aria-hidden="true"
          >
            {demoStudent.avatarInitials}
          </span>
          {/* Sa maliit na screen, ang pangalan ay nakaimbak sa avatar na
              may initial at sa sr-only na teksto upang manatiling isang
              linya ang Topbar. */}
          <div className="hidden min-w-0 sm:block">
            <p className="text-[19px] font-semibold leading-tight text-ink">
              {demoStudent.displayName}
            </p>
            <p className="text-[12px] font-light text-ink">
              {demoStudent.gradeShort} · {demoStudent.sectionShort}
            </p>
          </div>
          <span className="sr-only sm:hidden">
            {demoStudent.displayName} · {demoStudent.gradeShort} ·{" "}
            {demoStudent.sectionShort}
          </span>
        </div>
        <span className="sr-only">{DEMO_STUDENT_LABEL}</span>
      </div>
    </div>
  );
}
