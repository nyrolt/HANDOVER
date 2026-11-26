import React from "react";
import {
  Award,
  Lock,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Calendar,
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
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-slate-700" />
            <h2 className="text-base font-semibold text-slate-900">
              Academic Marksheet & Transcript
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Continuous comprehensive assessment verified by course instructors and academic board.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/60 text-xs font-medium text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>Official verified transcript</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-8 px-3 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 rounded-lg"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print transcript</span>
          </Button>
        </div>
      </div>

      {/* Main Grade Summary Certificate Box */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60 text-[11px] font-medium">
              <span>Section: {section?.sectionName || "General CS"}</span>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900">{student.name}</h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="font-mono text-slate-700 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                  Roll no: {student.rollNumber}
                </span>
                <span>•</span>
                <span>{section?.courseName || "Computer Science & Engineering"}</span>
                <span>•</span>
                <span>Academic year: {section?.academicYear || "2026-2027"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 self-start lg:self-auto">
            <div>
              <div className="text-[10px] uppercase font-medium text-slate-500">
                Cumulative score
              </div>
              <div className="text-2xl font-semibold text-slate-900 font-mono mt-0.5 tabular-nums">
                {total}
                <span className="text-sm font-normal text-slate-400 font-sans"> / {maxTotal}</span>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-200 mx-1" />

            <div className="text-left">
              <div className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-mono font-medium">
                {percentage}% Score
              </div>
              <div className="text-xs font-medium text-slate-700 mt-1 font-mono">{grade}</div>
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
              className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl p-5 shadow-xs transition-all space-y-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg border border-slate-200/60 bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{c.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{c.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                  <div className="text-base font-semibold text-slate-900 font-mono tabular-nums">
                    {c.score}
                    <span className="text-xs font-normal text-slate-400">/{c.max}</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">{c.weightage}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 pt-1">
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-slate-900 transition-all duration-300"
                    style={{ width: `${compPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Performance rating</span>
                  <span className="font-mono tabular-nums text-slate-700">{compPct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Verified Authorization Footer Stamp */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Authorized & Recorded by <strong>{teacher?.name || "Department Faculty"}</strong>
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
