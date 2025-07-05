import { Project } from './Project';

export interface PullRequest {
  id: string;
  projectId: string;
  project: Project;
  prNumber: number;
  title: string;
  body?: string;
  authorName?: string;
  authorAvatar?: string;
  status: string;
  merged: boolean;
  baseBranch: string;
  headBranch: string;
  diff?: string;
  comments?: string;
  aiAnalysis?: string;
  createdAt: Date;
  mergedAt?: Date;
} 