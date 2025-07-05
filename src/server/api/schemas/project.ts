import { z } from 'zod';

// Base project schema
export const projectBaseSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name too long'),
  githubUrl: z.string().url('Invalid GitHub URL'),
  githubToken: z.string().optional(),
});

// Create project schema
export const createProjectSchema = projectBaseSchema.extend({
  description: z.string().max(500, 'Description too long').optional(),
  isPublic: z.boolean().default(false),
});

// Update project schema
export const updateProjectSchema = projectBaseSchema.partial().extend({
  id: z.string().uuid('Invalid project ID'),
});

// Project filters schema
export const projectFiltersSchema = z.object({
  search: z.string().optional(),
  isPublic: z.boolean().optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Project pagination schema
export const projectPaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
});

// Get projects with filters and pagination
export const getProjectsSchema = projectFiltersSchema.merge(projectPaginationSchema);

// Project ID schema
export const projectIdSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
});

// GitHub import schema
export const githubImportSchema = projectIdSchema.extend({
  githubUrl: z.string().url('Invalid GitHub URL'),
  githubToken: z.string().min(1, 'GitHub token is required'),
  importCommits: z.boolean().default(true),
  importPullRequests: z.boolean().default(true),
  importIssues: z.boolean().default(false),
});

// Export types
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type GetProjectsInput = z.infer<typeof getProjectsSchema>;
export type ProjectIdInput = z.infer<typeof projectIdSchema>;
export type GithubImportInput = z.infer<typeof githubImportSchema>; 