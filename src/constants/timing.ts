/**
 * 파일명: timing.ts
 * 
 * 파일 용도:
 * 타이밍 관련 상수 정의
 * - 딜레이, 타임아웃, 애니메이션 지속 시간 등
 */

/**
 * 타이밍 상수
 * 
 * 단위: 밀리초 (ms)
 */
export const TIMING = {
  /** 자동 저장 디바운스 딜레이 */
  AUTO_SAVE_DEBOUNCE: 1000, // 1초
  
  /** 저장 완료 후 idle 상태로 복귀하는 시간 */
  SAVE_STATUS_IDLE_DELAY: 2000, // 2초
  
  /** 저장 시뮬레이션 딜레이 */
  SAVE_SIMULATION_DELAY: 500, // 0.5초
  
  /** 텍스트 플리핑 애니메이션 간격 */
  TEXT_FLIP_INTERVAL: 3000, // 3초
  
  /** 스크롤 딜레이 */
  SCROLL_DELAY: 100, // 0.1초
  
  /** AI 생성 시뮬레이션 딜레이 */
  AI_GENERATION_DELAY: 2000, // 2초
  
  /** 토스트 알림 지속 시간 */
  TOAST_DURATION: 3000, // 3초
  
  /** 애니메이션 지속 시간 */
  ANIMATION_DURATION: 300, // 0.3초
  
  /** 복사 완료 표시 시간 */
  COPY_FEEDBACK_DURATION: 2000, // 2초
} as const;

