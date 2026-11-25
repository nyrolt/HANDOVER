import { ControllerResponse } from "../../backend/controllers/authController";
import { logger } from "../../backend/services/logger";

interface CustomError {
  status?: number;
  statusCode?: number;
  message?: string;
  stack?: string;
}

export function errorHandler(err: unknown, _req: unknown, res: ControllerResponse) {
  const errorObj = err instanceof Error ? err : new Error(String(err));
  logger.error("Unhandled Server Error", errorObj);

  const customErr = err as CustomError;
  const statusCode = customErr?.status || customErr?.statusCode || 500;
  const message = customErr?.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    error: message,
  });
}
