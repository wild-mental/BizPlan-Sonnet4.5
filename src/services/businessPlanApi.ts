/**
 * 파일명: businessPlanApi.ts
 * 
 * 파일 용도:
 * AI 사업계획서 생성 백엔드 API 호출 서비스
 * - POST /api/v1/business-plan/generate 엔드포인트 호출
 * - 요청 데이터 변환 및 응답 처리
 * 
 * 호출 구조:
 * WizardStep → generateBusinessPlan() → Backend API → 응답 데이터 반환
 * 
 * API 문서:
 * - 요청/응답 스키마: docs/AI_GENERATION_BE_API_SUBMIT.md
 */

import { DraftSection } from '../types';

// ============================================
// API 설정
// ============================================

/**
 * 백엔드 API 기본 URL
 * - 개발 환경: Vite 프록시를 통해 /api → localhost:8080/api로 전달
 * - 프록시 설정: vite.config.ts 참조
 * - CORS 우회를 위해 같은 origin에서 호출
 */
const API_BASE_URL = '';

/** API 엔드포인트 */
const ENDPOINTS = {
  GENERATE_BUSINESS_PLAN: '/api/v1/business-plan/generate',
};

// ============================================
// 요청 타입 정의
// ============================================

/** 템플릿 유형 */
type TemplateType = 'pre-startup' | 'early-startup' | 'bank-loan';

/** 요청 메타데이터 */
interface RequestInfo {
  templateType: TemplateType;
  generatedAt: string;
  userId: string;
  projectId: string;
}

/** 1단계: 문제 인식 */
interface Step1ProblemRecognition {
  itemName: string;
  itemSummary: string;
  problem: string;
  problemEvidence: string;
  targetCustomer: string;
}

/** 2단계: 시장 분석 */
interface Step2MarketAnalysis {
  marketSize: string;
  marketTrend: string;
  competitors: string;
  competitiveAdvantage: string;
}

/** 3단계: 실현 방안 */
interface Step3SolutionFeasibility {
  solution: string;
  businessModel: string;
  revenueStreams: string;
  techFeasibility: string;
}

/** 4단계: 사업화 전략 */
interface Step4CommercializationStrategy {
  goToMarket: string;
  marketingStrategy: string;
  growthStrategy: string;
  milestones: string;
  partnership?: string;
}

/** 5단계: 팀 역량 */
interface Step5TeamCapability {
  teamComposition: string;
  teamExpertise: string;
  teamTrackRecord: string;
  hiringPlan?: string;
  advisors?: string;
}

/** 재무 입력값 */
interface FinancialInputs {
  initialCustomers: number;
  pricePerCustomer: number;
  customerAcquisitionCost: number;
  monthlyFixedCosts: number;
  variableCostRate: number;
  monthlyChurnRate: number;
}

/** 계산된 재무 지표 */
interface CalculatedMetrics {
  monthlyRevenue: number;
  yearlyRevenue: number;
  ltv: number;
  ltvCacRatio: number;
  breakEvenCustomers: number;
  breakEvenMonths: number;
  grossMargin: number;
}

/** 6단계: 재무 계획 */
interface Step6FinancialPlan {
  inputs: FinancialInputs;
  calculatedMetrics: CalculatedMetrics;
}

/** 사업계획서 데이터 */
interface BusinessPlanData {
  step1_problemRecognition: Step1ProblemRecognition;
  step2_marketAnalysis: Step2MarketAnalysis;
  step3_solutionFeasibility: Step3SolutionFeasibility;
  step4_commercializationStrategy: Step4CommercializationStrategy;
  step5_teamCapability: Step5TeamCapability;
  step6_financialPlan: Step6FinancialPlan;
}

/** 생성 옵션 */
interface GenerationOptions {
  tone: 'professional' | 'casual' | 'formal';
  targetLength: 'brief' | 'standard' | 'detailed';
  outputFormat: 'markdown' | 'html' | 'plain';
  language: 'ko' | 'en';
  sections: string[];
}

