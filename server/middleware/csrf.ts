import { ControllerRequest, ControllerResponse } from "../../backend/controllers/authController";
import { NextFunction } from "../../backend/middleware/authMiddleware";

interface HttpRequestLike {
  method?: string;
  headers?: Record<string, string | undefined>;
}

/**
 * Protect against Cross-Site Request Forgery (CSRF) for mutating HTTP operations
 */
export function csrfProtection(
  req: ControllerRequest,
  res: ControllerResponse,
  next: NextFunction,
) {
  // Safe methods do not require CSRF token
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  const httpReq = req as unknown as HttpRequestLike;
  const method = httpReq.method || "GET";

  if (safeMethods.includes(method)) {
    return next();
  }

  const origin = httpReq.headers?.["origin"] || httpReq.headers?.["referer"];
  const customHeader =
    httpReq.headers?.["x-requested-with"] || httpReq.headers?.["x-csrf-protection"];

  // Custom header check or origin match
  if (customHeader || !origin || origin.includes("localhost") || origin.includes("127.0.0.1")) {
    return next();
  }

  return res.status(403).json({
    success: false,
    error: "CSRF verification failed: Untrusted request origin",
  });
}
