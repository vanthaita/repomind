// Feature Flags
export const FEATURE_FLAGS = {
  AI_CHAT: true,
  GITHUB_INTEGRATION: true,
  PULL_REQUEST_ANALYSIS: true,
  COMMIT_ANALYSIS: true,
  CODE_EMBEDDING: true,
  REAL_TIME_UPDATES: false,
  ADVANCED_SEARCH: false,
  TEAM_COLLABORATION: false,
} as const;

export const features = [
  {
    title: 'Quickly Understand Business Logic',
    description: 'AI automatically summarizes business flows, APIs, and processing rules, making it easy for Business Analysts and Technical Writers to grasp the system without running the project.',
    roles: ['Business Analyst', 'Technical Writer', 'QA']
  },
  {
    title: 'Analyze Structure & Code Flow',
    description: 'Explore repository structure, data flow, and key components directly from the web interface. Ideal for QA, Auditors, and Security Analysts.',
    roles: ['QA', 'Code Auditor', 'Security Analyst']
  },
  {
    title: 'Security & Compliance Checks',
    description: 'AI quickly detects security issues, hardcoded secrets, and checks for coding guideline compliance—all without building or running code.',
    roles: ['Security Analyst', 'Code Auditor']
  },
  {
    title: 'Summarize Pull Requests & Commits',
    description: 'Automatically summarizes changes and highlights key points, saving review time for anyone involved with the codebase.',
    roles: ['Developer', 'QA', 'BA', 'Auditor']
  },
  {
    title: 'Chat with Your Codebase',
    description: 'Ask questions about logic, APIs, or any part of the codebase and get clear, AI-powered explanations—no coding required.',
    roles: ['Everyone']
  },
]; 