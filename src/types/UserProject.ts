import { User } from './User';
import { Project } from './Project';

export interface UserProject {
  id: string;
  created_at: Date;
  updated_at: Date;
  userId: string;
  projectId: string;
  user: User;
  project: Project;
} 