/**
 * 파일명: useAuthStore.ts
 * 
 * 파일 용도:
 * 사용자 인증 상태 관리를 위한 Zustand Store
 * - 로그인/회원가입 상태 관리
 * - 선택한 요금제 정보 저장
 * - 서버 호출 없이 브라우저 내 Mocking
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

/** 요금제 타입 */
export type PricingPlanType = '기본' | '플러스' | '프로' | '프리미엄';

/** 사용자 정보 */
export interface User {
  /** 사용자 ID (Mocked) */
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
  marketingConsent: boolean;
  /** 가입 시간 (ISO 문자열) */
  createdAt: string;
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
}

interface AuthState {
  /** 현재 로그인된 사용자 */
  user: User | null;
  /** 인증 상태 */
  isAuthenticated: boolean;
  /** 선택된 요금제 (회원가입 전 임시 저장) */
  selectedPlan: PricingPlanType | null;
  /** 로딩 상태 */
  isLoading: boolean;
  
  /** 회원가입 (Mocked) */
  signup: (data: SignupData) => Promise<User>;
  /** 소셜 로그인 (Mocked) */
  socialLogin: (provider: 'google' | 'kakao' | 'naver', plan: PricingPlanType) => Promise<User>;
  /** 로그인 (Mocked) */
  login: (email: string, password: string) => Promise<User>;
  /** 로그아웃 */
  logout: () => void;
  /** 요금제 선택 (회원가입 전) */
  setSelectedPlan: (plan: PricingPlanType) => void;
  /** 선택 초기화 */
  clearSelectedPlan: () => void;
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
      selectedPlan: null,
      isLoading: false,

      /**
       * 회원가입 (Mocked)
       * - 실제 서버 호출 없이 브라우저 내에서 처리
       * - 입력된 정보로 User 객체 생성
       * 
       * @param {SignupData} data - 회원가입 데이터
       * @returns {Promise<User>} 생성된 사용자 정보
       */
      signup: async (data: SignupData): Promise<User> => {
        set({ isLoading: true });
        
        // Mocked delay (실제 서버 호출 시뮬레이션)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const newUser: User = {
          id: `user-${Date.now()}`,
          email: data.email,
          name: data.name,
          plan: data.plan,
          socialProvider: data.socialProvider,
          marketingConsent: data.marketingConsent,
          createdAt: new Date().toISOString(),
        };
        
        set({
          user: newUser,
          isAuthenticated: true,
          selectedPlan: null,
          isLoading: false,
        });
        
        console.log('[Mocked] 회원가입 완료:', newUser);
        return newUser;
      },

      /**
       * 소셜 로그인 (Mocked)
       * - 소셜 제공자 정보로 사용자 생성
       * 
       * @param {'google' | 'kakao' | 'naver'} provider - 소셜 로그인 제공자
       * @param {PricingPlanType} plan - 선택한 요금제
       * @returns {Promise<User>} 생성된 사용자 정보
       */
      socialLogin: async (provider: 'google' | 'kakao' | 'naver', plan: PricingPlanType): Promise<User> => {
        set({ isLoading: true });
        
        // Mocked delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 소셜 로그인 시 가상의 사용자 정보 생성
        const mockEmails: Record<string, string> = {
          google: 'user@gmail.com',
          kakao: 'user@kakao.com',
          naver: 'user@naver.com',
        };
        
        const mockNames: Record<string, string> = {
          google: '구글 사용자',
          kakao: '카카오 사용자',
          naver: '네이버 사용자',
        };
        
        const newUser: User = {
          id: `user-${provider}-${Date.now()}`,
          email: mockEmails[provider],
          name: mockNames[provider],
          plan: plan,
          socialProvider: provider,
          marketingConsent: false,
          createdAt: new Date().toISOString(),
        };
        
        set({
          user: newUser,
          isAuthenticated: true,
          selectedPlan: null,
          isLoading: false,
        });
        
        console.log(`[Mocked] ${provider} 소셜 로그인 완료:`, newUser);
        return newUser;
      },

      /**
       * 로그인 (Mocked)
       * - 이메일/비밀번호로 로그인
       * - 저장된 사용자가 없으면 새로 생성
       * 
       * @param {string} email - 이메일
       * @param {string} password - 비밀번호
       * @returns {Promise<User>} 사용자 정보
       */
      login: async (email: string, password: string): Promise<User> => {
        set({ isLoading: true });
        
        // Mocked delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 기존 사용자가 있으면 그대로 반환 (이메일 확인)
        const existingUser = get().user;
        if (existingUser && existingUser.email === email) {
          set({ isAuthenticated: true, isLoading: false });
          console.log('[Mocked] 로그인 완료:', existingUser);
          return existingUser;
        }
        
        // 없으면 기본 요금제로 새 사용자 생성
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name: email.split('@')[0],
          plan: '기본',
          marketingConsent: false,
          createdAt: new Date().toISOString(),
        };
        
        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        });
        
        console.log('[Mocked] 로그인 완료 (신규):', newUser);
        return newUser;
      },

      /**
       * 로그아웃
       * - 사용자 정보 및 인증 상태 초기화
       */
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          selectedPlan: null,
        });
        console.log('[Mocked] 로그아웃 완료');
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
    }),
    {
      name: 'auth-storage',
    }
  )
);

