// Error Constants
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  GITHUB_API_ERROR: 'GITHUB_API_ERROR',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.UNAUTHORIZED]: 'You must be logged in to access this resource',
  [ERROR_CODES.FORBIDDEN]: 'You do not have permission to access this resource',
  [ERROR_CODES.NOT_FOUND]: 'The requested resource was not found',
  [ERROR_CODES.VALIDATION_ERROR]: 'The provided data is invalid',
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'An internal server error occurred',
  [ERROR_CODES.NETWORK_ERROR]: 'A network error occurred',
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded. Please try again later',
  [ERROR_CODES.GITHUB_API_ERROR]: 'GitHub API error occurred',
  [ERROR_CODES.AI_SERVICE_ERROR]: 'AI service error occurred',
} as const; 