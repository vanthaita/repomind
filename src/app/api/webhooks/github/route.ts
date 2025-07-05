import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import crypto from 'crypto';
import { emitNewCommit, emitNewPullRequest, emitNewIssue, emitPullRequestUpdate, emitIssueUpdate } from '@/app/api/socket/route';

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-hub-signature-256');
    
    // Verify webhook signature
    if (WEBHOOK_SECRET) {
      const expectedSignature = `sha256=${crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(body)
        .digest('hex')}`;
      
      if (signature !== expectedSignature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = request.headers.get('x-github-event');
    const payload = JSON.parse(body);
    
    console.log(`GitHub Webhook: ${event}`, payload);

    switch (event) {
      case 'push':
        await handlePushEvent(payload);
        break;
      case 'pull_request':
        await handlePullRequestEvent(payload);
        break;
      case 'issues':
        await handleIssuesEvent(payload);
        break;
      default:
        console.log(`Unhandled event: ${event}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handlePushEvent(payload: any) {
  const { repository, commits, ref } = payload;
  const repoUrl = repository.html_url;
  
  // Find project by GitHub URL
  const project = await db.project.findFirst({
    where: { githubUrl: repoUrl }
  });

  if (!project) {
    console.log(`Project not found for repo: ${repoUrl}`);
    return;
  }

  // Import new commits
  const { Octokit } = await import('octokit');
  const octokit = new Octokit({
    auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
  });

  const [owner, repo] = repoUrl.split('/').slice(-2);
  
  // Get latest commits
  const commitListResponse = await octokit.rest.repos.listCommits({
    owner,
    repo,
    per_page: 10,
  });

  const commits = commitListResponse.data.slice(0, 5).map((commitItem: any) => ({
    projectId: project.id,
    commitHash: commitItem.sha,
    commitMessage: commitItem.commit.message,
    commitAuthorName: commitItem.commit.author.name,
    commitAuthorAvatar: commitItem.author ? commitItem.author.avatar_url : '',
    commitDate: new Date(commitItem.commit.author.date),
    summary: `Commit: ${commitItem.commit.message.substring(0, 100)}...`,
  }));

  // Check for existing commits
  const existingCommits = await db.commit.findMany({
    where: { projectId: project.id },
    select: { commitHash: true },
  });

  const existingHashes = new Set(existingCommits.map(c => c.commitHash));
  const newCommits = commits.filter(c => !existingHashes.has(c.commitHash));

  if (newCommits.length > 0) {
    const createdCommits = await db.commit.createMany({
      data: newCommits,
    });
    
    // Emit WebSocket event for each new commit
    newCommits.forEach(commit => {
      emitNewCommit(project.id, commit);
    });
    
    console.log(`Imported ${newCommits.length} new commits for project ${project.id}`);
  }
}

async function handlePullRequestEvent(payload: any) {
  const { repository, pull_request, action } = payload;
  const repoUrl = repository.html_url;
  
  const project = await db.project.findFirst({
    where: { githubUrl: repoUrl }
  });

  if (!project) {
    console.log(`Project not found for repo: ${repoUrl}`);
    return;
  }

  if (action === 'opened' || action === 'synchronize') {
    // Create or update PR
    const prData = {
      projectId: project.id,
      prNumber: pull_request.number,
      title: pull_request.title,
      body: pull_request.body,
      authorName: pull_request.user?.login,
      authorAvatar: pull_request.user?.avatar_url,
      status: pull_request.state,
      merged: pull_request.merged || false,
      baseBranch: pull_request.base.ref,
      headBranch: pull_request.head.ref,
      diff: '',
      comments: '[]',
      aiAnalysis: `PR Analysis: ${pull_request.title}`,
      createdAt: new Date(pull_request.created_at),
      mergedAt: pull_request.merged_at ? new Date(pull_request.merged_at) : null,
    };

    const result = await db.pullRequest.upsert({
      where: {
        projectId_prNumber: {
          projectId: project.id,
          prNumber: pull_request.number,
        },
      },
      update: prData,
      create: prData,
    });

    // Emit WebSocket event
    if (action === 'opened') {
      emitNewPullRequest(project.id, result);
    } else {
      emitPullRequestUpdate(project.id, result);
    }

    console.log(`Updated PR #${pull_request.number} for project ${project.id}`);
  }
}

async function handleIssuesEvent(payload: any) {
  const { repository, issue, action } = payload;
  const repoUrl = repository.html_url;
  
  const project = await db.project.findFirst({
    where: { githubUrl: repoUrl }
  });

  if (!project) {
    console.log(`Project not found for repo: ${repoUrl}`);
    return;
  }

  if (action === 'opened' || action === 'edited') {
    // Create or update issue
    const issueData = {
      projectId: project.id,
      title: issue.title,
      body: issue.body,
      status: issue.state,
      labels: JSON.stringify(issue.labels?.map((l: any) => l.name) || []),
      assignee: issue.assignee?.login,
      createdAt: new Date(issue.created_at),
      closedAt: issue.closed_at ? new Date(issue.closed_at) : null,
    };

    // Note: We need to add a unique constraint for issues
    // For now, we'll use a simple approach
    const existingIssue = await db.issue.findFirst({
      where: {
        projectId: project.id,
        title: issue.title,
      },
    });

    let result;
    if (existingIssue) {
      result = await db.issue.update({
        where: { id: existingIssue.id },
        data: issueData,
      });
      emitIssueUpdate(project.id, result);
    } else {
      result = await db.issue.create({
        data: issueData,
      });
      emitNewIssue(project.id, result);
    }

    console.log(`Updated issue "${issue.title}" for project ${project.id}`);
  }
} 