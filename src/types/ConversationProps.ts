import { Conversation } from './Conversation';

export interface ConversationProps {
  conversation: Conversation;
  onSelect?: (conversationId: string) => void;
} 