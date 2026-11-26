import React from "react";
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  BookOpen,
  Layers,
  Award,
  BarChart3,
  Bell,
  UserCheck,
  GraduationCap,
  Sparkles,
  Building2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import type { UserRole } from "@/types";

export type TeacherTab =
  | "overview"
  | "students"
  | "sections"
  | "assignments"
  | "groups"
  | "marks"
  | "reports"
  | "announcements";

export type StudentTab =
  "overview" | "assignments" | "group" | "marks" | "announcements" | "profile";

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  pendingApprovalsCount?: number;
  activeAssignmentsCount?: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | undefined;
  badgeVariant?: "indigo" | "amber" | "emerald" | "slate";
}

export function Sidebar({
  role,
  activeTab,
  onTabChange,
  pendingApprovalsCount = 0,
  activeAssignmentsCount = 0,
}: SidebarProps) {
  const teacherNavGroups = [
    {
      group: "Core workspace",
      items: [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "students", label: "Students", icon: Users },
        { id: "sections", label: "Sections", icon: FolderGit2 },
        { id: "marks", label: "Marks & results", icon: Award },
      ],
    },
    {
      group: "Academics & teams",
      items: [
        { id: "assignments", label: "Assignments", icon: BookOpen },
        {
          id: "groups",
          label: "Group projects",
          icon: Layers,
          badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : undefined,
          badgeVariant: "amber" as const,
        },
        { id: "reports", label: "Reports", icon: BarChart3 },
        { id: "announcements", label: "Announcements", icon: Bell },
      ],
    },
  ];

  const studentNavGroups = [
    {
      group: "Academic hub",
      items: [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "marks", label: "My marks", icon: Award },
        {
          id: "assignments",
          label: "Assignments",
          icon: BookOpen,
          badge: activeAssignmentsCount > 0 ? `${activeAssignmentsCount}` : undefined,
          badgeVariant: "indigo" as const,
        },
      ],
    },
    {
      group: "Collaboration",
      items: [
        { id: "group", label: "My group project", icon: Layers },
        { id: "announcements", label: "Announcements", icon: Bell },
        { id: "profile", label: "My profile", icon: UserCheck },
      ],
    },
  ];

  const navGroups = role === "teacher" ? teacherNavGroups : studentNavGroups;

  return (
    <aside className="w-64 border-r border-slate-200/70 bg-white flex flex-col shrink-0 min-h-[calc(100vh-3.5rem)] select-none">
      {/* Workspace Branding Header */}
      <div className="p-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
          <div className="w-8 h-8 rounded-md flex items-center justify-center font-medium text-white bg-slate-900 shrink-0">
            {role === "teacher" ? (
              <GraduationCap className="w-4 h-4 stroke-[1.5]" />
            ) : (
              <Users className="w-4 h-4 stroke-[1.5]" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-900 truncate">
              {role === "teacher" ? "Faculty Workspace" : "Student Portal"}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] text-slate-500 truncate">
                {role === "teacher" ? "Dept. of Computer Science" : "Verified Roster"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {navGroups.map((g) => (
          <div key={g.group} className="space-y-1">
            <div className="px-3 pt-2 pb-1 text-[11px] font-medium text-slate-400">
              {g.group}
            </div>
            {g.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 h-9 rounded-lg text-xs font-medium transition-colors group ${isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                      <Icon
                        className={`w-4 h-4 stroke-[1.5] transition-colors ${isActive
                          ? "text-slate-900"
                          : "text-slate-400 group-hover:text-slate-700"
                          }`}
                      />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Workspace Footer Badge */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/40">
        <div className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[1.5] text-slate-400" />
            <span>Scoped Session</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-600">
            RBAC Active
          </span>
        </div>
      </div>
    </aside>
  );
}
