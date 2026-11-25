# ADR 0002: Centralized Authorization via can() and Multi-Tenant Isolation

## Context

Broken object-level authorization (IDOR) is the most common SaaS vulnerability. Many AI implementations only hide buttons in the frontend UI while leaving services or API handlers open to unauthorized requests (e.g. students modifying marks or viewing other students' private grades). Furthermore, single-tenant queries without explicit scoping allow one section or department to leak into another.

## Decision

1. We implement a single, central authorization function:
   ```ts
   can(user: User, action: PermissionAction, resource: PermissionResource, context?: PermissionContext): boolean
   ```
   located in `src/services/permissions.ts`.
2. Every service mutation or sensitive query MUST invoke `assertCan(user, action, resource, context)` before executing.
3. Every data query must be filtered by `institution_id` and `section_id`.
4. The server/service layer is the absolute source of truth. Frontend components check `can()` only to render cleaner UI, not as a security guarantee.

## Alternatives Considered

- **Ad-hoc role checks scattered in components (`if (user.role === 'teacher')`)**:
  - _Rejected_: Inconsistent, difficult to audit, and prone to edge-case bypasses.
- **Relying solely on frontend button disabling**:
  - _Rejected_: Fatal security flaw; any client can invoke service methods directly.

## Consequences

- **Positive**: 100% auditable authorization matrix in `/docs/permissions.md`. Easy to write automated security regression tests that verify students cannot access unauthorized resources.
- **Negative**: Requires passing the calling user session into service methods to evaluate permission checks.
