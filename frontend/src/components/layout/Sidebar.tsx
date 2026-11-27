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
  ShieldCheck,
  X,
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
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | undefined;
  badgeVariant?: "default" | "amber";
}

export function Sidebar({
  role,
  activeTab,
  onTabChange,
  pendingApprovalsCount = 0,
  activeAssignmentsCount = 0,
  mobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const teacherNavGroups = [
    {
      group: "Core workspace",
      items: [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "students", label: "Students sheet", icon: Users },
        { id: "sections", label: "Sections", icon: FolderGit2 },
        { id: "marks", label: "Marks & gradebook", icon: Award },
      ],
    },
    {
      group: "Coursework & teams",
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
          badgeVariant: "default" as const,
        },
      ],
    },
    {
      group: "Collaboration",
      items: [
        { id: "group", label: "My project group", icon: Layers },
        { id: "announcements", label: "Announcements", icon: Bell },
        { id: "profile", label: "Profile", icon: UserCheck },
      ],
    },
  ];

  const navGroups = role === "teacher" ? teacherNavGroups : studentNavGroups;

  const handleSelectTab = (tabId: string) => {
    onTabChange(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0 h-full select-none">
      {/* Workspace Context Header */}
      <div className="p-3.5 border-b border-slate-100">
        <div className="flex items-center justify-between p-2.5 rounded-md bg-slate-50 border border-slate-200/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
              {role === "teacher" ? (
                <GraduationCap className="w-4 h-4 text-slate-800" />
              ) : (
                <Users className="w-4 h-4 text-slate-800" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-900 truncate">
                {role === "teacher" ? "Faculty Workspace" : "Student Portal"}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span className="text-[11px] text-slate-500 truncate">
                  {role === "teacher" ? "Dept. of CS" : "Verified Student"}
                </span>
              </div>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-2 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
        {navGroups.map((g) => (
          <div key={g.group} className="space-y-0.5">
            <div className="px-3 pb-1.5 pt-2 text-[11px] font-medium text-slate-400 tracking-normal">
              {g.group}
            </div>
            {g.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors group relative ${
                    isActive
                      ? "bg-slate-100 text-slate-900 font-semibold before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:rounded-r before:bg-primary"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-slate-900"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[11px] font-mono font-medium px-1.5 py-0.5 rounded text-center leading-none ${
                        item.badgeVariant === "amber"
                          ? "bg-amber-50 text-amber-800 border border-amber-200/70"
                          : "bg-slate-100 text-slate-600 border border-slate-200/60"
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

      {/* Grounded Institutional Context Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Multi-tenant scoped</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            RBAC v2.1
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block shrink-0 h-full">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/25 transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-50 h-full w-64 shadow-lg animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
