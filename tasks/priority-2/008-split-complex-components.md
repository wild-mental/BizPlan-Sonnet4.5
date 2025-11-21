# [#008] 복잡한 컴포넌트 분리

## 📌 Status
`🔲 Todo`

## 🏷️ Labels
`refactoring` `maintainability` `priority-2`

## 📝 Description

일부 컴포넌트가 너무 많은 책임을 가지고 있어 가독성과 유지보수성이 저하되고 있습니다. 특히 `FinancialSimulation`과 `PMFSurvey` 컴포넌트를 더 작은 단위로 분리해야 합니다.

## 🎯 Goal

복잡한 컴포넌트를 논리적 단위로 분리하여 **가독성 30% 향상** 및 개별 컴포넌트의 재사용성을 높입니다.

## 📋 Tasks

### 1. FinancialSimulation 컴포넌트 분리

- [ ] `FinancialInputForm.tsx` - 입력 폼 부분
- [ ] `MetricsSummary.tsx` - 지표 요약 카드
- [ ] `BEPChart.tsx` - 손익분기점 차트
- [ ] `UnitEconomicsChart.tsx` - Unit Economics 차트
- [ ] `FinancialInsights.tsx` - 인사이트 및 권장사항

### 2. PMFSurvey 컴포넌트 분리

- [ ] `PMFQuestionCard.tsx` - 개별 질문 카드
- [ ] `PMFScoreDisplay.tsx` - 점수 표시
- [ ] `PMFReport.tsx` - 진단 리포트
- [ ] `PMFInsights.tsx` - 인사이트 및 권장사항

### 3. BusinessPlanViewer 컴포넌트 분리

- [ ] `SectionList.tsx` - 섹션 목록
- [ ] `SectionContent.tsx` - 섹션 내용 표시
- [ ] `GenerationControls.tsx` - 생성/재생성 컨트롤

### 4. 디렉토리 구조 정리

- [ ] 관련 컴포넌트들을 서브 디렉토리로 그룹화
- [ ] index.ts 파일로 export 정리

## 💡 Implementation Example

### Example 1: FinancialSimulation 분리

#### Before (300+ 줄의 단일 파일)

```typescript
// src/components/wizard/FinancialSimulation.tsx
export const FinancialSimulation: React.FC = () => {
  const { input, updateInput } = useFinancialStore();
  const { calculateMetrics } = useFinancialCalc();
  
  // 입력 핸들러
  const handleInputChange = (field: string, value: number) => { /* ... */ };
  
  // 지표 계산
  const metrics = calculateMetrics(input);
  const bepData = generateBEPData(input);
  const unitEconomicsData = generateUnitEconomicsData(input);
  
  return (
    <div className="space-y-8">
      {/* 입력 폼 - 100+ 줄 */}
      <Card>
        <CardHeader>
          <CardTitle>기본 정보 입력</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* 많은 입력 필드들... */}
          </div>
        </CardContent>
      </Card>

      {/* 지표 요약 - 50+ 줄 */}
      <div className="grid grid-cols-4 gap-4">
        {/* 지표 카드들... */}
      </div>

      {/* 차트들 - 100+ 줄 */}
      <Card>
        {/* BEP 차트 */}
      </Card>
      <Card>
        {/* Unit Economics 차트 */}
      </Card>
    </div>
  );
};
```

#### After (분리된 구조)

