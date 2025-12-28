/**
 * 사전 등록 API 서비스
 * Pre-registration API service layer
 */

import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE = '/api/v1';

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
    // 개발 환경 로깅
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 개발 환경 로깅
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    // 에러 로깅
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${error.config?.url}`, error.response?.data || error.message);
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
    const response = await apiClient.post<PreRegistrationResponse>('/pre-registrations', data);
    return response.data;
  },

  /**
   * 이메일 중복 체크
   */
  checkEmail: async (email: string): Promise<EmailCheckResponse> => {
    const response = await apiClient.get<EmailCheckResponse>('/pre-registrations/check-email', {
      params: { email },
    });
    return response.data;
  },

  /**
   * 현재 프로모션 정보 조회
   */
  getPromotionInfo: async (): Promise<PromotionInfo> => {
    const response = await apiClient.get<PromotionInfo>('/promotions/current');
    return response.data;
  },

  /**
   * 등록 정보 조회
   */
  getById: async (id: string): Promise<PreRegistrationResponse> => {
    const response = await apiClient.get<PreRegistrationResponse>(`/pre-registrations/${id}`);
    return response.data;
  },
};

export default preRegistrationApi;

