'use client';

import UseProject from '@/hooks/use-project';
import React, { useState } from 'react';
import { streamAnswerToQuery } from './action';
import { readStreamableValue } from 'ai/rsc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MarkDown from '@uiw/react-md-editor';
import CodeReference from './codeReference';

const AskQuestion = () => {
  const { project } = UseProject();
  const [question, setQuestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [filesReferences, setFilesReferences] = useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = useState<string>('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project?.id) {
      console.error('Project id is missing');
      return;
    }
    setAnswer('');
    setFilesReferences([]);
    setLoading(true);

    try {
      const { output, fileMatches } = await streamAnswerToQuery(question, project.id);
      setFilesReferences(fileMatches || []);

      for await (const chunk of readStreamableValue(output)) {
        if (chunk !== undefined) {
          setAnswer((prev) => prev + chunk);
        }
      }
    } catch (error) {
      console.error('Error fetching answer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-4 mb-4">
        <Input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="w-full"
        />
        <Button type="submit" disabled={loading || !question.trim()}>
          {loading ? 'Loading...' : 'Ask'}
        </Button>
      </form>

      {answer && (
        <div className="mb-4">
          <MarkDown.Markdown
            source={answer}
            className="prose max-w-none p-4 border rounded-md overflow-auto bg-white"
          />
        </div>
      )}

      {filesReferences.length > 0 && (
        <div className="mt-4">
          <CodeReference filesReferences={filesReferences} />
        </div>
      )}
    </div>
  );
};

export default AskQuestion;