```typescript
// src/components/wizard/financial/index.ts
export { FinancialSimulation } from './FinancialSimulation';
export { FinancialInputForm } from './FinancialInputForm';
export { MetricsSummary } from './MetricsSummary';
export { BEPChart } from './BEPChart';
export { UnitEconomicsChart } from './UnitEconomicsChart';

// src/components/wizard/financial/FinancialSimulation.tsx (주 컴포넌트)
import React from 'react';
import { FinancialInputForm } from './FinancialInputForm';
import { MetricsSummary } from './MetricsSummary';
import { BEPChart } from './BEPChart';
import { UnitEconomicsChart } from './UnitEconomicsChart';
import { FinancialInsights } from './FinancialInsights';
import { useFinancialStore } from '../../../stores/useFinancialStore';
import { useChartData } from '../../../hooks/useChartData';

export const FinancialSimulation: React.FC = () => {
  const { input } = useFinancialStore();
  const { bepData, unitEconomicsData, metrics } = useChartData(input);

  return (
    <div className="space-y-8">
      <FinancialInputForm />
      <MetricsSummary metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BEPChart data={bepData} />
        <UnitEconomicsChart data={unitEconomicsData} />
      </div>

      <FinancialInsights metrics={metrics} />
    </div>
  );
};

// src/components/wizard/financial/FinancialInputForm.tsx
import React, { useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { useFinancialStore } from '../../../stores/useFinancialStore';

export const FinancialInputForm: React.FC = React.memo(() => {
  const { input, updateInput } = useFinancialStore();

  const handleChange = useCallback((field: keyof FinancialInput, value: number) => {
    updateInput({ [field]: value });
  }, [updateInput]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>💰 기본 정보 입력</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="월 예상 사용자 수"
            type="number"
            value={input.monthlyUsers}
            onChange={(e) => handleChange('monthlyUsers', Number(e.target.value))}
            placeholder="예: 1000"
          />
          <Input
            label="평균 객단가 (원)"
            type="number"
            value={input.avgTicket}
            onChange={(e) => handleChange('avgTicket', Number(e.target.value))}
            placeholder="예: 50000"
          />
          {/* 나머지 입력 필드들... */}
        </div>
      </CardContent>
    </Card>
  );
});

FinancialInputForm.displayName = 'FinancialInputForm';

// src/components/wizard/financial/MetricsSummary.tsx
import React from 'react';
import { Card, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { TrendingUp, DollarSign, Target, Calendar } from 'lucide-react';

interface MetricsSummaryProps {
  metrics: {
    monthlyRevenue: number;
    grossMargin: number;
    ltvCacRatio: number;
    monthsToRecover: number;
  };
}

export const MetricsSummary: React.FC<MetricsSummaryProps> = React.memo(({ metrics }) => {
  const getMarginColor = (margin: number) => {
    if (margin >= 70) return 'bg-green-100 text-green-800';
    if (margin >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getLtvCacColor = (ratio: number) => {
    if (ratio >= 3) return 'bg-green-100 text-green-800';
    if (ratio >= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">월 예상 매출</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.monthlyRevenue.toLocaleString()}원
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-primary-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gross Margin</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.grossMargin.toFixed(1)}%
                </p>
                <Badge className={getMarginColor(metrics.grossMargin)}>
                  {metrics.grossMargin >= 70 ? '우수' : metrics.grossMargin >= 40 ? '보통' : '개선필요'}
                </Badge>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">LTV/CAC Ratio</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.ltvCacRatio.toFixed(1)}x
                </p>
                <Badge className={getLtvCacColor(metrics.ltvCacRatio)}>
                  {metrics.ltvCacRatio >= 3 ? '우수' : metrics.ltvCacRatio >= 2 ? '보통' : '개선필요'}
                </Badge>
              </div>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">CAC 회수 기간</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.monthsToRecover.toFixed(1)}개월
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

MetricsSummary.displayName = 'MetricsSummary';

// src/components/wizard/financial/BEPChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';

interface BEPChartProps {
  data: Array<{
    units: number;
    revenue: number;
    cost: number;
    profit: number;
  }>;
}

export const BEPChart: React.FC<BEPChartProps> = React.memo(({ data }) => {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 손익분기점 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            데이터를 입력하면 차트가 표시됩니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  const bepPoint = data.find((d) => d.profit >= 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 손익분기점 분석 (BEP)</CardTitle>
        {bepPoint && (
          <p className="text-sm text-gray-600 mt-2">
            손익분기점: <strong>{bepPoint.units}개</strong>
          </p>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="units" 
              label={{ value: '판매 수량', position: 'insideBottom', offset: -5 }} 
            />
            <YAxis 
              label={{ value: '금액 (원)', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip 
              formatter={(value: number) => value.toLocaleString() + '원'}
              labelFormatter={(label) => `수량: ${label}개`}
            />
            <Legend />
            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              name="매출" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="cost" 
              stroke="#ef4444" 
              name="비용" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

BEPChart.displayName = 'BEPChart';

// src/components/wizard/financial/UnitEconomicsChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';

interface UnitEconomicsChartProps {
  data: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
}

export const UnitEconomicsChart: React.FC<UnitEconomicsChartProps> = React.memo(({ data }) => {
  if (data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📈 Unit Economics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            CAC와 LTV를 입력하면 차트가 표시됩니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  const ratio = data.find((d) => d.name === 'LTV')?.value / data.find((d) => d.name === 'CAC')?.value || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 Unit Economics</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          LTV/CAC 비율: <strong>{ratio.toFixed(2)}x</strong>
          {ratio >= 3 && <span className="text-green-600 ml-2">✓ 우수</span>}
          {ratio >= 2 && ratio < 3 && <span className="text-yellow-600 ml-2">⚠ 보통</span>}
          {ratio < 2 && <span className="text-red-600 ml-2">✗ 개선 필요</span>}
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: '금액 (원)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => value.toLocaleString() + '원'} />
            <Legend />
            <Bar dataKey="value" name="금액">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

UnitEconomicsChart.displayName = 'UnitEconomicsChart';

// src/components/wizard/financial/FinancialInsights.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface FinancialInsightsProps {
  metrics: {
    grossMargin: number;
    ltvCacRatio: number;
    monthsToRecover: number;
  };
}

export const FinancialInsights: React.FC<FinancialInsightsProps> = React.memo(({ metrics }) => {
  const insights = [];

  // Gross Margin 인사이트
  if (metrics.grossMargin >= 70) {
    insights.push({
      type: 'success',
      icon: CheckCircle,
      message: 'Gross Margin이 우수합니다. 높은 수익성을 유지하고 있습니다.',
    });
  } else if (metrics.grossMargin < 40) {
    insights.push({
      type: 'warning',
      icon: AlertCircle,
      message: 'Gross Margin이 낮습니다. 가격 인상 또는 비용 절감을 고려하세요.',
    });
  }

  // LTV/CAC 인사이트
  if (metrics.ltvCacRatio >= 3) {
    insights.push({
      type: 'success',
      icon: CheckCircle,
      message: 'LTV/CAC 비율이 우수합니다. 마케팅 투자를 늘려도 좋습니다.',
    });
  } else if (metrics.ltvCacRatio < 2) {
    insights.push({
      type: 'warning',
      icon: AlertCircle,
      message: 'LTV/CAC 비율이 낮습니다. 고객 유지율을 높이거나 CAC를 낮추세요.',
    });
  }

  // CAC 회수 기간 인사이트
  if (metrics.monthsToRecover > 12) {
    insights.push({
      type: 'warning',
      icon: AlertCircle,
      message: 'CAC 회수 기간이 깁니다. 현금 흐름에 주의가 필요합니다.',
    });
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>💡 인사이트 및 권장사항</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            const colorClass = insight.type === 'success' 
              ? 'text-green-600 bg-green-50 border-green-200' 
              : 'text-yellow-600 bg-yellow-50 border-yellow-200';

            return (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 rounded-lg border ${colorClass}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{insight.message}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});

FinancialInsights.displayName = 'FinancialInsights';
```

