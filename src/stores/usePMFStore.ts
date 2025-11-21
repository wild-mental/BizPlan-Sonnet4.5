/**
 * 파일명: usePMFStore.ts
 * 
 * 파일 용도:
 * Product-Market Fit 진단 데이터 및 분석을 위한 Zustand Store
 * - PMF 설문 답변 관리
 * - PMF 점수 계산
 * - 리스크 및 개선 제언 생성
 * - localStorage에 자동 영속화
 * 
 * 호출 구조:
 * usePMFStore (이 Store)
 *   ├─> updateAnswer() - PMFSurvey에서 답변 선택 시 호출
 *   ├─> generateReport() - 모든 질문 답변 후 리포트 생성
 *   └─> reset() - 초기화
 * 
 * 사용하는 컴포넌트:
 * - PMFSurvey: PMF 설문 및 결과 표시 (마법사 5단계)
 * 
 * 점수 체계:
 * - 10개 질문, 각 질문 1-5점 척도
 * - 평균 점수를 100점 만점으로 환산
 * - 점수 등급: excellent(85+), high(70-84), medium(50-69), low(50 미만)
 * 
 * 영속화:
 * - localStorage 키: 'pmf-storage'
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PMFAnswer, PMFReport } from '../types';
import { mockRisks, mockRecommendations } from '../types/mockData';

interface PMFState {
  /** 설문 답변 목록 */
  answers: PMFAnswer[];
  /** 생성된 진단 리포트 */
  report: PMFReport | null;
  
  /** 답변 업데이트 */
  updateAnswer: (questionId: string, value: number) => void;
  /** 진단 리포트 생성 */
  generateReport: () => void;
  /** 초기화 */
  reset: () => void;
}

/**
 * usePMFStore
 * 
 * 역할:
 * - PMF 설문 답변 관리
 * - PMF 점수 및 등급 계산
 * - 비즈니스 리스크 및 개선 제언 생성
 * 
 * 주요 기능:
 * 1. 10개 질문 답변 저장 (1-5점 척도)
 * 2. 평균 점수 계산 및 100점 환산
 * 3. 점수 기반 등급 판정
 * 4. 리스크 식별 및 개선 제언 제공
 * 5. localStorage 자동 영속화
 * 
 * 점수 등급:
 * - 85점 이상: excellent (PMF 달성)
 * - 70-84점: high (PMF 근접)
 * - 50-69점: medium (개선 필요)
 * - 50점 미만: low (재검토 필요)
 */
export const usePMFStore = create<PMFState>()(
  persist(
    (set, get) => ({
      answers: [],
      report: null,

      /**
       * 답변 업데이트
       * - 기존 답변이 있으면 업데이트, 없으면 추가
       * 
       * @param {string} questionId - 질문 ID
       * @param {number} value - 선택한 값 (1-5)
       */
      updateAnswer: (questionId: string, value: number) => {
        set((state) => {
          const existingIndex = state.answers.findIndex((a) => a.questionId === questionId);
          
          if (existingIndex >= 0) {
            const newAnswers = [...state.answers];
            newAnswers[existingIndex] = { questionId, value };
            return { answers: newAnswers };
          } else {
            return { answers: [...state.answers, { questionId, value }] };
          }
        });
      },

      /**
       * 진단 리포트 생성
       * 
       * 처리 순서:
       * 1. 전체 답변의 평균 점수 계산
       * 2. 평균을 100점 만점으로 환산
       * 3. 점수에 따른 등급 판정
       * 4. 리스크 및 개선 제언 필터링
       * 5. 리포트 객체 생성
       */
      generateReport: () => {
        const { answers } = get();
        
        // 평균 점수 계산 (1-5점 → 0-100점 환산)
        const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0);
        const averageScore = answers.length > 0 ? totalScore / answers.length : 0;
        const score = Math.round((averageScore / 5) * 100);

        // 등급 판정
        let level: 'low' | 'medium' | 'high' | 'excellent';
        if (score >= 85) level = 'excellent';
        else if (score >= 70) level = 'high';
        else if (score >= 50) level = 'medium';
        else level = 'low';

        // 점수 기반 리스크 및 개선 제언 필터링
        const risks = score < 70 ? mockRisks : mockRisks.slice(0, 2);
        const recommendations = mockRecommendations;

        const report: PMFReport = {
          score,
          level,
          risks,
          recommendations,
        };

        set({ report });
      },

      /**
       * 초기화
       * - 모든 답변 및 리포트 삭제
       */
      reset: () => {
        set({ answers: [], report: null });
      },
    }),
    {
      name: 'pmf-storage',
    }
  )
);

