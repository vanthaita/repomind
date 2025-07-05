export interface PullRequestDetails {
  number: number;
  title: string;
  body: string | null;
  authorName: string | undefined;
  authorAvatar: string | undefined;
  status: string;
  merged: boolean | null;
  createdAt: string;
  updatedAt: string;
  mergedAt: string | null;
  baseBranch: string;
  headBranch: string;
} 