import { db } from '@/server/db';
import { Octokit } from 'octokit';
import axios from 'axios'
import { aiSummariesCommit } from './gemini';
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
const getCommitDetails = async (githubUrl: string, commitHash: string) => {
    const [owner, repo] = githubUrl.split('/').slice(-2);
    if(!owner || !repo) {
        throw new Error('Invalid GitHub URL');
    }
    const { data } = await octokit.rest.repos.getCommit({
        owner,
        repo,
        ref: commitHash,
    });
    return data;
};
const getChangedFiles = async (githubUrl: string, commitHash: string) => {
    const commitDetails = await getCommitDetails(githubUrl, commitHash);
    return commitDetails.files;
};
export const compareChangedFiles = async (githubUrl: string, commitHash: string) => {
    const changedFiles = await getChangedFiles(githubUrl, commitHash);
    console.log(changedFiles)
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
    console.log(data);
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
    return await aiSummariesCommit(data);
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


