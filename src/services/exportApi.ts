/**
 * 파일명: exportApi.ts
 * 
 * 파일 용도:
 * 문서 내보내기 관련 API 서비스
 * - 내보내기 생성, 상태 조회, 파일 다운로드
 */

import apiClient, { ApiResponse } from './apiClient';

export interface ExportRequest {
  format: 'hwp' | 'pdf' | 'docx';
  templateType: string;
  options: {
    maskPersonalInfo: boolean;
    includeAppendix: boolean;
    includeCoverPage: boolean;
    pageNumbering: boolean;
    watermark: boolean;
  };
}

export interface ExportStatus {
  exportId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  format: string;
  fileName?: string;
  fileSize?: number;
  downloadUrl?: string;
  expiresAt?: string;
  completedAt?: string;
  errorMessage?: string;
}

export const exportApi = {
  create: (projectId: string, data: ExportRequest) =>
    apiClient.post<ApiResponse<{ exportId: string; status: string }>>(`/projects/${projectId}/export`, data),

  getStatus: (exportId: string) =>
    apiClient.get<ApiResponse<ExportStatus>>(`/exports/${exportId}/status`),

  download: async (exportId: string): Promise<Blob> => {
    const response = await apiClient.get(`/exports/${exportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

