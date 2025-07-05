// Status Constants
export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export const PULL_REQUEST_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  MERGED: 'merged',
} as const;

export const COMMIT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const; 