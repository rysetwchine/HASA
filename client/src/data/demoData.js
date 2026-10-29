/**
 * DEMONSTRASYON LAMANG.
 *
 * Lahat ng pangalan, puntos, sagisag, misyon, at teksto dito ay gawa-gawa
 * para sa prototype. Walang totoong impormasyon ng mag-aaral.
 *
 * MAHALAGANG PAALALA: ang `demoSimplified.text` ay STATIC na halimbawa.
 * Hindi ito gawa ng Gemini, OpenAI, o anumang AI. Ang UI ay dapat laging
 * magpakita ng malinaw na paalala tungkol dito (Requirement 3).
 */

export const DEMO_NOTICE =
  "Halimbawa lamang ang nilalaman ng pahinang ito. Hindi ito gawa ng AI at hindi ito totoong datos ng mag-aaral.";

export const DEMO_AI_NOTICE =
  "Halimbawa lamang ito. Hindi ito gawa ng AI.";

export const DEMO_STUDENT_LABEL = "Halimbawang mag-aaral";

/**
 * Ang pangalan at XP ay galing sa Figma (frame "dashboard"):
 * "Siri · Grade 8 -Rizal · 1,200 / 1,500 XP to level 5".
 */
export const demoStudent = {
  username: "siri",
  displayName: "Siri",
  avatarInitials: "S",
  readingLevel: "instructional",
  points: 1200,
  grade: "Baitang 8",
  section: "Seksyon A",
  gradeShort: "Grade 8",
  sectionShort: "Rizal",
  className: "Grade 8 - Rizal",
};

/**
 * Halimbawang patakaran ng XP mula sa Figma: ang mag-aaral ay Level 4 na may
 * 1,200 XP, at 1,500 XP ang kailangan para sa Level 5 (300 XP bawat antas).
 * Ang progress bar ay 1,200 / 1,500 = 80%.
 */
export const XP_PER_LEVEL = 300;

export function getLevelProgress(points = 0) {
  const totalXp = Math.max(0, Number(points) || 0);
  const level = Math.max(1, Math.floor(totalXp / XP_PER_LEVEL));
  const xpForNextLevel = (level + 1) * XP_PER_LEVEL;

  return {
    level,
    xpIntoLevel: totalXp,
    xpForNextLevel,
    xpToNext: Math.max(0, xpForNextLevel - totalXp),
    totalXp,
  };
}

export const demoMaterial = {
  id: "demo-material-1",
  title: "Halimbawang Materyal: Ang Kahalagahan ng Tubig sa Kapaligiran",
  summary:
    "Isang maikling teksto tungkol sa tubig, sa mga anyong tubig, at sa mga paraan upang pangalagaan ang mga ito.",
  sourceType: "paste",
  originalText:
    "Ang tubig ay isang mahalagang likas na yaman. Ginagamit ito ng mga tao sa pag-inom, pagluluto, paglilinis, at pagsasaka. Sa ating bansa, maraming komunidad ang umaasa sa ilog at lawa para sa kanilang pang-araw-araw na pangangailangan. Kapag nadumihan ang mga anyong tubig, nagkakaroon ng sakit ang mga tao at namamatay ang mga isda. Kaya naman mahalagang pangalagaan ang ating mga anyong tubig.",
};

/**
 * STATIC na halimbawa ng "pinasimpleng teksto".
 * Hindi ito output ng AI. Ang `isDemo` flag ay ginagamit ng UI
 * para ipakita ang paalala.
 */
export const demoSimplified = {
  readingLevel: "instructional",
  isDemo: true,
  provider: null,
  text:
    "Mahalaga ang tubig. Iniinom natin ito. Ginagamit din natin ito sa pagluluto at paglilinis. Maraming tao ang kumukuha ng tubig sa ilog at lawa. Kapag marumi ang tubig, nagkakasakit ang tao. Namamatay din ang mga isda. Kaya kailangan nating alagaan ang mga ilog at lawa.",
};

