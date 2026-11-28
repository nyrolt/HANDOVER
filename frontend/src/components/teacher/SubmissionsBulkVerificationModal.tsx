import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Play,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Filter,
  Eye,
  X,
  Clock,
  Sparkles,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  submissionsApi,
  SubmissionDetailsResponse,
  QueueProgressResponse,
} from "@/services/submissionsApi";
import type { Assignment } from "@/types";

interface SubmissionsBulkVerificationModalProps {
  assignment: Assignment;
  isOpen: boolean;
  onClose: () => void;
}

export function SubmissionsBulkVerificationModal({
  assignment,
  isOpen,
  onClose,
}: SubmissionsBulkVerificationModalProps) {
  const [submissions, setSubmissions] = useState<SubmissionDetailsResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Queue progress state
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [queueProgress, setQueueProgress] = useState<QueueProgressResponse | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Review modal state
  const [reviewingSubmission, setReviewingSubmission] =
    useState<SubmissionDetailsResponse | null>(null);
  const [reviewStatus, setReviewStatus] = useState<
    "Approved" | "Rejected" | "Resubmission Requested"
  >("Approved");
  const [reviewNotes, setReviewNotes] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const res = await submissionsApi.getSubmissions({ assignmentId: assignment.id });
      if (res.success && res.data) {
        setSubmissions(res.data);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSubmissions();
    }
  }, [isOpen, assignment.id]);

  // Polling queue progress when verifying
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVerifying && activeBatchId) {
      timer = setInterval(async () => {
        const res = await submissionsApi.getQueueProgress(activeBatchId);
        if (res.success && res.data) {
          setQueueProgress(res.data);
          if (res.data.isComplete) {
            setIsVerifying(false);
            loadSubmissions();
          }
        }
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isVerifying, activeBatchId]);

  if (!isOpen) return null;

  const handleTriggerBulkVerification = async () => {
    try {
      setIsVerifying(true);
      const res = await submissionsApi.triggerBulkVerification({
        assignmentId: assignment.id,
      });

      if (res.success && res.data) {
        setActiveBatchId(res.data.batchId);
        setQueueProgress({
          batchId: res.data.batchId,
          total: res.data.queuedCount,
          processed: 0,
          pending: res.data.queuedCount,
          processing: 0,
          verified: 0,
          needsReview: 0,
          failed: 0,
          percent: 0,
          isComplete: false,
        });
      } else {
        setIsVerifying(false);
        alert(res.error || "No submissions available to verify.");
      }
    } catch {
      setIsVerifying(false);
    }
  };

  const handleSaveReview = async () => {
    if (!reviewingSubmission) return;
    try {
      setSubmittingReview(true);
      const res = await submissionsApi.reviewSubmission(reviewingSubmission.id, {
        status: reviewStatus,
        reviewNotes: reviewNotes.trim(),
      });

      if (res.success) {
        setReviewingSubmission(null);
        setReviewNotes("");
        loadSubmissions();
      } else {
        alert(res.error || "Review submission failed.");
      }
    } catch {
      alert("Error submitting review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (activeFilter === "verified" && s.status !== "Verified") return false;
    if (activeFilter === "needs_review" && s.status !== "Needs Teacher Review") return false;
    if (activeFilter === "rejected" && s.status !== "Rejected") return false;
    if (activeFilter === "pending" && s.status !== "Submitted" && s.status !== "Queued for Verification")
      return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const studentName = (s.student_name || s.studentName || "").toLowerCase();
      const rollNumber = (s.roll_number || s.rollNumber || "").toLowerCase();
      const filename = (s.original_filename || s.originalFilename || "").toLowerCase();
      return studentName.includes(q) || rollNumber.includes(q) || filename.includes(q);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                {assignment.subject}
              </span>
              <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                {submissions.length} Total Submissions
              </span>
            </div>
            <h2 className="text-xl font-serif font-semibold text-slate-900 mt-2">
              Submissions & Bulk Verification: {assignment.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated high-throughput document scanning, magic byte verification, plagiarism
              similarity detection, and faculty reviews.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleTriggerBulkVerification}
              disabled={isVerifying || submissions.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" /> Verifying Batch...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 mr-1.5" /> Run Bulk Verification (5 Workers)
                </>
              )}
            </Button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Queue Progress Banner */}
        {queueProgress && (
          <div className="bg-slate-900 text-white p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Background Scanner Concurrency Pool (Batch: {queueProgress.batchId})
                </span>
                <span className="font-semibold text-emerald-400 tabular-nums">
                  {queueProgress.percent}% ({queueProgress.processed} / {queueProgress.total})
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${queueProgress.percent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono shrink-0">
              <span className="text-emerald-400">✓ {queueProgress.verified} Verified</span>
              <span className="text-amber-400">⚠ {queueProgress.needsReview} Need Review</span>
              <span className="text-rose-400">✗ {queueProgress.failed} Failed</span>
            </div>
          </div>
        )}

        {/* Submissions Filter Toolbar */}
        <div className="p-4 px-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Submissions" },
              { id: "verified", label: "Verified" },
              { id: "needs_review", label: "Needs Teacher Review" },
              { id: "pending", label: "Pending Scan" },
              { id: "rejected", label: "Rejected" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  activeFilter === f.id
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student or file..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Submissions Table / Roster */}
        <div className="overflow-y-auto flex-1 p-6">
          {filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No submissions found</p>
              <p className="text-xs text-slate-500 mt-0.5">
                No student files match the selected filter criteria.
              </p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-mono text-xs font-semibold shrink-0">
                      {(sub.roll_number || sub.rollNumber || "0000").substring(0, 4)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {sub.student_name || sub.studentName}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500">
                          ({sub.roll_number || sub.rollNumber})
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-600">
                          v{sub.submission_version || sub.submissionVersion || 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
                        <span className="text-slate-700 font-sans">
                          {sub.original_filename || sub.originalFilename}
                        </span>
                        <span>·</span>
                        <span>{(Number(sub.file_size || sub.fileSize || 0) / 1024).toFixed(1)} KB</span>
                        <span>·</span>
                        <span>
                          {new Date(sub.created_at || sub.createdAt || Date.now()).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Flag notification if similarity breached */}
                      {sub.similarity_metrics?.flagged && (
                        <div className="mt-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Similarity Flag: {(sub.similarity_metrics.maxSimilarity * 100).toFixed(0)}% match with {sub.similarity_metrics.matchedStudentName || "peer submission"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status & Review Action */}
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <span
                        className={`font-mono text-[11px] font-semibold px-2.5 py-1 rounded-full border inline-flex items-center gap-1 ${
                          sub.status === "Verified"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : sub.status === "Needs Teacher Review"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : sub.status === "Rejected"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-indigo-50 text-indigo-700 border-indigo-200"
                        }`}
                      >
                        {sub.status === "Verified" ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : sub.status === "Needs Teacher Review" ? (
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-indigo-600 animate-pulse" />
                        )}
                        {sub.status}
                      </span>
                      {sub.verification_score !== undefined && (
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          Score: {sub.verification_score}/100
                        </div>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReviewingSubmission(sub);
                        setReviewStatus(
                          sub.status === "Needs Teacher Review" ? "Approved" : "Approved",
                        );
                        setReviewNotes(
                          sub.teacher_review_notes || sub.teacherReviewNotes || "",
                        );
                      }}
                      className="text-xs"
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Teacher Review Action Modal */}
        {reviewingSubmission && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-slate-900">
                    Review Submission
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {reviewingSubmission.student_name || reviewingSubmission.studentName} (
                    {reviewingSubmission.roll_number || reviewingSubmission.rollNumber})
                  </p>
                </div>
                <button
                  onClick={() => setReviewingSubmission(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Decision Radio */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Faculty Decision:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "Approved", label: "Approve", color: "hover:border-emerald-500" },
                    { id: "Resubmission Requested", label: "Resubmit", color: "hover:border-amber-500" },
                    { id: "Rejected", label: "Reject", color: "hover:border-rose-500" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setReviewStatus(opt.id as any)}
                      className={`text-xs py-2 px-1 rounded-lg border font-medium text-center transition-all ${
                        reviewStatus === opt.id
                          ? "bg-slate-900 text-white border-slate-900 font-semibold"
                          : "bg-slate-50 text-slate-700 border-slate-200 " + opt.color
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Feedback Notes for Student:
                </label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Provide guidance, required revisions, or reasons for decision..."
                  className="text-xs h-24"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setReviewingSubmission(null)}
                  disabled={submittingReview}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveReview}
                  disabled={submittingReview}
                  className="bg-slate-900 text-white hover:bg-slate-800 text-xs"
                >
                  {submittingReview ? "Saving..." : "Submit Review Decision"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
