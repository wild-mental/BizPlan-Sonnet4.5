import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FinancialInput, FinancialMetrics, ChartDataPoint } from '../types';

interface FinancialState {
  input: FinancialInput;
  metrics: FinancialMetrics | null;
  chartData: ChartDataPoint[];
  
  updateInput: (input: Partial<FinancialInput>) => void;
  calculateMetrics: () => void;
  generateChartData: () => void;
  reset: () => void;
}

const defaultInput: FinancialInput = {
  customers: 1000,
  pricePerCustomer: 35000,
  cac: 50000,
  fixedCosts: 10000000,
  variableCostRate: 20,
  churnRate: 5,
};

export const useFinancialStore = create<FinancialState>()(
  persist(
    (set, get) => ({
      input: defaultInput,
      metrics: null,
      chartData: [],

      updateInput: (newInput: Partial<FinancialInput>) => {
        set((state) => ({
          input: { ...state.input, ...newInput },
        }));
        get().calculateMetrics();
        get().generateChartData();
      },

      calculateMetrics: () => {
        const { input } = get();
        const { customers, pricePerCustomer, cac, fixedCosts, variableCostRate, churnRate } = input;

        // Revenue
        const monthlyRevenue = customers * pricePerCustomer;

        // Costs
        const variableCosts = monthlyRevenue * (variableCostRate / 100);
        const totalCosts = fixedCosts + variableCosts;

        // Profit
        const profit = monthlyRevenue - totalCosts;

        // LTV (Lifetime Value)
        // LTV = ARPU * (1 / Churn Rate)
        const avgLifetimeMonths = churnRate > 0 ? 100 / churnRate : 20;
        const ltv = pricePerCustomer * avgLifetimeMonths;

        // LTV/CAC Ratio
        const ltvCacRatio = cac > 0 ? ltv / cac : 0;

        // Break Even Point (in customers)
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

      generateChartData: () => {
        const { input } = get();
        const { customers, pricePerCustomer, fixedCosts, variableCostRate } = input;

        const data: ChartDataPoint[] = [];
        const growthRate = 1.15; // 15% monthly growth

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

