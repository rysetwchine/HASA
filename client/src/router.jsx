import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import LessonsPage from "./pages/LessonsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SimplifyPage from "./pages/SimplifyPage.jsx";
import ActivityPage from "./pages/ActivityPage.jsx";
import QuestPage from "./pages/QuestPage.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";
import AchievementsPage from "./pages/AchievementsPage.jsx";
import TeacherPage from "./pages/TeacherPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

/**
 * Tagalog na mga ruta ayon sa aprubadong plano.
 * Ang /pagsasanay at /mga-gantimpala ay alias lamang ng umiiral na
 * /aktibidad at /mga-nakamit upang hindi masira ang mga lumang link.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mga-aralin" element={<LessonsPage />} />
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
