export interface Conversation {
  id: string;
  projectId: string;
  project: any; // Avoid circular import
  title?: string;
  createdAt: Date;
  messages: any[]; // Avoid circular import
} 