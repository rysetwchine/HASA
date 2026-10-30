import { AuthProvider } from "./AuthProvider.jsx";
import AppRoutes from "./router.jsx";

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
