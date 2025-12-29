/**
 * 파일명: authApi.ts
 * 
 * 파일 용도:
 * 인증 관련 API 서비스
 * - 회원가입, 로그인, 소셜 로그인
 * - 토큰 갱신, 로그아웃
 * - 프로필 조회
 */

import apiClient, { ApiResponse } from './apiClient';

// 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
  planEndDate?: string;
  provider?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  plan: string;
  phone?: string;
  businessCategory?: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingConsent: boolean;
  promotionCode?: string;
  socialProvider?: 'google' | 'kakao' | 'naver';
}

export interface SignupResponse {
  user: User;
  subscription: {
    planKey: string;
    originalPrice: number;
    discountedPrice: number;
    discountRate: number;
  };
  tokens: AuthTokens;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface SocialLoginResponse extends LoginResponse {
  isNewUser: boolean;
}

// API 함수
export const authApi = {
  signup: (data: SignupRequest) =>
    apiClient.post<ApiResponse<SignupResponse>>('/auth/signup', data),

  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', { email, password }),

  socialLogin: (provider: 'google' | 'kakao' | 'naver', accessToken: string, plan: string) =>
    apiClient.post<ApiResponse<SocialLoginResponse>>(
      `/auth/social/${provider}`,
      { accessToken, plan }
    ),

  refresh: (refreshToken: string) =>
    apiClient.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken }),

  logout: () =>
    apiClient.post<ApiResponse<null>>('/auth/logout'),

  getProfile: () =>
    apiClient.get<ApiResponse<User>>('/auth/profile'),
};

