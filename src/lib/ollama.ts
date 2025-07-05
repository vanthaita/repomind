import ollama from 'ollama';
import { Document } from '@langchain/core/documents';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PromptLoader, PROMPT_NAMES } from '@/lib/prompt-loader';

export const aiSummariesCommitLocal = async (diff: string) => {
    const response = await ollama.chat({
        model: 'gemma2',
        messages: [
            {
                role: 'system',
                content: await PromptLoader.loadAndRender(PROMPT_NAMES.COMMIT_SUMMARY_SYSTEM, {})
            },
            {
                role: 'user',
                content: await PromptLoader.loadAndRender(
                    PROMPT_NAMES.COMMIT_SUMMARY,
                    {
                        diff: diff
                    }
                )
            }
        ]
    });
    console.log(response.message.content);
    return response.message.content;
}

export const aiSummariesPullRequestLocal = async (diff: string) => {
    const response = await ollama.chat({
        model: 'gemma2',
        messages: [
            {
                role: 'system',
                content: await PromptLoader.loadAndRender(PROMPT_NAMES.PULL_REQUEST_SYSTEM, {})
            },
            {
                role: 'user',
                content: await PromptLoader.loadAndRender(
                    PROMPT_NAMES.PULL_REQUEST_ANALYSIS,
                    {
                        diff: diff
                    }
                )
            }
        ]
    });
    return response.message.content;
}

export const generateSummaryDocLocal = async (doc: Document) => {
    console.log(`Generating summary for`, doc.metadata.source);
    try {
        const code = doc.pageContent.slice(0, 10000);
        const response = await ollama.chat({
            model: 'gemma2',
            messages: [
                {
                    role: 'system',
                    content: await PromptLoader.loadAndRender(PROMPT_NAMES.CODE_SUMMARY_SYSTEM, {})
                },
                {
                    role: 'user',
                    content: await PromptLoader.loadAndRender(
                        PROMPT_NAMES.CODE_SUMMARY_LOCAL,
                        {
                            fileName: doc.metadata.source,
                            code: code
                        }
                    )
                }
            ]
        });
        console.log(response.message.content);
        return response.message.content;
    } catch (err) {
        return '';
    }
}
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
export const generateEmbedding = async (summary: string) => {
    const model = genAI.getGenerativeModel({
        model: 'text-embedding-004'
    })
    const result = await model.embedContent(summary);
    return result.embedding.values
}