export const demoVocabulary = [
  {
    word: "likas na yaman",
    explanation:
      "Mga bagay na galing sa kalikasan na ginagamit ng tao, tulad ng tubig, lupa, at kagubatan.",
    exampleSentence: "Ang tubig at lupa ay likas na yaman.",
  },
  {
    word: "anyong tubig",
    explanation:
      "Mga bahagi ng kalikasan na may tubig, tulad ng ilog, lawa, at dagat.",
    exampleSentence: "Malinis ang anyong tubig sa aming barangay.",
  },
  {
    word: "komunidad",
    explanation:
      "Grupo ng mga taong nakatira sa isang lugar at nagtutulungan.",
    exampleSentence: "Nagtulungan ang komunidad sa paglilinis ng ilog.",
  },
];

export const demoQuestions = [
  {
    id: "q1",
    prompt: "Bakit mahalaga ang tubig ayon sa teksto?",
    options: [
      "Dahil ginagamit ito sa pag-inom, pagluluto, at paglilinis.",
      "Dahil kulay asul ito.",
      "Dahil malamig ito kapag gabi.",
      "Dahil ginagawa itong laruan.",
    ],
    correctIndex: 0,
    explanation:
      "Ayon sa teksto, ginagamit ang tubig sa pag-inom, pagluluto, paglilinis, at pagsasaka.",
  },
  {
    id: "q2",
    prompt: "Ano ang nangyayari kapag marumi ang anyong tubig?",
    options: [
      "Lumalaki ang mga isda.",
      "Nagkakasakit ang mga tao at namamatay ang mga isda.",
      "Umuulan nang malakas.",
      "Tumataas ang presyo ng bigas.",
    ],
    correctIndex: 1,
    explanation:
      "Sinasabi ng teksto na nagkakasakit ang tao at namamatay ang isda kapag marumi ang tubig.",
  },
  {
    id: "q3",
    prompt: "Ano ang pangunahing mensahe ng teksto?",
    options: [
      "Dapat nating alagaan ang mga anyong tubig.",
      "Dapat tayong lumipat sa lungsod.",
      "Hindi na kailangan ng tubig sa pagsasaka.",
      "Ang isda ay mas mahalaga kaysa sa tao.",
    ],
    correctIndex: 0,
    explanation:
      "Ang huling pangungusap ay nagpapayo na pangalagaan ang mga anyong tubig.",
  },
];

/**
 * DEMONSTRASYON LAMANG. Ang mga sagisag ay nakakandado sa simula at
 * binubuksan ng mga aktibidad na natapos sa browser na ito. Ang XP ng
 * sagisag ay ibinibigay nang isang beses lamang kapag naunlock ito.
 */
export const demoBadges = [
  {
    id: "b1",
    name: "Unang Hakbang",
    description: "Nakumpleto ang unang aktibidad sa Practice.",
    xp: 70,
    criteria: { type: "completed", target: 1 },
    earned: false,
    earnedAt: null,
  },
  {
    id: "b2",
    name: "Mausisang Mambabasa",
    description: "Nakumpleto ang tatlong aktibidad sa Practice.",
    xp: 50,
    criteria: { type: "completed", target: 3 },
    earned: false,
    earnedAt: null,
  },
  {
    id: "b3",
    name: "Bayani ng Misyon",
    description: "Nakumpleto ang limang aktibidad sa Practice.",
    xp: 100,
    criteria: { type: "completed", target: 5 },
    earned: false,
    earnedAt: null,
  },
];

/**
 * Walang announcement data sa prototype. Iniiwan na walang laman
 * ang listahan upang hindi mag-imbento ng anunsyo ang UI.
 */
export const demoAnnouncements = [];

/** Kasalukuyang modyul na hinango sa umiiral na demo na materyal. */
export const demoCurrentModule = {
  module: "Modyul 1 · Kalikasan at Kapaligiran",
  lesson: "Aralin 3: Pag-unawa sa Teksto",
  description: demoMaterial.summary,
  to: "/aktibidad",
};

