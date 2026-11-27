import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { serverConfig } from "./config";
import { apiRoutes } from "./api/routes";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "../backend/services/logger";

export const app = express();

// Middleware configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || serverConfig.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly fallback
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token", "X-Requested-With"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check Endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    app: "Handover API Server",
    port: serverConfig.port,
    timestamp: new Date().toISOString(),
  });
});

// Dynamic mounting of centralized API routes from server/api/routes.ts
apiRoutes.forEach((route) => {
  const method = route.method.toLowerCase() as "get" | "post" | "put" | "delete" | "patch";
  const middlewares = (route.middlewares || []).map(
    (mw) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        mw(
          req as unknown as Parameters<typeof mw>[0],
          res as unknown as Parameters<typeof mw>[1],
          next as unknown as Parameters<typeof mw>[2],
        );
      } catch (err) {
        next(err);
      }
    },
  );

  app[method](
    route.path,
    ...middlewares,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        await route.handler(
          req as unknown as Parameters<typeof route.handler>[0],
          res as unknown as Parameters<typeof route.handler>[1],
        );
      } catch (err) {
        next(err);
      }
    },
  );
});

import { fileURLToPath } from "url";
import path from "path";

// Centralized error handling
app.use(
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    errorHandler(err, _req, res as unknown as Parameters<typeof errorHandler>[2]);
  },
);

const isMainModule = () => {
  if (!process.argv[1]) return false;
  try {
    const currentFilePath = fileURLToPath(import.meta.url);
    const entryPath = path.resolve(process.argv[1]);
    return (
      currentFilePath === entryPath ||
      entryPath.endsWith(path.join("server", "index.ts")) ||
      entryPath.endsWith(path.join("server", "index.js"))
    );
  } catch {
    return false;
  }
};

// Start listener only when run directly and not in test environment
if (process.env["NODE_ENV"] !== "test" && isMainModule()) {
  const listener = app.listen(serverConfig.port, () => {
    logger.info(`Handover REST API Server running on http://localhost:${serverConfig.port}`, {
      port: serverConfig.port,
      env: serverConfig.nodeEnv,
      endpoints: apiRoutes.length + 1,
    });
  });

  listener.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      logger.error(`Port ${serverConfig.port} is already in use by another active server process.`);
    } else {
      logger.error(`Server listener error: ${err.message}`);
    }
  });
}

export default app;
