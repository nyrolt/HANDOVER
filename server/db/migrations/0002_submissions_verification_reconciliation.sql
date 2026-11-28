-- ==============================================================================
-- HANDOVER: Migration 0002 — Submissions, Verification, Reconciliation, & Notifications
-- ==============================================================================

-- 1. Assignment Submissions
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Submitted' CHECK (
    status IN (
      'Not Submitted',
      'Uploading',
      'Submitted',
      'Queued for Verification',
      'Scanning',
      'Verified',
      'Needs Teacher Review',
      'Rejected',
      'Resubmission Required',
      'Processing Failed'
    )
  ),
  verification_status TEXT NOT NULL DEFAULT 'Pending' CHECK (
    verification_status IN (
      'Pending',
      'Queued',
      'Scanning',
      'Verified',
      'Needs Review',
      'Invalid File',
      'Failed'
    )
  ),
  teacher_review_status TEXT DEFAULT 'Pending' CHECK (
    teacher_review_status IN ('Pending', 'Approved', 'Rejected', 'Resubmission Requested')
  ),
  teacher_review_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  submission_version INT NOT NULL DEFAULT 1,
  is_latest BOOLEAN NOT NULL DEFAULT true,
  converted_from_format TEXT,
  original_filename TEXT NOT NULL,
  stored_filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  checksum_sha256 TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_submissions_assign_student ON assignment_submissions(assignment_id, student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_section_status ON assignment_submissions(section_id, status);

-- 2. Submission Files (Originals, Converted, Extracted text)
CREATE TABLE IF NOT EXISTS submission_files (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES assignment_submissions(id) ON DELETE CASCADE,
  file_role TEXT NOT NULL CHECK (file_role IN ('original', 'converted', 'extracted_text', 'thumbnail')),
  original_filename TEXT NOT NULL,
  stored_filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  checksum_sha256 TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submission_files_sub_id ON submission_files(submission_id);

-- 3. Verification Jobs (Background Processing Queue)
CREATE TABLE IF NOT EXISTS verification_jobs (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  submission_id TEXT NOT NULL REFERENCES assignment_submissions(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  batch_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (
    status IN ('PENDING', 'QUEUED', 'PROCESSING', 'COMPLETED', 'NEEDS_REVIEW', 'FAILED')
  ),
  attempt_count INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  queue_position INT DEFAULT 0,
  priority INT DEFAULT 0,
  worker_id TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_jobs_status_prio ON verification_jobs(status, priority, created_at);
CREATE INDEX IF NOT EXISTS idx_verification_jobs_batch ON verification_jobs(batch_id);

-- 4. Verification Results
CREATE TABLE IF NOT EXISTS verification_results (
  id TEXT PRIMARY KEY,
  job_id TEXT REFERENCES verification_jobs(id) ON DELETE CASCADE,
  submission_id TEXT NOT NULL REFERENCES assignment_submissions(id) ON DELETE CASCADE,
  overall_status TEXT NOT NULL CHECK (
    overall_status IN ('Verified', 'Needs Teacher Review', 'Invalid File', 'Processing Failed')
  ),
  integrity_status TEXT NOT NULL,
  format_valid BOOLEAN NOT NULL DEFAULT true,
  metadata_findings JSONB DEFAULT '{}'::jsonb,
  text_similarity_findings JSONB DEFAULT '{}'::jsonb,
  image_similarity_findings JSONB DEFAULT '{}'::jsonb,
  warnings JSONB DEFAULT '[]'::jsonb,
  recommendation TEXT,
  confidence_score NUMERIC(5,2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_results_submission ON verification_results(submission_id);

-- 5. Marks Reconciliation Alerts
CREATE TABLE IF NOT EXISTS marks_reconciliation_alerts (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  submission_id TEXT NOT NULL REFERENCES assignment_submissions(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RESOLVED', 'DISMISSED')),
  days_pending INT DEFAULT 0,
  reminder_count INT DEFAULT 0,
  last_reminded_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (submission_id)
);

CREATE INDEX IF NOT EXISTS idx_reconciliation_alerts_sec_status ON marks_reconciliation_alerts(section_id, status);

-- 6. Persistent Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  recipient_user_id TEXT NOT NULL,
  recipient_role TEXT NOT NULL CHECK (recipient_role IN ('teacher', 'student', 'admin')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (
    type IN (
      'submission_received',
      'verification_completed',
      'needs_review',
      'invalid_file',
      'resubmission_required',
      'processing_failed',
      'marks_pending',
      'marks_reconciliation',
      'general'
    )
  ),
  related_assignment_id TEXT,
  related_submission_id TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_user_id, is_read, created_at);
