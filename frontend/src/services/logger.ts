export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  userId?: string;
  role?: string;
  institutionId?: string;
  sectionId?: string;
  requestId?: string;
  [key: string]: unknown;
}

const REDACTED_KEYS = new Set([
  "password",
  "token",
  "secret",
  "authorization",
  "cookie",
  "apiKey",
  "hash",
  "creditCard",
]);

function redactSensitive(obj: unknown): unknown {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(redactSensitive);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
    if (REDACTED_KEYS.has(key.toLowerCase())) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof val === "object" && val !== null) {
      sanitized[key] = redactSensitive(val);
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

class StructuredLogger {
  private isProduction: boolean;

  constructor() {
    this.isProduction = typeof process !== "undefined" && process.env["NODE_ENV"] === "production";
  }

  private emit(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    // Suppress debug logs in production
    if (this.isProduction && level === "debug") return;

    const payload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      requestId: context?.requestId || "req_" + Math.random().toString(36).slice(2, 9),
      userId: context?.userId,
      role: context?.role,
      institutionId: context?.institutionId,
      sectionId: context?.sectionId,
      metadata: context ? redactSensitive(context) : undefined,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: this.isProduction ? undefined : error.stack,
          }
        : undefined,
    };

    const serialized = JSON.stringify(payload);

    switch (level) {
      case "error":
        console.error(serialized);
        break;
      case "warn":
        console.warn(serialized);
        break;
      case "info":
        console.info(serialized);
        break;
      case "debug":
        console.debug(serialized);
        break;
    }
  }

  public debug(message: string, context?: LogContext): void {
    this.emit("debug", message, context);
  }

  public info(message: string, context?: LogContext): void {
    this.emit("info", message, context);
  }

  public warn(message: string, context?: LogContext, error?: Error): void {
    this.emit("warn", message, context, error);
  }

  public error(message: string, error?: Error, context?: LogContext): void {
    this.emit("error", message, context, error);
  }
}

export const logger = new StructuredLogger();
