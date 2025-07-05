import { TRPCError } from '@trpc/server';

// Custom error codes
export const ErrorCodes = {
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // Validation errors
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  
  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  
  // Rate limiting
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  
  // Server errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // External service errors
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  GITHUB_API_ERROR: 'GITHUB_API_ERROR',
} as const;

// Error factory functions
export const createError = {
  unauthorized: (message = 'Unauthorized') => 
    new TRPCError({ code: 'UNAUTHORIZED', message }),
  
  forbidden: (message = 'Forbidden') => 
    new TRPCError({ code: 'FORBIDDEN', message }),
  
  badRequest: (message = 'Bad request') => 
    new TRPCError({ code: 'BAD_REQUEST', message }),
  
  validationError: (message = 'Validation failed', cause?: any) => 
    new TRPCError({ code: 'BAD_REQUEST', message, cause }),
  
  notFound: (resource = 'Resource') => 
    new TRPCError({ code: 'NOT_FOUND', message: `${resource} not found` }),
  
  conflict: (message = 'Resource conflict') => 
    new TRPCError({ code: 'CONFLICT', message }),
  
  tooManyRequests: (message = 'Too many requests') => 
    new TRPCError({ code: 'TOO_MANY_REQUESTS', message }),
  
  internalError: (message = 'Internal server error') => 
    new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message }),
  
  serviceUnavailable: (message = 'Service unavailable') => 
    new TRPCError({ code: 'SERVICE_UNAVAILABLE', message }),
  
  externalServiceError: (service: string, message?: string) => 
    new TRPCError({ 
      code: 'INTERNAL_SERVER_ERROR', 
      message: message || `${service} service error` 
    }),
  
  githubError: (message = 'GitHub API error') => 
    new TRPCError({ 
      code: 'INTERNAL_SERVER_ERROR', 
      message 
    }),
};

// Error handling utilities
export const handleError = (error: unknown): TRPCError => {
  if (error instanceof TRPCError) {
    return error;
  }
  
  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('GitHub')) {
      return createError.githubError(error.message);
    }
    
    if (error.message.includes('validation')) {
      return createError.validationError(error.message);
    }
    
    // Default to internal error
    return createError.internalError(error.message);
  }
  
  // Unknown error
  return createError.internalError('An unknown error occurred');
};

// Error logging
export const logError = (error: TRPCError, context?: any) => {
  const logData = {
    code: error.code,
    message: error.message,
    cause: error.cause,
    context,
    timestamp: new Date().toISOString(),
  };
  
  console.error('[API Error]', JSON.stringify(logData, null, 2));
  
  // In production, you might want to send this to a logging service
  // like Sentry, LogRocket, etc.
};

// Error response formatter
export const formatErrorResponse = (error: TRPCError) => {
  return {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      ...(error.cause && { cause: error.cause }),
    },
    timestamp: new Date().toISOString(),
  };
}; 