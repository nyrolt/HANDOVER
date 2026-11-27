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
        </div>
      </div>

      {/* Middle: Global Search (if enabled for page) */}
      {onSearch && (
        <div className="hidden md:flex items-center max-w-sm flex-1 mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>
      )}

      {/* Right: User Status & Sign Out */}
      <div className="flex items-center gap-2.5 shrink-0">
        {user ? (
          <div className="flex items-center gap-2">
            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-slate-50 border border-slate-200/70">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-black shrink-0 ${
                  isTeacher
                    ? "bg-gradient-to-tr from-indigo-600 to-violet-600"
                    : "bg-gradient-to-tr from-emerald-600 to-teal-600"
                }`}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div className="text-left text-xs leading-tight min-w-0">
                <div className="font-bold text-slate-900 truncate max-w-[120px] sm:max-w-[160px]">
                  {user.name}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                  <span
                    className={
                      isTeacher ? "text-indigo-600 font-semibold" : "text-emerald-600 font-semibold"
                    }
                  >
                    {isTeacher
                      ? "Faculty"
                      : `Student${studentProfile?.rollNumber ? ` • ${studentProfile.rollNumber}` : ""}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              title="Sign out of Handover"
              className="h-8 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl px-2.5 font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        ) : (
          <Link to="/auth" search={{ tab: "signin" }}>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 rounded-xl font-semibold px-3 shadow-xs"
            >
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
