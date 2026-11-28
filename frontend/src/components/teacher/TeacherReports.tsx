import React, { useState } from "react";
import { BarChart3, Download, Search, Sparkles, Users } from "lucide-react";
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

  // Grade breakdown with semantic colors
  const gradeTiers = [
    {
      tier: "O",
      label: "Outstanding (≥ 90%)",
      count: 0,
      color: "bg-emerald-500",
      text: "text-emerald-700",
      badgeBg: "bg-emerald-50 border-emerald-200",
    },
    {
      tier: "A+",
      label: "Excellent (≥ 80%)",
      count: 0,
      color: "bg-blue-500",
      text: "text-blue-700",
      badgeBg: "bg-blue-50 border-blue-200",
    },
    {
      tier: "A",
      label: "Very Good (≥ 70%)",
      count: 0,
      color: "bg-indigo-500",
      text: "text-indigo-700",
      badgeBg: "bg-indigo-50 border-indigo-200",
    },
    {
      tier: "B+",
      label: "Good (≥ 60%)",
      count: 0,
      color: "bg-purple-500",
      text: "text-purple-700",
      badgeBg: "bg-purple-50 border-purple-200",
    },
    {
      tier: "B/C",
      label: "Passing Average (≥ 40%)",
      count: 0,
      color: "bg-amber-500",
      text: "text-amber-700",
      badgeBg: "bg-amber-50 border-amber-200",
    },
    {
      tier: "F",
      label: "Need Attention (< 40%)",
      count: 0,
      color: "bg-rose-500",
      text: "text-rose-700",
      badgeBg: "bg-rose-50 border-rose-200",
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
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-semibold text-slate-900">Academic Performance Reports</h2>
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
          <div className="text-[11px] font-medium text-slate-500">Enrolled Students</div>
          <div className="text-2xl font-semibold text-slate-900 mt-1 font-mono tabular-nums">
            {totalStudents}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">{groups.length} project teams active</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-[11px] font-medium text-slate-500">Section Average</div>
          <div className="text-2xl font-semibold text-slate-900 mt-1 font-mono tabular-nums">
            {avgMarks}{" "}
            <span className="text-xs font-normal text-slate-400 font-sans">/{maxTotal}</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {((parseFloat(avgMarks) / maxTotal) * 100).toFixed(0)}% mean grade score
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-[11px] font-medium text-slate-500">Score Range</div>
          <div className="text-2xl font-semibold text-slate-900 mt-1 font-mono tabular-nums">
            {highest} <span className="text-xs font-normal text-slate-400 font-sans">high</span> •{" "}
            {lowest} <span className="text-xs font-normal text-slate-400 font-sans">low</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Continuous evaluation spread</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-[11px] font-medium text-slate-500">Pending Proposals</div>
          <div className="text-2xl font-semibold text-slate-900 mt-1 font-mono tabular-nums">
            {pendingRequests.length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Student teams awaiting review</div>
        </div>
      </div>

      {/* Grade Tier Distribution Visualization */}
      {totalStudents === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50/80 border border-indigo-100/60 flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl font-normal text-slate-900 tracking-tight">
            No Student Marks to Report
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
            Academic tier distributions, mean percentage calculations, and marksheet rosters require
            enrolled students with continuous assessment marks.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
            <Button
              size="sm"
              onClick={() => {
                if (!selectedSectionId) return;
                db.populateSampleStudents(selectedSectionId);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg h-9 px-4 gap-2 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>⚡ Populate Sample Class (8 Students)</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Grade Tier Distribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown for <strong>{currentSection?.sectionName}</strong> based on {maxTotal}
                -mark continuous assessment.
              </p>
            </div>
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              {totalStudents} Evaluated
            </span>
          </div>

          {/* Stacked multi-color bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/50">
            {gradeTiers.map((tier) => {
              const pct = (tier.count / totalStudents) * 100;
              if (pct === 0) return null;
              return (
                <div
                  key={tier.tier}
                  style={{ width: `${pct}%` }}
                  className={`${tier.color} transition-all duration-300`}
                  title={`${tier.tier}: ${tier.count} (${Math.round(pct)}%)`}
                />
              );
            })}
          </div>

          <div className="space-y-3 pt-1">
            {gradeTiers.map((tier) => {
              const pct = totalStudents > 0 ? Math.round((tier.count / totalStudents) * 100) : 0;
              return (
                <div key={tier.tier} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-[11px] px-1.5 py-0.5 rounded border font-semibold w-8 text-center ${tier.badgeBg} ${tier.text}`}
                      >
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
                      className={`h-full rounded-full ${tier.color} transition-all duration-300`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Roster Summary Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Section Academic Roster</h3>
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
                  <td className="py-2 px-3 font-mono tabular-nums font-semibold text-slate-800">
                    {r.rollNumber}
                  </td>
                  <td className="py-2 px-4 font-medium text-slate-900">{r.name}</td>
                  <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">
                    {r.projectGroupName}
                  </td>
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
