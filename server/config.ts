export const serverConfig = {
  port: parseInt(process.env["PORT"] || "8080", 10),
  host: process.env["HOST"] || "0.0.0.0",
  nodeEnv: process.env["NODE_ENV"] || "development",
  corsOrigins: (
    process.env["ALLOWED_ORIGINS"] || "http://localhost:8080,http://127.0.0.1:8080"
  ).split(","),
  rateLimits: {
    windowMs: 60 * 1000,
    maxRequests: 120,
  },
  institutionId: process.env["DEFAULT_INSTITUTION_ID"] || "inst-university-main",
};
