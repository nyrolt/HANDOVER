import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LogOut,
  Search,
  ChevronRight,
  Menu,
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/auth";
import { HandoverLogo } from "@/components/common/HandoverLogo";
import { submissionsApi } from "@/services/submissionsApi";
import type { Notification } from "@/types";

interface HeaderProps {
  currentTitle: string;
  onSearch?: ((query: string) => void) | undefined;
  searchQuery?: string | undefined;
  searchPlaceholder?: string | undefined;
  onToggleMobileMenu?: (() => void) | undefined;
  isMobileMenuOpen?: boolean | undefined;
}

export function Header({
  currentTitle,
  onSearch,
  searchQuery = "",
  searchPlaceholder = "Quick search...",
  onToggleMobileMenu,
  isMobileMenuOpen = false,
}: HeaderProps) {
  const { user, isTeacher, isStudent, studentProfile, logout } = useAuth();
  const navigate = useNavigate();

  // Notifications State (System E)
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const res = await submissionsApi.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch {}
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    await submissionsApi.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleSignOut = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <header className="h-14 border-b border-slate-200 bg-white sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between font-sans">
      {/* Left: Mobile Toggle + Brand & Page Title Breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        <Link
          to="/"
          className="flex items-center gap-2 text-slate-900 text-sm hover:opacity-90 transition-opacity shrink-0"
          title="Return to Handover Homepage"
        >
          <HandoverLogo size="sm" />
          <span className="hidden sm:inline font-semibold text-slate-900 tracking-tight">
            Handover
          </span>
        </Link>

        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 hidden sm:block" />

        <div className="min-w-0 flex items-center">
          <h1 className="text-xs sm:text-sm font-semibold text-slate-900 truncate tracking-tight">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Middle: Global Search (if enabled for page) */}
      {onSearch && (
        <div className="hidden md:flex items-center max-w-sm flex-1 mx-6">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-colors text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>
      )}

      {/* Right: User Status & Sign Out */}
      <div className="flex items-center gap-2.5 shrink-0">
        {user ? (
          <div className="flex items-center gap-2">
            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* Notification Popover Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100">
                  <div className="p-3.5 px-4 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3.5 text-xs space-y-1 transition-colors hover:bg-slate-50/80 ${
                            !n.isRead ? "bg-indigo-50/20" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800">{n.title}</span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11.5px] leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Info */}
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-slate-50 border border-slate-200">
              <div className="w-6 h-6 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-semibold shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div className="text-left text-xs leading-tight min-w-0 hidden xs:block sm:block">
                <div className="font-medium text-slate-900 truncate max-w-[120px] sm:max-w-[160px]">
                  {user.name}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
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
              className="h-8 text-xs text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md px-2.5 font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        ) : (
          <Link to="/auth" search={{ tab: "signin" }}>
            <Button
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 rounded-md font-medium px-3"
            >
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
