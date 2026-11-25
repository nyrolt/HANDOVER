# Runbook: Database Backup & Point-in-Time Restore

## 1. Overview

This runbook documents the backup policy, retention schedule, verification procedures, and disaster recovery steps for Handover data stores.

---

## 2. Backup Schedule & Retention Policy

| Backup Type               | Frequency            | Retention Window | Storage Target              | Encryption   |
| :------------------------ | :------------------- | :--------------- | :-------------------------- | :----------- |
| **Continuous WAL / PITR** | Continuous streaming | 7 Days           | Multi-region Object Storage | AES-256 GCM  |
| **Daily Full Snapshots**  | Daily at 02:00 UTC   | 30 Days          | Isolated Backup Bucket      | AES-256 GCM  |
| **Monthly Archive**       | 1st of each month    | 1 Year           | Cold Glacier Archive        | KMS Envelope |

---

## 3. Step-by-Step Point-in-Time Restore Procedure

### Step 3.1: Preparation

1. Identify the target timestamp to restore to (e.g. `2026-11-13T18:00:00Z`).
2. **Never restore directly over active production database**. Always restore into an isolated staging/recovery database instance first:
   ```bash
   export RESTORE_TARGET_DB="Handover_recovery_$(date +%Y%m%d_%H%M%S)"
   ```

### Step 3.2: Execute Restore

For Postgres / Supabase:

```bash
# 1. Spawn a recovery branch or instance
supabase branches create recovery-test

# 2. Or restore from local snapshot into target DB
pg_restore -v --clean --no-acl --no-owner -h $DB_HOST -U $DB_USER -d $RESTORE_TARGET_DB ./backups/latest.dump
```

For Client / Local Reactive DB:

1. Export active state snapshot:
   ```ts
   import { db } from "@/services/db";
   const snapshot = JSON.stringify(db.getState(), null, 2);
   ```
2. Verify snapshot integrity with checksum.
3. Import to target recovery environment.

### Step 3.3: Verification Checklist

- [ ] Connect to recovery database.
- [ ] Verify total student count matches pre-incident baseline.
- [ ] Verify continuous marks records exist for all enrolled students.
- [ ] Verify project groups and assigned members match.
- [ ] Perform smoke query verifying tenant isolation (`WHERE institution_id = :id`).

### Step 3.4: Production Switchover (Only after verification)

1. Place application in temporary maintenance mode (`503 Service Unavailable`).
2. Point connection string `DATABASE_URL` to the verified restored instance.
3. Verify application health check `/api/health`.
4. Disable maintenance mode and notify users.
