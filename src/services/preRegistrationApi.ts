/**
 * 사전 등록 API 서비스
 * Pre-registration API service layer
 */

import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { logFrontendRequest, logFrontendResponse, logFrontendError } from '../utils/apiLogger';
import { getSessionRequestId } from '../utils/requestId';

// API Base URL 설정 (환경 변수 우선, 없으면 기본값)
// 주의: 각 API 호출 경로에 /api/v1을 포함해야 함
const getApiBaseUrl = (): string => {
  // VITE_API_URL 또는 VITE_API_BASE_URL 환경 변수 사용
  const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (apiUrl) {
    let url = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    // 전체 URL인 경우 (http:// 또는 https://로 시작) /api/v1 경로 제거 (각 경로에 포함됨)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // /api/v1이 포함되어 있으면 제거
      if (url.endsWith('/api/v1')) {
        url = url.slice(0, -7);
      } else if (url.includes('/api/v1/')) {
        url = url.split('/api/v1')[0];
      }
    }
    return url;
  }
  // 기본값: 빈 문자열 (각 경로에 /api/v1 포함)
  return '';
};

const API_BASE = getApiBaseUrl();

// API 요청 타입
export interface PreRegistrationRequest {
  name: string;
  email: string;
  phone: string;
  selectedPlan: 'plus' | 'pro' | 'premium';
  businessCategory?: string;
  agreeTerms: boolean;
  agreeMarketing: boolean;
}

// API 응답 타입
export interface PreRegistrationResponse {
  id: string;
  discountCode: string;
  discountRate: number;
  selectedPlan: string;
  originalPrice: number;
  discountedPrice: number;
  registeredAt: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'converted';
}

// 프로모션 정보 타입
export interface PromotionInfo {
  isActive: boolean;
  currentPhase: 'A' | 'B' | 'ENDED';
  discountRate: number;
  phaseAEnd: string;
  phaseBEnd: string;
  prices: Record<string, { original: number; discounted: number }>;
}

// 이메일 중복 체크 응답
export interface EmailCheckResponse {
  exists: boolean;
  discountCode?: string;
}

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 세션 단위 Request ID(ULID)를 생성하여 모든 요청에 공통으로 포함
    // ULID는 시간 정보를 포함하므로 정렬에 유리함
    if (config.headers) {
      const sessionRequestId = getSessionRequestId();
      (config.headers as any)['X-Request-ID'] = sessionRequestId;
    }

    // 요청 시작 시간 저장 (응답 시 duration 계산용)
    (config as any).metadata = {
      startTime: Date.now(),
    };
    
    // API 요청 로깅
    logFrontendRequest(config);
    
    return config;
  },
  (error: AxiosError) => {
    // 요청 에러 로깅
    if (error.config) {
      logFrontendError(error, (error.config as any).metadata?.startTime);
    }
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 요청 시작 시간 가져오기
    const startTime = (response.config as any).metadata?.startTime;
    
    // API 응답 로깅
    logFrontendResponse(response, startTime);
    
    return response;
  },
  (error: AxiosError) => {
    // 요청 시작 시간 가져오기
    const startTime = error.config ? (error.config as any).metadata?.startTime : undefined;
    
    // API 에러 로깅
    if (error.config) {
      logFrontendError(error, startTime);
    }
    
    return Promise.reject(error);
  }
);

/**
 * 사전 등록 API 서비스
 */
export const preRegistrationApi = {
  /**
   * 사전 등록 신청
   */
  submit: async (data: PreRegistrationRequest): Promise<PreRegistrationResponse> => {
    const response = await apiClient.post<PreRegistrationResponse>('/api/v1/pre-registrations', data);
    return response.data;
  },

  /**
   * 이메일 중복 체크
   */
  checkEmail: async (email: string): Promise<EmailCheckResponse> => {
    const response = await apiClient.get<EmailCheckResponse>('/api/v1/pre-registrations/check-email', {
      params: { email },
    });
    return response.data;
  },

  /**
   * 현재 프로모션 정보 조회
   */
  getPromotionInfo: async (): Promise<PromotionInfo> => {
    const response = await apiClient.get<PromotionInfo>('/api/v1/promotions/current');
    return response.data;
  },

  /**
   * 등록 정보 조회
   */
  getById: async (id: string): Promise<PreRegistrationResponse> => {
    const response = await apiClient.get<PreRegistrationResponse>(`/api/v1/pre-registrations/${id}`);
    return response.data;
  },
};

export default preRegistrationApi;