---

### Example 2: PMFSurvey 분리

```typescript
// src/components/wizard/pmf/index.ts
export { PMFSurvey } from './PMFSurvey';
export { PMFQuestionCard } from './PMFQuestionCard';
export { PMFScoreDisplay } from './PMFScoreDisplay';
export { PMFReport } from './PMFReport';

// src/components/wizard/pmf/PMFSurvey.tsx (주 컴포넌트)
import React from 'react';
import { PMFQuestionCard } from './PMFQuestionCard';
import { PMFScoreDisplay } from './PMFScoreDisplay';
import { PMFReport } from './PMFReport';
import { usePMFStore } from '../../../stores/usePMFStore';
import { Progress } from '../../ui/Progress';

export const PMFSurvey: React.FC = () => {
  const { questions, responses, updateResponse, pmfScore } = usePMFStore();
  const progress = (Object.keys(responses).length / questions.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PMFScoreDisplay score={pmfScore} />
        <div className="text-sm text-gray-600">
          {Object.keys(responses).length} / {questions.length} 완료
        </div>
      </div>

      <Progress value={progress} />

      <div className="space-y-4">
        {questions.map((question) => (
          <PMFQuestionCard
            key={question.id}
            question={question}
            value={responses[question.id]}
            onChange={(value) => updateResponse(question.id, value)}
          />
        ))}
      </div>

      {progress === 100 && <PMFReport score={pmfScore} />}
    </div>
  );
};

// src/components/wizard/pmf/PMFQuestionCard.tsx
import React from 'react';
import { Card, CardContent } from '../../ui/Card';
import { cn } from '../../../lib/utils';

interface PMFQuestionCardProps {
  question: {
    id: string;
    text: string;
  };
  value?: number;
  onChange: (value: number) => void;
}

export const PMFQuestionCard: React.FC<PMFQuestionCardProps> = React.memo(({
  question,
  value,
  onChange,
}) => {
  const options = [
    { value: 1, label: '전혀 아니다' },
    { value: 2, label: '아니다' },
    { value: 3, label: '보통이다' },
    { value: 4, label: '그렇다' },
    { value: 5, label: '매우 그렇다' },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <p className="font-medium text-gray-900 mb-4">{question.text}</p>
        <div className="flex gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={cn(
                'flex-1 py-3 px-2 text-sm font-medium rounded-lg border-2 transition-all',
                value === option.value
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              )}
            >
              <div className="text-lg font-bold">{option.value}</div>
              <div className="text-xs mt-1">{option.label}</div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

PMFQuestionCard.displayName = 'PMFQuestionCard';
```

