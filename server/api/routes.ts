import { authController } from "../../backend/controllers/authController";
import { teacherController } from "../../backend/controllers/teacherController";
import { studentController } from "../../backend/controllers/studentController";
import { marksController } from "../../backend/controllers/marksController";
import { authenticate, requireRole, NextFunction } from "../../backend/middleware/authMiddleware";
import { csrfProtection } from "../middleware/csrf";
import { ControllerRequest, ControllerResponse } from "../../backend/controllers/authController";

/**
 * Route handler descriptor for server router
 */
export interface RouteDefinition {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  middlewares?: Array<
    (req: ControllerRequest, res: ControllerResponse, next: NextFunction) => void
  >;
  handler: (req: ControllerRequest, res: ControllerResponse) => Promise<unknown> | unknown;
}

export const apiRoutes: RouteDefinition[] = [
  // --- AUTHENTICATION ROUTES ---
  {
    method: "POST",
    path: "/api/auth/register",
    middlewares: [csrfProtection],
    handler: (req, res) =>
      authController.register(req as ControllerRequest<Record<string, unknown>>, res),
  },
  {
    method: "POST",
    path: "/api/auth/login",
    middlewares: [csrfProtection],
    handler: (req, res) =>
      authController.login(req as ControllerRequest<{ email: string; password?: string }>, res),
  },
  {
    method: "POST",
    path: "/api/auth/logout",
    middlewares: [csrfProtection],
    handler: (req, res) => authController.logout(req, res),
  },
  {
    method: "GET",
    path: "/api/auth/me",
    handler: (req, res) => authController.getMe(req, res),
  },

  // --- TEACHER ROUTES (Requires Faculty Role) ---
  {
    method: "GET",
    path: "/api/teacher/dashboard",
    middlewares: [authenticate, requireRole("teacher")],
    handler: (req, res) => teacherController.getDashboard(req, res),
  },
  {
    method: "GET",
    path: "/api/teacher/sections",
    middlewares: [authenticate, requireRole("teacher")],
    handler: (req, res) => teacherController.getSections(req, res),
  },
  {
    method: "DELETE",
    path: "/api/teacher/sections/:sectionId",
    middlewares: [authenticate, requireRole("teacher"), csrfProtection],
    handler: (req, res) => teacherController.deleteSection(req, res),
  },
  {
    method: "POST",
    path: "/api/teacher/sections",
    middlewares: [authenticate, requireRole("teacher"), csrfProtection],
    handler: (req, res) =>
      teacherController.createSection(
        req as ControllerRequest<{
          sectionName: string;
          courseName: string;
          academicYear: string;
        }>,
        res,
      ),
  },
  {
    method: "GET",
    path: "/api/teacher/sections/:sectionId/students",
    middlewares: [authenticate, requireRole("teacher")],
    handler: (req, res) => teacherController.getSectionStudents(req, res),
  },
  {
    method: "POST",
    path: "/api/teacher/students",
    middlewares: [authenticate, requireRole("teacher"), csrfProtection],
    handler: (req, res) =>
      teacherController.addStudent(
        req as ControllerRequest<{
          name: string;
          email: string;
          rollNumber: string;
          sectionId: string;
        }>,
        res,
      ),
  },
  {
    method: "PUT",
    path: "/api/teacher/students/:studentId",
    middlewares: [authenticate, requireRole("teacher"), csrfProtection],
    handler: (req, res) =>
      teacherController.updateStudent(
        req as ControllerRequest<{
          name?: string | undefined;
          email?: string | undefined;
          rollNumber?: string | undefined;
        }>,
        res,
      ),
  },
  {
    method: "DELETE",
    path: "/api/teacher/students/:studentId",
    middlewares: [authenticate, requireRole("teacher"), csrfProtection],
    handler: (req, res) => teacherController.removeStudent(req, res),
  },
  {
    method: "POST",
    path: "/api/teacher/assignments",
    middlewares: [authenticate, requireRole("teacher"), csrfProtection],
    handler: (req, res) =>
      teacherController.createAssignment(
        req as ControllerRequest<{
          title: string;
          subject: string;
          description: string;
          sectionId: string;
          deadline: string;
        }>,
        res,
      ),
  },
  {
    method: "GET",
    path: "/api/teacher/assignments",
    middlewares: [authenticate, requireRole("teacher")],
    handler: (req, res) => teacherController.getAssignments(req, res),
  },
  {
    method: "DELETE",
    path: "/api/teacher/assignments/:assignmentId",
    middlewares: [authenticate, requireRole("teacher"), csrfProtection],
    handler: (req, res) => teacherController.deleteAssignment(req, res),
  },
  {
    method: "POST",
    path: "/api/teacher/projects/groups",
    middlewares: [authenticate, requireRole("teacher"), csrfProtection],
    handler: (req, res) =>
      teacherController.createProjectGroup(
        req as ControllerRequest<{
          groupName: string;
          projectTitle: string;
          sectionId: string;
        }>,
        res,
      ),
  },
  {
    method: "GET",
    path: "/api/teacher/projects/requests",
    middlewares: [authenticate, requireRole("teacher")],
    handler: (req, res) => teacherController.getGroupRequests(req, res),
  },
  {
    method: "POST",
    path: "/api/teacher/projects/requests/:requestId/review",
    middlewares: [authenticate, requireRole("teacher"), csrfProtection],
    handler: (req, res) =>
      teacherController.reviewGroupProposal(
        req as ControllerRequest<{ status: "Approved" | "Rejected"; feedback?: string }>,
        res,
      ),
  },
  {
    method: "PATCH",
    path: "/api/teacher/projects/groups/:groupId/status",
    middlewares: [authenticate, requireRole("teacher"), csrfProtection],
    handler: (req, res) =>
      teacherController.setProjectGroupStatus(
        req as ControllerRequest<{ status: "In Progress" | "Completed" | "Pending Review" }>,
        res,
      ),
  },
  {
    method: "GET",
    path: "/api/teacher/announcements",
    middlewares: [authenticate, requireRole("teacher")],
    handler: (req, res) => teacherController.getAnnouncements(req, res),
  },
  {
    method: "DELETE",
    path: "/api/teacher/announcements/:announcementId",
    middlewares: [authenticate, requireRole("teacher"), csrfProtection],
    handler: (req, res) => teacherController.deleteAnnouncement(req, res),
  },
  {
    method: "POST",
    path: "/api/teacher/announcements",
    middlewares: [authenticate, requireRole("teacher"), csrfProtection],
    handler: (req, res) =>
      teacherController.createAnnouncement(
        req as ControllerRequest<{ title: string; content: string; sectionId: string }>,
        res,
      ),
  },
  {
    method: "GET",
    path: "/api/teacher/sections/:sectionId/export-csv",
    middlewares: [authenticate, requireRole("teacher")],
    handler: (req, res) => teacherController.exportCSV(req, res),
  },
  {
    method: "POST",
    path: "/api/teacher/sections/:sectionId/import-csv",
    middlewares: [authenticate, requireRole("teacher"), csrfProtection],
    handler: (req, res) =>
      teacherController.importCSV(req as ControllerRequest<{ csvContent: string }>, res),
  },

  // --- MARKS SPREADSHEET ROUTES ---
  {
    method: "GET",
    path: "/api/marks/section/:sectionId",
    middlewares: [authenticate, requireRole("teacher")],
    handler: (req, res) => marksController.getSectionMarks(req, res),
  },
  {
    method: "PUT",
    path: "/api/marks/update",
    middlewares: [authenticate, requireRole("teacher"), csrfProtection],
    handler: (req, res) =>
      marksController.updateMarks(
        req as ControllerRequest<{ studentId: string; marks: Record<string, unknown> }>,
        res,
      ),
  },
  {
    method: "POST",
    path: "/api/marks/bulk",
    middlewares: [authenticate, requireRole("teacher"), csrfProtection],
    handler: (req, res) =>
      marksController.bulkUpdateMarks(
        req as ControllerRequest<{
          updates: Array<{ studentId: string; marks: Record<string, unknown> }>;
        }>,
        res,
      ),
  },

  // --- STUDENT ROUTES (Restricted) ---
  {
    method: "GET",
    path: "/api/student/dashboard",
    middlewares: [authenticate],
    handler: (req, res) => studentController.getDashboard(req, res),
  },
  {
    method: "GET",
    path: "/api/student/assignments",
    middlewares: [authenticate],
    handler: (req, res) => studentController.getAssignments(req, res),
  },
  {
    method: "GET",
    path: "/api/student/marks",
    middlewares: [authenticate],
    handler: (req, res) => studentController.getMarks(req, res),
  },
  {
    method: "GET",
    path: "/api/student/project-group",
    middlewares: [authenticate],
    handler: (req, res) => studentController.getProjectGroup(req, res),
  },
  {
    method: "POST",
    path: "/api/student/propose-group",
    middlewares: [authenticate, csrfProtection],
    handler: (req, res) =>
      studentController.proposeProjectGroup(
        req as ControllerRequest<{
          proposedGroupName: string;
          proposedTitle: string;
          partnerStudentIds?: string[];
        }>,
        res,
      ),
  },
  {
    method: "GET",
    path: "/api/student/announcements",
    middlewares: [authenticate],
    handler: (req, res) => studentController.getAnnouncements(req, res),
  },
];
