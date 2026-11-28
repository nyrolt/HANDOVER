-- ==============================================================================
-- HANDOVER: PostgreSQL Schema for Supabase
-- Run this in Supabase Dashboard -> SQL Editor -> New Query
-- ==============================================================================

-- 1. Create Institutions table
CREATE TABLE IF NOT EXISTS institutions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 2. Create Users table (Teachers, Students, Admins)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'student', 'admin')),
  department TEXT,
  roll_number TEXT,
  section_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 3. Create Sections table
CREATE TABLE IF NOT EXISTS sections (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 4. Create Students table
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  email TEXT NOT NULL,
  project_group_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(section_id, roll_number)
);

-- 5. Create Continuous Evaluation Marks table
CREATE TABLE IF NOT EXISTS marks (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  internal_marks NUMERIC(5,2) DEFAULT 0 CHECK (internal_marks >= 0 AND internal_marks <= 20),
  lab_record_marks NUMERIC(5,2) DEFAULT 0 CHECK (lab_record_marks >= 0 AND lab_record_marks <= 20),
  practical_marks NUMERIC(5,2) DEFAULT 0 CHECK (practical_marks >= 0 AND practical_marks <= 20),
  project_marks NUMERIC(5,2) DEFAULT 0 CHECK (project_marks >= 0 AND project_marks <= 20),
  total NUMERIC(5,2) GENERATED ALWAYS AS (internal_marks + lab_record_marks + practical_marks + project_marks) STORED,
  max_total NUMERIC(5,2) DEFAULT 80,
  updated_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(student_id)
);

-- 6. Create Coursework & Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  deadline TEXT NOT NULL,
  created_by TEXT NOT NULL,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 7. Create Project Groups table
CREATE TABLE IF NOT EXISTS project_groups (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  group_name TEXT NOT NULL,
  project_title TEXT NOT NULL,
  project_description TEXT,
  guide TEXT NOT NULL,
  project_marks NUMERIC(5,2) DEFAULT 0 CHECK (project_marks >= 0 AND project_marks <= 20),
  max_project_marks NUMERIC(5,2) DEFAULT 20,
  status TEXT DEFAULT 'In Progress' CHECK (status IN ('In Progress', 'Pending Review', 'Completed', 'Approved')),
  approved_by TEXT NOT NULL,
  members JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 8. Create Group Proposals / Requests table
CREATE TABLE IF NOT EXISTS group_requests (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  section_id TEXT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  proposed_group_name TEXT NOT NULL,
  proposed_project_title TEXT NOT NULL,
  proposed_members JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'important')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Create Audit Logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  institution_id TEXT,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Institution and Seed Section
INSERT INTO institutions (id, name, code)
VALUES ('inst-college-1', 'College of Computer Science & Engineering', 'CSE-ENG')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sections (id, institution_id, section_name, course_name, academic_year, teacher_id)
VALUES ('sec-a', 'inst-college-1', 'A (CSE)', 'Computer Science & Engineering', '2026-2027', 'prof-vance')
ON CONFLICT (id) DO NOTHING;
