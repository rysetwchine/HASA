import { demoFigmaLessons } from "../data/demoData.js";
import { LESSON_CONTENT } from "../data/lessonContent.js";
import { getActivity } from "../data/activityCatalog.js";

/**
 * Pinag-isang pinagmumulan ng mga aralin: pinagsasama ang metadata mula sa
 * Figma (`demoFigmaLessons`), ang draft na nilalaman (`lessonContent.js`), at
 * ang tunay na katayuan mula sa lokal na progreso.
 *
 * Walang inimbentong progreso: kung wala pang pagtatangka sa activity,
 * mananatili ang aralin sa "not-started" (o sa dating default status ng
 * Figma para sa demo na itsura).
 */

export const LESSON_STATES = {
  completed: {
    key: "completed",
    label: "Natapos Na",
    action: "Balikan",
    chip: "bg-[#2b8320]/20 text-[#0e4007] border-[#2b8320]/40",
    numberChip: "bg-[#2b8320]/80 text-white",
  },
  "in-progress": {
    key: "in-progress",
    label: "Isinasagawa",
    action: "Ipagpatuloy",
    chip: "bg-gold-soft/70 text-brown border-gold-strong/50",
    numberChip: "bg-gold-strong/90 text-white",
  },
  "not-started": {
    key: "not-started",
    label: "Hindi Pa Nasisimulan",
    action: "Simulan",
    chip: "bg-white/70 text-danger-deep border-danger-deep/40",
    numberChip: "bg-danger-deep/80 text-white",
  },
};

/** Isang aralin na pinagsama ang metadata, nilalaman, at katayuan. */
function buildLesson(lesson, progress) {
  const content = LESSON_CONTENT[lesson.id] ?? null;
  const activityId = content?.activityId ?? null;
  const activity = activityId ? getActivity(activityId) : null;
  const completion = activityId
    ? progress?.completions?.[activityId]
    : null;

  let stateKey;
  if (completion?.completed) stateKey = "completed";
  else if (completion?.attempts > 0) stateKey = "in-progress";
  else stateKey = lesson.status === "completed" ? "completed" : lesson.status;

  const state = LESSON_STATES[stateKey] ?? LESSON_STATES["not-started"];

  return {
    ...lesson,
    content,
    activityId,
    activity,
    state,
    // Katayuan mula sa tunay na pagtatangka, hindi lamang sa Figma sample.
    isRealProgress: Boolean(completion),
    bestPercent: completion?.bestPercent ?? null,
    attempts: completion?.attempts ?? 0,
    to: `/mga-aralin/${lesson.id}`,
  };
}

export function getLessons(progress) {
  return demoFigmaLessons.map((lesson) => buildLesson(lesson, progress));
}

export function getLesson(lessonId, progress) {
  const lesson = demoFigmaLessons.find((entry) => entry.id === lessonId);
  return lesson ? buildLesson(lesson, progress) : null;
}

/** Pinagsamang teksto para sa paghahanap (pamagat, bilang, buod, salita). */
export function getLessonSearchText(lesson) {
  const parts = [lesson.title, lesson.label, lesson.no, lesson.difficulty];

  if (lesson.content) {
    parts.push(lesson.content.objective);
    for (const section of lesson.content.sections) {
      parts.push(section.heading, ...section.paragraphs);
    }
    for (const term of lesson.content.keyTerms) {
      parts.push(term.word, term.meaning);
    }
  }

  return parts.join(" ").toLowerCase();
}

export function filterLessons(lessons, { query = "", filter = "all" } = {}) {
  const q = query.trim().toLowerCase();

  return lessons.filter((lesson) => {
    if (q && !getLessonSearchText(lesson).includes(q)) return false;
    if (filter === "all") return true;
    if (filter === "completed") return lesson.state.key === "completed";
    return lesson.difficultyKey === filter;
  });
}
