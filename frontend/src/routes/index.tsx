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
  Upload,
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
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
  BookOpen,
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

// Hero Live Activity Cards (Devxa Carousel Reference)
interface HeroFeedItem {
  id: string;
  initial: string;
  author: string;
  action: string;
  badge: string;
  meta: string;
  linkText: string;
}

const HERO_FEED_ITEMS: HeroFeedItem[] = [
  {
    id: "1",
    initial: "E",
    author: "Prof. Vance published continuous marks",
    action: "CSE-401 • Section A • Distributed Systems",
    badge: "48 Students Verified",
    meta: "Internal, Lab & Project aggregates calculated automatically",
    linkText: "View Marksheet",
  },
  {
    id: "2",
    initial: "A",
    author: "Alexander Wright submitted team proposal",
    action: "Team Veritas • Byzantine Fault Tolerance Engine",
    badge: "Pending Faculty Guide",
    meta: "4 members co-signed across Section CSE-A",
    linkText: "Review Proposal",
  },
  {
    id: "3",
    initial: "S",
    author: "Section CSE-B completed milestone audit",
    action: "Continuous Evaluation Marks (0–20 clamped)",
    badge: "Class Average: 89.2%",
    meta: "Clean CSV export synchronized for university registrar",
    linkText: "Inspect Distribution",
  },
];

