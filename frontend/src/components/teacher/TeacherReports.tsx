import React, { useState } from "react";
import {
  BarChart3,
  Download,
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

  // Grade breakdown
  const gradeTiers = [
    { tier: "O", label: "Outstanding (≥ 90%)", count: 0 },
    { tier: "A+", label: "Excellent (≥ 80%)", count: 0 },
    { tier: "A", label: "Very Good (≥ 70%)", count: 0 },
    { tier: "B+", label: "Good (≥ 60%)", count: 0 },
    { tier: "B/C", label: "Passing Average (≥ 40%)", count: 0 },
    { tier: "F", label: "Need Attention (< 40%)", count: 0 },
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
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-semibold text-slate-900">
              Academic Performance Reports
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section summaries, grade tier distributions, and automated one-click export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="h-8 px-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-slate-400"
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
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5 h-8 rounded-md px-3 font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </Button>
        </div>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-[11px] font-medium text-slate-500">
            Enrolled Students
          </div>
          <div className="text-2xl font-semibold text-slate-900 mt-1 font-mono tabular-nums">{totalStudents}</div>
          <div className="text-xs text-slate-500 mt-0.5">{groups.length} project teams active</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-[11px] font-medium text-slate-500">
            Section Average
          </div>
          <div className="text-2xl font-semibold text-slate-900 mt-1 font-mono tabular-nums">
            {avgMarks}{" "}
            <span className="text-xs font-normal text-slate-400 font-sans">/{maxTotal}</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {((parseFloat(avgMarks) / maxTotal) * 100).toFixed(0)}% mean grade score
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-[11px] font-medium text-slate-500">
            Score Range
          </div>
          <div className="text-2xl font-semibold text-slate-900 mt-1 font-mono tabular-nums">
            {highest} <span className="text-xs font-normal text-slate-400 font-sans">high</span> •{" "}
            {lowest} <span className="text-xs font-normal text-slate-400 font-sans">low</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Continuous evaluation spread</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-[11px] font-medium text-slate-500">
            Pending Proposals
          </div>
          <div className="text-2xl font-semibold text-slate-900 mt-1 font-mono tabular-nums">
            {pendingRequests.length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Student teams awaiting review</div>
        </div>
      </div>

      {/* Grade Tier Distribution Visualization */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Grade Tier Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown for <strong>{currentSection?.sectionName}</strong> based on {maxTotal}-mark continuous assessment.
            </p>
          </div>
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {totalStudents} Evaluated
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {gradeTiers.map((tier) => {
            const pct = totalStudents > 0 ? Math.round((tier.count / totalStudents) * 100) : 0;
            return (
              <div key={tier.tier} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-800 font-semibold w-8 text-center">
                      {tier.tier}
                    </span>
                    <span className="font-medium text-slate-700">{tier.label}</span>
                  </div>
                  <span className="font-mono text-slate-600 tabular-nums">
                    {tier.count} student{tier.count !== 1 ? "s" : ""} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-slate-800 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Roster Summary Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Section Academic Roster
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified mark records and awarded grade tiers for {currentSection?.sectionName}.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <Input
              value={searchRoster}
              onChange={(e) => setSearchRoster(e.target.value)}
              placeholder="Filter by name or roll..."
              className="pl-8 text-xs h-8 border-slate-200 rounded-md"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-md">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-200 text-slate-600 font-medium text-[11px] bg-slate-50">
              <tr>
                <th className="py-2.5 px-3 font-mono">Roll No</th>
                <th className="py-2.5 px-4">Student Name</th>
                <th className="py-2.5 px-3">Project Group</th>
                <th className="py-2.5 px-3 text-right">Internal /20</th>
                <th className="py-2.5 px-3 text-right">Lab /20</th>
                <th className="py-2.5 px-3 text-right">Practical /20</th>
                <th className="py-2.5 px-3 text-right">Project /20</th>
                <th className="py-2.5 px-3 text-right font-semibold text-slate-900 bg-slate-100/70 border-l border-r border-slate-200">
                  Total /{maxTotal}
                </th>
                <th className="py-2.5 px-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredRows.map((r) => (
                <tr key={r.studentId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2 px-3 font-mono tabular-nums font-semibold text-slate-800">{r.rollNumber}</td>
                  <td className="py-2 px-4 font-medium text-slate-900">{r.name}</td>
                  <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">{r.projectGroupName}</td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-700">
                    {r.internalMarks}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-700">
                    {r.labRecordMarks}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-700">
                    {r.practicalMarks}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-700">
                    {r.projectMarks}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 bg-slate-50/70 border-l border-r border-slate-200">
                    {r.total}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
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
