// Centralized Backend Module Entrypoint
export * from "./models/types";
export * from "./services/auth";
export * from "./services/db";
export * from "./services/permissions";
export * from "./services/teacher";
export * from "./services/student";
export * from "./services/rate-limiter";
export * from "./services/logger";
export * from "./services/validators";

export * from "./controllers/authController";
export * from "./controllers/teacherController";
export * from "./controllers/studentController";
export * from "./controllers/marksController";

export * from "./middleware/authMiddleware";
