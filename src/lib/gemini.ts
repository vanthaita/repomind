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
        const response = await model.generateContent([
            `You are an intelligent senior software engineer who specializes in onboarding junior software engineers onto projects`,
            `You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file
            Here is code: 
            ---
            ${code}
            ---
                Give a summary no more than 100 words of code above.`
        ])
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



// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { Document } from '@langchain/core/documents';

// const geminiKeys: string[] = (process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')
//   .split(',')
//   .map(key => key.trim())
//   .filter(Boolean);

// if (geminiKeys.length === 0) {
//   throw new Error('No Gemini API keys provided in NEXT_PUBLIC_GEMINI_API_KEY');
// }

// interface ApiKeyStatus {
//   key: string;
//   count: number;
//   resetTime: number;
// }

// // Initialize API key statuses with staggered reset times
// const apiKeys: ApiKeyStatus[] = geminiKeys.map((key, index) => ({
//   key,
//   count: 0,
//   resetTime: Date.now() + (index * 15000), // Stagger resets every 15 seconds
// }));

// const MAX_REQUESTS_PER_MINUTE = parseInt(process.env.GEMINI_RATE_LIMIT || '14', 10); // Configurable limit

// // Mutex for atomic operations
// const mutex = {
//   locked: false,
//   queue: [] as (() => void)[],
// };

// async function runWithMutex<T>(fn: () => Promise<T>): Promise<T> {
//   while (mutex.locked) {
//     await new Promise<void>(resolve => mutex.queue.push(resolve));
//   }
//   mutex.locked = true;
//   try {
//     return await fn();
//   } finally {
//     mutex.locked = false;
//     const next = mutex.queue.shift();
//     if (next) next();
//   }
// }

// let lastUsedIndex = -1;

// async function getAvailableKey(): Promise<string | null> {
//   return runWithMutex(async () => {
//     const now = Date.now();

//     // Reset expired keys
//     apiKeys.forEach(keyStatus => {
//       if (now >= keyStatus.resetTime) {
//         keyStatus.count = 0;
//         keyStatus.resetTime = now + 60000; // Reset window
//       }
//     });

//     // Check all keys starting from last used
//     for (let i = 0; i < apiKeys.length; i++) {
//       lastUsedIndex = (lastUsedIndex + 1) % apiKeys.length;
//       const keyStatus = apiKeys[lastUsedIndex];
      
//       if (keyStatus.count < MAX_REQUESTS_PER_MINUTE) {
//         keyStatus.count++;
//         // If key was previously rate limited, extend its reset time
//         if (keyStatus.count === MAX_REQUESTS_PER_MINUTE) {
//           keyStatus.resetTime = now + 60000;
//         }
//         return keyStatus.key;
//       }
//     }

//     return null;
//   });
// }

// async function handleAIRequest(
//   requestFn: (key: string) => Promise<string>, 
//   maxRetries: number = apiKeys.length * 2 // Allow more retries
// ): Promise<string> {
//   let retries = 0;

//   while (retries < maxRetries) {
//     const key = await getAvailableKey();
//     if (!key) {
//       await new Promise(resolve => setTimeout(resolve, 5000));
//       retries++;
//       continue;
//     }

//     try {
//       return await requestFn(key);
//     } catch (error: any) {
//       // Handle rate limits with potential Retry-After header
//       if (error?.response?.status === 429 || error?.message?.includes('429')) {
//         const retryAfter = error.response?.headers?.['retry-after'] || 60;
//         const keyStatus = apiKeys.find(k => k.key === key);
//         if (keyStatus) {
//           keyStatus.count = MAX_REQUESTS_PER_MINUTE;
//           keyStatus.resetTime = Date.now() + (parseInt(retryAfter, 10) * 1000);
//         }
//         retries++;
//         await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
//       } else {
//         throw error;
//       }
//     }
//   }

//   throw new Error(`All API keys failed after ${maxRetries} retries`);
// }




// export const aiSummariesCommit = async (diff: string) => {
//     return handleAIRequest(async (key) => {
//         const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
//         const model = genAI.getGenerativeModel({
//             model: 'gemini-1.5-flash'
//         })
//         const response = await model.generateContent([
//             `You are an expert programmer, and you are trying to summarize a git diff. 
//             Reminders about the git diff format: 
//             for every file, there are a few metadata lines. like (for example):
//             \'\'\'
//             diff --git a/src/components/layout/index.tsx b/src/components/layout/index.tsx
//             index 77c98d2..74801c5 100644
//             --- a/src/components/layout/index.tsx
//             +++ b/src/components/layout/index.tsx
//             \'\'\'
//             This means that \'lib/index.js\' was modified in this commit. Note that this is only an example.
//             Then there is a specifier of the lines that were modified.
//             A line starting with \'+\' means it was added.
//             A line starting with \'-\' means that it was deleted.
//             A line that starts with neither \'+\' nor \'-\' is code given for content and better understanding.
//             It is not part of the diff.
//             [...]
//             EXAMPLE SUMMARY COMMENTS:
//             \'\'\'
//             * Raised the amount of returned recordings from 101 to 1001 [packages/server/recordings_api.ts). [packages/server/constants.ts/
//             * Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
//             * Moved the octokit initialization to a separate file [src/octokit.ts). [src/index.ts]
//             * Added an OpenAI API for completions (packages/utils/apis/openai.ts]
//             * Lowered numeric tolerance for test files
//             \'\'\'
//             Most commits will have less comments than this examples list.
//             The last comment does not include the file names.
//             because there were more than two relevant files in the hypothetical commit.
//             Do not include parts of the example in your summary.
//             It is given only as an example of appropriate comments.`,
//             `Please summarize the following diff file: \n\n${diff}`,
//         ]);
//         return response.response.text();
//     })
    
