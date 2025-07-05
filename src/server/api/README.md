# API Documentation

## Overview

This API is built using tRPC (TypeScript RPC) and provides a type-safe, end-to-end API for the RepoMind application.

## Architecture

### Structure
```
src/server/api/
├── trpc.ts              # tRPC configuration and procedures
├── root.ts              # Main router
├── middleware/          # Custom middleware
│   ├── rateLimit.ts     # Rate limiting
│   ├── validation.ts    # Input validation
│   ├── caching.ts       # Response caching
│   └── index.ts         # Middleware exports
├── schemas/             # Input validation schemas
│   ├── project.ts       # Project-related schemas
│   ├── conversation.ts  # Conversation-related schemas
│   └── index.ts         # Schema exports
├── routers/             # API route handlers
│   ├── project.ts       # Project operations
│   ├── conversation.ts  # Conversation operations
│   └── ...
├── errors/              # Error handling
│   └── index.ts         # Error utilities
└── utils/               # API utilities
    ├── response.ts      # Response helpers
    ├── database.ts      # Database utilities
    └── index.ts         # Utility exports
```

## Middleware

### Rate Limiting
- `normalRateLimit`: 100 requests per minute
- `apiRateLimit`: 50 requests per minute for API calls
- `strictRateLimit`: 10 requests per minute
- `generousRateLimit`: 1000 requests per minute

### Caching
- `shortCache`: 5 minutes
- `mediumCache`: 15 minutes
- `longCache`: 1 hour
- `userCache`: 30 minutes

### Validation
- `sanitizeInput`: Sanitizes input data
- `paginationMiddleware`: Validates pagination parameters

## API Endpoints

### Projects

#### `project.createProject`
Creates a new project with GitHub integration.

**Input:**
```typescript
{
  name: string;
  githubUrl: string;
  githubToken?: string;
  description?: string;
  isPublic?: boolean;
}
```

**Response:**
```typescript
{
  success: boolean;
  data: Project;
}
```

#### `project.getProjects`
Retrieves user's projects with filtering and pagination.

**Input:**
```typescript
{
  page?: number;
  limit?: number;
  search?: string;
  isPublic?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}
```

**Response:**
```typescript
{
  success: boolean;
  data: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

#### `project.getProject`
Retrieves a single project by ID.

**Input:**
```typescript
{
  projectId: string;
}
```

#### `project.updateProject`
Updates project information.

**Input:**
```typescript
{
  id: string;
  name?: string;
  githubUrl?: string;
  githubToken?: string;
}
```

#### `project.deleteProject`
Soft deletes a project.

**Input:**
```typescript
{
  projectId: string;
}
```

#### `project.getCommits`
Retrieves commits for a project.

**Input:**
```typescript
{
  projectId: string;
  page?: number;
  limit?: number;
}
```

#### `project.getPullRequests`
Retrieves pull requests for a project.

**Input:**
```typescript
{
  projectId: string;
  page?: number;
  limit?: number;
}
```

#### `project.importCommits`
Imports commits from GitHub.

**Input:**
```typescript
{
  projectId: string;
}
```

#### `project.importPullRequests`
Imports pull requests from GitHub.

**Input:**
```typescript
{
  projectId: string;
}
```

#### `project.importGithubRepo`
Imports GitHub repository data.

**Input:**
```typescript
{
  projectId: string;
  githubUrl: string;
  githubToken: string;
  importCommits?: boolean;
  importPullRequests?: boolean;
  importIssues?: boolean;
}
```

### Conversations

#### `conversation.createConversation`
Creates a new conversation.

**Input:**
```typescript
{
  title: string;
  projectId: string;
  description?: string;
}
```

#### `conversation.getConversations`
Retrieves conversations for a project.

**Input:**
```typescript
{
  projectId: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'title' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}
```

#### `conversation.getConversation`
Retrieves a single conversation with messages.

**Input:**
```typescript
{
  conversationId: string;
  includeMessages?: boolean;
  messageLimit?: number;
}
```

#### `conversation.updateConversation`
Updates conversation information.

**Input:**
```typescript
{
  id: string;
  title?: string;
  projectId?: string;
}
```

#### `conversation.deleteConversation`
Deletes a conversation and its messages.

**Input:**
```typescript
{
  conversationId: string;
}
```

#### `conversation.createMessage`
Creates a new message in a conversation.

**Input:**
```typescript
{
  conversationId: string;
  content: string;
  role: 'user' | 'assistant';
  fileReferences?: string[];
}
```

#### `conversation.getMessages`
Retrieves messages for a conversation.

**Input:**
```typescript
{
  conversationId: string;
  page?: number;
  limit?: number;
}
```

## Error Handling

All API endpoints return standardized error responses:

```typescript
{
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  meta: {
    timestamp: string;
  };
}
```

### Error Codes
- `UNAUTHORIZED`: User not authenticated
- `FORBIDDEN`: User not authorized
- `BAD_REQUEST`: Invalid request data
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict
- `TOO_MANY_REQUESTS`: Rate limit exceeded
- `INTERNAL_SERVER_ERROR`: Server error
- `VALIDATION_ERROR`: Input validation failed

## Usage Examples

### Creating a Project
```typescript
const result = await trpc.project.createProject.mutate({
  name: "My Project",
  githubUrl: "https://github.com/user/repo",
  githubToken: "ghp_...",
});
```

### Getting Projects with Pagination
```typescript
const result = await trpc.project.getProjects.query({
  page: 1,
  limit: 20,
  search: "react",
  sortBy: "createdAt",
  sortOrder: "desc",
});
```

### Creating a Conversation
```typescript
const result = await trpc.conversation.createConversation.mutate({
  title: "Code Review Discussion",
  projectId: "project-id",
});
```

## Best Practices

1. **Always handle errors**: Wrap API calls in try-catch blocks
2. **Use pagination**: For large datasets, always use pagination
3. **Validate input**: Use the provided schemas for input validation
4. **Cache appropriately**: Use caching middleware for read operations
5. **Rate limiting**: Be mindful of rate limits in your application

## Development

### Adding New Endpoints

1. Create schema in `schemas/` directory
2. Add route handler in appropriate router
3. Update root router
4. Add tests
5. Update documentation

### Testing

```bash
# Run API tests
npm run test:api

# Run specific test file
npm run test:api -- --testNamePattern="project"
```

### Debugging

Enable debug logging by setting `DEBUG=trpc:*` environment variable.

## Performance

- Use caching for read operations
- Implement pagination for large datasets
- Use database indexes for frequently queried fields
- Monitor query performance with Prisma Studio 