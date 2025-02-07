import {GoogleGenerativeAI} from '@google/generative-ai'



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