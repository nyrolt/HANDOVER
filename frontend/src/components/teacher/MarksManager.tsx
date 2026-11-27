import React, { useState } from "react";
import {
  Award,
  Filter,
  Download,
  Settings2,
  CheckCircle2,
  TrendingUp,
  BarChart2,
  Search,
  ArrowUpDown,
  Calculator,
  Save,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/services/db";
import { useAuth } from "@/services/auth";
import { getSectionSpreadsheetRows, exportToCSV } from "@/services/teacher";

export function MarksManager() {
  const { user } = useAuth();
  const sections = db.getSections();
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Configurable Max Marks
  const [maxMarks, setMaxMarks] = useState({
    internal: 20,
    lab: 20,
    practical: 20,
    project: 20,
  });
  const [configOpen, setConfigOpen] = useState(false);

  // Inline editing
  const [editingCell, setEditingCell] = useState<{
    studentId: string;
    field: "internalMarks" | "labRecordMarks" | "practicalMarks" | "projectMarks";
  } | null>(null);
  const [cellInput, setCellInput] = useState("");
  const [statusMsg, setStatusMsg] = useState("All grades synced");

  const currentSection = sections.find((s) => s.id === selectedSectionId) || sections[0];
  const maxTotal = maxMarks.internal + maxMarks.lab + maxMarks.practical + maxMarks.project;

  const rows = selectedSectionId ? getSectionSpreadsheetRows(selectedSectionId) : [];

  const filteredAndSortedRows = rows
    .filter(
      (r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => (sortOrder === "desc" ? b.total - a.total : a.total - b.total));

  const handleStartEdit = (
    studentId: string,
    field: "internalMarks" | "labRecordMarks" | "practicalMarks" | "projectMarks",
    val: number,
  ) => {
    setEditingCell({ studentId, field });
    setCellInput(val.toString());
  };

  const handleCommitEdit = () => {
    if (!editingCell) return;
    const parsed = parseInt(cellInput.trim(), 10);
    const maxVal =
      maxMarks[editingCell.field.replace("Marks", "").toLowerCase() as keyof typeof maxMarks] || 20;

    const sanitized = isNaN(parsed) ? 0 : Math.max(0, Math.min(maxVal, parsed));

    db.updateStudentMarks(
      editingCell.studentId,
      {
        [editingCell.field]: sanitized,
        maxTotal,
      },
      user?.name || "Faculty",
    );

    setEditingCell(null);
    setStatusMsg("Saved marks successfully");
    setTimeout(() => setStatusMsg("All grades synced"), 2500);
  };

  // Performance calculations
  const totalStudents = rows.length;
  const classAvg =
    totalStudents > 0
      ? (rows.reduce((acc, r) => acc + r.total, 0) / totalStudents).toFixed(1)
      : "0";
  const highestScore = totalStudents > 0 ? Math.max(...rows.map((r) => r.total)) : 0;
  const passCount = rows.filter((r) => r.total / maxTotal >= 0.4).length;
  const passRate = totalStudents > 0 ? Math.round((passCount / totalStudents) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Gradebook Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xs shadow-indigo-600/30">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Academic Marks & Continuous Evaluation Gradebook
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Spreadsheet-first evaluation with real-time calculations, input validation, and instant
            grade synchronization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Section Selector */}
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

          {/* Config Max Marks */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setConfigOpen(!configOpen)}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs h-9 rounded-xl gap-1.5 font-semibold"
          >
            <Settings2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Scale Config</span>
          </Button>

          {/* Export */}
          <Button
            size="sm"
            onClick={() => exportToCSV(currentSection, rows)}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs h-9 rounded-xl gap-1.5 shadow-xs shadow-indigo-600/25 px-3.5 font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Gradebook</span>
          </Button>
        </div>
      </div>

      {/* Max Marks Configuration Panel */}
      {configOpen && (
        <div className="bg-gradient-to-r from-slate-50 via-indigo-50/30 to-white border border-indigo-100 rounded-2xl p-5 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Evaluation Component Max Bounds
              </h3>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-100">
              Total Max: {maxTotal} Marks
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {Object.entries(maxMarks).map(([key, val]) => (
              <div key={key} className="space-y-1">
                <label className="capitalize font-semibold text-slate-600 text-[11px]">
                  {key} (/20)
                </label>
                <Input
                  type="number"
                  value={val}
                  onChange={(e) =>
                    setMaxMarks({
                      ...maxMarks,
                      [key]: Math.max(1, parseInt(e.target.value) || 20),
                    })
                  }
                  className="h-8 text-xs font-mono font-bold bg-white rounded-lg border-slate-200"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Class Average
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
            {classAvg}{" "}
            <span className="text-xs font-normal text-slate-400 font-sans">/{maxTotal}</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Mean student performance</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
            Highest Score
          </div>
          <div className="text-2xl font-black text-indigo-700 mt-1 font-mono">
            {highestScore}{" "}
            <span className="text-xs font-normal text-slate-400 font-sans">/{maxTotal}</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Section top performer</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
            Pass Rate
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">{passRate}%</div>
          <div className="text-xs text-slate-500 mt-0.5">
            {passCount} of {totalStudents} passing
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Live Sync Status
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800">{statusMsg}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Auto-saved to database</div>
        </div>
      </div>

      {/* Toolbar & Search */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or roll..."
              className="pl-9 text-xs h-9 border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="h-9 px-3 text-xs font-semibold border-slate-200 text-slate-700 gap-1.5 rounded-xl hover:bg-slate-50"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span>Sort: {sortOrder === "desc" ? "Highest First" : "Lowest First"}</span>
            </Button>
          </div>
        </div>

        {/* Spreadsheet Data Grid */}
        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider bg-slate-50/60">
              <tr>
                <th className="py-3 px-4 font-mono">Roll No</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3 text-center">Internal /{maxMarks.internal}</th>
                <th className="py-3 px-3 text-center">Lab /{maxMarks.lab}</th>
                <th className="py-3 px-3 text-center">Practical /{maxMarks.practical}</th>
                <th className="py-3 px-3 text-center">Project /{maxMarks.project}</th>
                <th className="py-3 px-3 text-center font-bold text-indigo-900">
                  Total /{maxTotal}
                </th>
                <th className="py-3 px-3 text-center">Percentage</th>
                <th className="py-3 px-4 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredAndSortedRows.map((r) => {
                const pct = Math.round((r.total / maxTotal) * 100);
                const isPass = pct >= 40;
                return (
                  <tr key={r.studentId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{r.rollNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{r.name}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {r.email}
                      </div>
                    </td>

                    {/* Internal Cell */}
                    <td
                      onClick={() => handleStartEdit(r.studentId, "internalMarks", r.internalMarks)}
                      className="py-3 px-3 text-center font-mono cursor-pointer hover:bg-indigo-50/60 transition-colors"
                    >
                      {editingCell?.studentId === r.studentId &&
                      editingCell.field === "internalMarks" ? (
                        <input
                          autoFocus
                          type="number"
                          value={cellInput}
                          onChange={(e) => setCellInput(e.target.value)}
                          onBlur={handleCommitEdit}
                          onKeyDown={(e) => e.key === "Enter" && handleCommitEdit()}
                          className="w-14 text-center font-mono font-bold border-2 border-indigo-600 rounded bg-white text-xs outline-none py-0.5"
                        />
                      ) : (
                        <span className="font-semibold text-slate-700">{r.internalMarks}</span>
                      )}
                    </td>

                    {/* Lab Cell */}
                    <td
                      onClick={() =>
                        handleStartEdit(r.studentId, "labRecordMarks", r.labRecordMarks)
                      }
                      className="py-3 px-3 text-center font-mono cursor-pointer hover:bg-indigo-50/60 transition-colors"
                    >
                      {editingCell?.studentId === r.studentId &&
                      editingCell.field === "labRecordMarks" ? (
                        <input
                          autoFocus
                          type="number"
                          value={cellInput}
                          onChange={(e) => setCellInput(e.target.value)}
                          onBlur={handleCommitEdit}
                          onKeyDown={(e) => e.key === "Enter" && handleCommitEdit()}
                          className="w-14 text-center font-mono font-bold border-2 border-indigo-600 rounded bg-white text-xs outline-none py-0.5"
                        />
                      ) : (
                        <span className="font-semibold text-slate-700">{r.labRecordMarks}</span>
                      )}
                    </td>

                    {/* Practical Cell */}
                    <td
                      onClick={() =>
                        handleStartEdit(r.studentId, "practicalMarks", r.practicalMarks)
                      }
                      className="py-3 px-3 text-center font-mono cursor-pointer hover:bg-indigo-50/60 transition-colors"
                    >
                      {editingCell?.studentId === r.studentId &&
                      editingCell.field === "practicalMarks" ? (
                        <input
                          autoFocus
                          type="number"
                          value={cellInput}
                          onChange={(e) => setCellInput(e.target.value)}
                          onBlur={handleCommitEdit}
                          onKeyDown={(e) => e.key === "Enter" && handleCommitEdit()}
                          className="w-14 text-center font-mono font-bold border-2 border-indigo-600 rounded bg-white text-xs outline-none py-0.5"
                        />
                      ) : (
                        <span className="font-semibold text-slate-700">{r.practicalMarks}</span>
                      )}
                    </td>

                    {/* Project Cell */}
                    <td
                      onClick={() => handleStartEdit(r.studentId, "projectMarks", r.projectMarks)}
                      className="py-3 px-3 text-center font-mono cursor-pointer hover:bg-indigo-50/60 transition-colors"
                    >
                      {editingCell?.studentId === r.studentId &&
                      editingCell.field === "projectMarks" ? (
                        <input
                          autoFocus
                          type="number"
                          value={cellInput}
                          onChange={(e) => setCellInput(e.target.value)}
                          onBlur={handleCommitEdit}
                          onKeyDown={(e) => e.key === "Enter" && handleCommitEdit()}
                          className="w-14 text-center font-mono font-bold border-2 border-indigo-600 rounded bg-white text-xs outline-none py-0.5"
                        />
                      ) : (
                        <span className="font-semibold text-slate-700">{r.projectMarks}</span>
                      )}
                    </td>

                    {/* Total Cell */}
                    <td className="py-3 px-3 text-center font-mono font-black text-indigo-700 text-sm">
                      {r.total}
                    </td>

                    {/* Percentage */}
                    <td className="py-3 px-3 text-center font-mono text-xs text-slate-600">
                      {pct}%
                    </td>

                    {/* Grade Pill */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                          isPass
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-rose-50 text-rose-800 border border-rose-200"
                        }`}
                      >
                        {r.grade.split(" ")[0]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
