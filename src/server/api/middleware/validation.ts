import { TRPCError } from '@trpc/server';
import { middleware } from '../trpc';
import { z } from 'zod';

// Enhanced validation middleware
export const createValidationMiddleware = <T extends z.ZodTypeAny>(schema: T) => {
  return middleware(async ({ input, next }) => {
    try {
      const validatedInput = schema.parse(input);
      return next({
        ctx: {
          validatedInput,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Validation failed',
          cause: error,
        });
      }
      throw error;
    }
  });
};

// Input sanitization middleware
export const sanitizeInput = middleware(async ({ input, next }) => {
  if (typeof input === 'object' && input !== null) {
    const sanitized = sanitizeObject(input);
    return next({
      ctx: {
        sanitizedInput: sanitized,
      },
    });
  }
  return next();
});

// Sanitize object recursively
function sanitizeObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = value.trim();
      } else {
        sanitized[key] = sanitizeObject(value);
      }
    }
    return sanitized;
  }
  
  return obj;
}

// Pagination validation middleware
export const paginationMiddleware = middleware(async ({ input, next }) => {
  const paginationSchema = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
  });

  try {
    const { page, limit } = paginationSchema.parse(input);
    return next({
      ctx: {
        pagination: { page, limit },
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid pagination parameters',
    });
  }
}); 