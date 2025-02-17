import { db } from '@/server/db';
import { Octokit } from 'octokit';
import axios from 'axios';
import { aiSummariesCommit, aiSummariesPullRequest } from './gemini';
import { aiSummariesCommitTogetherAI } from './together';

export const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

type CommitDetails = {
  message: string;
  hash: string;
  authorName: string;
  authorAvatar: string;
  date: string;
};

export const fetchCommitDetails = async (githubUrl: string): Promise<CommitDetails[]> => {
  const [owner, repo] = githubUrl.split('/').slice(-2);
  if (!owner || !repo) {
    throw new Error('Invalid GitHub URL');
  }
  const commitListResponse = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });
  const latestCommits = commitListResponse.data.sort(
    (commitA: any, commitB: any) =>
      new Date(commitB.commit.author.date).getTime() - new Date(commitA.commit.author.date).getTime()
  );

  const commitDetails = latestCommits.slice(0, 15).map((commitItem: any) => ({
    message: commitItem.commit.message,
    hash: commitItem.sha,
    authorName: commitItem.commit.author.name,
    authorAvatar: commitItem.author ? commitItem.author.avatar_url : '',
    date: commitItem.commit.author.date,
  }));
  return commitDetails;
};

export const processCommits = async (projectId: string) => {
  const { githubUrl } = await getProjectGithubUrl(projectId);
  const latestCommitDetails = await fetchCommitDetails(githubUrl);
  const newCommitDetails = await filterProcessedCommits(projectId, latestCommitDetails);
  const aiSummaryResults = await Promise.allSettled(
    newCommitDetails.map((commitDetails) => {
      return summarizeCommit(githubUrl, commitDetails.hash);
    })
  );
  const commitSummaries = aiSummaryResults.map((result) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return '';
  });
  const createdCommits = await db.commit.createMany({
    data: commitSummaries.map((summaryItem, index) => {
      const commitDetails = newCommitDetails[index]!;
      return {
        projectId,
        commitHash: commitDetails.hash,
        commitMessage: commitDetails.message,
        commitAuthorName: commitDetails.authorName,
        commitAuthorAvatar: commitDetails.authorAvatar,
        commitDate: commitDetails.date,
        summary: summaryItem,
      };
    }),
  });
  return createdCommits;
};

const summarizeCommit = async (githubUrl: string, commitHash: string) => {
  const diffData = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: 'application/vnd.github.v3.diff',
    },
  });
  return (await aiSummariesCommitTogetherAI(diffData.data)) as string;
};

const getProjectGithubUrl = async (projectId: string) => {
  const projectRecord = await db.project.findUnique({
    where: { id: projectId },
    select: {
      githubUrl: true,
    },
  });

  if (!projectRecord?.githubUrl) {
    throw new Error('Project not found');
  }

  return { githubUrl: projectRecord.githubUrl };
};

const filterProcessedCommits = async (projectId: string, commitDetails: CommitDetails[]) => {
  const existingCommits = await db.commit.findMany({
    where: { projectId },
    select: { commitHash: true },
  });

  const existingCommitHashes = new Set(existingCommits.map((commit) => commit.commitHash));
  return commitDetails.filter((commitDetails) => !existingCommitHashes.has(commitDetails.hash));
};

type PullRequestDetails = {
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
};

export const fetchPullRequestDetails = async (githubUrl: string): Promise<PullRequestDetails[]> => {
  const [owner, repo] = githubUrl.split('/').slice(-2);
  if (!owner || !repo) {
    throw new Error('Invalid GitHub URL');
  }
  const pullRequestListResponse = await octokit.rest.pulls.list({
    owner,
    repo,
    state: 'all',
    sort: 'updated',
    direction: 'desc',
  });

  return pullRequestListResponse.data.slice(0, 15).map((prItem) => ({
    number: prItem.number,
    title: prItem.title,
    body: prItem.body,
    authorName: prItem.user?.login,
    authorAvatar: prItem.user?.avatar_url,
    status: prItem.state,
    merged: prItem.state === 'open' ? false : true,
    createdAt: prItem.created_at,
    updatedAt: prItem.updated_at,
    mergedAt: prItem.merged_at,
    baseBranch: prItem.base.ref,
    headBranch: prItem.head.ref,
  }));
};

const summarizePullRequest = async (githubUrl: string, prNumber: number) => {
  const [owner, repo] = githubUrl.split('/').slice(-2);
  if (!owner || !repo) {
    throw new Error('Invalid GitHub URL');
  }
  const fileListResponse = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber,
  });
  const commentListResponse = await octokit.rest.pulls.listReviewComments({
    owner,
    repo,
    pull_number: prNumber,
  });
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
  const diffResponse = await axios.get(apiUrl, {
    headers: {
      Accept: 'application/vnd.github.v3.diff',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
    },
  });
  const pullRequestSummary = await aiSummariesPullRequest(diffResponse.data);
  return {
    diff: diffResponse.data,
    comments: commentListResponse.data.map((commentItem) => ({
      body: commentItem.body,
      path: commentItem.path,
      line: commentItem.line,
    })),
    aiAnalysis: pullRequestSummary,
  };
};

const filterProcessedPRs = async (projectId: string, pullRequestDetails: PullRequestDetails[]) => {
  const existingPullRequests = await db.pullRequest.findMany({
    where: { projectId },
    select: { prNumber: true },
  });

  const existingPrNumbers = new Set(existingPullRequests.map((pr) => pr.prNumber));
  return pullRequestDetails.filter((prDetails) => !existingPrNumbers.has(prDetails.number));
};

function removeCodeBlockMarkers(text: string): string {
  return text.replace(/^\s*```json\s*/, '').replace(/\s*```\s*$/, '');
}

export const processPullRequests = async (projectId: string) => {
  const { githubUrl } = await getProjectGithubUrl(projectId);
  const latestPullRequestDetails = await fetchPullRequestDetails(githubUrl);
  const newPullRequestDetails = await filterProcessedPRs(projectId, latestPullRequestDetails);

  const prDetailResults = await Promise.allSettled(
    newPullRequestDetails.map(async (prDetails) => {
      const details = await summarizePullRequest(githubUrl, prDetails.number);
      return { pr: prDetails, details };
    })
  );

  const successfulPrDetails = prDetailResults
    .filter(
      (responseItem): responseItem is PromiseFulfilledResult<{ pr: PullRequestDetails; details: any }> =>
        responseItem.status === 'fulfilled'
    )
    .map((responseItem) => responseItem.value);

  const createdPullRequests = await db.pullRequest.createMany({
    data: successfulPrDetails.map((prDetail) => {
      return {
        projectId,
        prNumber: prDetail.pr.number,
        title: prDetail.pr.title,
        body: prDetail.pr.body,
        authorName: prDetail.pr.authorName,
        authorAvatar: prDetail.pr.authorAvatar,
        status: prDetail.pr.status,
        merged: prDetail.pr.merged as boolean,
        baseBranch: prDetail.pr.baseBranch,
        headBranch: prDetail.pr.headBranch,
        diff: prDetail.details.diff,
        comments: JSON.stringify(prDetail.details.comments),
        aiAnalysis: removeCodeBlockMarkers(prDetail.details.aiAnalysis),
        createdAt: new Date(prDetail.pr.createdAt),
        mergedAt: prDetail.pr.mergedAt ? new Date(prDetail.pr.mergedAt) : null,
      };
    }),
  });
  return createdPullRequests;
};