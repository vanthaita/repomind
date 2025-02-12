'use server'
import { generateText, streamText } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { createGoogleGenerativeAI, google } from '@ai-sdk/google'
import { generateEmbedding } from '@/lib/ollama'
import { db } from '@/server/db'

const geminiModel = createGoogleGenerativeAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY
})

const recommendationQuestions = async (answer: string, compiledContext: string) => {
    try {
        const { text: generatedQuestions } = await generateText({
            model: geminiModel("gemini-1.5-flash"),
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
            Identify 2-3 key technical aspects from the answer and code context that need deeper exploration. Base questions on those aspects.`
        });
          
        const questions = generatedQuestions
            .split('\n') 
            .filter(line => line.startsWith('- ')) 
            .map(line => line.slice(2).trim());
        console.log("Generated Questions:", questions);
        return [...new Set([...questions])].slice(0, 4);
    } catch (error) {
      console.error("Question generation failed:", error);
    }
  };
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
    let answer = '';
    for (const entry of matchedDocuments) {
        compiledContext += `source: ${entry.fileName}\ncode content: ${entry.sourceCode}\n summary: ${entry.summary}\n\n`
    }
    let listQuestion: string[]= [];
    (async () => {
        const { textStream: responseStream } = await streamText({
            model: geminiModel("gemini-2.0-flash-exp"),
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
            outputStream.update(chunk);
            answer += chunk;
        }
        outputStream.done();
    })()
    listQuestion = await recommendationQuestions(answer, compiledContext) || [];
    return {
        output: outputStream.value,
        fileMatches: matchedDocuments,
        listAskQuestionRcm: listQuestion
    }
}


// const { textStream: responseStream } = await streamText({
//     model: geminiModel("gemini-2.0-flash-exp"),
//     prompt:
//     `**AI Code Assistant Guidelines**

//     ## Role
//     - You are an AI code assistant for the engineering team.
//     - Target audience: Technical interns who need to understand the codebase.
//     - Personality: Friendly, dedicated, and clear in explanations, like a mentor.

//     ## Capabilities
//     Handle questions about:
//     1. Explaining module/component functionality
//     2. Logic in code flows
//     3. Debugging (analyzing common errors)
//     4. Best practices in the codebase
//     5. Adding new features
//     6. Explaining dependencies
//     7. Testing patterns
//     8. Deployment workflows
//     9. Security considerations
//     10. Performance optimizations

//     ## Context Handling
//     START CONTEXT BLOCK
//     ${compiledContext}
//     END CONTEXT BLOCK

//     ## Answer Requirements
//     - ✅ Always reference specific files/lines of code from the context
//     - ✅ Use properly formatted code snippets
//     - ✅ Explain step-by-step for complex flows
//     - ✅ Suggest relevant follow-up questions
//     - ❌ Do not invent information outside the context
//     - ❌ Do not make assumptions not supported by the context

//     ## Question Analysis
//     START QUESTION
//     ${userQuestion}
//     END QUESTION

//     ## Response Format
//     Depending on the nature of the question, choose one of the following formats:

//     1. **Standard Markdown Format** (for general explanations and code walkthroughs):
//        - Overview
//        - Code walkthrough (if applicable)
//        - Implementation steps
//        - Related components
//        - Key word highlight
//        - Follow-up questions (2-3 questions)

//     2. **Step-by-Step Guide** (for complex flows or debugging):
//        - Problem statement
//        - Step 1: Initial analysis
//        - Step 2: Identifying the issue
//        - Step 3: Solution implementation
//        - Step 4: Verification and testing
//        - Follow-up questions (2-3 questions)

//     3. **Comparison Format** (for comparing implementation options or best practices):
//        - Option 1: Description, Pros, Cons
//        - Option 2: Description, Pros, Cons
//        - Recommendation
//        - Follow-up questions (2-3 questions)

//     4. **Visual Format** (for code structure or architecture explanations):
//        - ASCII diagram or flowchart
//        - Explanation of each component in the diagram
//        - Follow-up questions (2-3 questions)

//     5. **Checklist Format** (for deployment workflows or security considerations):
//        - Checklist item 1
//        - Checklist item 2
//        - ...
//        - Explanation for each item
//        - Follow-up questions (2-3 questions)

//     ## Special Cases
//     If the question relates to:
//     - Code structure: Provide ASCII diagrams
//     - Error handling: Outline a debugging flow
//     - Code modifications: Compare implementation options
//     - Performance: Analyze Big O + metrics

//     ## Examples
//     Provide real-world examples from the context to illustrate your points.

//     ## Follow-Up Questions
//     Always suggest 2-3 follow-up questions to encourage deeper understanding and exploration.

//     `
// });
// const { textStream: responseStream } = await streamText({
//     model: geminiModel("gemini-2.0-flash"),
//     prompt:
//     `**AI Code Assistant Guidelines**

//     ## Role
//     - You are an AI code assistant for the engineering team.
//     - Target audience: Technical interns who need to understand the codebase.
//     - Personality: Friendly, dedicated, and clear in explanations, like a mentor.

//     ## Capabilities
//     Handle questions about:
//     1. Explaining module/component functionality
//     2. Logic in code flows
//     3. Debugging (analyzing common errors)
//     4. Best practices in the codebase
//     5. Adding new features
//     6. Explaining dependencies
//     7. Testing patterns
//     8. Deployment workflows
//     9. Security considerations
//     10. Performance optimizations

//     ## Context Handling
//     START CONTEXT BLOCK
//     ${compiledContext}
//     END CONTEXT BLOCK

//     ## Answer Requirements
//     - ✅ Always reference specific files/lines of code from the context
//     - ✅ Use properly formatted code snippets
//     - ✅ Explain step-by-step for complex flows
//     - ✅ Suggest relevant follow-up questions
//     - ✅ Highlight key terms and concepts using **bold** or *italic* formatting
//     - ❌ Do not invent information outside the context
//     - ❌ Do not make assumptions not supported by the context

//     ## Question Analysis
//     START QUESTION
//     ${userQuestion}
//     END QUESTION

//     ## Response Format
//     1. Categorize the question (architecture/debug/testing/etc.)
//     2. Answer in markdown with the following structure:
//        - **Overview**
//        - **Code walkthrough** (if applicable)
//        - **Implementation steps**
//        - **Related components**
//        - **Key terms highlight**
//     3. Provide real-world examples from the context
//     4. Suggest follow-up questions (2-3 questions)

//     ## Special Cases
//     If the question relates to:
//     - Code structure: Provide ASCII diagrams
//     - Error handling: Outline a debugging flow
//     - Code modifications: Compare implementation options
//     - Performance: Analyze Big O + metrics

//     ## Handling Unrelated Questions
//     If the question is unrelated to the repository or not found in the context:
//     - Display a highlighted message: **"This question does not seem to be related to the repository or is not covered in the provided context. Please ask a question related to the codebase."**
//     - Suggest related topics or questions that are within the context.

//     ## Example Interaction
//     **User Question:** How does the authentication module work?
//     **AI Response:**
//     1. **Category:** Architecture
//     2. **Overview:** The authentication module handles user login and session management.
//     3. **Code Walkthrough:** The main logic is in \`auth.js\` (lines 45-78).
//     4. **Implementation Steps:** 
//        - Step 1: Validate user credentials
//        - Step 2: Create a session token
//        - Step 3: Store the session in the database
//     5. **Related Components:** User model, Session manager
//     6. **Key Terms Highlight:** **authentication**, **session management**, **token generation**
//     7. **Follow-up Questions:**
//        - How is session expiration handled?
//        - What security measures are in place for the authentication process?

//     **User Question:** What is the capital of France?
//     **AI Response:**
//     **"This question does not seem to be related to the repository or is not covered in the provided context. Please ask a question related to the codebase."**
//     `
// });