export const demoQuests = [
  {
    id: "quest-1",
    title: "Ang Paglalakbay sa Ilog",
    narrative:
      "May isang batang mambabasa na gustong iligtas ang ilog sa kanilang barangay. Tulungan mo siyang matutunan ang mga dahilan kung bakit mahalaga ang malinis na tubig.",
    steps: [
      {
        id: "s1",
        title: "Basahin ang materyal",
        instructions: "Basahin ang maikling teksto tungkol sa tubig.",
        points: 20,
        completed: true,
      },
      {
        id: "s2",
        title: "Pag-aralan ang talasalitaan",
        instructions: "Tingnan ang tatlong mahirap na salita at ang paliwanag.",
        points: 20,
        completed: true,
      },
      {
        id: "s3",
        title: "Sagutin ang mga tanong",
        instructions: "Sagutin ang tatlong tanong sa pag-unawa.",
        points: 30,
        completed: false,
      },
    ],
  },
];

export const demoCompletedActivities = [
  {
    id: "a1",
    title: "Pag-unawa: Ang Kahalagahan ng Tubig",
    score: 2,
    total: 3,
    completedAt: "2026-10-20",
  },
  {
    id: "a2",
    title: "Talasalitaan: Mga Anyong Tubig",
    score: 5,
    total: 5,
    completedAt: "2026-10-18",
  },
];

/**
 * Mga aralin na hinango sa umiiral na demo na materyal, talasalitaan,
 * at mga tanong. Ang estado ay galing sa mga hakbang ng misyon, kaya
 * hindi ito basta-bastang inimbentong pag-unlad.
 */
const comprehensionActivity = demoCompletedActivities[0];
const comprehensionPercent = Math.round(
  (comprehensionActivity.score / comprehensionActivity.total) * 100,
);
const questSteps = demoQuests[0].steps;

export const demoLessons = [
  {
    id: "aralin-1",
    number: 1,
    title: "Ang Kahalagahan ng Tubig sa Kapaligiran",
    description: demoMaterial.summary,
    unit: "Yunit 1 · Kalikasan at Kapaligiran",
    difficulty: "Katamtaman",
    difficultyKey: "katamtaman",
    kind: "Pagbasa",
    minutes: 3,
    icon: "book",
    status: questSteps[0].completed ? "completed" : "not-started",
    progress: questSteps[0].completed ? 100 : 0,
    to: "/pasimplehin#teksto",
  },
  {
    id: "aralin-2",
    number: 2,
    title: "Mga Mahalagang Salita Tungkol sa Tubig",
    description:
      "Tatlong mahirap na salita mula sa teksto, kasama ang paliwanag at halimbawang pangungusap.",
    unit: "Yunit 1 · Kalikasan at Kapaligiran",
    difficulty: "Madali",
    difficultyKey: "madali",
    kind: "Talasalitaan",
    minutes: 4,
    icon: "words",
    status: questSteps[1].completed ? "completed" : "not-started",
    progress: questSteps[1].completed ? 100 : 0,
    to: "/pasimplehin#talasalitaan",
  },
  {
    id: "aralin-3",
    number: 3,
    title: "Pag-unawa sa Teksto",
    description:
      "Tatlong tanong na sumusukat sa pag-unawa sa teksto tungkol sa tubig at kapaligiran.",
    unit: "Yunit 2 · Pag-unawa at Pagsusuri",
    difficulty: "Mahirap",
    difficultyKey: "mahirap",
    kind: "Pagsusulit",
    minutes: 5,
    icon: "check",
    status: questSteps[2].completed ? "completed" : "in-progress",
    progress: questSteps[2].completed ? 100 : comprehensionPercent,
    to: "/aktibidad",
  },
];

/**
 * DEMONSTRASYON LAMANG. Fictional na linggong aktibidad para sa dashboard.
 */
