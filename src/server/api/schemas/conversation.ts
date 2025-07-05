import { z } from 'zod';

// Base conversation schema
export const conversationBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  projectId: z.string().uuid('Invalid project ID'),
});

// Create conversation schema
export const createConversationSchema = conversationBaseSchema.extend({
  description: z.string().max(500, 'Description too long').optional(),
});

// Update conversation schema
export const updateConversationSchema = conversationBaseSchema.partial().extend({
  id: z.string().uuid('Invalid conversation ID'),
});

// Message schema
export const messageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  role: z.enum(['user', 'assistant']),
  fileReferences: z.array(z.string()).optional(),
});

// Create message schema
export const createMessageSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
  content: z.string().min(1, 'Message content is required'),
  role: z.enum(['user', 'assistant']),
  fileReferences: z.array(z.string()).optional(),
});

// Conversation filters schema
export const conversationFiltersSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  search: z.string().optional(),
  sortBy: z.enum(['title', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Conversation pagination schema
export const conversationPaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
});

// Get conversations with filters and pagination
export const getConversationsSchema = conversationFiltersSchema.merge(conversationPaginationSchema);

// Conversation ID schema
export const conversationIdSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
});

// Get conversation with messages schema
export const getConversationWithMessagesSchema = conversationIdSchema.extend({
  includeMessages: z.boolean().default(true),
  messageLimit: z.number().min(1).max(100).default(50),
});

// Export types
export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type UpdateConversationInput = z.infer<typeof updateConversationSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type GetConversationsInput = z.infer<typeof getConversationsSchema>;
export type ConversationIdInput = z.infer<typeof conversationIdSchema>;
export type GetConversationWithMessagesInput = z.infer<typeof getConversationWithMessagesSchema>; 