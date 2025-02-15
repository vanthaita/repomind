import { api } from '@/trpc/react'
import React from 'react'
import {useLocalStorage} from 'usehooks-ts';
import UseProject from './use-project';
const UseConversation = () => {
    const { projectId } = UseProject();
    const { data: conversations } = api.project.getConversations.useQuery({ projectId });
    const [conversationId, setConversationId] = useLocalStorage('conversationId', ' ');
    const conversation = conversations?.find(conversation => conversation.id === conversationId);
    return {
        conversations,
        conversation,
        conversationId,
    };
}

export default UseConversation