'use server';
import { generateText, streamText } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateEmbedding } from '@/lib/ollama';
import { db } from '@/server/db';
import { error } from 'console';

const geminiModel = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export const generateRecommendationQuestions = async (answer: string, compiledContext: string) => {
  try {
    const { text: generatedQuestions } = await generateText({
      model: geminiModel('gemini-1.5-flash'),
      prompt: `Analyze the technical documentation and support information below to generate exactly 4 follow-up questions that help developers deeply understand the LLM integration. Follow these strict guidelines:
            Input Sources:
            1. The Answer: ${answer}
            2. Codebase Context: ${compiledContext}
            Question Requirements:
            1. Structure (1 question each):
                a) Configuration/Setup: Specific to environment variables or initialization
                b) Model Selection: Comparison of mentioned LLM providers/versions
                c) Advanced Usage: Optimization, monitoring, or advanced RAG patterns
                d) Provider-Specific: Features unique to one listed provider (Ollama/Gemini)
            2. Content Rules:
                - Must reference specific components/functions from the codebase context
                - Should require understanding of both architecture and LLM concepts
                - Must be answerable using provided context
                - Avoid generic questions about AI/ML basics
            3. Formatting:
                - Start with "Here are recommended technical follow-up questions:"
                - Use markdown bullet points (- )
                - Keep questions under 50 characters
                - Use code terms (e.g., "vector DB", "temperature param")
                - No numbered lists
                - Max 4 questions
            Example Output:
            Here are recommended technical follow-up questions:
            - How do I configure the chunk_size parameter for Ollama embeddings?
            - What metrics determine choice between Gemini Flash and Pro for RAG?
            - Can we implement hybrid search with the current vector DB setup?
            - How does the retry logic handle Gemini's rate limits?
            
            **Actual Context Analysis:**
            Identify 2-3 key technical aspects from the answer and code context that need deeper exploration. Base questions on those aspects.`,
    });

    const questions = generatedQuestions
      .split('\n')
      .filter((line) => line.startsWith('- '))
      .map((line) => line.slice(2).trim());
    console.log('Generated Questions:', questions);
    return [...new Set([...questions])].slice(0, 4);
  } catch (err) {
    console.error('Question generation failed:', err);
    return [];
  }
};

export const persistConversation = async (userQuestion: string, projectIdentifier: string) => {
  const conversation = await db.conversation.create({
    data: {
      projectId: projectIdentifier,
      title: userQuestion.substring(0, 50),
    },
  });
  return conversation.id;
};
export const ChangeNameConversation = async (userQuestion: string, conversationId: string) => {
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }
  console.log("Updating conversation with ID:", conversationId);
  console.log(userQuestion, conversationId);
  const conversation = await db.conversation.update({
    where: { id: conversationId },
    data: {
      title: userQuestion.substring(0, 50),
    },
  });
  console.log('Conversation', conversation);
  return conversation.id;
};
export const createUserMessage = async (conversationId: string, userQuestion: string) => {
  const userMessage = await db.message.create({
    data: {
      conversationId,
      role: 'user',
      content: userQuestion,
    },
  });

  return {
    ...userMessage,
    fileReference: [],
  };
};
export const createAssistantMessage = async (
  matchedDocuments: any[],
  conversationId: string,
  answer: string
) => {
  const assistantMessage = await db.message.create({
    data: {
      conversationId: conversationId,
      role: 'assistant',
      content: answer,
    },
  });
  await db.messageFileReference.createMany({
    data: matchedDocuments.map((file) => {
      return {
        messageId: assistantMessage.id,
        fileName: file.fileName,
        sourceCode: file.sourceCode,
      };
    }),
  });
  return {
    ...assistantMessage,
    fileReference: matchedDocuments,
  };
};
export const streamAndGenerateAnswer = async (
  userQuestion: string,
  projectIdentifier: string,
  conversationId: string
) => {
    const outputStream = createStreamableValue();

    const isConversationValid = await db.conversation.findUnique({
        where: { id: conversationId, projectId: projectIdentifier },
    });

    if (!isConversationValid) {
        throw error('error conversation id');
    }

    const embeddingVector = await generateEmbedding(userQuestion);

    const embeddingQuery = `[${embeddingVector.join(',')}]`;
    const relevantDocuments = (await db.$queryRaw`
            SELECT "fileName", "sourceCode", "summary",
            1 - ("summaryEmbedding" <=> ${embeddingQuery}::vector) AS similarity
            FROM "source_code_embeddings"
            WHERE 1 - ("summaryEmbedding" <=> ${embeddingQuery}::vector) > .5
            AND "projectId" = ${projectIdentifier}
            ORDER BY similarity DESC
            LIMIT 10
        `) as { fileName: string; sourceCode: string; summary: string }[];
    let context = '';
    for (const entry of relevantDocuments) {
        context += `source: ${entry.fileName}\ncode content: ${entry.sourceCode}\n summary: ${entry.summary}\n\n`;
    }
    let answer = '';
    (async () => {
        const { textStream: responseStream } = await streamText({
        model: geminiModel('gemini-2.0-flash-001'),
        prompt: `\n
                    You are an AI code assistant who answers questions about the codebase. Your target audience is a technical intern who is looking to understand the codebase.
                    The AI assistant is a brand new, powerful, human-like artificial intelligence. The traits of the AI include expert knowledge, helpfulness, cleverness, and articulateness.
                    The AI is a well-behaved and well-mannered individual.
                    The AI is always friendly, kind, and inspiring, and it is eager to provide vivid and thoughtful responses to the user.
                    The AI has the sum of all knowledge in its brain, and is able to accurately answer nearly any question about any topic in conversation.
                    If the question is asking about code or a specific file, the AI will provide a detailed answer, giving step-by-step instructions, including code snippets.
                    START CONTEXT BLOCK
                    ${context}
                    END OF CONTEXT BLOCK
                    START QUESTION
                    ${userQuestion}
                    END OF QUESTION
                    The AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
                    If the context does not provide the answer to the question, the AI assistant will say, "I'm sorry, but I don't know the answer".
                    The AI assistant will not apologize for previous responses, but instead will indicate new information was gained.
                    The AI assistant will not invent anything that is not drawn directly from the context.
                    Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when answering, and make sure there is no extraneous commentary or assumptions not supported by the context.
                `,
        });

        for await (const chunk of responseStream) {
        answer += chunk;
        outputStream.update(chunk);
        }
        outputStream.done();
    })();

    return {
        output: outputStream.value,
        fileMatches: relevantDocuments,
        compiledContext: context,
    };
};