const DEPARTMENTS_MARQUEE = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Artificial Intelligence & Data Science",
  "Mechanical Engineering",
  "Autonomous Engineering Institutes",
  "State University Departments",
  "Higher Education Faculties",
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

  const handleExportMock = () => {
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white antialiased overflow-x-hidden">
      {/* 1. TOP NAVBAR (Devxa Minimalist Clean Style) */}
      <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 transition-colors">
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

          {/* Center Navigation Links (Devxa style typography) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600">
            <a href="#about" className="hover:text-slate-900 transition-colors">
              About
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
              How it works
            </a>
            <a href="#live-preview" className="hover:text-slate-900 transition-colors">
              Interactive Studio
            </a>
            <a href="#why-not-excel" className="hover:text-slate-900 transition-colors">
              Compare
            </a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">
              FAQ
            </a>
            <span className="text-slate-400 font-mono text-[11px] px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/70">
              Less chaos. More integrity.
            </span>
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>
                    {user.role === "teacher" ? "Faculty" : "Student"}: {user.name}
                  </span>
                </div>

                <Button
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8.5 px-3.5 gap-1.5 font-medium rounded-full shadow-xs"
                >
                  <span>Open {user.role === "teacher" ? "Teacher" : "Student"} Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 h-8.5 rounded-full"
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
                    className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs h-8.5 px-3.5 font-medium gap-1.5 rounded-full"
                  >
                    <span>Log in</span>
                  </Button>
                </Link>

                <Link to="/auth" search={{ tab: "signup" }}>
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8.5 px-4 font-medium rounded-full shadow-xs gap-1.5">
                    <span>Join now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
              How it works
            </a>
            <a
              href="#live-preview"
              onClick={() => setMobileNavOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-slate-100 text-slate-800 transition-colors"
            >
              Interactive Studio Preview
            </a>
            <a
              href="#why-not-excel"
              onClick={() => setMobileNavOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-slate-100 text-slate-800 transition-colors"
            >
              Compare with Spreadsheets
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

      {/* 2. HERO SECTION WITH DEVXA CONCENTRIC RADAR RINGS & FLOATING STATUS NODES */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden flex flex-col items-center justify-center">
        {/* Background Concentric Hairline Orbit Circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] pointer-events-none -z-10 flex items-center justify-center">
          {/* Inner Ring */}
          <div className="absolute w-[460px] h-[460px] rounded-full border border-slate-200/80 animate-orbit-pulse" />
          {/* Mid Ring */}
          <div className="absolute w-[760px] h-[760px] rounded-full border border-slate-200/60" />
          {/* Outer Ring */}
          <div className="absolute w-[1080px] h-[1080px] rounded-full border border-slate-200/40" />

          {/* Floating Orbit Node Badges (Devxa Floating Circular Nodes) */}
          <div className="absolute top-[28%] left-[24%] p-2 rounded-full bg-white border border-slate-200 shadow-xs text-slate-600 animate-float-subtle">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </div>
          <div
            className="absolute top-[32%] right-[22%] p-2 rounded-full bg-white border border-slate-200 shadow-xs text-slate-600 animate-float-subtle"
            style={{ animationDelay: "1.2s" }}
          >
            <Flag className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <div
            className="absolute top-[58%] left-[16%] p-2 rounded-full bg-white border border-slate-200 shadow-xs text-slate-600 animate-float-subtle"
            style={{ animationDelay: "2.4s" }}
          >
            <LineChart className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div
            className="absolute top-[64%] right-[17%] p-2 rounded-full bg-white border border-slate-200 shadow-xs text-slate-600 animate-float-subtle"
            style={{ animationDelay: "1.8s" }}
          >
            <Code2 className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <div
            className="absolute bottom-[22%] left-[32%] p-2 rounded-full bg-white border border-slate-200 shadow-xs text-slate-600 animate-float-subtle"
            style={{ animationDelay: "3s" }}
          >
            <Target className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div
            className="absolute bottom-[24%] right-[32%] p-2 rounded-full bg-white border border-slate-200 shadow-xs text-slate-600 animate-float-subtle"
            style={{ animationDelay: "0.6s" }}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          {/* Top Pill (Devxa Style: Dot + User Icon) */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-xs border border-slate-200 shadow-xs text-slate-700">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>Early access open</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <Users className="w-3 h-3 text-slate-500" />
              <span>For faculty, department chairs & students</span>
            </span>
          </div>

          {/* Primary High-Impact Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08] max-w-3xl mx-auto">
            Stop drowning in spreadsheets. <br />
            Start{" "}
            <span className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 bg-clip-text text-transparent">
              commanding your class.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Handover is the verified academic operating system for higher education. Replace
            fragile, version-drifted Excel sheets with continuous evaluation marks, isolated class
            sections, and collaborative project team reviews.
          </p>

          {/* Small Proof Tag Chips (Devxa Style) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-mono text-slate-600">
            <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 shadow-2xs">
              0 to 20 continuous marks. Clamped & verified.
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50/70 border border-emerald-200/80 text-emerald-800 font-medium shadow-2xs">
              Less chaos. More integrity.
            </span>
          </div>

          {/* Primary CTA Buttons (Devxa Pill Buttons) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link to="/auth" search={{ tab: "signin", role: "teacher" }}>
              <Button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs h-10 px-6 font-medium rounded-full shadow-xs gap-2">
                <span>Enter Faculty Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            <Link to="/auth" search={{ tab: "signin", role: "student" }}>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-slate-200 hover:bg-slate-50 text-slate-800 text-xs h-10 px-6 font-medium rounded-full shadow-xs gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>Explore Student Portal</span>
              </Button>
            </Link>
          </div>

          {/* Interactive Live Activity Card (Devxa Carousel Card Reference) */}
          <div className="pt-6 max-w-lg mx-auto">
            <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 shadow-sm text-left transition-all duration-300 hover:border-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {HERO_FEED_ITEMS[activeFeedIndex]?.initial}
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

                <Link
                  to="/auth"
                  search={{
                    tab: "signin",
                    role: activeFeedIndex === 1 ? "student" : "teacher",
                  }}
                >
                  <button className="text-[11px] font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors shrink-0">
                    {HERO_FEED_ITEMS[activeFeedIndex]?.linkText}
                  </button>
                </Link>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate">{HERO_FEED_ITEMS[activeFeedIndex]?.meta}</span>
                <span className="shrink-0 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200/60 ml-2">
                  {HERO_FEED_ITEMS[activeFeedIndex]?.badge}
                </span>
              </div>
            </div>

            {/* Pagination Indicators (Devxa dots) */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {HERO_FEED_ITEMS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveFeedIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeFeedIndex === i ? "w-6 bg-slate-800" : "w-1.5 bg-slate-300"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. DEVXA STYLE MARQUEE TICKER (WHERE ACADEMIC INTEGRITY MEETS EFFICIENCY) */}
      <section className="border-y border-slate-200 bg-slate-50/70 py-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 text-center font-semibold">
            WHERE ACADEMIC INTEGRITY MEETS EFFICIENCY • BUILT FOR
          </p>
        </div>

        {/* Continuous Running Marquee */}
        <div className="relative w-full overflow-hidden flex items-center">
          <div className="animate-marquee-scroll flex items-center gap-8 text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">
            {[...DEPARTMENTS_MARQUEE, ...DEPARTMENTS_MARQUEE].map((dept, index) => (
              <div key={index} className="flex items-center gap-3 shrink-0">
                <span>{dept}</span>
                <span className="text-slate-300">•</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. "WHAT IS HANDOVER?" (Devxa Image 2 Reference) */}
      <section id="about" className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-mono font-semibold tracking-wider uppercase text-blue-600">
            CONTINUOUS EVALUATION SYSTEM
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            What is Handover?
          </h2>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          <p>
            Handover is the institutional academic operating system where college faculty and
            students coordinate course marks through verified records, not fragmented spreadsheet
            attachments. Instead of circulating multiple conflicting Excel files with broken
            formulas and unverified scores, teachers manage continuous marks directly in a live,
            clamped tabular environment.
          </p>
          <p>
            Every class section is strictly isolated by multi-tenant access boundaries, every marks
            mutation is bounded between 0 and 20, and every student receives a private, tamper-proof
            scorecard. Students can propose collaborative project teams and track course deadlines,
            while department chairs export clean, verified marksheets in one click.
          </p>
        </div>
      </section>

      {/* 5. "HOW HANDOVER WORKS" (Devxa 4-Card Architecture Grid Reference - Image 3) */}
      <section id="how-it-works" className="py-12 max-w-5xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-mono font-semibold tracking-wider uppercase text-emerald-600">
            THE ARCHITECTURE OF ACADEMIC INTEGRITY
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            How Handover works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Handover gives academic departments four foundational mechanisms to eliminate
            spreadsheet chaos and ensure absolute grade transparency.
          </p>
        </div>

        {/* 4-Card Grid matching Devxa Image 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Continuous Marks */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-400 transition-all shadow-xs group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Continuous Marks: Real-time Evaluation
                </h3>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter internal exam, lab practical, and project milestone scores with
                keyboard-driven speed (Tab/Enter). Clamped strictly 0 to 20 with automatic letter
                grade tier computation (O, A+, A, B+, B, F).
              </p>
            </div>
          </div>

          {/* Card 2: Class Sections */}
          <div className="bg-white border-2 border-emerald-500/80 rounded-2xl p-6 space-y-4 hover:border-emerald-600 transition-all shadow-xs group bg-emerald-50/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Class Sections: Multi-Tenant Isolation
                </h3>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Keep CSE-A, CSE-B, and IT-A rosters strictly separated. Scoped by institutionId and
                sectionId so data never bleeds across classes or semesters.
              </p>
            </div>
          </div>

          {/* Card 3: Student Academic Portal */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-400 transition-all shadow-xs group">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-slate-950 transition-colors">
                  Student Portal: Verified Academic Record
                </h3>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-950 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students access personal, read-only scorecards. Zero peer grade visibility, FERPA
                compliant privacy, assignment submissions, and collaborative group proposals.
              </p>
            </div>
          </div>

          {/* Card 4: Bi-Directional CSV */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-400 transition-all shadow-xs group">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Bi-Directional CSV: 1-Click Synchronization
                </h3>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seamlessly batch-import student rosters from university administrative files and
                export formatted marksheets ready for registrar submission without formula errors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE WORKSPACE STUDIO CANVAS (Live Test-Drive Sandbox) */}
      <section id="live-preview" className="py-12 bg-slate-50/60 border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs">
              <Laptop className="w-3.5 h-3.5 text-slate-600" />
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
                  * Try changing values above (0–20) — notice automatic validation and instant grade
                  recalculation.
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

      {/* 7. WHY NOT EXCEL? HIGH-CONTRAST COMPARISON (Devxa Compare Style) */}
      <section
        id="why-not-excel"
        className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-8 space-y-8"
      >
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <p className="text-xs font-mono font-semibold tracking-wider uppercase text-slate-500">
            WHY COLLEGES UPGRADE
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Why Excel Spreadsheets Fail Academic Departments
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Desktop spreadsheets are great personal calculators, but disastrous for shared,
            collaborative grading and department management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Old Way: Excel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-rose-700">
                  The Fragile Old Way
                </span>
                <h3 className="text-base font-semibold text-slate-900">Manual Excel Files</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold">
                <X className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  ×
                </span>
                <div>
                  <strong className="text-slate-900 block font-medium">
                    Version Drift & Missing Files:
                  </strong>
                  Conflicting versions like{" "}
                  <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">
                    marks_final_v2_edit.xlsx
                  </code>{" "}
                  scattered across USB sticks and teacher mailboxes.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  ×
                </span>
                <div>
                  <strong className="text-slate-900 block font-medium">
                    Formula Errors & Out-of-Bounds Scores:
                  </strong>
                  Accidental 25/20 inputs entered without validation, broken{" "}
                  <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">#REF!</code>{" "}
                  cells, and incorrect totals.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  ×
                </span>
                <div>
                  <strong className="text-slate-900 block font-medium">
                    Zero Student Privacy (FERPA Violations):
                  </strong>
                  Displaying entire class marksheets on noticeboards or mailing bulk sheets where
                  every student sees peer scores.
                </div>
              </div>
            </div>
          </div>

          {/* New Standard: Handover */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 sm:p-7 space-y-5 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-emerald-400">
                  The Modern Standard
                </span>
                <h3 className="text-base font-semibold text-white">Handover Academic OS</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center font-bold">
                <Check className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-white block font-medium">
                    Single Atomic Source of Truth:
                  </strong>
                  All continuous evaluations persist in real-time. Faculty and students always see
                  the latest authorized record.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-white block font-medium">
                    Strict Bounds & Automatic Tiers:
                  </strong>
                  Clamped 0 to 20 inputs with instant automated letter grading (O, A+, A, B+, B, F)
                  verified at every boundary.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
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
            </div>
          </div>
        </div>
      </section>

      {/* 8. DEVXA ACCORDION FAQ (Image 4 Reference) */}
      <section id="faq" className="py-16 max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs font-mono font-semibold tracking-wider uppercase text-blue-600">
            FREQUENTLY ASKED QUESTIONS
          </p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Handover FAQ</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Everything you need to know about setting up and operating Handover.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Can instructors export continuous marks to CSV or Excel?",
              a: "Yes. In both the Student Roster and Marks Manager views, instructors can click 'Export CSV' at any time to instantly download a formatted spreadsheet containing roll numbers, student names, internal exam, lab, practical, project scores, and auto-computed totals.",
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
              a: "Students click 'Join now' on the top navigation bar, enter their Full Name, College Email, Roll Number, and select their assigned section. Their student profile is created immediately and routed to their personal Student Academic Portal.",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-xs"
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
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3.5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. DARK RADIAL GLOW BOTTOM CTA CARD (Devxa Image 5 Reference) */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-8">
        <div className="relative rounded-3xl bg-slate-950 text-white p-8 sm:p-14 border border-slate-800 text-center space-y-6 overflow-hidden shadow-xl">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
              WHERE ACADEMIC EXCELLENCE STARTS
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Your course records already matter. <br />
              Let them be verified.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
              Join faculty and students managing continuous marks with absolute integrity and zero
              spreadsheet hassle.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
            <Link to="/auth" search={{ tab: "signin", role: "teacher" }}>
              <Button className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-950 text-xs h-10 px-6 font-semibold rounded-full shadow-md gap-2">
                <span>Enter Faculty Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            <Link to="/auth" search={{ tab: "signup" }}>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-slate-800 bg-slate-900/80 hover:bg-slate-900 text-white text-xs h-10 px-6 font-semibold rounded-full gap-2"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Sign in to workspace</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. DEVXA 4-COLUMN FOOTER (Image 5 Reference) */}
      <footer className="border-t border-slate-200 bg-white pt-16 pb-12 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Brand Column (2 cols wide) */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <HandoverLogo size="sm" />
                <span>Handover</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                The verified academic operating system for college faculty and students. Replace
                spreadsheet drift with continuous marks, isolated class sections, and team reviews.
              </p>
              <div className="pt-1">
                <span className="text-emerald-700 font-mono text-[11px] font-semibold">
                  Less spreadsheets. More integrity.
                </span>
              </div>
            </div>

            {/* Navigation Column: PLATFORM */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] font-mono">
                PLATFORM
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="hover:text-slate-900 transition-colors">
                    About Handover
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#live-preview" className="hover:text-slate-900 transition-colors">
                    Interactive Studio
                  </a>
                </li>
                <li>
                  <Link
                    to="/auth"
                    search={{ tab: "signin" }}
                    className="hover:text-slate-900 transition-colors"
                  >
                    Faculty Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Navigation Column: COMPARISONS */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] font-mono">
                COMPARISONS
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#why-not-excel" className="hover:text-slate-900 transition-colors">
                    Handover vs Excel
                  </a>
                </li>
                <li>
                  <a href="#why-not-excel" className="hover:text-slate-900 transition-colors">
                    Google Sheets Alternative
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
                    Section Multi-Tenancy
                  </a>
                </li>
              </ul>
            </div>

            {/* Navigation Column: RESOURCES */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] font-mono">
                RESOURCES
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#faq" className="hover:text-slate-900 transition-colors">
                    Handover FAQ
                  </a>
                </li>
                <li>
                  <Link
                    to="/auth"
                    search={{ tab: "signup" }}
                    className="hover:text-slate-900 transition-colors"
                  >
                    Student Registration
                  </Link>
                </li>
                <li>
                  <span className="text-slate-400 font-mono text-[11px]">Privacy & FERPA</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Sitemaps (Devxa style) */}
          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} Handover. Where educators command their classes.</p>
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
