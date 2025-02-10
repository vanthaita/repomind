'use server'
import { streamText } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { createGoogleGenerativeAI, google } from '@ai-sdk/google'
import { generateEmbedding } from '@/lib/ollama'
import { db } from '@/server/db'

const geminiModel = createGoogleGenerativeAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY
})

export const streamAnswerToQuery = async (userQuestion: string, projectIdentifier: string) => {
    const outputStream = createStreamableValue();
    
    const embeddingVector = await generateEmbedding(userQuestion);

    const embeddingQuery = `[${embeddingVector.join(',')}]`
    const matchedDocuments = await db.$queryRaw`
        SELECT "fileName", "sourceCode", "summary",
        1 - ("summaryEmbedding" <=> ${embeddingQuery}::vector) AS similarity
        FROM "source_code_embeddings"
        WHERE 1 - ("summaryEmbedding" <=> ${embeddingQuery}::vector) > .5
        AND "projectId" = ${projectIdentifier}
        ORDER BY similarity DESC
        LIMIT 10
    ` as { fileName: string, sourceCode: string, summary: string }[];
    let compiledContext = '';

    for (const entry of matchedDocuments) {
        compiledContext += `source: ${entry.fileName}\ncode content: ${entry.sourceCode}\n summary: ${entry.summary}\n\n`
    }
    console.log("", userQuestion);
    (async () => {
        const { textStream: responseStream } = await streamText({
            model: geminiModel("gemini-1.5-flash"),
            prompt:
            `\n
                You are an AI code assistant who answers questions about the codebase. Your target audience is a technical intern who is looking to understand the codebase.
                The AI assistant is a brand new, powerful, human-like artificial intelligence. The traits of the AI include expert knowledge, helpfulness, cleverness, and articulateness.
                The AI is a well-behaved and well-mannered individual.
                The AI is always friendly, kind, and inspiring, and it is eager to provide vivid and thoughtful responses to the user.
                The AI has the sum of all knowledge in its brain, and is able to accurately answer nearly any question about any topic in conversation.
                If the question is asking about code or a specific file, the AI will provide a detailed answer, giving step-by-step instructions, including code snippets.
                START CONTEXT BLOCK
                ${compiledContext}
                END OF CONTEXT BLOCK
                START QUESTION
                ${userQuestion}
                END OF QUESTION
                The AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
                If the context does not provide the answer to the question, the AI assistant will say, "I'm sorry, but I don't know the answer".
                The AI assistant will not apologize for previous responses, but instead will indicate new information was gained.
                The AI assistant will not invent anything that is not drawn directly from the context.
                Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when answering, and make sure there is no extraneous commentary or assumptions not supported by the context.
            `
        });
        for await (const chunk of responseStream) {
            outputStream.update(chunk)
        }
        outputStream.done();
        console.log("Response: ", outputStream.value);
    })()
    return {
        output: outputStream.value,
        fileMatches: matchedDocuments
    }
}
