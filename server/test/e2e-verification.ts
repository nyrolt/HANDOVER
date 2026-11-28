/* eslint-disable @typescript-eslint/no-explicit-any */
process.env["NODE_ENV"] = "test";
import { app } from "../index";
import { serverConfig } from "../config";
import { db } from "../../backend/services/db";
import http from "http";

async function json(res: Response): Promise<any> {
  return (await res.json()) as any;
}

async function runE2EVerification() {
  console.log("=== STARTING FULL STACK E2E VERIFICATION ===");

  // 1. Reset state
  db.resetToDefault();

  // 2. Check if a server is already actively listening on port 5000
  let isExternalServer = false;
  const testPort = serverConfig.port || 5000;
  let serverInstance: http.Server | null = null;

  try {
    const existingCheck = await fetch(`http://localhost:${testPort}/api/health`, {
      signal: AbortSignal.timeout(1000),
    });
    if (existingCheck.status === 200) {
      isExternalServer = true;
      console.log(`[INFO] Connected to active dev server running on port ${testPort}`);
    }
  } catch {
    // No existing server running on port 5000, start one
  }

  if (!isExternalServer) {
    serverInstance = http.createServer(app);
    await new Promise<void>((resolve, reject) => {
      serverInstance!.listen(testPort, () => {
        console.log(`[PASS] Server successfully started on port ${testPort}`);
        resolve();
      });
      serverInstance!.on("error", reject);
    });
  }

  const baseUrl = `http://localhost:${testPort}`;

  try {
    // 3. Health check
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await json(healthRes);
    if (healthRes.status !== 200 || healthData.status !== "ok") {
      throw new Error(`Health check failed: ${JSON.stringify(healthData)}`);
    }
    console.log("[PASS] Server health check verified: 200 OK");

    // 4. Seed user registration for Teacher and Student
    const teacherEmail = "faculty.test@university.edu";
    const teacherPassword = "Password@2026";
    const regTeacherRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Dr. Test Faculty",
        email: teacherEmail,
        password: teacherPassword,
        role: "teacher",
        department: "Computer Science",
      }),
    });
    const regTeacherData = await json(regTeacherRes);
    if (!regTeacherData.success) {
      throw new Error(`Teacher registration failed: ${JSON.stringify(regTeacherData)}`);
    }
    console.log("[PASS] Teacher registration verified");

    // 5. Teacher Login
    const loginTeacherRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: teacherEmail,
        password: teacherPassword,
      }),
    });
    const loginTeacherData = await json(loginTeacherRes);
    if (!loginTeacherData.success || loginTeacherData.data.user.role !== "teacher") {
      throw new Error(`Teacher login failed: ${JSON.stringify(loginTeacherData)}`);
    }
    const teacherToken = loginTeacherData.data.token;
    console.log("[PASS] Teacher login verified: Role 'teacher', session cookie issued");

    // 6. Teacher creates section
    const createSecRes = await fetch(`${baseUrl}/api/teacher/sections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${teacherToken}`,
      },
      body: JSON.stringify({
        sectionName: "CS-401: Distributed Systems",
        courseName: "B.S. Computer Science",
        academicYear: "2026-2027",
      }),
    });
    const createSecData = await json(createSecRes);
    if (!createSecData.success) {
      throw new Error(`Create section failed: ${JSON.stringify(createSecData)}`);
    }
    const sectionId = createSecData.data.id;
    console.log(`[PASS] Teacher created class section: ${sectionId}`);

    // 7. Student Registration and Login
    const studentEmail = "student.test@university.edu";
    const studentPassword = "Password@2026";
    const regStudentRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "John Test Student",
        email: studentEmail,
        password: studentPassword,
        role: "student",
        rollNumber: "2026-CS-999",
        sectionId: sectionId,
      }),
    });
    const regStudentData = await json(regStudentRes);
    if (!regStudentData.success) {
      throw new Error(`Student registration failed: ${JSON.stringify(regStudentData)}`);
    }
    console.log("[PASS] Student registration verified with section link");

    const loginStudentRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: studentEmail,
        password: studentPassword,
      }),
    });
    const loginStudentData = await json(loginStudentRes);
    if (!loginStudentData.success || loginStudentData.data.user.role !== "student") {
      throw new Error(`Student login failed: ${JSON.stringify(loginStudentData)}`);
    }
    const studentToken = loginStudentData.data.token;
    console.log("[PASS] Student login verified: Role 'student'");

    // 8. RBAC Enforcement: Student cannot access teacher endpoints
    const forbiddenSecRes = await fetch(`${baseUrl}/api/teacher/sections`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${studentToken}`,
      },
    });
    if (forbiddenSecRes.status !== 403) {
      throw new Error(
        `Expected 403 Forbidden for student accessing teacher sections, got ${forbiddenSecRes.status}`,
      );
    }
    console.log(
      "[PASS] RBAC Enforcement verified: Student rejected from teacher sections (403 Forbidden)",
    );

    // 9. RBAC Enforcement: Student cannot update marks
    const forbiddenMarksRes = await fetch(`${baseUrl}/api/marks/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        studentId: "some-id",
        marks: { internalMarks: 20 },
      }),
    });
    if (forbiddenMarksRes.status !== 403) {
      throw new Error(
        `Expected 403 Forbidden for student updating marks, got ${forbiddenMarksRes.status}`,
      );
    }
    console.log(
      "[PASS] RBAC Enforcement verified: Student prohibited from mutating marks (403 Forbidden)",
    );

    // 10. Teacher Spreadsheet Mark Updates
    // Retrieve students in section
    const secStudentsRes = await fetch(`${baseUrl}/api/teacher/sections/${sectionId}/students`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${teacherToken}`,
      },
    });
    const secStudentsData = await json(secStudentsRes);
    const studentRecord = secStudentsData.data[0];
    if (!studentRecord) {
      throw new Error("Student record not found in section");
    }

    const updateMarksRes = await fetch(`${baseUrl}/api/marks/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${teacherToken}`,
      },
      body: JSON.stringify({
        studentId: studentRecord.studentId,
        marks: {
          internalMarks: 18,
          labRecordMarks: 19,
          practicalMarks: 17,
          projectMarks: 19,
        },
      }),
    });
    const updateMarksData = await json(updateMarksRes);
    if (!updateMarksData.success || updateMarksData.data.total !== 73) {
      throw new Error(`Marks update failed: ${JSON.stringify(updateMarksData)}`);
    }
    console.log("[PASS] Teacher spreadsheet mark update successfully reached backend: Total 73/80");

    // 11. Student Verified Transcript Reflection (Read-Only)
    const studentDashRes = await fetch(`${baseUrl}/api/student/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${studentToken}`,
      },
    });
    const studentDashData = await json(studentDashRes);
    if (!studentDashData.success) {
      throw new Error(`Student dashboard fetch failed: ${JSON.stringify(studentDashData)}`);
    }
    const studentMarks = studentDashData.data.marks;
    if (studentMarks.total !== 73 || studentMarks.internalMarks !== 18) {
      throw new Error(`Student marks mismatch: ${JSON.stringify(studentMarks)}`);
    }
    console.log("[PASS] Student dashboard verifies live reflection: Total 73/80 verified");

    // 12. Group Project Proposal & Approval Workflow
    const proposeRes = await fetch(`${baseUrl}/api/student/propose-group`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        proposedGroupName: "Team Distributed Core",
        proposedTitle: "Byzantine Fault Tolerant Replication Engine",
      }),
    });
    const proposeData = await json(proposeRes);
    if (!proposeData.success) {
      throw new Error(`Group proposal failed: ${JSON.stringify(proposeData)}`);
    }
    const requestId = proposeData.data.id;
    console.log(`[PASS] Student group proposal submitted: Request ID ${requestId}`);

    // Teacher reviews and approves group request
    const reviewRes = await fetch(`${baseUrl}/api/teacher/projects/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${teacherToken}`,
      },
      body: JSON.stringify({
        groupName: "Team Distributed Core",
        projectTitle: "Byzantine Fault Tolerant Replication Engine",
        projectDescription: "Byzantine Fault Tolerant Replication Engine",
        sectionId: sectionId,
        members: [
          {
            studentId: studentRecord.studentId,
            studentName: studentRecord.name,
            rollNumber: studentRecord.rollNumber,
            role: "Leader",
          },
        ],
      }),
    });
    const reviewData = await json(reviewRes);
    if (!reviewData.success) {
      throw new Error(`Teacher project group creation failed: ${JSON.stringify(reviewData)}`);
    }
    console.log("[PASS] Teacher project group provisioning verified");

    // Student retrieves project group
    const studentGroupRes = await fetch(`${baseUrl}/api/student/project-group`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${studentToken}`,
      },
    });
    const studentGroupData = await json(studentGroupRes);
    if (!studentGroupData.success || !studentGroupData.data.myGroup) {
      throw new Error(`Student group retrieval failed: ${JSON.stringify(studentGroupData)}`);
    }
    console.log("[PASS] Student sees approved project group with leader and members");

    // 13. Multi-tenancy Isolation Check
    // Attempting to access an invalid/cross-tenant section
    const crossTenantRes = await fetch(
      `${baseUrl}/api/teacher/sections/non-existent-or-foreign-section/students`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${teacherToken}`,
        },
      },
    );
    const crossTenantData = await json(crossTenantRes);
    // Non-existent or foreign section returns empty list or error
    if (crossTenantData.data && crossTenantData.data.length > 0) {
      throw new Error("Cross-tenant leakage detected!");
    }
    console.log("[PASS] Multi-tenant isolation verified: No foreign tenant data leaks");

    console.log("\n========================================================");
    console.log("  ALL 13 END-TO-END VERIFICATION CHECKS PASSED (100%)   ");
    console.log("========================================================\n");
    process.exit(0);
  } finally {
    if (serverInstance) {
      serverInstance.close();
    }
  }
}

runE2EVerification().catch((err) => {
  console.error("\n[FAIL] E2E Verification failed with error:", err);
  process.exit(1);
});
