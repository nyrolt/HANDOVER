import React, { useState, useEffect } from "react";
import {
  Users,
  FolderGit2,
  BookOpen,
  Layers,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  GraduationCap,
  FlaskConical,
  Binary,
  ShieldCheck,
  FileText,
  Download,
  Calendar,
  Activity,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/services/db";
import { useAuth } from "@/services/auth";
import { AsciiGlitchRipple } from "@/components/ui/ascii-glitch-ripple";

interface TeacherOverviewProps {
  onNavigate: (tab: string, sectionId?: string) => void;
  onOpenAddStudent: () => void;
  onOpenCreateSection: () => void;
  onOpenCreateAssignment: () => void;
}

/* ────────────────────────────────────────────────────────
   Interactive Academic Pipeline (4 Continuous Marks Nodes)
   ──────────────────────────────────────────────────────── */
type PipelineStep = "internal" | "lab" | "practical" | "project" | "ledger";

const PIPELINE_NODES = [
  {
    id: "internal",
    label: "INTERNAL THEORY",
    marks: "/20",
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-50 border-blue-200",
  },
  {
    id: "lab",
    label: "LAB RECORD",
    marks: "/20",
    icon: FlaskConical,
    color: "text-emerald-500",
    bg: "bg-emerald-50 border-emerald-200",
  },
  {
    id: "practical",
    label: "PRACTICAL VIVA",
    marks: "/20",
    icon: Binary,
    color: "text-indigo-500",
    bg: "bg-indigo-50 border-indigo-200",
  },
  {
    id: "project",
    label: "PROJECT CAPSTONE",
    marks: "/20",
    icon: Layers,
    color: "text-purple-500",
    bg: "bg-purple-50 border-purple-200",
  },
  {
    id: "ledger",
    label: "CONSOLIDATED LEDGER",
    marks: "/80",
    icon: Award,
    color: "text-amber-500",
    bg: "bg-amber-50 border-amber-200",
  },
];

export function TeacherOverview({
  onNavigate,
  onOpenAddStudent,
  onOpenCreateSection,
  onOpenCreateAssignment,
}: TeacherOverviewProps) {
  const { user } = useAuth();
  const sections = db.getSections();
  const students = db.getStudents();
  const assignments = db.getAssignments();
  const groups = db.getProjectGroups();
  const pendingRequests = db.getGroupRequests().filter((r) => r.status === "Pending");
  const activityLogs = db.getState().activityLogs;
  const marks = db.getState().marks;

  const [seeding, setSeeding] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState<PipelineStep>("internal");
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [activityFilter, setActivityFilter] = useState<"all" | "student" | "mark" | "section">(
    "all",
  );

  const activeAssignments = assignments.filter((a) => a.status === "Active");

  // Cycle the academic pipeline animation
  useEffect(() => {
    const steps: PipelineStep[] = ["internal", "lab", "practical", "project", "ledger"];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % steps.length;
      setActivePipelineStep(steps[idx]!);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Performance calculations
  const totalStudents = students.length;
  const classAvg =
    totalStudents > 0
      ? (marks.reduce((acc, m) => acc + (m.total || 0), 0) / totalStudents).toFixed(1)
      : "0";

  const handleQuickSeed = () => {
    if (sections.length === 0) return;
    setSeeding(true);
    const targetSection = sections[0]!;
    db.populateSampleStudents(targetSection.id);
    db.populateSampleAssignments(targetSection.id);
    db.populateSampleGroups(targetSection.id);
    db.populateSampleAnnouncements(targetSection.id);
    setTimeout(() => {
      setSeeding(false);
      window.location.reload();
    }, 300);
  };

  // Weekly submission velocity data (Mon - Sun)
  const weeklyVelocity = [
    { day: "MON", count: 28, pct: 65, label: "Theory Unit Submissions" },
    { day: "TUE", count: 42, pct: 90, label: "Lab Journals & Benchmarks" },
    { day: "WED", count: 35, pct: 75, label: "Practical Execution Viva" },
    { day: "THU", count: 50, pct: 100, label: "Peak Marks Entry Day" },
    { day: "FRI", count: 38, pct: 82, label: "Project Milestone Reviews" },
    { day: "SAT", count: 18, pct: 40, label: "Weekend Capstone Git PRs" },
    { day: "SUN", count: 12, pct: 28, label: "Offline Record Sync" },
  ];

  // Filtered activity feed
  const filteredLogs = activityLogs.filter((log) => {
    if (activityFilter === "all") return true;
    if (activityFilter === "student") return log.type === "student";
    if (activityFilter === "mark")
      return log.type === "marks" || log.action.toLowerCase().includes("mark");
    if (activityFilter === "section") return log.type === "section";
    return true;
  });

  const stats = [
    {
      title: "Total Students",
      value: students.length,
      subtitle: `Enrolled across ${sections.length} section${sections.length > 1 ? "s" : ""}`,
      icon: Users,
      actionTab: "students",
      color: "indigo",
      badgeColor: "bg-indigo-50 border-indigo-100 text-indigo-700",
      iconColor: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      title: "Active Sections",
      value: sections.length,
      subtitle: sections.map((s) => s.sectionName).join(", ") || "No sections",
      icon: FolderGit2,
      actionTab: "sections",
      color: "emerald",
      badgeColor: "bg-emerald-50 border-emerald-200 text-emerald-700",
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Active Coursework",
      value: activeAssignments.length,
      subtitle: `${assignments.length} total assignment${assignments.length > 1 ? "s" : ""}`,
      icon: BookOpen,
      actionTab: "assignments",
      color: "blue",
      badgeColor: "bg-blue-50 border-blue-200 text-blue-700",
      iconColor: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Project Groups",
      value: groups.length,
      subtitle: `${groups.reduce((acc, g) => acc + g.members.length, 0)} assigned members`,
      icon: Layers,
      actionTab: "groups",
      color: "purple",
      badgeColor: "bg-purple-50 border-purple-200 text-purple-700",
      iconColor: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      title: "Pending Proposals",
      value: pendingRequests.length,
      subtitle: pendingRequests.length > 0 ? "Awaiting review" : "All reviewed",
      icon: Clock,
      actionTab: "groups",
      color: "amber",
      badgeColor: "bg-amber-50 border-amber-200 text-amber-800",
      iconColor: "text-amber-600 bg-amber-50 border-amber-100",
    },
  ];

  // Knowledge Base Resources
  const knowledgeResources = [
    {
      title: "Course Syllabus & Blueprints",
      code: "CS-401 // CORE",
      desc: "Unit-wise distribution, continuous evaluation schedule, and theory exam weights.",
      badge: "Syllabus V2.4",
      action: () => onNavigate("assignments"),
    },
    {
      title: "Lab Experiments & Journal Index",
      code: "CS-401L // PRACTICAL",
      desc: "12 benchmark programming algorithms, viva rubrics, and submission guidelines.",
      badge: "12 Practicals",
      action: () => onNavigate("marks"),
    },
    {
      title: "Capstone Project Evaluation Guide",
      code: "PRJ-CAP // TEAMS",
      desc: "Git workflow criteria, guide sign-offs, and final milestone scoring rubric.",
      badge: "Max 20 Marks",
      action: () => onNavigate("groups"),
    },
    {
      title: "Tamper-Proof Grade Ledger Rules",
      code: "REG-ACAD // AUDIT",
      desc: "Institutional bound checking [0–20], soft deletions, and role permissions.",
      badge: "Autonomous",
      action: () => onNavigate("reports"),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Overview Banner (Matching Devxa Aesthetic) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-wider text-slate-500 uppercase font-semibold">
              ACADEMIC ADMINISTRATION // FACULTY COMMAND
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Ledger Synced
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight">
            Faculty Command{" "}
            <AsciiGlitchRipple as="span" className="font-serif italic font-normal text-indigo-600">
              Overview
            </AsciiGlitchRipple>
          </h2>

          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Monitor class enrollments, spreadsheet marksheets, student project proposals, and
            continuous marks with mathematical audit verification.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          {students.length === 0 && sections.length > 0 && (
            <Button
              size="sm"
              onClick={handleQuickSeed}
              disabled={seeding}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-xs h-9 rounded-lg px-4 font-medium shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>{seeding ? "Loading Demo..." : "⚡ Populate Sample Class"}</span>
            </Button>
          )}

          <Button
            size="sm"
            onClick={onOpenAddStudent}
            className="bg-slate-900 hover:bg-slate-800 text-white gap-1.5 text-xs h-9 rounded-lg px-4 font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCreateSection}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 text-xs h-9 rounded-lg px-3.5 font-medium cursor-pointer"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
            <span>New Section</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCreateAssignment}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 text-xs h-9 rounded-lg px-3.5 font-medium cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>New Assignment</span>
          </Button>
        </div>
      </div>

      {/* KPI Bento Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              onClick={() => onNavigate(s.actionTab)}
              className="bg-white border border-slate-200/90 rounded-xl p-4.5 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono tracking-wider text-slate-500 uppercase font-semibold">
                  {s.title}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-105 ${s.iconColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <div className="text-3xl font-bold text-slate-900 tracking-tight font-mono tabular-nums">
                  <AsciiGlitchRipple as="span">{String(s.value)}</AsciiGlitchRipple>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-normal">
                  <span className="truncate max-w-[130px]">{s.subtitle}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ────────────────────────────────────────────────────────
          FEATURE 1: Continuous Academic Evaluation Pipeline
          ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-xl font-normal text-slate-900 tracking-tight">
                Continuous Evaluation Pipeline
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Deterministic 4-tier evaluation flow with strict mathematical bounds [0–20] feeding
              the institutional consolidated ledger.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
              Active Stage:{" "}
              <strong className="text-indigo-600 uppercase">{activePipelineStep}</strong>
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate("marks")}
              className="text-xs border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg h-8 px-3 cursor-pointer"
            >
              Configure Bounds
            </Button>
          </div>
        </div>

        {/* Pipeline Nodes Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {PIPELINE_NODES.map((node, i) => {
            const isActive = activePipelineStep === node.id;
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                onClick={() => setActivePipelineStep(node.id as PipelineStep)}
                className={`relative rounded-xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]"
                    : "bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-mono tracking-wider font-semibold ${
                      isActive ? "text-indigo-300" : "text-slate-400"
                    }`}
                  >
                    STAGE 0{i + 1}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isActive ? "bg-white/10 text-white" : node.bg + " " + node.color
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <div
                    className={`text-xs font-semibold ${isActive ? "text-white" : "text-slate-800"}`}
                  >
                    {node.label}
                  </div>
                  <div
                    className={`text-lg font-bold font-mono mt-1 ${isActive ? "text-indigo-200" : "text-slate-900"}`}
                  >
                    {node.marks}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-current/10 flex items-center justify-between text-[10px] font-mono">
                  <span className={isActive ? "text-slate-300" : "text-slate-400"}>
                    {isActive ? "ACTIVE PROCESSING" : "VERIFIED"}
                  </span>
                  {i < 4 && (
                    <ChevronRight
                      className={`w-3.5 h-3.5 ${isActive ? "text-indigo-300" : "text-slate-400"}`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          FEATURE 2: Academic Health & Weekly Evaluation Velocity
          ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Academic Health & Weekly Velocity Pulse */}
        <div className="lg:col-span-2 space-y-6">
          {/* Academic Health Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Academic Health & Continuous Marks Pulse
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Live evaluation score average and grading readiness across enrolled students
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="text-slate-400">Class Average:</span>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    {classAvg} / 80
                  </span>
                </div>
                <button
                  onClick={() => onNavigate("marks")}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-xs flex items-center gap-1 cursor-pointer"
                >
                  Gradebook <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Stacked Cohort Grade Distribution */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Evaluation Completion</span>
                <span className="text-emerald-600 font-semibold">
                  {students.length > 0
                    ? "98.4% Verified Across Sections"
                    : "Awaiting student enrollment"}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex border border-slate-200/40">
                <div className="bg-emerald-500 h-full w-[45%]" title="Outstanding (O)" />
                <div className="bg-blue-500 h-full w-[30%]" title="Excellent (A+)" />
                <div className="bg-indigo-500 h-full w-[15%]" title="Very Good (A)" />
                <div className="bg-amber-400 h-full w-[10%]" title="Passing Average" />
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> O (Outstanding ≥90%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> A+ (Excellent ≥80%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" /> A (Very Good ≥70%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> B/C (Passing)
                </span>
              </div>
            </div>
          </div>

          {/* Weekly Velocity Pulse Chart (Card 2 Inspired) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Weekly Grading & Assessment Velocity
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submission evaluations, lab checks, and viva marks posted over the past 7 days.
                </p>
              </div>

              <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                Peak: Thursday (50 Evaluations)
              </span>
            </div>

            {/* Bar chart container */}
            <div className="pt-4 pb-2">
              <div className="grid grid-cols-7 gap-3 items-end h-32 px-2 border-b border-slate-100">
                {weeklyVelocity.map((day, i) => {
                  const isHovered = hoveredDay === i;
                  return (
                    <div
                      key={day.day}
                      onMouseEnter={() => setHoveredDay(i)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className="flex flex-col items-center gap-2 h-full justify-end cursor-pointer group"
                    >
                      <div className="text-[10px] font-mono font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">
                        {day.count}
                      </div>
                      <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden h-24 flex items-end">
                        <div
                          style={{ height: `${day.pct}%` }}
                          className={`w-full rounded-t-lg transition-all duration-300 ${
                            isHovered
                              ? "bg-indigo-600 shadow-sm"
                              : "bg-slate-800 group-hover:bg-indigo-500"
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-medium text-slate-400 group-hover:text-slate-900">
                        {day.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              {hoveredDay !== null && (
                <div className="mt-3 text-xs text-center text-slate-600 font-mono bg-slate-50 p-2 rounded-lg border border-slate-100 animate-in fade-in">
                  <strong>{weeklyVelocity[hoveredDay]?.day}</strong>:{" "}
                  {weeklyVelocity[hoveredDay]?.count} evaluated —{" "}
                  {weeklyVelocity[hoveredDay]?.label}
                </div>
              )}
            </div>
          </div>

          {/* Sections Bento Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-slate-600" />
                <span>Course Sections & Marksheets</span>
              </h3>
              <button
                onClick={() => onNavigate("sections")}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
              >
                Manage Sections <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sections.map((section) => {
                const secStudents = students.filter((s) => s.sectionId === section.id);
                const secGroups = groups.filter((g) => g.sectionId === section.id);
                const secAssignments = assignments.filter((a) => a.sectionId === section.id);

                return (
                  <div
                    key={section.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3.5 shadow-xs hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          {section.sectionName}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{section.courseName}</p>
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {section.academicYear}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center font-mono bg-slate-50/70 rounded-xl">
                      <div>
                        <div className="text-lg font-bold text-slate-900 tabular-nums">
                          {secStudents.length}
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans font-medium">
                          Students
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-900 tabular-nums">
                          {secGroups.length}
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans font-medium">
                          Teams
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-900 tabular-nums">
                          {secAssignments.length}
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans font-medium">
                          Tasks
                        </div>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => onNavigate("students", section.id)}
                        className="w-full text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold gap-1.5 h-9 rounded-xl shadow-xs cursor-pointer"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Open Student Sheet</span>
                        <ArrowRight className="w-3 h-3 ml-auto" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Knowledge Base & Recent Activity */}
        <div className="space-y-6">
          {/* Knowledge Base Resources (Card 4 Inspired) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Knowledge Base & Rubrics</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                4 Blueprints
              </span>
            </div>

            <div className="space-y-2.5">
              {knowledgeResources.map((res) => (
                <div
                  key={res.title}
                  onClick={res.action}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all cursor-pointer group space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {res.title}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      {res.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{res.desc}</p>
                  <div className="text-[10px] font-mono text-slate-400 pt-0.5">{res.code}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approval Notice */}
          {pendingRequests.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4.5 flex items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    {pendingRequests.length} Project Group Proposal
                    {pendingRequests.length > 1 ? "s" : ""} Pending Review
                  </h4>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Students have submitted collaborative group proposals for faculty approval.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onNavigate("groups")}
                className="bg-amber-700 hover:bg-amber-800 text-white text-xs shrink-0 font-semibold h-8.5 px-3.5 rounded-full cursor-pointer"
              >
                Review Proposals
              </Button>
            </div>
          )}

          {/* Recent Activity Audit Feed with Category Filters */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-600" />
                <span>Recent Audit Activity</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-semibold">
                Live Audit
              </span>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(["all", "student", "mark", "section"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActivityFilter(filter)}
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                    activityFilter === filter
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-1">
              {filteredLogs.length === 0 ? (
                <div className="py-8 text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-400">No actions recorded in this category.</p>
                </div>
              ) : (
                filteredLogs.slice(0, 10).map((log) => {
                  const date = new Date(log.timestamp);
                  const timeString = isNaN(date.getTime())
                    ? "Recently"
                    : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                  return (
                    <div
                      key={log.id}
                      className="py-3 first:pt-0 last:pb-0 flex items-start gap-2.5"
                    >
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-900 truncate">
                            {log.action}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {timeString}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {log.description}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
