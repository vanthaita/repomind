// Export all prompt names for easy access
export { PROMPT_NAMES, PromptLoader } from '@/lib/prompt-loader';
export type { PromptTemplate, PromptName } from '@/lib/prompt-loader';

// Re-export individual prompts for convenience
export const PROMPTS = {
  RECOMMENDATION_QUESTIONS: 'recommendation-questions',
  CODE_ASSISTANT: 'code-assistant',
  CODE_ASSISTANT_STREAM: 'code-assistant-stream',
  COMMIT_SUMMARY: 'commit-summary',
  PULL_REQUEST_ANALYSIS: 'pull-request-analysis',
  CODE_SUMMARY: 'code-summary',
  CODE_SUMMARY_TOGETHER: 'code-summary-together',
  CODE_SUMMARY_LOCAL: 'code-summary-local'
} as const;

// Helper function to get prompt content
export async function getPromptContent(promptName: string): Promise<string> {
  const { PromptLoader } = await import('@/lib/prompt-loader');
  const template = await PromptLoader.loadPrompt(promptName);
  return template.content;
}

// Helper function to render prompt with variables
export async function renderPrompt(
  promptName: string, 
  variables: Record<string, string | undefined>
): Promise<string> {
  const { PromptLoader } = await import('@/lib/prompt-loader');
  return PromptLoader.loadAndRender(promptName, variables);
}

// Helper function to validate prompt variables
export async function validatePromptVariables(
  promptName: string, 
  variables: Record<string, string | undefined>
): Promise<string[]> {
  const { PromptLoader } = await import('@/lib/prompt-loader');
  const template = await PromptLoader.loadPrompt(promptName);
  const safeVars = Object.fromEntries(
    Object.entries(variables).map(([k, v]) => [k, v ?? ''])
  );
  return PromptLoader.validateVariables(template, safeVars);
} 