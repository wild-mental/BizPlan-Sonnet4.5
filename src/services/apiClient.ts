/**
 * 파일명: apiClient.ts
 * 
 * 파일 용도:
 * Axios 기반 API 클라이언트 설정
 * - 요청/응답 인터셉터 설정
 * - 인증 토큰 자동 추가
 * - 토큰 갱신 처리
 * - 공통 에러 처리
 */

import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

// API 응답 타입 정의
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    page?: number;
    totalPages?: number;
    totalCount?: number;
  };
}

// API Base URL 설정 (환경 변수 우선, 없으면 기본값)
const getApiBaseUrl = (): string => {
  // VITE_API_URL 또는 VITE_API_BASE_URL 환경 변수 사용
  const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (apiUrl) {
    return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  }
  // 기본값: Vite 프록시 사용 (개발 환경)
  return '/api/v1';
};

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // 401 에러 시 토큰 갱신 시도
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error('No refresh token');
        
        const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
          `${getApiBaseUrl()}/auth/refresh`,
          { refreshToken }
        );
        
        if (response.data.success && response.data.data) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          useAuthStore.getState().setTokens(accessToken, newRefreshToken);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch {
        useAuthStore.getState().logout();
        window.location.href = '/signup';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

