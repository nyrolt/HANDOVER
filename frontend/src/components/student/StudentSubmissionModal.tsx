import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  X,
  FileCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { submissionsApi, SubmissionDetailsResponse } from "@/services/submissionsApi";
import type { Assignment, Student } from "@/types";

interface StudentSubmissionModalProps {
  assignment: Assignment;
  student: Student;
  existingSubmission?: SubmissionDetailsResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmissionSuccess: () => void;
}

export function StudentSubmissionModal({
  assignment,
  student,
  existingSubmission,
  isOpen,
  onClose,
  onSubmissionSuccess,
}: StudentSubmissionModalProps) {
  const [activeTab, setActiveTab] = useState<"submit" | "converter" | "details">("submit");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [autoConvert, setAutoConvert] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Converter state
  const [converterFile, setConverterFile] = useState<File | null>(null);
  const [converterBase64, setConverterBase64] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);
  const [convertedResult, setConvertedResult] = useState<{
    convertedFilename: string;
    fileSize: number;
    convertedBase64: string;
    extractedText: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const converterInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    setErrorMsg(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result as string);
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !fileBase64) {
      setErrorMsg("Please select or drop a file first.");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(20);
    setErrorMsg(null);

    const interval = setInterval(() => {
      setUploadProgress((p) => (p < 80 ? p + 20 : p));
    }, 150);

    try {
      const res = await submissionsApi.submitAssignment({
        assignmentId: assignment.id,
        sectionId: student.sectionId,
        filename: selectedFile.name,
        fileBase64,
        autoConvertDocx: autoConvert,
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (res.success) {
        setSuccessMsg("Assignment submitted and queued for verification!");
        setTimeout(() => {
          onSubmissionSuccess();
          onClose();
        }, 1200);
      } else {
        setErrorMsg(res.error || "Submission failed");
      }
    } catch (err: unknown) {
      clearInterval(interval);
      setErrorMsg(err instanceof Error ? err.message : "Submission error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConvertStandalone = async () => {
    if (!converterFile || !converterBase64) return;
    setIsConverting(true);
    setErrorMsg(null);

    try {
      const res = await submissionsApi.convertFile({
        filename: converterFile.name,
        fileBase64: converterBase64,
        targetFormat: "pdf",
      });

      if (res.success && res.data) {
        setConvertedResult(res.data);
      } else {
        setErrorMsg(res.error || "Conversion failed");
      }
    } catch {
      setErrorMsg("Server error during file conversion.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadConverted = () => {
    if (!convertedResult) return;
    const a = document.createElement("a");
    a.href = convertedResult.convertedBase64;
    a.download = convertedResult.convertedFilename;
    a.click();
  };

  const handleAttachConvertedToSubmission = () => {
    if (!convertedResult) return;
    setFileBase64(convertedResult.convertedBase64);
    // Create synthetic File
    setSelectedFile(new File([""], convertedResult.convertedFilename, { type: "application/pdf" }));
    setActiveTab("submit");
    setSuccessMsg("Attached converted PDF to your submission form!");
  };

  const isPastDeadline =
    assignment.deadline && new Date(assignment.deadline).getTime() < Date.now();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                {assignment.subject}
              </span>
              <span
                className={`font-mono text-[10px] font-medium px-2 py-0.5 rounded border ${
                  isPastDeadline
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                {isPastDeadline ? "Past Deadline (Late Mode)" : "Active Submissions Open"}
              </span>
            </div>
            <h2 className="text-xl font-serif font-semibold text-slate-900 mt-2">
              {assignment.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Due Date: <span className="font-semibold text-slate-700">{assignment.deadline}</span>
              {" · "}Max Size: <span className="font-semibold text-slate-700">25 MB</span>
              {" · "}Formats:{" "}
              <span className="font-mono text-slate-700">PDF, DOCX, TXT, PNG, JPG</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 bg-white px-6">
          <button
            onClick={() => setActiveTab("submit")}
            className={`py-3 text-xs font-medium border-b-2 transition-all mr-6 flex items-center gap-2 ${
              activeTab === "submit"
                ? "border-slate-900 text-slate-900 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload & Submit
          </button>

          <button
            onClick={() => setActiveTab("converter")}
            className={`py-3 text-xs font-medium border-b-2 transition-all mr-6 flex items-center gap-2 ${
              activeTab === "converter"
                ? "border-slate-900 text-slate-900 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            File Converter Tool
          </button>

          {existingSubmission && (
            <button
              onClick={() => setActiveTab("details")}
              className={`py-3 text-xs font-medium border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "details"
                  ? "border-slate-900 text-slate-900 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verification Report
            </button>
          )}
        </div>

        {/* Body Container */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: UPLOAD & SUBMIT */}
          {activeTab === "submit" && (
            <div className="space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]"
                    : "border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center mx-auto mb-3 text-slate-700">
                  <Upload className="w-5 h-5 text-indigo-600" />
                </div>

                <div className="text-sm font-semibold text-slate-800">
                  {selectedFile
                    ? selectedFile.name
                    : "Click to browse or drag and drop your file here"}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Supports DOCX, PDF, Plain Text, PNG, or JPG up to 25 MB
                </p>
              </div>

              {/* Selected File Card */}
              {selectedFile && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">
                        {selectedFile.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {(selectedFile.size / 1024).toFixed(1)} KB ·{" "}
                        {selectedFile.type || "Document"}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setFileBase64("");
                    }}
                    className="p-1 rounded text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Auto convert checkbox */}
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={autoConvert}
                  onChange={(e) => setAutoConvert(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Automatically convert DOCX/TXT to verified PDF during submission</span>
              </label>

              {/* Upload Progress Bar */}
              {isSubmitting && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-mono text-slate-500">
                    <span>Transmitting & Verifying...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedFile || isSubmitting}
                  className="bg-slate-900 text-white hover:bg-slate-800"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" /> Submitting...
                    </>
                  ) : (
                    <>
                      Confirm & Submit <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: SMART FILE CONVERTER */}
          {activeTab === "converter" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900">
                <div className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Smart Academic Document
                  Converter
                </div>
                <p className="mt-1 text-slate-600 leading-relaxed text-[11.5px]">
                  Convert Microsoft Word (.docx), Plain Text (.txt), or Scanned Images (.png, .jpg)
                  directly into a standardized, paginated PDF with academic headers and page
                  numbering.
                </p>
              </div>

              <div
                onClick={() => converterInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <input
                  ref={converterInputRef}
                  type="file"
                  className="hidden"
                  accept=".docx,.doc,.txt,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const f = e.target.files[0];
                      setConverterFile(f);
                      const r = new FileReader();
                      r.onload = () => setConverterBase64(r.result as string);
                      r.readAsDataURL(f);
                    }
                  }}
                />
                <div className="text-xs font-semibold text-slate-800">
                  {converterFile
                    ? converterFile.name
                    : "Select DOCX, TXT, or Image file to convert"}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Target format: PDF (.pdf)</div>
              </div>

              {converterFile && (
                <Button
                  onClick={handleConvertStandalone}
                  disabled={isConverting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isConverting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" />
                      Converting Document on Backend...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 mr-2" />
                      Convert to Verified PDF
                    </>
                  )}
                </Button>
              )}

              {convertedResult && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-semibold text-emerald-900">
                        {convertedResult.convertedFilename}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700">
                      {(convertedResult.fileSize / 1024).toFixed(1)} KB
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownloadConverted}
                      className="text-xs bg-white"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Download PDF
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAttachConvertedToSubmission}
                      className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
                    >
                      Attach to My Submission
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VERIFICATION DETAILS */}
          {activeTab === "details" && existingSubmission && (
            <div className="space-y-4">
              {/* Status Header */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-500">Submission Status</div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5 flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        existingSubmission.status === "Verified"
                          ? "bg-emerald-500"
                          : existingSubmission.status === "Needs Teacher Review"
                            ? "bg-amber-500"
                            : "bg-indigo-500"
                      }`}
                    />
                    {existingSubmission.status} (v
                    {existingSubmission.submission_version ||
                      existingSubmission.submissionVersion ||
                      1}
                    )
                  </div>
                </div>

                {existingSubmission.verification_score !== undefined && (
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-mono">Verification Score</div>
                    <div className="text-lg font-bold text-slate-900 tabular-nums">
                      {existingSubmission.verification_score} / 100
                    </div>
                  </div>
                )}
              </div>

              {/* Checks list */}
              {existingSubmission.verification_checks &&
                existingSubmission.verification_checks.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Automated Verification
                      Pipeline Checks
                    </div>

                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                      {existingSubmission.verification_checks.map((chk, idx) => (
                        <div
                          key={idx}
                          className="p-3 text-xs flex items-start justify-between gap-3"
                        >
                          <div className="flex items-start gap-2">
                            {chk.passed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <div className="font-medium text-slate-800">{chk.name}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">{chk.details}</div>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 font-semibold tabular-nums">
                            {chk.score} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Teacher Review Notes Callout */}
              {(existingSubmission.teacher_review_notes ||
                existingSubmission.teacherReviewNotes) && (
                <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 space-y-1">
                  <div className="font-semibold">Instructor Review Feedback:</div>
                  <p className="text-[11.5px] text-purple-800">
                    "
                    {existingSubmission.teacher_review_notes ||
                      existingSubmission.teacherReviewNotes}
                    "
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