/** AI 사업계획서 생성 요청 */
export interface BusinessPlanGenerationRequest {
  requestInfo: RequestInfo;
  businessPlanData: BusinessPlanData;
  generationOptions: GenerationOptions;
}

// ============================================
// 응답 타입 정의
// ============================================

/** 사업계획서 섹션 */
export interface BusinessPlanSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

/** 생성 메타데이터 */
interface GenerationMetadata {
  totalSections: number;
  wordCount: number;
  characterCount: number;
  generationTimeMs: number;
  modelUsed: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/** 내보내기 옵션 */
interface ExportOptions {
  availableFormats: string[];
  downloadUrls: {
    pdf: string;
    hwp: string;
    docx: string;
    markdown: string;
  };
}

/** 생성된 사업계획서 데이터 */
export interface GeneratedBusinessPlanData {
  businessPlanId: string;
  projectId: string;
  generatedAt: string;
  templateType: TemplateType;
  sections: BusinessPlanSection[];
  metadata: GenerationMetadata;
  exportOptions: ExportOptions;
}

/** API 응답 */
export interface BusinessPlanGenerationResponse {
  success: boolean;
  data: GeneratedBusinessPlanData | null;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  } | null;
}

// ============================================
// Wizard 데이터 → API 요청 변환 함수
// ============================================

/**
 * Wizard Store 데이터를 API 요청 형식으로 변환
 * 
 * @param wizardData - getAllDataWithDefaults()로 가져온 데이터
 * @param financialData - 재무 계획 데이터 (선택)
 * @returns API 요청 객체
 */
