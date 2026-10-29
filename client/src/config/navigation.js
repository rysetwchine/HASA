import logoBooks from "../assets/images/brand/logo-books.png";
import navDashboard from "../assets/images/layout/nav-dashboard.png";
import navLessons from "../assets/images/layout/nav-lessons.png";
import navAi from "../assets/images/layout/nav-ai.png";
import navPractice from "../assets/images/layout/nav-practice.png";
import navRewards from "../assets/images/layout/nav-rewards.png";
import navProgress from "../assets/images/layout/nav-progress.png";

/**
 * Pangunahing nabigasyon ng mag-aaral — eksaktong anim na item mula sa
 * Figma (Dashboard, Lessons, AI Simplifier, Practice, Rewards, Progress).
 * Ang mga icon ay orihinal na PNG na ginawa sa Figma, hindi vector na icon,
 * para eksaktong eksakto ang hitsura.
 */
export const PRIMARY_NAV_ITEMS = [
  { to: "/", label: "Dashboard", Icon: navDashboard, end: true },
  { to: "/mga-aralin", label: "Lessons", Icon: navLessons },
  { to: "/pasimplehin", label: "AI Simplifier", Icon: navAi },
  { to: "/aktibidad", label: "Practice", Icon: navPractice },
  { to: "/mga-nakamit", label: "Rewards", Icon: navRewards },
  { to: "/pag-unlad", label: "Progress", Icon: navProgress },
];

/** Mga pahina na wala pa sa Figma panel ng nabigasyon. */
export const EXTRA_NAV_ITEMS = [
  { to: "/misyon", label: "Misyon" },
  { to: "/guro", label: "Tanawan ng Guro" },
];

export const LOGO_IMAGE = logoBooks;
