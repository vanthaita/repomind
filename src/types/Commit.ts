import { Project } from './Project';

export interface Commit {
  id: string;
  created_at: Date;
  updated_at: Date;
  projectId: string;
  project: Project;
  commitMessage: string;
  commitHash: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: Date;
  summary: string;
} 