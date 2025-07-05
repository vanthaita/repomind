import { useState, useCallback } from 'react';
import { LoadingState } from '@/types';

interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

export function useAsync<T>(
  asyncFn: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading('loading');
        setError(null);
        
        const result = await asyncFn(...args);
        setData(result);
        setLoading('success');
        
        if (options.onSuccess) {
          options.onSuccess(result);
        }
        
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        setLoading('error');
        
        if (options.onError) {
          options.onError(error);
        }
        
        throw error;
      } finally {
        if (options.onFinally) {
          options.onFinally();
        }
      }
    },
    [asyncFn, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading('idle');
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    isIdle: loading === 'idle',
    isLoading: loading === 'loading',
    isSuccess: loading === 'success',
    isError: loading === 'error',
  };
} 