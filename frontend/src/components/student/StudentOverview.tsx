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
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Student Portal • Verified Enrolled</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Hello, {student.name}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
            <span>
              Roll Number:{" "}
              <strong className="text-slate-800 font-mono">{student.rollNumber}</strong>
            </span>
            <span>•</span>
            <span>
              Section:{" "}
              <strong className="text-slate-800">{section?.sectionName || "Enrolled"}</strong>
            </span>
            <span>•</span>
            <span>
              Course: <strong className="text-slate-800">{section?.courseName}</strong>
            </span>
          </div>
        </div>

        {/* Quick Marks Pill */}
        <div className="bg-gradient-to-r from-slate-50 to-indigo-50/40 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-4 self-start md:self-auto shrink-0">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Current Standing</div>
            <div className="text-2xl font-black text-indigo-700 font-mono">
              {marks?.total ?? 0}
              <span className="text-xs font-normal text-slate-400 font-sans">
                /{marks?.maxTotal || 80}
              </span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Grade</div>
            <div className="text-sm font-black text-emerald-600">{grade.split(" ")[0]}</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate("assignments")}
          className="bg-white border border-slate-200/80 rounded-2xl p-4.5 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Coursework</span>
            <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 font-mono">
            {activeAssignments.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between font-medium">
            <span>{assignments.length} total assigned</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("group")}
          className="bg-white border border-slate-200/80 rounded-2xl p-4.5 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Project Group</span>
            <div className="p-1.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-base font-bold text-slate-900 truncate">
            {approvedGroup?.groupName || (pendingRequest ? "Pending Approval" : "Not Formed")}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between font-medium">
            <span>
              {approvedGroup
                ? `${approvedGroup.members.length} members`
                : pendingRequest
                  ? "Awaiting Review"
                  : "Propose a group"}
            </span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-purple-600" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("marks")}
          className="bg-white border border-slate-200/80 rounded-2xl p-4.5 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Continuous Evaluation</span>
            <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-600 font-mono">{percentage}%</div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between font-medium">
            <span>Verified Scorecard</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("announcements")}
          className="bg-white border border-slate-200/80 rounded-2xl p-4.5 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Class Notices</span>
            <div className="p-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 font-mono">
            {announcements.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between font-medium">
            <span>Section bulletins</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-amber-600" />
          </div>
        </div>
      </div>

      {/* Main Two-Column Content: Coursework & Group Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Coursework & Deadlines */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Coursework & Upcoming Deadlines
            </h3>
            <button
              onClick={() => onNavigate("assignments")}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {assignments.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {a.subject}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {a.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mt-1">{a.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{a.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Deadline</div>
                  <div className="text-xs font-bold text-slate-700">{a.deadline}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Academic Marks Summary Preview */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                My Academic Evaluation Breakdown
              </h3>
              <span className="text-[11px] text-slate-400">Teacher-verified records</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center">
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Internal</div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">
                  {marks?.internalMarks ?? 0}
                  <span className="text-xs font-normal text-slate-400">/20</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Lab Record</div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">
                  {marks?.labRecordMarks ?? 0}
                  <span className="text-xs font-normal text-slate-400">/20</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Practical</div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">
                  {marks?.practicalMarks ?? 0}
                  <span className="text-xs font-normal text-slate-400">/20</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Project</div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">
                  {marks?.projectMarks ?? 0}
                  <span className="text-xs font-normal text-slate-400">/20</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Project Group & Announcements */}
        <div className="space-y-4">
          {/* Project Group Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              My Project Group
            </h3>

            {approvedGroup ? (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-700 text-sm">
                    {approvedGroup.groupName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Official
                  </span>
                </div>
                <div className="font-semibold text-slate-800">{approvedGroup.projectTitle}</div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {approvedGroup.projectDescription}
                </p>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase mb-1">
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
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs space-y-2">
                <div className="font-bold text-amber-900">{pendingRequest.proposedGroupName}</div>
                <div className="text-amber-800 text-[11px]">
                  {pendingRequest.proposedProjectTitle}
                </div>
                <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Awaiting Teacher Approval</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-400 space-y-2">
                <p>You haven't formed or submitted a project group yet.</p>
                <Button
                  size="sm"
                  onClick={() => onNavigate("group")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7"
                >
                  Propose Team & Project
                </Button>
              </div>
            )}
          </div>

          {/* Announcements Quick List */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" />
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
                    <div className="font-bold text-slate-800">{ann.title}</div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{ann.message}</p>
                    <div className="text-[10px] text-slate-400 pt-1">Prof. Sharma</div>
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
