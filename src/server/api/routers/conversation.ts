import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { z } from 'zod';

// Import schemas and middleware
import {
  createConversationSchema,
  updateConversationSchema,
  getConversationsSchema,
  createMessageSchema,
  conversationIdSchema,
  getConversationWithMessagesSchema,
  type CreateConversationInput,
  type UpdateConversationInput,
  type GetConversationsInput,
  type CreateMessageInput,
  type ConversationIdInput,
  type GetConversationWithMessagesInput,
} from '../schemas/conversation';

import {
  createError,
  handleError,
  logError,
} from '../errors';

import {
  normalRateLimit,
  apiRateLimit,
  sanitizeInput,
  mediumCache,
  invalidateCache,
} from '../middleware';

export const conversationRouter = createTRPCRouter({
  // Create a new conversation
  createConversation: protectedProcedure
    .use(apiRateLimit)
    .use(sanitizeInput)
    .input(createConversationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify project access
        const project = await ctx.db.project.findFirst({
          where: {
            id: input.projectId,
            UserProject: {
              some: {
                userId: ctx.user.id as string,
              },
            },
          },
        });

        if (!project) {
          throw createError.notFound('Project');
        }

        const conversation = await ctx.db.conversation.create({
          data: {
            title: input.title,
            projectId: input.projectId,
          },
          include: {
            project: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                messages: true,
              },
            },
          },
        });

        return {
          success: true,
          data: conversation,
        };
      } catch (error) {
        logError(handleError(error), { input, userId: ctx.user.id });
        throw error;
      }
    }),

  // Get conversations for a project
  getConversations: protectedProcedure
    .use(normalRateLimit)
    .use(sanitizeInput)
    .use(mediumCache)
    .input(getConversationsSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { projectId, page, limit, search, sortBy, sortOrder } = input;
        const offset = (page - 1) * limit;

        // Verify project access
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
          throw createError.notFound('Project');
        }

        // Build where clause
        const where: any = {
          projectId,
        };

        if (search) {
          where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
          ];
        }

        // Get conversations with count
        const [conversations, total] = await Promise.all([
          ctx.db.conversation.findMany({
            where,
            select: {
              id: true,
              title: true,
              createdAt: true,
              _count: {
                select: {
                  messages: true,
                },
              },
            },
            orderBy: { [sortBy]: sortOrder },
            skip: offset,
            take: limit,
          }),
          ctx.db.conversation.count({ where }),
        ]);

        return {
          success: true,
          data: conversations,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        };
      } catch (error) {
        logError(handleError(error), { input, userId: ctx.user.id });
        throw error;
      }
    }),

  // Get a single conversation with messages
  getConversation: protectedProcedure
    .use(normalRateLimit)
    .use(mediumCache)
    .input(getConversationWithMessagesSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { conversationId, includeMessages, messageLimit } = input;

        const conversation = await ctx.db.conversation.findFirst({
          where: {
            id: conversationId,
            project: {
              UserProject: {
                some: {
                  userId: ctx.user.id as string,
                },
              },
            },
          },
          include: {
            project: {
              select: {
                id: true,
                name: true,
              },
            },
            ...(includeMessages && {
              messages: {
                include: {
                  fileReference: true,
                },
                orderBy: { created_at: 'asc' },
                take: messageLimit,
              },
            }),
            _count: {
              select: {
                messages: true,
              },
            },
          },
        });

        if (!conversation) {
          throw createError.notFound('Conversation');
        }

        return {
          success: true,
          data: conversation,
        };
      } catch (error) {
        logError(handleError(error), { input, userId: ctx.user.id });
        throw error;
      }
    }),

  // Update conversation
  updateConversation: protectedProcedure
    .use(apiRateLimit)
    .use(sanitizeInput)
    .use(invalidateCache)
    .input(updateConversationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;

        // Check if user has access to this conversation
        const existingConversation = await ctx.db.conversation.findFirst({
          where: {
            id,
            project: {
              UserProject: {
                some: {
                  userId: ctx.user.id as string,
                },
              },
            },
          },
        });

        if (!existingConversation) {
          throw createError.notFound('Conversation');
        }

        const conversation = await ctx.db.conversation.update({
          where: { id },
          data: updateData,
          include: {
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        return {
          success: true,
          data: conversation,
        };
      } catch (error) {
        logError(handleError(error), { input, userId: ctx.user.id });
        throw error;
      }
    }),

  // Delete conversation
  deleteConversation: protectedProcedure
    .use(apiRateLimit)
    .use(invalidateCache)
    .input(conversationIdSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user has access to this conversation
        const conversation = await ctx.db.conversation.findFirst({
          where: {
            id: input.conversationId,
            project: {
              UserProject: {
                some: {
                  userId: ctx.user.id as string,
                },
              },
            },
          },
        });

        if (!conversation) {
          throw createError.notFound('Conversation');
        }

        // Delete messages first (due to foreign key constraint)
        await ctx.db.message.deleteMany({
          where: { conversationId: input.conversationId },
        });

        // Delete conversation
        await ctx.db.conversation.delete({
          where: { id: input.conversationId },
        });

        return {
          success: true,
          message: 'Conversation deleted successfully',
        };
      } catch (error) {
        logError(handleError(error), { input, userId: ctx.user.id });
        throw error;
      }
    }),

  // Create a new message
  createMessage: protectedProcedure
    .use(apiRateLimit)
    .use(sanitizeInput)
    .use(invalidateCache)
    .input(createMessageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { conversationId, content, role, fileReferences } = input;

        // Verify conversation access
        const conversation = await ctx.db.conversation.findFirst({
          where: {
            id: conversationId,
            project: {
              UserProject: {
                some: {
                  userId: ctx.user.id as string,
                },
              },
            },
          },
        });

        if (!conversation) {
          throw createError.notFound('Conversation');
        }

        // Create message with file references
        const message = await ctx.db.message.create({
          data: {
            conversationId,
            content,
            role,
            fileReference: {
              create: fileReferences?.map(fileName => ({
                fileName,
              })) || [],
            },
          },
          include: {
            fileReference: true,
          },
        });

        return {
          success: true,
          data: message,
        };
      } catch (error) {
        logError(handleError(error), { input, userId: ctx.user.id });
        throw error;
      }
    }),

  // Get messages for a conversation
  getMessages: protectedProcedure
    .use(normalRateLimit)
    .use(mediumCache)
    .input(z.object({
      conversationId: z.string().uuid(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const { conversationId, page, limit } = input;
        const offset = (page - 1) * limit;

        // Verify conversation access
        const conversation = await ctx.db.conversation.findFirst({
          where: {
            id: conversationId,
            project: {
              UserProject: {
                some: {
                  userId: ctx.user.id as string,
                },
              },
            },
          },
        });

        if (!conversation) {
          throw createError.notFound('Conversation');
        }

        const [messages, total] = await Promise.all([
          ctx.db.message.findMany({
            where: { conversationId },
            include: {
              fileReference: true,
            },
            orderBy: { created_at: 'asc' },
            skip: offset,
            take: limit,
          }),
          ctx.db.message.count({ where: { conversationId } }),
        ]);

        return {
          success: true,
          data: messages,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        };
      } catch (error) {
        logError(handleError(error), { input, userId: ctx.user.id });
        throw error;
      }
    }),
}); 