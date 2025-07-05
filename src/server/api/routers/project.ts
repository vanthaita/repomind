import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from 'zod';

// Import schemas
import {
  createProjectSchema,
  updateProjectSchema,
  getProjectsSchema,
  projectIdSchema,
  githubImportSchema,
} from '../schemas/project';

export const projectRouter = createTRPCRouter({
  getProjects: protectedProcedure
    .input(getProjectsSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, search, isPublic, sortBy, sortOrder } = input;
        const offset = (page - 1) * limit;

        const where: any = {
          UserProject: {
            some: {
              userId: ctx.user.id as string,
            },
          },
        };

        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ];
        }

        if (isPublic !== undefined) {
          where.isPublic = isPublic;
        }

        const sortFieldMap: Record<string, string> = {
          createdAt: 'created_at',
          updatedAt: 'updated_at',
          name: 'name',
        };
        const prismaSortBy = sortFieldMap[sortBy] || 'created_at';

        const [projects, total] = await Promise.all([
          ctx.db.project.findMany({
            where,
            include: {
              UserProject: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  Commit: true,
                  PullRequest: true,
                  Conversation: true,
                },
              },
            },
            orderBy: { [prismaSortBy]: sortOrder },
            skip: offset,
            take: limit,
          }),
          ctx.db.project.count({ where }),
        ]);

        return {
          success: true,
          data: projects,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        };
      } catch (error) {
        console.error('Error in getProjects:', error);
        throw error;
      }
    }),

  createProject: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const project = await ctx.db.project.create({
          data: {
            name: input.name,
            githubUrl: input.githubUrl,
            githubToken: input.githubToken,
            UserProject: {
              create: {
                userId: ctx.user.id!,
              },
            },
          },
          include: {
            UserProject: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        });

        return {
          success: true,
          data: project,
        };
      } catch (error) {
        console.error('Error in createProject:', error);
        throw error;
      }
    }),

  getProject: protectedProcedure
    .input(projectIdSchema)
    .query(async ({ ctx, input }) => {
      try {
        const project = await ctx.db.project.findFirst({
          where: {
            id: input.projectId,
            UserProject: {
              some: {
                userId: ctx.user.id as string,
              },
            },
          },
          include: {
            UserProject: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            _count: {
              select: {
                Commit: true,
                PullRequest: true,
                Conversation: true,
              },
            },
          },
        });

        if (!project) {
          throw new Error('Project not found');
        }

        return {
          success: true,
          data: project,
        };
      } catch (error) {
        console.error('Error in getProject:', error);
        throw error;
      }
    }),

  getCommits: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const { projectId, page, limit } = input;
        const offset = (page - 1) * limit;

        // Verify user has access to the project
        const project = await ctx.db.project.findFirst({
          where: {
            id: projectId,
            UserProject: {
              some: {
                userId: ctx.user.id as string,
              },
            },
          },
        });

        if (!project) {
          throw new Error('Project not found or access denied');
        }

        const [commits, total] = await Promise.all([
          ctx.db.commit.findMany({
            where: {
              projectId: projectId,
            },
            orderBy: {
              created_at: 'desc',
            },
            skip: offset,
            take: limit,
          }),
          ctx.db.commit.count({
            where: {
              projectId: projectId,
            },
          }),
        ]);

        return {
          success: true,
          data: commits,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        };
      } catch (error) {
        console.error('Error in getCommits:', error);
        throw error;
      }
    }),

  getPullRequests: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const { projectId, page, limit } = input;
        const offset = (page - 1) * limit;

        // Verify user has access to the project
        const project = await ctx.db.project.findFirst({
          where: {
            id: projectId,
            UserProject: {
              some: {
                userId: ctx.user.id as string,
              },
            },
          },
        });

        if (!project) {
          throw new Error('Project not found or access denied');
        }

        const [pullRequests, total] = await Promise.all([
          ctx.db.pullRequest.findMany({
            where: {
              projectId: projectId,
            },
            orderBy: {
              createdAt: 'desc',
            },
            skip: offset,
            take: limit,
          }),
          ctx.db.pullRequest.count({
            where: {
              projectId: projectId,
            },
          }),
        ]);

        return {
          success: true,
          data: pullRequests,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        };
      } catch (error) {
        console.error('Error in getPullRequests:', error);
        throw error;
      }
    }),

  importCommits: protectedProcedure
    .input(z.object({
      projectId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { projectId } = input;

        // Verify user has access to the project
        const project = await ctx.db.project.findFirst({
          where: {
            id: projectId,
            UserProject: {
              some: {
                userId: ctx.user.id as string,
              },
            },
          },
        });

        if (!project) {
          throw new Error('Project not found or access denied');
        }

        if (!project.githubUrl) {
          throw new Error('GitHub URL not found for this project');
        }

        // Simple import without AI summarization for testing
        const { Octokit } = await import('octokit');
        const octokit = new Octokit({
          auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
        });

        const [owner, repo] = project.githubUrl.split('/').slice(-2);
        if (!owner || !repo) {
          throw new Error('Invalid GitHub URL format');
        }

        const commitListResponse = await octokit.rest.repos.listCommits({
          owner,
          repo,
          per_page: 10,
        });

        const commits = commitListResponse.data.slice(0, 5).map((commitItem: any) => ({
          projectId,
          commitHash: commitItem.sha,
          commitMessage: commitItem.commit.message,
          commitAuthorName: commitItem.commit.author.name,
          commitAuthorAvatar: commitItem.author ? commitItem.author.avatar_url : '',
          commitDate: new Date(commitItem.commit.author.date),
          summary: `Commit: ${commitItem.commit.message.substring(0, 100)}...`,
        }));

        // Check for existing commits to avoid duplicates
        const existingCommits = await ctx.db.commit.findMany({
          where: { projectId },
          select: { commitHash: true },
        });

        const existingHashes = new Set(existingCommits.map(c => c.commitHash));
        const newCommits = commits.filter(c => !existingHashes.has(c.commitHash));

        if (newCommits.length === 0) {
          return {
            success: true,
            data: {
              message: 'No new commits to import',
              importedCount: 0,
            },
          };
        }

        const result = await ctx.db.commit.createMany({
          data: newCommits,
        });

        return {
          success: true,
          data: {
            message: 'Commits imported successfully',
            importedCount: result.count || 0,
          },
        };
      } catch (error) {
        console.error('Error in importCommits:', error);
        throw error;
      }
    }),

  importPullRequests: protectedProcedure
    .input(z.object({
      projectId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { projectId } = input;

        // Verify user has access to the project
        const project = await ctx.db.project.findFirst({
          where: {
            id: projectId,
            UserProject: {
              some: {
                userId: ctx.user.id as string,
              },
            },
          },
        });

        if (!project) {
          throw new Error('Project not found or access denied');
        }

        if (!project.githubUrl) {
          throw new Error('GitHub URL not found for this project');
        }

        // Simple import without AI analysis for testing
        const { Octokit } = await import('octokit');
        const octokit = new Octokit({
          auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
        });

        const [owner, repo] = project.githubUrl.split('/').slice(-2);
        if (!owner || !repo) {
          throw new Error('Invalid GitHub URL format');
        }

        const pullRequestListResponse = await octokit.rest.pulls.list({
          owner,
          repo,
          state: 'all',
          per_page: 10,
        });

        const pullRequests = pullRequestListResponse.data.slice(0, 5).map((prItem: any) => ({
          projectId,
          prNumber: prItem.number,
          title: prItem.title,
          body: prItem.body,
          authorName: prItem.user?.login,
          authorAvatar: prItem.user?.avatar_url,
          status: prItem.state,
          merged: prItem.merged || false,
          baseBranch: prItem.base.ref,
          headBranch: prItem.head.ref,
          diff: '',
          comments: '[]',
          aiAnalysis: `PR Analysis: ${prItem.title}`,
          createdAt: new Date(prItem.created_at),
          mergedAt: prItem.merged_at ? new Date(prItem.merged_at) : null,
        }));

        // Check for existing PRs to avoid duplicates
        const existingPRs = await ctx.db.pullRequest.findMany({
          where: { projectId },
          select: { prNumber: true },
        });

        const existingNumbers = new Set(existingPRs.map(pr => pr.prNumber));
        const newPRs = pullRequests.filter(pr => !existingNumbers.has(pr.prNumber));

        if (newPRs.length === 0) {
          return {
            success: true,
            data: {
              message: 'No new pull requests to import',
              importedCount: 0,
            },
          };
        }

        const result = await ctx.db.pullRequest.createMany({
          data: newPRs,
        });

        return {
          success: true,
          data: {
            message: 'Pull requests imported successfully',
            importedCount: result.count || 0,
          },
        };
      } catch (error) {
        console.error('Error in importPullRequests:', error);
        throw error;
      }
    }),

  importGithubRepo: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      githubUrl: z.string().url(),
      githubToken: z.string(),
      importCommits: z.boolean().default(false),
      importPullRequests: z.boolean().default(false),
      importIssues: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { projectId, githubUrl, githubToken, importCommits, importPullRequests, importIssues } = input;

        // Verify user has access to the project
        const project = await ctx.db.project.findFirst({
          where: {
            id: projectId,
            UserProject: {
              some: {
                userId: ctx.user.id as string,
              },
            },
          },
        });

        if (!project) {
          throw new Error('Project not found or access denied');
        }

        // TODO: Implement GitHub API integration
        // For now, return a placeholder response
        return {
          success: true,
          data: {
            message: 'GitHub repository import functionality will be implemented soon',
            importedData: {
              commits: importCommits ? 0 : null,
              pullRequests: importPullRequests ? 0 : null,
              issues: importIssues ? 0 : null,
            },
          },
        };
      } catch (error) {
        console.error('Error in importGithubRepo:', error);
        throw error;
      }
    }),

  deleteProject: protectedProcedure
    .input(z.object({
      projectId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { projectId } = input;

        // Verify user has access to the project
        const project = await ctx.db.project.findFirst({
          where: {
            id: projectId,
            UserProject: {
              some: {
                userId: ctx.user.id as string,
              },
            },
          },
        });

        if (!project) {
          throw new Error('Project not found or access denied');
        }

        // Soft delete the project
        await ctx.db.project.update({
          where: { id: projectId },
          data: { deletedAt: new Date() },
        });

        return {
          success: true,
          data: { message: 'Project deleted successfully' },
        };
      } catch (error) {
        console.error('Error in deleteProject:', error);
        throw error;
      }
    }),

  // Lấy chi tiết 1 pull request
  getPullRequest: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const pr = await ctx.db.pullRequest.findUnique({
        where: { id: input.id },
      });
      if (!pr) throw new Error('Pull request not found');
      return { success: true, data: pr };
    }),

  // Tạo pull request mới (chủ yếu dùng cho demo, thực tế nên import từ GitHub)
  createPullRequest: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      prNumber: z.number(),
      title: z.string(),
      body: z.string().optional(),
      authorName: z.string().optional(),
      authorAvatar: z.string().optional(),
      status: z.string(),
      merged: z.boolean(),
      baseBranch: z.string(),
      headBranch: z.string(),
      diff: z.string().optional(),
      comments: z.string().optional(),
      aiAnalysis: z.string().optional(),
      mergedAt: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const pr = await ctx.db.pullRequest.create({
        data: {
          ...input,
          createdAt: new Date(),
        },
      });
      return { success: true, data: pr };
    }),

  // Cập nhật pull request
  updatePullRequest: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      body: z.string().optional(),
      status: z.string().optional(),
      merged: z.boolean().optional(),
      baseBranch: z.string().optional(),
      headBranch: z.string().optional(),
      diff: z.string().optional(),
      comments: z.string().optional(),
      aiAnalysis: z.string().optional(),
      mergedAt: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const pr = await ctx.db.pullRequest.update({
        where: { id },
        data,
      });
      return { success: true, data: pr };
    }),

  // Xóa pull request
  deletePullRequest: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.pullRequest.delete({ where: { id: input.id } });
      return { success: true };
    }),

  // Merge pull request (chỉ cập nhật trường merged và mergedAt)
  mergePullRequest: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const pr = await ctx.db.pullRequest.update({
        where: { id: input.id },
        data: { merged: true, status: 'closed', mergedAt: new Date() },
      });
      return { success: true, data: pr };
    }),

  // Thêm comment vào pull request (lưu vào trường comments dạng JSON string)
  commentPullRequest: protectedProcedure
    .input(z.object({ id: z.string(), comment: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const pr = await ctx.db.pullRequest.findUnique({ where: { id: input.id } });
      if (!pr) throw new Error('Pull request not found');
      let comments: string[] = [];
      try {
        comments = pr.comments ? JSON.parse(pr.comments) : [];
      } catch {
        comments = [];
      }
      comments.push(input.comment);
      const updated = await ctx.db.pullRequest.update({
        where: { id: input.id },
        data: { comments: JSON.stringify(comments) },
      });
      return { success: true, data: updated };
    }),


  getIssues: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const { projectId, page, limit } = input;
      const offset = (page - 1) * limit;
      const project = await ctx.db.project.findFirst({
        where: {
          id: projectId,
          UserProject: {
            some: {
              userId: ctx.user.id as string,
            },
          },
        },
      });
      if (!project) throw new Error('Project not found or access denied');
      const [issues, total] = await Promise.all([
        ctx.db.issue.findMany({
          where: { projectId },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
        }),
        ctx.db.issue.count({ where: { projectId } }),
      ]);
      return {
        success: true,
        data: issues,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }),

  // Lấy chi tiết 1 issue
  getIssue: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const issue = await ctx.db.issue.findUnique({
        where: { id: input.id },
      });
      if (!issue) throw new Error('Issue not found');
      return { success: true, data: issue };
    }),

  // Tạo issue mới
  createIssue: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      title: z.string(),
      body: z.string().optional(),
      status: z.string().default('open'),
      labels: z.string().optional(), // JSON string array
      assignee: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const issue = await ctx.db.issue.create({
        data: {
          ...input,
          createdAt: new Date(),
        },
      });
      return { success: true, data: issue };
    }),

  // Cập nhật issue
  updateIssue: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      body: z.string().optional(),
      status: z.string().optional(),
      labels: z.string().optional(),
      assignee: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const issue = await ctx.db.issue.update({
        where: { id },
        data,
      });
      return { success: true, data: issue };
    }),

  // Xóa issue
  deleteIssue: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.issue.delete({ where: { id: input.id } });
      return { success: true };
    }),

  // Đóng issue
  closeIssue: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const issue = await ctx.db.issue.update({
        where: { id: input.id },
        data: { status: 'closed', closedAt: new Date() },
      });
      return { success: true, data: issue };
    }),

  // Mở lại issue
  reopenIssue: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const issue = await ctx.db.issue.update({
        where: { id: input.id },
        data: { status: 'open', closedAt: null },
      });
      return { success: true, data: issue };
    }),

  // Import issues từ GitHub
  importIssues: protectedProcedure
    .input(z.object({
      projectId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { projectId } = input;

        // Verify user has access to the project
        const project = await ctx.db.project.findFirst({
          where: {
            id: projectId,
            UserProject: {
              some: {
                userId: ctx.user.id as string,
              },
            },
          },
        });

        if (!project) {
          throw new Error('Project not found or access denied');
        }

        // TODO: Implement GitHub API integration to fetch issues
        // For now, return a placeholder response
        return {
          success: true,
          data: {
            message: 'Import issues functionality will be implemented soon',
            importedCount: 0,
          },
        };
      } catch (error) {
        console.error('Error in importIssues:', error);
        throw error;
      }
    }),
});