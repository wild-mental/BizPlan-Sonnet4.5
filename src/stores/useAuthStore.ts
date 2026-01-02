/**
 * 파일명: useAuthStore.ts
 * 
 * 파일 용도:
 * 사용자 인증 상태 관리를 위한 Zustand Store
 * - 로그인/회원가입 상태 관리
 * - 선택한 요금제 정보 저장
 * - API 연동을 통한 인증 처리
 * - localStorage에 자동 영속화
 * 
 * 호출 구조:
 * useAuthStore (이 Store)
 *   ├─> signup() - SignupPage에서 회원가입 시 호출
 *   ├─> login() - 로그인 시 호출
 *   ├─> logout() - 로그아웃 시 호출
 *   ├─> setSelectedPlan() - 요금제 선택 시 호출
 *   └─> clearSelectedPlan() - 선택 초기화
 * 
 * 영속화:
 * - localStorage 키: 'auth-storage'
 * - 브라우저 새로고침 시에도 데이터 유지
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, User as ApiUser, SignupRequest } from '../services/authApi';

/** 요금제 타입 */
export type PricingPlanType = '기본' | '플러스' | '프로' | '프리미엄';

/** 사용자 정보 */
export interface User {
  /** 사용자 ID */
  id: string;
  /** 이메일 */
  email: string;
  /** 이름 */
  name: string;
  /** 가입한 요금제 */
  plan: PricingPlanType;
  /** 소셜 로그인 제공자 (있는 경우) */
  socialProvider?: 'google' | 'kakao' | 'naver';
  /** 마케팅 수신 동의 여부 */
  marketingConsent?: boolean;
  /** 가입 시간 (ISO 문자열) */
  createdAt?: string;
}

/** 회원가입 데이터 */
export interface SignupData {
  email: string;
  password: string;
  name: string;
  plan: PricingPlanType;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingConsent: boolean;
  socialProvider?: 'google' | 'kakao' | 'naver';
  phone?: string;
  businessCategory?: string;
  promotionCode?: string;
}

interface AuthState {
  /** 현재 로그인된 사용자 */
  user: User | null;
  /** 인증 상태 */
  isAuthenticated: boolean;
  /** 액세스 토큰 */
  accessToken: string | null;
  /** 리프레시 토큰 */
  refreshToken: string | null;
  /** 선택된 요금제 (회원가입 전 임시 저장) */
  selectedPlan: PricingPlanType | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  
  /** 회원가입 */
  signup: (data: SignupData) => Promise<void>;
  /** 소셜 로그인 */
  socialLogin: (provider: 'google' | 'kakao' | 'naver', token: string, plan: PricingPlanType, termsAgreed?: boolean, privacyAgreed?: boolean, marketingConsent?: boolean) => Promise<void>;
  /** 로그인 */
  login: (email: string, password: string) => Promise<void>;
  /** 로그아웃 */
  logout: () => Promise<void>;
  /** 토큰 설정 */
  setTokens: (accessToken: string, refreshToken: string) => void;
  /** 프로필 로드 */
  loadProfile: () => Promise<void>;
  /** 요금제 선택 (회원가입 전) */
  setSelectedPlan: (plan: PricingPlanType) => void;
  /** 선택 초기화 */
  clearSelectedPlan: () => void;
  /** 에러 초기화 */
  clearError: () => void;
}

