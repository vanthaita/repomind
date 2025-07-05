// AI/LLM Constants
export const AI_PROVIDERS = {
  GEMINI: 'gemini',
  OLLAMA: 'ollama',
  TOGETHER: 'together',
  OPENAI: 'openai',
} as const;

export const AI_MODELS = {
  GEMINI_PRO: 'gemini-pro',
  GEMINI_FLASH: 'gemini-1.5-flash',
  OLLAMA_LLAMA2: 'llama2',
  OLLAMA_CODEGEM: 'codegemma',
  TOGETHER_LLAMA2: 'togethercomputer/llama-2-70b-chat',
  OPENAI_GPT4: 'gpt-4',
  OPENAI_GPT35: 'gpt-3.5-turbo',
} as const;

export const AI_MAX_TOKENS = {
  DEFAULT: 4096,
  LARGE: 8192,
  EXTRA_LARGE: 16384,
} as const; 