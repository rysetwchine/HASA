import AppShell from "../components/layout/AppShell.jsx";
import { ProgressProvider } from "./ProgressProvider.jsx";
import AppRoutes from "./router.jsx";

/**
 * Ang App ay walang router ng sarili nito para madaling subukan:
 * ang main.jsx ang naglalagay ng BrowserRouter, at ang mga test ay
 * gumagamit ng MemoryRouter.
 */
export default function App() {
  return (
    <ProgressProvider>
      <AppShell>
        <AppRoutes />
      </AppShell>
    </ProgressProvider>
  );
}
