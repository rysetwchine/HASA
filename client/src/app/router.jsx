import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "./AuthProvider.jsx";
import AppLayout from "../components/layout/AppLayout.jsx";
import PublicLayout from "../components/layout/PublicLayout.jsx";
import { Loading } from "../components/ui.jsx";

const LandingPage = lazy(() => import("../pages/public/LandingPage.jsx"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage.jsx"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage.jsx"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage.jsx"));

const StudentDashboard = lazy(() => import("../pages/student/DashboardPage.jsx"));
const LessonsPage = lazy(() => import("../pages/student/LessonsPage.jsx"));
const LessonDetailPage = lazy(() => import("../pages/student/LessonDetailPage.jsx"));
const ActivitiesPage = lazy(() => import("../pages/student/ActivitiesPage.jsx"));
const QuizzesPage = lazy(() => import("../pages/student/QuizzesPage.jsx"));
const PlayerPage = lazy(() => import("../pages/student/PlayerPage.jsx"));
const ProgressPage = lazy(() => import("../pages/student/ProgressPage.jsx"));
const RewardsPage = lazy(() => import("../pages/student/RewardsPage.jsx"));
const SimplifyPage = lazy(() => import("../pages/student/SimplifyPage.jsx"));
const StudentProfile = lazy(() => import("../pages/student/ProfilePage.jsx"));

const TeacherDashboard = lazy(() => import("../pages/teacher/DashboardPage.jsx"));
const StudentsPage = lazy(() => import("../pages/teacher/StudentsPage.jsx"));
const StudentDetailPage = lazy(() => import("../pages/teacher/StudentDetailPage.jsx"));
const TeacherLessons = lazy(() => import("../pages/teacher/LessonsPage.jsx"));
const TeacherActivities = lazy(() => import("../pages/teacher/AssessmentsPage.jsx"));
const TeacherQuizzes = lazy(() => import("../pages/teacher/AssessmentsPage.jsx"));
const ReportsPage = lazy(() => import("../pages/teacher/ReportsPage.jsx"));
const TeacherProfile = lazy(() => import("../pages/teacher/ProfilePage.jsx"));

function FullPageLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas">
      <Loading label="Binubuksan ang HASA…" />
    </div>
  );
}

function RequireRole({ role, children }) {
  const { user, status } = useAuth();
  if (status === "loading") return <FullPageLoading />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) {
    return <Navigate to={user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard"} replace />;
  }
  return children;
}

function GuestOnly({ children }) {
  const { user, status } = useAuth();
  if (status === "loading") return <FullPageLoading />;
  if (user) {
    return <Navigate to={user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard"} replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<FullPageLoading />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
        </Route>

        <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />

        <Route
          path="/student"
          element={
            <RequireRole role="student">
              <AppLayout role="student" />
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="aralin" element={<LessonsPage />} />
          <Route path="aralin/:id" element={<LessonDetailPage />} />
          <Route path="aktibidad" element={<ActivitiesPage />} />
          <Route path="aktibidad/:id" element={<PlayerPage />} />
          <Route path="pagsusulit" element={<QuizzesPage />} />
          <Route path="pagsusulit/:id" element={<PlayerPage />} />
          <Route path="progreso" element={<ProgressPage />} />
          <Route path="mga-gantimpala" element={<RewardsPage />} />
          <Route path="pasimplehin" element={<SimplifyPage />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        <Route
          path="/teacher"
          element={
            <RequireRole role="teacher">
              <AppLayout role="teacher" />
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="/teacher/dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="mga-mag-aaral" element={<StudentsPage />} />
          <Route path="mga-mag-aaral/:id" element={<StudentDetailPage />} />
          <Route path="mga-aralin" element={<TeacherLessons />} />
          <Route path="mga-aktibidad" element={<TeacherActivities kind="activity" />} />
          <Route path="mga-pagsusulit" element={<TeacherQuizzes kind="quiz" />} />
          <Route path="mga-ulat" element={<ReportsPage />} />
          <Route path="profile" element={<TeacherProfile />} />
        </Route>

        <Route path="/mga-aralin" element={<Navigate to="/student/aralin" replace />} />
        <Route path="/aktibidad" element={<Navigate to="/student/aktibidad" replace />} />
        <Route path="/pagsasanay" element={<Navigate to="/student/aktibidad" replace />} />
        <Route path="/pagsusulit" element={<Navigate to="/student/pagsusulit" replace />} />
        <Route path="/pag-unlad" element={<Navigate to="/student/progreso" replace />} />
        <Route path="/mga-nakamit" element={<Navigate to="/student/mga-gantimpala" replace />} />
        <Route path="/mga-gantimpala" element={<Navigate to="/student/mga-gantimpala" replace />} />
        <Route path="/pasimplehin" element={<Navigate to="/student/pasimplehin" replace />} />
        <Route path="/guro" element={<Navigate to="/teacher/dashboard" replace />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
