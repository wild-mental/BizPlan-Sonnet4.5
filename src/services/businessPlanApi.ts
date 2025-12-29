/**
 * 파일명: businessPlanApi.ts
 * 
 * 파일 용도:
 * 사업계획서 관련 API 서비스
 * - 사업계획서 생성, 조회, 섹션 재생성/수정
 */

import apiClient, { ApiResponse } from './apiClient';
import { DraftSection } from '../types';

export interface BusinessPlanSection {
  id: string;
  title: string;
  order: number;
  content: string;
  wordCount: number;
  lastEditedAt: string;
}

/**
 * 생성된 사업계획서 데이터 (API 응답 형식)
 */
export interface GeneratedBusinessPlanData {
  id: string;
  projectId: string;
  templateId: string;
  version: number;
  status: 'draft' | 'generating' | 'generated' | 'exported';
  sections: BusinessPlanSection[];
  metadata: {
    totalWordCount: number;
    estimatedPages: number;
    generatedAt: string;
    aiModel: string;
  };
  financialSummary: {
    totalBudget: number;
    phase1: number;
    phase2: number;
    year1Revenue: number;
    breakEvenMonth: number;
  };
}

/**
 * BusinessPlanSection 배열을 DraftSection 배열로 변환
 * 
 * @param sections - API 응답 섹션 배열
 * @returns DraftSection 배열
 */
export function convertToDraftSections(sections: BusinessPlanSection[]): DraftSection[] {
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
    content: section.content,
    order: section.order,
  }));
}

export interface BusinessPlan {
  id: string;
  projectId: string;
  templateId: string;
  version: number;
  status: 'draft' | 'generating' | 'generated' | 'exported';
  sections: BusinessPlanSection[];
  metadata: {
    totalWordCount: number;
    estimatedPages: number;
    generatedAt: string;
    aiModel: string;
  };
  financialSummary: {
    totalBudget: number;
    phase1: number;
    phase2: number;
    year1Revenue: number;
    breakEvenMonth: number;
  };
}

export interface GenerateRequest {
  outputFormat: 'markdown' | 'html';
  options: {
    maskPersonalInfo: boolean;
    includeFinancialTables: boolean;
    includeEsgSection: boolean;
    language: string;
  };
  regenerateSections?: string[];
}

/**
 * Wizard 데이터를 API 요청 형식으로 변환
 * 
 * @param wizardData - Wizard 단계별 데이터 (Record<number, Record<string, any>>)
 * @returns GenerateRequest 형식의 요청 데이터
 */
export function buildBusinessPlanRequest(
  wizardData: Record<number, Record<string, any>>
): GenerateRequest {
  return {
    outputFormat: 'markdown',
    options: {
      maskPersonalInfo: true,
      includeFinancialTables: true,
      includeEsgSection: true,
      language: 'ko',
    },
  };
}

/**
 * 사업계획서 생성 API 호출
 * - 생성 요청만 수행하고, 결과는 클라이언트에서 폴링하도록 함
 * - 메인 스레드 블로킹 방지를 위해 동기 폴링 제거
 * 
 * @param projectId - 프로젝트 ID
 * @param requestData - 생성 요청 데이터
 * @returns 생성 요청 응답 (generationId 포함)
 */
export async function generateBusinessPlan(
  projectId: string,
  requestData: GenerateRequest
): Promise<ApiResponse<{ generationId: string; status: string }>> {
  return await businessPlanApi.generate(projectId, requestData);
}

/**
 * 생성된 사업계획서 조회 및 변환
 * - 폴링 완료 후 호출하여 최종 데이터 반환
 * 
 * @param projectId - 프로젝트 ID
 * @returns 생성된 사업계획서 데이터
 */
export async function fetchGeneratedBusinessPlan(
  projectId: string
): Promise<ApiResponse<GeneratedBusinessPlanData>> {
  const response = await businessPlanApi.get(projectId);
  
  if (response.data.success && response.data.data) {
    const plan = response.data.data;
    return {
      success: true,
      data: {
        id: plan.id,
        projectId: plan.projectId,
        templateId: plan.templateId,
        version: plan.version,
        status: plan.status,
        sections: plan.sections,
        metadata: plan.metadata,
        financialSummary: plan.financialSummary,
      },
    };
  }
  
  return response as ApiResponse<GeneratedBusinessPlanData>;
}

export const businessPlanApi = {
  generate: (projectId: string, data: GenerateRequest) =>
    apiClient.post<ApiResponse<{ generationId: string; status: string }>>(`/projects/${projectId}/business-plan/generate`, data),

  get: (projectId: string) =>
    apiClient.get<ApiResponse<BusinessPlan>>(`/projects/${projectId}/business-plan`),

  regenerateSection: (projectId: string, sectionId: string, instruction?: string) =>
    apiClient.post<ApiResponse<BusinessPlanSection>>(`/projects/${projectId}/business-plan/sections/${sectionId}/regenerate`, { instruction }),

  updateSection: (projectId: string, sectionId: string, content: string) =>
    apiClient.put<ApiResponse<BusinessPlanSection>>(`/projects/${projectId}/business-plan/sections/${sectionId}`, { content }),
};
