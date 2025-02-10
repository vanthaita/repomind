import ollama from 'ollama';
import { Document } from '@langchain/core/documents';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const aiSummariesCommitLocal = async (diff: string) => {
    const response = await ollama.chat({
        model: 'gemma2',
        messages: [
            {
                role: 'system',
                content: 
                `You are an expert programmer, and you are trying to summarize a git diff. 
                Reminders about the git diff format: 
                for every file, there are a few metadata lines. like (for example):
                \'\'\'
                diff --git a/src/components/layout/index.tsx b/src/components/layout/index.tsx
                index 77c98d2..74801c5 100644
                --- a/src/components/layout/index.tsx
                +++ b/src/components/layout/index.tsx
                \'\'\'
                This means that \'lib/index.js\' was modified in this commit. Note that this is only an example.
                Then there is a specifier of the lines that were modified.
                A line starting with \'+\' means it was added.
                A line starting with \'-\' means that it was deleted.
                A line that starts with neither \'+\' nor \'-\' is code given for content and better understanding.
                It is not part of the diff.
                [...]
                EXAMPLE SUMMARY COMMENTS:
                \'\'\'
                * Raised the amount of returned recordings from 101 to 1001 [packages/server/recordings_api.ts). [packages/server/constants.ts/
                * Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
                * Moved the octokit initialization to a separate file [src/octokit.ts). [src/index.ts]
                * Added an OpenAI API for completions (packages/utils/apis/openai.ts]
                * Lowered numeric tolerance for test files
                \'\'\'
                Most commits will have less comments than this examples list.
                The last comment does not include the file names.
                because there were more than two relevant files in the hypothetical commit.
                Do not include parts of the example in your summary.
                It is given only as an example of appropriate comments.`
            },
            {
                role: 'user',
                content: `Please summarize the following diff file: \n\n${diff}`
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
                content: 
                `You are a senior software engineer reviewing GitHub pull requests. Analyze code diffs for:
                1. Change summary
                2. Technical issues
                3. Security concerns
                4. Code quality assessment
                5. Improvement suggestions

                Format response as JSON with markdown support. Use this structure:
                {
                    "summary": "bullet-point list",
                    "analysis": {
                        "issues": ["array", "of", "technical", "problems"],
                        "security_concerns": ["authentication", "sensitive data", "injection risks"],
                        "quality_assessment": "code cleanliness, maintainability, and standards compliance",
                        "improvements": ["specific", "actionable", "suggestions"]
                }
                Reminders about the git diff format:
                for every file, there are a few metadata lines. like (for example):
                \'\'\'
                diff --git a/api/auth.js b/api/auth.js
                index 789abcd..1234567 100644
                --- a/api/auth.js
                +++ b/api/auth.js
                @@ -5,6 +5,8 @@ module.exports = {
                    jwtSecret: process.env.JWT_SECRET,
                    databaseURL: process.env.DB_URL,
                    apiKey: 'public-test-key',
                +    enableGraphQL: true,
                +    debugMode: process.env.NODE_ENV === 'development'
                },
                authMiddleware: (req, res, next) => {
                // Simplified auth check
                diff --git a/.env.example b/.env.example
                new file mode 100644
                index 0000000..e69de29
                diff --git a/config/security.js b/config/security.js
                deleted file mode 100644
                index 89a4362..0000000
                --- a/config/security.js
                +++ /dev/null

                \'\'\'
                - The line starting with \`diff --git\` indicates the file being modified.
                - The lines starting with \`---\` and \`+++\` show the old and new file paths, respectively.
                - The \`@@\` line indicates the line numbers being changed.
                - A line starting with \`+\` means it was added.
                - A line starting with \`-\` means it was deleted.
                - A line that starts with neither \`+\` nor \`-\` is context code provided for better understanding and is not part of the diff.
                [...]
                Example Response:
                \'\'\'
                {
                "summary": [
                    "* Added new configuration flags for GraphQL and debug mode [api/auth.js]",
                    "* Removed legacy security configuration file [config/security.js]",
                    "* Added empty .env example file [.env.example]"
                ],
                "analysis": {
                    "issues": [
                        "Hardcoded API key in auth configuration",
                        "Missing input validation in auth middleware"
                    ],
                    "security_concerns": [
                        "Sensitive JWT secret exposed without encryption",
                        "Debug mode enabled in development environment could leak sensitive data"
                    ],
                    "quality_assessment": "Generally clean code but lacks error handling in critical paths. Deleted security config not properly deprecated.",
                    "improvements": [
                        "Move API key to environment variables",
                        "Add input validation middleware",
                        "Implement configuration schema validation",
                        "Add deprecation notice for security.js removal"
                    ]
                }
                \'\'\'
                Notes for pull request analysis:
                - Focus on the changes made in the pull request, not the example provided above.
                - If there are many files in the pull request, group similar changes together in the summary.
                - Avoid repeating file names in every comment if multiple changes are related to the same file or functionality.
                - Provide concise, actionable feedback that helps improve the codebase.`
            },
            {
                role: 'user',
                content: `Please analyze the following pull request diff and provide a summary and analysis:\n\n${diff}`
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
                    content: `You are an intelligent senior software engineer who specializes in onboarding junior software engineers onto projects`
                },
                {
                    role: 'user',
                    content: 
                    `
                    You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file
                    Here is code: 
                    ---
                    ${code}
                    ---
                        Give a summary no more than 100 words of code above.
                    `
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
