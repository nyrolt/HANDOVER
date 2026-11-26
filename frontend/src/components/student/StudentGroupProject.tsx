import React, { useState } from "react";
import {
  Layers,
  Send,
  Users,
  CheckCircle2,
  Clock,
  Award,
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
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-700" />
            <h2 className="text-base font-semibold text-slate-900">
              Project Groups & Collaborative Teams
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official group projects, evaluation milestones, and collaborative team proposals for{" "}
            <strong>{section?.sectionName || "your section"}</strong>.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          <span>Section: {section?.sectionName}</span>
        </div>
      </div>

      {/* Submission Success Alert */}
      {submittedNotice && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center justify-between text-xs text-slate-800 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" />
            <span>
              Your group proposal has been submitted to <strong>{teacherName}</strong>. Your team
              members can now see this proposal on their portal!
            </span>
          </div>
          <button
            onClick={() => setSubmittedNotice(false)}
            className="text-slate-500 hover:text-slate-800 ml-4 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          STATE 1: STUDENT HAS AN OFFICIAL APPROVED GROUP
         ========================================================================= */}
      {approvedGroup ? (
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Official approved project group</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                {approvedGroup.groupName}
              </h3>
              <p className="text-xs font-medium text-slate-700">{approvedGroup.projectTitle}</p>
            </div>

            <div className="sm:text-right bg-slate-50 p-3 rounded-lg border border-slate-200 shrink-0">
              <div className="text-[10px] font-medium uppercase text-slate-500">
                Milestone score
              </div>
              <div className="text-xl font-semibold text-slate-900 font-mono mt-0.5 tabular-nums">
                {approvedGroup.projectMarks}
                <span className="text-xs font-normal text-slate-400 font-sans">
                  {" "}
                  / {approvedGroup.maxProjectMarks || 20}
                </span>
              </div>
            </div>
          </div>

          {approvedGroup.projectDescription && (
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
              {approvedGroup.projectDescription}
            </p>
          )}

          {/* Project Details Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 p-3.5 bg-slate-50/60 rounded-lg border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-medium">
                Faculty guide
              </span>
              <strong className="text-slate-800 font-medium mt-0.5 block">
                {approvedGroup.guide}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-medium">
                Authorized by
              </span>
              <strong className="text-slate-800 font-medium mt-0.5 block">
                {approvedGroup.approvedBy}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-medium">
                Milestone status
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                {approvedGroup.status}
              </span>
            </div>
          </div>

          {/* Official Team Roster */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-medium text-slate-500">
              Official team roster ({approvedGroup.members.length} members)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {approvedGroup.members.map((m) => {
                const isYou =
                  m.studentId === student.id ||
                  m.studentName.toLowerCase() === student.name.toLowerCase() ||
                  m.rollNumber === student.rollNumber;
                return (
                  <div
                    key={m.studentId}
                    className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${isYou
                      ? "bg-slate-50 border-slate-300"
                      : "bg-white border-slate-200/80 hover:border-slate-300"
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center font-medium text-xs shrink-0 ${isYou ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                          }`}
                      >
                        {m.studentName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-slate-900 truncate">
                          {m.studentName} {isYou && <span className="text-slate-500 font-normal">(You)</span>}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          Roll: {m.rollNumber}
                        </div>
                      </div>
                    </div>

                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium shrink-0 bg-slate-100 text-slate-600 border border-slate-200/60"
                    >
                      {m.role}
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
        <div className="bg-white border border-amber-200/80 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Proposal pending review</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mt-1">
                {myCreatedRequest.proposedGroupName}
              </h3>
              <p className="text-xs font-medium text-slate-700">
                {myCreatedRequest.proposedProjectTitle}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Proposed teammates:</span>
            <div className="flex flex-wrap gap-2">
              {myCreatedRequest.proposedMembers.map((member, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200/60"
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
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900">Propose a project group</h3>
            <p className="text-xs text-slate-500">
              Submit your team name, project topic, and invite classmates from{" "}
              <strong>{section?.sectionName}</strong> for faculty approval.
            </p>
          </div>

          <form onSubmit={handleSubmitProposal} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Proposed group name</label>
                <Input
                  value={proposedGroupName}
                  onChange={(e) => setProposedGroupName(e.target.value)}
                  placeholder="e.g. Team ByteForge"
                  className="h-8 text-xs border-slate-200 rounded-lg"
                  required
                />
                {/* One-click suggestions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTED_TEAM_NAMES.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setProposedGroupName(name)}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-slate-600 font-medium transition-colors"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Proposed project title</label>
                <Input
                  value={proposedProjectTitle}
                  onChange={(e) => setProposedProjectTitle(e.target.value)}
                  placeholder="e.g. Autonomous Drone Navigation System"
                  className="h-8 text-xs border-slate-200 rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Select Classmates from Section */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                <span>Select classmates from {section?.sectionName}</span>
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
                        className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${isSelected
                          ? "bg-slate-100 border-slate-300 text-slate-900 font-medium"
                          : "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300"
                          }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="truncate font-medium">{cm.name}</div>
                          <div className="text-[10px] font-mono text-slate-400">
                            Roll {cm.rollNumber}
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${isSelected ? "bg-slate-900 text-white" : "border border-slate-300"
                            }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 text-center border border-slate-200/70">
                  All classmates in this section are currently assigned to project groups.
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 px-4 font-medium rounded-lg shadow-xs gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit proposal for faculty approval</span>
            </Button>
          </form>
        </div>
      )}

      {/* =========================================================================
          SECTION TEAMS MASTER DIRECTORY
         ========================================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {section?.sectionName || "Section"} Teams Directory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Approved project teams, allocated guides, and active milestones in your section.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <Input
              value={searchDirectoryQuery}
              onChange={(e) => setSearchDirectoryQuery(e.target.value)}
              placeholder="Search group, topic, member..."
              className="pl-8 text-xs h-8 border-slate-200 rounded-lg"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-200 text-slate-600 font-medium text-xs bg-slate-50/75">
              <tr>
                <th className="py-2.5 px-3">Group Name</th>
                <th className="py-2.5 px-3">Project Topic</th>
                <th className="py-2.5 px-3">Members</th>
                <th className="py-2.5 px-3">Faculty Guide</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDirectoryGroups.map((g) => {
                const isMyGroup =
                  g.id === approvedGroup?.id || g.members.some((m) => m.studentId === student.id);
                return (
                  <tr
                    key={g.id}
                    className={`transition-colors ${isMyGroup ? "bg-slate-50/80 font-medium" : "hover:bg-slate-50/50"
                      }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{g.groupName}</span>
                        {isMyGroup && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-800 border border-slate-200/60">
                            Your Team
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-normal text-slate-700 max-w-xs truncate">
                      {g.projectTitle}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {g.members.map((m) => (
                          <span
                            key={m.studentId}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${m.studentId === student.id
                              ? "bg-slate-800 text-white"
                              : "bg-slate-100 text-slate-700 border border-slate-200/60"
                              }`}
                          >
                            {m.studentName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{g.guide}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                        {g.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-medium text-slate-900">
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
