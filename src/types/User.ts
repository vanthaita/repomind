export interface User {
  id: string;
  created_at: Date;
  updated_at: Date;
  name?: string;
  image?: string;
  email?: string;
  emailVerified?: Date;
  firstName?: string;
  lastName?: string;
} 