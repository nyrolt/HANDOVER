# Handover — College Teacher & Student Management System

A simple, minimal, clean, and professional web application designed for college faculty to manage classes, students, assignments, group projects, and continuous examination marks in a digital spreadsheet-like dashboard, with a restricted portal for students to track their coursework and submit group proposals.

---

## Architecture Overview (3-Tier Modular Monolith)

The project is structured into three independent, decoupled modules:

```
handover/
├── frontend/    # React 19 + TanStack Start / Router + Tailwind CSS v4 (Port 5173)
│   ├── src/
│   │   ├── components/  # Teacher spreadsheet, student gradebook, layout, Radix UI
│   │   ├── routes/      # TanStack file-based routes (/, /auth, /dashboard)
│   │   ├── services/    # Client state, auth hook, and HTTP REST API client
│   │   └── styles.css   # Modern gradients & vibrant professional design system
│   ├── package.json
│   └── vite.config.ts
├── backend/     # Pure TypeScript business logic, models, controllers & tests (Zero UI dependencies)
│   ├── controllers/     # Auth, teacher, student, and marks controllers
│   ├── services/        # Permissions engine, RBAC matrix, database, validators
│   ├── models/          # Shared domain interfaces and schemas
│   ├── test/            # Vitest suite (17 comprehensive tests)
│   └── package.json
├── server/      # Node.js + Express REST API Server (Port 5000)
│   ├── api/             # REST route bindings for controllers
│   ├── middleware/      # Authentication, RBAC, CSRF, error handling
│   ├── config.ts        # Port 5000, CORS, rate limits
│   ├── index.ts         # Express server listener
│   └── package.json
└── package.json # Root orchestrator for concurrent local development
```

---

## Key Features

### 1. Teacher Dashboard (Full Management Control)

- **Spreadsheet-First Student Management**:
  - Interactive table: `Roll No | Student Name | Email | Project Group | Internal (/20) | Lab (/20) | Practical (/20) | Project (/20) | Total (/80) | Grade | Actions`
  - Inline cell editing with instant auto-save to database.
  - Keyboard navigation: press <kbd>Tab</kbd> to move between cells, <kbd>Enter</kbd> to commit and advance rows.
  - Sticky/frozen Roll Number and Student Name columns on horizontal scrolling.
  - Mark validation: enforces limits ($0 \le \text{mark} \le 20$).
  - Automatic total and letter grade calculations.
  - Search by roll number, student name, email, or project group.
  - Column sorting by Roll No, Name, and Total Marks.
  - CSV Export and CSV Import tools.
- **Section Management**:
  - Create, rename, and delete class sections (e.g., `CS-301 (Sec A)`, `CS-302 (Sec B)`, `CS-405 (Sec C)`).
  - Isolated student rosters per section.
- **Group Projects Management**:
  - View all teams per section.
  - Create official groups, assign group names, guides, and project descriptions.
  - Add and remove students from teams.
  - Score project milestones (out of 20).
  - Review, approve, or reject student group proposals.
- **Assignments**:
  - Create, edit, and delete coursework assignments with firm deadlines and instructions.
  - Assign to specific sections.
- **Marks & Results Gradebook**:
  - Dedicated continuous assessment sheet with configurable maximum marks and class performance metrics.
- **Teacher Reports**:
  - Grade distribution analytics and one-click full section export.
- **Class Announcements**:
  - Broadcast important circulars, lab schedules, and exam updates.

---

### 2. Student Dashboard (Restricted View-Only Access)

- **Academic Standing**:
  - View private marks breakdown (Internal, Lab Record, Practical, Project, Total, Percentage, Grade).
  - **Strictly read-only**: students cannot modify any marks or view other students' private records.
- **Coursework & Assignments**:
  - View active assignments and deadlines posted by the teacher for their section.
- **My Group Project**:
  - View their official approved group and teammates.
  - If unassigned, enter a proposed team name, project title, and select peers from their section to submit for teacher authorization.
- **Announcements**:
  - View broadcast notices from their course instructor.
- **Profile**:
  - View enrolled roll number, email, and class section.

---

## Development Workflow & Commands

### Root Command (Runs Frontend + Server Concurrently)

```sh
npm run dev
```

Starts:

- **Server**: [http://localhost:5000](http://localhost:5000) (Express REST API)
- **Frontend**: [http://localhost:5173](http://localhost:5173) (TanStack Start App)

### Independent Package Execution

#### Frontend (React 19 + TanStack Start):

```sh
cd frontend
npm run dev
```

Runs independently on [http://localhost:5173](http://localhost:5173).

#### Server (Express REST API):

```sh
cd server
npm run dev
```

Runs independently on [http://localhost:5000](http://localhost:5000).

#### Backend (Test Suite & TypeScript):

```sh
cd backend
npm test
```

Runs the 17 isolated business logic and RBAC tests via Vitest.

---

## Full Verification Commands

```sh
# Run backend test suite
npm test

# Run TypeScript checks across all packages
npx tsc --noEmit

# Run ESLint across all packages
npm run lint

# Format codebase
npm run format

# Production build of frontend
npm run build
```

---

## Tech Stack

- **Frontend**: React 19, TypeScript, TanStack Start, TanStack Router, Tailwind CSS v4, Lucide React icons, Radix UI primitives
- **Server**: Node.js, Express, CORS, CSRF Protection, Cookie Parser
- **Backend**: Pure TypeScript, Zod Schema Validation, Centralized RBAC (`can()`), Vitest
