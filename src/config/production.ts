import { ENV } from '@/constants/env';

export const productionConfig = {
  // API Configuration
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.repomind.com',
    timeout: 30000,
    retries: 5,
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL,
    connectionTimeout: 60000,
    maxRetries: 5,
    poolSize: 20,
  },

  // GitHub Configuration
  github: {
    apiUrl: 'https://api.github.com',
    token: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
    rateLimitDelay: 2000,
    maxRequestsPerHour: 5000,
  },

  // AI Configuration
  ai: {
    providers: {
      gemini: {
        apiKey: process.env.GEMINI_API_KEY,
        model: 'gemini-pro',
        maxTokens: 8192,
      },
      ollama: {
        baseUrl: process.env.OLLAMA_BASE_URL,
        model: 'llama2',
        maxTokens: 8192,
      },
      together: {
        apiKey: process.env.TOGETHER_API_KEY,
        model: 'togethercomputer/llama-2-70b-chat',
        maxTokens: 8192,
      },
    },
  },

  // Cache Configuration
  cache: {
    ttl: {
      short: 10 * 60 * 1000, // 10 minutes
      medium: 60 * 60 * 1000, // 1 hour
      long: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    maxSize: 1000, // MB
  },

  // Logging Configuration
  logging: {
    level: 'info',
    enableConsole: false,
    enableFile: true,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    logRotation: true,
  },

  // Feature Flags
  features: {
    aiChat: true,
    githubIntegration: true,
    pullRequestAnalysis: true,
    commitAnalysis: true,
    codeEmbedding: true,
    realTimeUpdates: true,
    advancedSearch: true,
    teamCollaboration: false,
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET,
    sessionTimeout: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxLoginAttempts: 3,
    lockoutDuration: 30 * 60 * 1000, // 30 minutes
    enableHttps: true,
    enableCors: true,
    corsOrigins: ['https://repomind.com', 'https://www.repomind.com'],
  },

  // File Upload Configuration
  upload: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/json',
      'text/markdown',
      'application/xml',
      'text/xml',
    ],
    maxFiles: 50,
    enableCompression: true,
  },

  // Performance Configuration
  performance: {
    enableCompression: true,
    enableCaching: true,
    enableMinification: true,
    enableSourceMaps: false,
    bundleAnalyzer: false,
    enableCDN: true,
    enableGzip: true,
    enableBrotli: true,
  },

  // Monitoring Configuration
  monitoring: {
    enableMetrics: true,
    enableTracing: true,
    enableErrorTracking: true,
    enablePerformanceMonitoring: true,
    enableUptimeMonitoring: true,
  },
}; 