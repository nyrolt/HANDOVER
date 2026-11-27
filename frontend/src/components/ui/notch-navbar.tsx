"use client";

import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Menu,
  X,
  FileSpreadsheet,
  Layers,
  Sparkles,
  HelpCircle,
  LogIn,
  GraduationCap,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { HandoverLogo } from "@/components/common/HandoverLogo";
import { AsciiGlitchRipple } from "@/components/ui/ascii-glitch-ripple";

export interface NotchNavbarProps extends React.HTMLAttributes<HTMLElement> {
  userRole?: string | null;
  onLogout?: () => void;
}

export function NotchNavbar({ className, userRole, onLogout, ...props }: NotchNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const items = {
    left: [
      { label: "Architecture", href: "#architecture", icon: Layers },
      { label: "Comparison", href: "#comparison", icon: Scale },
      { label: "Studio Sandbox", href: "#studio", icon: FileSpreadsheet },
    ],
    right: [
      { label: "Bento Matrix", href: "#capabilities", icon: Sparkles },
      { label: "Academic FAQ", href: "#faq", icon: HelpCircle },
    ],
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.slice(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", href);
      }
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className={cn("fixed top-0 inset-x-0 z-50 h-16 flex px-0", className)} {...props}>
        {/* Left Side Bar - Flexible width */}
        <div className="flex-1 h-10 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md z-20 relative min-w-0 border-b border-border/40">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line
              x1="0"
              y1="39.5"
              x2="100%"
              y2="39.5"
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={0.5}
              className="text-foreground"
            />
          </svg>
        </div>

        {/* Responsive Notch Container - 3 Slices */}
        <div className="flex h-16 relative z-10 shrink-0 -ml-px">
          {/* Left Slice (Corner) */}
          <div className="w-[44px] sm:w-[50px] h-full relative shrink-0">
            <div
              className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md"
              style={{ clipPath: "path('M0 0 H50 V64 C25 64 25 40 0 40 Z')" }}
            />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 64">
              <path
                d="M0 39.5 C25 39.5 25 63.5 50 63.5"
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.12}
                strokeWidth={0.75}
                className="text-foreground"
              />
            </svg>
          </div>

          {/* Center Slice (Flexible Content Area) */}
          <div className="flex-1 h-full relative min-w-0 -ml-px">
            <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="63.5"
                  x2="100%"
                  y2="63.5"
                  stroke="currentColor"
                  strokeOpacity={0.12}
                  strokeWidth={0.75}
                  className="text-foreground"
                />
              </svg>
            </div>

            {/* Content Layer */}
            <div className="relative w-full h-full flex items-end justify-between pb-2 px-3 sm:px-6 gap-2 sm:gap-6">
              {/* Desktop Left Nav */}
              <nav className="hidden lg:flex gap-5 mb-1 shrink-0 items-center">
                {items.left.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="group flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <item.icon className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                    <span>{item.label}</span>
                  </a>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors text-foreground mb-1"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

              {/* Logo (Center) with ASCII Glitch Ripple */}
              <div className="flex justify-center shrink-0 mx-1 sm:mx-3 mt-1 items-center">
                <Link to="/" className="flex items-center gap-2 group">
                  <HandoverLogo size="sm" />
                  <AsciiGlitchRipple
                    as="span"
                    className="font-bold text-sm tracking-tight text-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    Handover
                  </AsciiGlitchRipple>
                </Link>
              </div>

              {/* Desktop Right Nav */}
              <nav className="hidden lg:flex gap-5 items-center shrink-0 mb-1">
                {items.right.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="group flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <item.icon className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                    <span>{item.label}</span>
                  </a>
                ))}

                <div className="flex gap-2.5 pl-3 border-l border-border shrink-0 items-center">
                  {userRole ? (
                    <div className="flex items-center gap-2">
                      <Link
                        to="/dashboard"
                        className="px-3 py-1 text-xs font-medium text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-full hover:opacity-90 transition-opacity shadow-xs whitespace-nowrap flex items-center gap-1.5"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                      </Link>
                      {onLogout && (
                        <button
                          onClick={onLogout}
                          className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
                        >
                          Sign Out
                        </button>
                      )}
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      className="px-3 py-1 text-xs font-medium text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-full hover:opacity-90 transition-opacity shadow-xs whitespace-nowrap flex items-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign in</span>
                    </Link>
                  )}
                </div>
              </nav>

              {/* Mobile Right Actions */}
              <div className="lg:hidden flex items-center gap-2 mb-1">
                <Link
                  to={userRole ? "/dashboard" : "/auth"}
                  className="px-2.5 py-1 text-[11px] font-medium text-white bg-slate-900 rounded-full whitespace-nowrap"
                >
                  {userRole ? "Dashboard" : "Sign in"}
                </Link>
              </div>
            </div>
          </div>

          {/* Right Slice (Corner) */}
          <div className="w-[44px] sm:w-[50px] h-full relative shrink-0 -ml-px">
            <div
              className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md"
              style={{ clipPath: "path('M0 0 H50 V40 C25 40 25 64 0 64 Z')" }}
            />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 64">
              <path
                d="M0 63.5 C25 63.5 25 39.5 50 39.5"
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.12}
                strokeWidth={0.75}
                className="text-foreground"
              />
            </svg>
          </div>
        </div>

        {/* Right Side Bar - Flexible width */}
        <div className="flex-1 h-10 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md z-20 relative min-w-0 -ml-px border-b border-border/40">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line
              x1="0"
              y1="39.5"
              x2="100%"
              y2="39.5"
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={0.5}
              className="text-foreground"
            />
          </svg>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-white dark:bg-slate-950 border-b border-border p-4 lg:hidden shadow-lg"
          >
            <nav className="flex flex-col gap-2">
              {[...items.left, ...items.right].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-foreground cursor-pointer"
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  <item.icon className="w-4 h-4 opacity-70" />
                  <span>{item.label}</span>
                </a>
              ))}
              <div className="h-px bg-border my-2" />
              <Link
                to={userRole ? "/dashboard" : "/auth"}
                className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {userRole ? "Enter Academic Dashboard" : "Sign in to Portal"}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NotchNavbar;
