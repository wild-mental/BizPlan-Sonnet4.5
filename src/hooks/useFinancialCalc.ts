/**
 * 파일명: useFinancialCalc.ts
 * 
 * 파일 용도:
 * 재무 계산 기능을 제공하는 Custom Hook
 * - useFinancialStore의 래퍼 Hook
 * - 컴포넌트 마운트 시 자동으로 지표 계산 및 차트 데이터 생성
 * 
 * 호출 구조:
 * useFinancialCalc (이 Hook)
 *   └─> useFinancialStore
 *       ├─> calculateMetrics() - 재무 지표 계산
 *       └─> generateChartData() - 차트 데이터 생성
 * 
 * 사용하는 컴포넌트:
 * - (현재 미사용, FinancialSimulation에서 직접 useFinancialStore 사용)
 * 
 * 역할:
 * - useFinancialStore의 주요 기능을 편리하게 사용
 * - 초기 마운트 시 계산 트리거
 * 
 * 주의:
 * - 현재는 사용되지 않는 Hook
 * - FinancialSimulation 컴포넌트에서 직접 useFinancialStore 사용 중
 */

import { useEffect } from 'react';
import { useFinancialStore } from '../stores/useFinancialStore';

/**
 * useFinancialCalc Hook
 * 
 * 역할:
 * - 재무 계산 기능을 편리하게 사용
 * - 컴포넌트 마운트 시 자동 계산
 * 
 * @returns {Object} 재무 데이터 및 함수
 * @returns {FinancialInput} input - 입력 값
 * @returns {FinancialMetrics} metrics - 계산된 지표
 * @returns {ChartDataPoint[]} chartData - 차트 데이터
 * @returns {Function} updateInput - 입력 업데이트 함수
 */
export const useFinancialCalc = () => {
  const { input, metrics, chartData, updateInput, calculateMetrics, generateChartData } = useFinancialStore();

  // 컴포넌트 마운트 시 지표 계산 및 차트 데이터 생성
  useEffect(() => {
    calculateMetrics();
    generateChartData();
  }, [calculateMetrics, generateChartData]);

  return {
    input,
    metrics,
    chartData,
    updateInput,
  };
};

