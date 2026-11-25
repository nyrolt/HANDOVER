# Runbook: Deployment Rollback

## 1. When to Trigger an Immediate Rollback

Initiate an immediate rollback if any of the following occur post-deployment:

- Critical regression in continuous marks saving or calculating total marks.
- Broken authorization where students can access other students' records or modify academic scores.
- Error rate spiking $> 1\%$ on core endpoints.
- Health check endpoint `/api/health` failing.

---

## 2. Fast Rollback Procedure (Zero Downtime)

### Step 2.1: Edge Hosting / Cloudflare Pages / Vercel

1. Navigate to Deployments dashboard.
2. Identify the last known stable deployment SHA.
3. Click **Rollback / Promote to Production**.
4. Propagation time: $< 30\text{ seconds}$ worldwide.

### Step 2.2: Git Rollback via CLI

If deploying via automated continuous deployment on `main`:

```bash
# Revert the faulty merge commit
git revert -m 1 HEAD --no-edit

# Push revert to main to trigger automated CI/CD pipeline
git push origin main
```

---

## 3. Post-Rollback Validation

- [ ] Confirm `/api/health` returns status `200 OK`.
- [ ] Log in as Demo Teacher and verify section student marksheet loads.
- [ ] Log in as Demo Student and confirm read-only marks protection is active.
- [ ] Verify that no orphaned records or partial state were created.
- [ ] Post an internal notification and file an incident report using `/docs/runbooks/incident.md`.