export function buildBusinessPlanRequest(
  wizardData: Record<number, Record<string, string>>,
  financialData?: { inputs: FinancialInputs; metrics: CalculatedMetrics }
): BusinessPlanGenerationRequest {
  // 기본 재무 데이터 (사용자 입력이 없을 경우)
  const defaultFinancialInputs: FinancialInputs = {
    initialCustomers: 100,
    pricePerCustomer: 35000,
    customerAcquisitionCost: 50000,
    monthlyFixedCosts: 15000000,
    variableCostRate: 0.1,
    monthlyChurnRate: 0.05,
  };

  const defaultCalculatedMetrics: CalculatedMetrics = {
    monthlyRevenue: 3500000,
    yearlyRevenue: 42000000,
    ltv: 420000,
    ltvCacRatio: 8.4,
    breakEvenCustomers: 500,
    breakEvenMonths: 18,
    grossMargin: 0.9,
  };

  return {
    requestInfo: {
      templateType: 'pre-startup',
      generatedAt: new Date().toISOString(),
      userId: 'demo-user-id', // TODO: 실제 사용자 ID로 교체
      projectId: 'demo-project-id', // TODO: 실제 프로젝트 ID로 교체
    },
    businessPlanData: {
      step1_problemRecognition: {
        itemName: wizardData[1]?.['item-name'] || '',
        itemSummary: wizardData[1]?.['item-summary'] || '',
        problem: wizardData[1]?.['problem'] || '',
        problemEvidence: wizardData[1]?.['problem-evidence'] || '',
        targetCustomer: wizardData[1]?.['target-customer'] || '',
      },
      step2_marketAnalysis: {
        marketSize: wizardData[2]?.['market-size'] || '',
        marketTrend: wizardData[2]?.['market-trend'] || '',
        competitors: wizardData[2]?.['competitors'] || '',
        competitiveAdvantage: wizardData[2]?.['competitive-advantage'] || '',
      },
      step3_solutionFeasibility: {
        solution: wizardData[3]?.['solution'] || '',
        businessModel: wizardData[3]?.['business-model'] || '',
        revenueStreams: wizardData[3]?.['revenue-streams'] || '',
        techFeasibility: wizardData[3]?.['tech-feasibility'] || '',
      },
      step4_commercializationStrategy: {
        goToMarket: wizardData[4]?.['go-to-market'] || '',
        marketingStrategy: wizardData[4]?.['marketing-strategy'] || '',
        growthStrategy: wizardData[4]?.['growth-strategy'] || '',
        milestones: wizardData[4]?.['milestones'] || '',
        partnership: wizardData[4]?.['partnership'] || undefined,
      },
      step5_teamCapability: {
        teamComposition: wizardData[5]?.['team-composition'] || '',
        teamExpertise: wizardData[5]?.['team-expertise'] || '',
        teamTrackRecord: wizardData[5]?.['team-track-record'] || '',
        hiringPlan: wizardData[5]?.['hiring-plan'] || undefined,
        advisors: wizardData[5]?.['advisors'] || undefined,
      },
      step6_financialPlan: {
        inputs: financialData?.inputs || defaultFinancialInputs,
        calculatedMetrics: financialData?.metrics || defaultCalculatedMetrics,
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

// ============================================
// API 호출 함수
// ============================================

/**
 * AI 사업계획서 생성 API 호출
 * 
 * @param request - 사업계획서 생성 요청 데이터
 * @returns 생성된 사업계획서 응답
 * @throws API 호출 실패 시 에러
 * 
 * 지원하는 백엔드 응답 형식:
 * 1. 표준 형식: { success: true, data: {...}, error: null }
 * 2. 직접 데이터 형식: { businessPlanId: "...", sections: [...], ... }
 * 3. data 래핑 형식: { data: { businessPlanId: "...", ... } }
 */
export async function generateBusinessPlan(
  request: BusinessPlanGenerationRequest
): Promise<BusinessPlanGenerationResponse> {
  console.log('=== AI 사업계획서 생성 API 호출 ===');
  console.log('요청 URL:', `${API_BASE_URL}${ENDPOINTS.GENERATE_BUSINESS_PLAN}`);
  console.log('요청 데이터:', JSON.stringify(request, null, 2));

  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GENERATE_BUSINESS_PLAN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: 실제 인증 토큰 추가
        // 'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request),
    });

    // HTTP 에러 처리 (4xx, 5xx)
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 응답 에러:', response.status, errorText);
      
      // 에러 응답 파싱 시도
      let errorResponse: BusinessPlanGenerationResponse;
      try {
        const errorJson = JSON.parse(errorText);
        errorResponse = {
          success: false,
          data: null,
          error: {
            code: errorJson.code || `HTTP_${response.status}`,
            message: errorJson.message || errorJson.error || `서버 오류가 발생했습니다. (${response.status})`,
            details: errorJson.details || { rawError: errorText },
          },
        };
      } catch {
        errorResponse = {
          success: false,
          data: null,
          error: {
            code: `HTTP_${response.status}`,
            message: `서버 오류가 발생했습니다. (${response.status})`,
            details: { rawError: errorText },
          },
        };
      }
      return errorResponse;
    }

    // 성공 응답 파싱 (200, 201 등)
    const rawData = await response.json();
    console.log('=== API 원본 응답 수신 ===');
    console.log('원본 응답:', JSON.stringify(rawData, null, 2));

    // 응답 형식 정규화 (다양한 백엔드 응답 형식 지원)
    const normalizedResponse = normalizeResponse(rawData);
    console.log('=== 정규화된 응답 ===');
    console.log('정규화 결과:', JSON.stringify(normalizedResponse, null, 2));

    return normalizedResponse;
  } catch (error) {
    console.error('API 호출 중 예외 발생:', error);
    
    // 네트워크 에러 등 예외 처리
    return {
      success: false,
      data: null,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error 
          ? `네트워크 오류: ${error.message}` 
          : '알 수 없는 네트워크 오류가 발생했습니다.',
        details: { originalError: String(error) },
      },
    };
  }
}

/**
 * 백엔드 응답을 표준 형식으로 정규화
 * 
 * @param rawData - 백엔드 원본 응답
 * @returns 정규화된 응답
 */
