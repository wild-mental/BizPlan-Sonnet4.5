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
import { PMFAnswer, PMFReport, Risk, Recommendation } from '../types';

const DEFAULT_RISKS: Risk[] = [
  {
    id: 'risk-market-validation',
    title: '시장 검증 부족',
    description: '실제 고객 인터뷰와 유료 전환 의향 조사가 충분하지 않아 수요 불확실성이 존재합니다.',
    severity: 'high',
  },
  {
    id: 'risk-competition',
    title: '경쟁 대비 차별성 부족',
    description: '핵심 경쟁사 대비 기술/가격/유통 측면의 명확한 우위 포인트가 부족합니다.',
    severity: 'medium',
  },
  {
    id: 'risk-unit-economics',
    title: 'Unit Economics 불확실',
    description: 'CAC·LTV 가설이 경험적 데이터로 검증되지 않아 손익분기 달성 시점이 늦어질 수 있습니다.',
    severity: 'medium',
  },
  {
    id: 'risk-team-capacity',
    title: '팀 역량/리소스 제약',
    description: '핵심 역할(마케팅, 세일즈, 데이터)이 공석이거나 인력 계획이 지연되고 있습니다.',
    severity: 'low',
  },
];

const DEFAULT_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-landing-tests',
    title: '소규모 유료 랜딩 테스트',
    description: '타겟 고객 세그먼트별로 다른 가치제안/가격을 A/B 테스트하여 초기 유료 의향 데이터를 확보하세요.',
    priority: 'high',
  },
  {
    id: 'rec-problem-interviews',
    title: '문제·해결 인터뷰 10~15건 추가',
    description: '핵심 페르소나와 문제-해결 적합도를 검증하고, 결제 전환을 가로막는 Top3 장애요인을 파악하세요.',
    priority: 'high',
  },
  {
    id: 'rec-uni-eco',
    title: 'CAC/LTV 가설 정교화',
    description: '획득 채널별 CAC, 예상 ARPU, 리텐션을 데이터로 검증하고 LTV/CAC 목표(>3) 시나리오를 갱신하세요.',
    priority: 'medium',
  },
  {
    id: 'rec-roadmap',
    title: '90일 로드맵 재정의',
    description: '주요 마일스톤(신규 고객, 전환율, 재구매/리텐션)을 월 단위로 정의하고 리소스(인력/예산)를 재배분하세요.',
    priority: 'medium',
  },
];

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
        const risks = score < 70 ? DEFAULT_RISKS : DEFAULT_RISKS.slice(0, 2);
        const recommendations = DEFAULT_RECOMMENDATIONS;

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

