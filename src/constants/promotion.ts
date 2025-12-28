/**
 * 사전 등록 프로모션 상수 정의
 * Pre-subscription promotion constants
 */

// 프로모션 기간 정의
export const PROMO_START_DATE = '2024-12-29T00:00:00+09:00';
export const PHASE_A_END = '2025-01-04T23:59:59+09:00'; // 30% 할인 마감 (연말연시 특별)
export const PHASE_B_END = '2025-01-11T23:59:59+09:00'; // 10% 할인 마감 (얼리버드 특가)

// 할인율 정의
export const DISCOUNT_RATE_PHASE_A = 30; // 연말연시 특별
export const DISCOUNT_RATE_PHASE_B = 10; // 얼리버드 특가

// 요금제 정가
export const PRICING = {
  plus: {
    name: '플러스',
    original: 399000,
    discount30: 279300,
    discount10: 359100,
    savings30: 119700,
    savings10: 39900,
  },
  pro: {
    name: '프로',
    original: 799000,
    discount30: 559300,
    discount10: 719100,
    savings30: 239700,
    savings10: 79900,
  },
  premium: {
    name: '프리미엄',
    original: 1499000,
    discount30: 1049300,
    discount10: 1349100,
    savings30: 449700,
    savings10: 149900,
  },
} as const;

// 할인 코드 접두사
export const DISCOUNT_CODE_PREFIX = 'MR2026';

// 프로모션 Phase 타입
export type PromotionPhase = 'A' | 'B' | 'ENDED';

// 현재 프로모션 Phase 계산 함수
export const getCurrentPromotionPhase = (): PromotionPhase => {
  const now = new Date();
  const phaseAEnd = new Date(PHASE_A_END);
  const phaseBEnd = new Date(PHASE_B_END);

  if (now <= phaseAEnd) {
    return 'A';
  } else if (now <= phaseBEnd) {
    return 'B';
  } else {
    return 'ENDED';
  }
};

// 현재 할인율 계산 함수
export const getCurrentDiscountRate = (): number => {
  const phase = getCurrentPromotionPhase();
  switch (phase) {
    case 'A':
      return DISCOUNT_RATE_PHASE_A;
    case 'B':
      return DISCOUNT_RATE_PHASE_B;
    default:
      return 0;
  }
};

// 현재 할인가 계산 함수
export const getCurrentDiscountedPrice = (plan: keyof typeof PRICING): number => {
  const phase = getCurrentPromotionPhase();
  const pricing = PRICING[plan];
  
  switch (phase) {
    case 'A':
      return pricing.discount30;
    case 'B':
      return pricing.discount10;
    default:
      return pricing.original;
  }
};

// 현재 절약 금액 계산 함수
export const getCurrentSavings = (plan: keyof typeof PRICING): number => {
  const phase = getCurrentPromotionPhase();
  const pricing = PRICING[plan];
  
  switch (phase) {
    case 'A':
      return pricing.savings30;
    case 'B':
      return pricing.savings10;
    default:
      return 0;
  }
};

// 프로모션 활성 여부
export const isPromotionActive = (): boolean => {
  return getCurrentPromotionPhase() !== 'ENDED';
};

