# Handover — Hosting & Infrastructure Plan

## 1. Target Hosting Recommendation: Cloudflare / Nitro / Vercel

For our scale (small team, zero DevOps maintenance, global sub-50ms latency), the recommended production stack is:

- **Application Delivery & Edge**: Cloudflare Pages / Nitro preset with custom domain & automatic SSL.
- **Relational Data**: Managed Postgres via Supabase or Neon (serverless pooled connections).
- **Static Assets & CDN**: Cloudflare Global CDN with cache-control headers.

---

## 2. Component Hosting Breakdown

| Component             | Provider & Tier             | Configuration                           | Launch Cost   | 10x Scale Cost |
| :-------------------- | :-------------------------- | :-------------------------------------- | :------------ | :------------- |
| **Frontend SPA**      | Cloudflare Pages (Free/Pro) | Git integration, automated edge deploys | \$0 / mo      | \$20 / mo      |
| **Edge API / Server** | Nitro Cloudflare Module     | Compatible with Node/Workers            | \$0 / mo      | \$5 / mo       |
| **Database**          | Supabase Postgres (Pro)     | 8GB RAM, automated daily backups, WAL   | \$25 / mo     | \$75 / mo      |
| **Monitoring**        | Sentry Developer            | Client & server error monitoring        | \$0 / mo      | \$29 / mo      |
| **Total**             |                             |                                         | **\$25 / mo** | **\$129 / mo** |

---

## 3. Environment Strategy

| Environment    | Purpose               | Database              | Branch                 | URL                            |
| :------------- | :-------------------- | :-------------------- | :--------------------- | :----------------------------- |
| **Local**      | Feature development   | Local / in-memory     | feature branch         | `http://localhost:3000`        |
| **Staging**    | QA, integration tests | Isolated Staging DB   | `staging` / PR preview | `https://staging.Handover.app` |
| **Production** | Live college usage    | Primary Production DB | `main`                 | `https://Handover.app`         |
