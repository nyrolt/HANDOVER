import React, { useState } from "react";
import { Bell, Plus, Trash2, Calendar, Megaphone, Send } from "lucide-react";
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
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-700" />
            <h2 className="text-base font-semibold text-slate-900">Class Announcements</h2>
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
            className="h-8 px-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="all">All sections</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.sectionName}
              </option>
            ))}
          </select>

          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5 h-8 px-3 rounded-lg shadow-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Post announcement
          </Button>
        </div>
      </div>

      <div className="space-y-3.5">
        {announcements.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-700">No announcements posted yet.</p>
            <p className="text-xs text-slate-500 mt-1">
              Click "Post announcement" to broadcast to your students.
            </p>
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
                className="bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
                        {section?.sectionName || "General"}
                      </span>
                      {ann.priority === "important" && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/60 font-mono">
                          Important Notice
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mt-2">{ann.title}</h3>
                  </div>

                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Delete notice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  {ann.message}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Posted by {ann.teacherName}</span>
                  <span className="font-mono text-slate-400">{date}</span>
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
            <h3 className="text-base font-semibold text-slate-900">Post Announcement</h3>
            <p className="text-xs text-slate-500 mt-1">Broadcast notice or examination schedule to students.</p>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target Section
                </label>
                <select
                  value={targetSectionId}
                  onChange={(e) => setTargetSectionId(e.target.value)}
                  className="w-full text-xs h-8 bg-white border border-slate-200 rounded-lg px-2.5 font-medium text-slate-800 focus:outline-none focus:border-slate-400"
                >
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.sectionName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Announcement Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule for Lab Practical Exam"
                  required
                  className="text-xs h-8 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Message Content
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type announcement message..."
                  className="text-xs rounded-lg"
                  rows={4}
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="rounded text-slate-900 focus:ring-slate-900 accent-slate-900"
                />
                <span className="font-medium">Mark as High Priority / Important</span>
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
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5 h-8 px-3 rounded-lg font-medium"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post notice
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
