import { z } from "zod";

const EnvSchema = z.object({
  VITE_APP_ENV: z.enum(["development", "staging", "production"]).default("development"),
  VITE_APP_URL: z.string().url().default("http://localhost:3000"),
  VITE_API_BASE_URL: z.string().optional().default(""),
  VITE_SENTRY_DSN: z.string().optional().default(""),
  VITE_DEFAULT_INSTITUTION_ID: z.string().default("inst-college-1"),
});

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(): Env {
  const metaEnv = import.meta.env as Record<string, string | undefined>;
  const raw = {
    VITE_APP_ENV: metaEnv["VITE_APP_ENV"] || "development",
    VITE_APP_URL: metaEnv["VITE_APP_URL"] || "http://localhost:3000",
    VITE_API_BASE_URL: metaEnv["VITE_API_BASE_URL"] || "",
    VITE_SENTRY_DSN: metaEnv["VITE_SENTRY_DSN"] || "",
    VITE_DEFAULT_INSTITUTION_ID: metaEnv["VITE_DEFAULT_INSTITUTION_ID"] || "inst-college-1",
  };

  const parsed = EnvSchema.safeParse(raw);

  if (!parsed.success) {
    console.error("❌ Invalid environment configuration:", parsed.error.format());
    throw new Error(
      "Startup aborted: Environment variables failed validation. Check .env.example.",
    );
  }

  return parsed.data;
}

export const env = validateEnv();
