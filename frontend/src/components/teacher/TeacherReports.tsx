import React, { useState } from "react";
import {
  BarChart3,
  Download,
  Users,
  Award,
  Layers,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowUpDown,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/services/db";
import { getSectionSpreadsheetRows, exportToCSV } from "@/services/teacher";

export function TeacherReports() {
  const sections = db.getSections();
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || "");
  const [searchRoster, setSearchRoster] = useState("");

  const currentSection = sections.find((s) => s.id === selectedSectionId) || sections[0];
  const rows = selectedSectionId ? getSectionSpreadsheetRows(selectedSectionId) : [];
  const groups = db.getProjectGroups(selectedSectionId);
  const pendingRequests = db
    .getGroupRequests(selectedSectionId)
    .filter((r) => r.status === "Pending");

  // Calculations
  const totalStudents = rows.length;
  const maxTotal = rows[0]?.maxTotal || 80;
  const avgMarks =
    totalStudents > 0
      ? (rows.reduce((acc, r) => acc + r.total, 0) / totalStudents).toFixed(1)
      : "0";
  const highest = totalStudents > 0 ? Math.max(...rows.map((r) => r.total)) : 0;
  const lowest = totalStudents > 0 ? Math.min(...rows.map((r) => r.total)) : 0;

  // Grade breakdown with rich vibrant colors
  const gradeTiers = [
    {
      tier: "O",
      label: "Outstanding (≥ 90%)",
      gradient: "from-emerald-500 to-teal-600",
      pillBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      count: 0,
    },
    {
      tier: "A+",
      label: "Excellent (≥ 80%)",
      gradient: "from-indigo-600 to-violet-600",
      pillBg: "bg-indigo-50 text-indigo-800 border-indigo-200",
      count: 0,
    },
    {
      tier: "A",
      label: "Very Good (≥ 70%)",
      gradient: "from-blue-500 to-cyan-600",
      pillBg: "bg-blue-50 text-blue-800 border-blue-200",
      count: 0,
    },
    {
      tier: "B+",
      label: "Good (≥ 60%)",
      gradient: "from-amber-500 to-orange-500",
      pillBg: "bg-amber-50 text-amber-800 border-amber-200",
      count: 0,
    },
    {
      tier: "B/C",
      label: "Passing Average (≥ 40%)",
      gradient: "from-slate-400 to-slate-500",
      pillBg: "bg-slate-100 text-slate-800 border-slate-200",
      count: 0,
    },
    {
      tier: "F",
      label: "Need Attention (< 40%)",
      gradient: "from-rose-500 to-red-600",
      pillBg: "bg-rose-50 text-rose-800 border-rose-200",
      count: 0,
    },
  ];

  rows.forEach((r) => {
    const pct = (r.total / maxTotal) * 100;
    if (pct >= 90) gradeTiers[0]!.count++;
    else if (pct >= 80) gradeTiers[1]!.count++;
    else if (pct >= 70) gradeTiers[2]!.count++;
    else if (pct >= 60) gradeTiers[3]!.count++;
    else if (pct >= 40) gradeTiers[4]!.count++;
    else gradeTiers[5]!.count++;
  });

  const filteredRows = rows.filter(
    (r) =>
      r.name.toLowerCase().includes(searchRoster.toLowerCase()) ||
      r.rollNumber.toLowerCase().includes(searchRoster.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xs shadow-indigo-600/30">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Academic Performance Reports
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section summaries, grade tier distributions, and automated one-click export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="h-9 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.sectionName}
              </option>
            ))}
          </select>

          <Button
            size="sm"
            onClick={() => exportToCSV(currentSection, rows)}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs gap-1.5 h-9 rounded-xl shadow-xs shadow-indigo-600/25 px-3.5 font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </Button>
        </div>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Enrolled Students
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{totalStudents}</div>
          <div className="text-xs text-slate-500 mt-0.5">{groups.length} project teams active</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
            Section Average
          </div>
          <div className="text-2xl font-black text-indigo-700 mt-1 font-mono">
            {avgMarks}{" "}
            <span className="text-xs font-normal text-slate-400 font-sans">/{maxTotal}</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {((parseFloat(avgMarks) / maxTotal) * 100).toFixed(0)}% mean grade score
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
            Score Range
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
            {highest} <span className="text-xs font-normal text-slate-400 font-sans">high</span> •{" "}
            {lowest} <span className="text-xs font-normal text-slate-400 font-sans">low</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Continuous evaluation spread</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
            Pending Proposals
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1 font-mono">
            {pendingRequests.length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Student teams awaiting review</div>
        </div>
      </div>

      {/* Grade Tier Distribution Visualization */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Grade Tier Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown for <strong>{currentSection?.sectionName}</strong> based on 80-mark
              continuous assessment.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
            {totalStudents} Evaluated
          </span>
        </div>

        <div className="space-y-4 pt-1">
          {gradeTiers.map((tier) => {
            const pct = totalStudents > 0 ? Math.round((tier.count / totalStudents) * 100) : 0;
            return (
              <div key={tier.tier} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${tier.pillBg}`}
                    >
                      {tier.tier}
                    </span>
                    <span className="font-semibold text-slate-700">{tier.label}</span>
                  </div>
                  <span className="font-mono text-slate-600 font-semibold">
                    {tier.count} student{tier.count !== 1 ? "s" : ""} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-[1px]">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${tier.gradient} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Roster Summary Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden space-y-4 p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Section Academic Roster
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified mark records and awarded grade tiers for {currentSection?.sectionName}.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <Input
              value={searchRoster}
              onChange={(e) => setSearchRoster(e.target.value)}
              placeholder="Filter by name or roll..."
              className="pl-8 text-xs h-9 border-slate-200 rounded-xl"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider bg-slate-50/50">
              <tr>
                <th className="py-3 px-4 font-mono">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Project Group</th>
                <th className="py-3 px-4 text-center">Internal /20</th>
                <th className="py-3 px-4 text-center">Lab /20</th>
                <th className="py-3 px-4 text-center">Practical /20</th>
                <th className="py-3 px-4 text-center">Project /20</th>
                <th className="py-3 px-4 text-center font-bold text-indigo-900">Total /80</th>
                <th className="py-3 px-4 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredRows.map((r) => (
                <tr key={r.studentId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{r.rollNumber}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{r.name}</td>
                  <td className="py-3 px-4 text-slate-600">{r.projectGroupName}</td>
                  <td className="py-3 px-4 text-center font-mono text-slate-700">
                    {r.internalMarks}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-700">
                    {r.labRecordMarks}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-700">
                    {r.practicalMarks}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-700">
                    {r.projectMarks}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-black text-indigo-700 text-sm">
                    {r.total}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                      {r.grade.split(" ")[0]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
