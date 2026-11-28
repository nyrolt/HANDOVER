import React from "react";
import {
  BookOpen,
  Layers,
  Award,
  Calendar,
  Bell,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStudentDashboardData } from "@/services/student";
import type { Student } from "@/types";
import { AsciiGlitchRipple } from "@/components/ui/ascii-glitch-ripple";

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
      {/* Student Overview Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-13 h-13 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-mono font-bold text-indigo-700 text-lg shrink-0 shadow-2xs">
            {student.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Student
              </span>
              <span className="text-xs font-mono text-slate-400">ID: {student.id.slice(0, 8)}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight">
              {student.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs text-slate-500">
              <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200/80">
                Roll No:{" "}
                <strong className="text-slate-900 font-mono tabular-nums">
                  {student.rollNumber}
                </strong>
              </span>
              <span>•</span>
              <span>
                Section:{" "}
                <strong className="text-slate-900">{section?.sectionName || "Enrolled"}</strong>
              </span>
              <span>•</span>
              <span>
                Course: <strong className="text-slate-900">{section?.courseName}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Marks Summary */}
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-4 flex items-center gap-5 self-start md:self-auto shrink-0 shadow-2xs">
          <div>
            <div className="text-[10px] uppercase font-medium text-slate-400 font-mono tracking-wider">
              Continuous Score
            </div>
            <div className="text-3xl font-semibold text-slate-900 font-mono tabular-nums tracking-tight mt-0.5">
              {marks?.total ?? 0}
              <span className="text-xs font-normal text-slate-400 font-sans">
                /{marks?.maxTotal || 80}
              </span>
            </div>
            <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round(((marks?.total ?? 0) / (marks?.maxTotal || 80)) * 100))}%`,
                }}
              />
            </div>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div>
            <div className="text-[10px] uppercase font-medium text-slate-400 font-mono tracking-wider">
              Grade Tier
            </div>
            <div className="text-xl font-bold font-mono text-indigo-600 mt-1">
              <AsciiGlitchRipple as="span">{grade.split(" ")[0] || "N/A"}</AsciiGlitchRipple>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">{percentage}% aggregate</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div
          onClick={() => onNavigate("assignments")}
          className="bg-white border border-slate-200/90 rounded-xl p-4.5 hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Coursework</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/60 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-slate-900 font-mono tabular-nums tracking-tight">
              {activeAssignments.length}
            </div>
            <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between font-normal">
              <span>{assignments.length} total assignments</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
          </div>
        </div>

        <div
          onClick={() => onNavigate("group")}
          className="bg-white border border-slate-200/90 rounded-xl p-4.5 hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Project Group</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100/60 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-base font-semibold text-slate-900 truncate">
              {approvedGroup?.groupName || (pendingRequest ? "Pending Approval" : "Not Formed")}
            </div>
            <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between font-normal">
              <span>
                {approvedGroup
                  ? `${approvedGroup.members.length} members assigned`
                  : pendingRequest
                    ? "Awaiting review"
                    : "Propose team"}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
        </div>

        <div
          onClick={() => onNavigate("marks")}
          className="bg-white border border-slate-200/90 rounded-xl p-4.5 hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Evaluation Standing</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100/60 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-slate-900 font-mono tabular-nums tracking-tight">
              {percentage}%
            </div>
            <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between font-normal">
              <span>
                <AsciiGlitchRipple as="span">Verified Scorecard</AsciiGlitchRipple>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
          </div>
        </div>

        <div
          onClick={() => onNavigate("announcements")}
          className="bg-white border border-slate-200/90 rounded-xl p-4.5 hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Class Notices</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100/60 text-amber-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-slate-900 font-mono tabular-nums tracking-tight">
              {announcements.length}
            </div>
            <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between font-normal">
              <span>Section bulletins</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Content: Coursework & Group Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Coursework & Deadlines */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              Coursework & Upcoming Deadlines
            </h3>
            <button
              onClick={() => onNavigate("assignments")}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {assignments.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg p-6 text-center text-slate-400 text-xs">
                No active assignments for your section.
              </div>
            ) : (
              assignments.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {a.subject}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
                        {a.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 mt-1">{a.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{a.description}</p>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="text-[10px] text-slate-400 font-mono">Deadline</div>
                    <div className="text-xs font-mono font-medium text-slate-800 tabular-nums">
                      {a.deadline}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Academic Marks Summary Preview */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-slate-600" />
                Academic Evaluation Breakdown
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Teacher verified</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-center font-mono">
              <div className="bg-slate-50 rounded-md p-3 border border-slate-200">
                <div className="text-[10px] text-slate-500 font-sans">Internal</div>
                <div className="text-lg font-semibold text-slate-900 mt-0.5 tabular-nums">
                  {marks?.internalMarks ?? 0}
                  <span className="text-xs font-normal text-slate-400">/20</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-md p-3 border border-slate-200">
                <div className="text-[10px] text-slate-500 font-sans">Lab Record</div>
                <div className="text-lg font-semibold text-slate-900 mt-0.5 tabular-nums">
                  {marks?.labRecordMarks ?? 0}
                  <span className="text-xs font-normal text-slate-400">/20</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-md p-3 border border-slate-200">
                <div className="text-[10px] text-slate-500 font-sans">Practical</div>
                <div className="text-lg font-semibold text-slate-900 mt-0.5 tabular-nums">
                  {marks?.practicalMarks ?? 0}
                  <span className="text-xs font-normal text-slate-400">/20</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-md p-3 border border-slate-200">
                <div className="text-[10px] text-slate-500 font-sans">Project</div>
                <div className="text-lg font-semibold text-slate-900 mt-0.5 tabular-nums">
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
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-600" />
              My Project Group
            </h3>

            {approvedGroup ? (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-sm">
                    {approvedGroup.groupName}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
                    Official
                  </span>
                </div>
                <div className="text-slate-700 font-medium">{approvedGroup.projectTitle}</div>
                {approvedGroup.projectDescription && (
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {approvedGroup.projectDescription}
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-medium text-slate-400 font-mono mb-1">
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
              <div className="p-3.5 bg-amber-50/50 rounded-md border border-amber-200 text-xs space-y-2">
                <div className="font-semibold text-amber-900">
                  {pendingRequest.proposedGroupName}
                </div>
                <div className="text-amber-800 text-[11px]">
                  {pendingRequest.proposedProjectTitle}
                </div>
                <div className="flex items-center gap-1.5 text-amber-700 font-medium text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Awaiting Instructor Review</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-500 space-y-2">
                <p>No project group assigned yet.</p>
                <Button
                  size="sm"
                  onClick={() => onNavigate("group")}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 px-3 rounded-md font-medium"
                >
                  Propose Team & Topic
                </Button>
              </div>
            )}
          </div>

          {/* Announcements Quick List */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-600" />
              Teacher Bulletins
            </h3>

            {announcements.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No announcements for your section.</p>
            ) : (
              <div className="space-y-2">
                {announcements.slice(0, 2).map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3 rounded-md bg-slate-50 border border-slate-100 text-xs space-y-1"
                  >
                    <div className="font-medium text-slate-900">{ann.title}</div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{ann.message}</p>
                    <div className="text-[10px] font-mono text-slate-400 pt-0.5">
                      Faculty Announcement
                    </div>
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
