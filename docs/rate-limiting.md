# Handover — Rate Limiting Policy

## 1. Overview

Rate limiting prevents denial-of-service, brute-force password guessing, scraper flooding, and excessive compute consumption during bulk CSV exports.

---

## 2. Limits by Endpoint Category

| Category             | Endpoint                        | Limit        | Window     | Action on Limit                  |
| :------------------- | :------------------------------ | :----------- | :--------- | :------------------------------- |
| **Authentication**   | `/auth/login`, `/auth/register` | 5 requests   | 15 minutes | HTTP 429 with `Retry-After: 900` |
| **Bulk Exports**     | `/api/sections/:id/export`      | 10 requests  | 1 minute   | HTTP 429 with `Retry-After: 60`  |
| **Bulk CSV Imports** | `/api/sections/:id/import`      | 5 requests   | 1 minute   | HTTP 429 with `Retry-After: 60`  |
| **General Reads**    | All GET endpoints               | 120 requests | 1 minute   | HTTP 429                         |

---

## 3. Response on Limit Exceeded

When a client exceeds the allocated budget, the service responds with:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 60

{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please wait 60 seconds before trying again.",
    "retryAfter": 60
  }
}
```
