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
import { logFrontendRequest, logFrontendResponse, logFrontendError } from '../utils/apiLogger';
import { getSessionRequestId } from '../utils/requestId';

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
  (error) => {
    // 요청 에러 로깅
    if (error.config) {
      logFrontendError(error as AxiosError, (error.config as any).metadata?.startTime);
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
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // 요청 시작 시간 가져오기
    const startTime = originalRequest ? (originalRequest as any).metadata?.startTime : undefined;
    
    // API 에러 로깅
    if (originalRequest) {
      logFrontendError(error, startTime);
    }
    
    // 401 에러 시 토큰 갱신 시도
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error('No refresh token');
        
        if (import.meta.env.DEV) {
          console.log('🔄 [Token Refresh] Attempting to refresh access token...');
        }
        
        const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
          `${getApiBaseUrl()}/api/v1/auth/refresh`,
          { refreshToken }
        );
        
        if (response.data.success && response.data.data) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          useAuthStore.getState().setTokens(accessToken, newRefreshToken);
          
          if (import.meta.env.DEV) {
            console.log('✅ [Token Refresh] Token refreshed successfully, retrying original request...');
          }
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        if (import.meta.env.DEV) {
          console.error('❌ [Token Refresh] Failed to refresh token:', refreshError);
        }
        useAuthStore.getState().logout();
        window.location.href = '/signup';
      }
    }
    
    // 403 에러 시 인증 필요 - 로그인 페이지로 리다이렉트
    if (error.response?.status === 403) {
      const authStore = useAuthStore.getState();
      const isAuthenticated = authStore.isAuthenticated;
      const hasToken = !!authStore.accessToken;
      
      if (import.meta.env.DEV) {
        console.warn('🔒 [403 Forbidden] Authentication required. Redirecting to login...');
        console.log('Auth state:', { isAuthenticated, hasToken });
      }
      
      // 인증되지 않은 상태이거나 토큰이 없는 경우 로그인 페이지로 리다이렉트
      if (!isAuthenticated || !hasToken) {
        authStore.logout();
        // 현재 경로를 저장하여 로그인 후 돌아올 수 있도록 함
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/') {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        } else {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

