/**
 * M.A.K.E.R.S AI 평가 데모 상태 관리 스토어
 */

import { create } from 'zustand';
import type { 
  BusinessPlanInput, 
  EvaluationResult, 
  EvaluationStep, 
  EvaluationArea 
} from '../types/evaluation';
import { EMPTY_BUSINESS_PLAN_INPUT } from '../types/evaluation';
import { simulateEvaluation } from '../utils/evaluationSimulator';

interface EvaluationState {
  // 입력 데이터
  businessPlanInput: BusinessPlanInput;
  
  // 평가 상태
  currentStep: EvaluationStep;
  isEvaluating: boolean;
  analyzingProgress: number;
  currentJuror: EvaluationArea | null;
  
  // 결과 데이터
  evaluationResult: EvaluationResult | null;
  
  // 액션
  setInput: (area: keyof BusinessPlanInput, field: string, value: string) => void;
  setFullInput: (input: BusinessPlanInput) => void;
  setStep: (step: EvaluationStep) => void;
  startEvaluation: () => Promise<void>;
  resetEvaluation: () => void;
}

export const useEvaluationStore = create<EvaluationState>((set, get) => ({
  // 초기 상태
  businessPlanInput: EMPTY_BUSINESS_PLAN_INPUT,
  currentStep: 'intro',
  isEvaluating: false,
  analyzingProgress: 0,
  currentJuror: null,
  evaluationResult: null,
  
  // 개별 입력 필드 업데이트
  setInput: (area, field, value) => {
    set((state) => ({
      businessPlanInput: {
        ...state.businessPlanInput,
        [area]: {
          ...state.businessPlanInput[area],
          [field]: value,
        },
      },
    }));
  },
  
  // 전체 입력 데이터 설정
  setFullInput: (input) => {
    set({ businessPlanInput: input });
  },
  
  // 단계 변경
  setStep: (step) => {
    set({ currentStep: step });
  },
  
  // 평가 시작
  startEvaluation: async () => {
    const { businessPlanInput } = get();
    
    set({ 
      isEvaluating: true, 
      currentStep: 'analyzing',
      analyzingProgress: 0,
      currentJuror: null,
    });
    
    // M.A.K.E.R.S 순서대로 분석 애니메이션
    const jurors: EvaluationArea[] = ['M', 'A', 'K', 'E', 'R', 'S'];
    
    for (let i = 0; i < jurors.length; i++) {
      set({ 
        currentJuror: jurors[i],
        analyzingProgress: Math.round(((i + 1) / jurors.length) * 100),
      });
      
      // 각 심사위원 분석 시간 (1초)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // 최종 평가 결과 생성
    const result = await simulateEvaluation(businessPlanInput);
    
    // 잠시 대기 후 결과 화면으로 이동
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set({
      isEvaluating: false,
      evaluationResult: result,
      currentStep: 'result',
      currentJuror: null,
    });
  },
  
  // 평가 초기화
  resetEvaluation: () => {
    set({
      businessPlanInput: EMPTY_BUSINESS_PLAN_INPUT,
      currentStep: 'intro',
      isEvaluating: false,
      analyzingProgress: 0,
      currentJuror: null,
      evaluationResult: null,
    });
  },
}));

