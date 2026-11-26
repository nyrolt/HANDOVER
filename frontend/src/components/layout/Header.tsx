import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Search, ChevronRight } from "lucide-react";
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
  searchPlaceholder = "Search records...",
}: HeaderProps) {
  const { user, isTeacher, studentProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <header className="h-14 border-b border-slate-200/70 bg-white sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between font-sans">
      {/* Left: Brand & Page Title Breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-slate-900 text-sm hover:opacity-90 transition-opacity shrink-0 group"
          title="Return to Handover Homepage"
        >
          <HandoverLogo size="sm" />
          <span className="hidden sm:inline font-semibold text-slate-900 tracking-tight">
            Handover
          </span>
        </Link>

        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 hidden sm:block" />

        <div className="min-w-0 flex items-center gap-2">
          <h1 className="text-xs sm:text-sm font-semibold text-slate-800 truncate tracking-tight">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Middle: Global Search */}
      {onSearch && (
        <div className="hidden md:flex items-center max-w-sm flex-1 mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-lg focus:bg-white focus:outline-none focus:border-slate-400 transition-colors text-slate-900 placeholder:text-slate-400"
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
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-semibold shrink-0 bg-slate-800">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div className="text-left text-xs leading-tight min-w-0">
                <div className="font-semibold text-slate-900 truncate max-w-[120px] sm:max-w-[160px]">
                  {user.name}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {isTeacher
                    ? "Faculty"
                    : `Student${studentProfile?.rollNumber ? ` • ${studentProfile.rollNumber}` : ""}`}
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              title="Sign out of Handover"
              className="h-8 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg px-2.5 font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 stroke-[1.5] sm:mr-1" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        ) : (
          <Link to="/auth" search={{ tab: "signin" }}>
            <Button
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 rounded-lg font-medium px-3"
            >
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
