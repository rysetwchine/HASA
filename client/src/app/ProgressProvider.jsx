import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  PROGRESS_STORAGE_KEY,
  clearStoredProgress,
  loadProgress,
  recordActivityResult,
  saveProgress,
} from "../services/progressStore.js";

const ProgressContext = createContext(null);

/**
 * Nagbabahagi ng lokal na XP, streak, at kasaysayan ng aktibidad sa buong app.
 * Ang localStorage ang tanging persistence sa prototype; walang backend call.
 */
export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => loadProgress());
  const [storageAvailable, setStorageAvailable] = useState(true);
  const progressRef = useRef(progress);

  const commit = useCallback((nextState) => {
    progressRef.current = nextState;
    setProgress(nextState);
    const saved = saveProgress(nextState);
    setStorageAvailable(saved);
    return saved;
  }, []);

  const completeActivity = useCallback(
    (activity, correct, total, meta = {}) => {
      const { state, result } = recordActivityResult(progressRef.current, {
        activity,
        correct,
        total,
        completedAt: meta.completedAt ?? new Date(),
        timedOut: meta.timedOut ?? false,
      });

      commit(state);
      return result;
    },
    [commit],
  );

  const resetProgress = useCallback(() => {
    clearStoredProgress();
    const next = loadProgress();
    progressRef.current = next;
    setProgress(next);
    setStorageAvailable(true);
    return next;
  }, []);

  // Kapag may ibang tab na nagbago ng progress, i-refresh ang state.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const onStorage = (event) => {
      if (event.key !== PROGRESS_STORAGE_KEY) return;
      const next = loadProgress();
      progressRef.current = next;
      setProgress(next);
      setStorageAvailable(Boolean(event.newValue));
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({
      progress,
      storageAvailable,
      completeActivity,
      resetProgress,
    }),
    [progress, storageAvailable, completeActivity, resetProgress],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error("useProgress ay dapat gamitin sa loob ng ProgressProvider.");
  }

  return context;
}
