/**
 * 파일명: usePolling.ts
 * 
 * 파일 용도:
 * 주기적으로 API를 호출하는 Custom Hook
 * - 평가 상태, 내보내기 상태 등 비동기 작업 모니터링
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface UsePollingOptions<T> {
  fetcher: () => Promise<T>;
  interval: number;
  enabled?: boolean;
  stopCondition?: (data: T) => boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function usePolling<T>({
  fetcher,
  interval,
  enabled = true,
  stopCondition,
  onSuccess,
  onError,
}: UsePollingOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const poll = useCallback(async () => {
    try {
      const result = await fetcher();
      setData(result);
      setError(null);
      onSuccess?.(result);

      if (stopCondition?.(result)) {
        setIsPolling(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
    }
  }, [fetcher, stopCondition, onSuccess, onError]);

  useEffect(() => {
    if (!enabled) {
      setIsPolling(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setIsPolling(true);
    poll(); // 초기 실행

    intervalRef.current = setInterval(poll, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, poll]);

  const stop = useCallback(() => {
    setIsPolling(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return { data, isPolling, error, stop };
}

