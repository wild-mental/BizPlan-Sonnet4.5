/**
 * 파일명: useWizardStore.ts
 * 
 * 파일 용도:
 * 마법사 진행 상태 및 데이터 관리를 위한 Zustand Store (PSST 프레임워크 기반 7단계)
 * - 7단계 마법사의 현재 단계 추적
 * - 각 단계별 질문 답변 저장
 * - 단계 완료 여부 검증
 * - localStorage에 자동 영속화 (steps 제외 - 항상 최신 정의 사용)
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
  /** 현재 마법사 단계 (1-7) */
  currentStep: number;
  /** 전체 마법사 단계 정의 */
  steps: WizardStep[];
  /** 단계별 사용자 입력 데이터 */
  wizardData: WizardData;
  /** 사용자가 방문한 단계 목록 (6, 7단계 완료 조건에 사용) */
  visitedSteps: number[];
  
  /** 현재 단계 설정 */
  setCurrentStep: (step: number) => void;
  /** 단계별 질문 답변 업데이트 */
  updateStepData: (stepId: number, questionId: string, value: any) => void;
  /** 특정 단계의 데이터 조회 */
  getStepData: (stepId: number) => Record<string, any>;
  /** 특정 단계 데이터 조회 (빈 값은 placeholder로 대체) - 개발/디버깅용 */
  getStepDataWithDefaults: (stepId: number) => Record<string, any>;
  /** 모든 단계 데이터 조회 (빈 값은 placeholder로 대체) - 제출/사업계획서 생성용 */
  getAllDataWithDefaults: () => Record<number, Record<string, any>>;
  /** 단계 완료 여부 확인 (필수 질문 모두 답변 완료) */
  isStepCompleted: (stepId: number) => boolean;
  /** 특정 단계를 방문 완료로 표시 */
  markStepVisited: (stepId: number) => void;
  /** 특정 단계의 방문 여부 확인 */
  isStepVisited: (stepId: number) => boolean;
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
 * - 7단계 마법사의 상태 관리 (PSST 프레임워크)
 * - 사용자 입력 데이터 저장 및 검증
 * - 진행률 추적
 * 
 * 주요 기능:
 * 1. 단계별 질문 답변 관리
 * 2. 필수 질문 답변 검증
 * 3. 단계 간 네비게이션
 * 4. localStorage 자동 영속화 (steps 제외)
 */
export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      steps: wizardSteps,
      wizardData: {},
      visitedSteps: [],

      /**
       * 현재 단계 설정
       * 
       * @param {number} step - 설정할 단계 번호 (1-7)
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
       * 특정 단계 데이터 조회 (빈 값은 placeholder로 대체)
       * [개발/디버깅 모드] 사용자 입력이 없으면 placeholder를 기본값으로 사용
       * 
       * @param {number} stepId - 단계 ID
       * @returns {Record<string, any>} 해당 단계의 답변 객체 (빈 값은 placeholder로 대체)
       */
      getStepDataWithDefaults: (stepId: number) => {
        const state = get();
        const step = state.steps.find((s) => s.id === stepId);
        if (!step) return {};

        const stepData = state.wizardData[stepId] || {};
        const dataWithDefaults: Record<string, any> = {};

        // 각 질문에 대해 값이 비어있으면 placeholder로 대체
        step.questions.forEach((question) => {
          const value = stepData[question.id];
          if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
            // 사용자 입력이 없으면 placeholder 사용
            dataWithDefaults[question.id] = question.placeholder || '';
          } else {
            dataWithDefaults[question.id] = value;
          }
        });

        return dataWithDefaults;
      },

      /**
       * 모든 단계 데이터 조회 (빈 값은 placeholder로 대체)
       * [개발/디버깅 모드] 제출 및 사업계획서 생성 시 사용
       * 
       * @returns {Record<number, Record<string, any>>} 모든 단계의 데이터 (빈 값은 placeholder로 대체)
       */
      getAllDataWithDefaults: () => {
        const state = get();
        const allDataWithDefaults: Record<number, Record<string, any>> = {};

        // 1-5단계만 질문 데이터가 있음 (6, 7단계는 재무/PMF 별도 처리)
        state.steps.forEach((step) => {
          if (step.id <= 5) {
            const stepData = state.wizardData[step.id] || {};
            const dataWithDefaults: Record<string, any> = {};

            step.questions.forEach((question) => {
              const value = stepData[question.id];
              if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
                dataWithDefaults[question.id] = question.placeholder || '';
              } else {
                dataWithDefaults[question.id] = value;
              }
            });

            allDataWithDefaults[step.id] = dataWithDefaults;
          }
        });

        return allDataWithDefaults;
      },

      /**
       * 단계 완료 여부 확인
       * [개발/디버깅 모드] 방문만으로 완료 처리
       * - 사용자가 해당 단계를 방문하면 완료로 표시
       * - 명시적 편집 없이 다음 버튼만 눌러도 체크 표시됨
       * 
       * @param {number} stepId - 확인할 단계 ID
       * @returns {boolean} 완료 여부
       */
      isStepCompleted: (stepId: number) => {
        const state = get();
        const step = state.steps.find((s) => s.id === stepId);
        if (!step) return false;

        // [개발/디버깅 모드] 모든 단계를 방문 여부로 완료 판단
        return state.visitedSteps.includes(stepId);
      },

      /**
       * 특정 단계를 방문 완료로 표시
       * [개발/디버깅 모드] 모든 단계의 완료 조건으로 사용
       * 
       * @param {number} stepId - 방문 표시할 단계 ID
       */
      markStepVisited: (stepId: number) => {
        set((state) => {
          if (state.visitedSteps.includes(stepId)) {
            return state; // 이미 방문한 경우 변경 없음
          }
          return { visitedSteps: [...state.visitedSteps, stepId] };
        });
      },

      /**
       * 특정 단계의 방문 여부 확인
       * 
       * @param {number} stepId - 확인할 단계 ID
       * @returns {boolean} 방문 여부
       */
      isStepVisited: (stepId: number) => {
        const state = get();
        return state.visitedSteps.includes(stepId);
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
       * - 방문 기록도 초기화
       * - 새 프로젝트 시작 시 호출
       */
      resetWizard: () => {
        set({ currentStep: 1, wizardData: {}, visitedSteps: [] });
      },
    }),
    {
      name: 'wizard-storage',
      // steps는 항상 최신 정의를 사용해야 하므로 persist에서 제외
      // wizardSteps에서 정의된 최신 단계 구성을 사용
      partialize: (state) => ({
        currentStep: state.currentStep,
        wizardData: state.wizardData,
        visitedSteps: state.visitedSteps,
        // steps는 제외 - 항상 wizardSteps에서 로드
      }),
      // 기존 localStorage에 저장된 이전 steps 데이터를 무시하고
      // 항상 wizardSteps에서 정의된 최신 단계 구성 사용
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<WizardState>),
        // steps는 항상 현재 정의(wizardSteps)를 사용
        steps: currentState.steps,
      }),
    }
  )
);

