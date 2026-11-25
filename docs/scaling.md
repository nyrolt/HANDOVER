# Handover — Scaling & Performance Strategy

## 1. Scaling Philosophy: Measure First, Then Optimize

Avoid premature microservices or sharding. Optimize the actual architectural bottlenecks that break first:

1. Unindexed foreign keys and sorting columns.
2. Synchronous heavy exports blocking the main thread.
3. Unbounded database queries lacking section filters.

---

## 2. Stateless Application Design

- The application process is 100% stateless.
- Session state is represented via client-side tokens and authenticated context.
- Any server instance can serve any incoming HTTP request without session stickiness.
- Allows effortless horizontal auto-scaling from 1 to 20 instances during peak grading periods.

---

## 3. Database Indexing Strategy

To ensure instantaneous sub-5ms queries even with 500,000 student records:

- `INDEX idx_students_section_id ON students(section_id)`
- `INDEX idx_students_roll_number ON students(section_id, roll_number)`
- `INDEX idx_marks_student_id ON marks(student_id)`
- `INDEX idx_marks_section_id ON marks(section_id)`
- `INDEX idx_groups_section_id ON project_groups(section_id)`
- `INDEX idx_assignments_section_id ON assignments(section_id, status)`

---

## 4. Load Modeling (10x and 100x Users)

| Metric                      | Current (Launch) | 10x Scale (Year 2) | 100x Scale (Enterprise) |
| :-------------------------- | :--------------- | :----------------- | :---------------------- |
| **Active Students**         | 1,000            | 10,000             | 100,000                 |
| **Faculty Instructors**     | 50               | 500                | 5,000                   |
| **Peak Requests/sec**       | 10 req/s         | 100 req/s          | 1,000 req/s             |
| **Database Compute**        | 1 vCPU (Shared)  | 2 vCPU (Dedicated) | 8 vCPU + Read Replica   |
| **Est. Monthly Infra Cost** | \$25 / mo        | \$129 / mo         | \$550 / mo              |
