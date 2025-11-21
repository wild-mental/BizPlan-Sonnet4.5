/**
 * 파일명: useWizardStore.ts
 * 
 * 파일 용도:
 * 마법사 진행 상태 및 데이터 관리를 위한 Zustand Store
 * - 5단계 마법사의 현재 단계 추적
 * - 각 단계별 질문 답변 저장
 * - 단계 완료 여부 검증
 * - localStorage에 자동 영속화
 * 
 * 호출 구조:
 * useWizardStore (이 Store)
 *   ├─> setCurrentStep() - WizardStep 페이지에서 호출
 *   ├─> updateStepData() - QuestionForm, FinancialSimulation, PMFSurvey에서 호출
 *   ├─> getStepData() - 각 단계 컴포넌트에서 데이터 로드
 *   ├─> isStepCompleted() - Layout, WizardStep에서 진행률 확인
 *   ├─> goToNextStep() / goToPreviousStep() - 네비게이션
 *   └─> resetWizard() - ProjectCreate에서 새 프로젝트 시작 시 호출
 * 
 * 사용하는 컴포넌트:
 * - WizardStep: 단계 관리 및 네비게이션
 * - QuestionForm: 질문 답변 저장
 * - Layout: 진행률 표시
 * - ProjectCreate: 마법사 초기화
 * 
 * 데이터 구조:
 * wizardData: {
 *   1: { question1: 'answer1', question2: 'answer2' },
 *   2: { question3: 'answer3' },
 *   ...
 * }
 * 
 * 영속화:
 * - localStorage 키: 'wizard-storage'
 * - 브라우저 새로고침 시에도 데이터 유지
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WizardData, WizardStep } from '../types';
import { wizardSteps } from '../types/mockData';

interface WizardState {
  /** 현재 마법사 단계 (1-5) */
  currentStep: number;
  /** 전체 마법사 단계 정의 */
  steps: WizardStep[];
  /** 단계별 사용자 입력 데이터 */
  wizardData: WizardData;
  
  /** 현재 단계 설정 */
  setCurrentStep: (step: number) => void;
  /** 단계별 질문 답변 업데이트 */
  updateStepData: (stepId: number, questionId: string, value: any) => void;
  /** 특정 단계의 데이터 조회 */
  getStepData: (stepId: number) => Record<string, any>;
  /** 단계 완료 여부 확인 (필수 질문 모두 답변 완료) */
  isStepCompleted: (stepId: number) => boolean;
  /** 다음 단계로 이동 */
  goToNextStep: () => void;
  /** 이전 단계로 이동 */
  goToPreviousStep: () => void;
  /** 마법사 초기화 */
  resetWizard: () => void;
}

/**
 * useWizardStore
 * 
 * 역할:
 * - 5단계 마법사의 상태 관리
 * - 사용자 입력 데이터 저장 및 검증
 * - 진행률 추적
 * 
 * 주요 기능:
 * 1. 단계별 질문 답변 관리
 * 2. 필수 질문 답변 검증
 * 3. 단계 간 네비게이션
 * 4. localStorage 자동 영속화
 */
export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      steps: wizardSteps,
      wizardData: {},

      /**
       * 현재 단계 설정
       * 
       * @param {number} step - 설정할 단계 번호 (1-5)
       */
      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      /**
       * 단계별 질문 답변 업데이트
       * - 기존 답변이 있으면 덮어쓰기
       * 
       * @param {number} stepId - 단계 ID
       * @param {string} questionId - 질문 ID
       * @param {any} value - 답변 값
       */
      updateStepData: (stepId: number, questionId: string, value: any) => {
        set((state) => ({
          wizardData: {
            ...state.wizardData,
            [stepId]: {
              ...state.wizardData[stepId],
              [questionId]: value,
            },
          },
        }));
      },

      /**
       * 특정 단계의 데이터 조회
       * 
       * @param {number} stepId - 단계 ID
       * @returns {Record<string, any>} 해당 단계의 답변 객체
       */
      getStepData: (stepId: number) => {
        const state = get();
        return state.wizardData[stepId] || {};
      },

      /**
       * 단계 완료 여부 확인
       * - 모든 필수 질문(required=true)에 답변이 있어야 완료
       * - 빈 문자열, null, undefined는 미완료로 처리
       * 
       * @param {number} stepId - 확인할 단계 ID
       * @returns {boolean} 완료 여부
       */
      isStepCompleted: (stepId: number) => {
        const state = get();
        const step = state.steps.find((s) => s.id === stepId);
        if (!step) return false;

        const stepData = state.wizardData[stepId] || {};
        const requiredQuestions = step.questions.filter((q) => q.required);

        return requiredQuestions.every((q) => {
          const value = stepData[q.id];
          if (value === undefined || value === null) return false;
          if (typeof value === 'string' && value.trim() === '') return false;
          return true;
        });
      },

      /**
       * 다음 단계로 이동
       * - 최대 단계를 초과하지 않음
       */
      goToNextStep: () => {
        set((state) => {
          const nextStep = Math.min(state.currentStep + 1, state.steps.length);
          return { currentStep: nextStep };
        });
      },

      /**
       * 이전 단계로 이동
       * - 최소 단계(1) 미만으로 가지 않음
       */
      goToPreviousStep: () => {
        set((state) => {
          const prevStep = Math.max(state.currentStep - 1, 1);
          return { currentStep: prevStep };
        });
      },

      /**
       * 마법사 초기화
       * - 첫 단계로 돌아가고 모든 데이터 삭제
       * - 새 프로젝트 시작 시 호출
       */
      resetWizard: () => {
        set({ currentStep: 1, wizardData: {} });
      },
    }),
    {
      name: 'wizard-storage',
    }
  )
);

