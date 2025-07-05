// Project schemas
export * from './project';

// Conversation schemas
export * from './conversation';

// Common schemas
export const commonSchemas = {
  id: z.string().uuid('Invalid ID'),
  pagination: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
  }),
  search: z.object({
    query: z.string().min(1, 'Search query is required'),
  }),
  sort: z.object({
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
} as const;

import { z } from 'zod'; 