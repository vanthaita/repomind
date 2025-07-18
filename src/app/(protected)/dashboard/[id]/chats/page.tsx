'use client'
import { api } from '@/trpc/react';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, ChevronRight, Plus, Loader2 } from 'lucide-react'; 
import UseProject from '@/hooks/use-project';
import { Button } from '@/components/ui/button';

import { useRouter } from 'next/navigation';
import useRefetch from '@/hooks/use-refresh';
import { persistConversation } from '../../../../../lib/action';
import { SectionLoading, ConversationSkeleton } from '@/components/ui/loading';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const AskList = () => {
    const { projectId } = UseProject();
    const { data: conversationsResponse, isLoading: isLoadingConversations } = api.conversation.getConversations.useQuery({ 
      projectId,
      page: 1,
      limit: 20,
    });
    const conversations = conversationsResponse?.data || [];
    const [isLoading, setIsLoading] = React.useState(false); 
    const router = useRouter();
    const refetch = useRefetch();

    const onSubmit = async () => {
        setIsLoading(true);
        try {
            const newConversationID = await persistConversation('Untitled', projectId);
            console.log(newConversationID);
            await delay(2000); 
            refetch();
            router.push(`/dashboard/${projectId}/chats/${newConversationID}`); 
        } catch (error) {
            console.error('Failed to create conversation:', error);
        } finally {
            setIsLoading(false); 
        }
    };
    return (
        <>
            {projectId ? (
                <div className='rounded-xl '>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
                        <div className='flex items-center gap-4'>
                            <MessageCircle className='w-8 h-8 text-green-400' />
                            <h1 className="text-2xl font-bold text-green-400">Chat History</h1>
                        </div>
                        <Button
                            className='flex items-center gap-3 px-6 py-3 bg-green-400 text-[#232323] rounded-xl hover:bg-green-500 transition-colors text-lg font-semibold min-w-[160px] w-full sm:w-auto justify-center shadow-md'
                            onClick={onSubmit}
                            disabled={isLoading} 
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" /> 
                            ) : (
                                <>
                                    <Plus className='w-6 h-6' />
                                    <span>New Chat</span>
                                </>
                            )}
                        </Button>
                    </div>

                    <div className='space-y-4'>
                        {isLoadingConversations ? (
                            [...Array(3)].map((_, i) => (
                                <ConversationSkeleton key={i} />
                            ))
                        ) : conversations?.length ? conversations.map((conversation) => (
                            <Link
                                key={conversation.id}
                                href={`/dashboard/${projectId}/chats/${conversation.id}`}
                                className='flex items-center gap-4 p-5 bg-[#282828] rounded-xl border border-transparent hover:border-green-400 hover:bg-[#232323] transition-colors group shadow-sm cursor-pointer'
                            >
                                <MessageCircle className='w-6 h-6 text-gray-400 flex-shrink-0' />
                                <div className='flex-1 min-w-0'>
                                    <h2 className='text-lg font-semibold text-white truncate'>{conversation.title}</h2>
                                </div>
                                <ChevronRight className='w-6 h-6 text-gray-400 group-hover:text-green-400 transition-colors ml-2' />
                            </Link>
                        )) : (
                            <div className='flex flex-col items-center justify-center gap-4 p-8 text-center text-gray-400 bg-[#282828] rounded-xl border border-dashed border-gray-600'>
                                <MessageCircle className='w-10 h-10 text-green-400 mb-2' />
                                <div className='text-lg'>No conversations yet.<br/>Start a new chat!</div>
                                <Button
                                    className='flex items-center gap-3 px-6 py-3 bg-green-400 text-[#232323] rounded-xl hover:bg-green-500 transition-colors text-lg font-semibold min-w-[160px] w-full sm:w-auto justify-center shadow-md mt-2'
                                    onClick={onSubmit}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <Plus className='w-6 h-6' />
                                            <span>New Chat</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className='p-8 bg-[#282828] rounded-xl shadow-md flex flex-col items-center'>
                    <div className='flex items-center gap-4 mb-4'>
                        <MessageCircle className='w-8 h-8 text-green-400' />
                        <h1 className="text-2xl font-bold text-green-400">Chat History</h1>
                    </div>
                    <p className='text-lg text-gray-400 mb-4'>You are not assigned to any project.</p>
                    <Link href='/dashboard'>
                        <Button className='flex items-center gap-3 px-6 py-3 bg-green-400 text-[#232323] rounded-xl hover:bg-green-500 transition-colors text-lg font-semibold min-w-[160px] w-full sm:w-auto justify-center shadow-md'>
                            Click button new project to create new
                        </Button>
                    </Link>
                </div>
            )}
        </>
    );
};

export default AskList;