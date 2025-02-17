import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github';
import { Document } from 'langchain/document';
import { generateEmbedding, generateSummaryDoc } from './gemini';
import { db } from '@/server/db';
import { generateSummaryDocLocal } from './ollama';
import { generateSummaryDocTogetherAI } from './together';

interface GithubLoaderConfig {
    branch?: string;
    ignoreFiles?: string[];
    recursive?: boolean;
    unknownHandling?: 'warn' | 'error' | 'ignore';
    maxConcurrency?: number;
    retries?: number;
    retryDelay?: number;
}

export const loadRepositoryDocuments = async (
    repoUrl: string,
    accessToken: string,
    config: GithubLoaderConfig = {}
): Promise<Document[]> => {
    const {
        branch: initialBranch = 'main', 
        ignoreFiles = ['package.json', 'package-lock.json', 'pnpm-lock.yaml', 'bun.lockb'],
        recursive = true,
        unknownHandling = 'warn',
        maxConcurrency = 5,
    } = config;

    const commonBranches = ['main', 'master', 'develop']; 

    let documents: Document[] = [];
    let lastError: Error | null = null;

    for (const branch of [initialBranch, ...commonBranches]) {
        try {
            const repoLoader = new GithubRepoLoader(repoUrl, {
                accessToken,
                branch,
                ignoreFiles,
                recursive,
                unknown: unknownHandling,
                maxConcurrency,
            });

            documents = await repoLoader.load();
            console.log(`Loaded ${documents.length} documents from GitHub repository: ${repoUrl} (branch: ${branch})`);
            return documents;
        } catch (error) {
            lastError = error as Error;
            console.warn(`Failed to load from branch ${branch}, trying next branch...`);
        }
    }

    console.error(`Failed to load repository from all common branches: ${commonBranches.join(', ')}`);
    throw new Error(`Failed to load repository: ${lastError?.message}`);
};

export const processGithubRepository = async (projectId: string, repoUrl: string, accessToken?: string) => {
    try {
        const documents = await loadRepositoryDocuments(repoUrl, accessToken as string);
        const embeddingResults = await generateDocumentEmbeddings(documents);
        
        await Promise.allSettled(
            embeddingResults.map(async (embeddingData, documentIndex) => {
                console.log(`Processing document ${documentIndex + 1} of ${embeddingResults.length}`);
                if (!embeddingData) return;

                const embeddingRecord = await db.sourceCodeEmbedding.create({
                    data: {
                        summary: embeddingData.summary,
                        sourceCode: embeddingData.sourceContent,
                        fileName: embeddingData.filePath,
                        projectId,
                    },
                });
                
                await db.$executeRaw`
                    UPDATE "source_code_embeddings"
                    SET "summaryEmbedding" = ${embeddingData.embeddingVector}::vector
                    WHERE "id" = ${embeddingRecord.id}
                `;
            })
        );
          
    } catch (error) {
        console.error('Error processing GitHub repository:', error);
        throw error;
    }
}

export const generateDocumentEmbeddings = async (documents: Document[]) => {
    try {
        return await Promise.all(documents.map(async (document) => {
            const summary = await generateSummaryDocTogetherAI(document);
            const embeddingVector = await generateEmbedding(summary);
            
            return {
                summary,
                embeddingVector,
                sourceContent: document.pageContent,
                filePath: document.metadata.source
            };
        }));
    } catch (error) {
        console.error('Error generating document embeddings:', error);
        throw error; 
    }
}