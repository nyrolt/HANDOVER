# Handover — API & Service Conventions

## 1. URL & Naming Conventions

- Resources use plural nouns in lowercase kebab-case:
  - `/api/sections`
  - `/api/sections/:sectionId/students`
  - `/api/sections/:sectionId/marks`
  - `/api/sections/:sectionId/project-groups`
  - `/api/sections/:sectionId/assignments`
  - `/api/sections/:sectionId/announcements`
- Service method naming follows standard verb-noun format:
  - `getSectionById(id)`
  - `updateStudentMarks(studentId, patch, user)`
  - `createProjectGroup(payload, user)`
  - `submitGroupRequest(payload, user)`

---

## 2. Standard JSON Response Format

All responses follow a consistent envelope:

### Success Response:

```json
{
  "data": { ... },
  "meta": {
    "requestId": "req_01h7x9...",
    "timestamp": "2026-11-13T19:00:00Z"
  }
}
```

### Error Response:

```json
{
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHENTICATED | FORBIDDEN | NOT_FOUND | RATE_LIMITED | INTERNAL_ERROR",
    "message": "Human-readable explanation of error.",
    "details": [
      {
        "field": "internalMarks",
        "message": "Marks cannot exceed 20."
      }
    ],
    "requestId": "req_01h7x9..."
  }
}
```

---

## 3. Standard HTTP Status Codes

| Code  | Status                | When to Use                                                                       |
| :---- | :-------------------- | :-------------------------------------------------------------------------------- |
| `200` | OK                    | Successful GET, PUT, PATCH request                                                |
| `201` | Created               | Successful POST creation of resource                                              |
| `204` | No Content            | Successful DELETE                                                                 |
| `400` | Bad Request           | Zod input validation failure, malformed payload                                   |
| `401` | Unauthorized          | Missing or expired authentication token / session                                 |
| `403` | Forbidden             | Authenticated user lacks permission (e.g. Student modifying marks)                |
| `404` | Not Found             | Resource does not exist OR belongs to another tenant/section (IDOR mitigation)    |
| `429` | Too Many Requests     | Rate limit exceeded (includes `Retry-After` header)                               |
| `500` | Internal Server Error | Unhandled server error (sanitized message sent to client, details in Sentry/logs) |

---

## 4. Input Boundary Validation with Zod

Every incoming request or mutation MUST be validated at the boundary before calling domain logic:

```ts
import { z } from "zod";

export const UpdateMarksSchema = z.object({
  internalMarks: z.number().int().min(0).max(20).optional(),
  labRecordMarks: z.number().int().min(0).max(20).optional(),
  practicalMarks: z.number().int().min(0).max(20).optional(),
  projectMarks: z.number().int().min(0).max(20).optional(),
});
```

---

## 5. Pagination Standard

List endpoints support standardized pagination parameters:

- `limit`: number of items (default: 25, max: 100)
- `cursor` or `page`: pointer to next page
- Response includes `hasMore` and `nextCursor`.
