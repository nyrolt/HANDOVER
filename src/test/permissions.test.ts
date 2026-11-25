import { describe, expect, it } from "vitest";
import { can, assertCan, AuthorizationError } from "@/services/permissions";
import type { User } from "@/types";

describe("Permissions Matrix & Authorization Engine", () => {
  const teacherUser: User = {
    id: "usr-faculty-vance",
    name: "Dr. Eleanor Vance, Ph.D.",
    email: "e.vance@university.edu",
    role: "teacher",
    createdAt: "2026-08-01T09:00:00Z",
  };

  const studentUserAlexander: User = {
    id: "usr-stud-wright",
    name: "Alexander Wright",
    email: "a.wright@student.university.edu",
    role: "student",
    createdAt: "2026-08-05T10:00:00Z",
  };

  const studentUserSophia: User = {
    id: "usr-stud-martinez",
    name: "Sophia Martinez",
    email: "s.martinez@student.university.edu",
    role: "student",
    createdAt: "2026-08-05T10:15:00Z",
  };

  it("denies all operations when user is unauthenticated", () => {
    expect(can(null, "read:section", "section")).toBe(false);
    expect(can(undefined, "read:marks", "marks")).toBe(false);

    expect(() => {
      assertCan(null, "read:section", "section");
    }).toThrowError(AuthorizationError);

    try {
      assertCan(null, "read:section", "section");
    } catch (err) {
      expect((err as AuthorizationError).code).toBe("UNAUTHENTICATED");
      expect((err as AuthorizationError).status).toBe(401);
    }
  });

  it("allows teachers to perform full management actions", () => {
    expect(can(teacherUser, "create:section", "section")).toBe(true);
    expect(can(teacherUser, "update:marks", "marks")).toBe(true);
    expect(can(teacherUser, "review:proposal", "groupRequest")).toBe(true);
    expect(can(teacherUser, "create:assignment", "assignment")).toBe(true);
    expect(can(teacherUser, "delete:student", "student")).toBe(true);

    expect(() => {
      assertCan(teacherUser, "update:marks", "marks");
    }).not.toThrow();
  });

  it("allows students to read permitted section resources and propose groups", () => {
    expect(can(studentUserAlexander, "read:section", "section")).toBe(true);
    expect(can(studentUserAlexander, "read:assignment", "assignment")).toBe(true);
    expect(can(studentUserAlexander, "read:announcement", "announcement")).toBe(true);
    expect(can(studentUserAlexander, "propose:group", "groupRequest")).toBe(true);
  });

  it("strictly forbids students from mutating teacher-controlled academic records", () => {
    // Cannot edit marks
    expect(can(studentUserAlexander, "update:marks", "marks")).toBe(false);
    // Cannot create or delete sections
    expect(can(studentUserAlexander, "create:section", "section")).toBe(false);
    expect(can(studentUserAlexander, "delete:section", "section")).toBe(false);
    // Cannot create assignments
    expect(can(studentUserAlexander, "create:assignment", "assignment")).toBe(false);
    // Cannot approve group proposals
    expect(can(studentUserAlexander, "review:proposal", "groupRequest")).toBe(false);

    expect(() => {
      assertCan(studentUserAlexander, "update:marks", "marks");
    }).toThrowError(AuthorizationError);

    try {
      assertCan(studentUserAlexander, "update:marks", "marks");
    } catch (err) {
      expect((err as AuthorizationError).code).toBe("FORBIDDEN");
      expect((err as AuthorizationError).status).toBe(403);
    }
  });

  it("protects student marks against IDOR (Insecure Direct Object Reference)", () => {
    // Alexander viewing Alexander's own marks -> PERMITTED
    expect(
      can(studentUserAlexander, "read:marks", "marks", {
        studentId: "stud-1",
        targetStudentId: "stud-1",
      }),
    ).toBe(true);

    // Alexander attempting to view Sophia's marks -> STRICTLY FORBIDDEN
    expect(
      can(studentUserAlexander, "read:marks", "marks", {
        studentId: "stud-1",
        targetStudentId: "stud-2", // Sophia's ID
      }),
    ).toBe(false);

    expect(() => {
      assertCan(studentUserAlexander, "read:marks", "marks", {
        studentId: "stud-1",
        targetStudentId: "stud-2",
      });
    }).toThrowError(AuthorizationError);
  });
});
