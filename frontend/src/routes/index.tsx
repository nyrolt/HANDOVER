import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  GraduationCap,
  Users,
  FileSpreadsheet,
  Layers,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  UserCheck,
  LogIn,
  LogOut,
  Building2,
  ChevronDown,
  Download,
  Upload,
  Calendar,
  Lock,
  HelpCircle,
  BarChart3,
  Zap,
  Activity,
  Check,
  X,
  Laptop,
  Menu,
  Database,
  KeyRound,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/auth";
import { HandoverLogo } from "@/components/common/HandoverLogo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Handover — Academic Operating System for College Faculty & Students" },
      {
        name: "description",
        content:
          "Professional spreadsheet-first workspace replacing fragmented Excel files for college departments. Manage continuous evaluation marks, class sections, assignments, and collaborative project teams with role-based security.",
      },
      {
        name: "keywords",
        content:
          "college management system, teacher gradebook, student portal, continuous evaluation marks, group projects, academic marksheet, higher education SaaS, spreadsheet gradebook, handover project",
      },
      { name: "author", content: "Handover Academic Systems" },
      { name: "theme-color", content: "#4F46E5" },
      { property: "og:title", content: "Handover — College Teacher & Student Management System" },
      {
        property: "og:description",
        content:
          "Unified digital workspace for faculty continuous marks, class sections, and student project groups.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Handover" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Handover — College Teacher & Student Management System",
      },
      {
        name: "twitter:description",
        content:
          "Unified digital workspace for faculty continuous marks, class sections, and student project groups.",
      },
    ],
  }),
  component: IndexPage,
});

// Interactive demo data model
interface DemoRow {
  rollNo: string;
  name: string;
  email: string;
  group: string;
  internal: number;
  lab: number;
  practical: number;
  project: number;
}

const INITIAL_DEMO_ROWS: DemoRow[] = [
  {
    rollNo: "2024-CS-001",
    name: "Alexander Wright",
    email: "a.wright@student.university.edu",
    group: "Team Veritas",
    internal: 18,
    lab: 19,
    practical: 17,
    project: 18,
  },
  {
    rollNo: "2024-CS-002",
    name: "Sophia Martinez",
    email: "s.martinez@student.university.edu",
    group: "Team Veritas",
    internal: 19,
    lab: 20,
    practical: 18,
    project: 19,
  },
  {
    rollNo: "2024-CS-003",
    name: "Marcus Chen",
    email: "m.chen@student.university.edu",
    group: "Team Veritas",
    internal: 17,
    lab: 18,
    practical: 18,
    project: 19,
  },
  {
    rollNo: "2024-CS-004",
    name: "Olivia Patel",
    email: "o.patel@student.university.edu",
    group: "Team AegisFlow",
    internal: 18,
    lab: 19,
    practical: 19,
    project: 17,
  },
  {
    rollNo: "2024-CS-005",
    name: "Liam O'Connor",
    email: "l.oconnor@student.university.edu",
    group: "Team AegisFlow",
    internal: 16,
    lab: 17,
    practical: 18,
    project: 18,
  },
];

function IndexPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeDemoTab, setActiveDemoTab] = useState<"spreadsheet" | "student" | "projects">(
    "spreadsheet",
  );
  const [demoRows, setDemoRows] = useState<DemoRow[]>(INITIAL_DEMO_ROWS);
  const [selectedDemoSection, setSelectedDemoSection] = useState<string>("sec-cse-a");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Live calculation helper
  const handleMarkChange = (index: number, field: keyof DemoRow, val: string) => {
    const num = Math.min(20, Math.max(0, parseInt(val, 10) || 0));
    setDemoRows((prev) => {
      const updated = [...prev];
      const row = updated[index];
      if (row) {
        updated[index] = { ...row, [field]: num };
      }
      return updated;
    });
  };

  const computeGrade = (total: number, max = 80) => {
    const pct = (total / max) * 100;
    if (pct >= 90)
      return {
        label: "O",
        title: "Outstanding",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200/80 ring-emerald-500/20",
      };
    if (pct >= 80)
      return {
        label: "A+",
        title: "Excellent",
        color: "text-indigo-700 bg-indigo-50 border-indigo-200/80 ring-indigo-500/20",
      };
    if (pct >= 70)
      return {
        label: "A",
        title: "Very Good",
        color: "text-blue-700 bg-blue-50 border-blue-200/80 ring-blue-500/20",
      };
    if (pct >= 60)
      return {
        label: "B+",
        title: "Good",
        color: "text-amber-700 bg-amber-50 border-amber-200/80 ring-amber-500/20",
      };
    return {
      label: "B",
      title: "Above Average",
      color: "text-slate-700 bg-slate-100 border-slate-200 ring-slate-500/20",
    };
  };

  // Calculate live statistics
  const currentTotalMarks = demoRows.reduce(
    (acc, row) => acc + row.internal + row.lab + row.practical + row.project,
    0,
  );
  const classAvg = Math.round((currentTotalMarks / (demoRows.length * 80)) * 100 * 10) / 10;
  const topScore = Math.max(...demoRows.map((r) => r.internal + r.lab + r.practical + r.project));

  const handleExportMock = () => {
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white antialiased">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" />

      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 transition-all">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-bold text-slate-900 group">
            <HandoverLogo size="md" />
            <div className="flex flex-col">
              <span className="tracking-tight text-lg font-semibold text-slate-900 leading-none">
                Handover
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-medium tracking-normal mt-0.5">
                Academic OS
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#portals" className="hover:text-indigo-600 transition-colors">
              Workspaces
            </a>
            <a href="#live-preview" className="hover:text-indigo-600 transition-colors">
              Interactive Studio
            </a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">
              Architecture
            </a>
            <a href="#why-not-excel" className="hover:text-indigo-600 transition-colors">
              Excel vs Handover
            </a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200 text-xs font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    {user.role === "teacher" ? "👨‍🏫 Faculty" : "👨‍🎓 Student"}: {user.name}
                  </span>
                </div>

                <Button
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs h-9 gap-1.5 font-semibold shadow-sm shadow-indigo-500/25"
                >
                  <span>Open {user.role === "teacher" ? "Teacher" : "Student"} Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 h-9"
                >
                  <LogOut className="w-3.5 h-3.5 sm:mr-1" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth" search={{ tab: "signin" }}>
                  <Button
                    variant="ghost"
                    className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs h-9 font-semibold gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-600" />
                    <span>Sign In</span>
                  </Button>
                </Link>

                <Link to="/auth" search={{ tab: "signup" }}>
                  <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs h-9 font-semibold shadow-sm shadow-indigo-500/25 gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Register Account</span>
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-5 py-4 space-y-3 shadow-lg z-30 sticky top-16">
          <nav className="flex flex-col space-y-1.5 text-xs font-semibold text-slate-700">
            <a
              href="#portals"
              onClick={() => setMobileNavOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              Workspaces (Faculty & Student)
            </a>
            <a
              href="#live-preview"
              onClick={() => setMobileNavOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              Interactive Studio Preview
            </a>
            <a
              href="#features"
              onClick={() => setMobileNavOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              System Architecture & Strengths
            </a>
            <a
              href="#why-not-excel"
              onClick={() => setMobileNavOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              Why Spreadsheets Fail Academic Workflows
            </a>
            <a
              href="#faq"
              onClick={() => setMobileNavOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              Frequently Asked Questions
            </a>
          </nav>
        </div>
      )}

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 md:py-16 space-y-24">
        {/* HERO SECTION */}
        <section className="max-w-4xl mx-auto text-center space-y-6 pt-2 md:pt-6">
          {/* Authentic status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium bg-white border border-slate-200 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-slate-700">Academic Year 2026-2027</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-mono">Verified College OS</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.12] text-slate-900">
            The modern academic workspace for faculty and students
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Eliminate chaotic, version-drifted Excel spreadsheets. Empower faculty with an inline
            continuous marks engine, class sections, and 1-click CSV sync — while students track
            verified transcripts and organize group projects.
          </p>

          {/* Quick Capability Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Inline Spreadsheet Gradebook</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Bounded Continuous Marks (0 - 20)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Collaborative Project Teams</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Multi-Tenant Section Scoping</span>
            </div>
          </div>
        </section>

        {/* WORKSPACE PORTALS: DUAL ENTRANCE CARDS */}
        <section id="portals" className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* FACULTY WORKSPACE CARD */}
          <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-indigo-500/30 via-slate-200 to-indigo-500/10 shadow-lg shadow-indigo-500/5 hover:shadow-xl hover:shadow-indigo-500/15 transition-all duration-300">
            <div className="bg-white rounded-3xl p-6 sm:p-8 h-full flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/70 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    Faculty Management Mode
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Faculty Workspace
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Designed for course instructors and department chairs. Rapid continuous marks
                    entry with keyboard navigation (Tab/Enter), automated grade distributions,
                    coursework assignments, and 1-click proposal review.
                  </p>
                </div>

                {/* Capability Badges */}
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 rounded-xl p-2.5">
                    <FileSpreadsheet className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Inline Gradebook</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 rounded-xl p-2.5">
                    <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Team Approvals</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 rounded-xl p-2.5">
                    <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-800">0-20 Marks Engine</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 rounded-xl p-2.5">
                    <Download className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-800">CSV Export & Import</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Link
                    to="/auth"
                    search={{ tab: "signin", role: "teacher" }}
                    className="w-full block"
                  >
                    <Button className="w-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs h-11 font-semibold justify-center shadow-md shadow-indigo-500/20 gap-2">
                      <LogIn className="w-4 h-4" />
                      <span>Enter Faculty Portal</span>
                    </Button>
                  </Link>

                  <Link
                    to="/auth"
                    search={{ tab: "signup", role: "teacher" }}
                    className="w-full block"
                  >
                    <Button
                      variant="outline"
                      className="w-full border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/50 text-xs h-11 font-semibold justify-center gap-2"
                    >
                      <UserCheck className="w-4 h-4 text-indigo-600" />
                      <span>Register Instructor</span>
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                  <span>Enrolled: CSE-A, CSE-B & IT-A</span>
                  <span className="font-mono text-indigo-600 font-medium">
                    Single Sign-On Ready
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STUDENT PORTAL CARD */}
          <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-emerald-500/30 via-slate-200 to-teal-500/10 shadow-lg shadow-emerald-500/5 hover:shadow-xl hover:shadow-emerald-500/15 transition-all duration-300">
            <div className="bg-white rounded-3xl p-6 sm:p-8 h-full flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/70 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Student Access Portal
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Student Academic Portal
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Personalized, protected student hub. View official continuous marks transcripts,
                    verify assignment deadlines, propose project groups with section peers, and
                    receive official instructor notices.
                  </p>
                </div>

                {/* Capability Badges */}
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 rounded-xl p-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Verified Transcripts</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 rounded-xl p-2.5">
                    <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Propose Teammates</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 rounded-xl p-2.5">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Course Deadlines</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 rounded-xl p-2.5">
                    <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Isolated IDOR Privacy</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Link
                    to="/auth"
                    search={{ tab: "signin", role: "student" }}
                    className="w-full block"
                  >
                    <Button
                      variant="outline"
                      className="w-full border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/50 text-xs h-11 font-semibold justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4 text-emerald-600" />
                      <span>Student Sign In</span>
                    </Button>
                  </Link>

                  <Link
                    to="/auth"
                    search={{ tab: "signup", role: "student" }}
                    className="w-full block"
                  >
                    <Button className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white text-xs h-11 font-semibold justify-center shadow-md shadow-emerald-500/20 gap-2">
                      <UserCheck className="w-4 h-4" />
                      <span>Register Student</span>
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                  <span>Self-registration open for students</span>
                  <span className="font-mono text-emerald-600 font-medium">Read-Only Privacy</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE WORKSPACE STUDIO CANVAS */}
        <section id="live-preview" className="space-y-6 pt-4">
          <div className="text-center space-y-2.5 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              <Laptop className="w-3.5 h-3.5" />
              <span>Interactive Studio Sandbox</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Test-drive the academic workspace live
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Experience the actual interface. Edit continuous marks cells inline below to see
              automatic aggregation, grade tier rules, and class stats recompute in real time.
            </p>
          </div>

          {/* Studio Browser Frame */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden max-w-5xl mx-auto">
            {/* macOS Browser Header / Bezel */}
            <div className="bg-slate-900 text-slate-200 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
              {/* Window Controls & URL bar */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono text-[11px] text-slate-300">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>https://handover.internal/cse-301/section-a/gradebook</span>
                </div>
              </div>

              {/* Status pill */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Node: Active</span>
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">&lt; 15ms compute</span>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="bg-slate-50/90 border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">
                  View:
                </span>
                <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setActiveDemoTab("spreadsheet")}
                    className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      activeDemoTab === "spreadsheet"
                        ? "bg-white text-indigo-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Faculty Spreadsheet</span>
                  </button>
                  <button
                    onClick={() => setActiveDemoTab("student")}
                    className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      activeDemoTab === "student"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Student Transcript</span>
                  </button>
                  <button
                    onClick={() => setActiveDemoTab("projects")}
                    className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      activeDemoTab === "projects"
                        ? "bg-white text-violet-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Project Teams</span>
                  </button>
                </div>
              </div>

              {/* Class Section Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Selected Section:</span>
                <select
                  value={selectedDemoSection}
                  onChange={(e) => setSelectedDemoSection(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="sec-cse-a">CS-301: Algorithms (Sec A — 42 Students)</option>
                  <option value="sec-cse-b">CS-301: Algorithms (Sec B — 38 Students)</option>
                  <option value="sec-it-a">IT-204: Database Systems (Sec A — 35 Students)</option>
                </select>
              </div>
            </div>

            {/* TAB 1: FACULTY SPREADSHEET LIVE PREVIEW */}
            {activeDemoTab === "spreadsheet" && (
              <div className="p-4 sm:p-6 space-y-4">
                {/* Stats Summary Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      Class Average
                    </span>
                    <div className="text-xl font-bold font-mono text-indigo-900">{classAvg}%</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      Highest Score
                    </span>
                    <div className="text-xl font-bold font-mono text-emerald-700">
                      {topScore} / 80
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      Passing Criteria
                    </span>
                    <div className="text-xl font-bold font-mono text-slate-800">40.0% Minimum</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      Autosave Status
                    </span>
                    <div className="text-xl font-bold font-mono text-emerald-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Saved to Memory
                    </div>
                  </div>
                </div>

                {/* Instructions bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>
                      Live Cell Editing: Click any mark cell below and enter values between{" "}
                      <strong className="text-slate-800">0 and 20</strong>
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 font-mono text-[11px]">
                    <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                      Tab
                    </span>
                    <span>Next Cell</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200 ml-2">
                      Enter
                    </span>
                    <span>Next Student</span>
                  </div>
                </div>

                {/* Spreadsheet Table */}
                <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                        <th className="py-3 px-3 w-16 font-mono text-slate-500">Roll No</th>
                        <th className="py-3 px-4 min-w-[150px]">Student Name</th>
                        <th className="py-3 px-4 min-w-[130px]">Project Team</th>
                        <th className="py-3 px-3 text-center w-24">Internal /20</th>
                        <th className="py-3 px-3 text-center w-24">Lab /20</th>
                        <th className="py-3 px-3 text-center w-24">Practical /20</th>
                        <th className="py-3 px-3 text-center w-24">Project /20</th>
                        <th className="py-3 px-3 text-center w-24 font-mono">Total /80</th>
                        <th className="py-3 px-3 text-center w-24">Grade Tier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {demoRows.map((row, idx) => {
                        const total = row.internal + row.lab + row.practical + row.project;
                        const grade = computeGrade(total);
                        return (
                          <tr key={row.rollNo} className="hover:bg-indigo-50/30 transition-colors">
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-600 bg-slate-50/50">
                              {row.rollNo}
                            </td>
                            <td className="py-2.5 px-4 font-semibold text-slate-900">
                              {row.name}
                              <div className="text-[10px] text-slate-400 font-normal font-mono">
                                {row.email}
                              </div>
                            </td>
                            <td className="py-2.5 px-4 text-slate-600">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-mono">
                                {row.group}
                              </span>
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={row.internal}
                                onChange={(e) => handleMarkChange(idx, "internal", e.target.value)}
                                className="w-14 text-center py-1 font-mono text-xs font-bold bg-white border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                              />
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={row.lab}
                                onChange={(e) => handleMarkChange(idx, "lab", e.target.value)}
                                className="w-14 text-center py-1 font-mono text-xs font-bold bg-white border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                              />
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={row.practical}
                                onChange={(e) => handleMarkChange(idx, "practical", e.target.value)}
                                className="w-14 text-center py-1 font-mono text-xs font-bold bg-white border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                              />
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={row.project}
                                onChange={(e) => handleMarkChange(idx, "project", e.target.value)}
                                className="w-14 text-center py-1 font-mono text-xs font-bold bg-white border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                              {total}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold border ring-1 ${grade.color}`}
                                title={grade.title}
                              >
                                {grade.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-2 gap-3">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <span>
                      Bounded clamping: values outside 0 - 20 are automatically constrained.
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleExportMock}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{copiedNotification ? "CSV Exported!" : "Export Section CSV"}</span>
                    </button>
                    <button
                      onClick={handleExportMock}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Import Roster</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STUDENT MARKSHEET LIVE PREVIEW */}
            {activeDemoTab === "student" && (
              <div className="p-6 space-y-6">
                {/* Official Student Card */}
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold flex items-center justify-center text-base shadow-sm">
                      AW
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-base">
                          Alexander Wright
                        </h4>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Enrolled
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Roll: 2024-CS-001 • Section: CS-301 Algorithms (Sec A) • Dept. of CSE
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                      <ShieldCheck className="w-4 h-4" />
                      Official Verified Transcript
                    </span>
                  </div>
                </div>

                {/* 4 Evaluation Pillar Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                      Internal Exam
                    </span>
                    <div className="text-2xl font-black text-slate-900 font-mono">18 / 20</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[90%]" />
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold block">
                      90% Performance
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                      Lab Record & Experiments
                    </span>
                    <div className="text-2xl font-black text-slate-900 font-mono">19 / 20</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[95%]" />
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold block">
                      95% Performance
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                      Practical Examination
                    </span>
                    <div className="text-2xl font-black text-slate-900 font-mono">17 / 20</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[85%]" />
                    </div>
                    <span className="text-[11px] text-indigo-600 font-semibold block">
                      85% Performance
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                      Project Milestones
                    </span>
                    <div className="text-2xl font-black text-slate-900 font-mono">18 / 20</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[90%]" />
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold block">
                      90% Performance
                    </span>
                  </div>
                </div>

                {/* Cumulative Result Box */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-xs font-semibold text-slate-500 font-mono uppercase tracking-wider">
                      Cumulative Continuous Score
                    </span>
                    <div className="text-3xl font-black text-slate-900 font-mono">
                      72 / 80{" "}
                      <span className="text-sm font-semibold text-slate-500 font-sans">
                        (90.0% Overall Aggregate)
                      </span>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="text-xs font-semibold text-slate-500 block mb-1">
                      Continuous Grade Tier
                    </span>
                    <span className="inline-block px-4 py-1.5 rounded-xl text-sm font-black bg-emerald-100 text-emerald-800 border border-emerald-300 ring-2 ring-emerald-500/10">
                      Grade O (Outstanding)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: GROUP PROJECTS LIVE PREVIEW */}
            {activeDemoTab === "projects" && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Team 1 Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-md font-mono">
                        Team Veritas • 3 Members
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Faculty Approved
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-base">
                        Veritas: Fault-Tolerant Distributed Key-Value Store
                      </h4>
                      <p className="text-xs text-slate-500">
                        Guide: Dr. Eleanor Vance, Ph.D. • Status: In Progress
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                        Official Roster:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-md font-medium text-slate-800">
                          👑 Alexander Wright (Leader)
                        </span>
                        <span className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-md font-medium text-slate-700">
                          Sophia Martinez
                        </span>
                        <span className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-md font-medium text-slate-700">
                          Marcus Chen
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Evaluation Milestone:</span>
                      <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        18 / 20 Marks
                      </span>
                    </div>
                  </div>

                  {/* Team 2 Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200/80 px-2.5 py-1 rounded-md font-mono">
                        Team AegisFlow • 3 Members
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Faculty Approved
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-base">
                        AegisFlow: Real-Time Stream Processing & Telemetry
                      </h4>
                      <p className="text-xs text-slate-500">
                        Guide: Dr. Eleanor Vance, Ph.D. • Status: In Progress
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                        Official Roster:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-md font-medium text-slate-800">
                          👑 Olivia Patel (Leader)
                        </span>
                        <span className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-md font-medium text-slate-700">
                          Liam O'Connor
                        </span>
                        <span className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-md font-medium text-slate-700">
                          Isabella Rossi
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Evaluation Milestone:</span>
                      <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                        19 / 20 Marks
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* METRICS & RELIABILITY TICKER */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 text-center space-y-1 shadow-xs hover:border-indigo-300 transition-all">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent font-mono">
              0
            </div>
            <div className="text-xs font-bold text-slate-800">Data Loss Incidents</div>
            <p className="text-[11px] text-slate-500">Atomic state persistence engine</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 text-center space-y-1 shadow-xs hover:border-emerald-300 transition-all">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-mono">
              4-in-1
            </div>
            <div className="text-xs font-bold text-slate-800">Continuous Assessment</div>
            <p className="text-[11px] text-slate-500">Internal, Lab, Practical & Project</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 text-center space-y-1 shadow-xs hover:border-purple-300 transition-all">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-mono">
              &lt; 150ms
            </div>
            <div className="text-xs font-bold text-slate-800">Reactive Autosave</div>
            <p className="text-[11px] text-slate-500">Instant background write on blur</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 text-center space-y-1 shadow-xs hover:border-amber-300 transition-all">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-mono">
              100%
            </div>
            <div className="text-xs font-bold text-slate-800">Section Isolated</div>
            <p className="text-[11px] text-slate-500">Strict multi-tenant security</p>
          </div>
        </section>

        {/* BENTO ARCHITECTURE & SYSTEM CAPABILITIES */}
        <section id="features" className="space-y-10 pt-4">
          <div className="text-center space-y-2.5 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              <Zap className="w-3.5 h-3.5" />
              <span>System Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Engineered for academic faculty and department workflows
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Every workflow you need to coordinate courses, calculate grades, and review student
              projects without switching between disparate tools.
            </p>
          </div>

          {/* Asymmetric Bento Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Bento 1: Inline Spreadsheet Gradebook (Wide 2-col) */}
            <div className="md:col-span-2 bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/20 border border-slate-200/90 rounded-3xl p-7 space-y-5 shadow-xs hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-1 rounded-full">
                  Keyboard Driven
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  Excel-Like Continuous Marks Gradebook
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Navigate seamlessly using Tab, Shift+Tab, and Enter keys. Frozen student names and
                  roll numbers ensure frictionless horizontal scrolling. Automatic bounding clamps
                  prevent out-of-bounds inputs (strictly 0 to 20).
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono text-slate-600">
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                  Auto-bounding [0, 20]
                </span>
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                  Instant Grade Tiers (O, A+, A, B+, B, F)
                </span>
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                  Zero Formula Corruption
                </span>
              </div>
            </div>

            {/* Bento 2: Multi-Tenant Section Isolation (1-col) */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-7 space-y-5 shadow-xs hover:border-emerald-300 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Independent Class Sections</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Strict multi-tenancy ensures CSE-A, CSE-B, and IT-A records never leak. Each
                  section maintains isolated roll rosters, coursework, and teams.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-md">
                  Multi-tenant Scoped
                </span>
              </div>
            </div>

            {/* Bento 3: Dual Collaborative Project Engine (1-col) */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-7 space-y-5 shadow-xs hover:border-purple-300 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Dual Group Project Engine</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Students propose project titles and invite classmates. Instructors verify
                  eligibility, assign faculty guides, and record milestone marks in one click.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-purple-700 bg-purple-50 border border-purple-200/70 px-2.5 py-1 rounded-md">
                  Proposal & Approval Flow
                </span>
              </div>
            </div>

            {/* Bento 4: 1-Click CSV Interoperability (Wide 2-col) */}
            <div className="md:col-span-2 bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/20 border border-slate-200/90 rounded-3xl p-7 space-y-5 shadow-xs hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Download className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                  ERP Compatible
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  Bi-Directional CSV Synchronization
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Export complete section records to clean CSV formats ready for registrar
                  submission. Seamlessly batch-import student rosters from university administrative
                  files with automatic deduplication.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono text-slate-600">
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                  UTF-8 Formatted
                </span>
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                  Formula Verification
                </span>
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                  Instant Administrative Export
                </span>
              </div>
            </div>

            {/* Bento 5: Centralized RBAC Security (3-col full width) */}
            <div className="md:col-span-3 bg-white border border-slate-200/90 rounded-3xl p-7 space-y-4 shadow-xs hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Centralized Authorization & Privacy Protection
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Enforced by single-source-of-truth authorization check{" "}
                  <code className="text-indigo-600 font-mono font-bold">
                    can(user, action, resource)
                  </code>
                  . Students can never view peers' private records or tamper with grades.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                  FERPA Compliant
                </span>
                <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                  Strict Access Control
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* WHY NOT EXCEL? HIGH-CONTRAST COMPARISON */}
        <section id="why-not-excel" className="space-y-8 pt-4">
          <div className="text-center space-y-2.5 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/70">
              <span>Why Colleges Upgrade</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Why Excel Spreadsheets Fail Academic Departments
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Desktop spreadsheets are powerful calculators, but precarious for collaborative
              college administration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* The Old Way: Spreadsheets */}
            <div className="bg-white border border-rose-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-rose-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-rose-600">
                    The Fragile Old Way
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">Manual Excel Files</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <X className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ×
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">
                      Version Drift & File Loss:
                    </strong>
                    Conflicting copies like{" "}
                    <code className="font-mono text-xs">marks_final_v2_edit.xlsx</code> scattered
                    across USB sticks and faculty mailboxes.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ×
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">
                      Formula Corruption & Bad Bounds:
                    </strong>
                    Accidental 25/20 scores entered without validation, broken{" "}
                    <code className="font-mono text-xs">#REF!</code> errors, and incorrect aggregate
                    calculations.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ×
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">
                      Zero Student Privacy:
                    </strong>
                    Printing entire class mark sheets on bulletin boards or sending bulk
                    spreadsheets revealing peer scores.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ×
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">
                      Chaotic Project Formation:
                    </strong>
                    Uncoordinated WhatsApp messages, lost handwritten notes, and duplicate project
                    topics.
                  </div>
                </div>
              </div>
            </div>

            {/* The Handover Standard */}
            <div className="bg-gradient-to-br from-indigo-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl shadow-indigo-950/20 border border-indigo-800/50">
              <div className="flex items-center justify-between border-b border-indigo-800/60 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-400">
                    The Modern Standard
                  </span>
                  <h3 className="text-xl font-bold text-white">Handover Academic OS</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Check className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  <div>
                    <strong className="text-white block font-semibold">
                      Single Atomic Source of Truth:
                    </strong>
                    All changes persist reliably in real time. Faculty and students always access
                    the verified live record.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  <div>
                    <strong className="text-white block font-semibold">
                      Strict Bounds & Instant Grading:
                    </strong>
                    Clamped values (0 to 20) with automated letter grade calculation (O, A+, A, B+,
                    B, F) verified at every boundary.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  <div>
                    <strong className="text-white block font-semibold">
                      Isolated Read-Only Portals:
                    </strong>
                    Each student accesses only their personal verified scorecard. Privacy is
                    guaranteed by server-side authorization.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  <div>
                    <strong className="text-white block font-semibold">
                      Structured Collaborative Proposals:
                    </strong>
                    Students submit team nominations digitally; faculty review, approve, assign
                    guides, and record milestones in one click.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <section id="faq" className="space-y-8 pt-4 max-w-3xl mx-auto">
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Everything you need to know about setting up and running Handover.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Can instructors export their continuous marks records to CSV or Excel?",
                a: "Yes. In both the Student Roster and Marks Manager views, instructors can click 'Export to CSV' at any time to instantly download a formatted spreadsheet containing roll numbers, student names, internal exam, lab, practical, project scores, and auto-computed totals.",
              },
              {
                q: "Can students edit or tamper with their grades?",
                a: "No. The system enforces centralized server-side authorization check can(user, action, resource). Even if a malicious request is forged, unauthorized actions are strictly rejected. Students only possess read-only access to their verified scorecard.",
              },
              {
                q: "How does the Student Group Project proposal workflow work?",
                a: "Enrolled students submit a proposal including their proposed project title and teammates from their section. The faculty reviews the proposal on their dashboard and can Approve or Reject with feedback. Once approved, it becomes an official group with an assigned faculty guide.",
              },
              {
                q: "Can college departments manage multiple sections independently?",
                a: "Yes. Faculty can create sections such as 'CSE - Section A', 'CSE - Section B', and 'IT - Section A'. Student rosters, continuous evaluation marks, and project groups are strictly scoped by sectionId and never mix.",
              },
              {
                q: "How do students register for their account?",
                a: "Students click 'Register Account' on the top navigation bar, enter their Full Name, College Email, Roll Number, and select their assigned section. Their student profile is created immediately and routed to their personal Student Academic Portal.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left px-6 py-4 font-bold text-slate-900 text-sm flex items-center justify-between gap-3 hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      activeFaq === idx ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* HIGH-IMPACT BOTTOM CTA BANNER */}
        <section className="pt-4">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white shadow-2xl shadow-indigo-950/20 text-center space-y-6 border border-indigo-900/40">
            <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.8),rgba(255,255,255,0))]" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-white/10 text-indigo-200 border border-white/20">
                Modern Academic Operations
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Switch from messy spreadsheets to organized academic flow.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Empower your faculty with spreadsheet-first efficiency while giving students
                transparent, verified access to continuous coursework and grades.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/auth" search={{ tab: "signin", role: "teacher" }}>
                <Button className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs h-11 px-7 font-bold shadow-lg shadow-indigo-500/30 gap-2">
                  <span>Enter Faculty Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link to="/auth" search={{ tab: "signup" }}>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs h-11 px-7 font-bold gap-2"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Student Registration</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white/95 backdrop-blur-md pt-14 pb-8 text-xs text-slate-500 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2.5 font-bold text-slate-900 text-base">
                <HandoverLogo size="sm" />
                <span>Handover</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Professional spreadsheet-first digital workspace replacing fragmented Excel files
                for higher education faculty and students.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Systems Active • Node v2.4</span>
              </div>
            </div>

            {/* Navigation Column: Workspaces */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] font-mono">
                Workspaces
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/auth"
                    search={{ tab: "signin", role: "teacher" }}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Faculty Management Portal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/auth"
                    search={{ tab: "signin", role: "student" }}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Student Academic Portal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/auth"
                    search={{ tab: "signup" }}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Student Account Registration
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
                    Active Session Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Navigation Column: Core Capabilities */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] font-mono">
                Capabilities
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#live-preview" className="hover:text-indigo-600 transition-colors">
                    Inline Spreadsheet Gradebook
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-indigo-600 transition-colors">
                    Continuous Marks (Internal, Lab, Project)
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-indigo-600 transition-colors">
                    Collaborative Project Team Engine
                  </a>
                </li>
                <li>
                  <a href="#why-not-excel" className="hover:text-indigo-600 transition-colors">
                    1-Click CSV Synchronization
                  </a>
                </li>
              </ul>
            </div>

            {/* Navigation Column: Security & Privacy */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] font-mono">
                Security & Standards
              </h3>
              <ul className="space-y-2 text-slate-500">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Centralized RBAC via can()</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>FERPA Compliant Data Isolation</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Multi-Tenant Section Scoping</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Atomic Persistent Storage</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} Handover Academic Systems. All rights reserved.</p>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Higher Education SaaS</span>
              <span>•</span>
              <span>Protected Multi-Tenant Architecture</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
