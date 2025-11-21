# [#003] useMemo를 계산 비용이 높은 값에 적용

## 📌 Status
`🔲 Todo`

## 🏷️ Labels
`performance` `optimization` `priority-1`

## 📝 Description

현재 계산 비용이 높은 값들이 매 렌더링마다 재계산되고 있습니다. useMemo를 사용하여 의존성이 변경될 때만 재계산하도록 최적화해야 합니다.

## 🎯 Goal

불필요한 계산을 방지하여 렌더링 성능을 향상시키고 CPU 사용량을 감소시킵니다.

## 📋 Tasks

### 1. Layout 컴포넌트

- [ ] `completedSteps` 계산에 useMemo 적용
- [ ] `progressPercentage` 계산에 useMemo 적용

### 2. FinancialSimulation 컴포넌트

- [ ] 재무 지표 계산 (`metrics`)에 useMemo 적용
- [ ] 차트 데이터 생성에 useMemo 적용
- [ ] BEP (손익분기점) 계산에 useMemo 적용

### 3. PMFSurvey 컴포넌트

- [ ] PMF 점수 계산에 useMemo 적용
- [ ] 리포트 데이터 생성에 useMemo 적용
- [ ] 진행률 계산에 useMemo 적용

### 4. WizardStep 컴포넌트

- [ ] 현재 단계 데이터 필터링에 useMemo 적용
- [ ] 단계 완료 상태 계산에 useMemo 적용

### 5. BusinessPlanViewer 컴포넌트

- [ ] 섹션별 완료도 계산에 useMemo 적용
- [ ] 마크다운 파싱 결과에 useMemo 적용 (필요시)

## 💡 Implementation Example

### Example 1: Layout 컴포넌트

#### Before

```typescript
// src/components/Layout.tsx
export const Layout: React.FC = () => {
  const { steps, isStepCompleted } = useWizardStore();
  
  // ❌ 매 렌더링마다 재계산
  const completedSteps = steps.filter((step) => isStepCompleted(step.id)).length;
  const progressPercentage = (completedSteps / steps.length) * 100;
  
  return (
    <div>
      <Progress value={progressPercentage} />
    </div>
  );
};
```

#### After

```typescript
// src/components/Layout.tsx
export const Layout: React.FC = () => {
  const { steps, isStepCompleted } = useWizardStore();
  
  // ✅ steps 또는 isStepCompleted가 변경될 때만 재계산
  const completedSteps = useMemo(
    () => steps.filter((step) => isStepCompleted(step.id)).length,
    [steps, isStepCompleted]
  );
  
  const progressPercentage = useMemo(
    () => (completedSteps / steps.length) * 100,
    [completedSteps, steps.length]
  );
  
  return (
    <div>
      <Progress value={progressPercentage} />
    </div>
  );
};
```

### Example 2: FinancialSimulation 컴포넌트

#### Before

```typescript
// src/components/wizard/FinancialSimulation.tsx
export const FinancialSimulation: React.FC = () => {
  const { input } = useFinancialStore();
  const { calculateMetrics } = useFinancialCalc();
  
  // ❌ 매 렌더링마다 복잡한 재무 계산 수행
  const metrics = calculateMetrics(input);
  const chartData = generateChartData(metrics, input);
  const bepMonths = calculateBEP(input);
  
  return (
    <div>
      <MetricsSummary metrics={metrics} />
      <Chart data={chartData} />
    </div>
  );
};
```

#### After

```typescript
// src/components/wizard/FinancialSimulation.tsx
export const FinancialSimulation: React.FC = () => {
  const { input } = useFinancialStore();
  const { calculateMetrics } = useFinancialCalc();
  
  // ✅ input이 변경될 때만 재계산
  const metrics = useMemo(
    () => calculateMetrics(input),
    [input, calculateMetrics]
  );
  
  const chartData = useMemo(
    () => generateChartData(metrics, input),
    [metrics, input]
  );
  
  const bepMonths = useMemo(
    () => calculateBEP(input),
    [input]
  );
  
  return (
    <div>
      <MetricsSummary metrics={metrics} />
      <Chart data={chartData} />
    </div>
  );
};
```

### Example 3: PMFSurvey 컴포넌트

```typescript
// src/components/wizard/PMFSurvey.tsx
export const PMFSurvey: React.FC = () => {
  const { responses, questions } = usePMFStore();
  
  // ✅ 응답이 변경될 때만 점수 재계산
  const pmfScore = useMemo(() => {
    const answeredCount = Object.keys(responses).length;
    if (answeredCount === 0) return 0;
    
    const totalScore = Object.values(responses).reduce((sum, value) => sum + value, 0);
    return (totalScore / (answeredCount * 5)) * 100;
  }, [responses]);
  
  const progress = useMemo(() => {
    return (Object.keys(responses).length / questions.length) * 100;
  }, [responses, questions.length]);
  
  return (
    <div>
      <Progress value={progress} />
      <Badge>{pmfScore.toFixed(1)}%</Badge>
    </div>
  );
};
```

## ⚠️ Considerations

1. **과도한 최적화 지양**: 간단한 계산은 useMemo 없이도 충분히 빠름
2. **의존성 배열 정확히 명시**: 잘못된 의존성은 버그의 원인
3. **객체/배열 생성 주의**: 의존성으로 객체를 사용하면 매번 재계산될 수 있음
4. **측정 후 적용**: React DevTools Profiler로 실제로 성능 문제가 있는지 확인

### 언제 useMemo를 사용해야 하는가?

✅ **사용하는 경우**:
- 복잡한 계산 (반복문, 필터링, 정렬 등)
- 대량의 데이터 처리
- 참조 동일성이 중요한 경우 (React.memo와 함께 사용)

❌ **사용하지 않는 경우**:
- 단순한 산술 연산
- 원시값 반환
- 이미 충분히 빠른 계산

## 🔗 Related Issues

- #001 - React.memo 적용
- #002 - useCallback 적용
- #008 - 복잡한 컴포넌트 분리 (계산 로직을 별도 Hook으로 분리)

## 📚 References

- [useMemo 공식 문서](https://react.dev/reference/react/useMemo)
- [When to useMemo](https://kentcdodds.com/blog/usememo-and-usecallback)
- [React Performance Optimization](https://react.dev/learn/render-and-commit#optimizing-performance)

## ✅ Acceptance Criteria

- [ ] 계산 비용이 높은 모든 값에 useMemo 적용
- [ ] 의존성 배열이 정확히 명시됨
- [ ] ESLint exhaustive-deps 경고 없음
- [ ] React DevTools Profiler로 성능 개선 확인
- [ ] 불필요한 재계산이 제거됨

## ⏱️ Estimated Time

**0.5일** (4시간)
- Layout & WizardStep: 1시간
- FinancialSimulation: 1.5시간
- PMFSurvey: 1시간
- BusinessPlanViewer: 0.5시간

## 👤 Assignee

_To be assigned_

## 📅 Timeline

- **Start Date**: 2025-11-22
- **Due Date**: 2025-11-23
- **Completed Date**: -

## 💬 Notes

이 작업은 #001, #002와 함께 적용하면 전반적인 성능 최적화 효과를 극대화할 수 있습니다.

