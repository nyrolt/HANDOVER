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
      { name: "theme-color", content: "#0F172A" },
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

  // Live cell editing in interactive preview
  const handleMarkChange = (index: number, field: keyof DemoRow, val: string) => {
    const num = Math.min(20, Math.max(0, parseInt(val, 10) || 0));
    setDemoRows((prev) => {
      const updated = [...prev];
      const row = updated[index];
      if (row) {
        (row as unknown as Record<string, unknown>)[field] = num;
      }
      return updated;
    });
  };

  const computeGrade = (total: number, max = 80) => {
    const pct = (total / max) * 100;
    if (pct >= 90) {
      return {
        label: "Grade O",
        color: "bg-emerald-50 text-emerald-800 border-emerald-200",
        title: "Outstanding",
      };
    }
    if (pct >= 80) {
      return {
        label: "Grade A+",
        color: "bg-blue-50 text-blue-800 border-blue-200",
        title: "Excellent",
      };
    }
    if (pct >= 70) {
      return {
        label: "Grade A",
        color: "bg-indigo-50 text-indigo-800 border-indigo-200",
        title: "Very Good",
      };
    }
    if (pct >= 60) {
      return {
        label: "Grade B+",
        color: "bg-amber-50 text-amber-800 border-amber-200",
        title: "Good",
      };
    }
    if (pct >= 50) {
      return {
        label: "Grade B",
        color: "bg-orange-50 text-orange-800 border-orange-200",
        title: "Average",
      };
    }
    return {
      label: "Grade F",
      color: "bg-rose-50 text-rose-800 border-rose-200",
      title: "Fail",
    };
  };

  const currentTotalMarks = demoRows.reduce(
    (acc, r) => acc + r.internal + r.lab + r.practical + r.project,
    0,
  );
  const classAvg = Math.round((currentTotalMarks / (demoRows.length * 80)) * 100 * 10) / 10;
  const topScore = Math.max(...demoRows.map((r) => r.internal + r.lab + r.practical + r.project));

  const handleExportMock = () => {
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-slate-900 selection:text-white antialiased">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-40 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-bold text-slate-900">
            <HandoverLogo size="md" />
            <div className="flex flex-col">
              <span className="tracking-tight text-base font-bold text-slate-900 leading-none">
                Handover
              </span>
              <span className="text-[10px] font-mono font-medium text-slate-500 tracking-wider">
                ACADEMIC OS
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600">
            <a href="#portals" className="hover:text-slate-900 transition-colors">
              Workspaces
            </a>
            <a href="#live-preview" className="hover:text-slate-900 transition-colors">
              Interactive Studio
            </a>
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Capabilities
            </a>
            <a href="#why-not-excel" className="hover:text-slate-900 transition-colors">
              Excel vs Handover
            </a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>
                    {user.role === "teacher" ? "Faculty" : "Student"}: {user.name}
                  </span>
                </div>

                <Button
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8.5 px-3.5 gap-1.5 font-medium rounded-md"
                >
                  <span>Open {user.role === "teacher" ? "Teacher" : "Student"} Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 h-8.5"
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
                    className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs h-8.5 px-3 font-medium gap-1.5 rounded-md"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sign In</span>
                  </Button>
                </Link>

                <Link to="/auth" search={{ tab: "signup" }}>
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8.5 px-3.5 font-medium rounded-md gap-1.5">
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
              className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
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
        <div className="md:hidden border-b border-slate-200 bg-white px-5 py-4 space-y-3 z-30 sticky top-16 shadow-xs">
          <nav className="flex flex-col space-y-1 text-xs font-medium text-slate-700">
            <a
              href="#portals"
              onClick={() => setMobileNavOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-slate-100 text-slate-800 transition-colors"
            >
              Workspaces (Faculty & Student)
            </a>
            <a
              href="#live-preview"
              onClick={() => setMobileNavOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-slate-100 text-slate-800 transition-colors"
            >
              Interactive Studio Preview
            </a>
            <a
              href="#features"
              onClick={() => setMobileNavOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-slate-100 text-slate-800 transition-colors"
            >
              System Capabilities
            </a>
            <a
              href="#why-not-excel"
              onClick={() => setMobileNavOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-slate-100 text-slate-800 transition-colors"
            >
              Why Spreadsheets Fail Academic Workflows
            </a>
            <a
              href="#faq"
              onClick={() => setMobileNavOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-slate-100 text-slate-800 transition-colors"
            >
              Frequently Asked Questions
            </a>
          </nav>
        </div>
      )}

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 md:py-16 space-y-20">
        {/* HERO SECTION */}
        <section className="max-w-3xl mx-auto text-center space-y-5 pt-2 md:pt-4">
          {/* Authentic status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-medium bg-white border border-slate-200 text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Academic Year 2026–2027</span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-slate-600">Production Workspace v2.4</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
            The modern academic workspace for faculty and students.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Eliminate chaotic, version-drifted Excel spreadsheets. Empower faculty with an inline
            continuous marks engine, class sections, and 1-click CSV synchronization — while students
            track verified transcripts and organize collaborative project teams.
          </p>

          {/* Quick Capability Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Inline Spreadsheet Gradebook</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Continuous Marks (0–20)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Collaborative Project Teams</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Multi-Tenant Section Scoping</span>
            </div>
          </div>
        </section>

        {/* WORKSPACE PORTALS: DUAL ENTRANCE CARDS */}
        <section id="portals" className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* FACULTY WORKSPACE CARD */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200">
                  Faculty Workspace
                </span>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl font-semibold text-slate-900">
                  Faculty Workspace
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Designed for course instructors and department chairs. Rapid continuous marks entry
                  with keyboard navigation (Tab/Enter), automated grade distributions, coursework
                  assignments, and one-click project proposal reviews.
                </p>
              </div>

              {/* Capability Badges */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md p-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="font-medium text-slate-800">Inline Gradebook</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md p-2.5">
                  <Layers className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="font-medium text-slate-800">Team Approvals</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md p-2.5">
                  <Award className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="font-medium text-slate-800">0–20 Marks Engine</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md p-2.5">
                  <Download className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="font-medium text-slate-800">CSV Export & Import</span>
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
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs h-9.5 font-medium rounded-md justify-center gap-2">
                    <LogIn className="w-3.5 h-3.5" />
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
                    className="w-full border-slate-200 hover:bg-slate-50 text-slate-700 text-xs h-9.5 font-medium rounded-md justify-center gap-2"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                    <span>Register Instructor</span>
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
                <span>Enrolled: CSE-A, CSE-B & IT-A</span>
                <span className="font-mono text-slate-600">Single Sign-On Ready</span>
              </div>
            </div>
          </div>

          {/* STUDENT PORTAL CARD */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200">
                  Student Portal
                </span>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl font-semibold text-slate-900">
                  Student Academic Portal
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Personalized, protected student hub. View official continuous marks transcripts,
                  verify assignment deadlines, propose project groups with section peers, and receive
                  official instructor notices.
                </p>
              </div>

              {/* Capability Badges */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md p-2.5">
                  <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="font-medium text-slate-800">Verified Transcripts</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md p-2.5">
                  <Users className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="font-medium text-slate-800">Propose Teammates</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md p-2.5">
                  <Calendar className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="font-medium text-slate-800">Course Deadlines</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md p-2.5">
                  <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="font-medium text-slate-800">Isolated IDOR Privacy</span>
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
                    className="w-full border-slate-200 hover:bg-slate-50 text-slate-700 text-xs h-9.5 font-medium rounded-md justify-center gap-2"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-600" />
                    <span>Student Sign In</span>
                  </Button>
                </Link>

                <Link
                  to="/auth"
                  search={{ tab: "signup", role: "student" }}
                  className="w-full block"
                >
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs h-9.5 font-medium rounded-md justify-center gap-2">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Register Student</span>
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
                <span>Self-registration open for students</span>
                <span className="font-mono text-slate-600">Read-Only Privacy</span>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE WORKSPACE STUDIO CANVAS */}
        <section id="live-preview" className="space-y-6 pt-4">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <Laptop className="w-3.5 h-3.5" />
              <span>Interactive Studio Sandbox</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Test-drive the academic workspace live
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Experience the actual interface. Edit continuous marks cells inline below to see
              automatic aggregation, grade tier rules, and class stats recompute in real time.
            </p>
          </div>

          {/* Studio Browser Frame */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden max-w-5xl mx-auto">
            {/* Window Header / Bezel */}
            <div className="bg-slate-900 text-slate-300 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
                </div>
                <div className="hidden sm:flex items-center gap-2 px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-slate-300">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>handover.internal/cse-301/section-a/gradebook</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Node: Active</span>
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">&lt; 15ms compute</span>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 font-mono">
                  View:
                </span>
                <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-md text-xs">
                  <button
                    onClick={() => setActiveDemoTab("spreadsheet")}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                      activeDemoTab === "spreadsheet"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Faculty Spreadsheet</span>
                  </button>
                  <button
                    onClick={() => setActiveDemoTab("student")}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                      activeDemoTab === "student"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Student Transcript</span>
                  </button>
                  <button
                    onClick={() => setActiveDemoTab("projects")}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                      activeDemoTab === "projects"
                        ? "bg-white text-slate-900 shadow-xs"
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
                  className="bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-400"
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-md p-3.5">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500">
                      Class Average
                    </span>
                    <div className="text-xl font-semibold font-mono text-slate-900 tabular-nums">
                      {classAvg}%
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500">
                      Highest Score
                    </span>
                    <div className="text-xl font-semibold font-mono text-slate-900 tabular-nums">
                      {topScore} / 80
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500">
                      Passing Criteria
                    </span>
                    <div className="text-xl font-semibold font-mono text-slate-900 tabular-nums">
                      40.0% Minimum
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500">
                      Autosave Status
                    </span>
                    <div className="text-base font-medium font-mono text-emerald-700 flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      Saved to Memory
                    </div>
                  </div>
                </div>

                {/* Instructions bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>
                      Live Cell Editing: Click any mark cell below and enter values between{" "}
                      <strong className="text-slate-800">0 and 20</strong>
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 font-mono text-[11px]">
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200">
                      Tab
                    </span>
                    <span>Next Cell</span>
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 ml-2">
                      Enter
                    </span>
                    <span>Next Student</span>
                  </div>
                </div>

                {/* Spreadsheet Table */}
                <div className="overflow-x-auto border border-slate-200 rounded-md">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-medium text-[11px] border-b border-slate-200">
                        <th className="py-2.5 px-3 w-16 font-mono text-slate-500">Roll No</th>
                        <th className="py-2.5 px-4 min-w-[150px]">Student Name</th>
                        <th className="py-2.5 px-4 min-w-[130px]">Project Team</th>
                        <th className="py-2.5 px-3 text-center w-24">Internal /20</th>
                        <th className="py-2.5 px-3 text-center w-24">Lab /20</th>
                        <th className="py-2.5 px-3 text-center w-24">Practical /20</th>
                        <th className="py-2.5 px-3 text-center w-24">Project /20</th>
                        <th className="py-2.5 px-3 text-center w-24 font-mono">Total /80</th>
                        <th className="py-2.5 px-3 text-center w-24">Grade Tier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {demoRows.map((row, idx) => {
                        const total = row.internal + row.lab + row.practical + row.project;
                        const grade = computeGrade(total);
                        return (
                          <tr key={row.rollNo} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2 px-3 font-mono text-slate-700 bg-slate-50/50 tabular-nums">
                              {row.rollNo}
                            </td>
                            <td className="py-2 px-4 font-medium text-slate-900">
                              {row.name}
                              <div className="text-[10px] text-slate-400 font-normal font-mono">
                                {row.email}
                              </div>
                            </td>
                            <td className="py-2 px-4 text-slate-600">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                                {row.group}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-center">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={row.internal}
                                onChange={(e) => handleMarkChange(idx, "internal", e.target.value)}
                                className="w-13 text-center py-0.5 font-mono text-xs font-semibold bg-white border border-slate-200 rounded focus:border-slate-400 outline-none tabular-nums"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={row.lab}
                                onChange={(e) => handleMarkChange(idx, "lab", e.target.value)}
                                className="w-13 text-center py-0.5 font-mono text-xs font-semibold bg-white border border-slate-200 rounded focus:border-slate-400 outline-none tabular-nums"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={row.practical}
                                onChange={(e) => handleMarkChange(idx, "practical", e.target.value)}
                                className="w-13 text-center py-0.5 font-mono text-xs font-semibold bg-white border border-slate-200 rounded focus:border-slate-400 outline-none tabular-nums"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={row.project}
                                onChange={(e) => handleMarkChange(idx, "project", e.target.value)}
                                className="w-13 text-center py-0.5 font-mono text-xs font-semibold bg-white border border-slate-200 rounded focus:border-slate-400 outline-none tabular-nums"
                              />
                            </td>
                            <td className="py-2 px-3 text-center font-mono font-semibold text-slate-900 tabular-nums">
                              {total}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${grade.color}`}
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-1 gap-3">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-3.5 h-3.5 text-slate-600" />
                    <span>
                      Bounded clamping: values outside 0–20 are automatically constrained.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportMock}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>{copiedNotification ? "CSV Exported!" : "Export Section CSV"}</span>
                    </button>
                    <button
                      onClick={handleExportMock}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Import Roster</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STUDENT MARKSHEET LIVE PREVIEW */}
            {activeDemoTab === "student" && (
              <div className="p-5 sm:p-6 space-y-5">
                {/* Official Student Card */}
                <div className="bg-white border border-slate-200 rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-semibold flex items-center justify-center text-sm">
                      AW
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900 text-sm">
                          Alexander Wright
                        </h4>
                        <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          Enrolled
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Roll: 2024-CS-001 • Section: CS-301 Algorithms (Sec A) • Dept. of CSE
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium bg-slate-50 border border-slate-200 text-slate-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                      Official Verified Record
                    </span>
                  </div>
                </div>

                {/* 4 Evaluation Pillar Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 text-center space-y-1">
                    <span className="text-[10px] uppercase font-medium text-slate-500 font-mono">
                      Internal Exam
                    </span>
                    <div className="text-xl font-semibold text-slate-900 font-mono tabular-nums">
                      18 / 20
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-slate-800 h-full w-[90%]" />
                    </div>
                    <span className="text-[11px] text-slate-600 font-mono block">
                      90% Performance
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 text-center space-y-1">
                    <span className="text-[10px] uppercase font-medium text-slate-500 font-mono">
                      Lab Record & Exps
                    </span>
                    <div className="text-xl font-semibold text-slate-900 font-mono tabular-nums">
                      19 / 20
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-slate-800 h-full w-[95%]" />
                    </div>
                    <span className="text-[11px] text-slate-600 font-mono block">
                      95% Performance
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 text-center space-y-1">
                    <span className="text-[10px] uppercase font-medium text-slate-500 font-mono">
                      Practical Exam
                    </span>
                    <div className="text-xl font-semibold text-slate-900 font-mono tabular-nums">
                      17 / 20
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-slate-800 h-full w-[85%]" />
                    </div>
                    <span className="text-[11px] text-slate-600 font-mono block">
                      85% Performance
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 text-center space-y-1">
                    <span className="text-[10px] uppercase font-medium text-slate-500 font-mono">
                      Project Milestone
                    </span>
                    <div className="text-xl font-semibold text-slate-900 font-mono tabular-nums">
                      18 / 20
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-slate-800 h-full w-[90%]" />
                    </div>
                    <span className="text-[11px] text-slate-600 font-mono block">
                      90% Performance
                    </span>
                  </div>
                </div>

                {/* Cumulative Result Box */}
                <div className="bg-white border border-slate-200 rounded-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <span className="text-xs font-medium text-slate-500 font-mono uppercase">
                      Cumulative Continuous Score
                    </span>
                    <div className="text-2xl font-semibold text-slate-900 font-mono tabular-nums">
                      72 / 80{" "}
                      <span className="text-xs font-normal text-slate-500 font-sans">
                        (90.0% Aggregate)
                      </span>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="text-xs font-medium text-slate-500 block mb-0.5">
                      Continuous Grade Tier
                    </span>
                    <span className="inline-block px-3 py-1 rounded text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Grade O (Outstanding)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: GROUP PROJECTS LIVE PREVIEW */}
            {activeDemoTab === "projects" && (
              <div className="p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Team 1 Card */}
                  <div className="bg-white border border-slate-200 rounded-md p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-medium text-slate-800 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                        Team Veritas • 3 Members
                      </span>
                      <span className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Approved
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-slate-900 text-sm">
                        Veritas: Fault-Tolerant Distributed Key-Value Store
                      </h4>
                      <p className="text-xs text-slate-500">
                        Guide: Dr. Eleanor Vance, Ph.D. • Status: In Progress
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-medium text-slate-400 font-mono">
                        Official Roster:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-medium text-slate-800">
                          Alexander Wright (Leader)
                        </span>
                        <span className="text-xs bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-medium text-slate-700">
                          Sophia Martinez
                        </span>
                        <span className="text-xs bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-medium text-slate-700">
                          Marcus Chen
                        </span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Evaluation Milestone:</span>
                      <span className="font-mono font-semibold text-slate-900 tabular-nums">
                        18 / 20 Marks
                      </span>
                    </div>
                  </div>

                  {/* Team 2 Card */}
                  <div className="bg-white border border-slate-200 rounded-md p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-medium text-slate-800 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                        Team AegisFlow • 3 Members
                      </span>
                      <span className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Approved
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-slate-900 text-sm">
                        AegisFlow: Real-Time Stream Processing & Telemetry
                      </h4>
                      <p className="text-xs text-slate-500">
                        Guide: Dr. Eleanor Vance, Ph.D. • Status: In Progress
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-medium text-slate-400 font-mono">
                        Official Roster:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-medium text-slate-800">
                          Olivia Patel (Leader)
                        </span>
                        <span className="text-xs bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-medium text-slate-700">
                          Liam O'Connor
                        </span>
                        <span className="text-xs bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-medium text-slate-700">
                          Isabella Rossi
                        </span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Evaluation Milestone:</span>
                      <span className="font-mono font-semibold text-slate-900 tabular-nums">
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
          <div className="bg-white border border-slate-200 rounded-lg p-5 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-semibold font-mono text-slate-900 tabular-nums">
              0
            </div>
            <div className="text-xs font-medium text-slate-800">Data Loss Incidents</div>
            <p className="text-[11px] text-slate-500">Atomic state persistence engine</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-semibold font-mono text-slate-900 tabular-nums">
              4-in-1
            </div>
            <div className="text-xs font-medium text-slate-800">Continuous Assessment</div>
            <p className="text-[11px] text-slate-500">Internal, Lab, Practical & Project</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-semibold font-mono text-slate-900 tabular-nums">
              &lt; 150ms
            </div>
            <div className="text-xs font-medium text-slate-800">Reactive Autosave</div>
            <p className="text-[11px] text-slate-500">Instant background write on change</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-semibold font-mono text-slate-900 tabular-nums">
              100%
            </div>
            <div className="text-xs font-medium text-slate-800">Section Isolated</div>
            <p className="text-[11px] text-slate-500">Strict multi-tenant security</p>
          </div>
        </section>

        {/* BENTO ARCHITECTURE & SYSTEM CAPABILITIES */}
        <section id="features" className="space-y-8 pt-4">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <Zap className="w-3.5 h-3.5" />
              <span>System Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Engineered for academic faculty and department workflows
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Every workflow you need to coordinate courses, calculate grades, and review student
              projects without switching between disparate tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {/* Bento 1: Inline Spreadsheet Gradebook (Wide 2-col) */}
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                  Keyboard Driven
                </span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-slate-900">
                  Excel-Like Continuous Marks Gradebook
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Navigate seamlessly using Tab, Shift+Tab, and Enter keys. Frozen student names and
                  roll numbers ensure frictionless horizontal scrolling. Automatic bounding clamps
                  prevent out-of-bounds inputs (strictly 0 to 20).
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono text-slate-600">
                <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                  Auto-bounding [0, 20]
                </span>
                <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                  Instant Grade Tiers (O, A+, A, B+, B, F)
                </span>
                <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                  Zero Formula Corruption
                </span>
              </div>
            </div>

            {/* Bento 2: Multi-Tenant Section Isolation (1-col) */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
              <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-slate-900">Independent Class Sections</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Strict multi-tenancy ensures CSE-A, CSE-B, and IT-A records never leak. Each
                  section maintains isolated roll rosters, coursework, and teams.
                </p>
              </div>
              <div className="pt-1">
                <span className="text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                  Multi-tenant Scoped
                </span>
              </div>
            </div>

            {/* Bento 3: Dual Collaborative Project Engine (1-col) */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
              <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-slate-900">Dual Group Project Engine</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Students propose project titles and invite classmates. Instructors verify
                  eligibility, assign faculty guides, and record milestone marks in one click.
                </p>
              </div>
              <div className="pt-1">
                <span className="text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                  Proposal & Approval Flow
                </span>
              </div>
            </div>

            {/* Bento 4: 1-Click CSV Interoperability (Wide 2-col) */}
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold">
                  <Download className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                  ERP Compatible
                </span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-slate-900">
                  Bi-Directional CSV Synchronization
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Export complete section records to clean CSV formats ready for registrar
                  submission. Seamlessly batch-import student rosters from university administrative
                  files with automatic deduplication.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono text-slate-600">
                <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                  UTF-8 Formatted
                </span>
                <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                  Formula Verification
                </span>
                <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                  Instant Administrative Export
                </span>
              </div>
            </div>

            {/* Bento 5: Centralized RBAC Security (3-col full width) */}
            <div className="md:col-span-3 bg-white border border-slate-200 rounded-lg p-6 space-y-4 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Centralized Authorization & Privacy Protection
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enforced by single-source-of-truth authorization check{" "}
                  <code className="text-slate-800 font-mono font-semibold">
                    can(user, action, resource)
                  </code>
                  . Students can never view peers' private records or tamper with grades.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded">
                  FERPA Compliant
                </span>
                <span className="text-xs font-mono font-medium text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded">
                  Strict Access Control
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* WHY NOT EXCEL? HIGH-CONTRAST COMPARISON */}
        <section id="why-not-excel" className="space-y-8 pt-4">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <span>Why Colleges Upgrade</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Excel Spreadsheets Fail Academic Departments
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Desktop spreadsheets are powerful calculators, but precarious for collaborative
              college administration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* The Old Way: Spreadsheets */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-rose-700">
                    The Fragile Old Way
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">Manual Excel Files</h3>
                </div>
                <div className="w-8 h-8 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold">
                  <X className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ×
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-medium">
                      Version Drift & File Loss:
                    </strong>
                    Conflicting copies like{" "}
                    <code className="font-mono text-[11px]">marks_final_v2_edit.xlsx</code> scattered
                    across USB sticks and mailboxes.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ×
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-medium">
                      Formula Corruption & Bad Bounds:
                    </strong>
                    Accidental 25/20 scores entered without validation, broken{" "}
                    <code className="font-mono text-[11px]">#REF!</code> errors, and incorrect
                    aggregates.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ×
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-medium">
                      Zero Student Privacy:
                    </strong>
                    Printing entire class mark sheets on bulletin boards or sending bulk
                    spreadsheets revealing peer scores.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ×
                  </span>
                  <div>
                    <strong className="text-slate-900 block font-medium">
                      Chaotic Project Formation:
                    </strong>
                    Uncoordinated messaging, lost handwritten notes, and duplicate project topics.
                  </div>
                </div>
              </div>
            </div>

            {/* The Handover Standard */}
            <div className="bg-slate-900 text-slate-100 rounded-lg p-6 sm:p-7 space-y-5 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-emerald-400">
                    The Modern Standard
                  </span>
                  <h3 className="text-base font-semibold text-white">Handover Academic OS</h3>
                </div>
                <div className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center font-bold">
                  <Check className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  <div>
                    <strong className="text-white block font-medium">
                      Single Atomic Source of Truth:
                    </strong>
                    All changes persist reliably in real time. Faculty and students always access
                    the verified live record.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  <div>
                    <strong className="text-white block font-medium">
                      Strict Bounds & Instant Grading:
                    </strong>
                    Clamped values (0 to 20) with automated letter grade calculation (O, A+, A, B+,
                    B, F) verified at every boundary.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  <div>
                    <strong className="text-white block font-medium">
                      Isolated Read-Only Portals:
                    </strong>
                    Each student accesses only their personal verified scorecard. Privacy is
                    guaranteed by server-side authorization.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  <div>
                    <strong className="text-white block font-medium">
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
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Everything you need to know about setting up and running Handover.
            </p>
          </div>

          <div className="space-y-2.5">
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
                className="bg-white border border-slate-200 rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left px-5 py-3.5 font-medium text-slate-900 text-xs sm:text-sm flex items-center justify-between gap-3 hover:text-slate-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      activeFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="pt-4">
          <div className="bg-slate-900 text-white rounded-lg p-8 sm:p-12 border border-slate-800 text-center space-y-5">
            <div className="max-w-xl mx-auto space-y-3">
              <span className="inline-block px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                Modern Academic Operations
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                Switch from messy spreadsheets to organized academic flow.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Empower your faculty with spreadsheet-first efficiency while giving students
                transparent, verified access to continuous coursework and grades.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/auth" search={{ tab: "signin", role: "teacher" }}>
                <Button className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 text-xs h-9.5 px-6 font-medium rounded-md gap-2">
                  <span>Enter Faculty Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>

              <Link to="/auth" search={{ tab: "signup" }}>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-white text-xs h-9.5 px-6 font-medium rounded-md gap-2"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-300" />
                  <span>Student Registration</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white pt-12 pb-8 text-xs text-slate-500 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <HandoverLogo size="sm" />
                <span>Handover</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Professional spreadsheet-first digital workspace replacing fragmented Excel files
                for higher education faculty and students.
              </p>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Systems Active • Node v2.4</span>
              </div>
            </div>

            {/* Navigation Column: Workspaces */}
            <div className="space-y-2.5">
              <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] font-mono">
                Workspaces
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    to="/auth"
                    search={{ tab: "signin", role: "teacher" }}
                    className="hover:text-slate-900 transition-colors"
                  >
                    Faculty Management Portal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/auth"
                    search={{ tab: "signin", role: "student" }}
                    className="hover:text-slate-900 transition-colors"
                  >
                    Student Academic Portal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/auth"
                    search={{ tab: "signup" }}
                    className="hover:text-slate-900 transition-colors"
                  >
                    Student Account Registration
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-slate-900 transition-colors">
                    Active Session Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Navigation Column: Core Capabilities */}
            <div className="space-y-2.5">
              <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] font-mono">
                Capabilities
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <a href="#live-preview" className="hover:text-slate-900 transition-colors">
                    Inline Spreadsheet Gradebook
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-slate-900 transition-colors">
                    Continuous Marks (Internal, Lab, Project)
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-slate-900 transition-colors">
                    Collaborative Project Team Engine
                  </a>
                </li>
                <li>
                  <a href="#why-not-excel" className="hover:text-slate-900 transition-colors">
                    1-Click CSV Synchronization
                  </a>
                </li>
              </ul>
            </div>

            {/* Navigation Column: Security & Privacy */}
            <div className="space-y-2.5">
              <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] font-mono">
                Security & Standards
              </h3>
              <ul className="space-y-1.5 text-slate-500">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>Centralized RBAC via can()</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>FERPA Compliant Data Isolation</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>Multi-Tenant Section Scoping</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>Atomic Persistent Storage</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} Handover Academic Systems. All rights reserved.</p>
            <div className="flex items-center gap-3 text-slate-400">
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
