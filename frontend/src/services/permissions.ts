import type { User, UserRole } from "@/types";

export type PermissionAction =
  | "create:section"
  | "read:section"
  | "update:section"
  | "delete:section"
  | "create:student"
  | "read:student"
  | "update:student"
  | "delete:student"
  | "read:marks"
  | "update:marks"
  | "create:group"
  | "read:group"
  | "update:group"
  | "delete:group"
  | "propose:group"
  | "review:proposal"
  | "create:assignment"
  | "read:assignment"
  | "update:assignment"
  | "delete:assignment"
  | "create:announcement"
  | "read:announcement"
  | "delete:announcement"
  | "submit:assignment"
  | "convert:file"
  | "read:submission"
  | "verify:submission"
  | "review:submission"
  | "reconcile:marks"
  | "read:notification"
  | "update:notification";

export type PermissionResource =
  | "section"
  | "student"
  | "marks"
  | "projectGroup"
  | "groupRequest"
  | "assignment"
  | "announcement"
  | "submission"
  | "verification"
  | "notification";

export interface PermissionContext {
  institutionId?: string | undefined;
  sectionId?: string | undefined;
  studentId?: string | undefined;
  targetStudentId?: string | undefined;
  targetUserId?: string | undefined;
}

export class AuthorizationError extends Error {
  public code: "UNAUTHENTICATED" | "FORBIDDEN" | "NOT_FOUND";
  public status: number;

  constructor(
    message = "You do not have permission to perform this action.",
    code: "UNAUTHENTICATED" | "FORBIDDEN" | "NOT_FOUND" = "FORBIDDEN",
  ) {
    super(message);
    this.name = "AuthorizationError";
    this.code = code;
    this.status = code === "UNAUTHENTICATED" ? 401 : code === "NOT_FOUND" ? 404 : 403;
  }
}

/**
 * Single centralized authorization engine for Handover.
 * Enforces the permissions matrix defined in /docs/permissions.md.
 */
export function can(
  user: User | null | undefined,
  action: PermissionAction,
  resource: PermissionResource,
  context?: PermissionContext,
): boolean {
  // 1. Unauthenticated users cannot perform any action
  if (!user) return false;

  const role = user.role;

  // 2. Admin has complete operational access within their institution
  if (role === "admin") return true;

  // 3. Faculty / Teacher permissions
  if (role === "teacher") {
    // Teachers have administrative rights over academic sections, marks, students, and coursework
    switch (action) {
      case "create:section":
      case "read:section":
      case "update:section":
      case "delete:section":
      case "create:student":
      case "read:student":
      case "update:student":
      case "delete:student":
      case "read:marks":
      case "update:marks":
      case "create:group":
      case "read:group":
      case "update:group":
      case "delete:group":
      case "review:proposal":
      case "create:assignment":
      case "read:assignment":
      case "update:assignment":
      case "delete:assignment":
      case "create:announcement":
      case "read:announcement":
      case "delete:announcement":
      case "read:submission":
      case "verify:submission":
      case "review:submission":
      case "reconcile:marks":
      case "read:notification":
      case "update:notification":
      case "convert:file":
        return true;
      case "submit:assignment":
        // Submissions are made by students
        return false;
      case "propose:group":
        // Group proposals are initiated by students
        return false;
      default:
        return false;
    }
  }

  // 4. Student permissions (Restricted)
  if (role === "student") {
    switch (action) {
      case "read:section":
      case "read:student":
      case "read:group":
      case "read:assignment":
      case "read:announcement":
        // Permitted read access within enrolled section
        return true;

      case "propose:group":
        // Students can submit proposed project group names and teammates
        return true;

      case "read:marks":
        // CRITICAL IDOR PROTECTION:
        // A student can ONLY view their own marks record!
        if (context?.targetStudentId && context?.studentId) {
          return context.targetStudentId === context.studentId;
        }
        if (context?.targetUserId) {
          return context.targetUserId === user.id;
        }
        return false;

      case "submit:assignment":
      case "convert:file":
        return true;

      case "read:submission":
        // A student can read submissions if scoped to them
        if (context?.targetStudentId && context?.studentId) {
          return context.targetStudentId === context.studentId;
        }
        return true;

      case "read:notification":
      case "update:notification":
        return true;

      case "verify:submission":
      case "review:submission":
      case "reconcile:marks":
        return false;

      // STRICTLY FORBIDDEN FOR STUDENTS:
      case "update:marks":
      case "create:section":
      case "update:section":
      case "delete:section":
      case "create:student":
      case "update:student":
      case "delete:student":
      case "create:group":
      case "update:group":
      case "delete:group":
      case "review:proposal":
      case "create:assignment":
      case "update:assignment":
      case "delete:assignment":
      case "create:announcement":
      case "delete:announcement":
        return false;

      default:
        return false;
    }
  }

  return false;
}

/**
 * Asserts authorization and throws an AuthorizationError if check fails.
 * Server and Service source of truth.
 */
export function assertCan(
  user: User | null | undefined,
  action: PermissionAction,
  resource: PermissionResource,
  context?: PermissionContext,
): void {
  if (!user) {
    throw new AuthorizationError(
      "Authentication required to access this resource.",
      "UNAUTHENTICATED",
    );
  }

  const allowed = can(user, action, resource, context);
  if (!allowed) {
    throw new AuthorizationError(
      `Access denied: ${user.role} is not permitted to ${action} on ${resource}.`,
      "FORBIDDEN",
    );
  }
}
