/**
 * 파일명: evaluationApi.ts
 * 
 * 파일 용도:
 * AI 평가 관련 API 서비스
 * - 평가 생성, 상태 조회, 결과 조회
 */

import apiClient, { ApiResponse } from './apiClient';

export interface EvaluationRequest {
  projectId: string;
  evaluationType: 'demo' | 'basic' | 'full';
  inputData: {
    businessName: string;
    businessField: string;
    targetMarket: string;
    problemStatement: string;
    solutionSummary: string;
    differentiators: string[];
    teamExperience: string;
    fundingGoal: number;
  };
}

export interface EvaluationStatus {
  evaluationId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStage: string;
  stages: Array<{
    id: string;
    name: string;
    status: string;
    score: number | null;
  }>;
  estimatedRemaining?: number;
}

export interface EvaluationResult {
  evaluationId: string;
  summary: {
    totalScore: number;
    grade: string;
    passRate: number;
    passRateMessage: string;
  };
  scores: Record<string, {
    score: number;
    label: string;
    letter: string;
    color: string;
    maxScore: number;
  }>;
  strengths: Array<{
    area: string;
    title: string;
    description: string;
    isBlurred: boolean;
  }>;
  weaknesses: Array<{
    area: string;
    title: string;
    description: string;
    isBlurred: boolean;
  }>;
  recommendations: Array<{
    priority: number;
    area: string;
    title: string;
    description: string;
    isBlurred: boolean;
  }>;
  accessLevel: 'demo' | 'basic' | 'full';
}

export const evaluationApi = {
  create: (data: EvaluationRequest) =>
    apiClient.post<ApiResponse<{ evaluationId: string; status: string }>>('/evaluations', data),

  getStatus: (evaluationId: string) =>
    apiClient.get<ApiResponse<EvaluationStatus>>(`/evaluations/${evaluationId}/status`),

  getResult: (evaluationId: string) =>
    apiClient.get<ApiResponse<EvaluationResult>>(`/evaluations/${evaluationId}/result`),
};

