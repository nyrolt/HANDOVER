import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  GraduationCap,
  Users,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Building2,
  Lock,
  Mail,
  User as UserIcon,
  Hash,
  BookOpen,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/services/auth";
import { db } from "@/services/db";
import type { UserRole } from "@/types";
import { DashboardMockup } from "@/components/auth/DashboardMockup";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Handover — Sign In & Create Account" },
      {
        name: "description",
        content:
          "Sign in to Faculty workspace or create your Student or Teacher account on Handover.",
      },
    ],
  }),
  component: AuthPage,
});

type AuthMode = "signin" | "signup";

function AuthPage() {
  const { login, registerStudent, registerTeacher } = useAuth();
  const navigate = useNavigate();
  const sections = db.getSections();

  // Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState<AuthMode>("signin");

  // Sign In State
  const [signInRole, setSignInRole] = useState<UserRole>("teacher");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError, setSignInError] = useState<string | null>(null);

  // Sign Up State
  const [signUpRole, setSignUpRole] = useState<UserRole>("student");
  // Student Sign Up
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpRoll, setSignUpRoll] = useState("");
  const [signUpSectionId, setSignUpSectionId] = useState(sections[0]?.id || "");
  // Faculty Sign Up
  const [teacherDepartment, setTeacherDepartment] = useState("");
  const [teacherSectionName, setTeacherSectionName] = useState("");
  // Shared Sign Up Credentials
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mobile preview toggle
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Sync with URL query parameters on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      const roleParam = params.get("role");

      if (tabParam === "signup") {
        setAuthMode("signup");
      } else if (tabParam === "signin") {
        setAuthMode("signin");
      }

      if (roleParam === "student") {
        setSignInRole("student");
        setSignUpRole("student");
      } else if (roleParam === "teacher") {
        setSignInRole("teacher");
        setSignUpRole("teacher");
      }
    }
  }, []);

  // Quick fill helper for review & testing
  const handleQuickFill = (role: UserRole) => {
    if (role === "teacher") {
      setSignInRole("teacher");
      setSignInEmail("e.vance@university.edu");
      setSignInPassword("Faculty@2026");
    } else {
      setSignInRole("student");
      setSignInEmail("a.wright@student.university.edu");
      setSignInPassword("Password@123");
    }
    setSignInError(null);
  };

  // Handle Sign In submission
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);

    const res = login(signInEmail, signInRole, signInPassword || undefined);
    if (!res.success) {
      setSignInError(res.error || "Unable to sign in. Please verify your credentials.");
      return;
    }

    navigate({ to: "/dashboard" });
  };

  // Handle Account Registration submission
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);

    if (signUpPassword && signUpConfirmPassword && signUpPassword !== signUpConfirmPassword) {
      setSignUpError("Passwords do not match. Please re-enter.");
      return;
    }

    if (signUpRole === "teacher") {
      const res = registerTeacher({
        name: signUpName,
        email: signUpEmail,
        department: teacherDepartment,
        initialSectionName: teacherSectionName || undefined,
        password: signUpPassword || undefined,
      });

      if (!res.success) {
        setSignUpError(res.error || "Faculty registration failed. Please check your information.");
        return;
      }

      setSignUpSuccess(true);
      setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 400);
      return;
    }

    // Student Registration
    const res = registerStudent({
      name: signUpName,
      email: signUpEmail,
      rollNumber: signUpRoll,
      sectionId: signUpSectionId,
      password: signUpPassword || undefined,
    });

    if (!res.success) {
      setSignUpError(res.error || "Student registration failed. Please check your information.");
      return;
    }

    setSignUpSuccess(true);
    setTimeout(() => {
      navigate({ to: "/dashboard" });
    }, 400);
  };

  return (
    <main className="min-h-screen bg-[#F7F7F4] text-neutral-900 flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white font-bold flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform">
              H
            </div>
            <span className="font-bold text-base tracking-tight text-neutral-900">Handover</span>
          </Link>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-neutral-200/70 text-neutral-600 font-medium hidden sm:inline-block">
            Beta v2.4
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="xl:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-200/80 text-neutral-700 font-medium hover:bg-neutral-300 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{showMobilePreview ? "Show Form" : "Preview Dashboard"}</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 font-medium px-3 py-1.5 rounded-full hover:bg-neutral-200/60 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content: Split Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-4 lg:py-8 flex flex-col xl:flex-row items-center xl:items-start justify-center xl:justify-between gap-10 xl:gap-14">
        {/* Left Column: Devxa-style Auth Form */}
        <div
          className={`w-full max-w-[440px] shrink-0 transition-all ${
            showMobilePreview ? "hidden xl:block" : "block"
          }`}
        >
          <div className="space-y-6">
            {/* Form Header */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase font-semibold">
                {authMode === "signin" ? "WELCOME BACK" : "JOIN THE WORKSPACE"}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 leading-[1.15]">
                {authMode === "signin" ? (
                  <>
                    Sign in to{" "}
                    <span className="font-serif italic font-normal text-slate-800">your</span>{" "}
                    workspace.
                  </>
                ) : (
                  <>
                    Create{" "}
                    <span className="font-serif italic font-normal text-slate-800">your</span>{" "}
                    academic workspace.
                  </>
                )}
              </h1>

              <div className="text-xs text-neutral-500 pt-0.5">
                {authMode === "signin" ? (
                  <p>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signup");
                        setSignInError(null);
                        setSignUpError(null);
                      }}
                      className="font-semibold text-neutral-900 hover:text-blue-600 underline underline-offset-4 transition-colors"
                    >
                      Register
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signin");
                        setSignInError(null);
                        setSignUpError(null);
                      }}
                      className="font-semibold text-neutral-900 hover:text-blue-600 underline underline-offset-4 transition-colors"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </div>

            {/* Role Switcher Pill */}
            <div className="bg-[#EFEFEA] p-1 rounded-full grid grid-cols-2 gap-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  if (authMode === "signin") {
                    setSignInRole("teacher");
                  } else {
                    setSignUpRole("teacher");
                  }
                  setSignInError(null);
                  setSignUpError(null);
                }}
                className={`py-2 rounded-full flex items-center justify-center gap-2 transition-all ${
                  (authMode === "signin" ? signInRole === "teacher" : signUpRole === "teacher")
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Faculty Portal</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (authMode === "signin") {
                    setSignInRole("student");
                  } else {
                    setSignUpRole("student");
                  }
                  setSignInError(null);
                  setSignUpError(null);
                }}
                className={`py-2 rounded-full flex items-center justify-center gap-2 transition-all ${
                  (authMode === "signin" ? signInRole === "student" : signUpRole === "student")
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Student Portal</span>
              </button>
            </div>

            {/* Error & Success Feedback */}
            {signInError && (
              <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3 text-xs text-rose-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{signInError}</div>
              </div>
            )}

            {signUpError && (
              <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3 text-xs text-rose-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{signUpError}</div>
              </div>
            )}

            {signUpSuccess && (
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Account created successfully! Entering{" "}
                  {signUpRole === "teacher" ? "Faculty Workspace" : "Student Portal"}...
                </span>
              </div>
            )}

            {/* MODE 1: SIGN IN FORM */}
            {authMode === "signin" && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                {/* Email / Username Field */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono tracking-wider text-neutral-500 uppercase font-semibold">
                    EMAIL OR USERNAME
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder={
                        signInRole === "teacher"
                          ? "prof.vance@university.edu"
                          : "student@college.edu"
                      }
                      required
                      className="w-full bg-[#EFEFEA] hover:bg-[#EAEAE5] focus:bg-white text-neutral-900 placeholder:text-neutral-400 text-xs h-11 px-4 rounded-xl border border-transparent focus:border-neutral-300 focus:outline-none transition-all shadow-inner/10"
                    />
                    <Mail className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-mono tracking-wider text-neutral-500 uppercase font-semibold">
                      PASSWORD
                    </label>
                    <button
                      type="button"
                      onClick={() => handleQuickFill(signInRole)}
                      className="text-[11px] text-neutral-400 hover:text-neutral-700 transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-[#EFEFEA] hover:bg-[#EAEAE5] focus:bg-white text-neutral-900 placeholder:text-neutral-400 text-xs h-11 px-4 pr-10 rounded-xl border border-transparent focus:border-neutral-300 focus:outline-none transition-all shadow-inner/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Pill Button */}
                <button
                  type="submit"
                  className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all group mt-2"
                >
                  <span>
                    Login to {signInRole === "teacher" ? "Faculty Workspace" : "Student Portal"}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}

            {/* MODE 2: SIGN UP (CREATE ACCOUNT) FORM */}
            {authMode === "signup" && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono tracking-wider text-neutral-500 uppercase font-semibold">
                    FULL NAME
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder={
                        signUpRole === "teacher" ? "Dr. Eleanor Vance, Ph.D." : "Alexander Wright"
                      }
                      required
                      className="w-full bg-[#EFEFEA] hover:bg-[#EAEAE5] focus:bg-white text-neutral-900 placeholder:text-neutral-400 text-xs h-10 px-4 rounded-xl border border-transparent focus:border-neutral-300 focus:outline-none transition-all"
                    />
                    <UserIcon className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Institutional Email */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono tracking-wider text-neutral-500 uppercase font-semibold">
                    INSTITUTIONAL EMAIL
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder={
                        signUpRole === "teacher"
                          ? "e.vance@university.edu"
                          : "a.wright@student.university.edu"
                      }
                      required
                      className="w-full bg-[#EFEFEA] hover:bg-[#EAEAE5] focus:bg-white text-neutral-900 placeholder:text-neutral-400 text-xs h-10 px-4 rounded-xl border border-transparent focus:border-neutral-300 focus:outline-none transition-all"
                    />
                    <Mail className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Role Specific Fields */}
                {signUpRole === "student" ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-mono tracking-wider text-neutral-500 uppercase font-semibold">
                        ROLL NUMBER
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={signUpRoll}
                          onChange={(e) => setSignUpRoll(e.target.value)}
                          placeholder="2024-CS-001"
                          required
                          className="w-full bg-[#EFEFEA] hover:bg-[#EAEAE5] focus:bg-white text-neutral-900 placeholder:text-neutral-400 text-xs h-10 px-3.5 rounded-xl border border-transparent focus:border-neutral-300 focus:outline-none transition-all font-mono"
                        />
                        <Hash className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-mono tracking-wider text-neutral-500 uppercase font-semibold">
                        SECTION
                      </label>
                      <select
                        value={signUpSectionId}
                        onChange={(e) => setSignUpSectionId(e.target.value)}
                        required
                        className="w-full bg-[#EFEFEA] hover:bg-[#EAEAE5] focus:bg-white text-neutral-900 text-xs h-10 px-3 rounded-xl border border-transparent focus:border-neutral-300 focus:outline-none transition-all"
                      >
                        {sections.map((sec) => (
                          <option key={sec.id} value={sec.id}>
                            {sec.sectionName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-mono tracking-wider text-neutral-500 uppercase font-semibold">
                        DEPARTMENT
                      </label>
                      <div className="relative">
                        <Building2 className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-3.5 pointer-events-none" />
                        <input
                          type="text"
                          value={teacherDepartment}
                          onChange={(e) => setTeacherDepartment(e.target.value)}
                          placeholder="Computer Science"
                          required
                          className="w-full bg-[#EFEFEA] hover:bg-[#EAEAE5] focus:bg-white text-neutral-900 placeholder:text-neutral-400 text-xs h-10 px-3.5 rounded-xl border border-transparent focus:border-neutral-300 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-mono tracking-wider text-neutral-500 uppercase font-semibold">
                        INITIAL SECTION
                      </label>
                      <div className="relative">
                        <BookOpen className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-3.5 pointer-events-none" />
                        <input
                          type="text"
                          value={teacherSectionName}
                          onChange={(e) => setTeacherSectionName(e.target.value)}
                          placeholder="CS-401: Sec A"
                          required
                          className="w-full bg-[#EFEFEA] hover:bg-[#EAEAE5] focus:bg-white text-neutral-900 placeholder:text-neutral-400 text-xs h-10 px-3.5 rounded-xl border border-transparent focus:border-neutral-300 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Password & Confirm */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono tracking-wider text-neutral-500 uppercase font-semibold">
                      PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-[#EFEFEA] hover:bg-[#EAEAE5] focus:bg-white text-neutral-900 placeholder:text-neutral-400 text-xs h-10 px-3 pr-8 rounded-xl border border-transparent focus:border-neutral-300 focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-3 text-neutral-400 hover:text-neutral-700 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono tracking-wider text-neutral-500 uppercase font-semibold">
                      CONFIRM
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-[#EFEFEA] hover:bg-[#EAEAE5] focus:bg-white text-neutral-900 placeholder:text-neutral-400 text-xs h-10 px-3 pr-8 rounded-xl border border-transparent focus:border-neutral-300 focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-3 text-neutral-400 hover:text-neutral-700 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={signUpSuccess}
                  className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all group mt-2"
                >
                  <span>Create Account & Enter Workspace</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}

            {/* SSO / Social Divider */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <span className="relative bg-[#F7F7F4] px-3 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                OR SIGN IN WITH
              </span>
            </div>

            {/* Social / SSO Buttons (Devxa style pill buttons) */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickFill("student")}
                className="w-full h-11 bg-white hover:bg-neutral-50 border border-neutral-200/90 rounded-full text-xs font-medium text-neutral-800 flex items-center justify-center gap-2.5 shadow-2xs transition-all hover:border-neutral-300"
              >
                {/* Google Icon SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("teacher")}
                className="w-full h-11 bg-white hover:bg-neutral-50 border border-neutral-200/90 rounded-full text-xs font-medium text-neutral-800 flex items-center justify-center gap-2.5 shadow-2xs transition-all hover:border-neutral-300"
              >
                {/* GitHub Icon SVG */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </div>

            {/* Quick Test Demo Credentials */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                <span>Instant Demo Accounts</span>
                <span className="text-neutral-500">1-Click Fill</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill("teacher")}
                  className="px-3 py-2 bg-white/70 hover:bg-white border border-neutral-200/80 rounded-xl text-left transition-all text-xs group"
                >
                  <div className="font-semibold text-neutral-800 text-[11px] flex items-center justify-between">
                    <span>Prof. Vance</span>
                    <span className="text-[10px] text-indigo-600 font-mono">Faculty</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono truncate">
                    e.vance@univ.edu
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill("student")}
                  className="px-3 py-2 bg-white/70 hover:bg-white border border-neutral-200/80 rounded-xl text-left transition-all text-xs group"
                >
                  <div className="font-semibold text-neutral-800 text-[11px] flex items-center justify-between">
                    <span>Alex Chen</span>
                    <span className="text-[10px] text-emerald-600 font-mono">Student</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono truncate">
                    a.wright@univ.edu
                  </div>
                </button>
              </div>
            </div>

            {/* Footer inside Left Column */}
            <div className="pt-4 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-400">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-neutral-900 text-white font-bold flex items-center justify-center text-[9px]">
                  H
                </div>
                <span>© 2026 HANDOVER</span>
              </div>
              <div className="flex items-center gap-3">
                <a href="#privacy" className="hover:text-neutral-700 transition-colors">
                  Privacy
                </a>
                <a href="#terms" className="hover:text-neutral-700 transition-colors">
                  Terms
                </a>
                <a href="#docs" className="hover:text-neutral-700 transition-colors">
                  Docs
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Application Window Showcase */}
        <div
          className={`flex-1 w-full max-w-[840px] flex items-center justify-center transition-all ${
            showMobilePreview ? "block" : "hidden xl:flex"
          }`}
        >
          <DashboardMockup />
        </div>
      </div>

      {/* Global Minimal Bottom Strip */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 border-t border-neutral-200/50">
        <div>Handover Academic OS — Continuous Evaluation & Collaboration Workspace</div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <span>Multi-tenant Isolation Verified</span>
          <span>•</span>
          <span>Role-Based Access Control (RBAC)</span>
        </div>
      </footer>
    </main>
  );
}
