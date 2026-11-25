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
      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error || "Login failed" });
      }
      return res.status(200).json({ success: true, data: result });
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

      if (!result.success) {
        return res
          .status(400)
          .json({ success: false, error: result.error || "Registration failed" });
      }
      return res.status(201).json({ success: true, data: result });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Internal error";
      return res.status(500).json({ success: false, error: errorMsg });
    }
  }

  async logout(_req: ControllerRequest, res: ControllerResponse) {
    authService.logout();
    return res.status(200).json({ success: true });
  }

  async getMe(_req: ControllerRequest, res: ControllerResponse) {
    const session = authService.getSession();
    return res.status(200).json({ success: true, data: session });
  }
}

export const authController = new AuthController();
