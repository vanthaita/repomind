# Prompts Directory

Thư mục này chứa tất cả các prompt templates được sử dụng trong ứng dụng RepoMind.

## Cấu trúc

```
src/prompts/
├── README.md
├── recommendation-questions.txt    # Generate follow-up questions
├── code-assistant.txt             # Main RepoMind code assistant
├── commit-summary.txt             # Summarize git commits
├── pull-request-analysis.txt      # Analyze pull requests
├── code-summary.txt               # Summarize code files (Gemini)
├── code-summary-together.txt      # Summarize code files (Together AI)
└── code-summary-local.txt         # Summarize code files (Ollama)
```

## Cách sử dụng

### 1. Sử dụng PromptLoader

```typescript
import { PromptLoader, PROMPT_NAMES } from '@/lib/prompt-loader';

// Load và render prompt
const prompt = await PromptLoader.loadAndRender(
  PROMPT_NAMES.CODE_ASSISTANT,
  {
    context: 'Your code context here',
    userQuestion: 'User question here'
  }
);
```

### 2. Load prompt template trước

```typescript
// Load template
const template = await PromptLoader.loadPrompt(PROMPT_NAMES.COMMIT_SUMMARY);

// Validate variables
const missingVars = PromptLoader.validateVariables(template, variables);
if (missingVars.length > 0) {
  console.error('Missing variables:', missingVars);
}

// Render prompt
const renderedPrompt = PromptLoader.renderPrompt(template, variables);
```

## Các Prompt Templates

### 1. recommendation-questions.txt
**Mục đích**: Generate follow-up questions cho user
**Variables**:
- `{answer}` - Answer từ AI
- `{compiledContext}` - Context của codebase

### 2. code-assistant.txt
**Mục đích**: Main prompt cho RepoMind code assistant
**Variables**:
- `{context}` - Code context
- `{userQuestion}` - User question

### 3. commit-summary.txt
**Mục đích**: Summarize git commits
**Variables**:
- `{diff}` - Git diff content

### 4. pull-request-analysis.txt
**Mục đích**: Analyze pull requests
**Variables**:
- `{diff}` - Pull request diff

### 5. code-summary.txt
**Mục đích**: Summarize code files (Gemini)
**Variables**:
- `{fileName}` - File name
- `{code}` - Code content

### 6. code-summary-together.txt
**Mục đích**: Summarize code files (Together AI)
**Variables**:
- `{fileName}` - File name
- `{code}` - Code content

### 7. code-summary-local.txt
**Mục đích**: Summarize code files (Ollama)
**Variables**:
- `{fileName}` - File name
- `{code}` - Code content

## Best Practices

1. **Variable Naming**: Sử dụng camelCase cho variable names
2. **Template Syntax**: Sử dụng `{variableName}` format
3. **Validation**: Luôn validate variables trước khi render
4. **Error Handling**: Handle errors khi load prompts
5. **Type Safety**: Sử dụng `PROMPT_NAMES` constants

## Migration từ Hardcoded Prompts

Để migrate từ hardcoded prompts trong code:

1. **Trước**:
```typescript
const prompt = `You are an expert... ${context} ${question}`;
```

2. **Sau**:
```typescript
const prompt = await PromptLoader.loadAndRender(
  PROMPT_NAMES.CODE_ASSISTANT,
  { context, userQuestion: question }
);
```

## Testing

```typescript
// Test prompt loading
const template = await PromptLoader.loadPrompt(PROMPT_NAMES.CODE_ASSISTANT);
console.log('Variables:', template.variables);

// Test prompt rendering
const rendered = PromptLoader.renderPrompt(template, {
  context: 'test context',
  userQuestion: 'test question'
});
console.log('Rendered:', rendered);
``` 