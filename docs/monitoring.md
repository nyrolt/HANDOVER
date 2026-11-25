# Handover — Monitoring & Alerting Plan

## 1. Uptime Probes & Heartbeats

| Probe Target               | Protocol                | Interval | Timeout | Pass Criteria                 |
| :------------------------- | :---------------------- | :------- | :------ | :---------------------------- |
| **Edge CDN / Homepage**    | HTTPS GET `/`           | 60 sec   | 5 sec   | HTTP 200                      |
| **Authentication Service** | HTTPS GET `/auth`       | 60 sec   | 5 sec   | HTTP 200                      |
| **System Health Check**    | HTTPS GET `/api/health` | 30 sec   | 3 sec   | HTTP 200, `status: "healthy"` |
| **Core Marks Spreadsheet** | Headless probe          | 5 min    | 15 sec  | Successful spreadsheet render |

---

## 2. Key Technical Metrics

- **API Latency**: p50 $< 100\text{ ms}$, p95 $< 350\text{ ms}$, p99 $< 800\text{ ms}$.
- **Error Rate (5xx)**: Threshold $< 0.1\%$ over a 5-minute rolling window.
- **Client Render Health**: Zero catastrophic React hydration or routing crashes.

---

## 3. Key Business Health Metrics

- Daily Active Faculty Sessions.
- Number of Marks Cells Saved per Hour (surges during exam evaluation weeks).
- Active Group Project Proposals pending approval $> 7$ days.

---

## 4. Alert Rules & Escalation Tiers

| Alert                          | Condition                                    | Duration | Severity      | Notification Channel | Action                               |
| :----------------------------- | :------------------------------------------- | :------- | :------------ | :------------------- | :----------------------------------- |
| **System Down**                | Health check probe fails 3 consecutive times | 90 sec   | P1 (Critical) | SMS & PagerDuty      | Execute `/docs/runbooks/rollback.md` |
| **Error Rate Surge**           | 5xx errors $> 2\%$ of traffic                | 3 min    | P2 (High)     | Slack `#eng-alerts`  | Inspect structured logs & Sentry     |
| **Slow Spreadsheet Mutations** | Save latency p95 $> 1000\text{ ms}$          | 5 min    | P3 (Medium)   | Slack `#eng-alerts`  | Check database contention            |
