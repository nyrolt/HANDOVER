import React, { useState } from "react";
import { Bell, Plus, Trash2, Calendar, Megaphone, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/services/db";
import { useAuth } from "@/services/auth";

export function TeacherAnnouncements() {
  const { user } = useAuth();
  const sections = db.getSections();
  const [selectedSectionId, setSelectedSectionId] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetSectionId, setTargetSectionId] = useState(sections[0]?.id || "");
  const [isImportant, setIsImportant] = useState(false);

  const announcements =
    selectedSectionId === "all" ? db.getAnnouncements() : db.getAnnouncements(selectedSectionId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim() || !targetSectionId) return;

    db.createAnnouncement({
      title: title.trim(),
      message: message.trim(),
      sectionId: targetSectionId,
      teacherName: user?.name || "Faculty",
      priority: isImportant ? "important" : "normal",
    });

    setCreateOpen(false);
    setTitle("");
    setMessage("");
    setIsImportant(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this announcement?")) {
      db.deleteAnnouncement(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">Class Announcements</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Broadcast examination schedules, practical deadlines, and project announcements to
            students.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="h-8 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Sections</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.sectionName}
              </option>
            ))}
          </select>

          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 h-8 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Post Announcement
          </Button>
        </div>
      </div>

      <div className="space-y-3.5">
        {announcements.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50/80 border border-amber-100/60 flex items-center justify-center mx-auto mb-4 text-amber-600">
              <Megaphone className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-slate-900 tracking-tight">
              No Broadcast Announcements Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
              Broadcast critical examination timetables, practical syllabus guidelines, and capstone
              milestones directly to student portals.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
              <Button
                size="sm"
                onClick={() => {
                  const targetId =
                    selectedSectionId === "all" ? sections[0]?.id || "" : selectedSectionId;
                  if (targetId) db.populateSampleAnnouncements(targetId);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg h-9 px-4 gap-2 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                <span>⚡ Broadcast Exam Schedule Preset</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCreateOpen(true)}
                className="text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg h-9 px-4 gap-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                <span>Post Announcement</span>
              </Button>
            </div>
          </div>
        ) : (
          announcements.map((ann) => {
            const section = sections.find((s) => s.id === ann.sectionId);
            const date = new Date(ann.createdAt).toLocaleDateString([], {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={ann.id}
                className="bg-white border border-slate-200/90 rounded-xl p-5 hover:border-slate-300 transition-all space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
                        {section?.sectionName || "All Sections"}
                      </span>
                      {ann.priority === "important" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          Urgent Notice
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mt-2">{ann.title}</h3>
                  </div>

                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    title="Delete notice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  {ann.message}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono text-[11px]">
                  <span>
                    Instructor:{" "}
                    <strong className="font-sans text-slate-700">{ann.teacherName}</strong>
                  </span>
                  <span>{date}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Post Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in-50 zoom-in-95">
            <h3 className="text-base font-bold text-slate-800">Post Announcement</h3>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Section
                </label>
                <select
                  value={targetSectionId}
                  onChange={(e) => setTargetSectionId(e.target.value)}
                  className="w-full text-xs h-9 bg-white border border-slate-200 rounded-md px-2 font-medium"
                >
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.sectionName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Announcement Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule for Lab Practical Exam"
                  required
                  className="text-xs h-9"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message Content
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type announcement message..."
                  className="text-xs"
                  rows={4}
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-semibold">Mark as High Priority / Important</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCreateOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post Notice
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
