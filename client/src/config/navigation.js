import {
  BarChart3,
  BookOpen,
  ClipboardList,
  FileText,
  LayoutDashboard,
  ListChecks,
  Sparkles,
  TrendingUp,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";

/**
 * Ang label rito ay Filipino at ito rin ang lumalabas sa header ng pahina.
 * Ang `to` ay hindi isinasalin — ito ang ruta.
 */
export const STUDENT_NAV = [
  { to: "/student/dashboard", label: "Pangunahing Pahina", icon: LayoutDashboard },
  { to: "/student/aralin", label: "Mga Aralin", icon: BookOpen },
  { to: "/student/pasimplehin", label: "AI Tagapagpasimple", icon: Sparkles },
  { to: "/student/aktibidad", label: "Pagsasanay", icon: ClipboardList },
  { to: "/student/pagsusulit", label: "Mga Pagsusulit", icon: ListChecks },
  { to: "/student/mga-gantimpala", label: "Mga Gantimpala", icon: Trophy },
  { to: "/student/progreso", label: "Aking Pag-unlad", icon: TrendingUp },
  { to: "/student/profile", label: "Aking Profile", icon: UserRound },
];

export const TEACHER_NAV = [
  { to: "/teacher/dashboard", label: "Pangunahing Pahina", icon: LayoutDashboard },
  { to: "/teacher/mga-mag-aaral", label: "Mga Mag-aaral", icon: Users },
  { to: "/teacher/mga-aralin", label: "Pamamahala ng Aralin", icon: BookOpen },
  { to: "/teacher/mga-aktibidad", label: "Mga Aktibidad", icon: ClipboardList },
  { to: "/teacher/mga-pagsusulit", label: "Mga Pagsusulit", icon: FileText },
  { to: "/teacher/progreso", label: "Progreso ng Mag-aaral", icon: TrendingUp },
  { to: "/teacher/mga-ulat", label: "Mga Ulat", icon: BarChart3 },
  { to: "/teacher/profile", label: "Aking Profile", icon: UserRound },
];

export function navForRole(role) {
  return role === "teacher" ? TEACHER_NAV : STUDENT_NAV;
}
