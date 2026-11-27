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
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-slate-500 mb-1">Academic Portal</div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            {student.name}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
            <span>
              Roll Number:{" "}
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

        {/* Quick Marks Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center gap-4 self-start md:self-auto shrink-0">
          <div>
            <div className="text-[10px] uppercase font-medium text-slate-400 font-mono">
              Continuous Score
            </div>
            <div className="text-2xl font-semibold text-slate-900 font-mono tabular-nums">
              {marks?.total ?? 0}
              <span className="text-xs font-normal text-slate-400 font-sans">
                /{marks?.maxTotal || 80}
              </span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <div className="text-[10px] uppercase font-medium text-slate-400 font-mono">Grade</div>
            <div className="text-sm font-semibold text-slate-900 font-mono">
              <AsciiGlitchRipple as="span">{grade.split(" ")[0] || "N/A"}</AsciiGlitchRipple>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div
          onClick={() => onNavigate("assignments")}
          className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Coursework</span>
            <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-slate-900 font-mono tabular-nums">
              {activeAssignments.length}
            </div>
            <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between font-normal">
              <span>{assignments.length} total assignments</span>
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </div>
          </div>
        </div>

        <div
          onClick={() => onNavigate("group")}
          className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Project Group</span>
            <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
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
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </div>
          </div>
        </div>

        <div
          onClick={() => onNavigate("marks")}
          className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Evaluation Standing</span>
            <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-slate-900 font-mono tabular-nums">
              {percentage}%
            </div>
            <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between font-normal">
              <span>
                <AsciiGlitchRipple as="span">Verified Scorecard</AsciiGlitchRipple>
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </div>
          </div>
        </div>

        <div
          onClick={() => onNavigate("announcements")}
          className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Class Notices</span>
            <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center">
              <Bell className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-slate-900 font-mono tabular-nums">
              {announcements.length}
            </div>
            <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between font-normal">
              <span>Section bulletins</span>
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
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
