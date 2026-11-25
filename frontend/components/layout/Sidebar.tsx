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
      group: "Core Workspace",
      items: [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "students", label: "Students", icon: Users },
        { id: "sections", label: "Sections", icon: FolderGit2 },
        { id: "marks", label: "Marks & Results", icon: Award },
      ],
    },
    {
      group: "Academics & Teams",
      items: [
        { id: "assignments", label: "Assignments", icon: BookOpen },
        {
          id: "groups",
          label: "Group Projects",
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
      group: "Academic Hub",
      items: [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "marks", label: "My Marks", icon: Award },
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
        { id: "group", label: "My Group Project", icon: Layers },
        { id: "announcements", label: "Announcements", icon: Bell },
        { id: "profile", label: "My Profile", icon: UserCheck },
      ],
    },
  ];

  const navGroups = role === "teacher" ? teacherNavGroups : studentNavGroups;

  return (
    <aside className="w-64 border-r border-slate-200/80 bg-white flex flex-col shrink-0 min-h-[calc(100vh-3.5rem)] select-none">
      {/* Workspace Branding Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/40 border border-slate-200/70">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
              role === "teacher"
                ? "bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-700 shadow-indigo-500/20"
                : "bg-gradient-to-tr from-emerald-600 via-teal-600 to-teal-700 shadow-emerald-500/20"
            }`}
          >
            {role === "teacher" ? (
              <GraduationCap className="w-5 h-5" />
            ) : (
              <Users className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">
              {role === "teacher" ? "Faculty Workspace" : "Student Portal"}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  role === "teacher"
                    ? "bg-indigo-600 animate-pulse"
                    : "bg-emerald-600 animate-pulse"
                }`}
              />
              <span className="text-[11px] text-slate-500 font-medium truncate">
                {role === "teacher" ? "Dept. of CS" : "Verified Access"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 p-3.5 space-y-6 overflow-y-auto">
        {navGroups.map((g) => (
          <div key={g.group} className="space-y-1">
            <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {g.group}
            </div>
            {g.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group relative ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-indigo-50/60 text-indigo-900 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]"
                      : "text-slate-600 hover:bg-slate-50/90 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-xs shadow-indigo-600/30"
                          : "text-slate-500 group-hover:text-slate-900 group-hover:bg-slate-100/80"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-5 text-center ${
                        item.badgeVariant === "amber"
                          ? "bg-amber-100 text-amber-900 border border-amber-200/80"
                          : item.badgeVariant === "indigo"
                            ? "bg-indigo-100 text-indigo-900 border border-indigo-200/80"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sleek Subtle Workspace Badge */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between px-2 py-1.5 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Multi-Tenant Scoped</span>
          </div>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-600">
            RBAC Active
          </span>
        </div>
      </div>
    </aside>
  );
}
