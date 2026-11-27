import React from "react";
import { UserCheck, ShieldCheck } from "lucide-react";
import { db } from "@/services/db";
import type { Student } from "@/types";

interface StudentProfileProps {
  student: Student;
}

export function StudentProfile({ student }: StudentProfileProps) {
  const section = db.getSectionById(student.sectionId);
  const group = db
    .getProjectGroups(student.sectionId)
    .find(
      (g) => g.id === student.projectGroupId || g.members.some((m) => m.studentId === student.id),
    );

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Student Profile</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official college institutional record and enrolled batch details.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 max-w-2xl">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
          <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center text-xl font-semibold shrink-0">
            {student.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">{student.name}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{student.email}</p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Student
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200">
            <div className="text-slate-500 font-medium">Roll Number</div>
            <div className="text-sm font-semibold text-slate-900 font-mono tabular-nums mt-1">
              {student.rollNumber}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200">
            <div className="text-slate-500 font-medium">Assigned Section</div>
            <div className="text-sm font-semibold text-slate-900 mt-1">
              {section?.sectionName || "N/A"}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200">
            <div className="text-slate-500 font-medium">Department / Degree</div>
            <div className="text-sm font-semibold text-slate-900 mt-1">
              {section?.courseName || "Engineering"}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200">
            <div className="text-slate-500 font-medium">Academic Year</div>
            <div className="text-sm font-semibold text-slate-900 font-mono tabular-nums mt-1">
              {section?.academicYear || "2026-2027"}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200 sm:col-span-2">
            <div className="text-slate-500 font-medium">Official Project Group</div>
            <div className="text-sm font-semibold text-slate-900 mt-1">
              {group
                ? `${group.groupName} — "${group.projectTitle}"`
                : "Not yet assigned to an official group"}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>
            Profile records are managed by the academic administration office. Contact your
            department advisor for corrections.
          </span>
        </div>
      </div>
    </div>
  );
}
