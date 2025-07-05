import { middleware } from "../trpc";


// Simple in-memory cache
const cache = new Map<string, { data: any; expires: number }>();

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  key?: (ctx: any, input: any) => string;
}

export const createCacheMiddleware = (config: CacheConfig) => {
  return middleware(async ({ ctx, input, next, path }) => {
    const cacheKey = config.key 
      ? config.key(ctx, input)
      : `${path}:${JSON.stringify(input)}`;

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }

    // Execute and cache result
    const result = await next();
    
    cache.set(cacheKey, {
      data: result,
      expires: Date.now() + config.ttl,
    });

    return result;
  });
};

// Cache invalidation middleware
export const invalidateCache = middleware(async ({ ctx, next, path }) => {
  const result = await next();
  
  // Clear cache for this path
  for (const [key] of cache.entries()) {
    if (key.startsWith(path)) {
      cache.delete(key);
    }
  }
  
  return result;
});

// Predefined cache configurations
export const cacheConfigs = {
  short: { ttl: 5 * 60 * 1000 }, // 5 minutes
  medium: { ttl: 15 * 60 * 1000 }, // 15 minutes
  long: { ttl: 60 * 60 * 1000 }, // 1 hour
  user: { ttl: 30 * 60 * 1000 }, // 30 minutes
} as const;

// Export commonly used cache middlewares
export const shortCache = createCacheMiddleware(cacheConfigs.short);
export const mediumCache = createCacheMiddleware(cacheConfigs.medium);
export const longCache = createCacheMiddleware(cacheConfigs.long);
export const userCache = createCacheMiddleware(cacheConfigs.user);

// Cache utilities
export const clearCache = (pattern?: string) => {
  if (pattern) {
    for (const [key] of cache.entries()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
};

export const getCacheStats = () => {
  const now = Date.now();
  let validEntries = 0;
  let expiredEntries = 0;
  
  for (const [, value] of cache.entries()) {
    if (value.expires > now) {
      validEntries++;
    } else {
      expiredEntries++;
    }
  }
  
  return {
    total: cache.size,
    valid: validEntries,
    expired: expiredEntries,
  };
}; 