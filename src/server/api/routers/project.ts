import { pollCommits } from "@/lib/github";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import z from 'zod'

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
        await pollCommits(project.id);
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
    })
})