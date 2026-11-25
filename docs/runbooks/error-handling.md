# Runbook: Error Tracking & Clean Exception Handling

## 1. Principles

- **No Swallowed Exceptions**: Never use empty `catch {}` blocks. Every error must be either:
  1. Handled meaningfully with a fallback, OR
  2. Logged via structured logger (`logger.error`) and surfaced via clean UI notification.
- **Sanitized Client Messages**: The end-user sees a helpful, reassuring message ("Could not update marks. Please check your connection and retry"), while full error diagnostics and stack traces are routed to structured logs.
- **Redaction by Default**: Passwords, tokens, cookies, and sensitive PII are automatically scrubbed from all log emissions by `StructuredLogger`.

---

## 2. Structured Log Format (JSON)

Every log line follows:

```json
{
  "timestamp": "2026-11-13T19:45:00.123Z",
  "level": "error",
  "message": "Failed to update marks",
  "requestId": "req_8f1k9a2",
  "userId": "usr-teacher-1",
  "role": "teacher",
  "institutionId": "inst-college-1",
  "sectionId": "sec-cse-a",
  "metadata": {
    "studentId": "stud-1",
    "token": "[REDACTED]"
  },
  "error": {
    "name": "AuthorizationError",
    "message": "Access denied"
  }
}
```
