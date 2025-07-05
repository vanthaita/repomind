import { TRPCError } from '@trpc/server';
import { middleware } from '../trpc';

// Simple in-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (ctx: any) => string;
}

export const createRateLimitMiddleware = (config: RateLimitConfig) => {
  return middleware(async ({ ctx, next, path } ) => {
    const key = config.keyGenerator 
      ? config.keyGenerator(ctx) 
      : ctx.session?.user?.id || ctx.headers.get('x-forwarded-for') || 'anonymous';

    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Clean up old entries
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < windowStart) {
        rateLimitStore.delete(k);
      }
    }

    const current = rateLimitStore.get(key);
    
    if (!current || current.resetTime < windowStart) {
      // First request in window
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
    } else if (current.count >= config.maxRequests) {
      // Rate limit exceeded
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: `Rate limit exceeded. Try again in ${Math.ceil((current.resetTime - now) / 1000)} seconds.`,
      });
    } else {
      // Increment count
      current.count++;
    }

    return next();
  });
};

// Predefined rate limit configurations
export const rateLimitConfigs = {
  strict: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 requests per minute
  normal: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  generous: { maxRequests: 1000, windowMs: 60 * 1000 }, // 1000 requests per minute
  api: { maxRequests: 50, windowMs: 60 * 1000 }, // 50 requests per minute for API calls
} as const;

// Export commonly used middlewares
export const strictRateLimit = createRateLimitMiddleware(rateLimitConfigs.strict);
export const normalRateLimit = createRateLimitMiddleware(rateLimitConfigs.normal);
export const generousRateLimit = createRateLimitMiddleware(rateLimitConfigs.generous);
export const apiRateLimit = createRateLimitMiddleware(rateLimitConfigs.api); 