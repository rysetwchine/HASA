import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { demoStudent } from "../data/demoData.js";

/**
 * DEMO SESSION LAMANG.
 *
 * Walang backend, session cookie, o password hashing sa prototype na ito
 * (tingnan ang docs/PLAN.md, Stage 2). Ang "session" dito ay isang lokal na
 * flag na nagsasaad kung ipinapakita ang demo na mag-aaral o ang pahina ng
 * pag-log in.
 *
 * Hindi ito nagpapanggap na totoong authentication:
 *  - `signOut()` ay nag-aalis ng naka-save na username at nag-seset ng flag.
 *  - `signInAsDemo()` ay nagbabalik sa demo na mag-aaral, wala itong
 *    pinapatunayan na identity.
 */

const SessionContext = createContext(null);

const SESSION_KEY = "hasa:demo-session:v1";
const SIGNED_OUT = "signed-out";

function readSession() {
  try {
    return window.localStorage.getItem(SESSION_KEY) === SIGNED_OUT
      ? null
      : demoStudent;
  } catch {
    return demoStudent;
  }
}

export function SessionProvider({ children }) {
  const [student, setStudent] = useState(() => readSession());

  const signOut = useCallback(() => {
    try {
      window.localStorage.setItem(SESSION_KEY, SIGNED_OUT);
      window.localStorage.removeItem("hasa:remembered-username");
    } catch {
      // Hindi kritikal ang storage; ipagpatuloy pa rin ang pag-logout.
    }
    setStudent(null);
  }, []);

  const signInAsDemo = useCallback(() => {
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      // Balewala kung naka-block ang storage.
    }
    setStudent(demoStudent);
  }, []);

  const value = useMemo(
    () => ({
      student,
      isSignedIn: Boolean(student),
      signOut,
      signInAsDemo,
    }),
    [student, signOut, signInAsDemo],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession ay dapat gamitin sa loob ng SessionProvider.");
  }

  return context;
}
