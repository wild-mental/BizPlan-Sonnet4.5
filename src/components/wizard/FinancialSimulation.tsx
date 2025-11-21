import React from 'react';
import { useFinancialStore } from '../../stores/useFinancialStore';
import { Input, Badge } from '../ui';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatNumber } from '../../lib/utils';
import { AlertCircle, TrendingUp, Target, DollarSign } from 'lucide-react';

export const FinancialSimulation: React.FC = () => {
  const { input, metrics, chartData, updateInput } = useFinancialStore();

  React.useEffect(() => {
    // Initialize if needed
    if (!metrics) {
      updateInput({});
    }
  }, [metrics, updateInput]);

  const handleInputChange = (field: keyof typeof input, value: number) => {
    updateInput({ [field]: value });
  };

  const ltvCacWarning = metrics && metrics.ltvCacRatio < 3;

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">재무 가정 입력</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="예상 고객 수"
            value={input.customers}
            onChange={(e) => handleInputChange('customers', parseInt(e.target.value) || 0)}
            helperText="월간 예상 고객 수"
          />
          <Input
            type="number"
            label="객단가 (원)"
            value={input.pricePerCustomer}
            onChange={(e) => handleInputChange('pricePerCustomer', parseInt(e.target.value) || 0)}
            helperText="고객 1인당 월 평균 매출"
          />
          <Input
            type="number"
            label="CAC (원)"
            value={input.cac}
            onChange={(e) => handleInputChange('cac', parseInt(e.target.value) || 0)}
            helperText="고객 획득 비용"
          />
          <Input
            type="number"
            label="고정비 (원)"
            value={input.fixedCosts}
            onChange={(e) => handleInputChange('fixedCosts', parseInt(e.target.value) || 0)}
            helperText="월간 고정 비용"
          />
          <Input
            type="number"
            label="변동비율 (%)"
            value={input.variableCostRate}
            onChange={(e) => handleInputChange('variableCostRate', parseInt(e.target.value) || 0)}
            helperText="매출 대비 변동비 비율"
          />
          <Input
            type="number"
            label="이탈률 (%)"
            value={input.churnRate}
            onChange={(e) => handleInputChange('churnRate', parseInt(e.target.value) || 0)}
            helperText="월간 고객 이탈률"
          />
        </div>
      </div>

      {/* Metrics Summary */}
      {metrics && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">핵심 지표</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">월 매출</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {formatCurrency(metrics.revenue)}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">LTV</span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(metrics.ltv)}
              </div>
            </div>

            <div className={`rounded-lg p-4 ${ltvCacWarning ? 'bg-red-50' : 'bg-green-50'}`}>
              <div className={`flex items-center gap-2 mb-2 ${ltvCacWarning ? 'text-red-600' : 'text-green-600'}`}>
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">LTV/CAC</span>
              </div>
              <div className={`text-2xl font-bold ${ltvCacWarning ? 'text-red-900' : 'text-green-900'}`}>
                {metrics.ltvCacRatio.toFixed(1)}x
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">손익분기점</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {formatNumber(metrics.breakEvenPoint)}명
              </div>
            </div>
          </div>

          {ltvCacWarning && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-red-900 mb-1">수익성 경고</div>
                <p className="text-sm text-red-700">
                  LTV/CAC 비율이 3 미만입니다. 고객 획득 비용을 낮추거나 고객 생애가치를 높이는 전략이 필요합니다.
                  건강한 비즈니스 모델은 일반적으로 3 이상의 비율을 유지합니다.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Break Even Chart */}
      {chartData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">손익분기점 분석 (12개월)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                label={{ value: '월', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                label={{ value: '금액 (백만원)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `${label}개월차`}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="매출" strokeWidth={2} />
              <Line type="monotone" dataKey="costs" stroke="#ef4444" name="비용" strokeWidth={2} />
              <Line type="monotone" dataKey="profit" stroke="#10b981" name="이익" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Unit Economics */}
      {metrics && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Unit Economics</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { name: 'LTV', value: metrics.ltv },
              { name: 'CAC', value: input.cac },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-2 text-center">
            이상적인 비율: LTV ≥ 3 × CAC
          </p>
        </div>
      )}
    </div>
  );
};

