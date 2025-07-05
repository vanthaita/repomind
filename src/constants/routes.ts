// Navigation Constants
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  NEW_PROJECT: '/dashboard/new-project',
  PROJECT: '/dashboard/[id]',
  PROJECT_CHATS: '/dashboard/[id]/chats',
  PROJECT_COMMITS: '/dashboard/[id]/commits',
  PROJECT_PULL_REQUESTS: '/dashboard/[id]/pull-requests',
  ABOUT: '/about',
  CONTACT: '/contact',
  BLOG: '/blog',
  DOCS: '/docs',
} as const;

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.NEW_PROJECT,
  ROUTES.PROJECT,
  ROUTES.PROJECT_CHATS,
  ROUTES.PROJECT_COMMITS,
  ROUTES.PROJECT_PULL_REQUESTS,
] as const; 