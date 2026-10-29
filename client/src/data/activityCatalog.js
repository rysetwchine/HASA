import {
  demoChallenges,
  demoFeaturedChallenge,
  demoMaterial,
} from "./demoData.js";
import { ACTIVITY_QUESTIONS } from "./activityQuestions.js";

/**
 * Pinag-isang listahan ng mga aktibidad na maaaring laruin.
 *
 * Ang metadata ng Practice challenges ay galing pa rin sa `demoChallenges`
 * at `demoFeaturedChallenge`. Dito lamang idinadagdag ang mga tanong at
 * pasok na patakaran upang isang lugar lang ang pinagmumulan ng katotohanan.
 */
function withQuestions(activity) {
  return {
    ...activity,
    questions: ACTIVITY_QUESTIONS[activity.id] ?? [],
    passPercent: activity.passPercent ?? 60,
  };
}

export const FEATURED_ACTIVITY = withQuestions({
  id: demoFeaturedChallenge.card.id,
  title: demoFeaturedChallenge.card.title,
  kind: "Quiz",
  description: demoFeaturedChallenge.card.detail,
  xp: demoFeaturedChallenge.card.xp,
  timerSeconds: demoFeaturedChallenge.card.timerSeconds,
  passPercent: demoFeaturedChallenge.card.passPercent,
  featured: true,
  icon: "practice-badge",
});

export const PRACTICE_ACTIVITIES = demoChallenges.map((challenge) =>
  withQuestions({
    ...challenge,
    description: challenge.detail,
    featured: false,
  }),
);

/**
 * Ang reading activity ay gumagamit ng umiiral na tatlong tanong mula sa
 * demo material tungkol sa tubig. Ito ang aktibidad na nakatali sa
 * "Sagutin ang mga tanong" sa AI Simplifier.
 */
export const READING_ACTIVITY = withQuestions({
  id: "reading-water",
  title: "Ang Kahalagahan ng Tubig",
  kind: "Reading",
  description: demoMaterial.title,
  xp: 30,
  timerSeconds: null,
  passPercent: 60,
  featured: false,
  icon: "reading",
});

export const ACTIVITY_CATALOG = [
  FEATURED_ACTIVITY,
  ...PRACTICE_ACTIVITIES,
  READING_ACTIVITY,
];

const ACTIVITY_BY_ID = new Map(
  ACTIVITY_CATALOG.map((activity) => [activity.id, activity]),
);

export function getActivity(activityId) {
  if (!activityId) return null;
  return ACTIVITY_BY_ID.get(activityId) ?? null;
}

export function getActivitiesForChallenges() {
  return PRACTICE_ACTIVITIES;
}
