# Handover — Security Threat Model (OWASP Top 10)

## 1. Asset Inventory

- **Student Grade Records**: Internal, lab, practical, and project scores. Highly sensitive; must not be viewable by other students or alterable by unauthorized parties.
- **Student & Faculty Identities**: Names, institutional email addresses, roll numbers, session tokens.
- **Official Group Projects & Coursework**: Project titles, proposals, deadlines, instructions.

---

## 2. Threat Analysis & Mitigations

| Entry Point                 | Threat (OWASP)                                                                                    | Likelihood |  Impact  | Existing Mitigation                                                                                          | Residual Risk / Action                                  |
| :-------------------------- | :------------------------------------------------------------------------------------------------ | :--------: | :------: | :----------------------------------------------------------------------------------------------------------- | :------------------------------------------------------ |
| **Marks Update Endpoint**   | **Broken Access Control (IDOR)**: Student intercepts request and updates own/peer marks.          |   Medium   | Critical | Server-side `assertCan(user, 'update:marks')` rejects non-faculty callers.                                   | Continuous regression testing in `permissions.test.ts`. |
| **Student Marks Query**     | **Data Exposure**: Student modifies `studentId` query parameter to read peer grades.              |    High    |   High   | `can(user, 'read:marks', 'marks', context)` checks that `context.targetStudentId === user.studentProfileId`. | Cross-tenant test suite blocks enumeration.             |
| **Spreadsheet Cell Inputs** | **Injection & Out-of-Bounds**: Negative numbers, $> 20$ marks, or script tags in strings.         |    High    |  Medium  | Zod boundary validation (`UpdateStudentMarksSchema`) + sanitization.                                         | Input clamped strictly to $[0, 20]$.                    |
| **CSV Import Parser**       | **CSV Injection / Formula Injection**: Malicious Excel formulas starting with `=`, `+`, `-`, `@`. |   Medium   |  Medium  | Parser treats all text as literal strings; formula execution disabled.                                       | Cell values sanitized before table rendering.           |
| **Broadcast Forms**         | **Cross-Site Scripting (XSS)**: Malicious HTML inside announcement bodies.                        |   Medium   |   High   | React's JSX auto-escapes string content. No `dangerouslySetInnerHTML` used.                                  | Strict CSP headers configured.                          |
| **Authentication Flow**     | **Brute-Force & Enumeration**: Credential stuffing or user existence discovery.                   |   Medium   |  Medium  | Constant-time user lookup and rate limiting on auth endpoints.                                               | Rate limiter utility in `src/services/rate-limiter.ts`. |

---

## 3. Security Verification Checklist

- [x] Student accounts strictly prohibited from mutating marks.
- [x] Zero raw SQL strings or unescaped HTML interpolation.
- [x] Zero API keys or secrets embedded in client bundle.
- [x] Input lengths and types enforced by Zod schemas.
