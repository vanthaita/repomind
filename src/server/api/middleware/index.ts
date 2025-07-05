// Rate limiting
export * from './rateLimit';

// Validation
export * from './validation';

// Caching
export * from './caching';

// Re-export commonly used combinations
import { normalRateLimit, apiRateLimit } from './rateLimit';
import { sanitizeInput, paginationMiddleware } from './validation';
import { mediumCache, invalidateCache } from './caching';

// Common middleware combinations
export const apiMiddleware = [normalRateLimit, sanitizeInput];
export const protectedApiMiddleware = [apiRateLimit, sanitizeInput];
export const cachedApiMiddleware = [normalRateLimit, sanitizeInput, mediumCache];
export const mutationMiddleware = [apiRateLimit, sanitizeInput, invalidateCache]; 