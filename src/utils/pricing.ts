/**
 * 요금제 할인 관련 유틸리티 함수
 * Pricing and discount utility functions
 */

import {
  PRICING,
  getCurrentPromotionPhase,
  getCurrentDiscountRate,
  type PromotionPhase,
} from '../constants/promotion';

export type PlanType = 'plus' | 'pro' | 'premium';

/**
 * 가격을 한국 원화 형식으로 포맷팅
 * @param price - 숫자 가격
 * @returns 포맷팅된 문자열 (예: "399,000")
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString('ko-KR');
};

/**
 * 가격을 원화 표시와 함께 포맷팅
 * @param price - 숫자 가격
 * @returns 포맷팅된 문자열 (예: "₩399,000")
 */
export const formatPriceWithSymbol = (price: number): string => {
  return `₩${formatPrice(price)}`;
};

/**
 * 할인율 계산
 * @param originalPrice - 정가
 * @param discountedPrice - 할인가
 * @returns 할인율 (정수, 예: 30)
 */
export const calculateDiscountRate = (originalPrice: number, discountedPrice: number): number => {
  return Math.round((1 - discountedPrice / originalPrice) * 100);
};

/**
 * 현재 프로모션 Phase에 따른 요금제 정보 반환
 * @param plan - 요금제 타입 (plus, pro, premium)
 * @returns 요금제 정보
 */
export const getPlanPricing = (plan: PlanType) => {
  const pricing = PRICING[plan];
  const phase = getCurrentPromotionPhase();
  const discountRate = getCurrentDiscountRate();

  let currentPrice: number;
  let savings: number;

  switch (phase) {
    case 'A':
      currentPrice = pricing.discount30;
      savings = pricing.savings30;
      break;
    case 'B':
      currentPrice = pricing.discount10;
      savings = pricing.savings10;
      break;
    default:
      currentPrice = pricing.original;
      savings = 0;
  }

  return {
    name: pricing.name,
    originalPrice: pricing.original,
    currentPrice,
    savings,
    discountRate,
    phase,
    isDiscounted: phase !== 'ENDED',
    // Phase A에서 Phase B 대비 추가 절약 금액
    extraSavingsVsPhaseB: phase === 'A' ? pricing.savings30 - pricing.savings10 : 0,
  };
};

/**
 * 모든 요금제의 현재 할인 정보 반환
 */
export const getAllPlansPricing = () => {
  return {
    plus: getPlanPricing('plus'),
    pro: getPlanPricing('pro'),
    premium: getPlanPricing('premium'),
  };
};

/**
 * 프로모션 상태 정보 반환
 */
export const getPromotionStatus = () => {
  const phase = getCurrentPromotionPhase();
  const discountRate = getCurrentDiscountRate();

  return {
    phase,
    discountRate,
    isActive: phase !== 'ENDED',
    isPhaseA: phase === 'A',
    isPhaseB: phase === 'B',
    phaseLabel: phase === 'A' ? '연말연시 특별' : phase === 'B' ? '공고 전 얼리버드' : '프로모션 종료',
    badgeLabel: phase === 'A' ? '🔥 30% OFF' : phase === 'B' ? '✨ 10% OFF' : '',
  };
};

