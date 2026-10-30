export class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}

export const errors = {
  unauthorized: () =>
    new AppError(401, "UNAUTHORIZED", "Kailangan mong mag-log in upang magpatuloy."),
  forbidden: (message = "Wala kang pahintayang gawin ito.") =>
    new AppError(403, "FORBIDDEN", message),
  notFound: (message = "Hindi mahanap ang hinahanap mo.") =>
    new AppError(404, "NOT_FOUND", message),
  conflict: (message) => new AppError(409, "CONFLICT", message),
  validation: (message) => new AppError(400, "VALIDATION_ERROR", message),
  tooMany: (message) =>
    new AppError(429, "TOO_MANY_REQUESTS", message),
};
