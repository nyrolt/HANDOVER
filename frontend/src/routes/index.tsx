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
  ChevronRight,
  Clock,
  BookOpen,
  Sparkles,
  Sliders,
  Filter,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/auth";
import { HandoverLogo } from "@/components/common/HandoverLogo";
import { AsciiGlitchRipple } from "@/components/ui/ascii-glitch-ripple";
import TextAnimation from "@/components/ui/stagger-text";
import { InteractiveParticles } from "@/components/ui/interactive-particles";
import { NotchNavbar } from "@/components/ui/notch-navbar";
import { KineticTextLoader } from "@/components/ui/kinetic-text-loader";
import { AgentBentoGrid } from "@/components/ui/agent-bento-grid";

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
  {
    rollNo: "2024-CS-006",
    name: "Sophia Martinez",
    email: "s.martinez@univ.edu",
    group: "Quantum Core",
    internal: 17,
    lab: 18,
    practical: 16,
    project: 18,
  },
];

// Hero Live Activity Stack
interface HeroFeedItem {
  id: string;
  avatarBg: string;
  avatarText: string;
  author: string;
  action: string;
  badge: string;
  badgeType: "live" | "correct" | "pending";
  meta: string;
  subScore: string;
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
    subScore: "48 / 48 Students Scored",
  },
  {
    id: "2",
    avatarBg: "bg-emerald-700 text-white",
    avatarText: "A",
    author: "Alexander Wright formed Team Veritas",
    action: "Byzantine Fault Tolerant Replication Engine",
    badge: "Proposal Approved",
    badgeType: "correct",
    meta: "4 members co-signed • Verified across Section CSE-A",
    subScore: "Guide: Dr. E. Vance",
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
    subScore: "Grade O / A+ Tiers: 84%",
  },
];

const TICKER_ITEMS = [
  "Student Builders",
  "College Faculty",
  "Department Chairs",
  "Course Coordinators",
  "Autonomous Institutes",
  "State Universities",
  "Engineering Colleges",
  "Computer Science & Eng",
  "Information Technology",
  "Electronics & Communication",
  "Higher Education Faculties",
];

const COMPARISON_ROWS = [
  {
    capability: "Continuous Marks (0–20 Clamped)",
    excel: "Manual formulas, prone to typing 25/20",
    sheets: "Broken #REF! errors on drag-fill",
    legacyLms: "Rigid semester end exam only",
    handover: "Keyboard driven (Tab/Enter) + strict [0, 20] clamp",
  },
  {
    capability: "Student Grade Privacy (FERPA)",
    excel: "Public sheet sharing or noticeboard lists",
    sheets: "Accidental public edit/view links",
    legacyLms: "Complex administrative permissions",
    handover: "Isolated read-only personal verified scorecard",
  },
  {
    capability: "Collaborative Project Groups",
    excel: "Lost emails, duplicate topics, handwritten slips",
    sheets: "Unchecked duplicates & row overwrites",
    legacyLms: "No student proposal workflow",
    handover: "Student proposal nominations + 1-click guide reviews",
  },
  {
    capability: "Class Multi-Tenancy Scoping",
    excel: "Separate fragile files scattered across drives",
    sheets: "Permission clutter & shared folder drift",
    legacyLms: "Heavy administrative configuration",
    handover: "Strict sectionId isolation (CSE-A, CSE-B never leak)",
  },
  {
    capability: "Real-Time Letter Grade Tiers",
    excel: "Complex nested IF statements that corrupt",
    sheets: "Slow script triggers & manual recalculations",
    legacyLms: "Batch semester cron jobs",
    handover: "Instant automatic grading (O, A+, A, B+, B, F)",
  },
  {
    capability: "Administrative Submission",
    excel: "Conflicting versions (v2_final_final.xlsx)",
    sheets: "Formatting mismatches on CSV export",
    legacyLms: "Manual database reconciliations",
    handover: "1-Click UTF-8 CSV synchronization for registrars",
  },
];

function IndexPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
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
    }, 4500);
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
  const passCount = demoRows.filter(
    (r) => r.internal + r.lab + r.practical + r.project >= 40,
  ).length;
  const passPercentage = Math.round((passCount / demoRows.length) * 100);

  const handleExportMock = () => {
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white antialiased overflow-x-hidden">
      {/* 1. TOP NOTCH NAVBAR */}
      <NotchNavbar userRole={user?.role} onLogout={logout} />
      <div className="h-16" />

      {/* 2. HERO SECTION — DENSE, IMPACTFUL, WITH INTERACTIVE PARTICLES & FULL ORBIT CANVASES */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden flex flex-col items-center justify-center">
        {/* Interactive Ambient Particles in Background */}
        <div className="absolute inset-0 pointer-events-auto opacity-35 dark:opacity-20 -z-20 overflow-hidden">
          <InteractiveParticles
            className="w-full h-full"
            color="#6366F1"
            size={1.5}
            depth={3.0}
            randomness={1.8}
            touchRadius={0.16}
          />
        </div>

        {/* Background Concentric Rotating Orbit Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] pointer-events-none -z-10 flex items-center justify-center">
          {/* Subtle Radial Glow in Center */}
          <div className="absolute w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl pointer-events-none" />

          {/* Outer Ring */}
          <div className="absolute w-[1180px] h-[1180px] rounded-full border border-slate-200/40" />

          {/* Middle Rotating Orbit Ring with Nodes */}
          <div className="absolute w-[860px] h-[860px] rounded-full border border-slate-200/70 animate-spin-orbit">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 animate-spin-counter">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </div>
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 animate-spin-counter">
              <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 animate-spin-counter">
              <Code2 className="w-3.5 h-3.5 text-slate-700" />
            </div>
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 animate-spin-counter">
              <Flag className="w-3.5 h-3.5 text-slate-600" />
            </div>
          </div>

          {/* Inner Rotating Orbit Ring */}
          <div className="absolute w-[560px] h-[560px] rounded-full border border-slate-200/80 animate-spin-orbit-slow">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 animate-spin-counter-slow">
              <UserCheck className="w-3.5 h-3.5 text-slate-700" />
            </div>
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 animate-spin-counter-slow">
              <Target className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 animate-spin-counter-slow">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 animate-spin-counter-slow">
              <LineChart className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Hero Content — Expanded container eliminating empty space */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full text-[11px] font-medium bg-white border border-slate-200 shadow-2xs text-slate-700">
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

          {/* Primary Headline with TextAnimation */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08] max-w-4xl mx-auto">
            <TextAnimation divideBy="word">
              Stop saying you're managing. Start commanding it.
            </TextAnimation>
          </h1>

          {/* Subtitle */}
          <div className="space-y-1 max-w-3xl mx-auto">
            <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
              Handover is the proof-based academic workspace for faculty, course coordinators, and
              student builders.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Manage continuous marks, ship real group projects, and build a tamper-proof department
              record that shows what you can actually do.
            </p>
          </div>

          {/* Proof Tag Chips with AsciiGlitchRipple */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-mono">
            <span className="px-3.5 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE]/60 text-[#1D4ED8] font-medium">
              <AsciiGlitchRipple as="span">
                Show what you know. Prove what you record.
              </AsciiGlitchRipple>
            </span>
            <span className="px-3.5 py-1 rounded-md bg-[#F0FDF4] border border-[#BBF7D0]/60 text-[#15803D] font-medium">
              <AsciiGlitchRipple as="span">Less hype. More proof.</AsciiGlitchRipple>
            </span>
          </div>

          {/* Primary CTA Buttons with AsciiGlitchRipple */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/auth" search={{ tab: "signin", role: "teacher" }}>
              <Button className="w-full sm:w-auto bg-slate-950 hover:bg-slate-800 text-white text-xs h-10 px-7 font-semibold rounded-full shadow-xs gap-2 group">
                <AsciiGlitchRipple as="span" className="text-white">
                  Join Handover
                </AsciiGlitchRipple>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>

            <Link to="/auth" search={{ tab: "signin", role: "student" }}>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-slate-200 hover:bg-slate-50 text-slate-800 text-xs h-10 px-6 font-semibold rounded-full shadow-xs gap-2"
              >
                <AsciiGlitchRipple as="span">Sign in with Portal</AsciiGlitchRipple>
              </Button>
            </Link>
          </div>

          {/* 3D Stacked Live Carousel Card */}
          <div className="pt-6 max-w-lg mx-auto relative h-28 flex flex-col items-center">
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
                <span className="shrink-0 text-slate-700 font-semibold font-mono">
                  {HERO_FEED_ITEMS[activeFeedIndex]?.subScore}
                </span>
              </div>
            </div>

            {/* Pagination Indicators */}
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

        {/* Hero Quick Key Metrics Banner — Fills horizontal space naturally */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 w-full mt-12 pt-6 border-t border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-50/70 border border-slate-200/60 rounded-xl">
              <span className="text-[10px] font-mono text-slate-500 block uppercase font-semibold">
                EVALUATION CLAMP
              </span>
              <span className="text-base font-bold text-slate-900">0 to 20 Strict Bounds</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Zero out-of-range grade inputs</p>
            </div>
            <div className="p-3 bg-slate-50/70 border border-slate-200/60 rounded-xl">
              <span className="text-[10px] font-mono text-slate-500 block uppercase font-semibold">
                MULTI-TENANCY
              </span>
              <span className="text-base font-bold text-emerald-700">100% Section Isolation</span>
              <p className="text-[11px] text-slate-500 mt-0.5">CSE-A, CSE-B never leak data</p>
            </div>
            <div className="p-3 bg-slate-50/70 border border-slate-200/60 rounded-xl">
              <span className="text-[10px] font-mono text-slate-500 block uppercase font-semibold">
                STUDENT PRIVACY
              </span>
              <span className="text-base font-bold text-indigo-700">FERPA Compliant</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Read-only verified scorecards</p>
            </div>
            <div className="p-3 bg-slate-50/70 border border-slate-200/60 rounded-xl">
              <span className="text-[10px] font-mono text-slate-500 block uppercase font-semibold">
                INTEGRITY CHECK
              </span>
              <span className="text-base font-bold text-slate-900">26 / 26 System Tests</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Automated RBAC verification</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DEVXA TICKER RIBBON */}
      <section className="border-y border-slate-200/80 bg-slate-50/50 py-5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 text-center font-semibold">
            WHERE BUILDERS PROVE IT. MADE FOR
          </p>
        </div>

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

      {/* 4. "WHAT IS HANDOVER?" (2-COLUMN BALANCED STORYTELLING ELIMINATING EMPTY SPACE) */}
      <section id="about" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column (7 cols): Narrative */}
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-mono font-semibold tracking-wider uppercase text-blue-600">
              PROOF-BASED NETWORK
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              What is Handover?
            </h2>
            <div className="space-y-3.5 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              <p>
                Handover is an academic management workspace where educators and students build
                reputation through verified proof, not unverified spreadsheet hype. Instead of
                emailing conflicting versions like{" "}
                <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">
                  marks_final_v2_edit.xlsx
                </code>{" "}
                with broken formulas, instructors record bounded scores with instant calculations,
                ship real collaborative projects, and let results speak for themselves.
              </p>
              <p>
                Every class section is verified by daily automated isolation checks, every score is
                validated between 0 and 20, and your Academic Record turns it all into a verified
                department track record you can share directly with university registrars.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-medium text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Single atomic source of truth</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero accidental 25/20 score entries</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Private scorecards (No bulletin leak)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1-Click registrar CSV export</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Live Academic Integrity Flowchart Card */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-900 font-mono uppercase">
                  Continuous Verification Stream
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                Live Audit
              </span>
            </div>

            {/* Pipeline Steps */}
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Faculty Enters Marks</h4>
                  <p className="text-slate-500 text-[11px]">
                    Internal, Lab, Practical & Project (0–20 clamped).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
                <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Automated Grade Tier Engine</h4>
                  <p className="text-slate-500 text-[11px]">
                    Instant aggregation to 80 marks and O/A+/A letter tier assignments.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
                <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Student Verified Portal</h4>
                  <p className="text-slate-500 text-[11px]">
                    Students verify transcripts and propose collaborative project groups.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Registrar Synchronization</h4>
                  <p className="text-slate-500 text-[11px]">
                    Official UTF-8 CSV marksheets exported without formula corruption.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. "HOW HANDOVER WORKS" (EXPANDED 4-CARD ARCHITECTURE GRID - 6XL) */}
      <section
        id="architecture"
        className="py-16 max-w-6xl mx-auto px-4 sm:px-8 space-y-8 border-t border-slate-100 scroll-mt-20 relative"
      >
        <span id="how-it-works" className="absolute -top-20 pointer-events-none" />
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

        {/* 4-Card Grid with visual details in each card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Continuous Marks */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-400 transition-all shadow-xs group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
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

            {/* Mini Visual Sandbox in Card */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600 bg-slate-50/70 p-2.5 rounded-lg">
              <span>Internal 18 + Lab 19 + Prac 17 + Proj 18</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Grade O (72/80)
              </span>
            </div>
          </div>

          {/* Card 2: Class Sections (Active Emerald Highlight) */}
          <div className="bg-white border-2 border-emerald-500/90 rounded-2xl p-6 space-y-4 hover:border-emerald-600 transition-all shadow-xs group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/80 text-emerald-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
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

            {/* Mini Visual Sandbox in Card */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600 bg-slate-50/70 p-2.5 rounded-lg">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>CSE-A (48) • CSE-B (45) • IT-A (42)</span>
              </span>
              <span className="font-bold text-slate-700">Multi-Tenant Scoped</span>
            </div>
          </div>

          {/* Card 3: Academic Record */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-400 transition-all shadow-xs group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-slate-950 transition-colors">
                    Academic Record: your verified track record
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-950 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Marks, project submissions, and attendance combine into a record that shows what
                  you actually deliver.
                </p>
              </div>
            </div>

            {/* Mini Visual Sandbox in Card */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600 bg-slate-50/70 p-2.5 rounded-lg">
              <span>Read-Only FERPA Scorecard</span>
              <span className="font-bold text-indigo-700">Zero Peer Leakage</span>
            </div>
          </div>

          {/* Card 4: Proof Marksheets */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-400 transition-all shadow-xs group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
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

            {/* Mini Visual Sandbox in Card */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600 bg-slate-50/70 p-2.5 rounded-lg">
              <span>UTF-8 Formatted • Deduplicated</span>
              <span className="font-bold text-slate-900">Registrar Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5.5. VENGEANCE UI RESPONSIVE BENTO GRID SECTION */}
      <section
        id="capabilities"
        className="py-20 max-w-6xl mx-auto px-4 sm:px-8 space-y-8 border-t border-slate-100 scroll-mt-20"
      >
        <div className="space-y-3">
          <p className="text-xs font-mono font-semibold tracking-wider uppercase text-indigo-600">
            <AsciiGlitchRipple as="span">BENTO CAPABILITIES MATRIX</AsciiGlitchRipple>
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            <TextAnimation divideBy="word">Engineered for Real Academic Workloads</TextAnimation>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            From real-time pipeline telemetry to student grade isolation and continuous marks audit
            logs.
          </p>
        </div>

        {/* 5-Card Responsive Bento Grid */}
        <AgentBentoGrid />
      </section>

      {/* 6. DEVXA COMPARISON TABLE (EXPANDED TO FULL 6XL WIDTH ELIMINATING EMPTY MARGINS) */}
      <section
        id="comparison"
        className="py-20 max-w-6xl mx-auto px-4 sm:px-8 space-y-6 scroll-mt-20 relative"
      >
        <span id="compare" className="absolute -top-20 pointer-events-none" />
        <div className="space-y-3">
          <p className="text-xs font-mono font-semibold tracking-wider uppercase text-blue-600">
            COMPARISON MATRIX
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            How Handover is different from Excel, Google Sheets, ERPs and Legacy LMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Other tools show raw, unverified data cells. Handover connects continuous evaluation,
            student verification, and project collaboration into one verified record.
          </p>
        </div>

        {/* Full-Width Comparison Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-700 bg-slate-50/70">
                  <th className="py-4 px-5 font-semibold text-slate-900 text-sm">Capability</th>
                  <th className="py-4 px-4 text-slate-600 font-medium">Excel Spreadsheets</th>
                  <th className="py-4 px-4 text-slate-600 font-medium">Google Sheets</th>
                  <th className="py-4 px-4 text-slate-600 font-medium">Legacy ERP / LMS</th>
                  <th className="py-4 px-5 font-bold text-indigo-700 bg-indigo-50/70 text-sm border-l border-indigo-100">
                    Handover Academic OS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5 font-medium text-slate-900">{row.capability}</td>
                    <td className="py-4 px-4 text-slate-500 leading-relaxed">{row.excel}</td>
                    <td className="py-4 px-4 text-slate-500 leading-relaxed">{row.sheets}</td>
                    <td className="py-4 px-4 text-slate-500 leading-relaxed">{row.legacyLms}</td>
                    <td className="py-4 px-5 font-semibold text-slate-950 bg-indigo-50/60 leading-relaxed border-l border-indigo-100">
                      {row.handover}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE STUDIO SANDBOX (EXPANDED TO FULL 6XL WITH PRO TOOLBAR) */}
      <section
        id="studio"
        className="py-16 bg-slate-50/70 border-y border-slate-200/80 scroll-mt-20 relative"
      >
        <span id="live-preview" className="absolute -top-20 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs">
              <Laptop className="w-3.5 h-3.5 text-slate-600" />
              <span>Interactive Studio Sandbox</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Test-drive the academic workspace live
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Edit continuous marks cells inline below to see automatic bounding, grade tiers, and
              class stats recompute in real time.
            </p>
          </div>

          {/* Studio Browser Frame */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Window Header / Bezel */}
            <div className="bg-slate-900 text-slate-300 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 font-mono text-[11px] text-slate-300">
                  <Lock className="w-3 h-3 text-emerald-400" />
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
              <div className="p-5 sm:p-7 space-y-5">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
                  <div>
                    <span className="text-slate-500 block font-mono text-[10px]">
                      CLASS AVERAGE
                    </span>
                    <span className="font-bold text-slate-900 text-base">{classAvg}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-mono text-[10px]">TOP SCORE</span>
                    <span className="font-bold text-slate-900 text-base">{topScore} / 80</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-mono text-[10px]">
                      PASS PERCENTAGE
                    </span>
                    <span className="font-bold text-emerald-700 text-base">
                      {passPercentage}% Passed
                    </span>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={handleExportMock}
                      className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>{copiedNotification ? "Exported!" : "Export CSV"}</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Table with 6 realistic rows */}
                <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3 font-mono">Roll No</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Project Group</th>
                        <th className="p-3 font-mono text-center">Internal (/20)</th>
                        <th className="p-3 font-mono text-center">Lab (/20)</th>
                        <th className="p-3 font-mono text-center">Practical (/20)</th>
                        <th className="p-3 font-mono text-center">Project (/20)</th>
                        <th className="p-3 font-mono text-center">Total (/80)</th>
                        <th className="p-3 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {demoRows.map((r, idx) => {
                        const total = r.internal + r.lab + r.practical + r.project;
                        const grade = calculateGrade(total);
                        return (
                          <tr key={r.rollNo} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-3 font-mono text-slate-600 font-medium">{r.rollNo}</td>
                            <td className="p-3 font-medium text-slate-900">{r.name}</td>
                            <td className="p-3 text-slate-600 font-mono text-[11px]">{r.group}</td>
                            <td className="p-2.5 text-center">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={r.internal}
                                onChange={(e) => handleScoreChange(idx, "internal", e.target.value)}
                                className="w-12 text-center border border-slate-200 rounded p-1 font-mono text-xs focus:border-slate-800 focus:outline-hidden"
                              />
                            </td>
                            <td className="p-2.5 text-center">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={r.lab}
                                onChange={(e) => handleScoreChange(idx, "lab", e.target.value)}
                                className="w-12 text-center border border-slate-200 rounded p-1 font-mono text-xs focus:border-slate-800 focus:outline-hidden"
                              />
                            </td>
                            <td className="p-2.5 text-center">
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
                            <td className="p-2.5 text-center">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={r.project}
                                onChange={(e) => handleScoreChange(idx, "project", e.target.value)}
                                className="w-12 text-center border border-slate-200 rounded p-1 font-mono text-xs focus:border-slate-800 focus:outline-hidden"
                              />
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-slate-900">
                              {total}
                            </td>
                            <td className="p-2.5 text-center">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${grade.color}`}
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

                <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono gap-2 pt-1">
                  <span>Showing Section CSE-401 (Continuous Evaluation Active)</span>
                  <span>* Inputs are clamped 0 to 20 — notice instant grade recalculation.</span>
                </div>
              </div>
            )}

            {/* TAB 2: STUDENT SCORECARD VIEW */}
            {activeDemoTab === "student" && (
              <div className="p-5 sm:p-7 space-y-4">
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">Alexander Wright</h4>
                      <p className="text-xs text-slate-500 font-mono">
                        Roll: 2024-CS-001 • Section: CSE-A • B.Tech Computer Science
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verified Academic Transcript</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-mono block">
                        INTERNAL EXAM
                      </span>
                      <span className="font-bold text-slate-900 text-lg">18 / 20</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-mono block">LAB RECORD</span>
                      <span className="font-bold text-slate-900 text-lg">19 / 20</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-mono block">PRACTICAL</span>
                      <span className="font-bold text-slate-900 text-lg">17 / 20</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-mono block">
                        PROJECT MILESTONE
                      </span>
                      <span className="font-bold text-slate-900 text-lg">18 / 20</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">
                        Aggregate Score: 72 / 80 (90.0%)
                      </span>
                      <span className="text-xs text-slate-500">
                        Assigned Tier: Outstanding • Official Transcript Signed by Dr. E. Vance
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      Grade O
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PROJECT GROUPS VIEW */}
            {activeDemoTab === "groups" && (
              <div className="p-5 sm:p-7 space-y-4">
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">Team Veritas</h4>
                      <p className="text-xs text-slate-500">
                        Topic: Byzantine Fault Tolerant Replication Engine
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Approved • Faculty Guide: Dr. E. Vance
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between">
                      <span className="font-medium text-slate-900">Alexander Wright (Leader)</span>
                      <span className="font-mono text-slate-500 text-[11px]">2024-CS-001</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between">
                      <span className="font-medium text-slate-900">Elena Rostova</span>
                      <span className="font-mono text-slate-500 text-[11px]">2024-CS-002</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. DEVXA 2-COLUMN BALANCED FAQ SECTION (ELIMINATES EMPTY SIDES) */}
      <section id="faq" className="py-20 max-w-6xl mx-auto px-4 sm:px-8 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (5 cols): Context and Help info */}
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-mono font-semibold tracking-wider uppercase text-blue-600">
              FREQUENTLY ASKED QUESTIONS
            </p>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Handover FAQ</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Everything you need to know about setting up Handover, continuous marks evaluation,
              student privacy, and department submissions.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mt-4 text-xs">
              <h4 className="font-semibold text-slate-900">Need specific university deployment?</h4>
              <p className="text-slate-500 leading-relaxed">
                Handover supports role-based access control (RBAC), multi-tenancy, and CSV export
                compatible with standard university ERPs.
              </p>
              <Link to="/auth" search={{ tab: "signup" }} className="inline-block pt-1">
                <span className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  <span>Create Department Account</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column (7 cols): Accordion Items */}
          <div className="lg:col-span-7 space-y-3">
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
                q: "Can instructors export continuous marks to CSV or Excel?",
                a: "Yes. In both the Student Roster and Marks Manager views, instructors can click 'Export CSV' at any time to instantly download a formatted spreadsheet containing roll numbers, student names, internal exam, lab, practical, project scores, and auto-computed totals.",
              },
              {
                q: "How is Handover different from LinkedIn or GitHub?",
                a: "While GitHub hosts code repositories and LinkedIn displays self-reported resumes, Handover verifies continuous coursework execution, clamped evaluation marks, and approved group project teams in one verified record.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs"
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
        </div>
      </section>

      {/* 9. DARK RADIAL GLOW BOTTOM CTA CARD (EXPANDED TO 6XL CONTAINER) */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-8">
        <div className="relative rounded-3xl bg-[#090D16] text-white p-8 sm:p-14 border border-slate-800/80 text-center space-y-6 overflow-hidden shadow-xl">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
              WHERE BUILDERS PROVE IT
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Your work already says a lot. <br />
              Let it speak.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg mx-auto">
              Join now and be among the first educators and students to manage a verified public
              Record.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
            <Link to="/auth" search={{ tab: "signup" }}>
              <Button className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-950 text-xs h-10 px-7 font-semibold rounded-full shadow-md gap-2">
                <span>Join now</span>
              </Button>
            </Link>

            <Link to="/auth" search={{ tab: "signin" }}>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-white text-xs h-10 px-7 font-semibold rounded-full gap-2"
              >
                <span>Sign in to workspace</span>
              </Button>
            </Link>
          </div>

          <p className="text-[11px] font-mono text-slate-500 relative z-10">
            Free for open academic sections • Multi-tenant role-based access control
          </p>
        </div>
      </section>

      {/* 10. DEVXA 4-COLUMN FOOTER (EXPANDED TO FULL 6XL/7XL WIDTH) */}
      <footer className="border-t border-slate-200/80 bg-white pt-16 pb-12 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Brand Column (2 cols wide) */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <HandoverLogo size="sm" />
                <span>Devxa</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
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
