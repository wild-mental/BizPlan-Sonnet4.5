/**
 * 파일명: wizardApi.ts
 * 
 * 파일 용도:
 * Wizard 데이터 관련 API 서비스
 * - Wizard 데이터 조회 및 저장
 * - 예산 검증
 */

import apiClient, { ApiResponse } from './apiClient';

export interface WizardStep {
  stepId: number;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  data: Record<string, any> | null;
}

export interface WizardData {
  projectId: string;
  templateId: string;
  currentStep: number;
  steps: WizardStep[];
  lastSavedAt: string;
}

export interface SaveWizardRequest {
  currentStep: number;
  stepData: Record<string, any>;
  isStepComplete?: boolean;
}

export interface BudgetValidationResult {
  isValid: boolean;
  summary: {
    totalBudget: number;
    phase1Total: number;
    phase2Total: number;
  };
  validations: Array<{
    rule: string;
    passed: boolean;
    message: string;
  }>;
  warnings: Array<{
    type: string;
    field: string;
    message: string;
    suggestion?: string;
  }>;
}

export const wizardApi = {
  /**
   * Wizard 전체 데이터 조회
   * GET /api/v1/projects/{projectId}/wizard
   */
  get: (projectId: string) =>
    apiClient.get<ApiResponse<WizardData>>(`/api/v1/projects/${projectId}/wizard`),

  /**
   * Wizard 데이터 저장
   * PUT /api/v1/projects/{projectId}/wizard
   */
  save: (projectId: string, data: SaveWizardRequest) =>
    apiClient.put<ApiResponse<{ lastSavedAt: string; progress: any }>>(`/api/v1/projects/${projectId}/wizard`, data),

  /**
   * 자금 집행계획 검증
   * POST /api/v1/projects/{projectId}/budget/validate
   */
  validateBudget: (projectId: string, budgetData: any) =>
    apiClient.post<ApiResponse<BudgetValidationResult>>(`/api/v1/projects/${projectId}/budget/validate`, budgetData),
};

