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
});