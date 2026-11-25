# Handover — Testing Strategy

## 1. Testing Philosophy & Ground Rules

- **Never Test the Mocks**: Tests must assert against the real domain engine, state transitions, and authorization logic.
- **Never Change the Test to Make it Pass**: If a test fails, the bug is in the implementation, not the test specification.
- **No Quiet Skips**: `test.skip`, `xit`, or disabled assertions are strictly banned without an explicit ADR justification.
- **Happy Path + Edge Cases + Negative Authorization**: Every feature must verify:
  1. The happy path.
  2. Invalid boundary inputs (e.g. marks $< 0$ or $> 20$).
  3. Permission denied (student attempting teacher operations).
  4. Cross-tenant / cross-section IDOR attacks.

---

## 2. Test Architecture Tiers

| Tier                    | Scope                                                                                               | Tool       | Frequency                    |
| :---------------------- | :-------------------------------------------------------------------------------------------------- | :--------- | :--------------------------- |
| **Unit Tests**          | Domain algorithms, mark totals, grade tiers, CSV import parser, Zod schemas                         | Vitest     | Every file save & git commit |
| **Authorization Tests** | Permissions matrix validation, IDOR prevention, role assertion (`can()`)                            | Vitest     | CI on every Pull Request     |
| **Integration Tests**   | Multi-step workflows (Student proposes group $\to$ Teacher reviews & approves $\to$ Roster updates) | Vitest     | CI on every Pull Request     |
| **End-to-End Tests**    | Browser traversal (Login $\to$ Inline spreadsheet edit $\to$ Save confirmation)                     | Playwright | Nightly & Pre-release        |

---

## 3. What is Mocked vs. What is Never Mocked

### NEVER Mocked:

- **Authorization Engine (`can()` / `assertCan()`)**: Must execute live against real user session roles.
- **Database Logic (`CollegeDatabase`)**: Real in-memory relational operations with referential integrity.
- **Marks Calculations & Constraints**: Real mathematical validation and boundary clamping.

### Permitted to Mock:

- External third-party payment gateways (Stripe webhooks in test mode).
- External email delivery APIs (mock SMTP transporter / console capture).
