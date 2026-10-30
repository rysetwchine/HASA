import { AppError } from "../utils/errors.js";

export function notFoundHandler(req, _res, next) {
  next(new AppError(404, "NOT_FOUND", "Hindi mahanap ang hinahanap mo."));
}

export function errorHandler(error, req, res, _next) {
  if (error instanceof AppError) {
    return res.status(error.status).json({
      error: { code: error.code, message: error.message },
    });
  }

  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({
      error: { code: "INVALID_JSON", message: "Hindi wasto ang datos na ipinadala." },
    });
  }

  console.error("[HASA API]", req.method, req.originalUrl, error);
  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "May problema sa server. Subukan muli mamaya.",
    },
  });
}
