import React, { useState } from "react";
import {
  Layers,
  Plus,
  CheckCircle2,
  XCircle,
  Users,
  Edit2,
  Trash2,
  Award,
  UserPlus,
  Clock,
  Sparkles,
  Search,
  Check,
  Send,
  X,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/services/db";
import { useAuth } from "@/services/auth";
import type { ProjectGroup, GroupRequest } from "@/types";

export function GroupProjectsManager() {
  const { user } = useAuth();
  const sections = db.getSections();
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newGuide, setNewGuide] = useState(user?.name || "Dr. Eleanor Vance, Ph.D.");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Edit group modal
  const [editingGroup, setEditingGroup] = useState<ProjectGroup | null>(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [editProjectTitle, setEditProjectTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editGuide, setEditGuide] = useState("");
  const [editMarks, setEditMarks] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<ProjectGroup["status"]>("In Progress");

  // Add member modal
  const [addMemberGroupId, setAddMemberGroupId] = useState<string | null>(null);
  const [studentToAddId, setStudentToAddId] = useState<string>("");

  const groups = db.getProjectGroups(selectedSectionId);
  const requests = db.getGroupRequests(selectedSectionId);
  const sectionStudents = db.getStudents(selectedSectionId);
  const unassignedStudents = sectionStudents.filter((s) => !s.projectGroupId);
  const pendingRequests = requests.filter((r) => r.status === "Pending");

  // Handle create new group
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newProjectTitle.trim() || !selectedSectionId) return;

    db.createProjectGroup({
      groupName: newGroupName.trim(),
      projectTitle: newProjectTitle.trim(),
      sectionId: selectedSectionId,
      projectDescription: newDescription.trim(),
      guide: newGuide.trim(),
      projectMarks: 0,
      approvedBy: user?.name || "Faculty",
      memberStudentIds: selectedStudentIds,
    });

    setCreateModalOpen(false);
    setNewGroupName("");
    setNewProjectTitle("");
    setNewDescription("");
    setSelectedStudentIds([]);
  };

  // Handle edit group save
  const handleSaveEditGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup) return;

    db.updateProjectGroup(editingGroup.id, {
      groupName: editGroupName.trim(),
      projectTitle: editProjectTitle.trim(),
      projectDescription: editDescription.trim(),
      guide: editGuide.trim(),
      projectMarks: editMarks,
      status: editStatus,
    });

    setEditingGroup(null);
  };

  // Handle delete group
  const handleDeleteGroup = (groupId: string) => {
    if (confirm("Are you sure you want to delete this project group?")) {
      db.deleteProjectGroup(groupId);
    }
  };

  // Handle remove member from group
  const handleRemoveMember = (groupId: string, studentId: string) => {
    const group = db.getProjectGroupById(groupId);
    if (!group) return;

    const newMembers = group.members.filter((m) => m.studentId !== studentId);
    db.updateProjectGroup(groupId, { members: newMembers });
    db.updateStudent(studentId, { projectGroupId: undefined });
  };

  // Handle add member to group
  const handleAddMemberToGroup = () => {
    if (!addMemberGroupId || !studentToAddId) return;
    const group = db.getProjectGroupById(addMemberGroupId);
    const student = db.getStudentById(studentToAddId);
    if (!group || !student) return;

    const newMember: {
      studentId: string;
      studentName: string;
      rollNumber: string;
      role: "Leader" | "Member";
    } = {
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      role: "Member",
    };

    db.updateProjectGroup(addMemberGroupId, {
      members: [...group.members, newMember],
    });

    db.updateStudent(studentToAddId, { projectGroupId: addMemberGroupId });
    setAddMemberGroupId(null);
    setStudentToAddId("");
  };

  // Handle review proposal
  const handleReviewProposal = (requestId: string, status: "Approved" | "Rejected") => {
    db.reviewGroupRequest(requestId, status, user?.name || "Faculty Advisor");
  };

  const filteredGroups = groups.filter((g) => {
    const q = searchQuery.toLowerCase();
    return (
      g.groupName.toLowerCase().includes(q) ||
      g.projectTitle.toLowerCase().includes(q) ||
      g.members.some((m) => m.studentName.toLowerCase().includes(q) || m.rollNumber.includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xs shadow-indigo-600/30">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Project Groups & Proposals Management
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Organize student teams, allocate guides, review incoming proposals, and assign
            continuous milestone marks.
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
            onClick={() => setCreateModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs h-9 rounded-xl gap-1.5 shadow-xs shadow-indigo-600/25 px-3.5 font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project Group</span>
          </Button>
        </div>
      </div>

      {/* Pending Student Proposals Banner / Queue */}
      {pendingRequests.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50/30 to-amber-50 border border-amber-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Pending Student Group Proposals ({pendingRequests.length})
              </h3>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200">
              Awaiting Action
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-amber-200/80 rounded-2xl p-4.5 space-y-3 shadow-xs"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900">{req.proposedGroupName}</div>
                  <div className="text-xs font-medium text-indigo-700 mt-0.5">
                    {req.proposedProjectTitle}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400">Proposed Members:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {req.proposedMembers.map((m, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReviewProposal(req.id, "Rejected")}
                    className="h-8 text-xs border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 rounded-lg font-semibold"
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleReviewProposal(req.id, "Approved")}
                    className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold gap-1 px-3"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve Group
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Group Search & Count Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Approved Project Groups
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
            {groups.length}
          </span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams, topics, members..."
            className="pl-8 text-xs h-9 border-slate-200 rounded-xl"
          />
        </div>
      </div>

      {/* Project Group Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white border border-slate-200/80 hover:border-indigo-200/80 rounded-3xl p-6 shadow-xs transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900">{group.groupName}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {group.status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-indigo-700 mt-1">
                  {group.projectTitle}
                </div>
              </div>

              <div className="text-right shrink-0 bg-indigo-50/50 border border-indigo-100 px-3 py-1.5 rounded-xl">
                <div className="text-[10px] font-bold text-indigo-900/60 uppercase">Score</div>
                <div className="text-lg font-black text-indigo-700 font-mono">
                  {group.projectMarks}
                  <span className="text-xs font-normal text-slate-400 font-sans">
                    {" "}
                    / {group.maxProjectMarks || 20}
                  </span>
                </div>
              </div>
            </div>

            {group.projectDescription && (
              <p className="text-xs text-slate-500 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                {group.projectDescription}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <div>
                Guide: <strong className="text-slate-800">{group.guide}</strong>
              </div>
              <div>
                Authorized: <span className="text-slate-700">{group.approvedBy}</span>
              </div>
            </div>

            {/* Team Roster List */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold uppercase tracking-wider text-slate-400">
                  Members ({group.members.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAddMemberGroupId(group.id);
                    setStudentToAddId("");
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 hover:underline"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Add Member</span>
                </button>
              </div>

              <div className="space-y-1.5">
                {group.members.map((m) => (
                  <div
                    key={m.studentId}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                        Roll {m.rollNumber}
                      </span>
                      <span className="font-semibold text-slate-800">{m.studentName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{m.role}</span>
                      <button
                        onClick={() => handleRemoveMember(group.id, m.studentId)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                        title="Remove member"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteGroup(group.id)}
                className="h-8 text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                <span>Delete</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingGroup(group);
                  setEditGroupName(group.groupName);
                  setEditProjectTitle(group.projectTitle);
                  setEditDescription(group.projectDescription || "");
                  setEditGuide(group.guide);
                  setEditMarks(group.projectMarks);
                  setEditStatus(group.status);
                }}
                className="h-8 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                <span>Edit Details & Score</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Group */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Create New Project Group</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Team / Group Name</label>
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Team ByteForge"
                  className="h-9 text-xs border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Project Title / Topic</label>
                <Input
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="e.g. Distributed Database Engine"
                  className="h-9 text-xs border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Project Description</label>
                <Textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Technical scope, objectives, and deliverables..."
                  className="text-xs border-slate-200 rounded-xl resize-none h-20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Faculty Guide</label>
                <Input
                  value={newGuide}
                  onChange={(e) => setNewGuide(e.target.value)}
                  className="h-9 text-xs border-slate-200 rounded-xl"
                  required
                />
              </div>

              {/* Assign unassigned students */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Assign Students from Section ({unassignedStudents.length} available)
                </label>
                <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1">
                  {unassignedStudents.map((s) => {
                    const isSelected = selectedStudentIds.includes(s.id);
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedStudentIds(selectedStudentIds.filter((id) => id !== s.id));
                          } else {
                            setSelectedStudentIds([...selectedStudentIds, s.id]);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs ${
                          isSelected
                            ? "bg-indigo-50 text-indigo-900 font-semibold"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span>
                          {s.name} ({s.rollNumber})
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateModalOpen(false)}
                  className="h-9 text-xs rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 rounded-xl font-semibold px-4"
                >
                  Save Group
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Group */}
      {editingGroup && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Edit Project: {editingGroup.groupName}
              </h3>
              <button
                onClick={() => setEditingGroup(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditGroup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Group Name</label>
                <Input
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value)}
                  className="h-9 text-xs border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Project Title</label>
                <Input
                  value={editProjectTitle}
                  onChange={(e) => setEditProjectTitle(e.target.value)}
                  className="h-9 text-xs border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Project Score (/20)</label>
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    value={editMarks}
                    onChange={(e) => setEditMarks(parseInt(e.target.value) || 0)}
                    className="h-9 text-xs border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Milestone Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as ProjectGroup["status"])}
                    className="w-full h-9 px-3 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending Review">Pending Review</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingGroup(null)}
                  className="h-9 text-xs rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 rounded-xl font-semibold px-4"
                >
                  Update Group
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Member */}
      {addMemberGroupId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Add Student to Group</h3>
              <button
                onClick={() => setAddMemberGroupId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">
                Select Unassigned Student
              </label>
              <select
                value={studentToAddId}
                onChange={(e) => setStudentToAddId(e.target.value)}
                className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-800"
              >
                <option value="">-- Choose classmate --</option>
                {unassignedStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddMemberGroupId(null)}
                className="h-8 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAddMemberToGroup}
                disabled={!studentToAddId}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 rounded-xl font-semibold px-3"
              >
                Add Member
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
