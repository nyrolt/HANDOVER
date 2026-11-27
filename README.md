# Handover — College Teacher & Student Management System

A simple, minimal, clean, and professional web application designed for college teachers to manage classes, students, assignments, group projects, and continuous examination marks in a digital spreadsheet-like dashboard, with a restricted portal for students to track their coursework and submit group proposals.

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
  - Create, rename, and delete class sections (e.g., `CSE - Section A`, `CSE - Section B`, `IT - Section A`).
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
  - Dedicated continuous assessment sheet with configurable maximum marks and class performance metrics (Class Average, Highest Score, Pass Rate).
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

## Demo Credentials & One-Click Login

The application comes pre-seeded with realistic college data. You can log in using either the one-click demo buttons on the home/auth page or via the role switcher in the top navigation bar:

| Role        | Name                | Email                 | Details                                     |
| :---------- | :------------------ | :-------------------- | :------------------------------------------ |
| **Teacher** | Prof. Ramesh Sharma | `teacher@college.edu` | Full administrative & spreadsheet control   |
| **Student** | Rahul Sharma        | `rahul@college.edu`   | Roll 01, CSE - Section A (Team Alpha)       |
| **Student** | Aman Verma          | `aman@college.edu`    | Roll 02, CSE - Section A (Team Alpha)       |
| **Student** | Priya Patel         | `priya@college.edu`   | Roll 03, CSE - Section A (Team Beta)        |
| **Student** | Rohan Joshi         | `rohan@college.edu`   | Roll 01, CSE - Section B (Pending Proposal) |

_(No password required in demo mode; click any demo login button or enter any email to sign in)._

---

## Modular Architecture

Handover is structured into three clean, decoupled, and independently executable tiers:

```
handover/
├── frontend/          # React 19 + TanStack Start / Router + Tailwind CSS v4 UI (port 5173)
├── backend/           # Pure TypeScript domain logic, RBAC can(), controllers, database models & test suite
├── server/            # Node.js + Express REST API server, CORS & CSRF middleware (port 5000)
└── src/               # Baseline application workspace
```

- **`frontend/`**: Presentation layer running on `http://localhost:5173`. Uses TanStack Start with SSR, file-based routing, Radix UI primitives, Lucide icons, and modern gradients. Communicates with the backend server via HTTP REST requests with credentialed cookies.
- **`backend/`**: Pure TypeScript business logic, controllers (`authController`, `teacherController`, `studentController`, `marksController`), RBAC authorization engine (`can()`), Zod validation, and JSON store persistence. Has **zero DOM or frontend dependencies** and runs standalone unit tests.
- **`server/`**: Express HTTP server running on `http://localhost:5000`. Configures credentialed CORS for port `5173`, JSON/cookie parsers, CSRF protection, centralized error handling, and mounts backend REST API routes.

---

## Independent Execution & Development

### 1. Root Command (Starts Frontend & Server Concurrently)

```sh
npm run dev
```

This uses `concurrently` to spin up both the Express REST API on `http://localhost:5000` and the TanStack Start frontend on `http://localhost:5173`.

### 2. Independent Execution by Tier

#### Frontend (`http://localhost:5173`)

```sh
cd frontend
npm run dev
```

To build for production:

```sh
cd frontend
npm run build
```

#### Server (`http://localhost:5000`)

```sh
cd server
npm run dev
```

To run the end-to-end integration suite:

```sh
cd server
npm run test:e2e
```

#### Backend (Pure Logic & Unit Tests)

```sh
cd backend
npm test
```

To run TypeScript verification:

```sh
cd backend
npm run typecheck
```

---

## Tech Stack

- **Frontend**: React 19, TypeScript, TanStack Start, TanStack Router, Tailwind CSS v4, Lucide React icons, Radix UI primitives
- **Backend**: TypeScript, Zod Schema Validation, Centralized RBAC (`can()`), JSON Persistence Engine
- **Server**: Node.js, Express, CORS, Cookie-Parser, CSRF Protection
- **Testing**: Vitest, E2E HTTP Test Suite
