/**
 * 파일명: useFinancialStore.ts
 * 
 * 파일 용도:
 * 재무 시뮬레이션 데이터 및 계산을 위한 Zustand Store
 * - 재무 가정 입력 관리
 * - 핵심 재무 지표 자동 계산 (LTV, 손익분기점 등)
 * - 차트 데이터 생성
 * - localStorage에 자동 영속화
 * 
 * 호출 구조:
 * useFinancialStore (이 Store)
 *   ├─> updateInput() - FinancialSimulation에서 입력 값 변경 시 호출
 *   │   ├─> calculateMetrics() - 지표 재계산 트리거
 *   │   └─> generateChartData() - 차트 데이터 재생성 트리거
 *   ├─> calculateMetrics() - 내부 자동 호출
 *   ├─> generateChartData() - 내부 자동 호출
 *   └─> reset() - 기본값으로 초기화
 * 
 * 사용하는 컴포넌트:
 * - FinancialSimulation: 재무 시뮬레이션 UI (마법사 4단계)
 * 
 * 계산 로직:
 * - Revenue: 고객 수 × 객단가
 * - LTV: 객단가 × 평균 생애 개월 수
 * - LTV/CAC: LTV ÷ CAC (3 이상이 이상적)
 * - Break Even Point: 고정비 ÷ 공헌이익
 * - 12개월 손익 추이: 월 15% 성장률 가정
 * 
 * 영속화:
 * - localStorage 키: 'financial-storage'
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FinancialInput, FinancialMetrics, ChartDataPoint } from '../types';

interface FinancialState {
  /** 사용자 입력 값 */
  input: FinancialInput;
  /** 계산된 재무 지표 */
  metrics: FinancialMetrics | null;
  /** 차트용 12개월 데이터 */
  chartData: ChartDataPoint[];
  
  /** 입력 값 업데이트 (자동으로 지표 재계산) */
  updateInput: (input: Partial<FinancialInput>) => void;
  /** 재무 지표 계산 */
  calculateMetrics: () => void;
  /** 차트 데이터 생성 */
  generateChartData: () => void;
  /** 기본값으로 리셋 */
  reset: () => void;
}

/** 기본 입력 값 */
const defaultInput: FinancialInput = {
  customers: 1000,
  pricePerCustomer: 35000,
  cac: 50000,
  fixedCosts: 10000000,
  variableCostRate: 20,
  churnRate: 5,
};

/**
 * useFinancialStore
 * 
 * 역할:
 * - 재무 가정 입력 관리
 * - 핵심 재무 지표 자동 계산
 * - 손익분기점 분석 차트 데이터 생성
 * 
 * 주요 기능:
 * 1. 6가지 재무 가정 입력 (고객 수, 객단가, CAC, 고정비, 변동비율, 이탈률)
 * 2. 실시간 지표 계산 (Revenue, LTV, LTV/CAC, Break Even Point)
 * 3. 12개월 손익 추이 시뮬레이션 (월 15% 성장률 가정)
 * 4. localStorage 자동 영속화
 * 
 * 계산 공식:
 * - LTV = 객단가 × (100 / 이탈률)
 * - LTV/CAC Ratio = LTV ÷ CAC
 * - Break Even Point = 고정비 ÷ (객단가 × (1 - 변동비율/100))
 */
export const useFinancialStore = create<FinancialState>()(
  persist(
    (set, get) => ({
      input: defaultInput,
      metrics: null,
      chartData: [],

      /**
       * 입력 값 업데이트
       * - 입력이 변경되면 자동으로 지표 재계산 및 차트 재생성
       * 
       * @param {Partial<FinancialInput>} newInput - 업데이트할 필드들
       */
      updateInput: (newInput: Partial<FinancialInput>) => {
        set((state) => ({
          input: { ...state.input, ...newInput },
        }));
        get().calculateMetrics();
        get().generateChartData();
      },

      /**
       * 재무 지표 계산
       * 
       * 계산 항목:
       * - revenue: 월 매출 = 고객 수 × 객단가
       * - totalCosts: 총 비용 = 고정비 + 변동비
       * - profit: 이익 = 매출 - 총 비용
       * - ltv: 고객 생애가치 = 객단가 × 평균 생애 개월 수
       * - ltvCacRatio: LTV/CAC 비율
       * - breakEvenPoint: 손익분기점 고객 수
       */
      calculateMetrics: () => {
        const { input } = get();
        const { customers, pricePerCustomer, cac, fixedCosts, variableCostRate, churnRate } = input;

        // 월 매출 계산
        const monthlyRevenue = customers * pricePerCustomer;

        // 비용 계산 (고정비 + 변동비)
        const variableCosts = monthlyRevenue * (variableCostRate / 100);
        const totalCosts = fixedCosts + variableCosts;

        // 이익 계산
        const profit = monthlyRevenue - totalCosts;

        // LTV (고객 생애가치) 계산
        // 평균 생애 개월 수 = 100 / 이탈률 (%)
        // LTV = 객단가 × 평균 생애 개월 수
        const avgLifetimeMonths = churnRate > 0 ? 100 / churnRate : 20;
        const ltv = pricePerCustomer * avgLifetimeMonths;

        // LTV/CAC 비율 (3 이상이 이상적)
        const ltvCacRatio = cac > 0 ? ltv / cac : 0;

        // 손익분기점 (고객 수)
        const contributionMargin = pricePerCustomer * (1 - variableCostRate / 100);
        const breakEvenPoint = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;

        const metrics: FinancialMetrics = {
          revenue: monthlyRevenue,
          totalCosts,
          profit,
          ltv,
          ltvCacRatio,
          breakEvenPoint,
        };

        set({ metrics });
      },

      /**
       * 차트 데이터 생성
       * - 12개월간 손익 추이 시뮬레이션
       * - 월 15% 고객 성장률 가정
       * - 매출, 비용, 이익 추이 계산
       */
      generateChartData: () => {
        const { input } = get();
        const { customers, pricePerCustomer, fixedCosts, variableCostRate } = input;

        const data: ChartDataPoint[] = [];
        const growthRate = 1.15; // 월 15% 성장률 가정

        for (let month = 1; month <= 12; month++) {
          const monthlyCustomers = Math.floor(customers * Math.pow(growthRate, month - 1));
          const revenue = monthlyCustomers * pricePerCustomer;
          const variableCosts = revenue * (variableCostRate / 100);
          const costs = fixedCosts + variableCosts;
          const profit = revenue - costs;

          data.push({
            month,
            revenue,
            costs,
            profit,
          });
        }

        set({ chartData: data });
      },

      /**
       * 기본값으로 리셋
       */
      reset: () => {
        set({
          input: defaultInput,
          metrics: null,
          chartData: [],
        });
      },
    }),
    {
      name: 'financial-storage',
    }
  )
);

