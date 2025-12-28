/**
 * 파일명: wizard.ts
 * 
 * 파일 용도:
 * 마법사 단계 관련 상수 정의
 * - 단계 번호, 총 단계 수 등
 */

/**
 * 마법사 단계 번호
 */
export const WIZARD_STEPS = {
  /** 일반현황 및 개요 */
  OVERVIEW: 1,
  
  /** 문제인식 (Problem) */
  PROBLEM: 2,
  
  /** 실현가능성 (Solution) */
  SOLUTION: 3,
  
  /** 성장전략 (Scale-up) */
  SCALE_UP: 4,
  
  /** 팀 구성 (Team) */
  TEAM: 5,
  
  /** 재무 계획 */
  FINANCIAL: 6,
} as const;

/**
 * 총 마법사 단계 수
 */
export const TOTAL_WIZARD_STEPS = 6;

/**
 * 첫 번째 단계 번호
 */
export const FIRST_STEP = 1;

