/**
 * 파일명: financial.ts
 * 
 * 파일 용도:
 * 재무 계산 관련 상수 정의
 * - 백분율, 기간, 임계값 등
 */

/**
 * 재무 계산 상수
 */
export const FINANCIAL_CONSTANTS = {
  /** 1년의 월 수 */
  MONTHS_PER_YEAR: 12,
  
  /** 백분율 변환 배수 */
  PERCENTAGE_MULTIPLIER: 100,
  
  /** 기본 마진율 (30%) */
  DEFAULT_MARGIN_RATE: 0.3,
  
  /** 최소 Gross Margin (20%) */
  MIN_GROSS_MARGIN: 20,
  
  /** 최대 CAC 회수 기간 (개월) */
  MAX_PAYBACK_PERIOD: 12,
  
  /** 이상적인 LTV/CAC 비율 (3 이상) */
  IDEAL_LTV_CAC_RATIO: 3,
  
  /** 최소 LTV/CAC 비율 (2 이상) */
  MIN_LTV_CAC_RATIO: 2,
} as const;

