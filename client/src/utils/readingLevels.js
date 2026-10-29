/**
 * Ang TANGING pinagmumulan ng mga antas ng pagbasa sa frontend.
 *
 * MAHALAGANG PAALALA (Requirement 4):
 * Ang HASA ay HINDI sumusukat o nagtatasa ng kakayahan sa pagbasa.
 * Ang antas ay PINIPILI ng mag-aaral o ITINATALAGA ng guro.
 * Walang anumang teksto sa app na magsasabi na "sinukat" ng HASA
 * ang antas ng mag-aaral.
 *
 * Ang mga key ay nananatiling maliit na letrang Ingles dahil iyon ang
 * canonical na halaga sa database (tingnan ang docs/DATA-MODEL.md).
 */

export const READING_LEVELS = Object.freeze([
  {
    key: "independent",
    label: "Malayang Pagbasa (Independent)",
    shortLabel: "Malaya",
    description:
      "Mas maiikling pangungusap at karaniwang salita. Kaunting tulong lamang ang kailangan.",
  },
  {
    key: "instructional",
    label: "May Gabay na Pagbasa (Instructional)",
    shortLabel: "May Gabay",
    description:
      "Katamtamang haba ng pangungusap, may maikling paliwanag sa mahihirap na salita.",
  },
  {
    key: "frustration",
    label: "Nahihirapang Pagbasa (Frustration)",
    shortLabel: "Nahihirapan",
    description:
      "Napakaikling pangungusap, may halimbawa at sunod-sunod na paliwanag.",
  },
]);

export const DEFAULT_READING_LEVEL = "instructional";

/** Hanapin ang buong talaan ng antas gamit ang canonical key. */
export function getReadingLevel(key) {
  return READING_LEVELS.find((level) => level.key === key) ?? null;
}

/** Kunin ang aprubadong label, o babala kung hindi kilala ang key. */
export function getReadingLevelLabel(key) {
  const level = getReadingLevel(key);
  return level ? level.label : "Hindi kilalang antas ng pagbasa";
}
