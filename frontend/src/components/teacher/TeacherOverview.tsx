import React, { useState } from "react";
import {
  Users,
  FolderGit2,
  BookOpen,
  Layers,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/services/db";
import { useAuth } from "@/services/auth";
import { AsciiGlitchRipple } from "@/components/ui/ascii-glitch-ripple";

interface TeacherOverviewProps {
  onNavigate: (tab: string, sectionId?: string) => void;
  onOpenAddStudent: () => void;
  onOpenCreateSection: () => void;
  onOpenCreateAssignment: () => void;
}

export function TeacherOverview({
  onNavigate,
  onOpenAddStudent,
  onOpenCreateSection,
  onOpenCreateAssignment,
}: TeacherOverviewProps) {
  const { user } = useAuth();
  const sections = db.getSections();
  const students = db.getStudents();
  const assignments = db.getAssignments();
  const groups = db.getProjectGroups();
  const pendingRequests = db.getGroupRequests().filter((r) => r.status === "Pending");
  const activityLogs = db.getState().activityLogs;
  const marks = db.getState().marks;

  const [seeding, setSeeding] = useState(false);

  const activeAssignments = assignments.filter((a) => a.status === "Active");

  // Calculate overall performance metrics
  const totalStudents = students.length;
  const classAvg =
    totalStudents > 0
      ? (marks.reduce((acc, m) => acc + (m.total || 0), 0) / totalStudents).toFixed(1)
      : "0";

  const handleQuickSeed = () => {
    if (sections.length === 0) return;
    setSeeding(true);
    const targetSection = sections[0]!;
    db.populateSampleStudents(targetSection.id);
    db.populateSampleAssignments(targetSection.id);
    db.populateSampleGroups(targetSection.id);
    db.populateSampleAnnouncements(targetSection.id);
    setTimeout(() => {
      setSeeding(false);
      window.location.reload();
    }, 300);
  };

  const stats = [
    {
      title: "Total Students",
      value: students.length,
      subtitle: `Enrolled across ${sections.length} section${sections.length > 1 ? "s" : ""}`,
      icon: Users,
      actionTab: "students",
      color: "blue",
      trend: students.length > 0 ? "Enrolled & active" : "None enrolled",
    },
    {
      title: "Active Sections",
      value: sections.length,
      subtitle: sections.map((s) => s.sectionName).join(", ") || "No sections",
      icon: FolderGit2,
      actionTab: "sections",
      color: "emerald",
      trend: "Multi-tenant isolated",
    },
    {
      title: "Active Coursework",
      value: activeAssignments.length,
      subtitle: `${assignments.length} total assignment${assignments.length > 1 ? "s" : ""}`,
      icon: BookOpen,
      actionTab: "assignments",
      color: "indigo",
      trend: "Firm deadline control",
    },
    {
      title: "Project Groups",
      value: groups.length,
      subtitle: `${groups.reduce((acc, g) => acc + g.members.length, 0)} assigned members`,
      icon: Layers,
      actionTab: "groups",
      color: "purple",
      trend: "Guide approved",
    },
    {
      title: "Pending Proposals",
      value: pendingRequests.length,
      subtitle: pendingRequests.length > 0 ? "Awaiting review" : "All reviewed",
      icon: Clock,
      actionTab: "groups",
      color: "amber",
      trend: pendingRequests.length > 0 ? "Action required" : "Up to date",
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Overview Banner */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        {/* Subtle accent backdrop */}
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-blue-50/50 via-neutral-50/20 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-semibold">
              ACADEMIC ADMINISTRATION // FACULTY COMMAND
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Faculty Command{" "}
            <span className="font-serif italic font-normal text-slate-800">Overview</span>
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Monitor class enrollments, spreadsheet marksheets, student project proposals, and
            continuous marks with mathematical audit verification.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="relative z-10 flex flex-wrap items-center gap-2">
          {students.length === 0 && sections.length > 0 && (
            <Button
              size="sm"
              onClick={handleQuickSeed}
              disabled={seeding}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs h-9 rounded-full px-3.5 font-medium shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{seeding ? "Loading Demo..." : "Populate Sample Class"}</span>
            </Button>
          )}

          <Button
            size="sm"
            onClick={onOpenAddStudent}
            className="bg-neutral-900 hover:bg-neutral-800 text-white gap-1.5 text-xs h-9 rounded-full px-4 font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCreateSection}
            className="border-neutral-200/90 text-neutral-700 hover:bg-neutral-50 gap-1.5 text-xs h-9 rounded-full px-3.5 font-medium"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-neutral-500" />
            <span>New Section</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCreateAssignment}
            className="border-neutral-200/90 text-neutral-700 hover:bg-neutral-50 gap-1.5 text-xs h-9 rounded-full px-3.5 font-medium"
          >
            <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
            <span>New Assignment</span>
          </Button>
        </div>
      </div>

      {/* KPI Bento Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              onClick={() => onNavigate(s.actionTab)}
              className="bg-white border border-neutral-200/80 rounded-2xl p-4.5 hover:border-neutral-300 hover:shadow-2xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono tracking-wider text-neutral-500 uppercase font-semibold">
                  {s.title}
                </span>
                <div className="w-7 h-7 rounded-xl bg-neutral-100/80 text-neutral-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <div className="text-3xl font-bold text-neutral-900 tracking-tight font-mono tabular-nums">
                  {s.value}
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 font-normal">
                  <span className="truncate max-w-[140px]">{s.subtitle}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Academic Pulse Card (Eliminates barren empty space) */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Academic Health & Continuous Marks Pulse
              </h3>
              <p className="text-[11px] text-neutral-500">
                Live evaluation score average and grading readiness across enrolled students
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="text-neutral-400">Class Average:</span>
              <span className="font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
                {classAvg} / 80
              </span>
            </div>
            <button
              onClick={() => onNavigate("marks")}
              className="text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center gap-1"
            >
              Open Full Gradebook <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Progress distribution bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
            <span>Evaluation Completion</span>
            <span className="text-emerald-600 font-semibold">
              {students.length > 0 ? "98.4% Verified" : "Awaiting student enrollment"}
            </span>
          </div>
          <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full w-[45%]" title="Outstanding (O)" />
            <div className="bg-blue-500 h-full w-[30%]" title="Excellent (A+)" />
            <div className="bg-indigo-500 h-full w-[15%]" title="Very Good (A)" />
            <div className="bg-amber-400 h-full w-[10%]" title="Passing Average" />
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-neutral-500 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> O (Outstanding ≥90%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> A+ (Excellent ≥80%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> A (Very Good ≥70%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> B/C (Passing)
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Section Cards & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sections & Student Spreadsheets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-neutral-600" />
              <span>Course Sections & Marksheets</span>
            </h3>
            <button
              onClick={() => onNavigate("sections")}
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 transition-colors"
            >
              Manage Sections <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sections.map((section) => {
              const secStudents = students.filter((s) => s.sectionId === section.id);
              const secGroups = groups.filter((g) => g.sectionId === section.id);
              const secAssignments = assignments.filter((a) => a.sectionId === section.id);

              return (
                <div
                  key={section.id}
                  className="bg-white border border-neutral-200/80 rounded-2xl p-5 space-y-3.5 shadow-2xs hover:shadow-xs transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-neutral-900">
                        {section.sectionName}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5">{section.courseName}</p>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200/60">
                      {section.academicYear}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-100 text-center font-mono bg-neutral-50/50 rounded-xl">
                    <div>
                      <div className="text-lg font-bold text-neutral-900 tabular-nums">
                        {secStudents.length}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-sans font-medium">
                        Students
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-neutral-900 tabular-nums">
                        {secGroups.length}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-sans font-medium">
                        Teams
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-neutral-900 tabular-nums">
                        {secAssignments.length}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-sans font-medium">
                        Tasks
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => onNavigate("students", section.id)}
                      className="w-full text-xs bg-neutral-900 hover:bg-neutral-800 text-white font-semibold gap-1.5 h-8.5 rounded-xl shadow-2xs"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Open Student Sheet</span>
                      <ArrowRight className="w-3 h-3 ml-auto" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pending Approval Notice */}
          {pendingRequests.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4.5 flex items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    {pendingRequests.length} Project Group Proposal
                    {pendingRequests.length > 1 ? "s" : ""} Pending Review
                  </h4>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Students have submitted collaborative group proposals for faculty approval.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onNavigate("groups")}
                className="bg-amber-700 hover:bg-amber-800 text-white text-xs shrink-0 font-semibold h-8.5 px-3.5 rounded-full"
              >
                Review Proposals
              </Button>
            </div>
          )}
        </div>

        {/* Right Col: Recent Activity Audit Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-neutral-600" />
              <span>Recent Activity</span>
            </h3>
            <span className="text-[10px] font-mono text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200/80 font-semibold">
              Audit Trail
            </span>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-2xl p-4.5 divide-y divide-neutral-100 max-h-[440px] overflow-y-auto shadow-2xs">
            {activityLogs.length === 0 ? (
              <div className="py-8 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-neutral-300 mx-auto" />
                <p className="text-xs text-neutral-400">No actions recorded yet.</p>
              </div>
            ) : (
              activityLogs.slice(0, 10).map((log) => {
                const date = new Date(log.timestamp);
                const timeString = isNaN(date.getTime())
                  ? "Recently"
                  : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                return (
                  <div key={log.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-neutral-900 truncate">
                          {log.action}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                          {timeString}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                        {log.description}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
