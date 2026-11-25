import React from "react";
import { UserCheck, Mail, Hash, BookOpen, Calendar, ShieldCheck } from "lucide-react";
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
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-800">
            Student Profile & Academic Registration
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Your official college institutional record and enrolled batch details.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6 max-w-2xl">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
            {student.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{student.name}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{student.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Student
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-400 font-medium">Roll Number</div>
            <div className="text-base font-bold text-slate-800 font-mono mt-1">
              {student.rollNumber}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-400 font-medium">Assigned Section</div>
            <div className="text-base font-bold text-slate-800 mt-1">
              {section?.sectionName || "N/A"}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-400 font-medium">Department / Degree</div>
            <div className="text-sm font-bold text-slate-800 mt-1">
              {section?.courseName || "Engineering"}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-400 font-medium">Academic Year</div>
            <div className="text-sm font-bold text-slate-800 mt-1">
              {section?.academicYear || "2026-2027"}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 sm:col-span-2">
            <div className="text-slate-400 font-medium">Official Project Group</div>
            <div className="text-sm font-bold text-slate-800 mt-1">
              {group
                ? `${group.groupName} — "${group.projectTitle}"`
                : "Not yet assigned to an official group"}
            </div>
          </div>
        </div>

        <div className="bg-indigo-50/60 p-4 rounded-lg border border-indigo-100 flex items-center gap-2 text-xs text-indigo-900">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            Profile records are managed by the academic administration office. Contact your
            department advisor for corrections.
          </span>
        </div>
      </div>
    </div>
  );
}
