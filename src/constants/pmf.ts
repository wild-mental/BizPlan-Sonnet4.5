/**
 * 파일명: pmf.ts
 * 
 * 파일 용도:
 * PMF (Product-Market Fit) 설문 관련 상수 정의
 * - 질문 수, 점수 범위, 임계값 등
 */

/**
 * PMF 설문 상수
 */
export const PMF_SURVEY = {
  /** 총 질문 수 */
  QUESTION_COUNT: 10,
  
  /** 최소 점수 */
  SCORE_MIN: 1,
  
  /** 최대 점수 */
  SCORE_MAX: 4,
  
  /** 최대 가능 점수 (100점 만점) */
  MAX_POSSIBLE_SCORE: 100,
  
  /** 우수 등급 임계값 (85점 이상) */
  THRESHOLD_EXCELLENT: 85,
  
  /** 높은 등급 임계값 (70점 이상) */
  THRESHOLD_HIGH: 70,
  
  /** 보통 등급 임계값 (50점 이상) */
  THRESHOLD_MEDIUM: 50,
  
  /** 낮은 등급 임계값 (50점 미만) */
  THRESHOLD_LOW: 50,
} as const;

