/**
 * 파일명: projectApi.ts
 * 
 * 파일 용도:
 * 프로젝트 관리 관련 API 서비스
 * - 프로젝트 생성, 조회, 수정, 삭제
 * - 프로젝트 목록 조회
 */

import apiClient, { ApiResponse } from './apiClient';

export interface Project {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  supportProgram?: string;
  description?: string;
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  progress: {
    currentStep: number;
    totalSteps: number;
    completedSteps: number[];
    percentComplete: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  templateId: string;
  supportProgram?: string;
  description?: string;
}

export const projectApi = {
  create: (data: CreateProjectRequest) =>
    apiClient.post<ApiResponse<Project>>('/api/v1/projects', data),

  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get<ApiResponse<Project[]>>('/api/v1/projects', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Project>>(`/api/v1/projects/${id}`),

  update: (id: string, data: Partial<CreateProjectRequest>) =>
    apiClient.put<ApiResponse<Project>>(`/api/v1/projects/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/v1/projects/${id}`),
};

