/**
 * 파일명: businessPlanApi.ts
 * 
 * 파일 용도:
 * 사업계획서 관련 API 서비스
 * - 사업계획서 생성, 조회, 섹션 재생성/수정
 * 
 * 백엔드 API 스펙:
 * - POST /api/v1/business-plan/generate
 * - GET /api/v1/business-plan/{businessPlanId}
 */

import apiClient, { ApiResponse } from './apiClient';
import { DraftSection } from '../types';

export interface BusinessPlanSection {
  id: string;
  title: string;
  order: number;
  content: string;
}

/**
 * 백엔드 API 응답 형식 (BusinessPlanGenerateResponse)
 */
export interface BusinessPlanGenerateResponse {
  businessPlanId: string;
  projectId: string;
  generatedAt: string;
  templateType: string;
  sections: BusinessPlanSection[];
  metadata: {
    totalSections: number;
    wordCount: number;
    characterCount: number;
    generationTimeMs: number;
    modelUsed: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  exportOptions: {
    availableFormats: string[];
    downloadUrls: Record<string, string>;
  };
}

/**
 * 백엔드 API 요청 형식 (BusinessPlanGenerateRequest)
 */
export interface BusinessPlanGenerateRequest {
  requestInfo: {
    templateType: 'pre-startup' | 'early-startup' | 'bank-loan';
    generatedAt: string;
    userId: string;
    projectId: string;
  };
  businessPlanData: {
    step1_problemRecognition: {
      itemName: string;
      itemSummary: string;
      problem: string;
      problemEvidence: string;
      targetCustomer: string;
    };
    step2_marketAnalysis: {
      marketSize: string;
      marketTrend: string;
      competitors: string;
      competitiveAdvantage: string;
    };
    step3_solutionFeasibility: {
      solution: string;
      businessModel: string;
      revenueStreams: string;
      techFeasibility: string;
    };
    step4_commercializationStrategy: {
      goToMarket: string;
      marketingStrategy: string;
      growthStrategy: string;
      milestones: string;
      partnership?: string;
    };
    step5_teamCapability: {
      teamComposition: string;
      teamExpertise: string;
      teamTrackRecord: string;
      hiringPlan?: string;
      advisors?: string;
    };
    step6_financialPlan: {
      inputs: {
        initialCustomers: number;
        pricePerCustomer: number;
        customerAcquisitionCost: number;
        monthlyFixedCosts: number;
        variableCostRate: number;
        monthlyChurnRate: number;
      };
      calculatedMetrics: {
        monthlyRevenue: number;
        yearlyRevenue: number;
        ltv: number;
        ltvCacRatio: number;
        breakEvenCustomers: number;
        breakEvenMonths: number;
        grossMargin: number;
      };
    };
  };
  generationOptions: {
    tone: 'professional' | 'casual' | 'formal';
    targetLength: 'brief' | 'standard' | 'detailed';
    outputFormat: 'markdown' | 'html' | 'plain';
    language: 'ko' | 'en';
    sections: string[];
  };
}

/**
 * 생성된 사업계획서 데이터 (프론트엔드 내부 사용)
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
    totalSections?: number;
    wordCount?: number;
  };
  exportOptions?: {
    availableFormats?: string[];
    downloadUrls?: Record<string, string>;
  };
  financialSummary?: {
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

/**
 * Wizard 데이터를 백엔드 API 요청 형식으로 변환
 * 
 * @param wizardData - Wizard 단계별 데이터 (Record<number, Record<string, any>>)
 * @param projectId - 프로젝트 ID
 * @param userId - 사용자 ID
 * @param templateType - 템플릿 유형
 * @returns BusinessPlanGenerateRequest 형식의 요청 데이터
 */
export function buildBusinessPlanRequest(
  wizardData: Record<number, Record<string, any>>,
  projectId: string,
  userId: string,
  templateType: 'pre-startup' | 'early-startup' | 'bank-loan' = 'pre-startup'
): BusinessPlanGenerateRequest {
  const step1 = wizardData[1] || {};
  const step2 = wizardData[2] || {};
  const step3 = wizardData[3] || {};
  const step4 = wizardData[4] || {};
  const step5 = wizardData[5] || {};
  const step6 = wizardData[6] || {};

  return {
    requestInfo: {
      templateType,
      generatedAt: new Date().toISOString(),
      userId,
      projectId,
    },
    businessPlanData: {
      step1_problemRecognition: {
        itemName: step1['item-name'] || '',
        itemSummary: step1['item-summary'] || '',
        problem: step1['problem'] || '',
        problemEvidence: step1['problem-evidence'] || '',
        targetCustomer: step1['target-customer'] || '',
      },
      step2_marketAnalysis: {
        marketSize: step2['market-size'] || '',
        marketTrend: step2['market-trend'] || '',
        competitors: step2['competitors'] || '',
        competitiveAdvantage: step2['competitive-advantage'] || '',
      },
      step3_solutionFeasibility: {
        solution: step3['solution'] || '',
        businessModel: step3['business-model'] || '',
        revenueStreams: step3['revenue-streams'] || '',
        techFeasibility: step3['tech-feasibility'] || '',
      },
      step4_commercializationStrategy: {
        goToMarket: step4['go-to-market'] || '',
        marketingStrategy: step4['marketing-strategy'] || '',
        growthStrategy: step4['growth-strategy'] || '',
        milestones: step4['milestones'] || '',
        partnership: step4['partnership'],
      },
      step5_teamCapability: {
        teamComposition: step5['team-composition'] || '',
        teamExpertise: step5['team-expertise'] || '',
        teamTrackRecord: step5['team-track-record'] || '',
        hiringPlan: step5['hiring-plan'],
        advisors: step5['advisors'],
      },
      step6_financialPlan: {
        inputs: {
          initialCustomers: step6.inputs?.initialCustomers || 100,
          pricePerCustomer: step6.inputs?.pricePerCustomer || 35000,
          customerAcquisitionCost: step6.inputs?.customerAcquisitionCost || 50000,
          monthlyFixedCosts: step6.inputs?.monthlyFixedCosts || 15000000,
          variableCostRate: step6.inputs?.variableCostRate || 0.1,
          monthlyChurnRate: step6.inputs?.monthlyChurnRate || 0.05,
        },
        calculatedMetrics: {
          monthlyRevenue: step6.calculatedMetrics?.monthlyRevenue || 3500000,
          yearlyRevenue: step6.calculatedMetrics?.yearlyRevenue || 42000000,
          ltv: step6.calculatedMetrics?.ltv || 420000,
          ltvCacRatio: step6.calculatedMetrics?.ltvCacRatio || 8.4,
          breakEvenCustomers: step6.calculatedMetrics?.breakEvenCustomers || 500,
          breakEvenMonths: step6.calculatedMetrics?.breakEvenMonths || 18,
          grossMargin: step6.calculatedMetrics?.grossMargin || 0.9,
        },
      },
    },
    generationOptions: {
      tone: 'professional',
      targetLength: 'detailed',
      outputFormat: 'markdown',
      language: 'ko',
      sections: [
        'executive_summary',
        'problem_analysis',
        'market_analysis',
        'solution_overview',
        'business_model',
        'go_to_market',
        'team_introduction',
        'financial_projection',
        'risk_analysis',
        'conclusion',
      ],
    },
  };
}

/**
 * 사업계획서 생성 API 호출
 * 
 * @param requestData - 생성 요청 데이터
 * @returns 생성된 사업계획서 응답
 */
export async function generateBusinessPlan(
  requestData: BusinessPlanGenerateRequest
): Promise<ApiResponse<BusinessPlanGenerateResponse>> {
  const response = await businessPlanApi.generate(requestData);
  return response.data;
}

/**
 * 생성된 사업계획서 조회 및 변환
 * 
 * @param businessPlanId - 사업계획서 ID
 * @returns 생성된 사업계획서 데이터
 */
export async function fetchGeneratedBusinessPlan(
  businessPlanId: string
): Promise<ApiResponse<GeneratedBusinessPlanData>> {
  const response = await businessPlanApi.get(businessPlanId);
  
  if (response.data.success && response.data.data) {
    const plan = response.data.data;
    return {
      success: true,
      data: {
        id: plan.businessPlanId,
        projectId: plan.projectId,
        templateId: plan.templateType,
        version: 1,
        status: 'generated',
        sections: plan.sections,
        metadata: {
          totalWordCount: plan.metadata.wordCount,
          estimatedPages: Math.ceil(plan.metadata.wordCount / 300),
          generatedAt: plan.generatedAt,
          aiModel: plan.metadata.modelUsed,
          totalSections: plan.metadata.totalSections,
          wordCount: plan.metadata.wordCount,
        },
        exportOptions: plan.exportOptions,
      },
    };
  }
  
  return {
    success: false,
    error: { code: 'FETCH_FAILED', message: '사업계획서를 불러오는데 실패했습니다' },
  };
}

export const businessPlanApi = {
  /**
   * 사업계획서 생성
   * POST /api/v1/business-plan/generate
   */
  generate: (data: BusinessPlanGenerateRequest) =>
    apiClient.post<ApiResponse<BusinessPlanGenerateResponse>>('/api/v1/business-plan/generate', data),

  /**
   * 사업계획서 조회
   * GET /api/v1/business-plan/{businessPlanId}
   */
  get: (businessPlanId: string) =>
    apiClient.get<ApiResponse<BusinessPlanGenerateResponse>>(`/api/v1/business-plan/${businessPlanId}`),

  /**
   * 섹션 재생성 (향후 구현)
   */
  regenerateSection: (projectId: string, sectionId: string, instruction?: string) =>
    apiClient.post<ApiResponse<BusinessPlanSection>>(`/api/v1/projects/${projectId}/business-plan/sections/${sectionId}/regenerate`, { instruction }),

  /**
   * 섹션 수정 (향후 구현)
   */
  updateSection: (projectId: string, sectionId: string, content: string) =>
    apiClient.put<ApiResponse<BusinessPlanSection>>(`/api/v1/projects/${projectId}/business-plan/sections/${sectionId}`, { content }),
};
