'use server';
import { generateText, streamText } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateEmbedding } from '@/lib/ollama';
import { db } from '@/server/db';
import { error } from 'console';
import { PromptLoader, PROMPT_NAMES } from '@/lib/prompt-loader';

const geminiModel = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export const generateRecommendationQuestions = async (answer: string, compiledContext: string) => {
  try {
    const { text: generatedQuestions } = await generateText({
      model: geminiModel('gemini-1.5-flash'),
      prompt: await PromptLoader.loadAndRender(
        PROMPT_NAMES.RECOMMENDATION_QUESTIONS,
        {
          answer: answer,
          compiledContext: compiledContext
        }
      )
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
      prompt: await PromptLoader.loadAndRender(
        PROMPT_NAMES.CODE_ASSISTANT_STREAM,
        {
          context: context,
          userQuestion: userQuestion
        }
      ),
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