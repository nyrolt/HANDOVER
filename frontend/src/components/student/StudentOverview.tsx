import React from "react";
import {
  GraduationCap,
  BookOpen,
  Layers,
  Award,
  Calendar,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStudentDashboardData } from "@/services/student";
import type { Student } from "@/types";

interface StudentOverviewProps {
  student: Student;
  onNavigate: (tab: string) => void;
}

export function StudentOverview({ student, onNavigate }: StudentOverviewProps) {
  const data = getStudentDashboardData(student.id);
  if (!data) return null;

  const {
    section,
    marks,
    grade,
    percentage,
    approvedGroup,
    pendingRequest,
    assignments,
    announcements,
  } = data;

  const activeAssignments = assignments.filter((a) => a.status === "Active");

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>Student Portal • Verified Enrolled</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            Hello, {student.name}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 font-normal">
            <span>
              Roll number:{" "}
              <strong className="text-slate-800 font-mono font-medium">{student.rollNumber}</strong>
            </span>
            <span>•</span>
            <span>
              Section:{" "}
              <strong className="text-slate-800 font-medium">{section?.sectionName || "Enrolled"}</strong>
            </span>
            <span>•</span>
            <span>
              Course: <strong className="text-slate-800 font-medium">{section?.courseName}</strong>
            </span>
          </div>
        </div>

        {/* Quick Marks Pill */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 flex items-center gap-4 self-start md:self-auto shrink-0">
          <div>
            <div className="text-[10px] uppercase font-medium text-slate-500">Current Standing</div>
            <div className="text-xl font-semibold text-slate-900 font-mono tabular-nums">
              {marks?.total ?? 0}
              <span className="text-xs font-normal text-slate-400 font-sans">
                /{marks?.maxTotal || 80}
              </span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <div className="text-[10px] uppercase font-medium text-slate-500">Grade</div>
            <div className="text-sm font-semibold font-mono text-slate-900">{grade.split(" ")[0]}</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate("assignments")}
          className="bg-white border border-slate-200/80 rounded-xl p-4.5 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active coursework</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-semibold text-slate-900 font-mono tabular-nums">
            {activeAssignments.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{assignments.length} total assigned</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-700" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("group")}
          className="bg-white border border-slate-200/80 rounded-xl p-4.5 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Project group</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-900 truncate">
            {approvedGroup?.groupName || (pendingRequest ? "Pending Approval" : "Not Formed")}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
            <span>
              {approvedGroup
                ? `${approvedGroup.members.length} members`
                : pendingRequest
                  ? "Awaiting review"
                  : "Propose a group"}
            </span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-700" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("marks")}
          className="bg-white border border-slate-200/80 rounded-xl p-4.5 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Continuous evaluation</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-semibold text-slate-900 font-mono tabular-nums">{percentage}%</div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Verified scorecard</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-700" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("announcements")}
          className="bg-white border border-slate-200/80 rounded-xl p-4.5 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Class notices</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
              <Bell className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-semibold text-slate-900 font-mono tabular-nums">
            {announcements.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Section bulletins</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-700" />
          </div>
        </div>
      </div>

      {/* Main Two-Column Content: Coursework & Group Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Coursework & Deadlines */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              Coursework & Upcoming Deadlines
            </h3>
            <button
              onClick={() => onNavigate("assignments")}
              className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {assignments.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
                      {a.subject}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/60">
                      {a.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-slate-900 mt-1">{a.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{a.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400 font-medium">Deadline</div>
                  <div className="text-xs font-mono font-medium text-slate-700 tabular-nums">{a.deadline}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Academic Marks Summary Preview */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-slate-600" />
                Academic Evaluation Breakdown
              </h3>
              <span className="text-[11px] text-slate-400">Teacher-verified records</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center">
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <div className="text-[10px] text-slate-500 font-medium">Internal</div>
                <div className="text-base font-semibold text-slate-900 mt-0.5 font-mono tabular-nums">
                  {marks?.internalMarks ?? 0}
                  <span className="text-xs font-normal text-slate-400 font-sans">/20</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <div className="text-[10px] text-slate-500 font-medium">Lab record</div>
                <div className="text-base font-semibold text-slate-900 mt-0.5 font-mono tabular-nums">
                  {marks?.labRecordMarks ?? 0}
                  <span className="text-xs font-normal text-slate-400 font-sans">/20</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <div className="text-[10px] text-slate-500 font-medium">Practical</div>
                <div className="text-base font-semibold text-slate-900 mt-0.5 font-mono tabular-nums">
                  {marks?.practicalMarks ?? 0}
                  <span className="text-xs font-normal text-slate-400 font-sans">/20</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <div className="text-[10px] text-slate-500 font-medium">Project</div>
                <div className="text-base font-semibold text-slate-900 mt-0.5 font-mono tabular-nums">
                  {marks?.projectMarks ?? 0}
                  <span className="text-xs font-normal text-slate-400 font-sans">/20</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Project Group & Announcements */}
        <div className="space-y-4">
          {/* Project Group Card */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-600" />
              Project Group
            </h3>

            {approvedGroup ? (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-sm">
                    {approvedGroup.groupName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                    Official
                  </span>
                </div>
                <div className="font-medium text-slate-800">{approvedGroup.projectTitle}</div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {approvedGroup.projectDescription}
                </p>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-medium text-slate-400 mb-1">
                    Teammates
                  </div>
                  <div className="space-y-1">
                    {approvedGroup.members.map((m) => (
                      <div
                        key={m.studentId}
                        className="flex items-center justify-between text-slate-700"
                      >
                        <span>
                          {m.studentName} ({m.role})
                        </span>
                        <span className="font-mono text-slate-400 text-[11px]">
                          Roll {m.rollNumber}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : pendingRequest ? (
              <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200/80 text-xs space-y-2">
                <div className="font-semibold text-amber-900">{pendingRequest.proposedGroupName}</div>
                <div className="text-amber-800 text-[11px]">
                  {pendingRequest.proposedProjectTitle}
                </div>
                <div className="flex items-center gap-1.5 text-amber-700 font-medium text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Awaiting teacher approval</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-400 space-y-2">
                <p>You haven't formed or submitted a project group yet.</p>
                <Button
                  size="sm"
                  onClick={() => onNavigate("group")}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-7 rounded-md font-medium px-3"
                >
                  Propose team & project
                </Button>
              </div>
            )}
          </div>

          {/* Announcements Quick List */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-600" />
              Teacher Announcements
            </h3>

            {announcements.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No announcements for your section.</p>
            ) : (
              <div className="space-y-2.5">
                {announcements.slice(0, 2).map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1"
                  >
                    <div className="font-medium text-slate-800">{ann.title}</div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{ann.message}</p>
                    <div className="text-[10px] text-slate-400 pt-1 font-mono">Faculty</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
