import { Project } from './Project';

export interface SourceCodeEmbedding {
  id: string;
  created_at: Date;
  updated_at: Date;
  summaryEmbedding?: any; // vector(768)
  sourceCode: string;
  fileName: string;
  summary: string;
  projectId: string;
  project: Project;
} 