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

## Installation & Running Locally

### Prerequisites

- Node.js (v18+ or v20+)
- npm

### 1. Install Dependencies

```sh
npm install
```

### 2. Run the Development Server

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port Vite outputs) in your browser.

### 3. Run Unit Tests

```sh
npm test
```

### 4. Build for Production

```sh
npm run build
```

---

## Tech Stack

- **Framework**: React 19, TypeScript, TanStack Start, TanStack Router
- **Styling**: Tailwind CSS v4, Lucide React icons, Radix UI primitives
- **Persistence**: Reactive LocalStorage Client Database (`src/services/db.ts`) with pre-seeded data, real-time cross-component subscribers, and auto-save
