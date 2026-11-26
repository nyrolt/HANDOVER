import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  GraduationCap,
  Users,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  UserCheck,
  Building2,
  Lock,
  Mail,
  User as UserIcon,
  Hash,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/services/auth";
import { db } from "@/services/db";
import type { UserRole } from "@/types";
import { HandoverLogo } from "@/components/common/HandoverLogo";

export const Route = createFileRoute("/auth")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { tab?: string | undefined; mode?: string | undefined; role?: string | undefined } => ({
    tab: typeof search["tab"] === "string" ? search["tab"] : undefined,
    mode: typeof search["mode"] === "string" ? search["mode"] : undefined,
    role: typeof search["role"] === "string" ? search["role"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Handover — Sign In & Account Registration" },
      {
        name: "description",
        content:
          "Sign in to Faculty workspace or register your Student / Teacher portal account on Handover.",
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
  const [signUpSectionId, setSignUpSectionId] = useState(sections[0]?.id || "__custom__");
  const [customSectionName, setCustomSectionName] = useState("");
  // Faculty Sign Up
  const [teacherDepartment, setTeacherDepartment] = useState("");
  const [teacherSectionName, setTeacherSectionName] = useState("");
  // Shared Sign Up Credentials
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

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

  // Handle Sign In submission
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);

    const res = login(signInEmail, signInRole, signInPassword || undefined);
    if (!res.success) {
      setSignInError(res.error || "Unable to sign in. Please verify your credentials.");
      return;
    }

    // Direct redirection: Teacher to teacher dashboard, Student to student dashboard
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
    const resolvedSection =
      sections.length === 0 || signUpSectionId === "__custom__"
        ? customSectionName.trim()
        : signUpSectionId;

    if (!resolvedSection) {
      setSignUpError("Please specify or enter your class / section.");
      return;
    }

    const res = registerStudent({
      name: signUpName,
      email: signUpEmail,
      rollNumber: signUpRoll,
      sectionId: resolvedSection,
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
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Return to website home link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4 flex justify-between items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Handover Home</span>
        </Link>
        <span className="text-[11px] text-slate-400 font-mono">Academic Portal</span>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mx-auto">
          <HandoverLogo size="lg" />
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
          Handover Academic OS
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Digital spreadsheet workspace for College Faculty & Students
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-7 px-6 shadow-xs border border-slate-200/80 rounded-xl sm:px-8 space-y-6">
          {/* Main Mode Toggle: Sign In vs Register */}
          <div className="bg-slate-100 p-1 rounded-lg grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode("signin");
                setSignInError(null);
                setSignUpError(null);
              }}
              className={`text-xs py-2 font-medium rounded-md transition-all ${
                authMode === "signin"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("signup");
                setSignInError(null);
                setSignUpError(null);
              }}
              className={`text-xs py-2 font-medium rounded-md transition-all ${
                authMode === "signup"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* MODE 1: SIGN IN */}
          {authMode === "signin" && (
            <div className="space-y-5">
              {/* Role Selector Tabs */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700">Choose Portal Role</label>
                  <span className="text-[10px] text-slate-400">
                    Redirects to your specific portal
                  </span>
                </div>
                <Tabs
                  value={signInRole}
                  onValueChange={(v) => {
                    setSignInRole(v as UserRole);
                    setSignInError(null);
                  }}
                >
                  <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-lg">
                    <TabsTrigger value="teacher" className="text-xs font-medium">
                      <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                      Teacher Portal
                    </TabsTrigger>
                    <TabsTrigger value="student" className="text-xs font-medium">
                      <Users className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                      Student Portal
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Error Alert */}
              {signInError && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{signInError}</div>
                </div>
              )}

              {/* Sign In Form */}
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {signInRole === "teacher"
                      ? "Faculty Institutional Email"
                      : "Student College Email"}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <Input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder={
                        signInRole === "teacher"
                          ? "e.g. faculty@college.edu"
                          : "e.g. student@college.edu"
                      }
                      required
                      className="text-xs h-9 pl-9 bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700">Password</label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <Input
                      type="password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Enter your account password"
                      required
                      className="text-xs h-9 pl-9 bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full text-white text-xs h-9 font-medium shadow-xs justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  <span>
                    Sign In to {signInRole === "teacher" ? "Teacher Workspace" : "Student Portal"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </form>

              {/* Toggle to signup prompt */}
              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Don't have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("signup");
                      setSignUpRole(signInRole);
                      setSignUpError(null);
                    }}
                    className="font-medium text-slate-800 hover:underline"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* MODE 2: ACCOUNT REGISTRATION (SIGN UP) */}
          {authMode === "signup" && (
            <div className="space-y-4">
              {/* Role Toggle for Registration */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700">
                    Register Account Type
                  </label>
                  <span className="text-[10px] text-slate-400">Select your college role</span>
                </div>
                <Tabs
                  value={signUpRole}
                  onValueChange={(v) => {
                    setSignUpRole(v as UserRole);
                    setSignUpError(null);
                  }}
                >
                  <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-lg">
                    <TabsTrigger value="student" className="text-xs font-medium">
                      <Users className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                      Student Account
                    </TabsTrigger>
                    <TabsTrigger value="teacher" className="text-xs font-medium">
                      <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                      Faculty Account
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Error Alert */}
              {signUpError && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{signUpError}</div>
                </div>
              )}

              {/* Success Notification */}
              {signUpSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Account created successfully! Redirecting to your{" "}
                    {signUpRole === "teacher" ? "Teacher Dashboard" : "Student Portal"}...
                  </span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <Input
                      type="text"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder={
                        signUpRole === "teacher"
                          ? "e.g. Dr. Jane Smith"
                          : "e.g. John Doe"
                      }
                      required
                      className="text-xs h-9 pl-9 bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {signUpRole === "teacher"
                      ? "Institutional Faculty Email"
                      : "Student College Email"}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <Input
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder={
                        signUpRole === "teacher"
                          ? "e.g. faculty@college.edu"
                          : "e.g. student@college.edu"
                      }
                      required
                      className="text-xs h-9 pl-9 bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* ROLE-SPECIFIC FIELDS */}
                {signUpRole === "student" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Roll Number
                      </label>
                      <div className="relative">
                        <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <Input
                          type="text"
                          value={signUpRoll}
                          onChange={(e) => setSignUpRoll(e.target.value)}
                          placeholder="e.g. CS-001 or 101"
                          required
                          className="text-xs h-9 pl-9 bg-slate-50 focus:bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Assigned Class / Section
                      </label>
                      <div className="space-y-2">
                        {sections.length > 0 ? (
                          <>
                            <select
                              value={signUpSectionId}
                              onChange={(e) => setSignUpSectionId(e.target.value)}
                              className="w-full text-xs h-9 px-3 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium text-slate-800"
                            >
                              {sections.map((sec) => (
                                <option key={sec.id} value={sec.id}>
                                  {sec.sectionName}
                                </option>
                              ))}
                              <option value="__custom__">+ Enter new section...</option>
                            </select>
                            {signUpSectionId === "__custom__" && (
                              <Input
                                type="text"
                                value={customSectionName}
                                onChange={(e) => setCustomSectionName(e.target.value)}
                                placeholder="e.g. CSE - Section A"
                                required
                                className="text-xs h-9 bg-slate-50 focus:bg-white"
                              />
                            )}
                          </>
                        ) : (
                          <Input
                            type="text"
                            value={customSectionName}
                            onChange={(e) => setCustomSectionName(e.target.value)}
                            placeholder="e.g. CSE - Section A"
                            required
                            className="text-xs h-9 bg-slate-50 focus:bg-white"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Department
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <Input
                          type="text"
                          value={teacherDepartment}
                          onChange={(e) => setTeacherDepartment(e.target.value)}
                          placeholder="e.g. Computer Science"
                          required
                          className="text-xs h-9 pl-9 bg-slate-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Initial Class Section
                      </label>
                      <div className="relative">
                        <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <Input
                          type="text"
                          value={teacherSectionName}
                          onChange={(e) => setTeacherSectionName(e.target.value)}
                          placeholder="e.g. CSE - Section A"
                          required
                          className="text-xs h-9 pl-9 bg-slate-50 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <Input
                        type="password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="text-xs h-9 pl-9 bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <Input
                        type="password"
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="text-xs h-9 pl-9 bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={signUpSuccess}
                  className="w-full text-white text-xs h-9 font-medium shadow-xs justify-center gap-1.5 mt-2 bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>
                    Register & enter{" "}
                    {signUpRole === "teacher" ? "Faculty Workspace" : "Student Portal"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </form>

              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("signin");
                      setSignInRole(signUpRole);
                      setSignInError(null);
                    }}
                    className="font-medium text-slate-800 hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
