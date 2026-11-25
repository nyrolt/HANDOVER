# Handover — System Design Specification

## 1. Problem Statement

Academic instructors currently manage student rosters, lab assignments, project groups, and continuous evaluation marks across disparate, unversioned Excel spreadsheets. This leads to:

- Frequent calculation errors and out-of-sync grades.
- Lack of visibility for students regarding upcoming submission deadlines and official project group rosters.
- Accidental disclosure of private student marks to peers.
- Tedious manual consolidation of data across multiple sections.

**Handover** delivers a unified, digital spreadsheet-first workspace designed specifically for college departments. Teachers gain a fast, Excel-like inline management interface with automatic recalculation, while students access a secure, read-only portal to view their coursework, track verified scores, and submit collaborative group project proposals.

---

## 2. User Roles & Personas

| Role                  | Description                                                                      | Core Capabilities                                                                                                                                                                         |
| :-------------------- | :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Teacher / Faculty** | Administrative instructor responsible for one or more course sections.           | Create & manage sections, inline edit student marks, auto-compute totals, create/assign coursework, approve/reject student project group proposals, export CSVs, broadcast announcements. |
| **Student**           | Enrolled undergraduate/graduate student assigned to a specific academic section. | View section schedule, view deadlines & assignment guidelines, view private continuous evaluation marks (strictly read-only), propose project groups, view team status.                   |
| **System Admin**      | Institutional IT administrator.                                                  | Configure institution profile, academic terms, and audit system health.                                                                                                                   |

---

## 3. Core User Workflows

### 3.1. Spreadsheet-First Student & Marks Management (Teacher)

1. Teacher selects an academic section (`CSE - Section A`).
2. Roster loads in a high-density, Excel-like table with frozen Roll Number and Student Name columns.
3. Teacher clicks any mark cell (`Internal`, `Lab`, `Practical`, `Project`), edits inline, and navigates seamlessly using <kbd>Tab</kbd> and <kbd>Enter</kbd>.
4. Total score, percentage, and letter grade recalculate in real-time.
5. System validates that marks never fall below 0 or exceed the maximum allocation (default 20).
6. Changes are auto-persisted with a non-intrusive save confirmation indicator.
7. Data can be exported to CSV or batch imported from CSV.

### 3.2. Group Project Formation & Authorization (Dual Interaction)

1. **Student Initiation**: Unassigned student in a section proposes a group name, project title, and selects unassigned peers from their section.
2. **Pending Queue**: Proposal is routed to the section teacher's pending approval list.
3. **Teacher Decision**: Teacher reviews proposal details, optionally amends title or guide, and clicks **Approve** (which creates the official group and links members) or **Reject** (with optional feedback).
4. **Milestone Scoring**: Teacher updates project milestone scores (/20) directly within the group manager.

### 3.3. Coursework & Assignment Tracking

1. Teacher publishes an assignment specifying title, subject, target section, submission deadline, and problem instructions.
2. Students in that section see active assignments highlighted with status (`Active` / `Closed`) and upcoming countdowns.

### 3.4. Secure Student Academic Review

1. Student logs into their portal.
2. Student views their own cumulative standing, component breakdowns, grade, and feedback.
3. **Authorization Boundary**: Service rejects any attempt by a student to fetch another student's marks or mutate any academic record.

---

## 4. Multi-Tenancy Model

Handover enforces hierarchical multi-tenancy:

```
Institution (Tenant: College / University)
 └── Departments (Computer Science, Information Technology)
      └── Sections (CSE-A, CSE-B, IT-A)
           ├── Students (Roster)
           ├── Continuous Marks (Scoped to Student + Section)
           ├── Project Groups (Scoped to Section)
           ├── Assignments (Scoped to Section)
           └── Announcements (Scoped to Section)
```

- Every resource is strictly tagged with `institution_id` and `section_id`.
- Queries are always scoped by the active tenant context.
- Cross-section and cross-institution queries result in immediate `404 Not Found` (to avoid resource enumeration).

---

## 5. Data Classification & Privacy

| Data Category                             | Examples                                                         | Sensitivity             | Controls & Protections                                                                                 |
| :---------------------------------------- | :--------------------------------------------------------------- | :---------------------- | :----------------------------------------------------------------------------------------------------- |
| **Student Private Academic Records**      | Internal marks, practical scores, total GPA, transcripts         | **High (Confidential)** | Scoped strictly to the specific student and section faculty. Read-only to student. No peer disclosure. |
| **Identity & Authentication**             | Email, hashed credentials, session tokens                        | **High (Restricted)**   | Never returned in public payloads. Excluded from client-side bundle and logging.                       |
| **Public / Section Academic Information** | Section schedule, assignment descriptions, approved group titles | **Low / Internal**      | Visible to all verified students within that specific section.                                         |

---

## 6. Non-Functional Requirements (NFRs)

- **Performance**:
  - Spreadsheet cell mutation response: $\le 50\text{ ms}$ (optimistic local update).
  - Page load p95: $< 500\text{ ms}$.
- **Availability & Resilience**:
  - Target: 99.9% uptime during academic semesters.
  - Zero data loss on unexpected network disruption via client-side state recovery and persistent storage.
- **Security & Compliance**:
  - FERPA / DPDP compliant data isolation.
  - Centralized authorization check `can(user, action, resource)` on all mutations.
  - Input boundary validation with Zod schemas.
  - Zero sensitive secrets in client-side code.

---

## 7. Out-of-Scope Items (Guarding against Scope Creep)

To keep the application simple, minimal, and fast, the following are explicitly **out of scope**:

- Direct peer-to-peer chat or video conferencing (handled by institutional LMS/Zoom/Slack).
- Complex payment processing or tuition fee collection.
- Automated AI plagiarism detection without external API integration.
- Custom drag-and-drop report builders with nested SQL query editors.

---

## 8. Back-of-the-Envelope Capacity Estimation (Year One)

- **Estimated Scale**:
  - 10 Institutions, 500 Faculty members, 15,000 Active Students across 300 Sections.
  - 50 Assignments per section per semester $\to 15,000$ assignments.
  - Marks records: $15,000\text{ students} \times 1\text{ active semester} \approx 15,000$ core grade records.
- **Traffic**:
  - Peak concurrent users during assignment submissions / grade releases: $\approx 800\text{ concurrent users}$.
  - Requests per second at peak: $\approx 40\text{ req/sec}$.
- **Storage**:
  - Structured database size: $< 200\text{ MB}$ for 15,000 students (text metadata).
  - Export CSV bandwidth: $< 5\text{ MB/day}$.
- **Bottleneck Analysis**:
  - The first bottleneck would be concurrent spreadsheet writes during mid-term grade upload sessions. This is solved by optimistic client-side updates, client debouncing, and lightweight atomic row updates.
