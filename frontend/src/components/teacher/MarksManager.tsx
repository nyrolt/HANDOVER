import React, { useState, useEffect, useCallback } from "react";
import {
  Award,
  Download,
  Settings2,
  CheckCircle2,
  Search,
  ArrowUpDown,
  Calculator,
  Sparkles,
  FileSpreadsheet,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/services/db";
import { useAuth } from "@/services/auth";
import { getSectionSpreadsheetRows, exportToCSV } from "@/services/teacher";
import { submissionsApi } from "@/services/submissionsApi";
import type { MarksReconciliationAlert } from "@/types";
import { AsciiGlitchRipple } from "@/components/ui/ascii-glitch-ripple";

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
  const [seedingMarks, setSeedingMarks] = useState(false);

  // Automatic Marks Reconciliation State (System F)
  const [reconciliationAlerts, setReconciliationAlerts] = useState<MarksReconciliationAlert[]>([]);
  const [isReconciling, setIsReconciling] = useState(false);
  const [showReconciliationDrawer, setShowReconciliationDrawer] = useState(false);

  const loadReconciliationAlerts = useCallback(async () => {
    if (!selectedSectionId) return;
    try {
      const res = await submissionsApi.getReconciliationAlerts(selectedSectionId);
      if (res.success && res.data) {
        setReconciliationAlerts(res.data);
      }
    } catch {
      // Offline fallback
    }
  }, [selectedSectionId]);

  useEffect(() => {
    loadReconciliationAlerts();
  }, [loadReconciliationAlerts]);

  const handleRunReconciliation = async () => {
    if (!selectedSectionId) return;
    try {
      setIsReconciling(true);
      const res = await submissionsApi.runReconciliation(selectedSectionId);
      if (res.success && res.data) {
        setReconciliationAlerts(res.data.alerts || []);
        setStatusMsg(
          `Reconciliation scan finished: ${res.data.totalMissingMarks} missing marks detected.`,
        );
      }
    } catch {
      setStatusMsg("Failed to complete reconciliation scan");
    } finally {
      setIsReconciling(false);
    }
  };

  const handlePopulateMarks = () => {
    if (!selectedSectionId) return;
    setSeedingMarks(true);
    db.populateSampleStudents(selectedSectionId);
    setTimeout(() => {
      setSeedingMarks(false);
      setStatusMsg("Populated sample continuous marks");
    }, 200);
  };

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
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              Marks & Continuous Evaluation Gradebook
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Component marks, real-time total recalculation, and continuous grade synchronization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Section Selector */}
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

          {/* Config Max Marks */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setConfigOpen(!configOpen)}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs h-8 rounded-md gap-1.5 font-medium"
          >
            <Settings2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Scale Bounds</span>
          </Button>

          {/* Export */}
          <Button
            size="sm"
            onClick={() => exportToCSV(currentSection, rows)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 rounded-md gap-1.5 px-3 font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* System F: Marks Reconciliation Alert Banner */}
      {reconciliationAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-amber-900">
                Marks Reconciliation: {reconciliationAlerts.length} verified submission(s) missing
                grades
              </div>
              <p className="text-amber-700 mt-0.5">
                Students have submitted assignments that passed verification but have no recorded
                continuous marks in this section.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRunReconciliation}
              disabled={isReconciling}
              className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100 text-xs h-8"
            >
              {isReconciling ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin mr-1.5" /> Scanning...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3 mr-1.5" /> Re-Scan
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={() => setShowReconciliationDrawer(!showReconciliationDrawer)}
              className="bg-amber-700 hover:bg-amber-800 text-white text-xs h-8"
            >
              {showReconciliationDrawer ? "Hide Missing" : "Review Missing"}
            </Button>
          </div>
        </div>
      )}

      {/* Reconciliation Drawer / List */}
      {showReconciliationDrawer && reconciliationAlerts.length > 0 && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="text-xs font-semibold text-slate-800">
            Pending Gradebook Entries ({reconciliationAlerts.length} Students)
          </div>
          <div className="divide-y divide-slate-200/60 border border-slate-200 rounded-lg bg-white overflow-hidden">
            {reconciliationAlerts.map((alt) => (
              <div key={alt.id} className="p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900">
                    {alt.studentName || alt.studentId}
                  </span>
                  <span className="text-slate-500 ml-2 font-mono">
                    ({alt.daysPending} days awaiting marks)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSearchQuery(alt.studentName || "");
                      setShowReconciliationDrawer(false);
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Award Marks in Grid →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Max Marks Configuration Panel */}
      {configOpen && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-slate-600" />
              <h3 className="text-xs font-semibold text-slate-900">
                Evaluation Component Max Bounds
              </h3>
            </div>
            <span className="text-xs font-mono font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
              Total Max: {maxTotal}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {Object.entries(maxMarks).map(([key, val]) => (
              <div key={key} className="space-y-1">
                <label className="capitalize font-medium text-slate-600 text-[11px]">
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
                  className="h-8 text-xs font-mono bg-white rounded-md border-slate-200"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            CLASS AVERAGE
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            <AsciiGlitchRipple as="span">{classAvg}</AsciiGlitchRipple>{" "}
            <span className="text-xs font-normal text-slate-400 font-sans">/{maxTotal}</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Mean student performance</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            HIGHEST TOTAL
          </span>
          <div className="text-2xl font-bold text-emerald-600 mt-1 font-mono tabular-nums">
            <AsciiGlitchRipple as="span">{String(highestScore)}</AsciiGlitchRipple>{" "}
            <span className="text-xs font-normal text-slate-400 font-sans">/{maxTotal}</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Section top performer</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            PASS RATE
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            <AsciiGlitchRipple as="span">{String(passRate)}</AsciiGlitchRipple>%
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {passCount} of {totalStudents} passing
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            SYNC STATUS
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-900 font-mono">
              <AsciiGlitchRipple as="span">{statusMsg}</AsciiGlitchRipple>
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Continuous save active</div>
        </div>
      </div>

      {/* Grade Tier Bar */}
      {totalStudents > 0 && (
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4.5 shadow-2xs space-y-2">
          <div className="flex justify-between text-xs text-neutral-700 font-semibold">
            <span>Grade Tier Cohort Distribution</span>
            <span className="font-mono text-neutral-400">{totalStudents} Students Evaluated</span>
          </div>
          <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full w-[40%]" title="O (Outstanding ≥90%)" />
            <div className="bg-blue-500 h-full w-[35%]" title="A+ (Excellent ≥80%)" />
            <div className="bg-indigo-500 h-full w-[15%]" title="A (Very Good ≥70%)" />
            <div className="bg-amber-400 h-full w-[10%]" title="Passing / Average" />
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-neutral-500 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> O (Outstanding ≥90%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> A+ (Excellent ≥80%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> A (Very Good ≥70%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> B/C (Passing)
            </span>
          </div>
        </div>
      )}

      {/* Toolbar & Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or roll..."
              className="pl-8 text-xs h-8 border-slate-200 rounded-md"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="h-8 px-2.5 text-xs font-medium border-slate-200 text-slate-700 gap-1.5 rounded-md hover:bg-slate-50"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span>Sort: {sortOrder === "desc" ? "Highest First" : "Lowest First"}</span>
            </Button>
          </div>
        </div>

        {/* Spreadsheet Data Grid */}
        <div className="overflow-x-auto border border-slate-200 rounded-md">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-200 text-slate-600 font-medium text-[11px] bg-slate-50">
              <tr>
                <th className="py-2.5 px-3 font-mono">Roll No</th>
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-3 text-right">Internal /{maxMarks.internal}</th>
                <th className="py-2.5 px-3 text-right">Lab /{maxMarks.lab}</th>
                <th className="py-2.5 px-3 text-right">Practical /{maxMarks.practical}</th>
                <th className="py-2.5 px-3 text-right">Project /{maxMarks.project}</th>
                <th className="py-2.5 px-3 text-right font-semibold text-slate-900 bg-slate-100/70 border-l border-r border-slate-200">
                  Total /{maxTotal}
                </th>
                <th className="py-2.5 px-3 text-right">Percentage</th>
                <th className="py-2.5 px-4 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredAndSortedRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs border border-amber-100">
                        <Award className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-neutral-900">
                        {searchQuery ? "No matching students found" : "Gradebook Unpopulated"}
                      </h4>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        {searchQuery
                          ? `No student matching "${searchQuery}". Clear your search query.`
                          : "This section currently has no active continuous marks entries. Populate a sample roster to test-drive automated scoring and grade distribution."}
                      </p>
                      {!searchQuery && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={handlePopulateMarks}
                            disabled={seedingMarks}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>
                              {seedingMarks ? "Populating..." : "Populate Sample Student Marks"}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedRows.map((r) => {
                  const pct = Math.round((r.total / maxTotal) * 100);
                  const isPass = pct >= 40;
                  return (
                    <tr key={r.studentId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 font-mono tabular-nums font-semibold text-slate-800">
                        {r.rollNumber}
                      </td>
                      <td className="py-2 px-4">
                        <div className="font-medium text-slate-900">{r.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                          {r.email}
                        </div>
                      </td>

                      {/* Internal Cell */}
                      <td
                        onClick={() =>
                          handleStartEdit(r.studentId, "internalMarks", r.internalMarks)
                        }
                        className="py-2 px-3 text-right font-mono tabular-nums cursor-pointer hover:bg-slate-100/60 transition-colors"
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
                            className="w-14 text-right font-mono tabular-nums border border-slate-900 rounded bg-white text-xs outline-none py-0.5 px-1"
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
                        className="py-2 px-3 text-right font-mono tabular-nums cursor-pointer hover:bg-slate-100/60 transition-colors"
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
                            className="w-14 text-right font-mono tabular-nums border border-slate-900 rounded bg-white text-xs outline-none py-0.5 px-1"
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
                        className="py-2 px-3 text-right font-mono tabular-nums cursor-pointer hover:bg-slate-100/60 transition-colors"
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
                            className="w-14 text-right font-mono tabular-nums border border-slate-900 rounded bg-white text-xs outline-none py-0.5 px-1"
                          />
                        ) : (
                          <span className="text-slate-800">{r.practicalMarks}</span>
                        )}
                      </td>

                      {/* Project Cell */}
                      <td
                        onClick={() => handleStartEdit(r.studentId, "projectMarks", r.projectMarks)}
                        className="py-2 px-3 text-right font-mono tabular-nums cursor-pointer hover:bg-slate-100/60 transition-colors"
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
                            className="w-14 text-right font-mono tabular-nums border border-slate-900 rounded bg-white text-xs outline-none py-0.5 px-1"
                          />
                        ) : (
                          <span className="text-slate-800">{r.projectMarks}</span>
                        )}
                      </td>

                      {/* Total Cell */}
                      <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 bg-slate-50/70 border-l border-r border-slate-200">
                        {r.total}
                      </td>

                      {/* Percentage */}
                      <td className="py-2 px-3 text-right font-mono tabular-nums text-xs text-slate-700">
                        {pct}%
                      </td>

                      {/* Grade Pill */}
                      <td className="py-2 px-4 text-center">
                        <span
                          className={`font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            r.grade.startsWith("O")
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : r.grade.startsWith("A+")
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : r.grade.startsWith("A")
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                  : r.grade.startsWith("B+")
                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                    : r.grade.startsWith("B")
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {r.grade.split(" ")[0]}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
