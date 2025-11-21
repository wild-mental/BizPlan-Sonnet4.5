import { useEffect } from 'react';
import { useFinancialStore } from '../stores/useFinancialStore';

export const useFinancialCalc = () => {
  const { input, metrics, chartData, updateInput, calculateMetrics, generateChartData } = useFinancialStore();

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

