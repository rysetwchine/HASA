const RAW_BASE = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");
export const API_BASE = RAW_BASE ? `${RAW_BASE}/api` : "/api";

export class ApiError extends Error {
  constructor(message, { code = "UNKNOWN", status = 0 } = {}) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

async function request(path, { method = "GET", body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      credentials: "include",
      headers: body === undefined ? { Accept: "application/json" } : {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError(
      "Hindi makonekta sa server. Tiyakin na bukas ang API at subukan muli.",
      { code: "NETWORK_ERROR" },
    );
  }

  if (response.status === 204) return null;

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message || "May problema sa server. Subukan muli mamaya.",
      {
        code: payload?.error?.code || "REQUEST_FAILED",
        status: response.status,
      },
    );
  }

  return payload;
}

export const api = {
  get: (path, options) => request(path, options),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};

export function errorMessage(error) {
  return error instanceof Error ? error.message : "May hindi inaasahang problema.";
}
