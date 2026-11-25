import { serverConfig } from "./config";
import { apiRoutes } from "./api/routes";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "../backend/services/logger";

export interface ServerRuntime {
  config: typeof serverConfig;
  routes: typeof apiRoutes;
  start: () => void;
}

export const server: ServerRuntime = {
  config: serverConfig,
  routes: apiRoutes,
  start: () => {
    logger.info(`Handover Backend Server initialized on port ${serverConfig.port}`, {
      env: serverConfig.nodeEnv,
      endpoints: apiRoutes.length,
    });
  },
};

export default server;
