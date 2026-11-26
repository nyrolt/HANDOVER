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
      title: "Enrolled students",
      value: students.length,
      subtitle: `${sections.length} active sections`,
      actionTab: "students",
      icon: Users,
    },
    {
      title: "Class sections",
      value: sections.length,
      subtitle: sections.length > 0 ? "Configured rosters" : "No sections yet",
      actionTab: "sections",
      icon: FolderGit2,
    },
    {
      title: "Active assignments",
      value: activeAssignments.length,
      subtitle: `${assignments.length} total tasks`,
      actionTab: "assignments",
      icon: BookOpen,
    },
    {
      title: "Project groups",
      value: groups.length,
      subtitle: `${groups.reduce((acc, g) => acc + g.members.length, 0)} assigned students`,
      actionTab: "groups",
      icon: Layers,
    },
    {
      title: "Pending proposals",
      value: pendingRequests.length,
      subtitle: pendingRequests.length > 0 ? "Action required" : "All cleared",
      actionTab: "groups",
      icon: Clock,
      highlight: pendingRequests.length > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Workspace Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            Faculty Workspace
          </div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            Academic Roster & Evaluation Dashboard
          </h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Manage section rosters, continuous marksheet evaluations, collaborative project teams,
            and coursework deadlines.
          </p>
        </div>

        {/* Primary Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={onOpenAddStudent}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 px-3 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 stroke-[1.5]" />
            Add student
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCreateSection}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs h-8 px-3 rounded-lg font-medium transition-colors"
          >
            <FolderGit2 className="w-3.5 h-3.5 mr-1.5 stroke-[1.5] text-slate-500" />
            New section
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCreateAssignment}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs h-8 px-3 rounded-lg font-medium transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5 stroke-[1.5] text-slate-500" />
            New assignment
          </Button>
        </div>
      </div>

      {/* KPI Metrics: Compact Uniform Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              onClick={() => onNavigate(s.actionTab)}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{s.title}</span>
                <Icon className="w-4 h-4 stroke-[1.5] text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-semibold text-slate-900 font-mono tracking-tight tabular-nums">
                  {s.value}
                </span>
                {s.highlight && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/80 font-medium">
                    Review
                  </span>
                )}
              </div>
              <div className="mt-1 text-[11px] text-slate-400 truncate flex items-center justify-between">
                <span>{s.subtitle}</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-600" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Sections Grid & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sections & Student Spreadsheets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 stroke-[1.5] text-slate-500" />
              <span>Assigned Sections</span>
            </h3>
            <button
              onClick={() => onNavigate("sections")}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <span>Manage sections</span>
              <ArrowRight className="w-3 h-3 stroke-[1.5]" />
            </button>
          </div>

          {sections.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
              <FolderGit2 className="w-8 h-8 text-slate-300 mx-auto stroke-[1.5]" />
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No class sections created yet. Create your first section to start enrolling students
                and recording marks.
              </p>
              <Button
                size="sm"
                onClick={onOpenCreateSection}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 px-3 rounded-lg font-medium"
              >
                Create first section
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {sections.map((section) => {
                const secStudents = students.filter((s) => s.sectionId === section.id);
                const secGroups = groups.filter((g) => g.sectionId === section.id);
                const secAssignments = assignments.filter((a) => a.sectionId === section.id);

                return (
                  <div
                    key={section.id}
                    className="bg-white border border-slate-200 rounded-xl p-4.5 hover:border-slate-300 transition-colors space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">
                            {section.sectionName}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">{section.courseName}</p>
                        </div>
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60 shrink-0">
                          {section.academicYear}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-2.5 mt-3 border-y border-slate-100 text-center">
                        <div>
                          <div className="text-sm font-semibold font-mono tabular-nums text-slate-900">
                            {secStudents.length}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Students</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold font-mono tabular-nums text-slate-900">
                            {secGroups.length}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Groups</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold font-mono tabular-nums text-slate-900">
                            {secAssignments.length}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Tasks</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onNavigate("students", section.id)}
                        className="w-full text-xs border-slate-200 text-slate-800 hover:bg-slate-50 font-medium h-8 rounded-lg transition-colors justify-between"
                      >
                        <span>Open marks spreadsheet</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pending Approval Notice */}
          {pendingRequests.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-amber-900">
                    {pendingRequests.length} Project group proposal
                    {pendingRequests.length > 1 ? "s" : ""} awaiting review
                  </h4>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Students have submitted team configurations for academic validation.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onNavigate("groups")}
                className="bg-amber-800 hover:bg-amber-900 text-white text-xs shrink-0 font-medium h-8 rounded-lg transition-colors"
              >
                Review proposals
              </Button>
            </div>
          )}
        </div>

        {/* Right Col: Recent Activity Audit Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 stroke-[1.5] text-slate-500" />
              <span>Recent activity</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Audit log</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 divide-y divide-slate-100 shadow-xs max-h-[420px] overflow-y-auto">
            {activityLogs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No recent actions recorded.</p>
            ) : (
              activityLogs.slice(0, 8).map((log) => {
                const date = new Date(log.timestamp);
                const timeString = isNaN(date.getTime())
                  ? "Recently"
                  : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                return (
                  <div
                    key={log.id}
                    className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-2.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-800 truncate">{log.action}</span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0 tabular-nums">
                          {timeString}
                        </span>
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
