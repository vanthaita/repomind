'use client';

import UseProject from '@/hooks/use-project';
import React, { useState, useEffect, useRef } from 'react';
import { streamAnswerToQuery } from './action';
import { readStreamableValue } from 'ai/rsc';
import MarkDown from '@uiw/react-md-editor';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CodeReference from './codeReference';
import { Button } from '@/components/ui/button';
export const listAskQuestionDefault = [
  "What is the overall structure and architecture of this project?",
  "Can you explain the main functionality of the core modules?",
  "How do I set up the development environment for this project?",
  "What are the key dependencies and how are they used?",
//   "How does the data flow between different components?",
//   "Are there any known issues or limitations I should be aware of?",
//   "What testing strategies are implemented in this project?",
//    "How do I contribute to this project?",
];
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
  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>(listAskQuestionDefault);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRecommendations(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    console.log(recommendedQuestions)
  }, []);

  const handleSubmit = async (q: string) => {
    if (!project?.id) return;
    
    setAnswer('');
    setFilesReferences([]);
    setLoading(true);

    try {
      const { output, fileMatches, listAskQuestionRcm } = await streamAnswerToQuery(q, project.id);
      setFilesReferences(fileMatches || []);
      const recommendedQuestions = listAskQuestionRcm.length > 0 ? listAskQuestionRcm : listAskQuestionDefault;
      setRecommendedQuestions(recommendedQuestions);
      for await (const chunk of readStreamableValue(output)) {
        if (chunk) {
          await delay(100);
          setAnswer((prev) => prev + chunk);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(question);
    console.log(recommendedQuestions)
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
        <div className="relative w-full" ref={dropdownRef}>
          {showRecommendations && (
              <div className="bottom-full left-0 w-full border-t border-t-[#424242] z-10">
                <div className="p-2 space-y-2">
                  {recommendedQuestions.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuestion(q);
                        handleSubmit(q);
                        setShowRecommendations(false); 
                      }}
                      className="w-full text-left p-2 text-sm text-gray-300 hover:bg-[#424242] rounded"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        <div className="border-t border-t-[#424242] p-4 h-40 bg-[#282828]">
          <form className="flex items-center gap-2" onSubmit={onSubmit}>
            <textarea
                className="w-full resize-none border-none outline-none bg-slate-300/25 rounded-lg p-2 sm:bg-transparent sm:p-1"
                placeholder="Type your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onFocus={() => setShowRecommendations(true)} 
              />
            <Button
              className="bg-transparent hover:bg-slate-400/25 border-none rounded h-12 p-1 cursor-pointer w-12"
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
                className="lucide lucide-send-horizontal "
              >
                <path d="m3 3 3 9-3 9 19-9Z"></path>
                <path d="M6 12h16"></path>
              </svg>
            </Button>
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