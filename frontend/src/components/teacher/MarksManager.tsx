import React, { useState } from "react";
import {
  Award,
  Filter,
  Download,
  Settings2,
  CheckCircle2,
  Search,
  ArrowUpDown,
  Calculator,
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
    <div className="space-y-6 font-sans">
      {/* Gradebook Header */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 stroke-[1.5]" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              Academic Marks & Continuous Evaluation
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section gradebook with atomic updates, component bounds, and verified calculation rules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Section Selector */}
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="h-8 px-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-slate-400 cursor-pointer"
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
            className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs h-8 rounded-lg gap-1.5 font-medium transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5 stroke-[1.5] text-slate-500" />
            <span>Bounds Config</span>
          </Button>

          {/* Export */}
          <Button
            size="sm"
            onClick={() => exportToCSV(currentSection, rows)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 rounded-lg gap-1.5 px-3.5 font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Max Marks Configuration Panel */}
      {configOpen && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 stroke-[1.5] text-slate-600" />
              <h3 className="text-xs font-medium text-slate-800">
                Component Maximum Marks
              </h3>
            </div>
            <span className="text-xs font-mono font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
              Total Max: {maxTotal} Marks
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {Object.entries(maxMarks).map(([key, val]) => (
              <div key={key} className="space-y-1">
                <label className="capitalize text-[11px] font-medium text-slate-600">
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
                  className="h-8 text-xs font-mono bg-white rounded-lg border-slate-200 tabular-nums"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-400">Class Average</div>
          <div className="text-2xl font-semibold text-slate-900 mt-1 font-mono tabular-nums">
            {classAvg}{" "}
            <span className="text-xs font-normal text-slate-400 font-sans">/{maxTotal}</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Mean student performance</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-400">Highest Score</div>
          <div className="text-2xl font-semibold text-slate-900 mt-1 font-mono tabular-nums">
            {highestScore}{" "}
            <span className="text-xs font-normal text-slate-400 font-sans">/{maxTotal}</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Section top score</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-400">Passing Rate</div>
          <div className="text-2xl font-semibold text-slate-900 mt-1 font-mono tabular-nums">
            {passRate}%
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {passCount} of {totalStudents} passing
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-medium text-slate-400">Status</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-800">{statusMsg}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Atomic file persistence</div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 stroke-[1.5] text-slate-400 absolute left-3 top-2.5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or roll..."
              className="pl-8 text-xs h-8 border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="h-8 px-3 text-xs font-medium border-slate-200 text-slate-700 gap-1.5 rounded-lg hover:bg-slate-50"
            >
              <ArrowUpDown className="w-3.5 h-3.5 stroke-[1.5] text-slate-400" />
              <span>Sort: {sortOrder === "desc" ? "Highest First" : "Lowest First"}</span>
            </Button>
          </div>
        </div>

        {/* Spreadsheet Data Grid */}
        <div className="overflow-x-auto border border-slate-200/80 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-200 text-slate-600 text-[11px] font-medium bg-slate-50/80">
              <tr>
                <th className="py-2.5 px-3 font-mono">Roll</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-2.5 text-center font-mono">Internal /{maxMarks.internal}</th>
                <th className="py-2.5 px-2.5 text-center font-mono">Lab /{maxMarks.lab}</th>
                <th className="py-2.5 px-2.5 text-center font-mono">Practical /{maxMarks.practical}</th>
                <th className="py-2.5 px-2.5 text-center font-mono">Project /{maxMarks.project}</th>
                <th className="py-2.5 px-2.5 text-center font-mono font-medium text-slate-900 bg-slate-100/50">
                  Total /{maxTotal}
                </th>
                <th className="py-2.5 px-2.5 text-center font-mono">Percentage</th>
                <th className="py-2.5 px-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredAndSortedRows.map((r) => {
                const pct = Math.round((r.total / maxTotal) * 100);
                return (
                  <tr key={r.studentId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2 px-3 font-mono text-slate-700 tabular-nums">{r.rollNumber}</td>
                    <td className="py-2 px-3">
                      <div className="font-medium text-slate-900">{r.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                        {r.email}
                      </div>
                    </td>

                    {/* Internal Cell */}
                    <td
                      onClick={() => handleStartEdit(r.studentId, "internalMarks", r.internalMarks)}
                      className="py-1.5 px-2 text-center font-mono tabular-nums cursor-pointer hover:bg-slate-100/60 transition-colors"
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
                          className="w-12 text-center font-mono border border-slate-900 rounded bg-white text-xs outline-none py-0.5 tabular-nums"
                        />
                      ) : (
                        <span className="text-slate-800">{r.internalMarks}</span>
                      )}
                    </td>

                    {/* Lab Cell */}
                    <td
                      onClick={() =>
                        handleStartEdit(r.studentId, "labRecordMarks", r.labRecordMarks)
                      }
                      className="py-1.5 px-2 text-center font-mono tabular-nums cursor-pointer hover:bg-slate-100/60 transition-colors"
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
                          className="w-12 text-center font-mono border border-slate-900 rounded bg-white text-xs outline-none py-0.5 tabular-nums"
                        />
                      ) : (
                        <span className="text-slate-800">{r.labRecordMarks}</span>
                      )}
                    </td>

                    {/* Practical Cell */}
                    <td
                      onClick={() =>
                        handleStartEdit(r.studentId, "practicalMarks", r.practicalMarks)
                      }
                      className="py-1.5 px-2 text-center font-mono tabular-nums cursor-pointer hover:bg-slate-100/60 transition-colors"
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
                          className="w-12 text-center font-mono border border-slate-900 rounded bg-white text-xs outline-none py-0.5 tabular-nums"
                        />
                      ) : (
                        <span className="text-slate-800">{r.practicalMarks}</span>
                      )}
                    </td>

                    {/* Project Cell */}
                    <td
                      onClick={() => handleStartEdit(r.studentId, "projectMarks", r.projectMarks)}
                      className="py-1.5 px-2 text-center font-mono tabular-nums cursor-pointer hover:bg-slate-100/60 transition-colors"
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
                          className="w-12 text-center font-mono border border-slate-900 rounded bg-white text-xs outline-none py-0.5 tabular-nums"
                        />
                      ) : (
                        <span className="text-slate-800">{r.projectMarks}</span>
                      )}
                    </td>

                    {/* Total Cell */}
                    <td className="py-2 px-2.5 text-center font-mono tabular-nums font-semibold text-slate-900 text-xs bg-slate-50/50">
                      {r.total}
                    </td>

                    {/* Percentage */}
                    <td className="py-2 px-2.5 text-center font-mono tabular-nums text-xs text-slate-600">
                      {pct}%
                    </td>

                    {/* Grade Pill */}
                    <td className="py-2 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-800">
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
