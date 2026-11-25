import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Search, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/auth";
import { HandoverLogo } from "@/components/common/HandoverLogo";

interface HeaderProps {
  currentTitle: string;
  onSearch?: ((query: string) => void) | undefined;
  searchQuery?: string | undefined;
  searchPlaceholder?: string | undefined;
}

export function Header({
  currentTitle,
  onSearch,
  searchQuery = "",
  searchPlaceholder = "Quick search...",
}: HeaderProps) {
  const { user, isTeacher, isStudent, studentProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <header className="h-14 border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between font-sans">
      {/* Left: Brand & Page Title Breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-slate-900 text-sm hover:opacity-90 transition-opacity shrink-0 group"
          title="Return to Handover Homepage"
        >
          <HandoverLogo size="sm" />
          <span className="hidden sm:inline tracking-tight font-extrabold bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
            Handover
          </span>
        </Link>

        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 hidden sm:block" />

        <div className="min-w-0 flex items-center gap-2">
          <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate tracking-tight">
            {currentTitle}
          </h1>
          {isTeacher && (
            <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              <Sparkles className="w-2.5 h-2.5" />
              Faculty Workspace
            </span>
          )}
          {isStudent && (
            <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <ShieldCheck className="w-2.5 h-2.5" />
              Student Portal
            </span>
          )}
        </div>
      </div>

      {/* Center/Right: Actions, Profile & Sign Out */}
      <div className="flex items-center gap-3 shrink-0">
        {onSearch && (
          <div className="relative hidden md:block w-48 lg:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full text-xs h-8 pl-8 pr-3 rounded-lg bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
        )}

        {/* User Profile Pill */}
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[140px]">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono leading-tight">
                {isTeacher && "Course Instructor"}
                {isStudent &&
                  (studentProfile ? `Roll: ${studentProfile.rollNumber}` : "Enrolled Student")}
              </span>
            </div>

            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs ${
                isTeacher
                  ? "bg-gradient-to-tr from-indigo-600 to-violet-600"
                  : "bg-gradient-to-tr from-emerald-600 to-teal-600"
              }`}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {/* Sign Out Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 h-8 px-2.5 gap-1.5 transition-colors"
          title="Sign out of your session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-medium">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}
