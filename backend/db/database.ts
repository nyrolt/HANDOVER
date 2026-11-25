import type {
  User,
  Section,
  Student,
  StudentMarks,
  Assignment,
  ProjectGroup,
  ProjectGroupMember,
  GroupRequest,
  Announcement,
  ActivityLog,
} from "@/types";

const STORAGE_KEY = "handover_academic_system_v2";
const LEGACY_STORAGE_KEY = "campusflow_academic_system_v2";

export interface DatabaseState {
  users: User[];
  sections: Section[];
  students: Student[];
  marks: StudentMarks[];
  assignments: Assignment[];
  projectGroups: ProjectGroup[];
  groupRequests: GroupRequest[];
  announcements: Announcement[];
  activityLogs: ActivityLog[];
}

export const INITIAL_DEMO_DATA: DatabaseState = {
  users: [
    {
      id: "usr-faculty-vance",
      name: "Dr. Eleanor Vance, Ph.D.",
      email: "e.vance@university.edu",
      role: "teacher",
      department: "Department of Computer Science & Engineering",
      institutionId: "inst-northwestern",
      password: "Faculty@2026",
      createdAt: "2026-08-01T09:00:00Z",
    },
    {
      id: "usr-faculty-marcus",
      name: "Prof. David Marcus",
      email: "d.marcus@university.edu",
      role: "teacher",
      department: "Department of Information Systems",
      institutionId: "inst-northwestern",
      password: "Faculty@2026",
      createdAt: "2026-08-01T09:00:00Z",
    },
    {
      id: "usr-stud-wright",
      name: "Alexander Wright",
      email: "a.wright@student.university.edu",
      role: "student",
      institutionId: "inst-northwestern",
      password: "Student@2026",
      createdAt: "2026-08-05T10:00:00Z",
    },
    {
      id: "usr-stud-martinez",
      name: "Sophia Martinez",
      email: "s.martinez@student.university.edu",
      role: "student",
      institutionId: "inst-northwestern",
      password: "Student@2026",
      createdAt: "2026-08-05T10:15:00Z",
    },
    {
      id: "usr-stud-chen",
      name: "Marcus Chen",
      email: "m.chen@student.university.edu",
      role: "student",
      institutionId: "inst-northwestern",
      password: "Student@2026",
      createdAt: "2026-08-05T10:30:00Z",
    },
    {
      id: "usr-stud-patel",
      name: "Olivia Patel",
      email: "o.patel@student.university.edu",
      role: "student",
      institutionId: "inst-northwestern",
      password: "Student@2026",
      createdAt: "2026-08-05T11:00:00Z",
    },
    {
      id: "usr-stud-oconnor",
      name: "Liam O'Connor",
      email: "l.oconnor@student.university.edu",
      role: "student",
      institutionId: "inst-northwestern",
      password: "Student@2026",
      createdAt: "2026-08-05T11:15:00Z",
    },
    {
      id: "usr-stud-rossi",
      name: "Isabella Rossi",
      email: "i.rossi@student.university.edu",
      role: "student",
      institutionId: "inst-northwestern",
      password: "Student@2026",
      createdAt: "2026-08-05T11:30:00Z",
    },
    {
      id: "usr-stud-takahashi",
      name: "Ethan Takahashi",
      email: "e.takahashi@student.university.edu",
      role: "student",
      institutionId: "inst-northwestern",
      password: "Student@2026",
      createdAt: "2026-08-05T12:00:00Z",
    },
    {
      id: "usr-stud-johnson",
      name: "Maya Johnson",
      email: "m.johnson@student.university.edu",
      role: "student",
      institutionId: "inst-northwestern",
      password: "Student@2026",
      createdAt: "2026-08-05T12:15:00Z",
    },
  ],
  sections: [
    {
      id: "sec-cse-a",
      sectionName: "CS-301: Algorithms & Data Structures (Sec A)",
      courseName: "B.S. Computer Science & Engineering",
      academicYear: "2026-2027",
      teacherId: "usr-faculty-vance",
      createdAt: "2026-08-01T09:00:00Z",
    },
    {
      id: "sec-cse-b",
      sectionName: "CS-402: Cloud Architecture & Distributed Systems (Sec B)",
      courseName: "B.S. Computer Science & Engineering",
      academicYear: "2026-2027",
      teacherId: "usr-faculty-vance",
      createdAt: "2026-08-01T09:00:00Z",
    },
    {
      id: "sec-it-a",
      sectionName: "IT-204: Relational Databases & Information Architecture",
      courseName: "B.S. Information Technology",
      academicYear: "2026-2027",
      teacherId: "usr-faculty-marcus",
      createdAt: "2026-08-01T09:00:00Z",
    },
  ],
  students: [
    {
      id: "stud-1",
      userId: "usr-stud-wright",
      name: "Alexander Wright",
      email: "a.wright@student.university.edu",
      rollNumber: "2024-CS-001",
      sectionId: "sec-cse-a",
      projectGroupId: "grp-veritas",
      createdAt: "2026-08-10T10:00:00Z",
    },
    {
      id: "stud-2",
      userId: "usr-stud-martinez",
      name: "Sophia Martinez",
      email: "s.martinez@student.university.edu",
      rollNumber: "2024-CS-002",
      sectionId: "sec-cse-a",
      projectGroupId: "grp-veritas",
      createdAt: "2026-08-10T10:00:00Z",
    },
    {
      id: "stud-3",
      userId: "usr-stud-chen",
      name: "Marcus Chen",
      email: "m.chen@student.university.edu",
      rollNumber: "2024-CS-003",
      sectionId: "sec-cse-a",
      projectGroupId: "grp-veritas",
      createdAt: "2026-08-10T10:00:00Z",
    },
    {
      id: "stud-4",
      userId: "usr-stud-patel",
      name: "Olivia Patel",
      email: "o.patel@student.university.edu",
      rollNumber: "2024-CS-004",
      sectionId: "sec-cse-a",
      projectGroupId: "grp-aegis",
      createdAt: "2026-08-10T10:00:00Z",
    },
    {
      id: "stud-5",
      userId: "usr-stud-oconnor",
      name: "Liam O'Connor",
      email: "l.oconnor@student.university.edu",
      rollNumber: "2024-CS-005",
      sectionId: "sec-cse-a",
      projectGroupId: "grp-aegis",
      createdAt: "2026-08-10T10:00:00Z",
    },
    {
      id: "stud-6",
      userId: "usr-stud-rossi",
      name: "Isabella Rossi",
      email: "i.rossi@student.university.edu",
      rollNumber: "2024-CS-006",
      sectionId: "sec-cse-a",
      projectGroupId: "grp-aegis",
      createdAt: "2026-08-10T10:00:00Z",
    },
    {
      id: "stud-7",
      userId: "usr-stud-takahashi",
      name: "Ethan Takahashi",
      email: "e.takahashi@student.university.edu",
      rollNumber: "2024-CS-010",
      sectionId: "sec-cse-b",
      createdAt: "2026-08-10T10:00:00Z",
    },
    {
      id: "stud-8",
      userId: "usr-stud-johnson",
      name: "Maya Johnson",
      email: "m.johnson@student.university.edu",
      rollNumber: "2024-CS-011",
      sectionId: "sec-cse-b",
      createdAt: "2026-08-10T10:00:00Z",
    },
  ],
  marks: [
    {
      id: "mark-1",
      studentId: "stud-1",
      sectionId: "sec-cse-a",
      internalMarks: 18,
      labRecordMarks: 19,
      practicalMarks: 17,
      projectMarks: 18,
      assignmentMarks: 18,
      total: 72,
      maxTotal: 80,
      updatedBy: "Dr. Eleanor Vance, Ph.D.",
      updatedAt: "2026-11-10T14:30:00Z",
    },
    {
      id: "mark-2",
      studentId: "stud-2",
      sectionId: "sec-cse-a",
      internalMarks: 19,
      labRecordMarks: 20,
      practicalMarks: 18,
      projectMarks: 19,
      assignmentMarks: 20,
      total: 76,
      maxTotal: 80,
      updatedBy: "Dr. Eleanor Vance, Ph.D.",
      updatedAt: "2026-11-10T14:30:00Z",
    },
    {
      id: "mark-3",
      studentId: "stud-3",
      sectionId: "sec-cse-a",
      internalMarks: 17,
      labRecordMarks: 18,
      practicalMarks: 18,
      projectMarks: 19,
      assignmentMarks: 17,
      total: 72,
      maxTotal: 80,
      updatedBy: "Dr. Eleanor Vance, Ph.D.",
      updatedAt: "2026-11-10T14:30:00Z",
    },
    {
      id: "mark-4",
      studentId: "stud-4",
      sectionId: "sec-cse-a",
      internalMarks: 18,
      labRecordMarks: 19,
      practicalMarks: 19,
      projectMarks: 17,
      assignmentMarks: 18,
      total: 73,
      maxTotal: 80,
      updatedBy: "Dr. Eleanor Vance, Ph.D.",
      updatedAt: "2026-11-10T14:30:00Z",
    },
    {
      id: "mark-5",
      studentId: "stud-5",
      sectionId: "sec-cse-a",
      internalMarks: 16,
      labRecordMarks: 17,
      practicalMarks: 16,
      projectMarks: 18,
      assignmentMarks: 16,
      total: 67,
      maxTotal: 80,
      updatedBy: "Dr. Eleanor Vance, Ph.D.",
      updatedAt: "2026-11-10T14:30:00Z",
    },
    {
      id: "mark-6",
      studentId: "stud-6",
      sectionId: "sec-cse-a",
      internalMarks: 20,
      labRecordMarks: 19,
      practicalMarks: 18,
      projectMarks: 18,
      assignmentMarks: 19,
      total: 75,
      maxTotal: 80,
      updatedBy: "Dr. Eleanor Vance, Ph.D.",
      updatedAt: "2026-11-10T14:30:00Z",
    },
    {
      id: "mark-7",
      studentId: "stud-7",
      sectionId: "sec-cse-b",
      internalMarks: 17,
      labRecordMarks: 17,
      practicalMarks: 18,
      projectMarks: 17,
      assignmentMarks: 17,
      total: 69,
      maxTotal: 80,
      updatedBy: "Dr. Eleanor Vance, Ph.D.",
      updatedAt: "2026-11-10T14:30:00Z",
    },
    {
      id: "mark-8",
      studentId: "stud-8",
      sectionId: "sec-cse-b",
      internalMarks: 18,
      labRecordMarks: 18,
      practicalMarks: 17,
      projectMarks: 19,
      assignmentMarks: 18,
      total: 72,
      maxTotal: 80,
      updatedBy: "Dr. Eleanor Vance, Ph.D.",
      updatedAt: "2026-11-10T14:30:00Z",
    },
  ],
  projectGroups: [
    {
      id: "grp-veritas",
      groupName: "Team Veritas",
      projectTitle: "Veritas: Fault-Tolerant Distributed Key-Value Store",
      sectionId: "sec-cse-a",
      projectDescription:
        "High-performance Raft consensus engine with log compaction, persistent WAL storage, and snapshot replication.",
      guide: "Dr. Eleanor Vance, Ph.D.",
      status: "In Progress",
      projectMarks: 18,
      maxProjectMarks: 20,
      approvedBy: "Dr. Eleanor Vance, Ph.D.",
      members: [
        {
          studentId: "stud-1",
          studentName: "Alexander Wright",
          rollNumber: "2024-CS-001",
          role: "Leader",
        },
        {
          studentId: "stud-2",
          studentName: "Sophia Martinez",
          rollNumber: "2024-CS-002",
          role: "Member",
        },
        {
          studentId: "stud-3",
          studentName: "Marcus Chen",
          rollNumber: "2024-CS-003",
          role: "Member",
        },
      ],
      createdAt: "2026-09-01T10:00:00Z",
      updatedAt: "2026-11-05T12:00:00Z",
    },
    {
      id: "grp-aegis",
      groupName: "Team AegisFlow",
      projectTitle: "AegisFlow: Real-Time Stream Processing & Telemetry Pipeline",
      sectionId: "sec-cse-a",
      projectDescription:
        "Distributed event-driven pipeline utilizing WebSockets, Apache Kafka connector, and time-series anomaly detection.",
      guide: "Dr. Eleanor Vance, Ph.D.",
      status: "In Progress",
      projectMarks: 19,
      maxProjectMarks: 20,
      approvedBy: "Dr. Eleanor Vance, Ph.D.",
      members: [
        {
          studentId: "stud-4",
          studentName: "Olivia Patel",
          rollNumber: "2024-CS-004",
          role: "Leader",
        },
        {
          studentId: "stud-5",
          studentName: "Liam O'Connor",
          rollNumber: "2024-CS-005",
          role: "Member",
        },
        {
          studentId: "stud-6",
          studentName: "Isabella Rossi",
          rollNumber: "2024-CS-006",
          role: "Member",
        },
      ],
      createdAt: "2026-09-02T11:00:00Z",
      updatedAt: "2026-11-06T13:00:00Z",
    },
  ],
  groupRequests: [
    {
      id: "req-1",
      studentId: "stud-7",
      studentName: "Ethan Takahashi",
      proposedGroupName: "Team CloudSync",
      proposedProjectTitle: "CRDT-Based Offline Peer-to-Peer Document Collaboration",
      proposedMembers: ["Ethan Takahashi", "Maya Johnson"],
      sectionId: "sec-cse-b",
      status: "Pending",
      createdAt: "2026-11-11T16:20:00Z",
    },
  ],
  assignments: [
    {
      id: "asg-1",
      title: "Distributed Consensus & Raft Protocol Implementation",
      subject: "Cloud Architecture & Systems",
      description:
        "Implement Raft leader election, heartbeats, and log replication test scenarios against network partitions.",
      sectionId: "sec-cse-a",
      deadline: "2026-11-20",
      status: "Active",
      createdBy: "Dr. Eleanor Vance, Ph.D.",
      createdAt: "2026-11-01T10:00:00Z",
    },
    {
      id: "asg-2",
      title: "Cache-Oblivious B-Tree & Concurrency Benchmarking",
      subject: "Advanced Data Structures",
      description:
        "Implement concurrent lock-free skip lists and cache-oblivious B-Trees; benchmark throughput under heavy write loads.",
      sectionId: "sec-cse-a",
      deadline: "2026-11-25",
      status: "Active",
      createdBy: "Dr. Eleanor Vance, Ph.D.",
      createdAt: "2026-11-04T11:30:00Z",
    },
    {
      id: "asg-3",
      title: "Microservices Containerization & Helm Deployment",
      subject: "Distributed Systems Lab",
      description:
        "Architect a three-tier microservice architecture with API Gateway, auth service, and message queue deployment manifests.",
      sectionId: "sec-cse-b",
      deadline: "2026-11-28",
      status: "Active",
      createdBy: "Dr. Eleanor Vance, Ph.D.",
      createdAt: "2026-11-08T09:00:00Z",
    },
  ],
  announcements: [
    {
      id: "ann-1",
      title: "Mid-Term Examination & Lab Record Verification Schedule",
      message:
        "Continuous evaluation submissions for CS-301 Section A are due by Friday. Verify signed lab registers with faculty advisors.",
      sectionId: "sec-cse-a",
      teacherName: "Dr. Eleanor Vance, Ph.D.",
      createdAt: "2026-11-12T08:30:00Z",
      priority: "important",
    },
    {
      id: "ann-2",
      title: "Phase-1 Capstone Architecture Defense Next Wednesday",
      message:
        "All project groups must submit GitHub repository links and deliver an 8-minute system architecture presentation.",
      sectionId: "sec-cse-a",
      teacherName: "Dr. Eleanor Vance, Ph.D.",
      createdAt: "2026-11-10T11:00:00Z",
      priority: "normal",
    },
    {
      id: "ann-3",
      title: "Section B: Assignment 3 Infrastructure Specification Uploaded",
      message:
        "Container definitions and Kubernetes deployment specifications are available on the department repository.",
      sectionId: "sec-cse-b",
      teacherName: "Dr. Eleanor Vance, Ph.D.",
      createdAt: "2026-11-09T14:15:00Z",
      priority: "normal",
    },
  ],
  activityLogs: [
    {
      id: "act-1",
      action: "Marks Updated",
      description: "Recorded Continuous Evaluation marks for CS-301 Section A.",
      timestamp: "2026-11-10T14:30:00Z",
      type: "marks",
    },
    {
      id: "act-2",
      action: "Capstone Proposal Approved",
      description:
        "Approved Team AegisFlow capstone proposal: Real-Time Stream Processing Pipeline.",
      timestamp: "2026-11-06T13:00:00Z",
      type: "project",
    },
    {
      id: "act-3",
      action: "Assignment Published",
      description: "Published Distributed Consensus & Raft Protocol assignment for CS-301.",
      timestamp: "2026-11-01T10:00:00Z",
      type: "assignment",
    },
  ],
};

