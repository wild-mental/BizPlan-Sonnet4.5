/**
 * 요금제 데이터 (공통 상수)
 * LandingPage, TeamPage 등에서 공유하여 사용
 */

// Feature 타입 정의
export type PlanFeature = string | { text: string; note: string };

// 요금제 타입 정의
export interface PricingPlan {
  name: string;
  planKey: 'plus' | 'pro' | 'premium' | null;
  price: string;
  originalPrice: number;
  period: string;
  features: PlanFeature[];
  cta: string;
  popular: boolean;
}

// 요금제 데이터 (할인가 정보 포함)
export const pricingPlans: PricingPlan[] = [
  { 
    name: '기본', 
    planKey: null, // 무료 요금제는 할인 미적용
    price: '무료 데모', 
    originalPrice: 0,
    period: '', 
    features: [
      '사업계획서 핵심 질문 리스트 제공', 
      '사업계획서 자동 생성 체험', 
      'AI 심사위원 평가 체험', 
      { text: 'HWP/PDF 다운로드 체험', note: '2026년 양식 통합공고 후 제공' }
    ], 
    cta: '무료 데모 바로가기', 
    popular: false 
  },
  { 
    name: '플러스', 
    planKey: 'plus',
    price: '399,000', 
    originalPrice: 399000,
    period: '2026 상반기 시즌', 
    features: [
      '기본 기능 전체', 
      '6개 영역 점수 리포트', 
      '통합 개선 피드백 제공', 
      { text: 'AI 고도화 토큰 제공', note: '약 3회 재작성 가능' }
    ], 
    cta: '플러스 시작', 
    popular: false 
  },
  { 
    name: '프로', 
    planKey: 'pro',
    price: '799,000', 
    originalPrice: 799000,
    period: '2026 상반기 시즌', 
    features: [
      '플러스 기능 전체', 
      '80점 미달 시 재작성 루프', 
      '파트별 고도화 피드백', 
      { text: '토큰 제한 없는 무제한 수정', note: '제출 마감까지 제공' }
    ], 
    cta: '프로 시작', 
    popular: true 
  },
  { 
    name: '프리미엄', 
    planKey: 'premium',
    price: '1,499,000', 
    originalPrice: 1499000,
    period: '2026 상반기 시즌', 
    features: [
      '프로 기능 전체', 
      { text: '도메인 특화 전문가 매칭', note: '사업 도메인별 선착순 모집' }, 
      { text: '1:1 원격 컨설팅', note: '회당 1시간, 최대 3회 제공' }, 
      '우선 지원'
    ], 
    cta: '프리미엄 시작', 
    popular: false 
  },
];

