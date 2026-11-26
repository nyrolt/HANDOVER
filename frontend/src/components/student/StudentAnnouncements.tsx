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
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-800">Teacher Announcements</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Important notices and circulars broadcast to {section?.sectionName || "your section"}.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
          {announcements.length} Notices
        </span>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              No announcements posted for your section.
            </p>
            <p className="text-xs mt-1">Check back later for teacher updates.</p>
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
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    {ann.priority === "important" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 mb-1.5 inline-block">
                        High Priority Notice
                      </span>
                    )}
                    <h3 className="text-base font-bold text-slate-800">{ann.title}</h3>
                  </div>

                  <span className="text-xs text-slate-400">{date}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
                  {ann.message}
                </p>

                <div className="text-xs text-slate-400 pt-1">
                  Posted by <strong className="text-slate-600">{ann.teacherName}</strong>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
