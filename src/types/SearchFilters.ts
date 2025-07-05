export interface SearchFilters {
  query?: string;
  projectId?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  type?: 'commits' | 'pull-requests' | 'conversations';
} 