/**
 * M.A.K.E.R.S AI 평가 데모 상태 관리 스토어
 * - API 연동을 통한 평가 처리
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
import { evaluationApi, EvaluationRequest, EvaluationStatus, EvaluationResult as ApiEvaluationResult } from '../services/evaluationApi';

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
  
  // API 연동 상태
  evaluationId: string | null;
  status: EvaluationStatus | null;
  apiResult: ApiEvaluationResult | null;
  isLoading: boolean;
  isPolling: boolean;
  error: string | null;
  
  // 액션
  setInput: (area: keyof BusinessPlanInput, field: string, value: string) => void;
  setFullInput: (input: BusinessPlanInput) => void;
  setStep: (step: EvaluationStep) => void;
  startEvaluation: () => Promise<void>;
  startApiEvaluation: (projectId: string, evaluationType?: 'demo' | 'basic' | 'full') => Promise<string>;
  pollStatus: (evaluationId: string) => Promise<EvaluationStatus>;
  fetchResult: (evaluationId: string) => Promise<ApiEvaluationResult>;
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
  
  // API 연동 상태
  evaluationId: null,
  status: null,
  apiResult: null,
  isLoading: false,
  isPolling: false,
  error: null,
  
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
  
  // API 평가 시작
  startApiEvaluation: async (projectId: string, evaluationType: 'demo' | 'basic' | 'full' = 'demo') => {
    const { businessPlanInput } = get();
    set({ isLoading: true, error: null });
    
    try {
      const request: EvaluationRequest = {
        projectId,
        evaluationType,
        inputData: {
          businessName: businessPlanInput.basic.businessName || '',
          businessField: businessPlanInput.basic.businessField || '',
          targetMarket: businessPlanInput.market.targetMarket || '',
          problemStatement: businessPlanInput.problem.problemStatement || '',
          solutionSummary: businessPlanInput.solution.solutionSummary || '',
          differentiators: businessPlanInput.solution.differentiators || [],
          teamExperience: businessPlanInput.team.teamExperience || '',
          fundingGoal: businessPlanInput.finance.fundingGoal || 0,
        },
      };
      
      const response = await evaluationApi.create(request);
      if (response.data.success && response.data.data) {
        const { evaluationId } = response.data.data;
        set({ evaluationId, isLoading: false, isPolling: true });
        return evaluationId;
      }
      throw new Error('평가 시작 실패');
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || '평가를 시작할 수 없습니다',
        isLoading: false,
      });
      throw error;
    }
  },

  // 상태 폴링
  pollStatus: async (evaluationId: string) => {
    try {
      const response = await evaluationApi.getStatus(evaluationId);
      if (response.data.success && response.data.data) {
        const status = response.data.data;
        set({ status });
        
        if (status.status === 'completed') {
          set({ isPolling: false });
        }
        
        return status;
      }
      throw new Error('상태 조회 실패');
    } catch (error: any) {
      set({ error: error.response?.data?.error?.message });
      throw error;
    }
  },

  // 결과 조회
  fetchResult: async (evaluationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await evaluationApi.getResult(evaluationId);
      if (response.data.success && response.data.data) {
        const result = response.data.data;
        set({ apiResult: result, isLoading: false });
        return result;
      }
      throw new Error('결과 조회 실패');
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || '결과를 불러올 수 없습니다',
        isLoading: false,
      });
      throw error;
    }
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
      evaluationId: null,
      status: null,
      apiResult: null,
      isLoading: false,
      isPolling: false,
      error: null,
    });
  },
}));

