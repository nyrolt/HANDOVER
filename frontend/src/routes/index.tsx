import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
  Calendar,
  Lock,
  HelpCircle,
  BarChart3,
  Zap,
  Check,
  X,
  Laptop,
  Menu,
  Database,
  Star,
  LineChart,
  Target,
  Flag,
  Code2,
  FileText,
  BadgeCheck,
  ExternalLink,
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
    email: "a.wright@univ.edu",
    group: "Team Veritas",
    internal: 18,
    lab: 19,
    practical: 17,
    project: 18,
  },
  {
    rollNo: "2024-CS-002",
    name: "Elena Rostova",
    email: "e.rostova@univ.edu",
    group: "Team Veritas",
    internal: 20,
    lab: 18,
    practical: 19,
    project: 19,
  },
  {
    rollNo: "2024-CS-003",
    name: "Marcus Chen",
    email: "m.chen@univ.edu",
    group: "Cipher Nexus",
    internal: 15,
    lab: 16,
    practical: 14,
    project: 17,
  },
  {
    rollNo: "2024-CS-004",
    name: "Priya Sharma",
    email: "p.sharma@univ.edu",
    group: "Cipher Nexus",
    internal: 19,
    lab: 20,
    practical: 18,
    project: 19,
  },
  {
    rollNo: "2024-CS-005",
    name: "Devon Vance",
    email: "d.vance@univ.edu",
    group: "Quantum Core",
    internal: 16,
    lab: 17,
    practical: 15,
    project: 16,
  },
];

// Hero Live Activity Stack (Matches Devxa 3D Card Stack)
interface HeroFeedItem {
  id: string;
  avatarBg: string;
  avatarText: string;
  author: string;
  action: string;
  badge: string;
  badgeType: "live" | "correct" | "pending";
  meta: string;
}

const HERO_FEED_ITEMS: HeroFeedItem[] = [
  {
    id: "1",
    avatarBg: "bg-slate-900 text-white",
    avatarText: "E",
    author: "Prof. Vance published continuous marks",
    action: "CSE-401 • Section A • Distributed Systems",
    badge: "Verified Live",
    badgeType: "live",
    meta: "Internal, Lab & Project aggregates calculated automatically",
  },
  {
    id: "2",
    avatarBg: "bg-emerald-700 text-white",
    avatarText: "A",
    author: "Alexander Wright formed Team Veritas",
    action: "Byzantine Fault Tolerant Replication Engine",
    badge: "Correct",
    badgeType: "correct",
    meta: "4 members co-signed • Verified across Section CSE-A",
  },
  {
    id: "3",
    avatarBg: "bg-indigo-700 text-white",
    avatarText: "S",
    author: "Section CSE-B completed milestone audit",
    action: "Continuous Evaluation Marks (0–20 clamped)",
    badge: "Registrar Synced",
    badgeType: "live",
    meta: "Class Average: 89.2% • Clean UTF-8 CSV exported for university records",
  },
];

const TICKER_ITEMS = [
  "Student builders",
  "College faculty",
  "Department chairs",
  "Course coordinators",
  "Autonomous institutes",
  "State universities",
  "Engineering colleges",
  "Higher education depts",
];

const COMPARISON_ROWS = [
  {
    capability: "Continuous Marks (0–20 Clamped)",
    excel: "Manual formulas",
    sheets: "Broken #REF! risks",
    legacyLms: "Semester exams only",
    handover: "Keyboard driven + strict [0, 20] clamp",
  },
  {
    capability: "Student Grade Privacy (FERPA)",
    excel: "Public file sharing",
    sheets: "Public share links",
    legacyLms: "Complex administrative permissions",
    handover: "Isolated read-only verified scorecard",
  },
  {
    capability: "Collaborative Project Groups",
    excel: "Lost notes & emails",
    sheets: "Unchecked duplicates",
    legacyLms: "No student proposal workflow",
    handover: "Student proposals + faculty guide reviews",
  },
  {
    capability: "Class Multi-Tenancy Scoping",
    excel: "Separate fragile files",
    sheets: "Permission clutter",
    legacyLms: "Administrative overhead",
    handover: "Strict sectionId isolation (CSE-A, CSE-B)",
  },
  {
    capability: "Real-Time Letter Grade Tiers",
    excel: "Complex nested IFs",
    sheets: "Slow script triggers",
    legacyLms: "Batch semester cron jobs",
    handover: "Instant automatic grading (O, A+, A, B+, B, F)",
  },
  {
    capability: "Administrative Submission",
    excel: "Conflicting versions",
    sheets: "Formatting errors",
    legacyLms: "Manual database entries",
    handover: "1-Click UTF-8 CSV synchronization",
  },
];

function IndexPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeDemoTab, setActiveDemoTab] = useState<"spreadsheet" | "student" | "groups">(
    "spreadsheet",
  );
  const [demoRows, setDemoRows] = useState<DemoRow[]>(INITIAL_DEMO_ROWS);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [activeFeedIndex, setActiveFeedIndex] = useState(0);

  // Auto-rotate hero feed cards like Devxa's live carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeedIndex((prev) => (prev + 1) % HERO_FEED_ITEMS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleScoreChange = (index: number, field: keyof DemoRow, val: string) => {
    const numeric = parseInt(val, 10);
    const clamped = isNaN(numeric) ? 0 : Math.max(0, Math.min(20, numeric));
    setDemoRows((prev) => {
      const copy = [...prev];
      const target = { ...copy[index] } as DemoRow;
      (target[field] as number) = clamped;
      copy[index] = target;
      return copy;
    });
  };

  const calculateGrade = (total: number) => {
    if (total >= 72) {
      return {
        label: "Grade O",
        color: "bg-emerald-50 text-emerald-800 border-emerald-200",
        title: "Outstanding",
      };
    }
    if (total >= 64) {
      return {
        label: "Grade A+",
        color: "bg-slate-100 text-slate-800 border-slate-300",
        title: "Excellent",
      };
    }
    if (total >= 56) {
      return {
        label: "Grade A",
        color: "bg-slate-50 text-slate-700 border-slate-200",
        title: "Very Good",
      };
    }
    if (total >= 48) {
      return {
        label: "Grade B+",
        color: "bg-amber-50 text-amber-800 border-amber-200",
        title: "Good",
      };
    }
    if (total >= 40) {
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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white antialiased overflow-x-hidden">
      {/* 1. TOP NAVBAR (Devxa Minimalist Clean Style) */}
      <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-bold text-slate-900">
            <HandoverLogo size="md" />
            <span className="tracking-tight text-base font-bold text-slate-900">Handover</span>
          </Link>

          {/* Center Navigation Links (Devxa exact layout) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600">
            <a href="#about" className="hover:text-slate-900 transition-colors">
              About
            </a>
            <a href="#compare" className="hover:text-slate-900 transition-colors">
              Compare
            </a>
            <span className="text-emerald-700 font-mono text-[11px] px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 font-medium">
              Less hype. More proof.
            </span>
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>
                    {user.role === "teacher" ? "Faculty" : "Student"}: {user.name}
                  </span>
                </div>

                <Button
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="bg-slate-950 hover:bg-slate-800 text-white text-xs h-8.5 px-4 font-semibold rounded-full shadow-xs gap-1.5"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 h-8.5 rounded-full"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/auth"
                  search={{ tab: "signin" }}
                  className="text-xs font-medium text-slate-700 hover:text-slate-950 transition-colors px-2 py-1"
                >
                  Log in
                </Link>

                <Link to="/auth" search={{ tab: "signup" }}>
                  <Button className="bg-slate-950 hover:bg-slate-800 text-white text-xs h-8.5 px-4.5 font-semibold rounded-full shadow-xs gap-1.5">
                    <span>Join now</span>
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
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-5 py-4 space-y-3 z-40 sticky top-16 shadow-md">
          <nav className="flex flex-col space-y-1 text-xs font-medium text-slate-700">
            <a
              href="#about"
              onClick={() => setMobileNavOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-slate-100 text-slate-800 transition-colors"
            >
              About Handover
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileNavOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-slate-100 text-slate-800 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#compare"
              onClick={() => setMobileNavOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-slate-100 text-slate-800 transition-colors"
            >
              Compare with Spreadsheets
            </a>
            <a
              href="#live-preview"
              onClick={() => setMobileNavOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-slate-100 text-slate-800 transition-colors"
            >
              Interactive Studio Preview
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

      {/* 2. HERO SECTION WITH DEVXA CONCENTRIC RADAR RINGS & REVOLVING STATUS NODES */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[680px]">
        {/* Background Concentric Rotating Orbit Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1240px] h-[1240px] pointer-events-none -z-10 flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute w-[1120px] h-[1120px] rounded-full border border-slate-200/50" />

          {/* Middle Rotating Orbit Ring with Nodes */}
          <div className="absolute w-[820px] h-[820px] rounded-full border border-slate-200/70 animate-spin-orbit">
            {/* Node 1: Top */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center text-slate-700 animate-spin-counter">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </div>
            {/* Node 2: Right */}
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center text-slate-700 animate-spin-counter">
              <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            {/* Node 3: Bottom */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center text-slate-700 animate-spin-counter">
              <Code2 className="w-3.5 h-3.5 text-slate-700" />
            </div>
            {/* Node 4: Left */}
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center text-slate-700 animate-spin-counter">
              <Flag className="w-3.5 h-3.5 text-slate-600" />
            </div>
          </div>

          {/* Inner Rotating Orbit Ring (Reverse Direction) with Nodes */}
          <div className="absolute w-[520px] h-[520px] rounded-full border border-slate-200/80 animate-spin-orbit-slow">
            {/* Inner Node A */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center text-slate-700 animate-spin-counter-slow">
              <UserCheck className="w-3.5 h-3.5 text-slate-700" />
            </div>
            {/* Inner Node B */}
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center text-slate-700 animate-spin-counter-slow">
              <Target className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            {/* Inner Node C */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center text-slate-700 animate-spin-counter-slow">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            {/* Inner Node D */}
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center text-slate-700 animate-spin-counter-slow">
              <LineChart className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Hero Typography & CTAs (Exact Devxa structure) */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          {/* Top Pill (Early access + User Icon) */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full text-[11px] font-medium bg-white border border-slate-200/90 shadow-2xs text-slate-700">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>Early access is open</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <Users className="w-3 h-3 text-slate-500" />
              <span>For student builders & founders</span>
            </span>
          </div>

          {/* Primary Headline (Devxa "Stop saying you're building. Start proving it." exact cadence) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08] max-w-3xl mx-auto">
            Stop saying you're managing. Start{" "}
            <span className="text-[#6366F1] inline-block">commanding it.</span>
          </h1>

          {/* Subtitle */}
          <div className="space-y-1 max-w-2xl mx-auto">
            <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
              Handover is the proof-based academic workspace for faculty, course coordinators, and
              student builders.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Manage continuous marks, ship real group projects, and build a tamper-proof department
              record that shows what you can actually do.
            </p>
          </div>

          {/* Proof Tag Chips (Devxa Style) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-mono">
            <span className="px-3.5 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE]/60 text-[#1D4ED8] font-medium">
              Show what you know. Prove what you record.
            </span>
            <span className="px-3.5 py-1 rounded-md bg-[#F0FDF4] border border-[#BBF7D0]/60 text-[#15803D] font-medium">
              Less hype. More proof.
            </span>
          </div>

          {/* Primary CTA Buttons (Devxa Pill Buttons) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/auth" search={{ tab: "signin", role: "teacher" }}>
              <Button className="w-full sm:w-auto bg-slate-950 hover:bg-slate-800 text-white text-xs h-10 px-7 font-semibold rounded-full shadow-xs gap-2">
                <span>Join Handover</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            <Link to="/auth" search={{ tab: "signin", role: "student" }}>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-slate-200 hover:bg-slate-50 text-slate-800 text-xs h-10 px-6 font-semibold rounded-full shadow-xs gap-2"
              >
                <span>Sign in with Portal</span>
              </Button>
            </Link>
          </div>

          {/* 3D Stacked Live Cards Carousel (Exact Devxa Frame 001/004/010 Replication) */}
          <div className="pt-8 max-w-md mx-auto relative h-28 flex flex-col items-center">
            {/* Background Peaking Cards */}
            <div className="absolute top-2 w-[92%] h-16 bg-white/70 border border-slate-200/60 rounded-xl shadow-2xs transform scale-[0.94] translate-y-2 pointer-events-none -z-10" />
            <div className="absolute top-1 w-[96%] h-16 bg-white/90 border border-slate-200/80 rounded-xl shadow-2xs transform scale-[0.97] translate-y-1 pointer-events-none -z-5" />

            {/* Front Card (Elevated) */}
            <div className="w-full bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-sm text-left transition-all duration-300 z-10">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${HERO_FEED_ITEMS[activeFeedIndex]?.avatarBg}`}
                  >
                    {HERO_FEED_ITEMS[activeFeedIndex]?.avatarText}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {HERO_FEED_ITEMS[activeFeedIndex]?.author}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">
                      {HERO_FEED_ITEMS[activeFeedIndex]?.action}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    HERO_FEED_ITEMS[activeFeedIndex]?.badgeType === "live"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {HERO_FEED_ITEMS[activeFeedIndex]?.badge}
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-500">
                <span className="truncate">{HERO_FEED_ITEMS[activeFeedIndex]?.meta}</span>
                <span className="shrink-0 text-slate-400 font-mono">Verified Record</span>
              </div>
            </div>

            {/* Pagination Indicators (Devxa Style Pill + Dots) */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {HERO_FEED_ITEMS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveFeedIndex(i)}
                  className={`transition-all duration-200 ${
                    activeFeedIndex === i
                      ? "w-6 h-1 rounded-full bg-slate-900"
                      : "w-1.5 h-1 rounded-full bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. DEVXA TICKER RIBBON (WHERE BUILDERS PROVE IT. MADE FOR) */}
      <section className="border-y border-slate-200/80 bg-white py-5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 text-center font-semibold">
            WHERE BUILDERS PROVE IT. MADE FOR
          </p>
        </div>

        {/* Continuous Smooth Infinite Marquee */}
        <div className="relative w-full overflow-hidden flex items-center pt-1">
          <div className="animate-marquee-scroll flex items-center gap-12 text-sm font-semibold text-slate-400 tracking-tight">
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
              <span key={index} className="shrink-0 hover:text-slate-800 transition-colors">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. "WHAT IS HANDOVER?" (Devxa Image 2 Exact Replication) */}
      <section id="about" className="py-20 sm:py-28 max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-mono font-semibold tracking-wider uppercase text-blue-600">
            PROOF-BASED NETWORK
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            What is Handover?
          </h2>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          <p>
            Handover is an academic management workspace where educators and students build
            reputation through verified proof, not unverified spreadsheet hype. Instead of just
            talking about what continuous marks a student earned, instructors record bounded scores
            with instant calculations, ship real collaborative projects, and let results speak for
            themselves.
          </p>
          <p>
            Every class section is verified by daily automated isolation checks, every score is
            validated between 0 and 20, and your Academic Record turns it all into a verified
            department track record you can share directly with university registrars.
          </p>
        </div>
      </section>

      {/* 5. "HOW HANDOVER WORKS" (Devxa Image 3 Exact 4-Card Architecture Grid) */}
      <section
        id="how-it-works"
        className="py-12 max-w-4xl mx-auto px-4 sm:px-8 space-y-8 border-t border-slate-100"
      >
        <div className="space-y-2">
          <p className="text-xs font-mono font-semibold tracking-wider uppercase text-emerald-600">
            THE ARCHITECTURE OF PROOF
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            How Handover works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Handover gives academic departments four foundational mechanisms to verify what they
            claim and demonstrate real execution.
          </p>
        </div>

        {/* 4-Card Grid matching Devxa Image 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Calls -> Continuous Marks */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 hover:border-slate-400 transition-all shadow-2xs group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Continuous Marks: evaluate in public
                </h3>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Make continuous evaluation transparent with clamped 0–20 bounding and resolve it
                with automatic mathematical evidence.
              </p>
            </div>
          </div>

          {/* Card 2: Ships -> Real Projects (Highlighted active card in Devxa) */}
          <div className="bg-white border-2 border-emerald-500/90 rounded-2xl p-6 space-y-4 hover:border-emerald-600 transition-all shadow-xs group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/80 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Class Sections: show real projects
                </h3>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Link your section rosters and group proposals; Handover verifies it stays online
                with strict multi-tenant section scoping.
              </p>
            </div>
          </div>

          {/* Card 3: Builder Record -> Verified Academic Record */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 hover:border-slate-400 transition-all shadow-2xs group">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-slate-950 transition-colors">
                  Academic Record: your verified track record
                </h3>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-950 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Marks, project submissions, and attendance combine into a record that shows what you
                actually deliver.
              </p>
            </div>
          </div>

          {/* Card 4: Proof Cards -> Exportable Marksheets */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 hover:border-slate-400 transition-all shadow-2xs group">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Proof Marksheets: shareable proof
                </h3>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Share a clean UTF-8 CSV Marks Card that links back to your verified institutional
                profile without formula errors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DEVXA COMPARISON TABLE (Exact Frame 020 Replication) */}
      <section id="compare" className="py-20 max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            How Handover is different from Excel, Google Sheets, ERPs and Legacy LMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Other tools show raw, unverified data cells. Handover connects continuous evaluation,
            student verification, and project collaboration into one verified record.
          </p>
        </div>

        {/* Comparison Table with Highlighted Handover Column */}
        <div className="border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 font-medium">
                  <th className="py-4 px-4 font-semibold">Capability</th>
                  <th className="py-4 px-3 text-slate-500">Excel</th>
                  <th className="py-4 px-3 text-slate-500">Google Sheets</th>
                  <th className="py-4 px-3 text-slate-500">Legacy ERP</th>
                  <th className="py-4 px-4 font-semibold text-indigo-600 bg-indigo-50/60">
                    Handover
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900">{row.capability}</td>
                    <td className="py-3.5 px-3 text-slate-500">{row.excel}</td>
                    <td className="py-3.5 px-3 text-slate-500">{row.sheets}</td>
                    <td className="py-3.5 px-3 text-slate-500">{row.legacyLms}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 bg-indigo-50/60">
                      {row.handover}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE STUDIO SANDBOX (Live Playground) */}
      <section id="live-preview" className="py-14 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs">
              <Laptop className="w-3.5 h-3.5 text-slate-600" />
              <span>Interactive Studio Sandbox</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Test-drive the academic workspace live
            </h2>
            <p className="text-xs text-slate-500">
              Edit continuous marks cells inline below to see automatic bounding, grade tiers, and
              class stats recompute in real time.
            </p>
          </div>

          {/* Studio Browser Frame */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Window Header / Bezel */}
            <div className="bg-slate-900 text-slate-300 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
                </div>
                <div className="hidden sm:flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 font-mono text-[11px] text-slate-300">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>handover.internal/cse-401/section-a/gradebook</span>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setActiveDemoTab("spreadsheet")}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeDemoTab === "spreadsheet"
                      ? "bg-slate-700 text-white font-medium shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Faculty Gradebook
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDemoTab("student")}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeDemoTab === "student"
                      ? "bg-slate-700 text-white font-medium shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Student Transcript
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDemoTab("groups")}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeDemoTab === "groups"
                      ? "bg-slate-700 text-white font-medium shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Project Groups
                </button>
              </div>
            </div>

            {/* TAB 1: FACULTY MARKS SPREADSHEET */}
            {activeDemoTab === "spreadsheet" && (
              <div className="p-4 sm:p-6 space-y-4">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                  <div>
                    <span className="text-slate-500 block font-mono text-[10px]">
                      CLASS AVERAGE
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{classAvg}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-mono text-[10px]">TOP SCORE</span>
                    <span className="font-bold text-slate-900 text-sm">{topScore} / 80</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-mono text-[10px]">EVALUATION</span>
                    <span className="font-bold text-emerald-700 text-sm">Strict 0–20 Bounds</span>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={handleExportMock}
                      className="px-3 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>{copiedNotification ? "Exported!" : "Export CSV"}</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Table */}
                <div className="border border-slate-200 rounded-xl overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 font-mono">Roll No</th>
                        <th className="p-2.5">Student Name</th>
                        <th className="p-2.5 font-mono text-center">Internal (/20)</th>
                        <th className="p-2.5 font-mono text-center">Lab (/20)</th>
                        <th className="p-2.5 font-mono text-center">Practical (/20)</th>
                        <th className="p-2.5 font-mono text-center">Project (/20)</th>
                        <th className="p-2.5 font-mono text-center">Total (/80)</th>
                        <th className="p-2.5 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {demoRows.map((r, idx) => {
                        const total = r.internal + r.lab + r.practical + r.project;
                        const grade = calculateGrade(total);
                        return (
                          <tr key={r.rollNo} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-2.5 font-mono text-slate-600 font-medium">
                              {r.rollNo}
                            </td>
                            <td className="p-2.5 font-medium text-slate-900">{r.name}</td>
                            <td className="p-2 text-center">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={r.internal}
                                onChange={(e) => handleScoreChange(idx, "internal", e.target.value)}
                                className="w-12 text-center border border-slate-200 rounded p-1 font-mono text-xs focus:border-slate-800 focus:outline-hidden"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={r.lab}
                                onChange={(e) => handleScoreChange(idx, "lab", e.target.value)}
                                className="w-12 text-center border border-slate-200 rounded p-1 font-mono text-xs focus:border-slate-800 focus:outline-hidden"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={r.practical}
                                onChange={(e) =>
                                  handleScoreChange(idx, "practical", e.target.value)
                                }
                                className="w-12 text-center border border-slate-200 rounded p-1 font-mono text-xs focus:border-slate-800 focus:outline-hidden"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={r.project}
                                onChange={(e) => handleScoreChange(idx, "project", e.target.value)}
                                className="w-12 text-center border border-slate-200 rounded p-1 font-mono text-xs focus:border-slate-800 focus:outline-hidden"
                              />
                            </td>
                            <td className="p-2.5 text-center font-mono font-bold text-slate-900">
                              {total}
                            </td>
                            <td className="p-2 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${grade.color}`}
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

                <p className="text-[11px] text-slate-500 font-mono text-right">
                  * Try changing values above (0–20) — notice instant grade recalculation.
                </p>
              </div>
            )}

            {/* TAB 2: STUDENT SCORECARD VIEW */}
            {activeDemoTab === "student" && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Alexander Wright</h4>
                      <p className="text-xs text-slate-500 font-mono">
                        Roll: 2024-CS-001 • Section: CSE-A
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Transcript</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-white border border-slate-200 p-2.5 rounded-lg">
                      <span className="text-[10px] text-slate-500 font-mono block">INTERNAL</span>
                      <span className="font-bold text-slate-900 text-base">18 / 20</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-2.5 rounded-lg">
                      <span className="text-[10px] text-slate-500 font-mono block">LAB RECORD</span>
                      <span className="font-bold text-slate-900 text-base">19 / 20</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-2.5 rounded-lg">
                      <span className="text-[10px] text-slate-500 font-mono block">PRACTICAL</span>
                      <span className="font-bold text-slate-900 text-base">17 / 20</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-2.5 rounded-lg">
                      <span className="text-[10px] text-slate-500 font-mono block">PROJECT</span>
                      <span className="font-bold text-slate-900 text-base">18 / 20</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">
                        Aggregate Score: 72 / 80 (90.0%)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Assigned Tier: Outstanding • Official Transcript Signed
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      Grade O
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PROJECT GROUPS VIEW */}
            {activeDemoTab === "groups" && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Team Veritas</h4>
                      <p className="text-xs text-slate-500">
                        Topic: Byzantine Fault Tolerant Replication Engine
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Approved • Faculty Guide: Dr. E. Vance
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-white border border-slate-200 p-2.5 rounded-lg flex items-center justify-between">
                      <span className="font-medium text-slate-800">Alexander Wright (Leader)</span>
                      <span className="font-mono text-slate-500 text-[11px]">2024-CS-001</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-2.5 rounded-lg flex items-center justify-between">
                      <span className="font-medium text-slate-800">Elena Rostova</span>
                      <span className="font-mono text-slate-500 text-[11px]">2024-CS-002</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. DEVXA ACCORDION FAQ (Image 4 Exact Replication) */}
      <section id="faq" className="py-20 max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs font-mono font-semibold tracking-wider uppercase text-blue-600">
            FREQUENTLY ASKED QUESTIONS
          </p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Devxa FAQ</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Everything you need to know about Handover, verified proof, and academic reputation.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "What is Handover?",
              a: "Handover is an institutional academic workspace where educators and students manage continuous evaluation marks and collaborative project groups in a verified, single-source-of-truth environment without spreadsheets.",
            },
            {
              q: "Who is Handover for?",
              a: "Handover is designed for college faculty, department chairs, and student builders across computer science, engineering, and higher education academic departments.",
            },
            {
              q: "What is a Continuous Mark on Handover?",
              a: "A Continuous Mark is an atomic score (0 to 20) entered for internal exams, lab practicals, or project milestones. Every value is automatically clamped and verified against course grade tiers.",
            },
            {
              q: "What is a Class Section?",
              a: "A Class Section (e.g. CSE-A, CSE-B) is an isolated multi-tenant partition. Student rosters, continuous marks, and collaborative proposals are strictly isolated by sectionId and never bleed across classes.",
            },
            {
              q: "What is an Academic Proof Card?",
              a: "An Academic Proof Card is a verified scorecard that students can view in read-only mode to verify continuous evaluation marks without peer score leakage, compliant with FERPA privacy standards.",
            },
            {
              q: "Is Handover free?",
              a: "Handover is free for open academic departments and student builders participating in coursework projects.",
            },
            {
              q: "How is Handover different from LinkedIn or GitHub?",
              a: "While GitHub hosts code repositories and LinkedIn displays self-reported resumes, Handover verifies continuous coursework execution, clamped evaluation marks, and approved group project teams in one verified record.",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left px-5 py-4 font-semibold text-slate-900 text-xs sm:text-sm flex items-center justify-between gap-3 hover:text-slate-700 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    activeFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3.5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. DARK RADIAL GLOW BOTTOM CTA CARD (Devxa Image 5 Exact Replication) */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-8">
        <div className="relative rounded-3xl bg-[#090D16] text-white p-8 sm:p-14 border border-slate-800/80 text-center space-y-6 overflow-hidden shadow-xl">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-xl mx-auto space-y-3 relative z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
              WHERE BUILDERS PROVE IT
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Your work already says a lot. <br />
              Let it speak.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
              Join now and be among the first educators and students to manage a verified public
              Record.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
            <Link to="/auth" search={{ tab: "signup" }}>
              <Button className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-950 text-xs h-9.5 px-6 font-semibold rounded-full shadow-md gap-2">
                <span>Join now</span>
              </Button>
            </Link>

            <Link to="/auth" search={{ tab: "signin" }}>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-white text-xs h-9.5 px-6 font-semibold rounded-full gap-2"
              >
                <span>Sign in to workspace</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. DEVXA 4-COLUMN FOOTER (Devxa Image 5 Exact Replication) */}
      <footer className="border-t border-slate-200/80 bg-white pt-16 pb-12 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Brand Column (2 cols wide) */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <HandoverLogo size="sm" />
                <span>Devxa</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                The proof-based social network for developers. Make public Calls, ship real
                projects, and build a verified track record.
              </p>
              <div className="pt-1">
                <span className="text-emerald-700 font-mono text-[11px] font-semibold">
                  Less hype. More proof.
                </span>
              </div>
            </div>

            {/* Column 1: PLATFORM */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] font-mono">
                PLATFORM
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="hover:text-slate-900 transition-colors">
                    About Devxa
                  </a>
                </li>
                <li>
                  <a href="#compare" className="hover:text-slate-900 transition-colors">
                    Platform Comparison
                  </a>
                </li>
                <li>
                  <Link
                    to="/auth"
                    search={{ tab: "signin" }}
                    className="hover:text-slate-900 transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/auth"
                    search={{ tab: "signup" }}
                    className="hover:text-slate-900 transition-colors"
                  >
                    Join Early Access
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: COMPARISONS */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] font-mono">
                COMPARISONS
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#compare" className="hover:text-slate-900 transition-colors">
                    Devxa vs GitHub
                  </a>
                </li>
                <li>
                  <a href="#compare" className="hover:text-slate-900 transition-colors">
                    LinkedIn Alternative
                  </a>
                </li>
                <li>
                  <a href="#compare" className="hover:text-slate-900 transition-colors">
                    X (Twitter) Alternative
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: LEARN */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] font-mono">
                LEARN
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
                    What is a Call?
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
                    What is a Ship?
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
                    What is a Builder Record?
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
                    What is a Proof Card?
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & LLMs references */}
          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} Devxa. Where developers build their reputation.</p>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="hover:text-slate-700 transition-colors cursor-pointer">
                /llms.txt
              </span>
              <span>•</span>
              <span className="hover:text-slate-700 transition-colors cursor-pointer">
                /sitemap.xml
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
