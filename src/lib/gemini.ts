import {GoogleGenerativeAI} from '@google/generative-ai'
import { Document } from '@langchain/core/documents';



const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
})

export const aiSummariesCommit = async (diff: string) => {
    const response = await model.generateContent([
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
        It is given only as an example of appropriate comments.`,
        `Please summarize the following diff file: \n\n${diff}`,
    ]);
    return response.response.text();
}

export const aiSummariesPullRequest = async (diff: string) => {
    const response = await model.generateContent([
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
        - Provide concise, actionable feedback that helps improve the codebase.`,
        `Please analyze the following pull request diff and provide a summary and analysis:\n\n${diff}`,
    ]);
    return response.response.text();
} 

export const generateSummaryDoc = async (doc: Document) => {
    console.log(`Generating summary for`, doc.metadata.source);
    try {
        const code = doc.pageContent.slice(0, 10000);
        const response = await model.generateContent(`
            You are a senior software engineer creating onboarding documentation for junior developers. 
            Generate a concise, structured summary of the ${doc.metadata.source} file that helps newcomers quickly understand its role in the project.
            <Code Sample>
            ${code}
            </Code Sample>
            Create a summary that includes:
            1. Primary Purpose - The file's main responsibility in 1 sentence
            2. Key Components - 3-5 main classes/functions/features (prioritize entry points)
            3. Architecture Role - How it interacts with other project files
            4. Critical Details - Any security-sensitive areas or complex patterns
            5. Learning Hook - 1 question a junior should investigate next
            
            Guidelines:
            - Assume basic programming knowledge but no project familiarity
            - Use simple analogies for complex concepts (e.g., "acts like a traffic cop for requests")
            - Highlight patterns matching ${doc.metadata.source} (e.g., "uses React context pattern")
            - Mention if truncated (code >10k chars)
            - Strict 3-5 sentence limit
            - Format in clear paragraphs (no markdown)
            `);
        return response.response.text();
    } catch (err) {
        return ''
    }
}

export const generateEmbedding = async (summary: string) => {
    const model = genAI.getGenerativeModel({
        model: 'text-embedding-004'
    })
    const result = await model.embedContent(summary);
    return result.embedding.values
}
