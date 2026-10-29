/**
 * BALANGKAS LAMANG (Stage 1).
 *
 * Sa yugtong ito ay STATIC ang frontend: wala pang backend, walang
 * session, at walang network call. Ang file na ito ay nakatala lamang
 * ng magiging kontrata sa Stage 2, para hindi magbago ang mga pahina.
 *
 * Kapag naisagawa na ang backend, ito ang magiging hugis:
 *
 *   const response = await fetch(`/api${path}`, {
 *     credentials: "include",          // httpOnly session cookie
 *     headers: { "Content-Type": "application/json", ...headers },
 *     ...rest,
 *   });
 *
 * Mga tuntunin:
 *  - Ang error ay laging { error: { code, message } } at Tagalog ang message.
 *  - 401 -> balik sa /login
 *  - 403 -> "Wala kang pahintagang gawin ito."
 *  - 429 -> "Naabot mo na ang limitasyon..."
 *  - 503 -> "Hindi naka-configure ang AI provider."
 *  - Walang API key o token sa browser. httpOnly cookie lamang.
 */

export class ApiError extends Error {
  constructor(code, message, status) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export const API_NOT_AVAILABLE_MESSAGE =
  "Wala pang koneksyon sa server sa yugtong ito.";

/**
 * Pansamantalang humaharang sa lahat ng tawag. Sinasadya itong
 * mag-throw para masigurong walang aksidenteng network request sa
 * Stage 1.
 */
export function apiFetch() {
  throw new ApiError(
    "NOT_IMPLEMENTED",
    API_NOT_AVAILABLE_MESSAGE,
    0,
  );
}