/**
 * useAuthStore
 * 
 * 역할:
 * - 사용자 인증 상태 관리
 * - 회원가입/로그인/로그아웃 처리 (Mocked)
 * - 선택한 요금제 정보 유지
 * 
 * 주요 기능:
 * 1. 회원가입 - 입력 정보로 새 사용자 생성
 * 2. 소셜 로그인 - 소셜 제공자 정보로 사용자 생성
 * 3. 로그인/로그아웃
 * 4. 요금제 선택 상태 관리
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      selectedPlan: null,
      isLoading: false,
      error: null,

      /**
       * 회원가입
       * - API를 통한 회원가입 처리
       * 
       * @param {SignupData} data - 회원가입 데이터
       */
      signup: async (data: SignupData) => {
        set({ isLoading: true, error: null });
        try {
          const request: SignupRequest = {
            email: data.email,
            password: data.password,
            name: data.name,
            plan: data.plan,
            phone: data.phone,
            businessCategory: data.businessCategory,
            termsAgreed: data.termsAgreed,
            privacyAgreed: data.privacyAgreed,
            marketingConsent: data.marketingConsent,
            promotionCode: data.promotionCode,
            socialProvider: data.socialProvider,
          };
          
          const response = await authApi.signup(request);
          if (response.data.success && response.data.data) {
            const { user, tokens } = response.data.data;
            set({
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                plan: user.plan as PricingPlanType,
                socialProvider: user.provider as 'google' | 'kakao' | 'naver' | undefined,
                marketingConsent: data.marketingConsent,
              },
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              isAuthenticated: true,
              selectedPlan: null,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.error?.message || '회원가입에 실패했습니다',
            isLoading: false,
          });
          throw error;
        }
      },

      /**
       * 소셜 로그인
       * - 소셜 제공자 정보로 로그인
       * 
       * @param {'google' | 'kakao' | 'naver'} provider - 소셜 로그인 제공자
       * @param {string} token - 소셜 로그인 토큰
       * @param {PricingPlanType} plan - 선택한 요금제
       */
      socialLogin: async (provider: 'google' | 'kakao' | 'naver', token: string, plan: PricingPlanType, termsAgreed?: boolean, privacyAgreed?: boolean, marketingConsent?: boolean) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.socialLogin(provider, token, plan, termsAgreed, privacyAgreed, marketingConsent);
          if (response.data.success && response.data.data) {
            const { user, tokens } = response.data.data;
            set({
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                plan: user.plan as PricingPlanType,
                socialProvider: user.provider as 'google' | 'kakao' | 'naver' | undefined,
              },
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              isAuthenticated: true,
              selectedPlan: null,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.error?.message || '소셜 로그인에 실패했습니다',
            isLoading: false,
          });
          throw error;
        }
      },

      /**
       * 로그인
       * - 이메일/비밀번호로 로그인
       * 
       * @param {string} email - 이메일
       * @param {string} password - 비밀번호
       */
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(email, password);
          if (response.data.success && response.data.data) {
            const { user, tokens } = response.data.data;
            set({
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                plan: user.plan as PricingPlanType,
                socialProvider: user.provider as 'google' | 'kakao' | 'naver' | undefined,
              },
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.error?.message || '로그인에 실패했습니다',
            isLoading: false,
          });
          throw error;
        }
      },

      /**
       * 로그아웃
       * - 사용자 정보 및 인증 상태 초기화
       */
      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            selectedPlan: null,
          });
        }
      },

      /**
       * 토큰 설정
       * - 토큰 갱신 시 사용
       */
      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken });
      },

      /**
       * 프로필 로드
       * - 현재 사용자 프로필 정보 조회
       */
      loadProfile: async () => {
        if (!get().accessToken) return;
        try {
          const response = await authApi.getProfile();
          if (response.data.success && response.data.data) {
            const user = response.data.data;
            set({
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                plan: user.plan as PricingPlanType,
                socialProvider: user.provider as 'google' | 'kakao' | 'naver' | undefined,
              },
            });
          }
        } catch {
          // 토큰 만료 시 로그아웃 처리
          get().logout();
        }
      },

      /**
       * 요금제 선택 (회원가입 전)
       * - 랜딩페이지에서 선택한 요금제 임시 저장
       * 
       * @param {PricingPlanType} plan - 선택한 요금제
       */
      setSelectedPlan: (plan: PricingPlanType) => {
        set({ selectedPlan: plan });
      },

      /**
       * 선택 초기화
       */
      clearSelectedPlan: () => {
        set({ selectedPlan: null });
      },

      /**
       * 에러 초기화
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        selectedPlan: state.selectedPlan,
      }),
    }
  )
);


