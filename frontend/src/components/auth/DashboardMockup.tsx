import React, { useState } from "react";
import {
  Search,
  Bell,
  Plus,
  Table,
  Layers,
  BookOpen,
  FolderGit2,
  Award,
  ShieldCheck,
  CheckCircle2,
  Users,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  Code,
  GraduationCap,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export function DashboardMockup() {
  const [activeTab, setActiveTab] = useState<"faculty" | "student">("faculty");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className="relative w-full max-w-[820px] transition-all duration-300">
      {/* Ambient background glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-200/40 via-indigo-200/30 to-purple-200/40 rounded-[32px] blur-xl opacity-70 pointer-events-none" />

      {/* Main Floating App Window */}
      <div className="relative bg-white rounded-[26px] border border-neutral-200/80 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.12),0_0_1px_1px_rgba(0,0,0,0.03)] overflow-hidden font-sans text-neutral-800 animate-float-subtle">
        {/* Top Window Navigation Bar */}
        <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between gap-3 bg-white/90 backdrop-blur-sm">
          {/* Logo & Version */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              H
            </div>
            <span className="font-bold text-sm tracking-tight text-neutral-900">Handover</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100 font-medium">
              BETA v2.4
            </span>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-50 border border-neutral-200/70 rounded-full w-64 lg:w-72 text-xs text-neutral-400">
            <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">Search students, marks, calls...</span>
            <kbd className="ml-auto text-[10px] font-mono bg-white border border-neutral-200 px-1.5 py-0.5 rounded text-neutral-400">
              ⌘K
            </kbd>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle Pill */}
            <div className="bg-neutral-100 p-0.5 rounded-full flex items-center text-[11px] font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("faculty")}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  activeTab === "faculty"
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Faculty View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("student")}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  activeTab === "student"
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Student View
              </button>
            </div>

            <button
              type="button"
              className="hidden md:flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-medium px-3 py-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{activeTab === "faculty" ? "New Section" : "Propose Group"}</span>
            </button>

            <div className="relative p-1.5 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100 cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-1 border-l border-neutral-200">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white text-[11px] font-semibold flex items-center justify-center ring-2 ring-white shadow-2xs">
                {activeTab === "faculty" ? "EV" : "AW"}
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="px-5 py-2 border-b border-neutral-100 flex items-center gap-2 overflow-x-auto text-[11px] bg-neutral-50/50">
          <span className="font-medium text-neutral-900 bg-white border border-neutral-200/80 px-2.5 py-1 rounded-full shadow-2xs">
            For you
          </span>
          <span className="text-neutral-500 hover:text-neutral-900 px-2.5 py-1 rounded-full cursor-pointer hover:bg-white/60 transition-colors">
            CSE-401 Dept
          </span>
          <span className="text-neutral-500 hover:text-neutral-900 px-2.5 py-1 rounded-full cursor-pointer hover:bg-white/60 transition-colors">
            Continuous Marks [0-20]
          </span>
          <span className="text-neutral-500 hover:text-neutral-900 px-2.5 py-1 rounded-full cursor-pointer hover:bg-white/60 transition-colors">
            Project Groups
          </span>
          <span className="text-neutral-500 hover:text-neutral-900 px-2.5 py-1 rounded-full cursor-pointer hover:bg-white/60 transition-colors">
            Audit Trail
          </span>
        </div>

        {/* Main Body Grid: Micro-Sidebar + Center Feed + Right Widgets */}
        <div className="grid grid-cols-12 min-h-[460px] bg-neutral-50/30 text-xs">
          {/* Left Micro Sidebar */}
          <div className="hidden lg:block lg:col-span-3 border-r border-neutral-100 p-3.5 space-y-1 bg-white/70">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-blue-50/80 text-blue-700 font-semibold text-xs shadow-2xs">
              <Table className="w-4 h-4 text-blue-600" />
              <span>Overview & Feed</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100/70 cursor-pointer transition-colors">
              <FileSpreadsheet className="w-4 h-4 text-neutral-400" />
              <span>Live Gradebook</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100/70 cursor-pointer transition-colors">
              <Layers className="w-4 h-4 text-neutral-400" />
              <span>Class Sections</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100/70 cursor-pointer transition-colors">
              <BookOpen className="w-4 h-4 text-neutral-400" />
              <span>Assignments</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100/70 cursor-pointer transition-colors">
              <FolderGit2 className="w-4 h-4 text-neutral-400" />
              <span>Project Groups</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100/70 cursor-pointer transition-colors">
              <ShieldCheck className="w-4 h-4 text-neutral-400" />
              <span>Verified Records</span>
            </div>

            {/* Micro Callout Card */}
            <div className="mt-6 p-3 bg-gradient-to-br from-amber-50/80 to-orange-50/60 border border-amber-200/60 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Mid-Term Evaluation</span>
              </div>
              <p className="text-[10px] text-amber-700/90 leading-tight">
                Continuous internal & lab marks active. Clamped strictly between 0 and 20.
              </p>
            </div>
          </div>

          {/* Center Main Activity Stream & Gradebook Feed */}
          <div className="col-span-12 lg:col-span-6 p-4 space-y-3.5 overflow-y-auto max-h-[490px]">
            {/* Quick Status / Post Composer */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-3 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-neutral-900 text-white font-semibold flex items-center justify-center text-[10px]">
                  {activeTab === "faculty" ? "EV" : "AW"}
                </div>
                <div className="flex-1 bg-neutral-50 hover:bg-neutral-100/80 transition-colors px-3 py-2 rounded-full text-neutral-400 text-xs border border-neutral-100">
                  {activeTab === "faculty"
                    ? "Publish continuous marks or announce coursework deadline..."
                    : "Propose team project, search group members, verify marks..."}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-neutral-100 text-[11px]">
                <div className="flex items-center gap-2 text-neutral-500">
                  <span className="flex items-center gap-1 hover:text-neutral-900 cursor-pointer">
                    <Table className="w-3.5 h-3.5 text-blue-500" /> Marks
                  </span>
                  <span className="flex items-center gap-1 hover:text-neutral-900 cursor-pointer">
                    <Code className="w-3.5 h-3.5 text-emerald-500" /> Code
                  </span>
                  <span className="flex items-center gap-1 hover:text-neutral-900 cursor-pointer">
                    <FolderGit2 className="w-3.5 h-3.5 text-purple-500" /> Project
                  </span>
                </div>
                <button
                  type="button"
                  className="bg-neutral-900 text-white px-3 py-1 rounded-full text-[11px] font-medium hover:bg-neutral-800 transition-colors"
                >
                  Post Call →
                </button>
              </div>
            </div>

            {/* FEED CARD 1: Continuous Marks Published Card (Devxa Style) */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-3.5 shadow-2xs space-y-2.5 transition-all hover:shadow-xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center text-xs">
                    EV
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900 flex items-center gap-1.5 text-xs">
                      <span>Prof. Eleanor Vance</span>
                      <span className="text-[10px] text-neutral-400 font-normal">
                        @e_vance · 2h
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Course Coordinator · CS-401 Section A
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified Live
                </span>
              </div>

              <p className="text-xs text-neutral-700 leading-relaxed">
                Published verified continuous evaluation scores for{" "}
                <span className="font-semibold text-neutral-900">CS-401 (Distributed Systems)</span>
                . Clamped mathematical verification [0, 20] passed across all 42 candidates.
              </p>

              {/* Mini Embedded Marks Spreadsheet */}
              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/40 overflow-hidden text-[11px]">
                <div className="bg-neutral-100/80 px-3 py-1.5 border-b border-neutral-200/80 font-mono text-[10px] text-neutral-500 flex justify-between items-center">
                  <span>SPREADSHEET RECORD // SEC-A</span>
                  <span className="text-emerald-700 font-semibold">100% Clamped Valid</span>
                </div>
                <div className="divide-y divide-neutral-200/60">
                  {[
                    {
                      roll: "2024-CS-001",
                      name: "Alexander Wright",
                      internal: "19.0",
                      lab: "19.5",
                      proj: "18.5",
                      total: "76.0/80",
                      grade: "O",
                    },
                    {
                      roll: "2024-CS-002",
                      name: "Ananya Sharma",
                      internal: "18.5",
                      lab: "19.0",
                      proj: "19.0",
                      total: "74.5/80",
                      grade: "A+",
                    },
                    {
                      roll: "2024-CS-003",
                      name: "Marcus Brody",
                      internal: "19.5",
                      lab: "18.5",
                      proj: "19.5",
                      total: "77.0/80",
                      grade: "O",
                    },
                  ].map((row, idx) => (
                    <div
                      key={row.roll}
                      onMouseEnter={() => setHoveredRow(idx)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={`px-3 py-1.5 flex items-center justify-between transition-colors ${
                        hoveredRow === idx ? "bg-blue-50/60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-neutral-400">{row.roll}</span>
                        <span className="font-medium text-neutral-900">{row.name}</span>
                      </div>
                      <div className="flex items-center gap-2.5 font-mono text-[10px]">
                        <span className="text-neutral-500">
                          Int: <strong className="text-neutral-800">{row.internal}</strong>
                        </span>
                        <span className="text-neutral-500">
                          Lab: <strong className="text-neutral-800">{row.lab}</strong>
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100/80 text-emerald-800 font-bold">
                          {row.total} ({row.grade})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Footer Metrics */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1 hover:text-neutral-600 cursor-pointer">
                  <Users className="w-3.5 h-3.5" /> 42 Students Synced
                </span>
                <span className="flex items-center gap-1 text-blue-600 font-medium hover:underline cursor-pointer">
                  1-Click UTF-8 CSV <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* FEED CARD 2: Student Project Proposal & Verification Call */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-3.5 shadow-2xs space-y-2.5 transition-all hover:shadow-xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-semibold flex items-center justify-center text-xs">
                    AW
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900 flex items-center gap-1.5 text-xs">
                      <span>Alexander Wright</span>
                      <span className="text-[10px] text-neutral-400 font-normal">
                        @a_wright · 5h
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Student Lead · Distributed Key-Value Store
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200/70">
                  <Award className="w-3 h-3 text-blue-600" />
                  Guide Approved
                </span>
              </div>

              <p className="text-xs text-neutral-700 leading-relaxed">
                Group proposal submitted and verified:{" "}
                <strong className="text-neutral-900 font-semibold">
                  Raft-Consensus Key-Value Store
                </strong>
                . 4 team members connected, code repository linked with daily automated tests.
              </p>

              {/* Progress Bar & Badges */}
              <div className="p-3 bg-neutral-50/80 rounded-xl border border-neutral-200/70 space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-600 font-medium">Milestone Sprint 3</span>
                  <span className="text-blue-600 font-mono font-semibold">75% Complete</span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full w-[75%]" />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[10px] font-mono text-neutral-600">
                    Go / gRPC
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[10px] font-mono text-neutral-600">
                    Raft Protocol
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[10px] font-mono text-neutral-600">
                    Section A
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Trending In Department & Verified Faculty Widget */}
          <div className="hidden lg:block lg:col-span-3 border-l border-neutral-100 p-3.5 space-y-4 bg-white/70">
            {/* Department Metrics */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-neutral-900 tracking-tight">
                  CSE-401 Activity
                </span>
                <span className="text-blue-600 text-[10px] hover:underline cursor-pointer">
                  Live
                </span>
              </div>
              <div className="space-y-2 bg-neutral-50/60 p-2.5 rounded-xl border border-neutral-200/60">
                <div className="space-y-0.5">
                  <div className="text-[10px] text-neutral-400 font-mono">
                    EVALUATION COMPLETION
                  </div>
                  <div className="font-bold text-neutral-900 text-sm">98.4%</div>
                  <div className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +12% from last week
                  </div>
                </div>
                <div className="pt-2 border-t border-neutral-200/60 flex justify-between text-[10px] text-neutral-500">
                  <span>
                    Enrolled: <strong>42</strong>
                  </span>
                  <span>
                    Sections: <strong>4</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Active Faculty & Coordinators */}
            <div className="space-y-2">
              <span className="font-semibold text-neutral-900 tracking-tight text-[11px] block">
                Active Faculty & TAs
              </span>
              <div className="space-y-2">
                {[
                  { name: "Dr. Eleanor Vance", role: "Faculty Chair", status: "Active" },
                  { name: "Prof. Vikram Patel", role: "Lab Lead", status: "Active" },
                  { name: "Alexander Wright", role: "Student Lead", status: "Student" },
                ].map((p) => (
                  <div key={p.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-700 font-semibold text-[10px] flex items-center justify-center shrink-0">
                        {p.name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-medium text-neutral-900 truncate">
                          {p.name}
                        </div>
                        <div className="text-[9px] text-neutral-400 truncate">{p.role}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full cursor-pointer transition-colors shrink-0">
                      View
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Card */}
            <div className="p-3 rounded-xl bg-neutral-900 text-white space-y-1.5 shadow-xs">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">
                Instant Export
              </div>
              <div className="text-xs font-semibold">1-Click Marks Card</div>
              <p className="text-[10px] text-neutral-300 leading-tight">
                Export verified spreadsheet as UTF-8 CSV ready for college registrar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
