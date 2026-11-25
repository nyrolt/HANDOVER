# Handover — Permissions Matrix & Authorization Specification

## 1. Role-Based Permissions Matrix

| Resource           | Action                | Teacher (Faculty) |     Student      | Admin | Rules & Scoping Constraints                                                      |
| :----------------- | :-------------------- | :---------------: | :--------------: | :---: | :------------------------------------------------------------------------------- |
| **Section**        | `create:section`      |        ✅         |        ❌        |  ✅   | Must belong to faculty's department / institution.                               |
| **Section**        | `read:section`        |        ✅         |        ✅        |  ✅   | Teachers read assigned sections; students read enrolled section.                 |
| **Section**        | `update:section`      |        ✅         |        ❌        |  ✅   | Only assigned teacher or admin.                                                  |
| **Section**        | `delete:section`      |        ✅         |        ❌        |  ✅   | Only assigned teacher or admin.                                                  |
| **Student Roster** | `create:student`      |        ✅         |        ❌        |  ✅   | Teachers add students to their assigned sections.                                |
| **Student Roster** | `read:student`        |        ✅         |        ✅        |  ✅   | Teachers see section roster; students see own profile + section peers.           |
| **Student Roster** | `update:student`      |        ✅         |        ❌        |  ✅   | Teachers update roll no / section / name.                                        |
| **Student Roster** | `delete:student`      |        ✅         |        ❌        |  ✅   | Teachers remove students from section.                                           |
| **Academic Marks** | `read:marks`          |        ✅         | ⚠️ _(Self only)_ |  ✅   | **Students strictly limited to own marks record**. Peer access is blocked.       |
| **Academic Marks** | `update:marks`        |        ✅         |        ❌        |  ❌   | **Students CANNOT modify marks under any circumstances**. Strictly teacher-only. |
| **Project Group**  | `create:group`        |        ✅         |        ❌        |  ✅   | Official group creation is reserved for teachers/admins.                         |
| **Project Group**  | `read:group`          |        ✅         |        ✅        |  ✅   | Read-only discovery within assigned section.                                     |
| **Project Group**  | `update:group`        |        ✅         |        ❌        |  ✅   | Edit group name, title, guide, milestone marks.                                  |
| **Project Group**  | `delete:group`        |        ✅         |        ❌        |  ✅   | Delete group; reverts members to unassigned.                                     |
| **Group Proposal** | `propose:group`       |        ❌         |        ✅        |  ❌   | Enrolled unassigned students can submit proposals for teacher authorization.     |
| **Group Proposal** | `review:proposal`     |        ✅         |        ❌        |  ✅   | Teachers approve or reject pending student proposals.                            |
| **Assignment**     | `create:assignment`   |        ✅         |        ❌        |  ✅   | Teachers post coursework for their sections.                                     |
| **Assignment**     | `read:assignment`     |        ✅         |        ✅        |  ✅   | Students view assignments posted in their section.                               |
| **Assignment**     | `update:assignment`   |        ✅         |        ❌        |  ✅   | Teacher only.                                                                    |
| **Assignment**     | `delete:assignment`   |        ✅         |        ❌        |  ✅   | Teacher only.                                                                    |
| **Announcement**   | `create:announcement` |        ✅         |        ❌        |  ✅   | Teacher broadcast to section.                                                    |
| **Announcement**   | `read:announcement`   |        ✅         |        ✅        |  ✅   | Visible to section members.                                                      |
| **Announcement**   | `delete:announcement` |        ✅         |        ❌        |  ✅   | Teacher only.                                                                    |

---

## 2. Centralized Authorization Function: `can()`

All authorization checks are routed through a single deterministic function:

```ts
can(user: User | null, action: PermissionAction, resource: PermissionResource, context?: PermissionContext): boolean
```

### Authorization Guarantees:

1. **Unauthenticated Access**: `can(null, ...)` returns `false`.
2. **Student Marks Privacy**: A student can only perform `read:marks` if `context.targetStudentId === user.studentProfileId`. Any other student ID returns `false`.
3. **Student Marks Mutation Protection**: Any call by a student to `update:marks` throws an explicit authorization rejection (`FORBIDDEN`).
4. **Tenant Isolation**: If `context.sectionId` does not match the student's enrolled `sectionId`, access returns `false`.
5. **Server as Source of Truth**: UI components call `can()` to toggle display states, but services call `assertCan()` before reading or writing any data.
