import Together from "together-ai";
import { Document } from '@langchain/core/documents';

const together = new Together({
    apiKey: process.env.NEXT_PUBLIC_TOGETHER_API_KEY,
});

export const aiSummariesCommitTogetherAI = async (diff: string) => {
    const response = await together.chat.completions.create({
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
        ],
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
    })
    console.log(response.choices[0]?.message?.content);
    return response.choices[0]?.message?.content
}
// export const generateSummaryDocTogetherAI = async (doc: Document): Promise<string> => {
//     try {
//         const code = doc.pageContent.slice(0, 800);
//         const response = await together.chat.completions.create({
//             model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
//             messages: [

//                 {
//                     role: 'system',
//                     content: 'You are an intelligent senior software engineer who specializes in onboarding junior software engineers onto projects.',
//                 },
//                 {
//                     role: 'user',
//                     content: `You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file. Here is code: 
//                     ---
//                     ${code}
//                     ---
//                     Give a summary no more than 100 words of code above.`,
//                 },
//             ],
//             max_tokens: 131072
//         });
//         const summary = response.choices[0]?.message?.content || '';
//         console.log("Generating summary for", doc.metadata.source, summary);
//         return summary;
//     } catch (err) {
//         console.log(err);
//         return '';

//     }
// }
export const generateSummaryDocTogetherAI = async (doc: Document): Promise<string> => {
    try {
        const code = doc.pageContent.slice(0, 2000).split('\n').slice(0, -1).join('\n');
        const response = await together.chat.completions.create({
            model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a seasoned software engineer skilled in mentoring junior developers. Your role is to analyze code and provide clear, concise explanations of its purpose and functionality.',
                },
                {
                    role: 'user',
                    content: `You are onboarding a junior developer and need to explain the purpose and functionality of the ${doc.metadata.source} file. Review the code snippet below and provide a summary that includes:
                    - The primary purpose of the code.
                    - Its main functionalities.
                    - Any notable patterns or practices used.
                    Keep your explanation simple and clear, and limit the summary to 100 words.
                    Code snippet:
                    ---
                    ${code}
                    ---`,
                },
            ],
            max_tokens: 150,
            temperature: 0.7,
        });
        const summary = response.choices[0]?.message?.content || '';
        return summary;
    } catch (err) {
        console.error("Summary error:", err);
        return '';
    }
}
