# Project: Handover (College Teacher & Student Management System)

## What this product does

Handover is a simple, minimal, and professional SaaS application designed for college faculty and students. It replaces messy, fragmented Excel spreadsheets by providing teachers with an intuitive, spreadsheet-like workspace to manage classes, students, assignments, group projects, and continuous academic marks. Students have a dedicated, restricted portal to track coursework deadlines, view verified grade transcripts (read-only), and propose collaborative project groups.

## Stack (do not change without asking)

- **Frontend**: React 19 + TypeScript + Vite + TanStack Router & Start + Tailwind CSS v4 + Radix UI Primitives / Shadcn + Lucide Icons
- **Backend & Logic**: Modular Monolith Service Architecture (`src/services/`), thin route handlers, Zod schema validation at all boundaries
- **Database & Storage**: Structured Relational / Client-side Reactive State Database (`src/services/db.ts`) with multi-tenancy (`institution_id`, `section_id`), soft deletes (`deleted_at`), strict constraints, and localStorage persistence
- **Auth & Authorization**: Centralized Role-Based Access Control (`src/services/permissions.ts`) using `can(user, action, resource, context)` as the single source of truth; session management in `src/services/auth.ts`
- **Hosting**: Cloudflare Pages / Workers (Nitro preset) / Vercel / Node.js container

## Rules

- **Never commit secrets**: All credentials, keys, and tokens belong in environment variables, documented in `.env.example`.
- **Validation & Authorization at the boundary**: Every service and endpoint MUST perform:
  1. Input validation with Zod.
  2. Authentication verification.
  3. Strict authorization check via `can()`.
  4. Unit / integration tests for happy path and forbidden access.
- **Server/Service is the source of truth**: The frontend hides inaccessible UI elements for cleanliness, but the underlying services must strictly enforce permissions and reject unauthorized actions.
- **Multi-tenancy scoping**: Every query and mutation MUST be scoped by `institution_id` / `section_id`. Cross-tenant data leakage is strictly prohibited.
- **Clean data models**: Every entity must maintain `id` (UUID), `createdAt`, `updatedAt`, and `deletedAt` (where soft deletion applies). Money must be stored as minor units (cents/paise); marks must be strictly bounded.
- **Verification protocol**: Always run `npm run lint`, typecheck, and `npm test` before concluding any task.
- **Ask before adding a new dependency**: Keep dependencies minimal, vetted, and necessary.
- **Conventional Commits**: Commit messages follow the convention: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.

## Commands

- **Dev**: `npm run dev`
- **Test**: `npm test`
- **Lint**: `npm run lint`
- **Typecheck**: `npx tsc --noEmit`
- **Format**: `npm run format`
- **Build**: `npm run build`

## Core Engineering Principles (ANDREW.md)

- **Think Before Coding**: Don't assume. State assumptions explicitly. Surface tradeoffs and present options rather than picking silently. If something is unclear or a simpler approach exists, stop and push back when warranted.
- **Simplicity First**: Minimum code that solves the problem. Nothing speculative. No features beyond what was asked. No abstractions for single-use code. No error handling for impossible scenarios. If you write 200 lines and it could be 50, rewrite it.
- **Surgical Changes**: Touch only what you must. Clean up only your own mess. Match existing style. Remove imports/variables/functions that your changes made unused. Every changed line must trace directly to the request.
- **Goal-Driven Execution**: Define verifiable success criteria. For multi-step tasks, state a brief plan with verifiable checks (`1. [Step] -> verify: [check]`). Loop independently until verified.

## Architecture Decisions

All structural and technical choices are documented in Architecture Decision Records (ADRs) under `/docs/decisions/`.

- `0001-modular-monolith-react-tanstack.md`: Adoption of modular monolith architecture with TanStack Start/Router.
- `0002-centralized-authorization-and-isolation.md`: Centralized authorization via `can()` and multi-tenant scoping.
- `0003-spreadsheet-state-and-persistence.md`: Reactive spreadsheet state engine with auto-save and audit logging.
