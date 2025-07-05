// Cache Constants
export const CACHE_KEYS = {
  PROJECTS: 'projects',
  COMMITS: 'commits',
  PULL_REQUESTS: 'pull-requests',
  CONVERSATIONS: 'conversations',
  USER_PROFILE: 'user-profile',
  GITHUB_REPO_DATA: 'github-repo-data',
} as const;

export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
  VERY_LONG: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const; 