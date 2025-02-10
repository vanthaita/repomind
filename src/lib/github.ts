import { db } from '@/server/db';
import { Octokit } from 'octokit';
import axios from 'axios'
import { aiSummariesCommit, aiSummariesPullRequest } from './gemini';
import { aiSummariesCommitLocal } from './ollama';
import { aiSummariesCommitTogetherAI } from './together';
export const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

type Response = {
  commitMessage: string;
  commitHash: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};
export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    const [owner, repo] = githubUrl.split('/').slice(-2);
    if(!owner || !repo) {
        throw new Error('Invalid GitHub URL');
    }
    const { data } = await octokit.rest.repos.listCommits({
        owner,
        repo,
    });
    const sortedCommits = data.sort(
        (a: any, b: any) =>
        new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()
    );

    const formattedCommits = sortedCommits.slice(0, 15).map((commit: any) => ({
        commitMessage: commit.commit.message,
        commitHash: commit.sha,
        commitAuthorName: commit.commit.author.name,
        commitAuthorAvatar: commit.author ? commit.author.avatar_url : '',
        commitDate: commit.commit.author.date,
    }));
    return formattedCommits;
};

export const pollCommits = async (projectId: string) => {
    const { githubUrl } = await fetchProjectGithubUrl(projectId);
    const currentCommitHashes = await getCommitHashes(githubUrl);
    const unprocessedCommits = await filterUnprocessedCommits(projectId, currentCommitHashes);
    const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit => {
        return summariseCommit(githubUrl, commit.commitHash);
    }))
    const summaries = summaryResponses.map((response) => {
        if(response.status === 'fulfilled') {
            return response.value;
        }
        return "" 
    })
    const commits = await db.commit.createMany({
        data: summaries.map((summary, index) => {
            return {
                projectId,
                commitHash: unprocessedCommits[index]!.commitHash,
                commitMessage: unprocessedCommits[index]!.commitMessage,
                commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
                commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
                commitDate: unprocessedCommits[index]!.commitDate,
                summary,
            };
        })
    })
    return commits;
};
const summariseCommit = async (githubUrl: string, commitHash: string) => {
    const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
        headers: {
            Accept: 'application/vnd.github.v3.diff',
        },
    })
    // return await aiSummariesCommit(data);
    // return await aiSummariesCommitLocal(data);
    return await aiSummariesCommitTogetherAI(data) as string

}
const fetchProjectGithubUrl = async (projectId: string) => {
    const project = await db.project.findUnique({
        where: { id: projectId },
            select: {
            githubUrl: true,
        },
    });

    if (!project?.githubUrl) {
      throw new Error('Project not found');
    }

    return { githubUrl: project.githubUrl };
};

const filterUnprocessedCommits = async (projectId: string, commitHashes: Response[]) => {
    const processedCommits = await db.commit.findMany({
        where: { projectId },
        select: { commitHash: true },
    });

    const processedCommitHashes = new Set(processedCommits.map(commit => commit.commitHash));
    return commitHashes.filter(commit => !processedCommitHashes.has(commit.commitHash));
};


type PullRequestResponse = {
  prNumber: number;
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
  

export const getPullRequests = async (githubUrl: string): Promise<PullRequestResponse[]> => {
  const [owner, repo] = githubUrl.split('/').slice(-2);
  if(!owner || !repo) {
    throw new Error('Invalid GitHub URL');
  }
  const { data } = await octokit.rest.pulls.list({
    owner,
    repo,
    state: 'all',
    sort: 'updated',
    direction: 'desc',
  });

  return data.slice(0,15).map(pr => ({
    prNumber: pr.number,
    title: pr.title,
    body: pr.body,
    authorName: pr.user?.login,
    authorAvatar: pr.user?.avatar_url,
    status: pr.state,
    merged: pr.state === 'open' ? false : true,
    createdAt: pr.created_at,
    updatedAt: pr.updated_at,
    mergedAt: pr.merged_at,
    baseBranch: pr.base.ref,
    headBranch: pr.head.ref,
  }));
};
const summarisePullRequest = async (githubUrl: string, prNumber: number) => {
  const [owner, repo] = githubUrl.split('/').slice(-2);
  if(!owner || !repo) {
    throw new Error('Invalid GitHub URL');
  }
  const { data: files } = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber,
  });
  const { data: comments } = await octokit.rest.pulls.listReviewComments({
    owner,
    repo,
    pull_number: prNumber,
  });
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
  const {data: diff} = await axios.get(apiUrl, {
    headers: {
        Accept: 'application/vnd.github.v3.diff',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
    },
  })
  // const aiAnalysis = await aiSummariesPullRequestLocal(diff);
  const aiAnalysis = await aiSummariesPullRequest(diff);
  return {
    diff,
    comments: comments.map(c => ({
      body: c.body,
      path: c.path,
      line: c.line,
    })),
    aiAnalysis,
  };
};

const filterUnprocessedPRs = async (projectId: string, prs: PullRequestResponse[]) => {
  const processedPRs = await db.pullRequest.findMany({
    where: { projectId },
    select: { prNumber: true },
  });

  const processedNumbers = new Set(processedPRs.map(p => p.prNumber));
  return prs.filter(pr => !processedNumbers.has(pr.prNumber));
};
function removeCodeBlockMarkers(text: string): string {
  return text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
}
export const pollPullRequests = async (projectId: string) => {
  const { githubUrl } = await fetchProjectGithubUrl(projectId);
  const currentPRs = await getPullRequests(githubUrl);
  const unprocessedPRs = await filterUnprocessedPRs(projectId, currentPRs);

  const resultResponse = await Promise.allSettled(
    unprocessedPRs.map(async (pr) => {
      const details = await summarisePullRequest(githubUrl, pr.prNumber);
      return { pr, details };
    })
  );

  const successfulResults = resultResponse
    .filter(
      (
        response
      ): response is PromiseFulfilledResult<{
        pr: PullRequestResponse;
        details: any;
      }> => response.status === 'fulfilled'
    )
    .map((response) => response.value);
  console.log(successfulResults)
  const pullRequests = await db.pullRequest.createMany({
    data: successfulResults.map(({ pr, details }) => ({
      projectId,
      prNumber: pr.prNumber,
      title: pr.title,
      body: pr.body,
      authorName: pr.authorName,
      authorAvatar: pr.authorAvatar,
      status: pr.status,
      merged: pr.status === 'open' ? false : true,
      baseBranch: pr.baseBranch,
      headBranch: pr.headBranch,
      diff: details.diff,
      comments: JSON.stringify(details.comments),
      aiAnalysis: removeCodeBlockMarkers(details.aiAnalysis),
      createdAt: new Date(pr.createdAt),
      mergedAt: pr.mergedAt ? new Date(pr.mergedAt) : null,
    })),
  });
  return pullRequests;
};