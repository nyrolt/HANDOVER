import { User, UserRole } from "../models/types";
import { authService } from "../services/auth";
import { can, PermissionAction, PermissionResource } from "../services/permissions";
import { RateLimiter } from "../services/rate-limiter";
import { ControllerRequest, ControllerResponse } from "../controllers/authController";

export type NextFunction = () => void;

const globalLimiter = new RateLimiter(100, 60);

/**
 * Middleware to verify session and extract user
 */
export function authenticate(req: ControllerRequest, res: ControllerResponse, next: NextFunction) {
  // Extract session token from cookie or Authorization Bearer header
  const reqAny = req as unknown as {
    cookies?: Record<string, string>;
    headers?: Record<string, string | string[]>;
  };
  const cookieToken = reqAny.cookies?.["handover_session"];
  const authHeader = reqAny.headers?.["authorization"];
  const bearerToken =
    typeof authHeader === "string" ? authHeader.replace(/^Bearer\s+/i, "").trim() : undefined;
  const token = cookieToken || bearerToken;

  let currentUser: User | null = null;
  if (token) {
    const verified = authService.verifySession(token);
    if (verified) {
      currentUser = verified.user;
    }
  }

  // Fallback to active memory session
  if (!currentUser) {
    currentUser = authService.getUser();
  }

  if (!currentUser) {
    return res.status(401).json({ success: false, error: "Authentication required" });
  }

  // Rate limiting per IP/User
  const limit = globalLimiter.check(currentUser.id);
  if (!limit.allowed) {
    return res
      .status(429)
      .json({ success: false, error: "Too many requests. Please wait a moment." });
  }

  req.user = currentUser;
  next();
}

/**
 * Middleware to require specific role
 */
export function requireRole(role: UserRole) {
  return (req: ControllerRequest, res: ControllerResponse, next: NextFunction) => {
    const user = req.user as User | undefined;
    if (!user) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    if (user.role !== role) {
      return res.status(403).json({ success: false, error: `Forbidden: Requires ${role} role` });
    }

    next();
  };
}

/**
 * Middleware to enforce fine-grained action permission
 */
export function requirePermission(action: PermissionAction, resource: PermissionResource) {
  return (req: ControllerRequest, res: ControllerResponse, next: NextFunction) => {
    const user = req.user as User | undefined;
    if (!user) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const student = user.role === "student" ? authService.getStudentProfile() : null;
    const context = {
      institutionId: user.institutionId,
      sectionId: req.params?.["sectionId"] || student?.sectionId,
      studentId: req.params?.["studentId"] || student?.id,
    };

    if (!can(user, action, resource, context)) {
      return res
        .status(403)
        .json({ success: false, error: `Forbidden: Cannot perform ${action} on ${resource}` });
    }

    next();
  };
}
