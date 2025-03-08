import { processCommits, processPullRequests } from "@/lib/github";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import z from 'zod'
import pLimit from 'p-limit';
import { processGithubRepository } from "@/lib/github-loader";
import { db } from "@/server/db";
const limit = pLimit(14);
export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
        z.object({
            reponame: z.string(),
            githubUrl: z.string(),
            githubToken: z.string().optional(),
        })
    ).mutation(async ({ctx, input}) => {
        const project = await ctx.db.project.create({
            data: {
                name: input.reponame,
                githubUrl: input.githubUrl,
                githubToken: input.githubToken,
                UserProject: {
                    create: {
                        userId: ctx.user.id!
                    }
                }
            },
        });
    
        try {
            await processCommits(project.id);
            await processPullRequests(project.id);
            await processGithubRepository(project.id, input.githubUrl, input.githubToken);
            return project;
        } catch (error) {
            await ctx.db.project.delete({
                where: { id: project.id }
            });
            throw new Error("Failed to initialize project: " + error);
        }
    }),
    getProjects: protectedProcedure.query(async ({ctx, input}) => {
        return await ctx.db.project.findMany({
            where: {
                UserProject: {
                    some: {
                        userId: ctx.user.id as string
                    }
                },
                delete: null
            }
        })
    }),
    getCommits: protectedProcedure.input(
        z.object({
            projectId: z.string(),
        })
    ).query(async ({ctx, input}) => {
        return await ctx.db.commit.findMany({where: {projectId: input.projectId} });
    }),
    getPullRequests: protectedProcedure.input(
        z.object({
            projectId: z.string(),
        })
    ).query(async ({ctx, input}) => {
        return await ctx.db.pullRequest.findMany({where: {projectId: input.projectId}});
    }),
    importCommits: protectedProcedure.input(
        z.object({
            projectId: z.string(),
        })
    ).mutation(async ({ ctx, input }) => {
        await processCommits(input.projectId);
    }),
    importPullRequests: protectedProcedure.input(
        z.object({
            projectId: z.string(),
        })
    ).mutation(async ({ ctx, input }) => {
        await processPullRequests(input.projectId);
    }),
    importGithubRepo: protectedProcedure.input(
        z.object({
            projectId: z.string(),
            githubUrl: z.string(),
            githubToken: z.string(),
        })
    ).mutation(async ({ ctx, input }) => {
        await processGithubRepository(input.projectId, input.githubUrl!, input.githubToken)
    }),
    getConversation: protectedProcedure
        .input(z.object({ conversationId: z.string() }))
        .query(async ({ ctx, input }) => {
            return await db.conversation.findUnique({
                where: { id: input.conversationId },
                include: {
                messages: {
                    include: { fileReference: true },
                    orderBy: { created_at: "asc" },
                },
                },
            });
    }),
    getConversations: protectedProcedure
        .input(z.object({ projectId: z.string() }))
        .query(async ({ ctx, input }) => {
            return await db.conversation.findMany({
                where: { projectId: input.projectId },
                select: {
                    id: true,
                    title: true,
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
    }),
})