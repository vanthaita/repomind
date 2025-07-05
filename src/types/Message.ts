export interface Message {
  id: string;
  conversationId: string;
  conversation: any; // Avoid circular import
  created_at: Date;
  role: string;
  content: string;
  fileReference: any[]; // Avoid circular import
} 