export const demoWeeklyActivity = [
  { day: "Lunes", short: "Lun", minutes: 12, activities: 1 },
  { day: "Martes", short: "Mar", minutes: 18, activities: 1 },
  { day: "Miyerkules", short: "Miy", minutes: 0, activities: 0 },
  { day: "Huwebes", short: "Huw", minutes: 25, activities: 2 },
  { day: "Biyernes", short: "Biy", minutes: 15, activities: 1 },
  { day: "Sabado", short: "Sab", minutes: 0, activities: 0 },
  { day: "Linggo", short: "Lin", minutes: 0, activities: 0 },
];

export const demoRoster = [
  { username: "estudyante1", displayName: "Estudyante Uno", points: 120, level: "instructional" },
  { username: "estudyante2", displayName: "Estudyante Dos", points: 95, level: "independent" },
  { username: "estudyante3", displayName: "Estudyante Tres", points: 140, level: "frustration" },
  { username: "estudyante4", displayName: "Estudyante Apat", points: 60, level: "instructional" },
];

/*
 * ===================================================================
 * Nasa ibaba ang halimbawang datos na hinalawan sa frame ng Figma.
 * Ipinapakita lamang ang anyo ng UI; hindi ito totoong datos.
 * ===================================================================
 */

/** Balangkas na ginagamit ng "Continue Learning" card sa Figma dashboard. */
export const demoLearningProgress = {
  eyebrow: "continue learning",
  module: "MODULE 3: Rise of Nationalism in the Philippines",
  lesson: "Lesson 3 - Cause of the Philippine Revolution",
  percent: 35,
  percentLabel: "complete",
  cta: "Resume Lesson",
  to: "/mga-aralin",
};

/** Papasok na mga progresyon mula sa Figma dashboard ("Recent Achievements"). */
export const demoRecentAchievements = [
  {
    id: "ra1",
    icon: "trophy",
    title: "Quiz Master",
    detail: "Scored 85% on Module 3",
    xp: 250,
    when: "TODAY",
    xpLabel: "+250 XP",
  },
  {
    id: "ra2",
    icon: "medal",
    title: "Lesson Completed",
    detail: "Completed Module 2: Spanish Colonial Rule Recap",
    xp: 100,
    when: "YESTERDAY",
    xpLabel: "+100 XP",
  },
];

/** Mga anunsyo mula sa Figma. Ipinapakita lang ang anyo ng listahan. */
export const demoFigmaAnnouncements = [
  {
    id: "an1",
    icon: "megaphone",
    title: "Weekend Challenge!",
    detail: "Completed a quiz this weekend and earn bonus XP!",
    date: "August 17, 2026",
    isNew: false,
  },
  {
    id: "an2",
    icon: "book",
    title: "New Lesson Released",
    detail: "Module 4 is now available. Start learning now!",
    date: "August 24, 2026",
    isNew: true,
    tag: "NEW",
  },
];

/**
 * Anim na aralin na eksaktong galing sa Figma frame "Lessons".
 * Static na halimbawa lamang ang larawan at status ng bawat isa.
 */
export const demoFigmaLessons = [
  {
    id: "lesson-1-5",
    no: "1.5",
    label: "Lesson 1.5",
    title: "Cause of the Philippine Revolution",
    difficultyKey: "easy",
    difficulty: "Easy",
    status: "completed",
    statusLabel: "Completed",
    action: "Review",
    thumb: "thumb-1",
  },
  {
    id: "lesson-2-3",
    no: "2.3",
    label: "Lesson 2.3",
    title: "Katipunan and the Call to Arms",
    difficultyKey: "hard",
    difficulty: "Hard",
    status: "not-started",
    statusLabel: "Not Started",
    action: "Start",
    thumb: "thumb-2",
  },
  {
    id: "lesson-3",
    no: "3",
    label: "Lesson 3",
    title: "Spanish Colonial Rule Recap",
    difficultyKey: "easy",
    difficulty: "Easy",
    status: "completed",
    statusLabel: "Completed",
    action: "Review",
    thumb: "thumb-3",
  },
  {
    id: "lesson-3-3",
    no: "3.3",
    label: "Lesson 3.3",
    title: "Key Figure of the Revolution",
    difficultyKey: "medium",
    difficulty: "Medium",
    status: "in-progress",
    statusLabel: "In Progress",
    action: "Continue",
    thumb: "thumb-4",
  },
  {
    id: "lesson-1-1",
    no: "1.1",
    label: "Lesson 1.1",
    title: "The Battle of Manila Bay",
    difficultyKey: "hard",
    difficulty: "Hard",
    status: "not-started",
    statusLabel: "Not Started",
    action: "Start",
    thumb: "thumb-5",
  },
  {
    id: "lesson-3-5",
    no: "3.5",
    label: "Lesson 3.5",
    title: "Declaration of Independence",
    difficultyKey: "hard",
    difficulty: "Hard",
    status: "not-started",
    statusLabel: "Not Started",
    action: "Start",
    thumb: "thumb-6",
  },
];

