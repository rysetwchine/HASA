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

/**
 * Balangkas ng app. Ang `<main>` ay flex-1 at `min-w-0`, kaya kailanman
 * hindi ito lumalampas sa natitirang lapad katabi ng sidebar (na may
 * `shrink-0`). Ito ang pumipigil sa horizontal scrolling.
 *
 * Padding: 16px sa mobile, 24px sa tablet, 32–40px sa desktop. Dati
 * 48–56px ito, na nagiging sobrang laki sa 1366×768.
 */
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
        <main
          id="nilalaman"
          className="min-w-0 flex-1 px-4 pb-8 pt-4 sm:px-6 xl:px-8 xl:pt-5 2xl:px-10"
        >
          <div className="mx-auto w-full max-w-[1180px]">
            <Topbar />
            {children}
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
