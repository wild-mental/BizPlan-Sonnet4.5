/**
 * Google Analytics 4 유틸리티
 * 
 * 파일 용도:
 * - GA4 초기화 및 이벤트 추적 유틸리티
 * - 페이지뷰 및 커스텀 이벤트 추적
 * - 사용자 속성 설정
 * 
 * 사용 방법:
 * 1. main.tsx에서 initializeGA() 호출
 * 2. 각 페이지/컴포넌트에서 trackEvent() 호출
 */

import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const DEBUG_MODE = import.meta.env.VITE_GA_DEBUG_MODE === 'true';

/**
 * GA4 초기화
 * 앱 시작 시 한 번만 호출
 */
export const initializeGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('[GA4] Measurement ID not configured. Analytics disabled.');
    return;
  }

  try {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      gaOptions: {
        debug_mode: DEBUG_MODE,
      },
    });
    console.log('[GA4] Initialized successfully', { measurementId: GA_MEASUREMENT_ID, debugMode: DEBUG_MODE });
  } catch (error) {
    console.error('[GA4] Initialization failed:', error);
  }
};

/**
 * 페이지뷰 추적
 * 라우터 변경 시 호출
 * 
 * @param path 페이지 경로 (예: '/wizard/1')
 * @param title 페이지 제목 (선택사항)
 */
export const trackPageView = (path: string, title?: string) => {
  if (!GA_MEASUREMENT_ID) return;

  ReactGA.send({
    hitType: 'pageview',
    page: path,
    title: title || document.title,
  });

  if (DEBUG_MODE) {
    console.log('[GA4] Page view:', { path, title: title || document.title });
  }
};

/**
 * 커스텀 이벤트 추적
 * 
 * @param eventName 이벤트 이름 (예: 'signup_complete', 'wizard_step_complete')
 * @param params 이벤트 매개변수
 * 
 * @example
 * trackEvent('signup_complete', { plan_name: 'plus', method: 'email' });
 * trackEvent('wizard_step_complete', { step_id: 1, duration_seconds: 120 });
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) => {
  if (!GA_MEASUREMENT_ID) return;

  // undefined 값 필터링
  const cleanParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined)
      )
    : undefined;

  ReactGA.event(eventName, cleanParams);

  if (DEBUG_MODE) {
    console.log('[GA4] Event:', { eventName, params: cleanParams });
  }
};

/**
 * 사용자 속성 설정
 * 로그인 시 호출하여 사용자 세그먼트 분석에 활용
 * 
 * @param properties 사용자 속성
 * 
 * @example
 * setUserProperties({
 *   user_type: 'subscriber',
 *   subscription_plan: 'plus',
 *   registration_source: 'organic'
 * });
 */
export const setUserProperties = (properties: Record<string, string | number | boolean>) => {
  if (!GA_MEASUREMENT_ID) return;

  ReactGA.gtag('set', 'user_properties', properties);

  if (DEBUG_MODE) {
    console.log('[GA4] User properties set:', properties);
  }
};

/**
 * 사용자 ID 설정
 * 로그인 성공 시 호출하여 크로스 디바이스 추적에 활용
 * 
 * @param userId 사용자 고유 ID
 */
export const setUserId = (userId: string) => {
  if (!GA_MEASUREMENT_ID) return;

  ReactGA.gtag('config', GA_MEASUREMENT_ID, {
    user_id: userId,
  });

  if (DEBUG_MODE) {
    console.log('[GA4] User ID set:', userId);
  }
};

/**
 * GA4 클라이언트 ID 가져오기
 * 백엔드 Measurement Protocol 연동 시 사용
 * 
 * @returns Promise<string> 클라이언트 ID
 */
export const getClientId = (): Promise<string> => {
  return new Promise((resolve) => {
    if (!GA_MEASUREMENT_ID) {
      resolve(crypto.randomUUID());
      return;
    }

    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      window.gtag('get', GA_MEASUREMENT_ID, 'client_id', (clientId: string) => {
        resolve(clientId);
      });
    } else {
      // fallback: UUID 생성
      resolve(crypto.randomUUID());
    }
  });
};

// Window 타입 확장 (gtag 지원)
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      fieldName: string,
      callback: (value: string) => void
    ) => void;
  }
}
