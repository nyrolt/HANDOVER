# Runbook: Incident Management & Customer Communication

## 1. Incident Severity Definitions

- **P1 (Critical Outage)**: System completely inaccessible; teachers unable to access or save grades; students unable to submit assignments.
- **P2 (Partial Degradation)**: Specific feature degraded (e.g. CSV export timing out), but core spreadsheet viewing and marks saving operational.
- **P3 (Minor Glitch)**: UI styling issue, non-blocking cosmetic error.

---

## 2. Incident Response Workflow

1. **Declare**: On P1 alert, the on-call engineer acknowledges the alert within 15 minutes and creates an incident war room.
2. **Mitigate First, Investigate Later**: If recent deployment caused regression, immediately trigger rollback (`/docs/runbooks/rollback.md`).
3. **Communicate**: Post update to public status page within 20 minutes of confirmed outage.
4. **Resolve**: Confirm system recovery with `/api/health` probes.
5. **Post-Mortem**: Complete RCA (Root Cause Analysis) within 48 hours.

---

## 3. Communication Templates

### Public Status Update (During Outage):

> **Investigating Marks Management Service Interruption**
> We are currently investigating an issue affecting spreadsheet marks saving for some course sections. Our engineering team is actively diagnosing the root cause. Existing records are safe. Next update in 20 minutes.

### Resolution Notice:

> **Resolved: Marks Management Service Restored**
> The issue affecting spreadsheet saves has been fully resolved. All services are operating normally. No student academic data was impacted.