## 📁 New Directory Structure

```
src/
└── components/
    └── wizard/
        ├── financial/              (NEW)
        │   ├── index.ts
        │   ├── FinancialSimulation.tsx
        │   ├── FinancialInputForm.tsx
        │   ├── MetricsSummary.tsx
        │   ├── BEPChart.tsx
        │   ├── UnitEconomicsChart.tsx
        │   └── FinancialInsights.tsx
        ├── pmf/                    (NEW)
        │   ├── index.ts
        │   ├── PMFSurvey.tsx
        │   ├── PMFQuestionCard.tsx
        │   ├── PMFScoreDisplay.tsx
        │   └── PMFReport.tsx
        └── business-plan/          (NEW)
            ├── index.ts
            ├── BusinessPlanViewer.tsx
            ├── SectionList.tsx
            ├── SectionContent.tsx
            └── GenerationControls.tsx
```

## ⚠️ Considerations

1. **단일 책임 원칙**: 각 컴포넌트는 하나의 명확한 역할만 수행
2. **Props 인터페이스**: 명확하고 타입 안전한 Props 정의
3. **React.memo 적용**: 분리된 컴포넌트들에 성능 최적화 적용
4. **index.ts 활용**: 깔끔한 import 경로 유지
5. **테스트 용이성**: 작은 컴포넌트는 테스트하기 쉬움

## 🔗 Related Issues

- #001 - React.memo 적용 (분리된 컴포넌트들에 적용)
- #005 - 중복 코드 제거
- #007 - Custom Hook 추가 (useChartData 등)

## 📚 References

- [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle)
- [Component Composition](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)

## ✅ Acceptance Criteria

- [ ] FinancialSimulation이 5-6개의 작은 컴포넌트로 분리됨
- [ ] PMFSurvey가 3-4개의 작은 컴포넌트로 분리됨
- [ ] BusinessPlanViewer가 3개의 작은 컴포넌트로 분리됨
- [ ] 각 컴포넌트가 150줄 이하로 유지됨
- [ ] Props가 명확히 정의되고 타입 안전함
- [ ] 분리된 컴포넌트들에 React.memo 적용
- [ ] index.ts로 export 정리
- [ ] 기존 기능이 모두 정상 작동

## ⏱️ Estimated Time

**3일** (24시간)
- FinancialSimulation 분리: 8시간
- PMFSurvey 분리: 6시간
- BusinessPlanViewer 분리: 4시간
- 디렉토리 구조 정리: 2시간
- 테스트 및 검증: 4시간

## 👤 Assignee

_To be assigned_

## 📅 Timeline

- **Start Date**: TBD
- **Due Date**: TBD
- **Completed Date**: -

## 💬 Notes

이 작업은 코드베이스의 가독성을 크게 향상시키고, 향후 기능 추가 및 수정을 훨씬 쉽게 만듭니다. 시간이 걸리더라도 신중하게 진행하는 것이 좋습니다.

