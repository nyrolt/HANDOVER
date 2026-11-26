import { authService } from "../services/auth";
import type { UserRole, User } from "../models/types";

export interface ControllerRequest<T = unknown> {
  user?: User;
  body: T;
  params?: Record<string, string>;
  query?: Record<string, string | undefined>;
}

export interface ControllerResponse<T = unknown> {
  status: (code: number) => ControllerResponse<T>;
  json: (data: { success: boolean; data?: T; error?: string }) => void;
}

export class AuthController {
  public static login(email: string, role?: UserRole, password?: string) {
    return authService.login(email, role, password);
  }

  public static registerStudent(data: {
    name: string;
    email: string;
    rollNumber: string;
    sectionId: string;
    password?: string;
  }) {
    return authService.registerStudent(data);
  }

  public static registerTeacher(data: {
    name: string;
    email: string;
    department: string;
    initialSectionName?: string;
    password?: string;
  }) {
    return authService.registerTeacher(data);
  }

  public static logout() {
    authService.logout();
    return { success: true };
  }

  public static getSession() {
    return authService.getSession();
  }

  // API HTTP Handlers
  async login(
    req: ControllerRequest<{ email: string; role?: UserRole; password?: string }>,
    res: ControllerResponse,
  ) {
    try {
      const { email, role, password } = req.body;
      const result = authService.login(email, role, password);
      if (!result.success || !result.user) {
        return res.status(400).json({ success: false, error: result.error || "Login failed" });
      }

      // Generate session token and set cookie
      const session = authService.createSession(result.user.id);
      const resAny = res as unknown as {
        cookie?: (name: string, val: string, options: Record<string, unknown>) => void;
      };
      if (typeof resAny.cookie === "function") {
        resAny.cookie("handover_session", session.sessionId, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          user: session.user,
          studentProfile: session.studentProfile,
          role: session.user.role,
          token: session.sessionId,
        },
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Internal error";
      return res.status(500).json({ success: false, error: errorMsg });
    }
  }

  async register(req: ControllerRequest<Record<string, unknown>>, res: ControllerResponse) {
    try {
      const { role, ...payload } = req.body;
      let result;
      if (role === "teacher") {
        result = authService.registerTeacher(
          payload as { name: string; email: string; department: string },
        );
      } else {
        result = authService.registerStudent(
          payload as { name: string; email: string; rollNumber: string; sectionId: string },
        );
      }

      if (!result.success || !result.user) {
        return res
          .status(400)
          .json({ success: false, error: result.error || "Registration failed" });
      }

      const session = authService.createSession(result.user.id);
      const resAny = res as unknown as {
        cookie?: (name: string, val: string, options: Record<string, unknown>) => void;
      };
      if (typeof resAny.cookie === "function") {
        resAny.cookie("handover_session", session.sessionId, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      return res.status(201).json({
        success: true,
        data: {
          user: session.user,
          studentProfile: session.studentProfile,
          role: session.user.role,
          token: session.sessionId,
        },
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Internal error";
      return res.status(500).json({ success: false, error: errorMsg });
    }
  }

  async logout(req: ControllerRequest, res: ControllerResponse) {
    const reqAny = req as unknown as { cookies?: Record<string, string> };
    const token = reqAny.cookies?.["handover_session"];
    if (token) {
      authService.destroySession(token);
    }
    const resAny = res as unknown as {
      clearCookie?: (name: string, options?: Record<string, unknown>) => void;
    };
    if (typeof resAny.clearCookie === "function") {
      resAny.clearCookie("handover_session", { path: "/" });
    }
    authService.logout();
    return res.status(200).json({ success: true });
  }

  async getMe(req: ControllerRequest, res: ControllerResponse) {
    // If request was authenticated through middleware, req.user is set
    if (req.user) {
      const studentProfile =
        req.user.role === "student"
          ? authService.getStudentProfile() ||
            (await import("../db/database")).db.getStudentByUserId(req.user.id)
          : undefined;
      return res.status(200).json({
        success: true,
        data: {
          user: req.user,
          studentProfile,
        },
      });
    }

    // Check token from cookie or header
    const reqAny = req as unknown as {
      cookies?: Record<string, string>;
      headers?: Record<string, string | string[]>;
    };
    const token =
      reqAny.cookies?.["handover_session"] ||
      (typeof reqAny.headers?.["authorization"] === "string"
        ? reqAny.headers["authorization"].replace(/^Bearer\s+/i, "").trim()
        : undefined);

    if (token) {
      const verified = authService.verifySession(token);
      if (verified) {
        return res.status(200).json({ success: true, data: verified });
      }
    }

    const session = authService.getSession();
    if (session) {
      return res.status(200).json({ success: true, data: session });
    }

    return res.status(401).json({ success: false, error: "Not authenticated" });
  }
}

export const authController = new AuthController();
