/**
 * 파일명: requestId.ts
 *
 * 파일 용도:
 * - 프론트엔드에서 API 요청 간 전구간 추적을 위한 Request ID 관리
 * - 브라우저 세션 단위로 하나의 ULID를 생성하여 모든 API 요청에 재사용
 *
 * 참고:
 * - ULID는 시간 정보를 포함하므로 정렬에 유리함
 * - 세션 스토리지는 탭/창별로 분리되므로, 탭마다 서로 다른 Request ID 흐름을 갖게 됩니다.
 */

import { ulid } from 'ulid';

const SESSION_REQUEST_ID_KEY = 'bizplan:sessionRequestId';

/**
 * 현재 브라우저 세션에 대한 공통 Request ID(ULID)를 반환합니다.
 * 존재하지 않을 경우 새로 생성하여 sessionStorage에 저장합니다.
 */
export const getSessionRequestId = (): string => {
  if (typeof window === 'undefined') {
    // SSR 혹은 윈도우 객체가 없는 환경에서는 매번 새로운 ULID를 생성합니다.
    return ulid();
  }

  try {
    const existing = window.sessionStorage.getItem(SESSION_REQUEST_ID_KEY);
    if (existing) {
      return existing;
    }

    const newId = ulid();
    window.sessionStorage.setItem(SESSION_REQUEST_ID_KEY, newId);
    return newId;
  } catch {
    // sessionStorage 사용이 불가능한 경우(프라이버시 모드 등)에는
    // 각 호출마다 새로운 ULID를 생성합니다.
    return ulid();
  }
};

