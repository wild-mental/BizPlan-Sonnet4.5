/**
 * 파일명: useBusinessPlanStore.ts
 * 
 * 파일 용도:
 * AI 생성 사업계획서 상태 관리 Zustand Store
 * - 생성된 사업계획서 데이터 저장
 * - 생성 상태 (로딩, 에러) 관리
 * - localStorage 영속화
 * 
 * 호출 구조:
 * useBusinessPlanStore (이 Store)
 *   ├─> setGeneratedPlan() - 생성된 사업계획서 저장
 *   ├─> setLoading() - 로딩 상태 설정
 *   ├─> setError() - 에러 상태 설정
 *   ├─> clearPlan() - 사업계획서 초기화
 *   └─> updateSection() - 특정 섹션 업데이트
 * 
 * 사용하는 컴포넌트:
 * - WizardStep: 생성 후 데이터 저장
 * - BusinessPlanViewer: 저장된 데이터 표시
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DraftSection } from '../types';
import { 
  GeneratedBusinessPlanData, 
  BusinessPlanSection,
  convertToDraftSections 
} from '../services/businessPlanApi';

// ============================================
// Store 인터페이스
// ============================================

interface BusinessPlanState {
  /** 생성된 사업계획서 원본 데이터 */
  generatedData: GeneratedBusinessPlanData | null;
  
  /** 표시용 섹션 데이터 (DraftSection 형식) */
  sections: DraftSection[];
  
  /** 생성 완료 여부 */
  isGenerated: boolean;
  
  /** 로딩 상태 */
  isLoading: boolean;
  
  /** 에러 메시지 */
  error: string | null;
  
  /** 생성된 사업계획서 저장 */
  setGeneratedPlan: (data: GeneratedBusinessPlanData) => void;
  
  /** API 응답 섹션을 직접 저장 */
  setSections: (sections: BusinessPlanSection[]) => void;
  
  /** 로딩 상태 설정 */
  setLoading: (loading: boolean) => void;
  
  /** 에러 설정 */
  setError: (error: string | null) => void;
  
  /** 특정 섹션 내용 업데이트 (재생성 시) */
  updateSection: (sectionId: string, content: string) => void;
  
  /** 사업계획서 초기화 */
  clearPlan: () => void;
}

// ============================================
// Store 구현
// ============================================

/**
 * useBusinessPlanStore
 * 
 * 역할:
 * - AI 생성 사업계획서 상태 관리
 * - 생성 결과 저장 및 표시
 * - localStorage 영속화
 */
export const useBusinessPlanStore = create<BusinessPlanState>()(
  persist(
    (set, get) => ({
      generatedData: null,
      sections: [],
      isGenerated: false,
      isLoading: false,
      error: null,

      /**
       * 생성된 사업계획서 저장
       * - API 응답 전체 데이터를 저장
       * - sections를 DraftSection 형식으로 변환하여 저장
       */
      setGeneratedPlan: (data: GeneratedBusinessPlanData) => {
        const draftSections = convertToDraftSections(data.sections);
        set({
          generatedData: data,
          sections: draftSections,
          isGenerated: true,
          isLoading: false,
          error: null,
        });
      },

      /**
       * API 응답 섹션을 직접 저장
       * (generatedData 없이 섹션만 저장할 때 사용)
       */
      setSections: (sections: BusinessPlanSection[]) => {
        const draftSections = convertToDraftSections(sections);
        set({
          sections: draftSections,
          isGenerated: true,
          isLoading: false,
          error: null,
        });
      },

      /**
       * 로딩 상태 설정
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
        if (loading) {
          set({ error: null });
        }
      },

      /**
       * 에러 설정
       */
      setError: (error: string | null) => {
        set({ 
          error, 
          isLoading: false,
          isGenerated: error ? false : get().isGenerated,
        });
      },

      /**
       * 특정 섹션 내용 업데이트
       * - 섹션 재생성 시 사용
       */
      updateSection: (sectionId: string, content: string) => {
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === sectionId
              ? { ...section, content }
              : section
          ),
        }));
      },

      /**
       * 사업계획서 초기화
       * - 새 프로젝트 시작 시 사용
       */
      clearPlan: () => {
        set({
          generatedData: null,
          sections: [],
          isGenerated: false,
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: 'business-plan-storage',
      // 영속화할 필드 선택 (로딩/에러 상태는 제외)
      partialize: (state) => ({
        generatedData: state.generatedData,
        sections: state.sections,
        isGenerated: state.isGenerated,
      }),
    }
  )
);
