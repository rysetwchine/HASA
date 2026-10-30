import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "./api.js";

export function useApi(path, { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(Boolean(path) && enabled);
  const [tick, setTick] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!path || !enabled) {
      setLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    api
      .get(path, { signal: controller.signal })
      .then((payload) => {
        if (mounted.current) setData(payload);
      })
      .catch((requestError) => {
        if (requestError.name === "AbortError") return;
        if (mounted.current) setError(requestError);
      })
      .finally(() => {
        if (mounted.current) setLoading(false);
      });
    return () => controller.abort();
  }, [path, enabled, tick]);

  const reload = useCallback(() => setTick((current) => current + 1), []);
  return { data, error, loading, reload, setData };
}
