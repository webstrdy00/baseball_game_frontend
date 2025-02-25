import { useState, useCallback } from 'react';
import { ApiError } from '../types/api';

type ApiCallFunction<T, P extends unknown[]> = (...args: P) => Promise<T>;

interface UseApiCallReturn<T, P extends unknown[]> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (...args: P) => Promise<T | null>;
  reset: () => void;
}

export function useApiCall<T, P extends unknown[]>(
  apiFunction: ApiCallFunction<T, P>,
  initialData: T | null = null
): UseApiCallReturn<T, P> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (e) {
        const err = e as ApiError;
        setError({
          detail: err.detail || '알 수 없는 오류가 발생했습니다.',
          status_code: err.status_code
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  return { data, loading, error, execute, reset };
}