import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("loading");

  const applySession = useCallback((payload) => {
    setUser(payload?.user ?? null);
    setStats(payload?.stats ?? null);
    setStatus(payload?.user ? "authenticated" : "anonymous");
  }, []);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/auth/me")
      .then((payload) => {
        if (!cancelled) applySession(payload);
      })
      .catch((error) => {
        if (cancelled) return;
        if (error.status === 401) applySession(null);
        else setStatus("anonymous");
      });
    return () => {
      cancelled = true;
    };
  }, [applySession]);

  const login = useCallback(
    async ({ username, password }) => {
      const payload = await api.post("/auth/login", { username, password });
      applySession(payload);
      return payload.user;
    },
    [applySession],
  );

  const registerStudent = useCallback(
    async (values) => {
      const payload = await api.post("/auth/register/student", values);
      applySession(payload);
      return payload.user;
    },
    [applySession],
  );

  const registerTeacher = useCallback(
    async (values) => {
      const payload = await api.post("/auth/register/teacher", values);
      applySession(payload);
      return payload.user;
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      setStats(null);
      setStatus("anonymous");
    }
  }, []);

  const refresh = useCallback(async () => {
    const payload = await api.get("/auth/me");
    applySession(payload);
    return payload;
  }, [applySession]);

  const updateSession = useCallback(
    (payload) => {
      applySession(payload);
    },
    [applySession],
  );

  const value = useMemo(
    () => ({
      user,
      stats,
      status,
      isAuthenticated: Boolean(user),
      login,
      registerStudent,
      registerTeacher,
      logout,
      refresh,
      updateSession,
    }),
    [
      user,
      stats,
      status,
      login,
      registerStudent,
      registerTeacher,
      logout,
      refresh,
      updateSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
