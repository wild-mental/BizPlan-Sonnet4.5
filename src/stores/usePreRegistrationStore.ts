/**
 * 사전 등록 상태 관리 스토어
 * Pre-registration state management with Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  preRegistrationApi,
  type PreRegistrationRequest,
  type PreRegistrationResponse,
  type PromotionInfo,
  type EmailCheckResponse,
} from '../services/preRegistrationApi';
import { trackEvent } from '../utils/analytics';

interface PreRegistrationStore {
  // UI 상태
  isModalOpen: boolean;
  selectedPlan: 'plus' | 'pro' | 'premium' | null;
  isSubmitting: boolean;
  isCheckingEmail: boolean;
  error: string | null;

  // 서버 응답 캐시
  lastRegistration: PreRegistrationResponse | null;
  promotionInfo: PromotionInfo | null;
  emailCheckResult: EmailCheckResponse | null;

  // Modal Actions
  openModal: (plan?: 'plus' | 'pro' | 'premium') => void;
  closeModal: () => void;

  // API Actions
  submitRegistration: (data: PreRegistrationRequest) => Promise<PreRegistrationResponse>;
  checkEmailExists: (email: string) => Promise<EmailCheckResponse>;
  fetchPromotionInfo: () => Promise<PromotionInfo>;

  // Utility Actions
  clearError: () => void;
  clearLastRegistration: () => void;
  reset: () => void;
}

export const usePreRegistrationStore = create<PreRegistrationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isModalOpen: false,
      selectedPlan: null,
      isSubmitting: false,
      isCheckingEmail: false,
      error: null,
      lastRegistration: null,
      promotionInfo: null,
      emailCheckResult: null,

      // Modal Actions
      openModal: (plan) =>
        set({
          isModalOpen: true,
          selectedPlan: plan || null,
          error: null,
        }),

      closeModal: () =>
        set({
          isModalOpen: false,
          error: null,
        }),

      // API Actions
      submitRegistration: async (data) => {
        set({ isSubmitting: true, error: null });
        try {
          const response = await preRegistrationApi.submit(data);
          set({
            lastRegistration: response,
            isSubmitting: false,
            isModalOpen: false,
          });
          
          // GA4 이벤트: 사전등록 완료
          trackEvent('preregistration_complete', {
            plan_name: data.selectedPlan,
            discount_rate: response.discountRate,
          });
          
          return response;
        } catch (error: unknown) {
          const axiosError = error as { response?: { data?: { message?: string } } };
          const message =
            axiosError.response?.data?.message || '등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          set({ error: message, isSubmitting: false });
          throw error;
        }
      },

      checkEmailExists: async (email) => {
        set({ isCheckingEmail: true });
        try {
          const result = await preRegistrationApi.checkEmail(email);
          set({ emailCheckResult: result, isCheckingEmail: false });
          return result;
        } catch (error) {
          set({ isCheckingEmail: false });
          return { exists: false };
        }
      },

      fetchPromotionInfo: async () => {
        try {
          const info = await preRegistrationApi.getPromotionInfo();
          set({ promotionInfo: info });
          return info;
        } catch (error) {
          console.error('Failed to fetch promotion info:', error);
          throw error;
        }
      },

      // Utility Actions
      clearError: () => set({ error: null }),
      clearLastRegistration: () => set({ lastRegistration: null }),
      reset: () =>
        set({
          isModalOpen: false,
          selectedPlan: null,
          isSubmitting: false,
          error: null,
          lastRegistration: null,
          emailCheckResult: null,
        }),
    }),
    {
      name: 'pre-registration-storage',
      partialize: (state) => ({
        // 마지막 등록 정보만 persist
        lastRegistration: state.lastRegistration,
      }),
    }
  )
);

export default usePreRegistrationStore;