function normalizeResponse(rawData: unknown): BusinessPlanGenerationResponse {
  // rawData가 null이나 undefined인 경우
  if (!rawData) {
    return {
      success: false,
      data: null,
      error: {
        code: 'EMPTY_RESPONSE',
        message: '서버에서 빈 응답을 반환했습니다.',
      },
    };
  }

  const data = rawData as Record<string, unknown>;

  // 형식 1: 표준 형식 { success: true, data: {...} }
  if (typeof data.success === 'boolean') {
    // sections 필드 검증
    const responseData = data.data as Record<string, unknown> | null;
    if (data.success && responseData) {
      // sections가 없으면 빈 배열로 초기화
      if (!responseData.sections) {
        responseData.sections = [];
        console.warn('응답에 sections 필드가 없어 빈 배열로 초기화했습니다.');
      }
    }
    return {
      success: data.success,
      data: responseData as GeneratedBusinessPlanData | null,
      error: data.error as BusinessPlanGenerationResponse['error'] || null,
    };
  }

  // 형식 2: data 래핑 형식 { data: {...} } (success 필드 없음)
  if (data.data && typeof data.data === 'object') {
    const innerData = data.data as Record<string, unknown>;
    // innerData에 sections가 있거나 businessPlanId가 있으면 성공으로 간주
    if (innerData.sections || innerData.businessPlanId) {
      // sections가 없으면 빈 배열로 초기화
      if (!innerData.sections) {
        innerData.sections = [];
        console.warn('응답에 sections 필드가 없어 빈 배열로 초기화했습니다.');
      }
      return {
        success: true,
        data: innerData as unknown as GeneratedBusinessPlanData,
        error: null,
      };
    }
  }

  // 형식 3: 직접 데이터 형식 { businessPlanId: "...", sections: [...] }
  if (data.sections || data.businessPlanId) {
    // sections가 없으면 빈 배열로 초기화
    if (!data.sections) {
      data.sections = [];
      console.warn('응답에 sections 필드가 없어 빈 배열로 초기화했습니다.');
    }
    return {
      success: true,
      data: data as unknown as GeneratedBusinessPlanData,
      error: null,
    };
  }

  // 형식 4: 에러 응답 { error: "...", message: "..." }
  if (data.error || data.message) {
    return {
      success: false,
      data: null,
      error: {
        code: (data.code as string) || 'UNKNOWN_ERROR',
        message: (data.message as string) || (data.error as string) || '알 수 없는 오류가 발생했습니다.',
        details: data.details as Record<string, unknown> || undefined,
      },
    };
  }

  // 알 수 없는 형식: 원본 데이터 로깅 후 실패 반환
  console.warn('알 수 없는 응답 형식 - 원본 데이터:', JSON.stringify(data, null, 2));
  console.warn('응답에 sections, businessPlanId, success, error, message 필드가 없습니다.');
  return {
    success: false,
    data: null,
    error: {
      code: 'UNKNOWN_FORMAT',
      message: '서버 응답 형식을 인식할 수 없습니다. 백엔드 응답에 sections 또는 businessPlanId 필드가 필요합니다.',
      details: { rawResponse: data },
    },
  };
}

/**
 * 사업계획서 섹션을 DraftSection 형식으로 변환
 * (기존 mockBusinessPlan과 호환)
 * 
 * @param sections - API 응답의 섹션 배열
 * @returns DraftSection 배열 (입력이 없으면 빈 배열)
 */
export function convertToDraftSections(sections: BusinessPlanSection[] | undefined | null): DraftSection[] {
  // sections가 undefined/null이거나 배열이 아닌 경우 빈 배열 반환
  if (!sections || !Array.isArray(sections)) {
    console.warn('convertToDraftSections: sections가 유효하지 않음:', sections);
    return [];
  }
  
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
    content: section.content,
    order: section.order,
  }));
}
