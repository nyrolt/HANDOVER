import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Calendar,
  Edit2,
  Trash2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/services/db";
import { useAuth } from "@/services/auth";
import { SubmissionsBulkVerificationModal } from "./SubmissionsBulkVerificationModal";
import type { Assignment } from "@/types";

export function AssignmentManager() {
  const { user } = useAuth();
  const sections = db.getSections();
  const [selectedSectionId, setSelectedSectionId] = useState<string>("all");

  // Create Assignment Modal
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newSectionId, setNewSectionId] = useState(sections[0]?.id || "");
  const [newDeadline, setNewDeadline] = useState("2026-11-30");
  const [newDescription, setNewDescription] = useState("");

  // Edit Assignment Modal
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editSectionId, setEditSectionId] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState<Assignment["status"]>("Active");
  const [selectedSubmissionsAssignment, setSelectedSubmissionsAssignment] =
    useState<Assignment | null>(null);

  const assignments =
    selectedSectionId === "all" ? db.getAssignments() : db.getAssignments(selectedSectionId);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSubject.trim() || !newSectionId) return;

    db.createAssignment({
      title: newTitle.trim(),
      subject: newSubject.trim(),
      description: newDescription.trim(),
      sectionId: newSectionId,
      deadline: newDeadline,
      createdBy: user?.name || "Faculty",
    });

    setCreateOpen(false);
    setNewTitle("");
    setNewSubject("");
    setNewDescription("");
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment) return;

    db.updateAssignment(editingAssignment.id, {
      title: editTitle.trim(),
      subject: editSubject.trim(),
      sectionId: editSectionId,
      deadline: editDeadline,
      description: editDescription.trim(),
      status: editStatus,
    });

    setEditingAssignment(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      db.deleteAssignment(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-semibold text-slate-900">Assignment Management</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish academic coursework, set firm submission deadlines, and monitor completion per
            section.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Section filter */}
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="h-8 px-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-slate-400"
          >
            <option value="all">All Sections</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.sectionName}
              </option>
            ))}
          </select>

          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5 h-8 rounded-md font-medium px-3"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Assignment
          </Button>
        </div>
      </div>

      {/* Quick Summary Chips */}
      <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
        <span className="px-3 py-1 bg-white border border-neutral-200/80 rounded-full font-semibold text-neutral-900 shadow-2xs">
          All: {assignments.length}
        </span>
        <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full font-semibold">
          Active: {assignments.filter((a) => a.status === "Active").length}
        </span>
        <span className="px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-full font-semibold">
          Closed: {assignments.filter((a) => a.status === "Closed").length}
        </span>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.length === 0 ? (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center shadow-2xs">
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs border border-indigo-100">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                No Coursework Assignments Posted
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Publish lab exercises, milestones, and project deadlines with strict submission
                dates for your enrolled sections.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const targetSecId =
                      selectedSectionId === "all" ? sections[0]?.id : selectedSectionId;
                    if (targetSecId) {
                      db.populateSampleAssignments(targetSecId);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Populate 3 Sample Assignments</span>
                </button>

                <Button
                  size="sm"
                  onClick={() => setCreateOpen(true)}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs rounded-full px-4 h-9 font-semibold gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Assignment</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          assignments.map((assignment) => {
            const section = sections.find((s) => s.id === assignment.sectionId);
            const isClosed = assignment.status === "Closed";

            return (
              <div
                key={assignment.id}
                className="bg-white border border-slate-200 rounded-lg p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {assignment.subject}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {section?.sectionName || "All Sections"}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
                        {assignment.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900 mt-2">
                      {assignment.title}
                    </h3>
                  </div>

                  {/* Deadline Box */}
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs self-start shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-mono">Due Date</div>
                      <div className="font-mono tabular-nums font-medium text-slate-800">
                        {assignment.deadline}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                  {assignment.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span>Created by {assignment.createdBy}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedSubmissionsAssignment(assignment)}
                      className="text-xs h-7 px-2.5 bg-indigo-50/50 hover:bg-indigo-50 border-indigo-200 text-indigo-700 font-medium"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                      Submissions & Bulk Verification
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingAssignment(assignment);
                        setEditTitle(assignment.title);
                        setEditSubject(assignment.subject);
                        setEditSectionId(assignment.sectionId);
                        setEditDeadline(assignment.deadline);
                        setEditDescription(assignment.description);
                        setEditStatus(assignment.status);
                      }}
                      className="p-1 text-slate-500 hover:text-slate-800 rounded flex items-center gap-1 font-medium transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="p-1 text-slate-500 hover:text-rose-600 rounded flex items-center gap-1 font-medium transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Assignment Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in-50 zoom-in-95">
            <h3 className="text-base font-semibold text-slate-900">Create New Course Assignment</h3>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Assignment Title
                </label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AWS S3 Versioning & Lifecycle Experiment"
                  required
                  className="text-xs h-8 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Subject / Course
                  </label>
                  <Input
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Cloud Computing Lab"
                    required
                    className="text-xs h-8 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Target Section
                  </label>
                  <select
                    value={newSectionId}
                    onChange={(e) => setNewSectionId(e.target.value)}
                    className="w-full text-xs h-8 bg-white border border-slate-200 rounded-md px-2 font-medium"
                  >
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.sectionName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Submission Deadline Date
                </label>
                <Input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  required
                  className="text-xs h-8 rounded-md font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Instructions & Description
                </label>
                <Textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide detailed submission requirements, format specifications, and deliverables..."
                  className="text-xs rounded-md"
                  rows={4}
                  required
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
                  Publish Assignment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {editingAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in-50 zoom-in-95">
            <h3 className="text-base font-semibold text-slate-900">Edit Assignment</h3>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Assignment Title
                </label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="text-xs h-8 rounded-md"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Subject</label>
                  <Input
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    required
                    className="text-xs h-8 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Section</label>
                  <select
                    value={editSectionId}
                    onChange={(e) => setEditSectionId(e.target.value)}
                    className="w-full text-xs h-8 bg-white border border-slate-200 rounded-md px-2"
                  >
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.sectionName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as Assignment["status"])}
                    className="w-full text-xs h-8 bg-white border border-slate-200 rounded-md px-2"
                  >
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Deadline Date
                </label>
                <Input
                  type="date"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                  required
                  className="text-xs h-8 rounded-md font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="text-xs rounded-md"
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingAssignment(null)}
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
      {/* Submissions & Bulk Verification Modal */}
      {selectedSubmissionsAssignment && (
        <SubmissionsBulkVerificationModal
          assignment={selectedSubmissionsAssignment}
          isOpen={Boolean(selectedSubmissionsAssignment)}
          onClose={() => setSelectedSubmissionsAssignment(null)}
        />
      )}
    </div>
  );
}