/** Mga hamon sa Practice, eksakto gaya ng Figma. */
export const demoChallenges = [
  {
    id: "ch1",
    kind: "Quiz",
    kindKey: "violet",
    title: "Time Builder",
    detail: "5 quick questions · 25 XP",
    xp: 25,
    passPercent: 60,
    timerSeconds: 120,
    ready: true,
    starred: false,
    icon: "challenge-1",
    accent: "#4c427c",
  },
  {
    id: "ch2",
    kind: "Quiz",
    kindKey: "grey",
    title: "Heroes of the Revolution",
    detail: "5 quick questions · 25 XP",
    xp: 25,
    passPercent: 60,
    timerSeconds: null,
    ready: true,
    starred: false,
    icon: "challenge-2",
    accent: "#78777f",
  },
  {
    id: "ch3",
    kind: "Skill Lab",
    kindKey: "terracotta",
    title: "Source Detective",
    detail: "Read between the lines · 35 XP",
    xp: 35,
    passPercent: 60,
    timerSeconds: null,
    ready: true,
    starred: false,
    icon: "challenge-3",
    accent: "#bc7c63",
  },
  {
    id: "ch4",
    kind: "Skill Lab",
    kindKey: "leaf",
    title: "Who Am I? History Edition",
    detail: "5 quick questions · 25 XP",
    xp: 25,
    passPercent: 60,
    timerSeconds: null,
    ready: true,
    starred: true,
    icon: "challenge-4",
    accent: "#6a974a",
  },
  {
    id: "ch5",
    kind: "Quiz",
    kindKey: "red",
    title: "Fact or Fiction?",
    detail: "5 quick questions · 25 XP",
    xp: 25,
    passPercent: 60,
    timerSeconds: null,
    ready: true,
    starred: true,
    icon: "challenge-5",
    accent: "#d82e3d",
  },
  {
    id: "ch6",
    kind: "Quiz",
    kindKey: "ink",
    title: "Katipunan Challenge",
    detail: "5 quick questions · 25 XP",
    xp: 25,
    passPercent: 60,
    timerSeconds: null,
    ready: true,
    starred: true,
    icon: "challenge-6",
    accent: "#3e3e75",
  },
];

/** Pang-araw-araw na hamon na istreak galing sa Figma frame "practice". */
export const demoPracticeStreak = {
  streakDays: 4,
  level: 4,
  xp: 1200,
  xpToNext: 300,
  nextLevel: 5,
};

/** Itinatampok na hamon sa Figma frame "practice" (HISTORY HOT SEAT). */
export const demoFeaturedChallenge = {
  eyebrow: "Practice Arena",
  title: "PRACTICE",
  description: "Play your way through Araling Panlipunan and build your streak.",
  card: {
    id: "featured-hot-seat",
    title: "HISTORY HOT SEAT",
    detail: "Can you answer 5 questions before the timer runs out?",
    questions: "5 Questions",
    xp: 50,
    xpLabel: "+50 XP",
    passPercent: 60,
    timerSeconds: 90,
    cta: "Play featured challenge",
  },
  streakLabel: "DAILY STREAK     4 DAYS",
  streakHeadline: "Ready for a quick brain boost?",
  streakDetail: "Pick a challenge, earn XP, and keep your learning streak alive.",
};


