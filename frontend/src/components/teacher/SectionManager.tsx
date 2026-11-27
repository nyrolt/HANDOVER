import React, { useState } from "react";
import {
  FolderGit2,
  Plus,
  Users,
  Layers,
  BookOpen,
  Edit2,
  Trash2,
  ArrowRight,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/services/db";
import type { Section } from "@/types";

interface SectionManagerProps {
  onOpenSpreadsheetForSection: (sectionId: string) => void;
  onOpenAddStudent: (sectionId?: string) => void;
}

export function SectionManager({
  onOpenSpreadsheetForSection,
  onOpenAddStudent,
}: SectionManagerProps) {
  const sections = db.getSections();
  const students = db.getStudents();
  const groups = db.getProjectGroups();
  const assignments = db.getAssignments();

  // Create section modal
  const [createOpen, setCreateOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [newCourseName, setNewCourseName] = useState("Computer Science & Engineering");
  const [newAcademicYear, setNewAcademicYear] = useState("2026-2027");

  // Edit section modal
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editSectionName, setEditSectionName] = useState("");
  const [editCourseName, setEditCourseName] = useState("");
  const [editAcademicYear, setEditAcademicYear] = useState("");

  // Delete section confirm modal
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;

    db.createSection({
      sectionName: newSectionName.trim(),
      courseName: newCourseName.trim(),
      academicYear: newAcademicYear.trim(),
      teacherId: "teacher-1",
    });

    setNewSectionName("");
    setCreateOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection || !editSectionName.trim()) return;

    db.updateSection(editingSection.id, {
      sectionName: editSectionName.trim(),
      courseName: editCourseName.trim(),
      academicYear: editAcademicYear.trim(),
    });

    setEditingSection(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingSectionId) return;
    db.deleteSection(deletingSectionId);
    setDeletingSectionId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-semibold text-slate-900">
              Class & Section Management
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure course sections with independent student rosters, marks registers, and project groups.
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 rounded-md px-3 font-medium gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Create New Section
        </Button>
      </div>

      {/* Sections Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => {
          const secStudents = students.filter((s) => s.sectionId === section.id);
          const secGroups = groups.filter((g) => g.sectionId === section.id);
          const secAssignments = assignments.filter((a) => a.sectionId === section.id);

          return (
            <div
              key={section.id}
              className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-slate-500">
                      {section.courseName}
                    </span>
                    <h3 className="text-base font-semibold text-slate-900 mt-0.5">
                      {section.sectionName}
                    </h3>
                  </div>

                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {section.academicYear}
                  </span>
                </div>

                {/* Section Statistics */}
                <div className="grid grid-cols-3 gap-2 mt-4 py-2.5 border-y border-slate-100 text-center font-mono">
                  <div>
                    <div className="text-lg font-semibold text-slate-900 tabular-nums">{secStudents.length}</div>
                    <div className="text-[10px] text-slate-500 font-sans">Students</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-900 tabular-nums">{secGroups.length}</div>
                    <div className="text-[10px] text-slate-500 font-sans">Teams</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-900 tabular-nums">{secAssignments.length}</div>
                    <div className="text-[10px] text-slate-500 font-sans">Tasks</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <Button
                  onClick={() => onOpenSpreadsheetForSection(section.id)}
                  variant="outline"
                  className="w-full border-slate-200 text-slate-800 hover:bg-slate-50 font-medium text-xs h-8 rounded-md justify-between"
                >
                  <span>Open Marksheet</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </Button>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    onClick={() => onOpenAddStudent(section.id)}
                    className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add Student
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingSection(section);
                        setEditSectionName(section.sectionName);
                        setEditCourseName(section.courseName);
                        setEditAcademicYear(section.academicYear);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                      title="Edit section"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {sections.length > 1 && (
                      <button
                        onClick={() => setDeletingSectionId(section.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Section Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in-50 zoom-in-95">
            <h3 className="text-base font-semibold text-slate-900">Create New Class Section</h3>
            <p className="text-xs text-slate-500 mt-1">
              Set up a distinct section for student tracking and independent grade spreadsheets.
            </p>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Section Name (e.g. CSE - Section C, IT - Section B)
                </label>
                <Input
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="CSE - Section C"
                  required
                  className="text-xs h-8 rounded-md"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Department / Course Name
                </label>
                <Input
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  placeholder="Computer Science & Engineering"
                  required
                  className="text-xs h-8 rounded-md"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Academic Year
                </label>
                <Input
                  value={newAcademicYear}
                  onChange={(e) => setNewAcademicYear(e.target.value)}
                  placeholder="2026-2027"
                  required
                  className="text-xs h-8 rounded-md font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCreateOpen(false)}
                  className="text-xs h-8 rounded-md border-slate-200 text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 rounded-md font-medium"
                >
                  Create Section
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in-50 zoom-in-95">
            <h3 className="text-base font-semibold text-slate-900">Edit Section Details</h3>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Section Name
                </label>
                <Input
                  value={editSectionName}
                  onChange={(e) => setEditSectionName(e.target.value)}
                  required
                  className="text-xs h-8 rounded-md"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Course Name
                </label>
                <Input
                  value={editCourseName}
                  onChange={(e) => setEditCourseName(e.target.value)}
                  required
                  className="text-xs h-8 rounded-md"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Academic Year
                </label>
                <Input
                  value={editAcademicYear}
                  onChange={(e) => setEditAcademicYear(e.target.value)}
                  required
                  className="text-xs h-8 rounded-md font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingSection(null)}
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

      {/* Delete Section Confirm Modal */}
      {deletingSectionId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-sm w-full p-5 animate-in fade-in-50 zoom-in-95">
            <div className="w-9 h-9 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <Trash2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Delete this section?</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Deleting this section will also delete all associated student rosters, marks sheets,
              and project groups.
            </p>
            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingSectionId(null)}
                className="text-xs h-8 rounded-md border-slate-200 text-slate-700"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteConfirm}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-8 rounded-md font-medium"
              >
                Delete Section
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
