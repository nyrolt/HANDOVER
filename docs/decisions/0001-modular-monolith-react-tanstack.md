# ADR 0001: Adoption of Modular Monolith Architecture with React 19 and TanStack

## Context

When designing a college management SaaS, AI agents and engineers often over-engineer microservices early on (separate services for auth, grades, groups, notifications) or mix concerns by dumping raw state logic directly inside UI components. This creates unnecessary operational burden, brittle network boundaries, and hard-to-debug deployments.

## Decision

We adopt a **Modular Monolith** architecture:

- Frontend: Single-page application using React 19, TypeScript, and TanStack Router.
- Service Core: Clean domain modules in `src/services/` (`permissions`, `teacher`, `student`, `db`, `logger`) with strong boundaries and zero business logic inside view templates.
- State & Data: Unified multi-tenant data store maintaining strict referential integrity.

## Alternatives Considered

1. **Microservices Architecture**:
   - _Rejected_: Massive overhead for inter-service communication, distributed transaction rollback, Docker/Kubernetes management for small-to-medium college deployments.
2. **Next.js 15 Full-Stack SSR**:
   - _Rejected_: Unpredictable server-component caching, slower cold-starts on serverless workers, and higher hosting complexity compared to a compiled Vite SPA with Nitro edge capabilities.

## Consequences

- **Positive**: Blazing fast local developer feedback loop, zero cross-service network latency, sub-second production builds, simple end-to-end testing with Vitest.
- **Negative**: Requires discipline to enforce boundaries between modules in code without physical network separation (enforced via linter and code reviews).
