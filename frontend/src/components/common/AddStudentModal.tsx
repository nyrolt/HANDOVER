import React, { useState } from "react";
import { UserPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/services/db";

interface AddStudentModalProps {
  open: boolean;
  onClose: () => void;
  defaultSectionId?: string | undefined;
  onSuccess?: (() => void) | undefined;
}

export function AddStudentModal({
  open,
  onClose,
  defaultSectionId,
  onSuccess,
}: AddStudentModalProps) {
  const sections = db.getSections();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [sectionId, setSectionId] = useState(defaultSectionId || sections[0]?.id || "");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNumber.trim() || !sectionId) return;

    const studentEmail = email.trim() || `${name.toLowerCase().replace(/\s+/g, ".")}@college.edu`;

    db.addStudent({
      name: name.trim(),
      email: studentEmail,
      rollNumber: rollNumber.trim(),
      sectionId,
    });

    setName("");
    setEmail("");
    setRollNumber("");
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in-50 zoom-in-95">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60 flex items-center justify-center">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Add new student</h3>
            <p className="text-xs text-slate-500">
              Enroll student and initialize academic marks sheet.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Roll number</label>
              <Input
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 09"
                required
                className="text-xs h-8 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Target section
              </label>
              <select
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                className="w-full text-xs h-8 bg-white border border-slate-200 rounded-md px-2 font-medium text-slate-800"
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.sectionName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Full student name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vikram Seth"
              required
              className="text-xs h-8"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              College email address (optional)
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vikram@college.edu"
              className="text-xs h-8"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Auto-generated if left blank.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs h-8 rounded-lg">
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 px-3.5 rounded-lg font-medium"
            >
              Enroll student
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
