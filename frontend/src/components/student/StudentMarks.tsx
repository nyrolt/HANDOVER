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
      description: "Mid-term written theory assessments and periodic unit examinations.",
    },
    {
      title: "Lab Record & Experiments",
      score: lab,
      max: 20,
      weightage: "25%",
      icon: FlaskConical,
      description: "Laboratory journal evaluations, algorithm benchmarks, and code submissions.",
    },
    {
      title: "Practical Examination",
      score: practical,
      max: 20,
      weightage: "25%",
      icon: Binary,
      description: "Live terminal execution, algorithmic problem-solving and oral viva voce.",
    },
    {
      title: "Project Milestone Evaluation",
      score: project,
      max: 20,
      weightage: "25%",
      icon: Layers,
      description: "System architecture, git pull request reviews, and final milestone demo.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-semibold text-slate-900">
              Academic Marksheet & Transcript
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Continuous comprehensive assessment verified by course instructors and academic department.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-xs font-mono font-medium text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>Official Record</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-8 px-3 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 rounded-md"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Transcript</span>
          </Button>
        </div>
      </div>

      {/* Main Grade Summary Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">
              Official Grade Record • {section?.sectionName || "Section"}
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              {student.name}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
              <span>
                Roll Number: <strong className="text-slate-900 font-mono tabular-nums">{student.rollNumber}</strong>
              </span>
              <span>•</span>
              <span>{section?.courseName || "Computer Science & Engineering"}</span>
              <span>•</span>
              <span>Academic Year: {section?.academicYear || "2026-2027"}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-lg self-start lg:self-auto shrink-0 font-mono">
            <div>
              <div className="text-[10px] font-medium uppercase text-slate-400">
                Cumulative Score
              </div>
              <div className="text-2xl font-semibold text-slate-900 tabular-nums">
                {total}
                <span className="text-xs font-normal text-slate-400 font-sans">
                  {" "}
                  / {maxTotal}
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <div>
              <div className="text-[10px] font-medium uppercase text-slate-400">
                Percentage
              </div>
              <div className="text-sm font-semibold text-slate-900 tabular-nums">
                {percentage}%
              </div>
              <div className="text-[11px] font-medium text-slate-600 mt-0.5">
                Grade {grade.split(" ")[0]}
              </div>
            </div>
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
              className="bg-white border border-slate-200 rounded-lg p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{c.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{c.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 font-mono">
                  <div className="text-base font-semibold text-slate-900 tabular-nums">
                    {c.score}
                    <span className="text-xs font-normal text-slate-400">/{c.max}</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">
                    {c.weightage}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 pt-1">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-slate-800 transition-all duration-300"
                    style={{ width: `${compPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Component rating</span>
                  <span className="font-medium text-slate-700 tabular-nums">{compPct}%</span>
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
