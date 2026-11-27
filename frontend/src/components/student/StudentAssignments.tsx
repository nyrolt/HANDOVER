import React from "react";
import { BookOpen, Calendar, CheckCircle2 } from "lucide-react";
import { db } from "@/services/db";
import type { Student } from "@/types";

interface StudentAssignmentsProps {
  student: Student;
}

export function StudentAssignments({ student }: StudentAssignmentsProps) {
  const section = db.getSectionById(student.sectionId);
  const assignments = db.getAssignments(student.sectionId);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Course Assignments</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Coursework, practical tasks, and deadlines posted for{" "}
              <span className="font-medium text-slate-700">
                {section?.sectionName || "your section"}
              </span>
              .
            </p>
          </div>
        </div>

        <span className="font-mono text-xs px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-slate-700 self-start sm:self-auto tabular-nums">
          {assignments.length} Total Assignments
        </span>
      </div>

      <div className="space-y-4">
        {assignments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400">
            <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-700">
              No assignments posted for your section yet.
            </p>
            <p className="text-xs mt-1">Check back when faculty publishes new coursework.</p>
          </div>
        ) : (
          assignments.map((assignment) => {
            const isClosed = assignment.status === "Closed";

            return (
              <div
                key={assignment.id}
                className="bg-white border border-slate-200 rounded-lg p-5 space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
                        {assignment.subject}
                      </span>
                      <span
                        className={`font-mono text-[10px] font-medium px-2 py-0.5 rounded border ${
                          !isClosed
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mt-2">
                      {assignment.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs self-start shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Due Deadline</div>
                      <div className="font-mono font-medium text-slate-800 tabular-nums">
                        {assignment.deadline}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  <div className="font-semibold text-slate-800 mb-1">
                    Instructions & Problem Statement:
                  </div>
                  <p>{assignment.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <span>
                    Assigned by{" "}
                    <strong className="font-medium text-slate-700">{assignment.createdBy}</strong>
                  </span>
                  <span className="font-normal text-slate-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Syllabus aligned
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
