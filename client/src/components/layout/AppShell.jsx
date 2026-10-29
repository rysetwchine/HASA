import { useEffect } from "react";
import { useLocation } from "react-router";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import MobileNav from "./MobileNav.jsx";

const AUTH_ROUTES = new Set(["/login", "/register"]);

function SkipLink() {
  return (
    <a
      href="#nilalaman"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-deep focus:shadow"
    >
      Lumaktaw sa nilalaman
    </a>
  );
}

/** Binabalik sa itaas ang scroll tuwing nagbabago ang ruta. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));

      const target = document.getElementById(id);

      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return;
      }
    }

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, hash]);

  return null;
}

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_ROUTES.has(pathname);

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-canvas">
        <SkipLink />
        <ScrollToTop />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas xl:flex">
      <SkipLink />
      <ScrollToTop />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Ang Topbar ay sa mga pahina ng app; sa mobile gamit ang MobileNav */}
        <main
          id="nilalaman"
          className="flex-1 px-4 pb-8 pt-5 sm:px-6 xl:px-12 xl:pt-7 2xl:px-14"
        >
          <div className="mx-auto w-full max-w-[1240px]">
            <Topbar />
            {children}
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
