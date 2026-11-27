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
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Add New Student</h3>
            <p className="text-xs text-slate-500">
              Enroll student and initialize academic marks sheet.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number</label>
              <Input
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 09"
                required
                className="text-xs h-9"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Section
              </label>
              <select
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                className="w-full text-xs h-9 bg-white border border-slate-200 rounded-md px-2 font-medium"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Student Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vikram Seth"
              required
              className="text-xs h-9"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              College Email Address (Optional)
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vikram@college.edu"
              className="text-xs h-9"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Auto-generated if left blank.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
            >
              Enroll Student
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
