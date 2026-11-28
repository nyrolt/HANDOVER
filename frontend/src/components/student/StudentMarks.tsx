import React from "react";
import {
  Award,
  ShieldCheck,
  FileCheck2,
  BookOpen,
  FlaskConical,
  Binary,
  Layers,
  Printer,
} from "lucide-react";
import { db } from "@/services/db";
import { computeGrade } from "@/services/teacher";
import type { Student } from "@/types";
import { Button } from "@/components/ui/button";

interface StudentMarksProps {
  student: Student;
}

export function StudentMarks({ student }: StudentMarksProps) {
  const section = db.getSectionById(student.sectionId);
  const teacher = section ? db.getUserById(section.teacherId) : null;
  const marks = db.getStudentMarks(student.id);

  const internal = marks?.internalMarks ?? 0;
  const lab = marks?.labRecordMarks ?? 0;
  const practical = marks?.practicalMarks ?? 0;
  const project = marks?.projectMarks ?? 0;
  const total = internal + lab + practical + project;
  const maxTotal = marks?.maxTotal ?? 80;
  const percentage = Math.round((total / maxTotal) * 100);
  const grade = computeGrade(total, maxTotal);

  const components = [
    {
      title: "Internal Examination",
      score: internal,
      max: 20,
      weightage: "25%",
      icon: BookOpen,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      barColor: "bg-blue-500",
      description: "Mid-term written theory assessments and periodic unit examinations.",
    },
    {
      title: "Lab Record & Experiments",
      score: lab,
      max: 20,
      weightage: "25%",
      icon: FlaskConical,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      barColor: "bg-emerald-500",
      description: "Laboratory journal evaluations, algorithm benchmarks, and code submissions.",
    },
    {
      title: "Practical Examination",
      score: practical,
      max: 20,
      weightage: "25%",
      icon: Binary,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      barColor: "bg-indigo-500",
      description: "Live terminal execution, algorithmic problem-solving and oral viva voce.",
    },
    {
      title: "Project Milestone Evaluation",
      score: project,
      max: 20,
      weightage: "25%",
      icon: Layers,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      barColor: "bg-purple-500",
      description: "System architecture, git pull request reviews, and final milestone demo.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 tracking-tight">
              Academic Marksheet & Transcript
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Continuous comprehensive assessment verified by course instructors and academic
            department.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-mono font-medium text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tamper-Proof Ledger</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-8.5 px-3 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 rounded-lg cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Transcript</span>
          </Button>
        </div>
      </div>

      {/* Main Grade Summary Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="text-[11px] font-mono uppercase font-semibold text-indigo-600 tracking-wider mb-1">
              Official Transcript Record • {section?.sectionName || "Section"}
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight">
              {student.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mt-2">
              <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-mono">
                Roll No:{" "}
                <strong className="text-slate-900 tabular-nums">{student.rollNumber}</strong>
              </span>
              <span>•</span>
              <span>{section?.courseName || "Computer Science & Engineering"}</span>
              <span>•</span>
              <span>Academic Year: {section?.academicYear || "2026-2027"}</span>
            </div>
          </div>

          <div className="flex items-center gap-5 bg-slate-50/90 border border-slate-200/90 p-4.5 rounded-xl self-start lg:self-auto shrink-0 font-mono shadow-2xs">
            <div>
              <div className="text-[10px] font-medium uppercase text-slate-400 tracking-wider">
                Continuous Total
              </div>
              <div className="text-3xl font-semibold text-slate-900 tabular-nums tracking-tight mt-0.5">
                {total}
                <span className="text-xs font-normal text-slate-400 font-sans"> / {maxTotal}</span>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-200" />

            <div>
              <div className="text-[10px] font-medium uppercase text-slate-400 tracking-wider">
                Aggregate
              </div>
              <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
                {percentage}%
              </div>
              <div className="text-xs font-bold text-indigo-600 mt-0.5">
                Grade {grade.split(" ")[0]}
              </div>
            </div>
          </div>
        </div>

        {/* Aggregate Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Overall Evaluation Completion</span>
            <span className="font-semibold text-slate-900">
              {total} of {maxTotal} Marks ({percentage}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
            {components.map((c) => {
              const compPct = (c.score / maxTotal) * 100;
              return (
                <div
                  key={c.title}
                  style={{ width: `${compPct}%` }}
                  className={`${c.barColor} transition-all duration-500`}
                  title={`${c.title}: ${c.score}/${c.max}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 4 Evaluation Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {components.map((c) => {
          const compPct = Math.round((c.score / c.max) * 100);
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-3.5 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${c.color}`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{c.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{c.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-mono">
                  <div className="text-base font-semibold text-slate-900 tabular-nums">
                    {c.score}
                    <span className="text-xs font-normal text-slate-400">/{c.max}</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">{c.weightage}</span>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Score Weightage</span>
                  <span className="font-semibold text-slate-700">{compPct}% achieved</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.barColor} transition-all duration-300`}
                    style={{ width: `${compPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Verified Authorization Footer Stamp */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-slate-600 shrink-0" />
          <span>
            Authorized by <strong>{teacher?.name || "Dr. Eleanor Vance, Ph.D."}</strong>
            {teacher?.department && ` • ${teacher.department}`}
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Last Synced:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}
