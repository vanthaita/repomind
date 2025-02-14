'use client';

import UseProject from '@/hooks/use-project';
import React, { useState, useEffect, useRef } from 'react';
import { createMessageAssistant, createMessageUser, recommendationQuestions, streamAnswerToQuery } from './action';
import { readStreamableValue } from 'ai/rsc';
import MarkDown from '@uiw/react-md-editor';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CodeReference from './codeReference';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/trpc/react';

export const listAskQuestionDefault = [
  "Can you explain the main functionality of the core modules?",
  "How do I set up the development environment for this project?",
  "What are the key dependencies and how are they used?",
  "How do I contribute to this project?",
];
type Props = {
  conversationId: string
}
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const AskQuestion = ({conversationId}: Props) => {
  const { project } = UseProject();
  const [question, setQuestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [filesReferences, setFilesReferences] = useState<
    { fileName: string; sourceCode: string; summary?: string }[]
  >([]);
  const [showCodePanel, setShowCodePanel] = useState<boolean>(true);
  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>(listAskQuestionDefault);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{
    id: string;
    role: string;
    content: string;
    fileReference: {
      id?: string;
      messageId?: string;
      fileName: string;
      sourceCode: string | null; 
    }[];
  }[]>([]);
  const { data: conversationData } = api.project.getConversation.useQuery({
    conversationId,
  });
  const utils = api.useUtils();

  useEffect(() => {
    if (conversationData?.messages) {
      setMessages(conversationData.messages);
    }
  }, [conversationData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRecommendations(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = async (q: string) => {
    if (!project?.id) return;
    setLoading(true);
    const userMessage = await createMessageUser(conversationId, q);
    setMessages((prev) => [...prev, userMessage]);
    
    const tempId = `temp-${Date.now()}`;
    const tempAssistantMessage = {
      id: tempId,
      role: 'assistant',
      content: '',
      fileReference: [],
    };
    setMessages((prev) => [...prev, tempAssistantMessage]);
    
    try {
      const result = await streamAnswerToQuery(q, project.id, conversationId);
      if (!result) throw new Error('Failed to get a response from the server.');
      
      const { output, fileMatches, compiledContext } = result;
      setFilesReferences(fileMatches || []);
      
      let fullAnswer = '';
      for await (const chunk of readStreamableValue(output)) {
        if (chunk) {
          fullAnswer += chunk;
          setMessages((prev) => 
            prev.map(msg => 
              msg.id === tempId ? { ...msg, content: fullAnswer } : msg
            )
          );
          await delay(100);
        }
      }
      
      const assistantMessage = await createMessageAssistant(fileMatches, conversationId, fullAnswer);
      setMessages((prev) => 
        prev.map(msg => msg.id === tempId ? assistantMessage : msg)
      );
      
      await utils.project.getConversation.invalidate({ conversationId });
      const newData = utils.project.getConversation.getData({ conversationId });
      if (newData) setMessages(newData.messages);
      
      const listAskQuestionRcm = await recommendationQuestions(fullAnswer, compiledContext) as string[];
      setRecommendedQuestions(listAskQuestionRcm.length > 0 ? listAskQuestionRcm : listAskQuestionDefault);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => prev.filter(msg => msg.id !== tempId));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(question);
    setQuestion('');
  };

  const selectedMessage = messages.find(msg => msg.id === selectedMessageId);

  return (
    <div className="flex h-full w-full">
      <div className={`${showCodePanel ? 'w-1/2' : 'w-full'} flex flex-col relative`}>
        <div className="flex-1 overflow-auto scroll-custom p-4 w-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 mb-4 w-full ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/programmer.webp" alt="Bot Avatar" />
                  <AvatarFallback>BOT</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`flex flex-col w-full max-w-[80%] ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? ''
                      : ' text-white'
                  }`}
                >
                  <MarkDown.Markdown
                    source={message.content}
                    style={{ 
                      backgroundColor: message.role === 'user' ? '#424242' : 'transparent', 
                      color: '#FFFFFF', 
                      padding: message.role === 'user' ? '5px' : '0px', 
                      borderRadius: message.role === 'user' ? '5px' : '0px' 
                    }}
                    className="break-words "
                  />
                  {message.role === 'assistant' && message.content === '' && loading && (
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
                {message.fileReference.length > 0 && (
                  <div className="mt-2 text-sm text-gray-400">
                    Referenced file: {message.fileReference.length}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
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
              placeholder="Type your question here..."
              className="w-full resize-none border-none outline-none bg-slate-300/25 rounded-lg p-2 sm:bg-transparent sm:p-1"
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
              <div className='flex w-full justify-between items-center'>
                <p className="text-gray-300 p-2">No code references available.</p>
                <button className="text-white mr-1 "onClick={() => setShowCodePanel(false)} >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
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