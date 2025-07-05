export interface MessageFileReference {
  id: string;
  messageId: string;
  message: any; // Avoid circular import
  fileName: string;
  sourceCode?: string;
} 