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

export const STUDENT_NAV = [
  { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/aralin", label: "Mga Aralin", icon: BookOpen },
  { to: "/student/aktibidad", label: "Aktibidad", icon: ClipboardList },
  { to: "/student/pagsusulit", label: "Pagsusulit", icon: ListChecks },
  { to: "/student/progreso", label: "Progreso", icon: TrendingUp },
  { to: "/student/mga-gantimpala", label: "Mga Gantimpala", icon: Trophy },
  { to: "/student/pasimplehin", label: "AI Pantulong", icon: Sparkles },
  { to: "/student/profile", label: "Profile", icon: UserRound },
];

export const TEACHER_NAV = [
  { to: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/teacher/mga-mag-aaral", label: "Mga Mag-aaral", icon: Users },
  { to: "/teacher/mga-aralin", label: "Mga Aralin", icon: BookOpen },
  { to: "/teacher/mga-aktibidad", label: "Mga Aktibidad", icon: ClipboardList },
  { to: "/teacher/mga-pagsusulit", label: "Mga Pagsusulit", icon: FileText },
  { to: "/teacher/mga-ulat", label: "Mga Ulat", icon: BarChart3 },
  { to: "/teacher/profile", label: "Profile", icon: UserRound },
];

export function navForRole(role) {
  return role === "teacher" ? TEACHER_NAV : STUDENT_NAV;
}
