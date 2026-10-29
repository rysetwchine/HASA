import { Routes, Route, Navigate } from "react-router";
import HomePage from "../pages/student/HomePage.jsx";
import LessonsPage from "../pages/student/LessonsPage.jsx";
import LessonDetailPage from "../pages/student/LessonDetailPage.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import SimplifyPage from "../pages/student/SimplifyPage.jsx";
import ActivityPage from "../pages/student/ActivityPage.jsx";
import QuestPage from "../pages/student/QuestPage.jsx";
import ProgressPage from "../pages/student/ProgressPage.jsx";
import AchievementsPage from "../pages/student/AchievementsPage.jsx";
import TeacherPage from "../pages/teacher/TeacherPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

/**
 * Filipino na mga ruta ayon sa aprubadong plano.
 * Ang /pagsasanay at /mga-gantimpala ay alias lamang ng umiiral na
 * /aktibidad at /mga-nakamit upang hindi masira ang mga lumang link.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mga-aralin" element={<LessonsPage />} />
      <Route path="/mga-aralin/:lessonId" element={<LessonDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/pasimplehin" element={<SimplifyPage />} />
      <Route path="/aktibidad" element={<ActivityPage />} />
      <Route path="/pagsasanay" element={<Navigate to="/aktibidad" replace />} />
      <Route path="/misyon" element={<QuestPage />} />
      <Route path="/mga-nakamit" element={<AchievementsPage />} />
      <Route
        path="/mga-gantimpala"
        element={<Navigate to="/mga-nakamit" replace />}
      />
      <Route path="/pag-unlad" element={<ProgressPage />} />
      <Route path="/guro" element={<TeacherPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
