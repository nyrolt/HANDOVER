import React, { useState } from "react";
import {
  Layers,
  Send,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Check,
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
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-semibold text-slate-900">
              Project Groups & Collaborative Teams
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official group projects, evaluation milestones, and team proposals for{" "}
            <strong>{section?.sectionName || "your section"}</strong>.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-xs font-mono font-medium text-slate-700">
          <span>Section: {section?.sectionName}</span>
        </div>
      </div>

      {/* Submission Success Alert */}
      {submittedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-center justify-between text-xs text-emerald-900 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
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

      {/* STATE 1: STUDENT HAS AN OFFICIAL APPROVED GROUP */}
      {approvedGroup ? (
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Official Approved Group</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                {approvedGroup.groupName}
              </h3>
              <p className="text-xs text-slate-600">{approvedGroup.projectTitle}</p>
            </div>

            <div className="sm:text-right bg-slate-50 border border-slate-200 px-3 py-1.5 rounded font-mono shrink-0">
              <div className="text-[10px] font-medium uppercase text-slate-400">
                Project Milestone Score
              </div>
              <div className="text-xl font-semibold text-slate-900 tabular-nums">
                {approvedGroup.projectMarks}
                <span className="text-xs font-normal text-slate-400 font-sans">
                  {" "}
                  / {approvedGroup.maxProjectMarks || 20}
                </span>
              </div>
            </div>
          </div>

          {approvedGroup.projectDescription && (
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
              {approvedGroup.projectDescription}
            </p>
          )}

          {/* Project Details Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 p-3.5 bg-slate-50 rounded border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">
                Faculty Guide
              </span>
              <strong className="text-slate-900 font-medium mt-0.5 block">
                {approvedGroup.guide}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">
                Authorized By
              </span>
              <strong className="text-slate-900 font-medium mt-0.5 block">
                {approvedGroup.approvedBy}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">
                Status
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-900 mt-0.5 font-mono">
                {approvedGroup.status}
              </span>
            </div>
          </div>

          {/* Official Team Roster */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-700">
              Team Roster ({approvedGroup.members.length} Members)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {approvedGroup.members.map((m) => {
                const isYou =
                  m.studentId === student.id ||
                  m.studentName.toLowerCase() === student.name.toLowerCase() ||
                  m.rollNumber === student.rollNumber;
                return (
                  <div
                    key={m.studentId}
                    className="p-3 rounded border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-xs shrink-0">
                        {m.studentName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-slate-900 truncate">
                          {m.studentName} {isYou && <span className="text-slate-500 font-normal">(You)</span>}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          Roll {m.rollNumber}
                        </div>
                      </div>
                    </div>

                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 shrink-0">
                      {m.role}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : myCreatedRequest ? (
        /* STATE 2: PENDING PROPOSAL */
        <div className="bg-amber-50/40 border border-amber-200 rounded-lg p-5 space-y-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-white text-amber-800 border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Proposal Pending Review</span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 mt-1">
              {myCreatedRequest.proposedGroupName}
            </h3>
            <p className="text-xs text-slate-600">
              {myCreatedRequest.proposedProjectTitle}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-medium text-slate-600">Proposed Teammates:</span>
            <div className="flex flex-wrap gap-1.5">
              {myCreatedRequest.proposedMembers.map((member, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white text-xs font-mono text-slate-700 border border-amber-200"
                >
                  <Users className="w-3 h-3 text-slate-400" />
                  <span>{member}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* STATE 3: NO GROUP YET -> PROPOSAL FORM */
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900">Propose a Project Group</h3>
            <p className="text-xs text-slate-500">
              Submit your team name, project topic, and invite available classmates from{" "}
              <strong>{section?.sectionName}</strong> for instructor approval.
            </p>
          </div>

          <form onSubmit={handleSubmitProposal} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Proposed Group Name</label>
                <Input
                  value={proposedGroupName}
                  onChange={(e) => setProposedGroupName(e.target.value)}
                  placeholder="e.g. Team ByteForge"
                  className="h-8 text-xs border-slate-200 rounded-md"
                  required
                />
                {/* One-click suggestions */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {SUGGESTED_TEAM_NAMES.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setProposedGroupName(name)}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 font-mono transition-colors"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Proposed Project Title</label>
                <Input
                  value={proposedProjectTitle}
                  onChange={(e) => setProposedProjectTitle(e.target.value)}
                  placeholder="e.g. Autonomous Drone Navigation System"
                  className="h-8 text-xs border-slate-200 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Select Classmates from Section */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                <span>Select Classmates from {section?.sectionName}</span>
                <span className="text-[11px] font-mono text-slate-400">
                  {availableClassmates.length} available
                </span>
              </label>

              {availableClassmates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-md">
                  {availableClassmates.map((cm) => {
                    const isSelected = selectedPartnerIds.includes(cm.id);
                    return (
                      <button
                        type="button"
                        key={cm.id}
                        onClick={() => handleTogglePartner(cm.id)}
                        className={`p-2.5 rounded border text-left text-xs transition-colors flex items-center justify-between ${
                          isSelected
                            ? "bg-slate-100 border-slate-300 text-slate-900 font-medium"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="truncate font-medium">{cm.name}</div>
                          <div className="text-[10px] font-mono text-slate-400">
                            Roll {cm.rollNumber}
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-slate-900 text-white" : "border border-slate-300"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-md text-xs text-slate-500 text-center border border-slate-200">
                  All classmates in this section are currently assigned to project groups.
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 px-4 font-medium rounded-md gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Proposal</span>
            </Button>
          </form>
        </div>
      )}

      {/* SECTION TEAMS MASTER DIRECTORY */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
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
              className="pl-8 text-xs h-8 border-slate-200 rounded-md"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-md">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-slate-200 text-slate-600 font-medium text-[11px] bg-slate-50">
              <tr>
                <th className="py-2.5 px-3">Group Name</th>
                <th className="py-2.5 px-4">Project Topic</th>
                <th className="py-2.5 px-3">Members</th>
                <th className="py-2.5 px-3">Faculty Guide</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredDirectoryGroups.map((g) => {
                const isMyGroup =
                  g.id === approvedGroup?.id || g.members.some((m) => m.studentId === student.id);
                return (
                  <tr
                    key={g.id}
                    className={`transition-colors ${
                      isMyGroup ? "bg-slate-50/80 font-medium" : "hover:bg-slate-50/60"
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{g.groupName}</span>
                        {isMyGroup && (
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-white text-slate-700">
                            Your Team
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 max-w-xs truncate">
                      {g.projectTitle}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {g.members.map((m) => (
                          <span
                            key={m.studentId}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              m.studentId === student.id
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {m.studentName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{g.guide}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
                        {g.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
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