class CollegeDatabase {
  private state: DatabaseState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }

  private loadState(): DatabaseState {
    if (!this.isBrowser()) {
      return JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure all required collections exist
        return {
          ...INITIAL_DEMO_DATA,
          ...parsed,
        };
      }
    } catch (e) {
      console.warn("Failed to load state from localStorage:", e);
    }

    // Initialize with demo data
    const initial = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
    this.saveState(initial);
    return initial;
  }

  private saveState(state: DatabaseState): void {
    this.state = state;
    if (this.isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error("Failed to save state to localStorage:", e);
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
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error("Database listener error:", err);
      }
    });
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public resetToDefault(): void {
    this.saveState(JSON.parse(JSON.stringify(INITIAL_DEMO_DATA)));
  }

  public addActivity(action: string, description: string, type: ActivityLog["type"]): void {
    const newLog: ActivityLog = {
      id: "act-" + Date.now(),
      action,
      description,
      timestamp: new Date().toISOString(),
      type,
    };
    const updatedLogs = [newLog, ...this.state.activityLogs].slice(0, 30);
    this.saveState({
      ...this.state,
      activityLogs: updatedLogs,
    });
  }

  // --- Users & Auth ---
  public getUsers(): User[] {
    return this.state.users;
  }

  public getUserByEmail(email: string): User | undefined {
    return this.state.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  public getUserById(id: string): User | undefined {
    return this.state.users.find((u) => u.id === id);
  }

  public addUser(user: Omit<User, "id" | "createdAt">): User {
    const newUser: User = {
      ...user,
      id: "usr-" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    this.saveState({
      ...this.state,
      users: [...this.state.users, newUser],
    });
    return newUser;
  }

  // --- Sections ---
  public getSections(): Section[] {
    return this.state.sections;
  }

  public getSectionById(id: string): Section | undefined {
    return this.state.sections.find((s) => s.id === id);
  }

  public createSection(data: {
    sectionName: string;
    courseName: string;
    academicYear: string;
    teacherId: string;
  }): Section {
    const newSection: Section = {
      id: "sec-" + Date.now(),
      sectionName: data.sectionName.trim(),
      courseName: data.courseName.trim(),
      academicYear: data.academicYear.trim(),
      teacherId: data.teacherId,
      createdAt: new Date().toISOString(),
    };
    this.saveState({
      ...this.state,
      sections: [...this.state.sections, newSection],
    });
    this.addActivity("Section Created", `Created section "${newSection.sectionName}".`, "section");
    return newSection;
  }

  public updateSection(id: string, updates: Partial<Section>): Section | null {
    const index = this.state.sections.findIndex((s) => s.id === id);
    if (index === -1) return null;
    const current = this.state.sections[index];
    if (!current) return null;
    const updated: Section = { ...current, ...updates, updatedAt: new Date().toISOString() };
    const newSections = [...this.state.sections];
    newSections[index] = updated;
    this.saveState({ ...this.state, sections: newSections });
    this.addActivity("Section Updated", `Updated section "${updated.sectionName}".`, "section");
    return updated;
  }

  public deleteSection(id: string): boolean {
    const section = this.getSectionById(id);
    if (!section) return false;

    // Remove students, marks, assignments, groups belonging to this section
    const newSections = this.state.sections.filter((s) => s.id !== id);
    const newStudents = this.state.students.filter((st) => st.sectionId !== id);
    const newMarks = this.state.marks.filter((m) => m.sectionId !== id);
    const newAssignments = this.state.assignments.filter((a) => a.sectionId !== id);
    const newGroups = this.state.projectGroups.filter((g) => g.sectionId !== id);
    const newRequests = this.state.groupRequests.filter((r) => r.sectionId !== id);
    const newAnnouncements = this.state.announcements.filter((a) => a.sectionId !== id);

    this.saveState({
      ...this.state,
      sections: newSections,
      students: newStudents,
      marks: newMarks,
      assignments: newAssignments,
      projectGroups: newGroups,
      groupRequests: newRequests,
      announcements: newAnnouncements,
    });
    this.addActivity("Section Deleted", `Deleted section "${section.sectionName}".`, "section");
    return true;
  }

  // --- Students ---
  public getStudents(sectionId?: string): Student[] {
    if (sectionId) {
      return this.state.students.filter((s) => s.sectionId === sectionId);
    }
    return this.state.students;
  }

  public getStudentById(id: string): Student | undefined {
    return this.state.students.find((s) => s.id === id);
  }

  public getStudentByUserId(userId: string): Student | undefined {
    return this.state.students.find((s) => s.userId === userId);
  }

  public addStudent(data: {
    name: string;
    email: string;
    rollNumber: string;
    sectionId: string;
    projectGroupId?: string;
  }): Student {
    // Also create or find user record
    let user = this.getUserByEmail(data.email);
    if (!user) {
      user = this.addUser({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        role: "student",
      });
    }

    const newStudent: Student = {
      id: "stud-" + Date.now() + Math.floor(Math.random() * 1000),
      userId: user.id,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      rollNumber: data.rollNumber.trim(),
      sectionId: data.sectionId,
      projectGroupId: data.projectGroupId,
      createdAt: new Date().toISOString(),
    };

    // Initialize blank marks record for student
    const newMarks: StudentMarks = {
      id: "mark-" + Date.now() + Math.floor(Math.random() * 1000),
      studentId: newStudent.id,
      sectionId: newStudent.sectionId,
      internalMarks: 0,
      labRecordMarks: 0,
      practicalMarks: 0,
      projectMarks: 0,
      assignmentMarks: 0,
      total: 0,
      maxTotal: 80,
      updatedBy: "System",
      updatedAt: new Date().toISOString(),
    };

    this.saveState({
      ...this.state,
      students: [...this.state.students, newStudent],
      marks: [...this.state.marks, newMarks],
    });

    this.addActivity(
      "Student Added",
      `Added student ${newStudent.name} (Roll ${newStudent.rollNumber}).`,
      "student",
    );
    return newStudent;
  }

  public updateStudent(id: string, updates: Partial<Student>): Student | null {
    const index = this.state.students.findIndex((s) => s.id === id);
    if (index === -1) return null;
    const current = this.state.students[index];
    if (!current) return null;
    const updated: Student = { ...current, ...updates, updatedAt: new Date().toISOString() };
    const newStudents = [...this.state.students];
    newStudents[index] = updated;

    // Also update associated user if name or email changed
    if (updates.name || updates.email) {
      const uIndex = this.state.users.findIndex((u) => u.id === current.userId);
      const currentUser = uIndex !== -1 ? this.state.users[uIndex] : undefined;
      if (uIndex !== -1 && currentUser) {
        const updatedUsers = [...this.state.users];
        const updatedUser: User = {
          ...currentUser,
          name: updates.name ?? currentUser.name,
          email: updates.email ?? currentUser.email,
          updatedAt: new Date().toISOString(),
        };
        updatedUsers[uIndex] = updatedUser;
        this.state.users = updatedUsers;
      }
    }

    this.saveState({ ...this.state, students: newStudents });
    this.addActivity("Student Updated", `Updated details for ${updated.name}.`, "student");
    return updated;
  }

  public deleteStudent(id: string): boolean {
    const student = this.getStudentById(id);
    if (!student) return false;

    // Remove student, marks, and remove from any project groups
    const newStudents = this.state.students.filter((s) => s.id !== id);
    const newMarks = this.state.marks.filter((m) => m.studentId !== id);

    // Remove from groups
    const newGroups = this.state.projectGroups.map((group) => {
      const hasMember = group.members.some((m) => m.studentId === id);
      if (!hasMember) return group;
      return {
        ...group,
        members: group.members.filter((m) => m.studentId !== id),
      };
    });

    this.saveState({
      ...this.state,
      students: newStudents,
      marks: newMarks,
      projectGroups: newGroups,
    });

    this.addActivity("Student Removed", `Removed student ${student.name} from records.`, "student");
    return true;
  }

  // --- Marks & Results ---
  public getMarks(sectionId?: string): StudentMarks[] {
    if (sectionId) {
      return this.state.marks.filter((m) => m.sectionId === sectionId);
    }
    return this.state.marks;
  }

  public getStudentMarks(studentId: string): StudentMarks | undefined {
    return this.state.marks.find((m) => m.studentId === studentId);
  }

  public updateStudentMarks(
    studentId: string,
    marksUpdate: Partial<Omit<StudentMarks, "id" | "studentId" | "sectionId" | "total">>,
    updatedBy: string,
  ): StudentMarks | null {
    const student = this.getStudentById(studentId);
    if (!student) return null;

    let markRecord = this.state.marks.find((m) => m.studentId === studentId);
    const newMarksList = [...this.state.marks];

    if (!markRecord) {
      markRecord = {
        id: "mark-" + Date.now(),
        studentId,
        sectionId: student.sectionId,
        internalMarks: 0,
        labRecordMarks: 0,
        practicalMarks: 0,
        projectMarks: 0,
        assignmentMarks: 0,
        total: 0,
        maxTotal: 80,
        updatedBy,
        updatedAt: new Date().toISOString(),
      };
      newMarksList.push(markRecord);
    }

    // Clamp marks to positive integers within reasonable boundary (max 20 default per field)
    const sanitize = (val: number | undefined, currentVal: number, maxVal = 20) => {
      if (val === undefined || isNaN(val)) return currentVal;
      return Math.max(0, Math.min(maxVal, Math.round(val)));
    };

    const internal = sanitize(marksUpdate.internalMarks, markRecord.internalMarks);
    const lab = sanitize(marksUpdate.labRecordMarks, markRecord.labRecordMarks);
    const practical = sanitize(marksUpdate.practicalMarks, markRecord.practicalMarks);
    const project = sanitize(marksUpdate.projectMarks, markRecord.projectMarks);
    const assignment = sanitize(marksUpdate.assignmentMarks, markRecord.assignmentMarks);

    // Auto calculate total
    const total = internal + lab + practical + project; // 4 core components = 80 max

    const updatedRecord: StudentMarks = {
      ...markRecord,
      internalMarks: internal,
      labRecordMarks: lab,
      practicalMarks: practical,
      projectMarks: project,
      assignmentMarks: assignment,
      total,
      maxTotal: marksUpdate.maxTotal ?? markRecord.maxTotal ?? 80,
      updatedBy,
      updatedAt: new Date().toISOString(),
    };

    const index = newMarksList.findIndex((m) => m.studentId === studentId);
    newMarksList[index] = updatedRecord;

    this.saveState({
      ...this.state,
      marks: newMarksList,
    });

    this.addActivity(
      "Marks Updated",
      `Updated academic marks for ${student.name} (Total: ${total}/80).`,
      "marks",
    );
    return updatedRecord;
  }

  // --- Project Groups ---
  public getProjectGroups(sectionId?: string): ProjectGroup[] {
    if (sectionId) {
      return this.state.projectGroups.filter((g) => g.sectionId === sectionId);
    }
    return this.state.projectGroups;
  }

  public getProjectGroupById(id: string): ProjectGroup | undefined {
    return this.state.projectGroups.find((g) => g.id === id);
  }

  public createProjectGroup(data: {
    groupName: string;
    projectTitle: string;
    sectionId: string;
    projectDescription?: string;
    guide?: string;
    projectMarks?: number;
    approvedBy: string;
    memberStudentIds: string[];
  }): ProjectGroup {
    const members: ProjectGroupMember[] = data.memberStudentIds
      .map((sId) => {
        const student = this.getStudentById(sId);
        if (!student) return null;
        return {
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          role: "Member" as const,
        };
      })
      .filter(Boolean) as ProjectGroupMember[];

    const firstMember = members[0];
    if (firstMember) {
      firstMember.role = "Leader";
    }

    const newGroup: ProjectGroup = {
      id: "grp-" + Date.now(),
      groupName: data.groupName.trim(),
      projectTitle: data.projectTitle.trim(),
      sectionId: data.sectionId,
      projectDescription: data.projectDescription?.trim() || "No description provided.",
      guide: data.guide?.trim() || "Faculty Advisor",
      status: "In Progress",
      projectMarks: data.projectMarks ?? 0,
      maxProjectMarks: 20,
      approvedBy: data.approvedBy,
      members,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update students to point to this group
    const updatedStudents = this.state.students.map((s) => {
      if (data.memberStudentIds.includes(s.id)) {
        return { ...s, projectGroupId: newGroup.id };
      }
      return s;
    });

    this.saveState({
      ...this.state,
      projectGroups: [...this.state.projectGroups, newGroup],
      students: updatedStudents,
    });

    this.addActivity(
      "Project Group Created",
      `Created project group "${newGroup.groupName}".`,
      "project",
    );
    return newGroup;
  }

  public updateProjectGroup(id: string, updates: Partial<ProjectGroup>): ProjectGroup | null {
    const index = this.state.projectGroups.findIndex((g) => g.id === id);
    if (index === -1) return null;

    const current = this.state.projectGroups[index];
    if (!current) return null;
    const updated: ProjectGroup = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const newGroups = [...this.state.projectGroups];
    newGroups[index] = updated;

    this.saveState({
      ...this.state,
      projectGroups: newGroups,
    });

    this.addActivity(
      "Project Group Updated",
      `Updated group details for "${updated.groupName}".`,
      "project",
    );
    return updated;
  }

  public deleteProjectGroup(id: string): boolean {
    const group = this.getProjectGroupById(id);
    if (!group) return false;

    // Reset student projectGroupId
    const updatedStudents = this.state.students.map((s) => {
      if (s.projectGroupId === id) {
        return { ...s, projectGroupId: undefined };
      }
      return s;
    });

    const newGroups = this.state.projectGroups.filter((g) => g.id !== id);

    this.saveState({
      ...this.state,
      projectGroups: newGroups,
      students: updatedStudents,
    });

    this.addActivity(
      "Project Group Deleted",
      `Deleted project group "${group.groupName}".`,
      "project",
    );
    return true;
  }

  // --- Student Group Proposals / Requests ---
  public getGroupRequests(sectionId?: string): GroupRequest[] {
    if (sectionId) {
      return this.state.groupRequests.filter((r) => r.sectionId === sectionId);
    }
    return this.state.groupRequests;
  }

  public submitGroupRequest(data: {
    studentId: string;
    studentName: string;
    proposedGroupName: string;
    proposedProjectTitle: string;
    proposedMembers: string[];
    sectionId: string;
  }): GroupRequest {
    const newRequest: GroupRequest = {
      id: "req-" + Date.now(),
      studentId: data.studentId,
      studentName: data.studentName,
      proposedGroupName: data.proposedGroupName.trim(),
      proposedProjectTitle: data.proposedProjectTitle.trim(),
      proposedMembers: data.proposedMembers,
      sectionId: data.sectionId,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    this.saveState({
      ...this.state,
      groupRequests: [newRequest, ...this.state.groupRequests],
    });

    this.addActivity(
      "Group Proposal Submitted",
      `${data.studentName} proposed group "${data.proposedGroupName}".`,
      "project",
    );
    return newRequest;
  }

  public reviewGroupRequest(
    requestId: string,
    status: "Approved" | "Rejected",
    reviewerName: string,
    feedback?: string,
  ): boolean {
    const request = this.state.groupRequests.find((r) => r.id === requestId);
    if (!request) return false;

    const updatedRequests = this.state.groupRequests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status,
          reviewedBy: reviewerName,
          feedback,
        };
      }
      return r;
    });

    const newGroups = [...this.state.projectGroups];
    let updatedStudents = [...this.state.students];

    // If approved, create the official ProjectGroup!
    if (status === "Approved") {
      // Find students in this section that match the members
      const matchingStudentIds: string[] = [];

      // Requesting student
      if (request.studentId) {
        matchingStudentIds.push(request.studentId);
      }

      // Check other proposed members by name, email, userId, or roll number in the same section
      request.proposedMembers.forEach((memberName) => {
        const query = memberName.trim().toLowerCase();
        const found = this.state.students.find(
          (s) =>
            s.sectionId === request.sectionId &&
            (s.name.toLowerCase() === query ||
              s.email.toLowerCase() === query ||
              s.id.toLowerCase() === query ||
              s.userId.toLowerCase() === query ||
              s.rollNumber.toLowerCase() === query ||
              `roll ${s.rollNumber}`.toLowerCase() === query ||
              query.includes(s.email.toLowerCase()) ||
              query.includes(s.name.toLowerCase())),
        );
        if (found && !matchingStudentIds.includes(found.id)) {
          matchingStudentIds.push(found.id);
        }
      });

      const members: ProjectGroupMember[] = matchingStudentIds
        .map((sId, index) => {
          const student = this.getStudentById(sId);
          if (!student) return null;
          return {
            studentId: student.id,
            studentName: student.name,
            rollNumber: student.rollNumber,
            role: index === 0 ? "Leader" : "Member",
          };
        })
        .filter(Boolean) as ProjectGroupMember[];

      const createdGroup: ProjectGroup = {
        id: "grp-" + Date.now(),
        groupName: request.proposedGroupName,
        projectTitle: request.proposedProjectTitle,
        sectionId: request.sectionId,
        projectDescription: "Approved student proposal: " + request.proposedProjectTitle,
        guide: reviewerName,
        status: "In Progress",
        projectMarks: 0,
        maxProjectMarks: 20,
        approvedBy: reviewerName,
        members,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      newGroups.push(createdGroup);

      // Link students to this group
      updatedStudents = updatedStudents.map((s) => {
        if (matchingStudentIds.includes(s.id)) {
          return { ...s, projectGroupId: createdGroup.id };
        }
        return s;
      });
    }

    this.saveState({
      ...this.state,
      groupRequests: updatedRequests,
      projectGroups: newGroups,
      students: updatedStudents,
    });

    this.addActivity(
      status === "Approved" ? "Group Request Approved" : "Group Request Rejected",
      `${reviewerName} ${status.toLowerCase()} request for "${request.proposedGroupName}".`,
      "project",
    );

    return true;
  }

  // --- Assignments ---
  public getAssignments(sectionId?: string): Assignment[] {
    if (sectionId) {
      return this.state.assignments.filter((a) => a.sectionId === sectionId);
    }
    return this.state.assignments;
  }

  public createAssignment(data: {
    title: string;
    subject: string;
    description: string;
    sectionId: string;
    deadline: string;
    createdBy: string;
  }): Assignment {
    const newAssignment: Assignment = {
      id: "asg-" + Date.now(),
      title: data.title.trim(),
      subject: data.subject.trim(),
      description: data.description.trim(),
      sectionId: data.sectionId,
      deadline: data.deadline,
      status: "Active",
      createdBy: data.createdBy,
      createdAt: new Date().toISOString(),
    };

    this.saveState({
      ...this.state,
      assignments: [newAssignment, ...this.state.assignments],
    });

    this.addActivity(
      "Assignment Created",
      `Created assignment "${newAssignment.title}".`,
      "assignment",
    );
    return newAssignment;
  }

  public updateAssignment(id: string, updates: Partial<Assignment>): Assignment | null {
    const index = this.state.assignments.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const current = this.state.assignments[index];
    if (!current) return null;

    const updated: Assignment = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const newAssignments = [...this.state.assignments];
    newAssignments[index] = updated;

    this.saveState({
      ...this.state,
      assignments: newAssignments,
    });

    this.addActivity("Assignment Updated", `Updated assignment "${updated.title}".`, "assignment");
    return updated;
  }

  public deleteAssignment(id: string): boolean {
    const assignment = this.state.assignments.find((a) => a.id === id);
    if (!assignment) return false;

    this.saveState({
      ...this.state,
      assignments: this.state.assignments.filter((a) => a.id !== id),
    });

    this.addActivity(
      "Assignment Deleted",
      `Deleted assignment "${assignment.title}".`,
      "assignment",
    );
    return true;
  }

  // --- Announcements ---
  public getAnnouncements(sectionId?: string): Announcement[] {
    if (sectionId) {
      return this.state.announcements.filter((a) => a.sectionId === sectionId);
    }
    return this.state.announcements;
  }

  public createAnnouncement(data: {
    title: string;
    message: string;
    sectionId: string;
    teacherName: string;
    priority?: "normal" | "important";
  }): Announcement {
    const newAnnouncement: Announcement = {
      id: "ann-" + Date.now(),
      title: data.title.trim(),
      message: data.message.trim(),
      sectionId: data.sectionId,
      teacherName: data.teacherName,
      createdAt: new Date().toISOString(),
      priority: data.priority || "normal",
    };

    this.saveState({
      ...this.state,
      announcements: [newAnnouncement, ...this.state.announcements],
    });

    return newAnnouncement;
  }

  public deleteAnnouncement(id: string): boolean {
    this.saveState({
      ...this.state,
      announcements: this.state.announcements.filter((a) => a.id !== id),
    });
    return true;
  }
}

export const db = new CollegeDatabase();
