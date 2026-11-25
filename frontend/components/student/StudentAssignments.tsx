import React from "react";
import { BookOpen, Calendar, Clock, CheckCircle2 } from "lucide-react";
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
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">My Course Assignments</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            View course assignments, practical problems, and deadlines posted by your teacher for{" "}
            {section?.sectionName || "your section"}.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
          {assignments.length} Total Assignments
        </span>
      </div>

      <div className="space-y-4">
        {assignments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
            <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              No assignments posted for your section yet.
            </p>
            <p className="text-xs mt-1">Check back when your teacher publishes new coursework.</p>
          </div>
        ) : (
          assignments.map((assignment) => {
            const isClosed = assignment.status === "Closed";

            return (
              <div
                key={assignment.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {assignment.subject}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          !isClosed
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mt-2">{assignment.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs self-start shrink-0">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        Due Deadline
                      </div>
                      <div className="font-semibold text-slate-700">{assignment.deadline}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/60 p-3.5 rounded-lg border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  <div className="font-semibold text-slate-700 mb-1">
                    Instructions & Problem Statement:
                  </div>
                  <p>{assignment.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Assigned by {assignment.createdBy}</span>
                  <span className="font-medium text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized with syllabus
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
