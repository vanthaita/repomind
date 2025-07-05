export interface Project {
  id: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  githubUrl?: string;
  githubToken?: string;
  delete?: Date;
} 