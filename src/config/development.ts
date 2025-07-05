import { ENV } from '@/constants/env';

export const developmentConfig = {
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    retries: 3,
  },

  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/repomind',
    connectionTimeout: 30000,
    maxRetries: 3,
  },

  github: {
    apiUrl: 'https://api.github.com',
    token: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
    rateLimitDelay: 1000,
    maxRequestsPerHour: 5000,
  },

  ai: {
    providers: {
      gemini: {
        apiKey: process.env.GEMINI_API_KEY,
        model: 'gemini-pro',
        maxTokens: 4096,
      },
      ollama: {
        baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        model: 'llama2',
        maxTokens: 4096,
      },
      together: {
        apiKey: process.env.TOGETHER_API_KEY,
        model: 'togethercomputer/llama-2-70b-chat',
        maxTokens: 4096,
      },
    },
  },

  cache: {
    ttl: {
      short: 5 * 60 * 1000, // 5 minutes
      medium: 30 * 60 * 1000, // 30 minutes
      long: 24 * 60 * 60 * 1000, // 24 hours
    },
    maxSize: 100, // MB
  },

  logging: {
    level: ENV.IS_DEVELOPMENT ? 'debug' : 'info',
    enableConsole: true,
    enableFile: false,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },

  features: {
    aiChat: true,
    githubIntegration: true,
    pullRequestAnalysis: true,
    commitAnalysis: true,
    codeEmbedding: true,
    realTimeUpdates: false,
    advancedSearch: false,
    teamCollaboration: false,
  },

  security: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret',
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },

  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/json',
    ],
    maxFiles: 10,
  },

  performance: {
    enableCompression: true,
    enableCaching: true,
    enableMinification: true,
    enableSourceMaps: ENV.IS_DEVELOPMENT,
    bundleAnalyzer: ENV.IS_DEVELOPMENT,
  },
}; 