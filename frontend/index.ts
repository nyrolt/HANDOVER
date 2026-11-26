// Centralized Frontend Module Entrypoint
export * from "./src/components/layout/AppLayout";
export * from "./src/components/layout/Header";
export * from "./src/components/layout/Sidebar";

export * from "./src/components/teacher/TeacherOverview";
export * from "./src/components/teacher/StudentSpreadsheet";
export * from "./src/components/teacher/SectionManager";
export * from "./src/components/teacher/AssignmentManager";
export * from "./src/components/teacher/GroupProjectsManager";
export * from "./src/components/teacher/MarksManager";
export * from "./src/components/teacher/TeacherAnnouncements";
export * from "./src/components/teacher/TeacherReports";

export * from "./src/components/student/StudentOverview";
export * from "./src/components/student/StudentMarks";
export * from "./src/components/student/StudentAssignments";
export * from "./src/components/student/StudentGroupProject";
export * from "./src/components/student/StudentAnnouncements";
export * from "./src/components/student/StudentProfile";

export * from "./src/components/common/AddStudentModal";
export * from "./src/hooks/use-mobile";
export * from "./src/services/api";
