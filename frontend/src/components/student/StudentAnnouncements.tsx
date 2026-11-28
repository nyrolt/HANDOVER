import React from "react";
import { Bell, Calendar, Megaphone } from "lucide-react";
import { db } from "@/services/db";
import type { Student } from "@/types";

interface StudentAnnouncementsProps {
  student: Student;
}

export function StudentAnnouncements({ student }: StudentAnnouncementsProps) {
  const section = db.getSectionById(student.sectionId);
  const announcements = db.getAnnouncements(student.sectionId);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Bell className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-normal text-slate-900 tracking-tight">
              Teacher Announcements
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Important notices and circulars broadcast to {section?.sectionName || "your section"}.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 self-start sm:self-auto tabular-nums">
          {announcements.length} Official Bulletins
        </span>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center text-slate-400 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Bell className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              No announcements posted for your section.
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Check back later for teacher updates, schedule notifications, and practical syllabus
              announcements.
            </p>
          </div>
        ) : (
          announcements.map((ann) => {
            const date = new Date(ann.createdAt).toLocaleDateString([], {
              month: "long",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={ann.id}
                className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 space-y-3.5 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    {ann.priority === "important" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        High Priority Notice
                      </span>
                    )}
                    <h3 className="text-base font-semibold text-slate-900">{ann.title}</h3>
                  </div>

                  <span className="text-xs font-mono text-slate-400">{date}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
                  {ann.message}
                </p>

                <div className="text-xs text-slate-400 pt-1 font-mono text-[11px]">
                  Instructor:{" "}
                  <strong className="font-sans text-slate-700">{ann.teacherName}</strong>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
