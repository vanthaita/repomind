import fs from 'fs';
import path from 'path';

export interface PromptTemplate {
  content: string;
  variables: string[];
}

export class PromptLoader {
  private static promptsDir = path.join(process.cwd(), 'src', 'prompts');

  static async loadPrompt(promptName: string): Promise<PromptTemplate> {
    const filePath = path.join(this.promptsDir, `${promptName}.txt`);
    
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      const variables = this.extractVariables(content);
      
      return {
        content,
        variables
      };
    } catch (error) {
      throw new Error(`Failed to load prompt ${promptName}: ${error}`);
    }
  }


  private static extractVariables(content: string): string[] {
    const variableRegex = /\{(\w+)\}/g;
    const variables = new Set<string>();
    let match;

    while ((match = variableRegex.exec(content)) !== null) {
      variables.add(match[1] as string);
    }

    return Array.from(variables);
  }

  static renderPrompt(template: PromptTemplate, variables: Record<string, string | undefined>): string {
    let content = template.content;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      content = content.replace(new RegExp(placeholder, 'g'), value || '');
    }

    return content;
  }


  static async loadAndRender(
    promptName: string, 
    variables: Record<string, string | undefined>
  ): Promise<string> {
    const template = await this.loadPrompt(promptName);
    return this.renderPrompt(template, variables);
  }

  static async getAvailablePrompts(): Promise<string[]> {
    try {
      const files = await fs.promises.readdir(this.promptsDir);
      return files
        .filter(file => file.endsWith('.txt'))
        .map(file => file.replace('.txt', ''));
    } catch (error) {
      console.error('Failed to read prompts directory:', error);
      return [];
    }
  }

  static validateVariables(template: PromptTemplate, variables: Record<string, string>): string[] {
    const missing = template.variables.filter(variable => !(variable in variables));
    return missing;
  }
}

// Predefined prompt names for type safety
export const PROMPT_NAMES = {
  RECOMMENDATION_QUESTIONS: 'recommendation-questions',
  CODE_ASSISTANT: 'code-assistant',
  CODE_ASSISTANT_STREAM: 'code-assistant-stream',
  COMMIT_SUMMARY: 'commit-summary',
  COMMIT_SUMMARY_SYSTEM: 'commit-summary-system',
  PULL_REQUEST_ANALYSIS: 'pull-request-analysis',
  PULL_REQUEST_SYSTEM: 'pull-request-system',
  CODE_SUMMARY: 'code-summary',
  CODE_SUMMARY_TOGETHER: 'code-summary-together',
  CODE_SUMMARY_LOCAL: 'code-summary-local',
  CODE_SUMMARY_SYSTEM: 'code-summary-system'
} as const;

export type PromptName = typeof PROMPT_NAMES[keyof typeof PROMPT_NAMES]; 