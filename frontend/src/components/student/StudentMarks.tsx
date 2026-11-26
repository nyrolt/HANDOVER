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
  Sparkles,
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
      iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
      progressGradient: "from-indigo-600 to-violet-600",
      description: "Mid-term written theory assessments and periodic unit examinations.",
    },
    {
      title: "Lab Record & Experiments",
      score: lab,
      max: 20,
      weightage: "25%",
      icon: FlaskConical,
      iconBg: "bg-sky-50 text-sky-600 border-sky-100",
      progressGradient: "from-sky-500 to-blue-600",
      description: "Laboratory journal evaluations, algorithm benchmarks, and code submissions.",
    },
    {
      title: "Practical Examination",
      score: practical,
      max: 20,
      weightage: "25%",
      icon: Binary,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      progressGradient: "from-emerald-500 to-teal-600",
      description: "Live terminal execution, algorithmic problem-solving and oral viva voce.",
    },
    {
      title: "Project Milestone Evaluation",
      score: project,
      max: 20,
      weightage: "25%",
      icon: Layers,
      iconBg: "bg-purple-50 text-purple-600 border-purple-100",
      progressGradient: "from-purple-500 to-pink-600",
      description: "System architecture, git pull request reviews, and final milestone demo.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xs shadow-indigo-600/30">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Academic Marksheet & Transcript
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Continuous comprehensive assessment verified by course instructors and academic board.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Verified Transcript</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-9 px-3 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Transcript</span>
          </Button>
        </div>
      </div>

      {/* Main Grade Summary Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-7 shadow-lg shadow-indigo-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 border border-white/15 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Section: {section?.sectionName || "General CS"}</span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{student.name}</h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1 font-medium">
                <span className="font-mono text-indigo-300 font-semibold bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  Roll No: {student.rollNumber}
                </span>
                <span>•</span>
                <span>{section?.courseName || "Computer Science & Engineering"}</span>
                <span>•</span>
                <span>Year: {section?.academicYear || "2026-2027"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 self-start lg:self-auto">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                Cumulative Score
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-0.5 tracking-tight">
                {total}
                <span className="text-base font-normal text-slate-400 font-sans">
                  {" "}
                  / {maxTotal}
                </span>
              </div>
            </div>

            <div className="h-10 w-px bg-white/20 mx-1" />

            <div className="text-left">
              <div className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                {percentage}% Score
              </div>
              <div className="text-xs font-bold text-white mt-1">{grade}</div>
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
              className="bg-white border border-slate-200/80 hover:border-indigo-200 rounded-2xl p-5 shadow-xs transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${c.iconBg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight">{c.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{c.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <div className="text-lg font-black text-slate-900 font-mono">
                    {c.score}
                    <span className="text-xs font-normal text-slate-400">/{c.max}</span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">
                    {c.weightage}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-1">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-[1px]">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${c.progressGradient} transition-all duration-500`}
                    style={{ width: `${compPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Performance Rating</span>
                  <span className="font-bold text-slate-700">{compPct}% of Max</span>
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
            Authorized & Recorded by <strong>{teacher?.name || "Dr. Eleanor Vance, Ph.D."}</strong>
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
