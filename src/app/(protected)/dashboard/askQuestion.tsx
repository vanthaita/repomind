'use client';

import UseProject from '@/hooks/use-project';
import React, { useState } from 'react';
import { streamAnswerToQuery } from './action';
import { readStreamableValue } from 'ai/rsc';
import MarkDown from '@uiw/react-md-editor';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CodeReference from './codeReference';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const AskQuestion = () => {
  const { project } = UseProject();
  const [question, setQuestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [filesReferences, setFilesReferences] = useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = useState<string>('');
  const [showCodePanel, setShowCodePanel] = useState<boolean>(true);

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
          await delay(100);
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
    <div className="flex h-full w-full">
      <div className={`${showCodePanel ? 'w-1/2' : 'w-full'} flex flex-col relative`}>
        <div className="flex-1 overflow-auto scroll-custom p-4 w-full">
          {(answer || loading) ? (
            <div className="flex items-start gap-2 mb-4 w-full">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/programmer.webp" alt="Bot Avatar" />
                <AvatarFallback>BOT</AvatarFallback>
              </Avatar>
              <div className="flex flex-col w-full">
                {answer && (
                  <div className="flex flex-col w-full markdown-container"> 
                    <MarkDown.Markdown 
                      source={answer} 
                      style={{ backgroundColor: '#282828' }}
                      className="break-words"
                    />
                  </div>
                )}
                {loading && (
                  <div className="mt-2 flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    <span className="ml-2 text-sm text-gray-300">Bot is typing...</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-300">No conversation yet.</p>
          )}
        </div>
        <div className="border-t border-t-[#424242] p-4 h-44 bg-[#282828]">
          <form className="flex" onSubmit={onSubmit}>
            <textarea
              id="message-input"
              className="w-full resize-none border-none outline-none bg-slate-300/25 rounded-lg p-2 sm:bg-transparent sm:p-1"
              placeholder="Type your question here..."
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
            />
            <button
              className="bg-transparent hover:bg-slate-400/25 border-none rounded h-8 p-1 cursor-pointer w-8 ml-2"
              type="submit"
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-send-horizontal"
              >
                <path d="m3 3 3 9-3 9 19-9Z"></path>
                <path d="M6 12h16"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
      {showCodePanel ? (
        <div className="w-1/2 max-w-7xl flex flex-col border-l border-l-[#424242]">
          <div className="flex-1 overflow-y-auto relative">
            {filesReferences.length > 0 ? (
              <CodeReference filesReferences={filesReferences} setShowCodePanel={setShowCodePanel}/>
            ) : (
              <p className="text-gray-300 p-2">No code references available.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="w-8 flex items-center justify-center border-l border-l-[#424242]">
          
          <button onClick={() => setShowCodePanel(true)} className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default AskQuestion;
