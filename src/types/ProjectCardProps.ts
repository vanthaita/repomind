import { Project } from './Project';
import { GitHubRepoData } from './GitHubRepoData';

export interface ProjectCardProps {
  project: Project;
  repoData?: GitHubRepoData;
  isLoading?: boolean;
  onClick: () => void;
} 