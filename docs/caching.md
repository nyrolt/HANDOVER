# Handover — Caching & CDN Strategy

## 1. Core Caching Principles

1. **Never Cache Authenticated Responses at the Public CDN Layer**: All student and teacher endpoints must return `Cache-Control: private, no-store, must-revalidate` to prevent CDN reverse proxies from caching private student transcripts or marks across users.
2. **Strict Multi-Tenant Cache Key Scoping**: Every internal cache key MUST include the tenant and section context:
   ```
   cache:{institution_id}:section:{section_id}:roster
   cache:{institution_id}:student:{student_id}:marks
   ```
3. **Invalidation on Write**: Any mutation (updating marks, adding student, editing group) must immediately evict the corresponding section cache key.

---

## 2. Layered Cache Policies

| Asset / Endpoint                   | Location            | TTL      | Cache-Control Header                              | Invalidation Trigger             |
| :--------------------------------- | :------------------ | :------- | :------------------------------------------------ | :------------------------------- |
| **Static JS / CSS (Vite bundles)** | CDN & Browser       | 1 Year   | `public, max-age=31536000, immutable`             | Content-hashed filename on build |
| **Favicons / Public SVGs**         | CDN & Browser       | 1 Day    | `public, max-age=86400`                           | Deployment                       |
| **Public Landing Page**            | CDN Edge            | 10 Min   | `public, s-maxage=600, stale-while-revalidate=60` | Content deployment               |
| **Student Roster & Marksheet**     | Client Memory Store | Reactive | `private, no-cache, no-store`                     | Immediate on cell edit           |
| **Student Private Transcript**     | Client Memory Store | Reactive | `private, no-cache, no-store`                     | Re-fetch on notification         |
