import { api } from '@/trpc/react'
import React from 'react'
import {useLocalStorage} from 'usehooks-ts';
import UseProject from './use-project';
const UseConversation = () => {
    const { projectId } = UseProject();
    const { data: conversationsResponse } = api.conversation.getConversations.useQuery({ 
      projectId,
      page: 1,
      limit: 20,
    });
    const [conversationId, setConversationId] = useLocalStorage('conversationId', ' ');
    const conversations = conversationsResponse?.data || [];
    const conversation = conversations.find((conversation: any) => conversation.id === conversationId);
    return {
        conversations,
        conversation,
        conversationId,
    };
}

export default UseConversation