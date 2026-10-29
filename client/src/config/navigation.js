import logoBooks from "../assets/images/brand/logo-books.png";
import navDashboard from "../assets/images/layout/nav-dashboard.png";
import navLessons from "../assets/images/layout/nav-lessons.png";
import navAi from "../assets/images/layout/nav-ai.png";
import navPractice from "../assets/images/layout/nav-practice.png";
import navRewards from "../assets/images/layout/nav-rewards.png";
import navProgress from "../assets/images/layout/nav-progress.png";

/**
 * Pangunahing nabigasyon ng mag-aaral — anim na item mula sa Figma
 * (Dashboard, Lessons, AI Simplifier, Practice, Rewards, Progress),
 * isinalin sa Filipino. Ang mga icon ay orihinal na PNG mula sa Figma.
 *
 * Ang `label` ay ang nakikitang teksto; ang `ariaLabel` ay ang buong
 * pangalan para sa screen reader kapag pinaikli ang label sa mobile.
 */
export const PRIMARY_NAV_ITEMS = [
  {
    to: "/",
    label: "Dashboard",
    fullLabel: "Pangunahing Pahina",
    Icon: navDashboard,
    end: true,
  },
  {
    to: "/mga-aralin",
    label: "Mga Aralin",
    fullLabel: "Mga Aralin",
    Icon: navLessons,
  },
  {
    to: "/pasimplehin",
    label: "AI Tagapagpasimple",
    fullLabel: "AI Tagapagpasimple",
    Icon: navAi,
  },
  {
    to: "/aktibidad",
    label: "Pagsasanay",
    fullLabel: "Pagsasanay",
    Icon: navPractice,
  },
  {
    to: "/mga-nakamit",
    label: "Mga Gantimpala",
    fullLabel: "Mga Gantimpala",
    Icon: navRewards,
  },
  {
    to: "/pag-unlad",
    label: "Aking Pag-unlad",
    fullLabel: "Aking Pag-unlad",
    Icon: navProgress,
  },
];

/** Mga pahina na wala pa sa Figma panel ng nabigasyon. */
export const EXTRA_NAV_ITEMS = [
  { to: "/misyon", label: "Misyon" },
  { to: "/guro", label: "Tanawan ng Guro" },
];

export const LOGO_IMAGE = logoBooks;
