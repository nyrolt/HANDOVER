import React, { useState } from "react";
import {
  Layers,
  Send,
  Users,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  Search,
  Plus,
  Mail,
  UserCheck,
  Check,
  AlertCircle,
  X,
  UserPlus,
  ShieldCheck,
  Crown,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/services/db";
import type { Student, ProjectGroup, GroupRequest } from "@/types";

interface StudentGroupProjectProps {
  student: Student;
}

// Preset popular team names for one-click suggestion
const SUGGESTED_TEAM_NAMES = [
  "Team ByteForge",
  "Team Quantum",
  "Team CyberNova",
  "Team Nexus",
  "Team Apex",
  "Team Synthetix",
  "Team Algorhythm",
  "Team BitCrafters",
];

export function StudentGroupProject({ student }: StudentGroupProjectProps) {
  const section = db.getSectionById(student.sectionId);
  const teacherUser = section ? db.getUserById(section.teacherId) : null;
  const teacherName = teacherUser?.name || "Faculty Advisor";
  const sectionGroups = db.getProjectGroups(student.sectionId);
  const sectionStudents = db.getStudents(student.sectionId);
  const allSectionRequests = db.getGroupRequests(student.sectionId);

  // 1. Check if student belongs to an official approved group
  const approvedGroup = sectionGroups.find(
    (g) =>
      g.id === student.projectGroupId ||
      g.members.some(
        (m) =>
          m.studentId === student.id ||
          m.studentName.toLowerCase() === student.name.toLowerCase() ||
          m.rollNumber === student.rollNumber,
      ),
  );

  // 2. Check pending proposal: created by this student
  const myCreatedRequest = allSectionRequests.find(
    (r) => r.status === "Pending" && r.studentId === student.id,
  );

  // 3. Check pending proposal: added by another classmate
  const addedByOtherRequest = allSectionRequests.find(
    (r) =>
      r.status === "Pending" &&
      r.studentId !== student.id &&
      r.proposedMembers.some((m) => {
        const query = m.trim().toLowerCase();
        return (
          query === student.name.toLowerCase() ||
          query === student.email.toLowerCase() ||
          query === student.id.toLowerCase() ||
          query === student.rollNumber.toLowerCase() ||
          query === `roll ${student.rollNumber}`.toLowerCase() ||
          query.includes(student.email.toLowerCase()) ||
          query.includes(student.name.toLowerCase())
        );
      }),
  );

  // Proposal form state
  const [proposedGroupName, setProposedGroupName] = useState("");
  const [proposedProjectTitle, setProposedProjectTitle] = useState("");
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>([]);
  const [customTeammateInput, setCustomTeammateInput] = useState("");
  const [customTeammates, setCustomTeammates] = useState<string[]>([]);
  const [submittedNotice, setSubmittedNotice] = useState(false);
  const [searchDirectoryQuery, setSearchDirectoryQuery] = useState("");

  // Eligible unassigned classmates in section
  const availableClassmates = sectionStudents.filter(
    (s) => s.id !== student.id && !s.projectGroupId,
  );

  const handleTogglePartner = (id: string) => {
    if (selectedPartnerIds.includes(id)) {
      setSelectedPartnerIds(selectedPartnerIds.filter((p) => p !== id));
    } else {
      setSelectedPartnerIds([...selectedPartnerIds, id]);
    }
  };

  const handleAddCustomTeammate = () => {
    const trimmed = customTeammateInput.trim();
    if (!trimmed) return;
    if (!customTeammates.includes(trimmed)) {
      setCustomTeammates([...customTeammates, trimmed]);
    }
    setCustomTeammateInput("");
  };

  const handleRemoveCustomTeammate = (val: string) => {
    setCustomTeammates(customTeammates.filter((t) => t !== val));
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedGroupName.trim() || !proposedProjectTitle.trim()) return;

    // Collect all partner names
    const partnerNames = selectedPartnerIds.map((id) => {
      const partner = sectionStudents.find((s) => s.id === id);
      return partner ? `${partner.name} (${partner.rollNumber})` : id;
    });

    const allMembers = [
      `${student.name} (${student.rollNumber})`,
      ...partnerNames,
      ...customTeammates,
    ];

    db.submitGroupRequest({
      studentId: student.id,
      studentName: student.name,
      sectionId: student.sectionId,
      proposedGroupName: proposedGroupName.trim(),
      proposedProjectTitle: proposedProjectTitle.trim(),
      proposedMembers: allMembers,
    });

    setSubmittedNotice(true);
    setProposedGroupName("");
    setProposedProjectTitle("");
    setSelectedPartnerIds([]);
    setCustomTeammates([]);
  };

  const filteredDirectoryGroups = sectionGroups.filter((g) => {
    const q = searchDirectoryQuery.toLowerCase();
    return (
      g.groupName.toLowerCase().includes(q) ||
      g.projectTitle.toLowerCase().includes(q) ||
      g.members.some(
        (m) => m.studentName.toLowerCase().includes(q) || m.rollNumber.toLowerCase().includes(q),
      )
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
              Project Groups & Collaborative Teams
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official group projects, evaluation milestones, and collaborative team proposals for{" "}
            <strong>{section?.sectionName || "your section"}</strong>.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <span>Section: {section?.sectionName}</span>
        </div>
      </div>

      {/* Submission Success Alert */}
      {submittedNotice && (
        <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-900 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Your group proposal has been submitted to <strong>{teacherName}</strong>. Your team
              members can now see this proposal on their portal!
            </span>
          </div>
          <button
            onClick={() => setSubmittedNotice(false)}
            className="text-emerald-700 font-bold hover:text-emerald-900 ml-4 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          STATE 1: STUDENT HAS AN OFFICIAL APPROVED GROUP
         ========================================================================= */}
      {approvedGroup ? (
        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Official Approved Project Group</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {approvedGroup.groupName}
              </h3>
              <p className="text-sm font-semibold text-indigo-700">{approvedGroup.projectTitle}</p>
            </div>

            <div className="sm:text-right bg-gradient-to-br from-indigo-50/50 to-violet-50/30 p-4 rounded-2xl border border-indigo-100/80 shrink-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-900/70">
                Project Milestone Score
              </div>
              <div className="text-3xl font-black text-indigo-700 font-mono mt-0.5">
                {approvedGroup.projectMarks}
                <span className="text-xs font-normal text-slate-400 font-sans">
                  {" "}
                  / {approvedGroup.maxProjectMarks || 20}
                </span>
              </div>
            </div>
          </div>

          {approvedGroup.projectDescription && (
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
              {approvedGroup.projectDescription}
            </p>
          )}

          {/* Project Details Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 p-4 bg-slate-50/60 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Faculty Guide
              </span>
              <strong className="text-slate-900 font-semibold mt-0.5 block">
                {approvedGroup.guide}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Authorized By
              </span>
              <strong className="text-slate-900 font-semibold mt-0.5 block">
                {approvedGroup.approvedBy}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Milestone Status
              </span>
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {approvedGroup.status}
              </span>
            </div>
          </div>

          {/* Official Team Roster */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Team Roster ({approvedGroup.members.length} Members)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {approvedGroup.members.map((m) => {
                const isYou =
                  m.studentId === student.id ||
                  m.studentName.toLowerCase() === student.name.toLowerCase() ||
                  m.rollNumber === student.rollNumber;
                return (
                  <div
                    key={m.studentId}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isYou
                        ? "bg-indigo-50/60 border-indigo-200/80 shadow-xs"
                        : "bg-white border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isYou ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {m.studentName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {m.studentName} {isYou && <span className="text-indigo-600">(You)</span>}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          Roll: {m.rollNumber}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0 ${
                        m.role === "Leader"
                          ? "bg-amber-100 text-amber-900 border border-amber-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {m.role === "Leader" ? "👑 Leader" : "Member"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : myCreatedRequest ? (
        /* =========================================================================
            STATE 2: PENDING PROPOSAL (CREATED BY YOU)
           ========================================================================= */
        <div className="bg-white border border-amber-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Proposal Pending Review</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {myCreatedRequest.proposedGroupName}
              </h3>
              <p className="text-sm font-semibold text-indigo-700">
                {myCreatedRequest.proposedProjectTitle}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500">Proposed Teammates:</span>
            <div className="flex flex-wrap gap-2">
              {myCreatedRequest.proposedMembers.map((member, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-xs font-semibold text-slate-800"
                >
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>{member}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            STATE 3: NO GROUP YET -> PROPOSAL FORM
           ========================================================================= */
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Team Formation Active</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Propose a Project Group</h3>
            <p className="text-xs text-slate-500">
              Submit your team name, project topic, and invite classmates from{" "}
              <strong>{section?.sectionName}</strong> for faculty approval.
            </p>
          </div>

          <form onSubmit={handleSubmitProposal} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Proposed Group Name</label>
                <Input
                  value={proposedGroupName}
                  onChange={(e) => setProposedGroupName(e.target.value)}
                  placeholder="e.g. Team ByteForge"
                  className="h-10 text-xs border-slate-200 rounded-xl"
                  required
                />
                {/* One-click suggestions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTED_TEAM_NAMES.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setProposedGroupName(name)}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 font-medium transition-colors"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Proposed Project Title</label>
                <Input
                  value={proposedProjectTitle}
                  onChange={(e) => setProposedProjectTitle(e.target.value)}
                  placeholder="e.g. Autonomous Drone Navigation System"
                  className="h-10 text-xs border-slate-200 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Select Classmates from Section */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Select Classmates from {section?.sectionName}</span>
                <span className="text-[11px] font-normal text-slate-400">
                  {availableClassmates.length} classmates available
                </span>
              </label>

              {availableClassmates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
                  {availableClassmates.map((cm) => {
                    const isSelected = selectedPartnerIds.includes(cm.id);
                    return (
                      <button
                        type="button"
                        key={cm.id}
                        onClick={() => handleTogglePartner(cm.id)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold shadow-xs"
                            : "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="truncate font-bold">{cm.name}</div>
                          <div className="text-[10px] font-mono text-slate-400">
                            Roll {cm.rollNumber}
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-indigo-600 text-white" : "border border-slate-300"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 text-center border border-slate-200/70">
                  All classmates in this section are currently assigned to project groups.
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs h-10 px-6 font-semibold rounded-xl shadow-xs shadow-indigo-600/30 gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Proposal for Faculty Approval</span>
            </Button>
          </form>
        </div>
      )}

      {/* =========================================================================
          SECTION TEAMS MASTER DIRECTORY
         ========================================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {section?.sectionName || "Section"} Teams Directory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Approved project teams, allocated guides, and active milestones in your section.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <Input
              value={searchDirectoryQuery}
              onChange={(e) => setSearchDirectoryQuery(e.target.value)}
              placeholder="Search group, topic, member..."
              className="pl-8 text-xs h-9 border-slate-200 rounded-xl"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider bg-slate-50/50">
              <tr>
                <th className="py-3 px-4">Group Name</th>
                <th className="py-3 px-4">Project Topic</th>
                <th className="py-3 px-4">Members</th>
                <th className="py-3 px-4">Faculty Guide</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDirectoryGroups.map((g) => {
                const isMyGroup =
                  g.id === approvedGroup?.id || g.members.some((m) => m.studentId === student.id);
                return (
                  <tr
                    key={g.id}
                    className={`transition-colors ${
                      isMyGroup ? "bg-indigo-50/40 font-semibold" : "hover:bg-slate-50/60"
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{g.groupName}</span>
                        {isMyGroup && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                            Your Team
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 max-w-xs truncate">
                      {g.projectTitle}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {g.members.map((m) => (
                          <span
                            key={m.studentId}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                              m.studentId === student.id
                                ? "bg-indigo-600 text-white font-bold"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {m.studentName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{g.guide}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {g.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-700">
                      {g.projectMarks}/20
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
