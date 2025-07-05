import { ERROR_CODES, ERROR_MESSAGES } from '@/constants/errors';

export class AppError extends Error {
  public code: string;
  public statusCode: number;
  public details?: any;

  constructor(
    code: keyof typeof ERROR_CODES,
    message?: string,
    statusCode: number = 500,
    details?: any
  ) {
    super(message || ERROR_MESSAGES[ERROR_CODES[code]]);
    this.name = 'AppError';
    this.code = ERROR_CODES[code];
    this.statusCode = statusCode;
    this.details = details;
  }
}


export function createErrorResponse(
  code: keyof typeof ERROR_CODES,
  message?: string,
  details?: any
) {
  return {
    success: false,
    error: {
      code: ERROR_CODES[code],
      message: message || ERROR_MESSAGES[ERROR_CODES[code]],
      details,
    },
  };
}


export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Error in async function:', error);
      throw error;
    }
  };
}


export function logError(error: Error, context?: string) {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  };

  console.error('Application Error:', errorInfo);
  
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToErrorTrackingService(errorInfo);
  }
}


export function isNetworkError(error: any): boolean {
  return (
    error.code === 'NETWORK_ERROR' ||
    error.message?.includes('network') ||
    error.message?.includes('fetch') ||
    error.message?.includes('timeout')
  );
}


export function isValidationError(error: any): boolean {
  return (
    error.code === 'VALIDATION_ERROR' ||
    error.message?.includes('validation') ||
    error.message?.includes('invalid')
  );
}


export async function retryWithErrorHandling<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  onError?: (error: Error, attempt: number) => void
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (onError) {
        onError(lastError, attempt);
      }

      if (attempt === maxAttempts) {
        logError(lastError, `Retry failed after ${maxAttempts} attempts`);
        throw lastError;
      }

      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
} 