import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github';
import { Document } from 'langchain/document';
import { generateEmbedding, generateSummaryDoc } from './gemini';
import { db } from '@/server/db';
import { generateSummaryDocLocal } from './ollama';
import { generateSummaryDocTogetherAI } from './together';

interface GithubLoaderOptions {
    branch?: string;
    ignoreFiles?: string[];
    recursive?: boolean;
    unknown?: 'warn' | 'error' | 'ignore';
    maxConcurrency?: number;
    retries?: number;
    retryDelay?: number;
}

export const githubLoader = async (
    githubUrl: string,
    githubToken: string,
    options: GithubLoaderOptions = {}
): Promise<Document[]> => {
    const {
        branch = 'main',
        ignoreFiles = ['package.json', 'package-lock.json', 'pnpm-lock.yaml', 'bun.lockb'],
        recursive = true,
        unknown = 'warn',
        maxConcurrency = 5,
    } = options;

    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken || '',
        branch,
        ignoreFiles,
        recursive,
        unknown,
        maxConcurrency,
    });
    const docs = await loader.load();
    console.log(`Successfully loaded ${docs.length} documents from GitHub repository: ${githubUrl}`);
    return docs;
};


export const GithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    try {
        const docs = await githubLoader(githubUrl, githubToken as string);
        const allEmbeddedDocs = await generateEmbeddingDocs(docs);
        await Promise.allSettled(
            allEmbeddedDocs.map(async (embedding, index) => {
                console.log(`Processing ${index} of ${allEmbeddedDocs.length}`);
                if(!embedding) return
                const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
                    data: {
                    summary: embedding.summaryDoc,
                    sourceCode: embedding.sourceCode,
                    fileName: embedding.fileName,
                    projectId,
                    },
                });
                
                await db.$executeRaw`
                    UPDATE "source_code_embeddings"
                    SET "summaryEmbedding" = ${embedding.embeddedDoc}::vector
                    WHERE "id" = ${sourceCodeEmbedding.id}
                `;
            })
          );
          
    } catch (error) {
        console.error(`Error processing GitHub repository`);
        throw error;
    }
}
export const generateEmbeddingDocs = async (docs: Document[]) => {
    try {
        return await Promise.all(docs.map(async (doc) => {
            // const summaryDoc = await generateSummaryDoc(doc);
            const summaryDoc = await generateSummaryDocTogetherAI(doc);
            const embeddedDoc = await generateEmbedding(summaryDoc);
            return {
                summaryDoc,
                embeddedDoc,
                sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
                fileName: doc.metadata.source
            };
        }));
    } catch (error) {
        console.error(`Error generating embedding documents`);
        throw error; 
    }
}