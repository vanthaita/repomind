import { getPullRequests, pollCommits, pollPullRequests } from "@/lib/github";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import z from 'zod'
import pLimit from 'p-limit';
import { GithubRepo } from "@/lib/github-loader";
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
                        userId: ctx.user.userId!
                    }
                }
            },
        })
        await pollCommits(project.id)
        // await pollPullRequests(project.id)
        await GithubRepo(project.id, input.githubUrl, input.githubToken)
        return project
    }),
    getProjects: protectedProcedure.query(async ({ctx, input}) => {
        return await ctx.db.project.findMany({
            where: {
                UserProject: {
                    some: {
                        userId: ctx.user.userId!
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
        await pollCommits(input.projectId);
    }),
    importPullRequests: protectedProcedure.input(
        z.object({
            projectId: z.string(),
        })
    ).mutation(async ({ ctx, input }) => {
        await pollPullRequests(input.projectId);
    }),
    importGithubRepo: protectedProcedure.input(
        z.object({
            projectId: z.string(),
            githubUrl: z.string(),
            githubToken: z.string(),
        })
    ).mutation(async ({ ctx, input }) => {
        await GithubRepo(input.projectId, input.githubUrl!, input.githubToken)
    }),
})