import React from "react";
import {
  Users,
  FolderGit2,
  BookOpen,
  Layers,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/services/db";
import { useAuth } from "@/services/auth";

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

  const activeAssignments = assignments.filter((a) => a.status === "Active");

  const stats = [
    {
      title: "Total Students",
      value: students.length,
      subtitle: `Enrolled across ${sections.length} sections`,
      icon: Users,
      actionTab: "students",
    },
    {
      title: "Active Sections",
      value: sections.length,
      subtitle: sections.map((s) => s.sectionName).slice(0, 3).join(", ") || "No sections",
      icon: FolderGit2,
      actionTab: "sections",
    },
    {
      title: "Active Coursework",
      value: activeAssignments.length,
      subtitle: `${assignments.length} total assignments`,
      icon: BookOpen,
      actionTab: "assignments",
    },
    {
      title: "Project Groups",
      value: groups.length,
      subtitle: `${groups.reduce((acc, g) => acc + g.members.length, 0)} assigned members`,
      icon: Layers,
      actionTab: "groups",
    },
    {
      title: "Pending Proposals",
      value: pendingRequests.length,
      subtitle: pendingRequests.length > 0 ? "Awaiting review" : "Up to date",
      icon: Clock,
      actionTab: "groups",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-slate-500 mb-1">Academic Administration</div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Faculty Overview
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Monitor class enrollments, spreadsheet marksheets, project group proposals, and continuous academic assessments.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={onOpenAddStudent}
            className="bg-slate-900 hover:bg-slate-800 text-white gap-1.5 text-xs h-8 rounded-md px-3 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCreateSection}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 text-xs h-8 rounded-md font-medium"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
            <span>New Section</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCreateAssignment}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 text-xs h-8 rounded-md font-medium"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>New Assignment</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              onClick={() => onNavigate(s.actionTab)}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{s.title}</span>
                <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-semibold text-slate-900 tracking-tight font-mono tabular-nums">
                  {s.value}
                </div>
                <div className="mt-1 text-[11px] text-slate-500 truncate flex items-center justify-between font-normal">
                  <span>{s.subtitle}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Section Fast-Access & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sections & Student Spreadsheets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-slate-600" />
              Course Sections & Marksheets
            </h3>
            <button
              onClick={() => onNavigate("sections")}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              Manage Sections <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {sections.map((section) => {
              const secStudents = students.filter((s) => s.sectionId === section.id);
              const secGroups = groups.filter((g) => g.sectionId === section.id);
              const secAssignments = assignments.filter((a) => a.sectionId === section.id);

              return (
                <div
                  key={section.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{section.sectionName}</h4>
                      <p className="text-xs text-slate-500">{section.courseName}</p>
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {section.academicYear}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 text-center font-mono">
                    <div>
                      <div className="text-base font-semibold text-slate-900 tabular-nums">
                        {secStudents.length}
                      </div>
                      <div className="text-[10px] text-slate-500 font-sans">Students</div>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-slate-900 tabular-nums">
                        {secGroups.length}
                      </div>
                      <div className="text-[10px] text-slate-500 font-sans">Groups</div>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-slate-900 tabular-nums">
                        {secAssignments.length}
                      </div>
                      <div className="text-[10px] text-slate-500 font-sans">Tasks</div>
                    </div>
                  </div>

                  <div className="pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onNavigate("students", section.id)}
                      className="w-full text-xs border-slate-200 text-slate-800 hover:bg-slate-50 font-medium gap-1.5 h-8"
                    >
                      Open Student Sheet <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pending Approval Notice if any */}
          {pendingRequests.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-amber-900">
                    {pendingRequests.length} Project Group Proposal
                    {pendingRequests.length > 1 ? "s" : ""} Pending Review
                  </h4>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Students have submitted team formations for instructor authorization.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onNavigate("groups")}
                className="bg-amber-700 hover:bg-amber-800 text-white text-xs shrink-0 font-medium h-8 px-3 rounded-md"
              >
                Review Proposals
              </Button>
            </div>
          )}
        </div>

        {/* Right Col: Recent Activity Audit Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-600" />
              Recent Activity
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Audit Trail</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
            {activityLogs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No recent actions recorded.</p>
            ) : (
              activityLogs.slice(0, 8).map((log) => {
                const date = new Date(log.timestamp);
                const timeString = isNaN(date.getTime())
                  ? "Recently"
                  : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                return (
                  <div key={log.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-800 truncate">{log.action}</span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{timeString}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
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
