export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

export class RateLimiter {
  private buckets: Map<string, RateLimitBucket> = new Map();
  private maxTokens: number;
  private refillIntervalMs: number;

  constructor(maxRequests: number, windowSeconds: number) {
    this.maxTokens = maxRequests;
    this.refillIntervalMs = windowSeconds * 1000;
  }

  public check(key: string): RateLimitResult {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = {
        tokens: this.maxTokens - 1,
        lastRefill: now,
      };
      this.buckets.set(key, bucket);
      return {
        allowed: true,
        remaining: bucket.tokens,
        resetSeconds: Math.ceil(this.refillIntervalMs / 1000),
      };
    }

    // Refill tokens based on elapsed time
    const elapsed = now - bucket.lastRefill;
    if (elapsed > this.refillIntervalMs) {
      bucket.tokens = this.maxTokens;
      bucket.lastRefill = now;
    }

    if (bucket.tokens > 0) {
      bucket.tokens -= 1;
      return {
        allowed: true,
        remaining: bucket.tokens,
        resetSeconds: Math.ceil((this.refillIntervalMs - (now - bucket.lastRefill)) / 1000),
      };
    }

    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.ceil((this.refillIntervalMs - (now - bucket.lastRefill)) / 1000),
    };
  }

  public reset(key: string): void {
    this.buckets.delete(key);
  }
}

// Pre-configured rate limiters for critical endpoints:
export const authRateLimiter = new RateLimiter(5, 15 * 60); // 5 attempts per 15 minutes
export const exportRateLimiter = new RateLimiter(10, 60); // 10 exports per minute
export const generalApiLimiter = new RateLimiter(120, 60); // 120 requests per minute