// }


// export const aiSummariesPullRequest = async (diff: string) => {
//     return handleAIRequest(async (key) => {
//         const genAI = new GoogleGenerativeAI(key);
//         const model = genAI.getGenerativeModel({
//             model: 'gemini-1.5-flash'
//         })
//         const response = await model.generateContent([
//             `You are a senior software engineer reviewing GitHub pull requests. Analyze code diffs for:
//             1. Change summary
//             2. Technical issues
//             3. Security concerns
//             4. Code quality assessment
//             5. Improvement suggestions
    
//             Format response as JSON with markdown support. Use this structure:
//             {
//                 "summary": "bullet-point list",
//                 "analysis": {
//                     "issues": ["array", "of", "technical", "problems"],
//                     "security_concerns": ["authentication", "sensitive data", "injection risks"],
//                     "quality_assessment": "code cleanliness, maintainability, and standards compliance",
//                     "improvements": ["specific", "actionable", "suggestions"]
//             }
//             Reminders about the git diff format:
//             for every file, there are a few metadata lines. like (for example):
//             \'\'\'
//             diff --git a/api/auth.js b/api/auth.js
//             index 789abcd..1234567 100644
//             --- a/api/auth.js
//             +++ b/api/auth.js
//             @@ -5,6 +5,8 @@ module.exports = {
//                 jwtSecret: process.env.JWT_SECRET,
//                 databaseURL: process.env.DB_URL,
//                 apiKey: 'public-test-key',
//             +    enableGraphQL: true,
//             +    debugMode: process.env.NODE_ENV === 'development'
//             },
//             authMiddleware: (req, res, next) => {
//             // Simplified auth check
//             diff --git a/.env.example b/.env.example
//             new file mode 100644
//             index 0000000..e69de29
//             diff --git a/config/security.js b/config/security.js
//             deleted file mode 100644
//             index 89a4362..0000000
//             --- a/config/security.js
//             +++ /dev/null
    
//             \'\'\'
//             - The line starting with \`diff --git\` indicates the file being modified.
//             - The lines starting with \`---\` and \`+++\` show the old and new file paths, respectively.
//             - The \`@@\` line indicates the line numbers being changed.
//             - A line starting with \`+\` means it was added.
//             - A line starting with \`-\` means it was deleted.
//             - A line that starts with neither \`+\` nor \`-\` is context code provided for better understanding and is not part of the diff.
//             [...]
//             Example Response:
//             \'\'\'
//             {
//             "summary": [
//                 "* Added new configuration flags for GraphQL and debug mode [api/auth.js]",
//                 "* Removed legacy security configuration file [config/security.js]",
//                 "* Added empty .env example file [.env.example]"
//             ],
//             "analysis": {
//                 "issues": [
//                     "Hardcoded API key in auth configuration",
//                     "Missing input validation in auth middleware"
//                 ],
//                 "security_concerns": [
//                     "Sensitive JWT secret exposed without encryption",
//                     "Debug mode enabled in development environment could leak sensitive data"
//                 ],
//                 "quality_assessment": "Generally clean code but lacks error handling in critical paths. Deleted security config not properly deprecated.",
//                 "improvements": [
//                     "Move API key to environment variables",
//                     "Add input validation middleware",
//                     "Implement configuration schema validation",
//                     "Add deprecation notice for security.js removal"
//                 ]
//             }
//             \'\'\'
//             Notes for pull request analysis:
//             - Focus on the changes made in the pull request, not the example provided above.
//             - If there are many files in the pull request, group similar changes together in the summary.
//             - Avoid repeating file names in every comment if multiple changes are related to the same file or functionality.
//             - Provide concise, actionable feedback that helps improve the codebase.`,
//             `Please analyze the following pull request diff and provide a summary and analysis:\n\n${diff}`,
//         ]);
//         return response.response.text();
//     })
// } 

// export const generateSummaryDoc = async (doc: Document) => {
//     return handleAIRequest(async (key) => {
//         const genAI = new GoogleGenerativeAI(key);
//         const model = genAI.getGenerativeModel({
//             model: 'gemini-1.5-flash'
//         })
//         // console.log(`Generating summary for`, doc.metadata.source);
//         const code = doc.pageContent.slice(0, 10000);
//         const response = await model.generateContent([
//             `You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects`,
//             `You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file
//             Here is code: 
//             ---
//             ${code}
//             ---
//                 Give a summary no more than 100 words of code above.`
//         ])
//         return response.response.text();
//     })
// }

// export const generateEmbedding = async (summary: string) => {
//     const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_SINGLE_API_KEY!);
//     const model = genAI.getGenerativeModel({
//         model: 'text-embedding-004'
//     })
//     const result = await model.embedContent(summary);
//     return result.embedding.values
// }