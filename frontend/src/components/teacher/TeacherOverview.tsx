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
  Award,
  Sparkles,
  Calendar,
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
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      actionTab: "students",
    },
    {
      title: "Active Sections",
      value: sections.length,
      subtitle: "CSE-A, CSE-B, IT-A",
      icon: FolderGit2,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      actionTab: "sections",
    },
    {
      title: "Active Assignments",
      value: activeAssignments.length,
      subtitle: `${assignments.length} total created`,
      icon: BookOpen,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      actionTab: "assignments",
    },
    {
      title: "Project Groups",
      value: groups.length,
      subtitle: `${groups.reduce((acc, g) => acc + g.members.length, 0)} assigned members`,
      icon: Layers,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      actionTab: "groups",
    },
    {
      title: "Pending Proposals",
      value: pendingRequests.length,
      subtitle: pendingRequests.length > 0 ? "Action required" : "All caught up",
      icon: Clock,
      color:
        pendingRequests.length > 0
          ? "text-amber-600 bg-amber-50 border-amber-200"
          : "text-slate-600 bg-slate-50 border-slate-100",
      actionTab: "groups",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Academic Management Center</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Welcome back, {user?.name || "Faculty Member"}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Manage your classes, students, spreadsheet marksheets, group projects, and assignments
            from one unified workspace.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={onOpenAddStudent}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white gap-1.5 text-xs h-9 rounded-xl shadow-xs shadow-indigo-600/25 px-3.5 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCreateSection}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 text-xs h-9 rounded-xl font-semibold"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
            <span>New Section</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCreateAssignment}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 text-xs h-9 rounded-xl font-semibold"
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
              className="bg-white border border-slate-200/80 rounded-2xl p-4.5 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{s.title}</span>
                <div className={`p-1.5 rounded-xl border ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
                  {s.value}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400 truncate flex items-center justify-between font-medium">
                <span>{s.subtitle}</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
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
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-600" />
              Your Sections & Student Sheets
            </h3>
            <button
              onClick={() => onNavigate("sections")}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
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
                  className="bg-white border border-slate-200 rounded-xl p-4.5 hover:border-indigo-300 hover:shadow-xs transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{section.sectionName}</h4>
                      <p className="text-xs text-slate-400">{section.courseName}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {section.academicYear}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
                    <div>
                      <div className="text-base font-bold text-slate-800">{secStudents.length}</div>
                      <div className="text-[10px] text-slate-400">Students</div>
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-800">{secGroups.length}</div>
                      <div className="text-[10px] text-slate-400">Groups</div>
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-800">
                        {secAssignments.length}
                      </div>
                      <div className="text-[10px] text-slate-400">Tasks</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onNavigate("students", section.id)}
                      className="w-full text-xs border-indigo-100 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 font-semibold gap-1.5"
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
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    {pendingRequests.length} Student Project Group Proposal
                    {pendingRequests.length > 1 ? "s" : ""} Awaiting Review
                  </h4>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Students have submitted their proposed team names and members for your
                    authorization.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onNavigate("groups")}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs shrink-0 font-medium"
              >
                Review Proposals
              </Button>
            </div>
          )}
        </div>

        {/* Right Col: Recent Activity Audit Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Recent Activity
            </h3>
            <span className="text-[10px] font-medium text-slate-400">Live Audit Log</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 divide-y divide-slate-100 shadow-xs max-h-[380px] overflow-y-auto">
            {activityLogs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No recent actions recorded.</p>
            ) : (
              activityLogs.slice(0, 7).map((log) => {
                const date = new Date(log.timestamp);
                const timeString = isNaN(date.getTime())
                  ? "Recently"
                  : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                return (
                  <div key={log.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 truncate">{log.action}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{timeString}</span>
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
