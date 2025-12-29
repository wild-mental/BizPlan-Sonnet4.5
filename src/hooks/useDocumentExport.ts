/**
 * 파일명: useDocumentExport.ts
 * 
 * 파일 용도:
 * 문서 내보내기 기능을 제공하는 Custom Hook
 * - 내보내기 생성 및 상태 모니터링
 * - 파일 다운로드 처리
 */

import { useState, useCallback } from 'react';
import { exportApi, ExportRequest, ExportStatus } from '../services/exportApi';
import { usePolling } from './usePolling';

interface UseDocumentExportOptions {
  onComplete?: (status: ExportStatus) => void;
  onError?: (error: Error) => void;
}

export function useDocumentExport({ onComplete, onError }: UseDocumentExportOptions = {}) {
  const [exportId, setExportId] = useState<string | null>(null);
  const [status, setStatus] = useState<ExportStatus | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 상태 폴링
  const { isPolling } = usePolling<ExportStatus>({
    fetcher: async () => {
      if (!exportId) throw new Error('No export ID');
      const response = await exportApi.getStatus(exportId);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Status fetch failed');
    },
    interval: 2000,
    enabled: isExporting && !!exportId,
    stopCondition: (data) => data.status === 'completed' || data.status === 'failed',
    onSuccess: (data) => {
      setStatus(data);
      if (data.status === 'completed') {
        setIsExporting(false);
        onComplete?.(data);
      } else if (data.status === 'failed') {
        setIsExporting(false);
        setError(new Error(data.errorMessage || 'Export failed'));
        onError?.(new Error(data.errorMessage || 'Export failed'));
      }
    },
    onError: (err) => {
      setError(err);
      onError?.(err);
    },
  });

  const startExport = useCallback(async (projectId: string, options: ExportRequest) => {
    setIsExporting(true);
    setError(null);
    setStatus(null);

    try {
      const response = await exportApi.create(projectId, options);
      if (response.data.success && response.data.data) {
        setExportId(response.data.data.exportId);
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      setIsExporting(false);
      onError?.(error);
    }
  }, [onError]);

  const downloadFile = useCallback(async () => {
    if (!status?.downloadUrl || !exportId) return;

    try {
      const blob = await exportApi.download(exportId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = status.fileName || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err as Error);
    }
  }, [exportId, status]);

  return {
    startExport,
    downloadFile,
    status,
    isExporting: isExporting || isPolling,
    error,
  };
}

