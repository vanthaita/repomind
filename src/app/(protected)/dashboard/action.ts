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
      prompt: `You are an expert at generating follow-up questions.
        Input Sources:
        1. The Answer: ${answer}
        2. Codebase Context: ${compiledContext}
        
        Instructions:
        1. Analyze the answer and codebase context.
        2. Generate 4 follow-up questions.
        3. Follow the question requirements below.
        
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
        
        Actual Context Analysis:
        Identify 2-3 key technical aspects from the answer and code context that need deeper exploration. Base questions on those aspects.
        
        Bad Examples:
        - What is a vector database? (Too generic)
        - Can you explain AI? (Too broad)
        
        Good Examples:
        - How does the retry logic handle Gemini's rate limits? (Specific and technical)
        - What metrics determine choice between Gemini Flash and Pro for RAG? (Specific and technical)
        
        Tone:
        - Technical and specific
        
        Style:
        - Concise and to the point`
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
            WHERE 1 - ("summaryEmbedding" <=> ${embeddingQuery}::vector) > .4
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
                    You are RepoMind - An AI code assistant specializing in GitHub repositories. Your primary task is to help technical interns understand codebases within GitHub repositories.
                    Your primary task is to help interns understand the codebase based on the information provided within the CONTEXT BLOCK.
                    Embody the persona of a knowledgeable codebase expert who can explain code clearly, in detail, and in an easily understandable manner. Your tone should be friendly, patient, and encouraging for learners.
                    You must strictly adhere to the following rules:
                    ONLY USE INFORMATION FROM THE CONTEXT BLOCK: Do not invent, infer, or use knowledge outside the provided context.
                    ANSWER QUESTIONS DIRECTLY: Avoid unnecessary introductions or conclusions. Get straight to the answer.
                    PROVIDE DETAILED EXPLANATIONS: Offer thorough answers, provide step-by-step instructions if necessary, and include code snippets when appropriate.
                    USE MARKDOWN FORMATTING: Format your responses using Markdown, especially for code snippets.
                    IF NOT IN CONTEXT: If the question cannot be answered based on the context, respond concisely with: "I'm sorry, but I don't have the information to answer this question within the current context."  No further explanation is needed.
                    START CONTEXT BLOCK
                    ${context}
                    END CONTEXT BLOCK
                    START QUESTION
                    ${userQuestion}
                    END QUESTION
                    Please answer the question above based on the information within the CONTEXT BLOCK.  You may respond in English, or another language if the context or question suggests it would be more helpful.
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