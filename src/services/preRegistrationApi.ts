/**
 * 사전 등록 API 서비스
 * Pre-registration API service layer
 */

import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

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
    // 개발 환경: 백엔드 API 호출 로깅
    if (import.meta.env.DEV) {
      const method = config.method?.toUpperCase() || 'UNKNOWN';
      const url = `${config.baseURL || ''}${config.url || ''}`;
      const timestamp = new Date().toISOString();
      
      console.group(`🔵 [PreRegistration API Request] ${method} ${url}`);
      console.log('Timestamp:', timestamp);
      console.log('Method:', method);
      console.log('URL:', url);
      console.log('Headers:', config.headers);
      if (config.params) {
        console.log('Query Params:', config.params);
      }
      if (config.data) {
        console.log('Request Data:', config.data);
      }
      console.groupEnd();
    }
    return config;
  },
  (error: AxiosError) => {
    // 개발 환경: 요청 에러 로깅
    if (import.meta.env.DEV) {
      console.error('❌ [PreRegistration API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 개발 환경: 백엔드 API 응답 로깅
    if (import.meta.env.DEV) {
      const method = response.config.method?.toUpperCase() || 'UNKNOWN';
      const url = `${response.config.baseURL || ''}${response.config.url || ''}`;
      const status = response.status;
      const timestamp = new Date().toISOString();
      
      console.group(`🟢 [PreRegistration API Response] ${method} ${url} - ${status}`);
      console.log('Timestamp:', timestamp);
      console.log('Status:', status);
      console.log('Status Text:', response.statusText);
      console.log('Response Data:', response.data);
      if (response.headers) {
        console.log('Response Headers:', response.headers);
      }
      console.groupEnd();
    }
    return response;
  },
  (error: AxiosError) => {
    // 개발 환경: 백엔드 API 에러 로깅
    if (import.meta.env.DEV) {
      const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
      const url = error.config ? `${error.config.baseURL || ''}${error.config.url || ''}` : 'UNKNOWN';
      const status = error.response?.status || 'NO_RESPONSE';
      const timestamp = new Date().toISOString();
      
      console.group(`🔴 [PreRegistration API Error] ${method} ${url} - ${status}`);
      console.log('Timestamp:', timestamp);
      console.log('Status:', status);
      console.log('Error Message:', error.message);
      if (error.response) {
        console.log('Response Data:', error.response.data);
        console.log('Response Headers:', error.response.headers);
      } else if (error.request) {
        console.log('Request made but no response received:', error.request);
      }
      console.log('Full Error:', error);
      console.groupEnd();
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

