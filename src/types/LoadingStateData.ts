import { LoadingState } from './LoadingState';

export interface LoadingStateData<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
} 