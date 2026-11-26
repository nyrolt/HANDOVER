import type { User, UserRole, Student } from "../models/types";
import { db } from "./db";

const SESSION_KEY = "college_mgmt_session_v1";

export interface AuthSession {
  user: User;
  studentProfile?: Student | undefined;
}

class AuthService {
  private currentSession: AuthSession | null = null;
  private listeners: Set<() => void> = new Set();
  private activeSessions: Map<string, { sessionId: string; userId: string; createdAt: number }> =
    new Map();

  constructor() {
    this.currentSession = this.loadSession();
  }

  public createSession(userId: string): {
    sessionId: string;
    user: User;
    studentProfile?: Student | undefined;
  } {
    const user = db.getUserById(userId);
    if (!user) throw new Error("User not found");

    const sessionId =
      "sess_" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    this.activeSessions.set(sessionId, {
      sessionId,
      userId,
      createdAt: Date.now(),
    });

    let studentProfile: Student | undefined;
    if (user.role === "student") {
      studentProfile =
        db.getStudentByUserId(user.id) ||
        db.getStudents().find((s) => s.email.toLowerCase() === user.email.toLowerCase());
    }

    this.saveSession({ user, studentProfile });
    return { sessionId, user, studentProfile };
  }

  public verifySession(
    sessionId: string,
  ): { user: User; studentProfile?: Student | undefined } | null {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    const user = db.getUserById(session.userId);
    if (!user) {
      this.activeSessions.delete(sessionId);
      return null;
    }

    let studentProfile: Student | undefined;
    if (user.role === "student") {
      studentProfile =
        db.getStudentByUserId(user.id) ||
        db.getStudents().find((s) => s.email.toLowerCase() === user.email.toLowerCase());
    }

    return { user, studentProfile };
  }

  public destroySession(sessionId: string): void {
    this.activeSessions.delete(sessionId);
  }

  private isBrowser(): boolean {
    const g = globalThis as unknown as Record<string, unknown>;
    return (
      typeof globalThis !== "undefined" &&
      "localStorage" in globalThis &&
      g["localStorage"] !== undefined
    );
  }

