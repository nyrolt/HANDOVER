import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Download,
  Upload,
  Trash2,
  Edit2,
  Check,
  ChevronDown,
  ArrowUpDown,
  Filter,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/services/db";
import { useAuth } from "@/services/auth";
import { AsciiGlitchRipple } from "@/components/ui/ascii-glitch-ripple";
import {
  getSectionSpreadsheetRows,
  exportToCSV,
  parseAndImportCSV,
  type SpreadsheetRow,
} from "@/services/teacher";
import type { Section, Student } from "@/types";

interface StudentSpreadsheetProps {
  initialSectionId?: string | undefined;
  onOpenAddStudent?: (() => void) | undefined;
}

export function StudentSpreadsheet({
  initialSectionId,
  onOpenAddStudent,
}: StudentSpreadsheetProps) {
  const { user } = useAuth();
  const sections = db.getSections();
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    initialSectionId || sections[0]?.id || "",
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"rollNumber" | "name" | "total">("rollNumber");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Inline editing state: { studentId, field }
  const [activeCell, setActiveCell] = useState<{
    studentId: string;
    field: "internalMarks" | "labRecordMarks" | "practicalMarks" | "projectMarks";
  } | null>(null);

  const [editValue, setEditValue] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<string>("All changes saved");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Edit student modal
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editStudentName, setEditStudentName] = useState("");
  const [editStudentRoll, setEditStudentRoll] = useState("");
  const [editStudentEmail, setEditStudentEmail] = useState("");

  // Delete modal
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  // Import CSV state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [csvFileContent, setCsvFileContent] = useState("");
  const [importSummary, setImportSummary] = useState<{ added: number; errors: string[] } | null>(
    null,
  );

  const currentSection = sections.find((s) => s.id === selectedSectionId) || sections[0];

  // Refresh trigger when db updates
  const [, setDbTick] = useState(0);
  useEffect(() => {
    const unsub = db.subscribe(() => setDbTick((t) => t + 1));
    return unsub;
  }, []);

  const rows = selectedSectionId ? getSectionSpreadsheetRows(selectedSectionId) : [];

  // Filter & Sort
  const filteredRows = rows
    .filter((r) => {
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.rollNumber.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.projectGroupName.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let comp = 0;
      if (sortField === "rollNumber") {
        const numA = parseInt(a.rollNumber, 10);
        const numB = parseInt(b.rollNumber, 10);
        comp = isNaN(numA) || isNaN(numB) ? a.rollNumber.localeCompare(b.rollNumber) : numA - numB;
      } else if (sortField === "name") {
        comp = a.name.localeCompare(b.name);
      } else if (sortField === "total") {
        comp = a.total - b.total;
      }
      return sortOrder === "asc" ? comp : -comp;
    });

  // Handle inline cell edit start
  const handleCellClick = (
    studentId: string,
    field: "internalMarks" | "labRecordMarks" | "practicalMarks" | "projectMarks",
    currentVal: number,
  ) => {
    setActiveCell({ studentId, field });
    setEditValue(currentVal.toString());
    setValidationError(null);
  };

  // Commit inline edit
  const commitCellEdit = () => {
    if (!activeCell) return;

    const parsed = parseInt(editValue.trim(), 10);
    if (isNaN(parsed) || parsed < 0 || parsed > 20) {
      setValidationError("Marks must be between 0 and 20.");
      return;
    }

    db.updateStudentMarks(
      activeCell.studentId,
      {
        [activeCell.field]: parsed,
      },
      user?.name || "Faculty",
    );

    setActiveCell(null);
    setValidationError(null);
    setSaveStatus("Saved just now");
    setTimeout(() => setSaveStatus("All changes saved"), 3000);
  };

  // Keyboard navigation for spreadsheet cell
  const handleKeyDown = (
    e: React.KeyboardEvent,
    rowIndex: number,
    fieldIndex: number,
    fields: Array<"internalMarks" | "labRecordMarks" | "practicalMarks" | "projectMarks">,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitCellEdit();
      // Move down if possible
      if (rowIndex + 1 < filteredRows.length) {
        const nextStudent = filteredRows[rowIndex + 1];
        const nextField = fields[fieldIndex];
        if (nextStudent && nextField) {
          const val = nextStudent[nextField];
          handleCellClick(nextStudent.studentId, nextField, val);
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      commitCellEdit();
      const currentRow = filteredRows[rowIndex];
      if (e.shiftKey) {
        // Move backward
        if (fieldIndex > 0) {
          const prevField = fields[fieldIndex - 1];
          if (currentRow && prevField) {
            const val = currentRow[prevField];
            handleCellClick(currentRow.studentId, prevField, val);
          }
        } else if (rowIndex > 0) {
          const prevStudent = filteredRows[rowIndex - 1];
          const prevField = fields[fields.length - 1];
          if (prevStudent && prevField) {
            handleCellClick(prevStudent.studentId, prevField, prevStudent[prevField]);
          }
        }
      } else {
        // Move forward
        if (fieldIndex + 1 < fields.length) {
          const nextField = fields[fieldIndex + 1];
          if (currentRow && nextField) {
            const val = currentRow[nextField];
            handleCellClick(currentRow.studentId, nextField, val);
          }
        } else if (rowIndex + 1 < filteredRows.length) {
          const nextStudent = filteredRows[rowIndex + 1];
          const nextField = fields[0];
          if (nextStudent && nextField) {
            handleCellClick(nextStudent.studentId, nextField, nextStudent[nextField]);
          }
        }
      }
    } else if (e.key === "Escape") {
      setActiveCell(null);
      setValidationError(null);
    }
  };

  const toggleSort = (field: "rollNumber" | "name" | "total") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Open edit student modal
  const handleStartEditStudent = (r: SpreadsheetRow) => {
    const student = db.getStudentById(r.studentId);
    if (!student) return;
    setEditingStudent(student);
    setEditStudentName(student.name);
    setEditStudentRoll(student.rollNumber);
    setEditStudentEmail(student.email);
  };

  const handleSaveStudentDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    db.updateStudent(editingStudent.id, {
      name: editStudentName.trim(),
      rollNumber: editStudentRoll.trim(),
      email: editStudentEmail.trim(),
    });
    setEditingStudent(null);
    setSaveStatus("Student details updated");
    setTimeout(() => setSaveStatus("All changes saved"), 3000);
  };

  const handleConfirmDelete = () => {
    if (!deletingStudentId) return;
    db.deleteStudent(deletingStudentId);
    setDeletingStudentId(null);
    setSaveStatus("Student record removed");
    setTimeout(() => setSaveStatus("All changes saved"), 3000);
  };

  const handleImportCSVSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFileContent.trim() || !selectedSectionId) return;
    const res = parseAndImportCSV(csvFileContent, selectedSectionId);
    setImportSummary({ added: res.addedCount, errors: res.errors });
    if (res.addedCount > 0) {
      setSaveStatus(`Imported ${res.addedCount} students`);
      setTimeout(() => setSaveStatus("All changes saved"), 4000);
    }
  };

  const [seedingSection, setSeedingSection] = useState(false);

  const handlePopulateSection = () => {
    if (!selectedSectionId) return;
    setSeedingSection(true);
    db.populateSampleStudents(selectedSectionId);
    setTimeout(() => {
      setSeedingSection(false);
      setSaveStatus("Populated 8 sample students");
    }, 200);
  };

  const editableFields: Array<
    "internalMarks" | "labRecordMarks" | "practicalMarks" | "projectMarks"
  > = ["internalMarks", "labRecordMarks", "practicalMarks", "projectMarks"];

  const totalStudentsCount = rows.length;
  const classAvgScore =
    totalStudentsCount > 0
      ? (rows.reduce((acc, r) => acc + r.total, 0) / totalStudentsCount).toFixed(1)
      : "0";
  const highestScorerScore = totalStudentsCount > 0 ? Math.max(...rows.map((r) => r.total)) : 0;

  return (
    <div className="space-y-4">
      {/* Quick Summary KPI Ticker */}
      {totalStudentsCount > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              ENROLLED ROSTER
            </span>
            <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
              <AsciiGlitchRipple as="span">{String(totalStudentsCount)}</AsciiGlitchRipple>{" "}
              <span className="text-xs font-sans font-normal text-slate-400">students</span>
            </div>
          </div>
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              CLASS AVERAGE
            </span>
            <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
              <AsciiGlitchRipple as="span">{classAvgScore}</AsciiGlitchRipple>{" "}
              <span className="text-xs font-sans font-normal text-slate-400">/80</span>
            </div>
          </div>
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              HIGHEST TOTAL
            </span>
            <div className="text-xl font-bold text-emerald-600 font-mono mt-0.5">
              <AsciiGlitchRipple as="span">{String(highestScorerScore)}</AsciiGlitchRipple>{" "}
              <span className="text-xs font-sans font-normal text-slate-400">/80</span>
            </div>
          </div>
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                EVALUATION
              </span>
              <div className="text-xs font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Clamped [0, 20]
              </div>
            </div>
            <button
              onClick={() => exportToCSV(currentSection, rows)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-3 py-1 rounded-md cursor-pointer"
            >
              CSV
            </button>
          </div>
        </div>
      )}

      {/* Top Controls: Section Selector, Search, Actions */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Section Selector & Details */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-slate-600 shrink-0" />
            <span className="text-xs font-medium text-slate-500">Section:</span>
          </div>

          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="h-8 px-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-slate-400 cursor-pointer"
          >
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.sectionName} ({s.courseName})
              </option>
            ))}
          </select>

          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            • {filteredRows.length} enrolled
          </span>
        </div>

        {/* Right: Search, Export, Import, Add */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roll, name, group..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:border-slate-400 transition-colors text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Export to CSV */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => exportToCSV(currentSection, rows)}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs gap-1.5 h-8 rounded-md font-medium"
            title="Download this section as a CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>

          {/* Import CSV */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setImportModalOpen(true);
              setImportSummary(null);
            }}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs gap-1.5 h-8 rounded-md font-medium"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Import</span>
          </Button>

          {/* Add Student */}
          <Button
            size="sm"
            onClick={onOpenAddStudent}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5 h-8 rounded-md font-medium px-3"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Spreadsheet Instructions & Live Save Status Bar */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700">Academic ledger:</span>
          <span>
            Click any cell to edit marks. Use{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] text-slate-700">
              Tab
            </kbd>{" "}
            or{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] text-slate-700">
              Enter
            </kbd>{" "}
            to move.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 font-mono text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
          <span>{saveStatus}</span>
        </div>
      </div>

      {/* Spreadsheet Table with Sticky Column Freezing & Horizontal Scroll */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto max-h-[620px]">
          <table className="w-full text-left text-xs border-collapse">
            {/* Table Header */}
            <thead className="bg-slate-50 sticky top-0 z-20 border-b border-slate-200 text-slate-600 select-none">
              <tr>
                <th
                  onClick={() => toggleSort("rollNumber")}
                  className="py-2.5 px-3 font-semibold text-[11px] sticky left-0 z-30 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors w-16 border-r border-slate-200"
                >
                  <div className="flex items-center gap-1">
                    <span>Roll</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("name")}
                  className="py-2.5 px-4 font-semibold text-[11px] sticky left-16 z-30 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors min-w-[180px] border-r border-slate-200"
                >
                  <div className="flex items-center gap-1">
                    <span>Student Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-medium text-[11px] min-w-[170px] text-slate-500">
                  Email
                </th>
                <th className="py-2.5 px-3 font-medium text-[11px] min-w-[130px] text-slate-500">
                  Project Group
                </th>
                <th className="py-2.5 px-3 font-medium text-[11px] text-right w-24 text-slate-600">
                  Internal <span className="text-[10px] text-slate-400 font-mono">/20</span>
                </th>
                <th className="py-2.5 px-3 font-medium text-[11px] text-right w-24 text-slate-600">
                  Lab <span className="text-[10px] text-slate-400 font-mono">/20</span>
                </th>
                <th className="py-2.5 px-3 font-medium text-[11px] text-right w-24 text-slate-600">
                  Practical <span className="text-[10px] text-slate-400 font-mono">/20</span>
                </th>
                <th className="py-2.5 px-3 font-medium text-[11px] text-right w-24 text-slate-600">
                  Project <span className="text-[10px] text-slate-400 font-mono">/20</span>
                </th>
                <th
                  onClick={() => toggleSort("total")}
                  className="py-2.5 px-3 font-semibold text-[11px] text-right w-24 bg-slate-100/70 text-slate-900 cursor-pointer hover:bg-slate-200/60 transition-colors border-l border-r border-slate-200"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Total</span>
                    <span className="text-[10px] text-slate-500 font-mono">/80</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-medium text-[11px] text-center w-24 text-slate-600">
                  Grade
                </th>
                <th className="py-2.5 px-3 font-medium text-[11px] text-right w-20 text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs border border-blue-100">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-neutral-900">
                        {searchQuery
                          ? "No matching students found"
                          : "No Student Records in this Section"}
                      </h4>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        {searchQuery
                          ? `No student record matched "${searchQuery}". Clear your search query to view all students.`
                          : "This class section currently has 0 enrolled students. Add students manually, upload an existing CSV roster, or populate an instant 8-student sample roster with marks."}
                      </p>
                      {!searchQuery && (
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={handlePopulateSection}
                            disabled={seedingSection}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>
                              {seedingSection ? "Populating..." : "Populate 8 Sample Students"}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={onOpenAddStudent}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Student</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setImportModalOpen(true);
                              setImportSummary(null);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-medium shadow-2xs transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5 text-neutral-500" />
                            <span>Import CSV</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, rowIndex) => {
                  return (
                    <tr
                      key={row.studentId}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Frozen Roll Number */}
                      <td className="py-2 px-3 font-mono tabular-nums font-semibold text-slate-800 sticky left-0 z-10 bg-white group-hover:bg-slate-50 border-r border-slate-200">
                        {row.rollNumber}
                      </td>

                      {/* Frozen Student Name */}
                      <td className="py-2 px-4 font-medium text-slate-900 sticky left-16 z-10 bg-white group-hover:bg-slate-50 border-r border-slate-200 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-slate-100 text-slate-700 font-semibold flex items-center justify-center text-[10px] shrink-0">
                            {row.name.charAt(0)}
                          </div>
                          <span className="truncate">{row.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-2 px-3 text-slate-500 font-mono text-[11px] truncate max-w-[180px]">
                        {row.email}
                      </td>

                      {/* Project Group */}
                      <td className="py-2 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono ${
                            row.projectGroupName !== "Unassigned"
                              ? "bg-slate-100 text-slate-800 border border-slate-200"
                              : "text-slate-400"
                          }`}
                        >
                          {row.projectGroupName}
                        </span>
                      </td>

                      {/* Editable Marks: Internal, Lab, Practical, Project */}
                      {editableFields.map((field, fieldIndex) => {
                        const isEditing =
                          activeCell?.studentId === row.studentId && activeCell.field === field;
                        const cellValue = row[field];

                        return (
                          <td
                            key={field}
                            onClick={() =>
                              !isEditing && handleCellClick(row.studentId, field, cellValue)
                            }
                            className={`py-2 px-3 text-right font-mono tabular-nums cursor-pointer transition-colors border-r border-slate-100 ${
                              isEditing
                                ? "bg-white ring-2 ring-slate-900 ring-inset z-10"
                                : "hover:bg-slate-100/60 text-slate-800"
                            }`}
                          >
                            {isEditing ? (
                              <input
                                autoFocus
                                type="number"
                                min={0}
                                max={20}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={commitCellEdit}
                                onKeyDown={(e) =>
                                  handleKeyDown(e, rowIndex, fieldIndex, editableFields)
                                }
                                className="w-full text-right font-mono tabular-nums font-semibold text-slate-900 bg-transparent focus:outline-none text-xs pr-1"
                              />
                            ) : (
                              <span className="font-mono tabular-nums text-slate-800">
                                {cellValue}
                              </span>
                            )}
                          </td>
                        );
                      })}

                      {/* Auto-calculated Total */}
                      <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 bg-slate-50/70 border-l border-r border-slate-200">
                        {row.total}
                      </td>

                      {/* Grade Badge */}
                      <td className="py-2 px-3 text-center whitespace-nowrap">
                        <span
                          className={`font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            row.grade.startsWith("O")
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : row.grade.startsWith("A+")
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : row.grade.startsWith("A")
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                  : row.grade.startsWith("B+")
                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                    : row.grade.startsWith("B")
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {row.grade.split(" ")[0]}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleStartEditStudent(row)}
                            className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Edit student profile"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingStudentId(row.studentId)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove student from section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Spreadsheet Footer / Summary Metrics */}
        {filteredRows.length > 0 && (
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-600 font-mono">
            <div className="flex items-center gap-6">
              <span>
                Rows: <strong className="text-slate-900 tabular-nums">{filteredRows.length}</strong>
              </span>
              <span>
                Mean:{" "}
                <strong className="text-slate-900 tabular-nums">
                  {(
                    filteredRows.reduce((acc, r) => acc + r.total, 0) / filteredRows.length
                  ).toFixed(1)}
                  /80
                </strong>
              </span>
              <span>
                High:{" "}
                <strong className="text-slate-900 tabular-nums">
                  {Math.max(...filteredRows.map((r) => r.total))}/80
                </strong>
              </span>
            </div>

            <div className="text-[11px] text-slate-400 font-sans">
              Enter or Tab to move • Auto-persisted to store
            </div>
          </div>
        )}
      </div>

      {/* Edit Student Details Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in-50 zoom-in-95">
            <h3 className="text-base font-semibold text-slate-900">Edit Student Details</h3>
            <p className="text-xs text-slate-500 mt-1">
              Update roll number, name or college email address.
            </p>

            <form onSubmit={handleSaveStudentDetails} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Roll Number</label>
                <Input
                  value={editStudentRoll}
                  onChange={(e) => setEditStudentRoll(e.target.value)}
                  required
                  className="text-xs h-8 rounded-md font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <Input
                  value={editStudentName}
                  onChange={(e) => setEditStudentName(e.target.value)}
                  required
                  className="text-xs h-8 rounded-md"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={editStudentEmail}
                  onChange={(e) => setEditStudentEmail(e.target.value)}
                  required
                  className="text-xs h-8 rounded-md font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingStudent(null)}
                  className="text-xs h-8 rounded-md border-slate-200 text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 rounded-md font-medium"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingStudentId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-sm w-full p-5 animate-in fade-in-50 zoom-in-95">
            <div className="w-9 h-9 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <Trash2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Remove Student Record?</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              This will remove the student from this section and delete their academic marks record.
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingStudentId(null)}
                className="text-xs h-8 rounded-md border-slate-200 text-slate-700"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-8 rounded-md font-medium"
              >
                Delete Student
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-semibold text-slate-900">Import Students via CSV</h3>
              </div>
              <button
                onClick={() => setImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Paste CSV data formatted as:{" "}
              <code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">
                Roll No, Student Name, Email
              </code>
            </p>

            <form onSubmit={handleImportCSVSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target Section: {currentSection?.sectionName}
                </label>
                <textarea
                  rows={6}
                  value={csvFileContent}
                  onChange={(e) => setCsvFileContent(e.target.value)}
                  placeholder={`Roll No,Student Name,Email\n09,Vikram Seth,vikram@college.edu\n10,Ananya Roy,ananya@college.edu`}
                  className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              {importSummary && (
                <div
                  className={`p-3 rounded-md text-xs ${
                    importSummary.added > 0
                      ? "bg-slate-50 text-slate-800 border border-slate-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  <p className="font-semibold">
                    Successfully imported {importSummary.added} student(s).
                  </p>
                  {importSummary.errors.length > 0 && (
                    <ul className="mt-1 list-disc list-inside text-[11px]">
                      {importSummary.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setImportModalOpen(false)}
                  className="text-xs h-8 rounded-md border-slate-200 text-slate-700"
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 rounded-md font-medium"
                >
                  Import Rows
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
