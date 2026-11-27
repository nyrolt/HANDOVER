import React, { useState } from "react";
import { Sidebar, type TeacherTab, type StudentTab } from "./Sidebar";
import { Header } from "./Header";
import { useAuth } from "@/services/auth";
import { db } from "@/services/db";
import { AddStudentModal } from "@/components/common/AddStudentModal";

// Teacher Views
import { TeacherOverview } from "@/components/teacher/TeacherOverview";
import { StudentSpreadsheet } from "@/components/teacher/StudentSpreadsheet";
import { SectionManager } from "@/components/teacher/SectionManager";
import { MarksManager } from "@/components/teacher/MarksManager";
import { GroupProjectsManager } from "@/components/teacher/GroupProjectsManager";
import { AssignmentManager } from "@/components/teacher/AssignmentManager";
import { TeacherReports } from "@/components/teacher/TeacherReports";
import { TeacherAnnouncements } from "@/components/teacher/TeacherAnnouncements";

// Student Views
import { StudentOverview } from "@/components/student/StudentOverview";
import { StudentAssignments } from "@/components/student/StudentAssignments";
import { StudentGroupProject } from "@/components/student/StudentGroupProject";
import { StudentMarks } from "@/components/student/StudentMarks";
import { StudentAnnouncements } from "@/components/student/StudentAnnouncements";
import { StudentProfile } from "@/components/student/StudentProfile";

export function AppLayout() {
  const { user, isTeacher, isStudent, studentProfile } = useAuth();

  // Tab State
  const [teacherTab, setTeacherTab] = useState<TeacherTab>("overview");
  const [studentTab, setStudentTab] = useState<StudentTab>("overview");
  const [targetSpreadsheetSectionId, setTargetSpreadsheetSectionId] = useState<string | undefined>(
    undefined,
  );

  // Global modals
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [addStudentSectionId, setAddStudentSectionId] = useState<string | undefined>(undefined);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Mobile menu drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const pendingApprovalsCount = db.getGroupRequests().filter((r) => r.status === "Pending").length;
  const activeAssignmentsCount = studentProfile
    ? db.getAssignments(studentProfile.sectionId).filter((a) => a.status === "Active").length
    : 0;

  // Title mapping
  const getTeacherTitle = (tab: TeacherTab) => {
    switch (tab) {
      case "overview":
        return "Teacher Workspace Overview";
      case "students":
        return "Students Spreadsheet & Marksheet";
      case "sections":
        return "Class & Section Management";
      case "assignments":
        return "Coursework & Assignments";
      case "groups":
        return "Project Groups & Student Proposals";
      case "marks":
        return "Marks & Academic Results Gradebook";
      case "reports":
        return "Academic Performance Reports";
      case "announcements":
        return "Class Announcements";
    }
  };

  const getStudentTitle = (tab: StudentTab) => {
    switch (tab) {
      case "overview":
        return "Student Academic Dashboard";
      case "assignments":
        return "My Course Assignments";
      case "group":
        return "My Project Group";
      case "marks":
        return "My Academic Marksheet";
      case "announcements":
        return "Teacher Notices & Bulletins";
      case "profile":
        return "Student Profile";
    }
  };

  const pageTitle = isTeacher ? getTeacherTitle(teacherTab) : getStudentTitle(studentTab);

  const handleTeacherNavigate = (tab: string, sectionId?: string) => {
    setTeacherTab(tab as TeacherTab);
    if (sectionId) {
      setTargetSpreadsheetSectionId(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentTitle={pageTitle}
        onSearch={teacherTab === "students" ? (q) => setSearchQuery(q) : undefined}
        searchQuery={searchQuery}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        isMobileMenuOpen={mobileMenuOpen}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          role={user.role}
          activeTab={isTeacher ? teacherTab : studentTab}
          onTabChange={(tab) => {
            if (isTeacher) setTeacherTab(tab as TeacherTab);
            else setStudentTab(tab as StudentTab);
            setMobileMenuOpen(false);
          }}
          pendingApprovalsCount={pendingApprovalsCount}
          activeAssignmentsCount={activeAssignmentsCount}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Dynamic Content Pane */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0 max-w-7xl mx-auto w-full space-y-6">
          {isTeacher ? (
            <>
              {teacherTab === "overview" && (
                <TeacherOverview
                  onNavigate={handleTeacherNavigate}
                  onOpenAddStudent={() => {
                    setAddStudentSectionId(undefined);
                    setAddStudentOpen(true);
                  }}
                  onOpenCreateSection={() => setTeacherTab("sections")}
                  onOpenCreateAssignment={() => setTeacherTab("assignments")}
                />
              )}

              {teacherTab === "students" && (
                <StudentSpreadsheet
                  initialSectionId={targetSpreadsheetSectionId}
                  onOpenAddStudent={() => {
                    setAddStudentSectionId(targetSpreadsheetSectionId);
                    setAddStudentOpen(true);
                  }}
                />
              )}

              {teacherTab === "sections" && (
                <SectionManager
                  onOpenSpreadsheetForSection={(secId) => {
                    setTargetSpreadsheetSectionId(secId);
                    setTeacherTab("students");
                  }}
                  onOpenAddStudent={(secId) => {
                    setAddStudentSectionId(secId);
                    setAddStudentOpen(true);
                  }}
                />
              )}

              {teacherTab === "assignments" && <AssignmentManager />}

              {teacherTab === "groups" && <GroupProjectsManager />}

              {teacherTab === "marks" && <MarksManager />}

              {teacherTab === "reports" && <TeacherReports />}

              {teacherTab === "announcements" && <TeacherAnnouncements />}
            </>
          ) : (
            <>
              {studentProfile ? (
                <>
                  {studentTab === "overview" && (
                    <StudentOverview
                      student={studentProfile}
                      onNavigate={(tab) => setStudentTab(tab as StudentTab)}
                    />
                  )}

                  {studentTab === "assignments" && <StudentAssignments student={studentProfile} />}

                  {studentTab === "group" && <StudentGroupProject student={studentProfile} />}

                  {studentTab === "marks" && <StudentMarks student={studentProfile} />}

                  {studentTab === "announcements" && (
                    <StudentAnnouncements student={studentProfile} />
                  )}

                  {studentTab === "profile" && <StudentProfile student={studentProfile} />}
                </>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
                  <p>Loading student profile...</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Add Student Modal */}
      <AddStudentModal
        open={addStudentOpen}
        onClose={() => setAddStudentOpen(false)}
        defaultSectionId={addStudentSectionId}
      />
    </div>
  );
}
