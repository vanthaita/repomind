# RepoMind - AI-Powered GitHub Insights SaaS Requirements

## Project Overview

**RepoMind** is an AI-powered SaaS platform designed to help developers, freelancers, and small teams deeply understand and analyze GitHub codebases. Leveraging LLM and RAG technologies, RepoMind enables users to chat with repositories, analyze pull requests, and receive actionable insights on code quality, security, and improvement opportunities.

- **Target Users:** Solo developers, freelancers, small engineering teams, startups.
- **Core Value:** Save time on code comprehension, accelerate onboarding, improve code review quality, and support technical decision-making with AI.

---

## Target Client Personas

1. **Business Analyst (BA)**
   - **Typical Tasks:** Understand business logic through backend code, review API endpoints, document business flows.
   - **Interaction with Code:** Reads code to comprehend business processes, rarely edits code.
   - **Needs:** No need to run the project; often just browses code on GitHub/GitLab to see how data and logic are handled.

2. **Quality Assurance (QA) / Manual Tester**
   - **Typical Tasks:** Explore repo structure, review API endpoints, understand UI and logic flows.
   - **Interaction with Code:** Reads code to inform test case writing or manual testing; rarely needs to build or run code (except for automation testers).
   - **Needs:** Clear code structure and flow explanations to support manual test case creation.

3. **Technical Writer**
   - **Typical Tasks:** Write technical documentation, API references, and user guides.
   - **Interaction with Code:** Reads code to clarify logic and flow for documentation purposes; does not run code.
   - **Needs:** Clear, AI-generated explanations of code logic and business flows.

4. **Security Analyst (Entry Level)**
   - **Typical Tasks:** Review repositories for security vulnerabilities such as hardcoded secrets or misconfigurations.
   - **Interaction with Code:** Performs static code analysis; does not build or run the project.
   - **Needs:** Tools to quickly identify sensitive information and potential security issues in code.

5. **Code Auditor / Compliance Reviewer**
   - **Typical Tasks:** Ensure codebase adheres to coding guidelines and licensing requirements.
   - **Interaction with Code:** Reviews code and accompanying documentation; does not run the project.
   - **Needs:** Efficient navigation and AI-powered code summaries to support compliance checks.

---

## Developed Features

- **GitHub Repository Connection:** Connect via URL, auto-import code, commits, and pull requests.
- **AI Chat with Codebase:** Ask questions about code, receive context-aware explanations, file reference highlighting, and conversation history.
- **Pull Request Analysis:** AI-driven PR review with insights on code quality, security, and improvement recommendations (JSON output).
- **User Management:** Google OAuth authentication, project management, protected routes, and user session handling.
- **Database Schema:** Models for User, Project, UserProject, SourceCodeEmbedding (vector storage), Commit, PullRequest, Conversation, Message, and MessageFileReference.

---

## Next Steps & Roadmap

- **Security:**
  - Move all API keys to server-side environment variables
  - Add comprehensive input validation (Zod schemas)
  - Implement API rate limiting and request throttling
  - Add security headers and input sanitization
- **Performance:**
  - Integrate Redis caching for AI responses and repository data
  - Add file size limits and chunking for large files
  - Optimize vector queries and implement pagination
- **Advanced Features:**
  - Export functionality (data, insights)
  - Multiple AI model selection
  - Team collaboration and API access
  - Usage analytics and reporting
  - Mobile responsiveness
- **Testing:**
  - Add unit, integration, and E2E tests
- **SEO & Marketing:**
  - Optimize SEO metadata and content
  - Prepare launch materials and integrate analytics

---

## Tech Stack

- **Frontend:** Next.js 15, React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend:** tRPC, Prisma ORM, Node.js
- **Database:** PostgreSQL with vector extension
- **Authentication:** NextAuth.js (Google OAuth)
- **AI Providers:** Google Gemini, Ollama, Together AI
- **Caching:** Redis (planned)
- **Deployment:** Vercel
- **Monitoring:** Sentry (planned)

---

## Problems & Solutions

| Problem                        | Proposed Solution                                 |
|-------------------------------|---------------------------------------------------|
| API keys exposed on client     | Use server-side environment variables only         |
| Lack of input validation       | Apply Zod schemas, validate and sanitize all input|
| No rate limiting               | Add middleware for request throttling and limits   |
| Slow queries/large files       | Enforce file size limits, chunking, caching, pagination |
| No test coverage               | Add unit, integration, and E2E tests              |
| No analytics                   | Integrate Google Analytics and usage tracking      |

---

## Pricing Strategy

| Plan   | Price/month | Key Features                                 |
|--------|-------------|----------------------------------------------|
| Free   | $0          | 1 repo, 100 AI messages, basic features      |
| Pro    | $19         | 5 repos, 1000 AI messages, advanced features |
| Team   | $49         | 20 repos, 5000 AI messages, team/API access  |

---

## SEO Content Constants

