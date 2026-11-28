import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Upload,
  Clock,
  AlertTriangle,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/services/db";
import { submissionsApi, SubmissionDetailsResponse } from "@/services/submissionsApi";
import { StudentSubmissionModal } from "./StudentSubmissionModal";
import type { Student, Assignment } from "@/types";

interface StudentAssignmentsProps {
  student: Student;
}

export function StudentAssignments({ student }: StudentAssignmentsProps) {
  const section = db.getSectionById(student.sectionId);
  const assignments = db.getAssignments(student.sectionId);

  const [submissions, setSubmissions] = useState<SubmissionDetailsResponse[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await submissionsApi.getSubmissions({ studentId: student.id });
      if (res.success && res.data) {
        setSubmissions(res.data);
      }
    } catch {
      // Offline fallback
    } finally {
      setLoading(false);
    }
  }, [student.id]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const getSubmissionForAssignment = (assignmentId: string) => {
    return submissions.find((s) => (s.assignment_id || s.assignmentId) === assignmentId);
  };

  const openSubmissionModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 tracking-tight">
              Course Assignments & Submissions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Coursework, practical tasks, deadlines, and automated verification status for{" "}
              <span className="font-medium text-slate-700">
                {section?.sectionName || "your section"}
              </span>
              .
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 tabular-nums font-medium">
            {assignments.length} Coursework Tasks
          </span>
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {assignments.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center text-slate-400 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              No assignments posted for your section yet.
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Your instructor has not yet scheduled written problem statements or lab submissions
              for {section?.sectionName || "this section"}.
            </p>
          </div>
        ) : (
          assignments.map((assignment) => {
            const isClosed = assignment.status === "Closed";
            const submission = getSubmissionForAssignment(assignment.id);

            return (
              <div
                key={assignment.id}
                className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 space-y-4 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
                        {assignment.subject}
                      </span>

                      {/* Master status badge */}
                      {submission ? (
                        <span
                          className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1 ${
                            submission.status === "Verified"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : submission.status === "Needs Teacher Review"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : submission.status === "Rejected"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : "bg-indigo-50 text-indigo-700 border-indigo-200"
                          }`}
                        >
                          {submission.status === "Verified" ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : submission.status === "Needs Teacher Review" ? (
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-indigo-600 animate-pulse" />
                          )}
                          {submission.status} (v
                          {submission.submission_version || submission.submissionVersion || 1})
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] font-medium px-2 py-0.5 rounded border bg-slate-100 text-slate-600 border-slate-200">
                          Not Submitted
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mt-2">
                      {assignment.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs self-start shrink-0 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-sans font-medium">
                        Due Date
                      </div>
                      <div className="font-semibold text-slate-800 tabular-nums">
                        {assignment.deadline}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-100 text-xs text-slate-600 leading-relaxed font-mono text-[11.5px]">
                  <div className="font-semibold text-slate-800 mb-1 font-sans">
                    Problem Statement & Deliverables:
                  </div>
                  {assignment.description ||
                    "Submit completed laboratory report and code documentation."}
                </div>

                {/* Submission footer info and CTA button */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    {submission ? (
                      <>
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span>
                          Submitted file:{" "}
                          <span className="font-semibold text-slate-700">
                            {submission.original_filename || submission.originalFilename}
                          </span>
                        </span>
                        {submission.verification_score !== undefined && (
                          <span className="font-mono text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Score: {submission.verification_score}%
                          </span>
                        )}
                      </>
                    ) : (
                      <span>Accepted: PDF, DOCX, TXT, PNG, JPG (Max 25 MB)</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => openSubmissionModal(assignment)}
                      className={
                        submission
                          ? "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 text-xs"
                          : "bg-slate-900 text-white hover:bg-slate-800 text-xs"
                      }
                    >
                      {submission ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                          View Submission & Report
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 mr-1.5" />
                          Upload & Submit
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submission & Verification Modal */}
      {selectedAssignment && (
        <StudentSubmissionModal
          assignment={selectedAssignment}
          student={student}
          existingSubmission={getSubmissionForAssignment(selectedAssignment.id)}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAssignment(null);
          }}
          onSubmissionSuccess={() => {
            loadSubmissions();
          }}
        />
      )}
    </div>
  );
}
