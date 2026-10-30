export function formatDate(value, { withTime = false } = {}) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fil-PH", {
    timeZone: "Asia/Manila",
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  }).format(date);
}

export function formatNumber(value) {
  return new Intl.NumberFormat("fil-PH").format(Number(value) || 0);
}

export function firstName(name = "") {
  return name.trim().split(/\s+/)[0] || "Mag-aaral";
}

export const READING_LEVELS = [
  {
    value: "independent",
    label: "Malayang Pagbasa",
    english: "Independent",
    description: "Buong teksto sa antas ng baitang: mas mahahabang pangungusap at mas mayamang talasalitaan.",
  },
  {
    value: "instructional",
    label: "May Gabay na Pagbasa",
    english: "Instructional",
    description: "Katamtamang haba ng pangungusap, may maikling paliwanag sa mahihirap na salita.",
  },
  {
    value: "frustration",
    label: "Nahihirapang Pagbasa",
    english: "Frustration",
    description: "Napakaikling pangungusap, may halimbawa at hakbang-hakbang na paliwanag.",
  },
];

export function readingLevelLabel(value) {
  return READING_LEVELS.find((level) => level.value === value)?.label || "Hindi pa napili";
}

export const DIFFICULTY_LABELS = {
  madali: "Madali",
  katamtaman: "Katamtaman",
  mahirap: "Mahirap",
};