  private loadSession(): AuthSession | null {
    if (!this.isBrowser()) {
      return null;
    }

    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored === "logged_out") {
        return null;
      }
      if (stored) {
        const parsed = JSON.parse(stored) as AuthSession;
        // Verify user still exists in database
        const freshUser = db.getUserById(parsed.user.id) || db.getUserByEmail(parsed.user.email);
        if (freshUser) {
          let studentProfile: Student | undefined;
          if (freshUser.role === "student") {
            studentProfile =
              db.getStudentByUserId(freshUser.id) ||
              db.getStudents().find((s) => s.email.toLowerCase() === freshUser.email.toLowerCase());
          }
          return { user: freshUser, studentProfile };
        }
      }
    } catch (e) {
      console.warn("Failed to load session:", e);
    }

    return null;
  }

  private saveSession(session: AuthSession | null): void {
    this.currentSession = session;
    if (this.isBrowser()) {
      if (session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } else {
        localStorage.setItem(SESSION_KEY, "logged_out");
      }
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  public getSession(): AuthSession | null {
    if (!this.currentSession) {
      this.currentSession = this.loadSession();
    }
    return this.currentSession;
  }

  public getUser(): User | null {
    return this.getSession()?.user || null;
  }

  public getStudentProfile(): Student | null {
    const session = this.getSession();
    if (!session || session.user.role !== "student") return null;
    return session.studentProfile || db.getStudentByUserId(session.user.id) || null;
  }

  public login(
    email: string,
    role?: UserRole,
    password?: string,
  ): {
    success: boolean;
    error?: string | undefined;
    role?: UserRole | undefined;
    user?: User | undefined;
    studentProfile?: Student | undefined;
  } {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      return { success: false, error: "Please enter your college email address." };
    }

    const user = db.getUserByEmail(trimmedEmail);
    if (!user) {
      if (role === "student") {
        return {
          success: false,
          error:
            "No student account found with this email. Please register to create your account.",
        };
      }
      if (role === "teacher") {
        return {
          success: false,
          error:
            "No faculty account found with this email. Please register as faculty to get started.",
        };
      }
      return {
        success: false,
        error: "Account not found with this email address. Please check your spelling or register.",
      };
    }

    // Password check if password is provided
    if (user.password && password && user.password !== password) {
      return {
        success: false,
        error: "Incorrect password. Please check your credentials and try again.",
      };
    }

    // Role check if explicitly requested
    if (role && user.role !== role) {
      return {
        success: false,
        error: `This email is registered as a ${user.role}. Please select the ${
          user.role === "teacher" ? "Teacher" : "Student"
        } tab to sign in.`,
      };
    }

    let studentProfile: Student | undefined;
    if (user.role === "student") {
      studentProfile =
        db.getStudentByUserId(user.id) ||
        db.getStudents().find((s) => s.email.toLowerCase() === user.email.toLowerCase());
      if (!studentProfile) {
        const defaultSec = db.getSections()[0];
        const sectionId = defaultSec ? defaultSec.id : "sec-cse-a";
        studentProfile = db.addStudent({
          name: user.name,
          email: user.email,
          rollNumber: "2024-CS-" + String(db.getStudents(sectionId).length + 1).padStart(3, "0"),
          sectionId,
        });
      }
    }

    this.saveSession({ user, studentProfile });
    return { success: true, role: user.role, user, studentProfile };
  }

  public registerTeacher(data: {
    name: string;
    email: string;
    department: string;
    initialSectionName?: string | undefined;
    password?: string | undefined;
  }): {
    success: boolean;
    error?: string | undefined;
    role?: UserRole | undefined;
    user?: User | undefined;
  } {
    const trimmedEmail = data.email.trim().toLowerCase();
    const trimmedName = data.name.trim();
    const trimmedDept = data.department.trim();

    if (!trimmedName) {
      return { success: false, error: "Please enter your full name." };
    }
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      return { success: false, error: "Please enter a valid institutional email address." };
    }
    if (!trimmedDept) {
      return { success: false, error: "Please specify your academic department." };
    }

    const existingUser = db.getUserByEmail(trimmedEmail);
    if (existingUser) {
      return {
        success: false,
        error: "An account with this email address already exists. Please sign in instead.",
      };
    }

    // 1. Create Teacher User
    const newTeacher = db.addUser({
      name: trimmedName,
      email: trimmedEmail,
      role: "teacher",
      department: trimmedDept,
      password: data.password || undefined,
    });

    // 2. Create their initial Section so they have a workspace ready
    const sectionTitle = data.initialSectionName?.trim() || `${trimmedDept} - Section A`;
    db.createSection({
      sectionName: sectionTitle,
      courseName: trimmedDept,
      academicYear: "2026-2027",
      teacherId: newTeacher.id,
    });

    // 3. Save session
    this.saveSession({ user: newTeacher });
    return { success: true, role: "teacher", user: newTeacher };
  }

  public registerStudent(data: {
    name: string;
    email: string;
    rollNumber: string;
    sectionId: string;
    password?: string | undefined;
  }): {
    success: boolean;
    error?: string | undefined;
    role?: UserRole | undefined;
    user?: User | undefined;
    studentProfile?: Student | undefined;
  } {
    const trimmedEmail = data.email.trim().toLowerCase();
    const trimmedRoll = data.rollNumber.trim();
    const trimmedName = data.name.trim();
    const rawSection = data.sectionId.trim();

    if (!trimmedName) {
      return { success: false, error: "Please enter your full name." };
    }
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      return { success: false, error: "Please enter a valid college email address." };
    }
    if (!trimmedRoll) {
      return { success: false, error: "Please enter your student roll number." };
    }
    if (!rawSection) {
      return { success: false, error: "Please select or enter your class / section." };
    }

    // Check if user already exists
    const existingUser = db.getUserByEmail(trimmedEmail);
    if (existingUser) {
      return {
        success: false,
        error: "An account with this email address already exists. Please sign in instead.",
      };
    }

    // Resolve target section or dynamically create if new section name provided
    let targetSection = db.getSectionById(rawSection);
    if (!targetSection) {
      targetSection = db
        .getSections()
        .find((s) => s.sectionName.toLowerCase() === rawSection.toLowerCase());
    }
    if (!targetSection) {
      targetSection = db.createSection({
        sectionName: rawSection,
        courseName: "Academic Program",
        academicYear: "2026-2027",
        teacherId: "faculty-pending",
      });
    }

    const resolvedSectionId = targetSection.id;

    // Check if roll number already taken in this section
    const existingStudentsInSection = db.getStudents(resolvedSectionId);
    if (
      existingStudentsInSection.some(
        (s) => s.rollNumber.toLowerCase() === trimmedRoll.toLowerCase(),
      )
    ) {
      return {
        success: false,
        error: `Roll Number "${trimmedRoll}" is already registered in this section. If this is an error, contact your faculty.`,
      };
    }

    // 1. Create User
    const newUser = db.addUser({
      name: trimmedName,
      email: trimmedEmail,
      role: "student",
      password: data.password || undefined,
    });

    // 2. Create Student Profile
    const newStudent = db.addStudent({
      name: trimmedName,
      email: trimmedEmail,
      rollNumber: trimmedRoll,
      sectionId: resolvedSectionId,
    });

    // 3. Save session
    this.saveSession({ user: newUser, studentProfile: newStudent });

    return { success: true, role: "student", user: newUser, studentProfile: newStudent };
  }

  public loginWithEmail(email: string, role?: UserRole): { success: boolean; error?: string } {
    let user = db.getUserByEmail(email);
    if (!user) {
      const usernamePart = email.split("@")[0] ?? "user";
      const name = usernamePart.replace(".", " ").replace(/^./, (str) => str.toUpperCase());
      user = db.addUser({
        name,
        email: email.trim().toLowerCase(),
        role: role || "student",
      });
    }

    let studentProfile: Student | undefined;
    if (user.role === "student") {
      studentProfile =
        db.getStudentByUserId(user.id) ||
        db.getStudents().find((s) => s.email.toLowerCase() === user.email.toLowerCase());
      if (!studentProfile) {
        const defaultSec = db.getSections()[0];
        const sectionId = defaultSec ? defaultSec.id : "sec-cse-a";
        studentProfile = db.addStudent({
          name: user.name,
          email: user.email,
          rollNumber: "2024-CS-" + String(db.getStudents(sectionId).length + 1).padStart(3, "0"),
          sectionId,
        });
      }
    }

    this.saveSession({ user, studentProfile });
    return { success: true };
  }

  public logout(): void {
    this.saveSession(null);
  }
}

export const authService = new AuthService();
