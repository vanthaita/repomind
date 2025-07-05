// Standard API response utilities

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  meta?: {
    timestamp: string;
    version?: string;
  };
}

// Success response helpers
export const createSuccessResponse = <T>(
  data: T,
  message?: string,
  meta?: Record<string, any>
): ApiResponse<T> => ({
  success: true,
  data,
  message,
  meta: {
    timestamp: new Date().toISOString(),
    ...meta,
  },
});

export const createPaginatedResponse = <T>(
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  message?: string
): ApiResponse<T[]> => ({
  success: true,
  data,
  message,
  pagination: {
    ...pagination,
    pages: Math.ceil(pagination.total / pagination.limit),
  },
  meta: {
    timestamp: new Date().toISOString(),
  },
});

// Error response helpers
export const createErrorResponse = (
  code: string,
  message: string,
  details?: any
): ApiResponse => ({
  success: false,
  error: {
    code,
    message,
    details,
  },
  meta: {
    timestamp: new Date().toISOString(),
  },
});

// Validation response helpers
export const createValidationErrorResponse = (
  errors: Record<string, string[]>
): ApiResponse => ({
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    details: errors,
  },
  meta: {
    timestamp: new Date().toISOString(),
  },
});

// Common response patterns
export const responses = {
  created: <T>(data: T, message = 'Resource created successfully') =>
    createSuccessResponse(data, message),
  
  updated: <T>(data: T, message = 'Resource updated successfully') =>
    createSuccessResponse(data, message),
  
  deleted: (message = 'Resource deleted successfully') =>
    createSuccessResponse(null, message),
  
  notFound: (resource = 'Resource') =>
    createErrorResponse('NOT_FOUND', `${resource} not found`),
  
  unauthorized: (message = 'Unauthorized') =>
    createErrorResponse('UNAUTHORIZED', message),
  
  forbidden: (message = 'Forbidden') =>
    createErrorResponse('FORBIDDEN', message),
  
  conflict: (message = 'Resource conflict') =>
    createErrorResponse('CONFLICT', message),
  
  tooManyRequests: (message = 'Too many requests') =>
    createErrorResponse('TOO_MANY_REQUESTS', message),
  
  internalError: (message = 'Internal server error') =>
    createErrorResponse('INTERNAL_SERVER_ERROR', message),
}; 