```js
export const SEO = {
  title: "RepoMind - AI-Powered GitHub Insights & Code Review",
  description: "RepoMind helps developers, analysts, and teams analyze, understand, and optimize GitHub repositories using AI. Chat with your codebase, get PR insights, generate documentation, and boost productivity.",
  keywords: [
    "AI code review",
    "GitHub analysis",
    "LLM SaaS",
    "developer tools",
    "pull request insights",
    "codebase chat",
    "repo analytics",
    "software engineering AI",
    "RAG technology",
    "code understanding",
    "business analyst tools",
    "QA tools",
    "technical writing",
    "security code audit",
    "compliance review",
    "static code analysis",
    "API documentation AI",
    "open source analysis",
    "dev productivity",
    "code summarization",
    "AI for developers"
  ],
  url: "https://repomind.com",
  image: "/logo.png",
  author: "RepoMind Team",
  siteName: "RepoMind",
  locale: "en_US",
  og: {
    type: "website",
    title: "RepoMind - AI-Powered GitHub Insights & Code Review",
    description: "AI-powered platform for codebase analysis, PR review, and technical documentation.",
    url: "https://repomind.com",
    image: "/logo.png",
    site_name: "RepoMind"
  },
  twitter: {
    card: "summary_large_image",
    site: "@repomind",
    creator: "@repomind",
    title: "RepoMind - AI-Powered GitHub Insights & Code Review",
    description: "Analyze, chat, and document your GitHub codebase with AI.",
    image: "/logo.png"
  },
  robots: "index, follow",
  themeColor: "#0F172A",
  copyright: "© 2024 RepoMind. All rights reserved.",
  publishedTime: "2024-07-07T00:00:00Z",
  modifiedTime: "2024-07-07T00:00:00Z",
  alternate: [
    { hrefLang: "en", href: "https://repomind.com" },
    { hrefLang: "vi", href: "https://repomind.com/vi" }
  ]
};
```

---

## Database Schema

```sql
-- Core tables (IMPLEMENTED)
User (id, email, name, image, createdAt, updatedAt)
Project (id, name, githubUrl, githubToken, userId, createdAt, updatedAt)
UserProject (id, userId, projectId, createdAt, updatedAt)
SourceCodeEmbedding (id, projectId, fileName, sourceCode, summary, embedding)
Commit (id, projectId, message, hash, author, date, summary)
PullRequest (id, projectId, number, title, body, analysis, status, merged)
Conversation (id, projectId, title, createdAt)
Message (id, conversationId, role, content, createdAt)
MessageFileReference (id, messageId, fileName, sourceCode)
```

## Critical Issues to Fix

### 🔴 **SECURITY (URGENT)**
1. **API Key Exposure**
   ```typescript
   // CURRENT - UNSAFE
   process.env.NEXT_PUBLIC_GEMINI_API_KEY
   process.env.NEXT_PUBLIC_GITHUB_TOKEN
   
   // NEEDS TO BE
   process.env.GEMINI_API_KEY // Server-side only
   process.env.GITHUB_TOKEN // Server-side only
   ```

2. **Input Validation**
   - Add Zod schemas for all inputs
   - Validate GitHub URLs
   - Sanitize user inputs

3. **Rate Limiting**
   - Implement API rate limiting
   - Add request throttling
   - Monitor AI API usage

### 🟡 **PERFORMANCE (IMPORTANT)**
1. **Database Optimization**
   - Add missing indexes
   - Optimize vector queries
   - Implement pagination

2. **Caching**
   - Add Redis for caching
   - Cache AI responses
   - Cache repository data

3. **File Processing**
   - Add file size limits
   - Implement chunking for large files
   - Add progress indicators

## MVP Features Status

### ✅ **CORE FEATURES (COMPLETE)**
- ✅ GitHub repo connection
- ✅ Basic AI chat
- ✅ Simple PR analysis
- ✅ User authentication
- ✅ Basic dashboard

### ❌ **NICE TO HAVE (NOT IMPLEMENTED)**
- ❌ Export functionality
- ❌ Multiple AI models selection
- ❌ Team collaboration
- ❌ API access
- ❌ Usage tracking

## Pricing Strategy

### Free Tier
```
$0/month
- 1 repository
- 100 AI messages/month
- Basic features
- Community support
```

### Pro Tier
```
$19/month
- 5 repositories
- 1000 AI messages/month
- Advanced features
- Priority support
```

### Team Tier
```
$49/month
- 20 repositories
- 5000 AI messages/month
- Team features
- API access
```

## Go-to-Market

### Target Users
- **Primary**: Solo developers, freelancers
- **Secondary**: Small teams (2-5 people)
- **Tertiary**: Startup engineering teams

### Marketing Channels
1. **Product Hunt** - Launch
2. **Hacker News** - Community
3. **Reddit r/programming** - Discussion
4. **Twitter/X** - Social
5. **Dev.to** - Content
6. **GitHub** - Platform

### Launch Strategy
1. **Week 1-2**: Beta testing (10-20 users)
2. **Week 3**: Product Hunt launch
3. **Week 4**: Hacker News post
4. **Month 2**: Content marketing
5. **Month 3**: Paid ads (small budget)

## Revenue Projections

### Year 1 Goals
```
Month 1-3: $0 (development)
Month 4-6: $500/month (50 users)
Month 7-9: $2,000/month (200 users)
Month 10-12: $5,000/month (500 users)
```

### Unit Economics
- **CAC**: $50 (organic growth focus)
- **LTV**: $300 (18-month average)
- **Churn**: 8% monthly
- **Payback**: 6 months

## Technical Debt

### Database
```
```