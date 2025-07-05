'use client'
import { api } from '@/trpc/react';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, ChevronRight, Plus, Loader2 } from 'lucide-react'; 
import UseProject from '@/hooks/use-project';
import { Button } from '@/components/ui/button';
import { persistConversation } from '../../../lib/action';
import { useRouter } from 'next/navigation';
import useRefetch from '@/hooks/use-refresh';
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
            router.push(`/dashboard/chat/${newConversationID}`); 
        } catch (error) {
            console.error('Failed to create conversation:', error);
        } finally {
            setIsLoading(false); 
        }
    };
    return (
        <>
            {projectId ? (
                <div className='p-6 bg-[#282828] rounded-xl shadow-lg'>
                    <div className='flex items-center justify-between mb-6'>
                        <div className='flex items-center gap-3'>
                            <MessageCircle className='w-6 h-6 text-green-400' />
                            <h1 className="text-xl font-semibold text-green-400">Chat History</h1>
                        </div>
                        <Button
                            className='flex items-center gap-2 px-4 py-2 bg-green-400 text-[#282828] rounded-lg hover:bg-green-500 transition-colors'
                            onClick={onSubmit}
                            disabled={isLoading} 
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" /> 
                            ) : (
                                <>
                                    <Plus className='w-5 h-5' />
                                    <span className='text-sm font-medium'>New Chat</span>
                                </>
                            )}
                        </Button>
                    </div>

                    <div className='space-y-3'>
                        {isLoadingConversations ? (
                            [...Array(3)].map((_, i) => (
                                <ConversationSkeleton key={i} />
                            ))
                        ) : conversations?.length ? conversations.map((conversation) => (
                            <Link
                                key={conversation.id}
                                href={`/dashboard/chat/${conversation.id}`}
                                className='flex items-center gap-4 p-4 bg-[#424242] rounded-lg hover:bg-[#363636] transition-colors group'
                            >
                                <MessageCircle className='w-5 h-5 text-gray-400 flex-shrink-0' />
                                
                                <div className='flex-1 min-w-0'>
                                    <h2 className='text-base font-medium text-white truncate'>{conversation.title}</h2>
                                </div>
                                <ChevronRight className='w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors ml-2' />
                            </Link>
                        )) : (
                            <div className='p-4 text-center text-gray-400 bg-[#424242] rounded-lg'>
                                No conversations yet. Start a new chat!
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className='p-6 bg-[#282828] rounded-xl shadow-lg'>
                    <div className='flex items-center justify-between'>
                        <h1 className="text-xl font-semibold text-green-400">Chat History</h1>
                    </div>
                    <div className='flex items-center justify-center gap-4'>
                        <p className='text-xl text-gray-400'>You are not assigned to any project.</p>
                    </div>
                    <div className='flex items-center justify-center gap-4'>
                        <Link href='/dashboard'>
                            <Button className='flex items-center gap-2 px-4 py-2 bg-green-400 text-[#282828] rounded-lg hover:bg-green-500 transition-colors mt-4'>
                                Click button new project to create new
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default AskList;