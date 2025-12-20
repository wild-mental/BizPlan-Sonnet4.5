/**
 * 파일명: index.ts
 * 
 * 파일 용도:
 * 애플리케이션 전체에서 사용하는 TypeScript 타입 정의
 * - 프로젝트, 마법사, 재무, PMF 등 모든 도메인의 타입 정의
 * - 타입 안정성 보장
 * - IDE 자동완성 지원
 * 
 * 타입 분류:
 * 1. Template Types: 사업 템플릿 관련
 * 2. Project Types: 프로젝트 정보 관련
 * 3. Wizard Step Types: 마법사 단계 및 질문 관련
 * 4. Financial Types: 재무 시뮬레이션 관련
 * 5. PMF Survey Types: PMF 진단 관련
 * 6. AI Draft Types: 사업계획서 생성 관련
 * 7. Save Status Types: 저장 상태 관련
 * 
 * 사용처:
 * - 모든 컴포넌트, Store, Hook에서 import하여 사용
 * - 타입 체크를 통한 런타임 에러 방지
 */

// ============================================
// Template Types - 사업 템플릿 관련
// ============================================

/** 사업 템플릿 타입 */
export type TemplateType = 'pre-startup' | 'early-startup' | 'bank-loan';

/** 사업 템플릿 */
export interface Template {
  /** 템플릿 ID */
  id: TemplateType;
  /** 템플릿 이름 */
  name: string;
  /** 템플릿 설명 */
  description: string;
  /** 아이콘 (이모지) */
  icon: string;
  /** 주요 기능 목록 */
  features: string[];
}

// ============================================
// Project Types - 프로젝트 정보 관련
// ============================================
/** 프로젝트 */
export interface Project {
  /** 프로젝트 ID */
  id: string;
  /** 프로젝트 이름 */
  name: string;
  /** 사용한 템플릿 ID */
  templateId: TemplateType;
  /** 생성 시간 (ISO 문자열) */
  createdAt: string;
  /** 마지막 수정 시간 (ISO 문자열) */
  updatedAt: string;
  /** 현재 진행 중인 단계 */
  currentStep: number;
  /** 완료 여부 */
  isCompleted: boolean;
}

// ============================================
// Wizard Step Types - 마법사 단계 및 질문 관련
// ============================================

/** 단계 상태 */
export type StepStatus = 'pending' | 'in-progress' | 'completed';

/** 마법사 단계 */
export interface WizardStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: StepStatus;
  /** 단계에 포함된 질문 목록 */
  questions: Question[];
}

/** 질문 */
export interface Question {
  id: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox';
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

/** 답변 */
export interface Answer {
  questionId: string;
  value: string | number | boolean | string[];
}

/** 마법사 전체 데이터 (단계ID → 질문ID → 답변) */
export interface WizardData {
  [stepId: number]: {
    [questionId: string]: any;
  };
}

// ============================================
// Financial Types - 재무 시뮬레이션 관련
// ============================================

/** 재무 입력 값 */
export interface FinancialInput {
  customers: number;
  pricePerCustomer: number;
  cac: number;
  fixedCosts: number;
  variableCostRate: number;
  churnRate: number;
  /** LTV (선택적, 계산에 사용되지 않음) */
  ltv?: number;
}

/** 계산된 재무 지표 */
export interface FinancialMetrics {
  revenue: number;
  totalCosts: number;
  profit: number;
  ltv: number;
  ltvCacRatio: number;
  /** 손익분기점 (고객 수) */
  breakEvenPoint: number;
}

/** 차트 데이터 포인트 */
export interface ChartDataPoint {
  month: number;
  revenue: number;
  costs: number;
  profit: number;
}

// ============================================
// PMF Survey Types - PMF 진단 관련
// ============================================

/** PMF 질문 */
export interface PMFQuestion {
  id: string;
  question: string;
  options: {
    value: number;
    label: string;
  }[];
}

/** PMF 답변 */
export interface PMFAnswer {
  questionId: string;
  value: number;
}

/** PMF 진단 리포트 */
export interface PMFReport {
  score: number;
  level: 'low' | 'medium' | 'high' | 'excellent';
  risks: Risk[];
  recommendations: Recommendation[];
}

/** 비즈니스 리스크 */
export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

/** 개선 제언 */
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

// ============================================
// AI Draft Types - 사업계획서 생성 관련
// ============================================

/** 사업계획서 섹션 */
export interface DraftSection {
  id: string;
  title: string;
  content: string;
  /** 섹션 순서 */
  order: number;
}

/** 사업계획서 전체 */
export interface BusinessPlan {
  id: string;
  projectId: string;
  sections: DraftSection[];
  /** 생성 시간 (ISO 문자열) */
  generatedAt: string;
}

// ============================================
// Save Status Types - 저장 상태 관련
// ============================================

/** 저장 상태 */
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// ============================================
// Pricing Plan Types - 요금제 관련
// ============================================

/** 요금제 타입 */
export type PricingPlanType = '기본' | '플러스' | '프로' | '프리미엄';

/** 요금제 정보 */
export interface PricingPlan {
  /** 요금제 이름 */
  name: PricingPlanType;
  /** 가격 (문자열 - 무료 또는 숫자) */
  price: string;
  /** 결제 주기 (월 등) */
  period: string;
  /** 포함된 기능 목록 */
  features: string[];
  /** CTA 버튼 텍스트 */
  cta: string;
  /** 인기 요금제 여부 */
  popular: boolean;
}

// ============================================
// Auth Types - 인증 관련
// ============================================

/** 사용자 정보 */
export interface User {
  /** 사용자 ID */
  id: string;
  /** 이메일 */
  email: string;
  /** 이름 */
  name: string;
  /** 가입한 요금제 */
  plan: PricingPlanType;
  /** 소셜 로그인 제공자 */
  socialProvider?: 'google' | 'kakao' | 'naver';
  /** 마케팅 수신 동의 여부 */
  marketingConsent: boolean;
  /** 가입 시간 (ISO 문자열) */
  createdAt: string;
}
