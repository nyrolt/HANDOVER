export const serverConfig = {
  port: parseInt(process.env["PORT"] || "5000", 10),
  host: process.env["HOST"] || "0.0.0.0",
  nodeEnv: process.env["NODE_ENV"] || "development",
  corsOrigins: (
    process.env["ALLOWED_ORIGINS"] ||
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5000,http://127.0.0.1:5000"
  ).split(","),
  rateLimits: {
    windowMs: 60 * 1000,
    maxRequests: 120,
  },
  institutionId: process.env["DEFAULT_INSTITUTION_ID"] || "inst-university-main",
};
