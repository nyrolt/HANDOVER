import { z } from "zod";

export const CreateSectionSchema = z.object({
  sectionName: z.string().min(1, "Section name is required").max(50, "Section name too long"),
  courseName: z.string().min(1, "Course name is required").max(100, "Course name too long"),
  academicYear: z.string().min(4, "Academic year required").max(20, "Academic year too long"),
  teacherId: z.string().min(1, "Teacher ID is required"),
  institutionId: z.string().optional(),
});

export const CreateStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  rollNumber: z.string().min(1, "Roll number required").max(20, "Roll number too long"),
  sectionId: z.string().min(1, "Section ID required"),
  projectGroupId: z.string().optional(),
  institutionId: z.string().optional(),
});

export const UpdateStudentMarksSchema = z.object({
  internalMarks: z
    .number()
    .int()
    .min(0, "Internal marks cannot be negative")
    .max(20, "Internal marks cannot exceed 20")
    .optional(),
  labRecordMarks: z
    .number()
    .int()
    .min(0, "Lab marks cannot be negative")
    .max(20, "Lab marks cannot exceed 20")
    .optional(),
  practicalMarks: z
    .number()
    .int()
    .min(0, "Practical marks cannot be negative")
    .max(20, "Practical marks cannot exceed 20")
    .optional(),
  projectMarks: z
    .number()
    .int()
    .min(0, "Project marks cannot be negative")
    .max(20, "Project marks cannot exceed 20")
    .optional(),
  assignmentMarks: z
    .number()
    .int()
    .min(0, "Assignment marks cannot be negative")
    .max(20, "Assignment marks cannot exceed 20")
    .optional(),
  maxTotal: z.number().int().min(20).max(200).optional(),
});

export const CreateAssignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150, "Title too long"),
  subject: z.string().min(2, "Subject is required").max(100),
  description: z.string().min(5, "Description must be at least 5 characters").max(2000),
  sectionId: z.string().min(1, "Section ID required"),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Deadline must be YYYY-MM-DD"),
  createdBy: z.string().min(1, "Creator name required"),
  institutionId: z.string().optional(),
});

export const SubmitGroupProposalSchema = z.object({
  studentId: z.string().min(1, "Student ID required"),
  studentName: z.string().min(1, "Student name required"),
  proposedGroupName: z.string().min(2, "Group name must be at least 2 characters").max(60),
  proposedProjectTitle: z.string().min(3, "Project title must be at least 3 characters").max(200),
  proposedMembers: z
    .array(z.string())
    .min(1, "At least one member required")
    .max(10, "Cannot exceed 10 members"),
  sectionId: z.string().min(1, "Section ID required"),
  institutionId: z.string().optional(),
});
