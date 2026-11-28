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
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 tracking-tight">
              Course Assignments
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Coursework, practical tasks, and deadlines posted for{" "}
              <span className="font-medium text-slate-700">
                {section?.sectionName || "your section"}
              </span>
              .
            </p>
          </div>
        </div>

        <span className="font-mono text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 self-start sm:self-auto tabular-nums font-medium">
          {assignments.length} Coursework Tasks
        </span>
      </div>

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
                  <p>{assignment.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <span>
                    Faculty:{" "}
                    <strong className="font-medium text-slate-800">{assignment.createdBy}</strong>
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    Max Score: 20 Marks (Internal Scale)
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
