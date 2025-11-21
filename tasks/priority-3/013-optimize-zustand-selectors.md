# [#013] Zustand Selector 패턴 적용

## 📌 Status
`🔲 Todo`

## 🏷️ Labels
`performance` `optimization` `state-management` `priority-3`

## 📝 Description

현재 컴포넌트들이 Zustand store에서 필요한 것보다 많은 상태를 구독하고 있어 불필요한 리렌더링이 발생할 수 있습니다. Selector 패턴을 적용하여 필요한 상태만 구독하도록 최적화해야 합니다.

## 🎯 Goal

Store 관련 불필요한 리렌더링을 **50% 이상 감소**시켜 전반적인 애플리케이션 성능을 향상시킵니다.

## 📋 Tasks

### 1. 현재 Store 사용 패턴 분석

- [ ] 각 컴포넌트가 구독하는 상태 파악
- [ ] 불필요한 구독 식별
- [ ] 리렌더링 빈도 측정

### 2. Selector 패턴 적용

- [ ] useWizardStore에서 Selector 사용
- [ ] useProjectStore에서 Selector 사용
- [ ] useFinancialStore에서 Selector 사용
- [ ] usePMFStore에서 Selector 사용

### 3. 커스텀 Selector Hook 생성

- [ ] 자주 사용되는 Selector를 Hook으로 추출
- [ ] Memoized Selector 구현

### 4. Shallow Compare 활용

- [ ] 여러 상태를 동시에 구독할 때 최적화
- [ ] zustand/shallow import 및 사용

### 5. 성능 측정

- [ ] React DevTools Profiler로 Before/After 비교
- [ ] 리렌더링 횟수 측정 및 문서화

## 💡 Implementation Example

### Example 1: 기본 Selector 패턴

#### Before (전체 구독)

```typescript
// ❌ Store의 모든 상태를 구독 - 불필요한 리렌더링 발생
import { useWizardStore } from '../stores/useWizardStore';

export const StepProgress: React.FC = () => {
  // 전체 store를 구독
  const store = useWizardStore();
  
  // 실제로는 steps와 currentStep만 필요
  return (
    <div>
      Current: {store.currentStep} / {store.steps.length}
    </div>
  );
};

// 문제: wizardData가 변경될 때도 이 컴포넌트가 리렌더링됨
```

#### After (Selector 사용)

```typescript
// ✅ 필요한 상태만 선택적으로 구독
import { useWizardStore } from '../stores/useWizardStore';

export const StepProgress: React.FC = () => {
  // 필요한 것만 구독
  const currentStep = useWizardStore((state) => state.currentStep);
  const totalSteps = useWizardStore((state) => state.steps.length);
  
  return (
    <div>
      Current: {currentStep} / {totalSteps}
    </div>
  );
};

// 장점: wizardData가 변경되어도 이 컴포넌트는 리렌더링되지 않음
```

---

### Example 2: 여러 상태 구독 (Shallow Compare)

#### Before

```typescript
// ❌ 각각 구독하면 코드가 길어짐
import { useWizardStore } from '../stores/useWizardStore';

export const WizardHeader: React.FC = () => {
  const currentStep = useWizardStore((state) => state.currentStep);
  const steps = useWizardStore((state) => state.steps);
  const goToNextStep = useWizardStore((state) => state.goToNextStep);
  const goToPreviousStep = useWizardStore((state) => state.goToPreviousStep);
  
  // ...
};
```

#### After (Shallow Compare)

```typescript
// ✅ Shallow compare로 여러 상태를 효율적으로 구독
import { useWizardStore } from '../stores/useWizardStore';
import { shallow } from 'zustand/shallow';

export const WizardHeader: React.FC = () => {
  const { currentStep, steps, goToNextStep, goToPreviousStep } = useWizardStore(
    (state) => ({
      currentStep: state.currentStep,
      steps: state.steps,
      goToNextStep: state.goToNextStep,
      goToPreviousStep: state.goToPreviousStep,
    }),
    shallow
  );
  
  // ...
};

// 장점: 
// 1. 코드가 간결함
// 2. 선택한 값들이 변경될 때만 리렌더링
// 3. 객체 참조가 아닌 값 비교
```

---

### Example 3: Computed Value (Memoized Selector)

```typescript
// src/stores/useWizardStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WizardState {
  currentStep: number;
  steps: WizardStep[];
  wizardData: WizardData;
  
  // Actions
  setCurrentStep: (step: number) => void;
  updateStepData: (stepId: number, questionId: string, value: any) => void;
  getStepData: (stepId: number) => Record<string, any>;
  isStepCompleted: (stepId: number) => boolean;
  
  // ✅ Computed values (Selectors)
  getProgress: () => number;
  getCurrentStepInfo: () => WizardStep | undefined;
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      steps: mockSteps,
      wizardData: {},

      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),
      updateStepData: (stepId, questionId, value) => {
        const { wizardData } = get();
        set({
          wizardData: {
            ...wizardData,
            [stepId]: {
              ...wizardData[stepId],
              [questionId]: value,
            },
          },
        });
      },
      getStepData: (stepId) => get().wizardData[stepId] || {},
      isStepCompleted: (stepId) => {
        const stepData = get().getStepData(stepId);
        const step = get().steps.find((s) => s.id === stepId);
        
        if (!step) return false;
        
        return step.questions
          .filter((q) => q.required)
          .every((q) => {
            const value = stepData[q.id];
            return value !== undefined && value !== '';
          });
      },

      // ✅ Computed value - Store 내부에서 계산
      getProgress: () => {
        const { steps, isStepCompleted } = get();
        const completedCount = steps.filter((step) => isStepCompleted(step.id)).length;
        return (completedCount / steps.length) * 100;
      },

      getCurrentStepInfo: () => {
        const { steps, currentStep } = get();
        return steps.find((s) => s.id === currentStep);
      },
    }),
    {
      name: 'wizard-storage',
    }
  )
);

// 사용
export const ProgressBar: React.FC = () => {
  const progress = useWizardStore((state) => state.getProgress());
  
  return <Progress value={progress} />;
};

export const StepTitle: React.FC = () => {
  const stepInfo = useWizardStore((state) => state.getCurrentStepInfo());
  
  return <h2>{stepInfo?.title}</h2>;
};
```

---

### Example 4: Custom Selector Hooks

```typescript
// src/hooks/useWizardSelectors.ts
import { useWizardStore } from '../stores/useWizardStore';
import { shallow } from 'zustand/shallow';
import { useMemo } from 'react';

/**
 * 현재 Step 정보를 가져오는 Hook
 */
export const useCurrentStep = () => {
  return useWizardStore((state) => state.getCurrentStepInfo());
};

/**
 * Wizard 진행률을 가져오는 Hook
 */
export const useWizardProgress = () => {
  return useWizardStore((state) => state.getProgress());
};

/**
 * Wizard Navigation Actions만 가져오는 Hook
 */
export const useWizardNavigation = () => {
  return useWizardStore(
    (state) => ({
      goToNextStep: state.goToNextStep,
      goToPreviousStep: state.goToPreviousStep,
      setCurrentStep: state.setCurrentStep,
    }),
    shallow
  );
};

/**
 * 특정 Step의 완료 여부를 확인하는 Hook
 */
export const useStepCompletion = (stepId: number) => {
  return useWizardStore((state) => state.isStepCompleted(stepId));
};

/**
 * 특정 Step의 데이터를 가져오는 Hook (Memoized)
 */
export const useStepData = (stepId: number) => {
  const getStepData = useWizardStore((state) => state.getStepData);
  
  // useMemo로 stepId가 변경될 때만 재계산
  return useMemo(() => getStepData(stepId), [getStepData, stepId]);
};

// 사용 예시
export const WizardNavigation: React.FC = () => {
  const { goToNextStep, goToPreviousStep } = useWizardNavigation();
  const progress = useWizardProgress();
  const currentStep = useCurrentStep();
  
  return (
    <div>
      <h2>{currentStep?.title}</h2>
      <Progress value={progress} />
      <Button onClick={goToPreviousStep}>이전</Button>
      <Button onClick={goToNextStep}>다음</Button>
    </div>
  );
};
```

---

### Example 5: Actions만 구독 (리렌더링 없음)

```typescript
// ✅ Actions는 참조가 안정적이므로 리렌더링 유발하지 않음
export const QuestionForm: React.FC<QuestionFormProps> = ({ stepId }) => {
  // ✅ Actions만 가져오기 - 리렌더링 안 됨
  const updateStepData = useWizardStore((state) => state.updateStepData);
  const getStepData = useWizardStore((state) => state.getStepData);
  
  // ✅ 필요한 데이터만 구독
  const stepData = useWizardStore(
    (state) => state.getStepData(stepId),
    // Custom equality function
    (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
  );
  
  const handleChange = useCallback(
    (questionId: string, value: any) => {
      updateStepData(stepId, questionId, value);
    },
    [stepId, updateStepData]
  );
  
  // ...
};
```

---

### Example 6: useShallow (Zustand 4.x)

```typescript
// Zustand 4.x의 useShallow 사용
import { useWizardStore } from '../stores/useWizardStore';
import { useShallow } from 'zustand/react/shallow';

export const WizardControls: React.FC = () => {
  // ✅ useShallow로 간단하게 shallow compare
  const { currentStep, totalSteps, goToNextStep, goToPreviousStep } = useWizardStore(
    useShallow((state) => ({
      currentStep: state.currentStep,
      totalSteps: state.steps.length,
      goToNextStep: state.goToNextStep,
      goToPreviousStep: state.goToPreviousStep,
    }))
  );
  
  return (
    <div>
      <span>{currentStep} / {totalSteps}</span>
      <Button onClick={goToPreviousStep}>이전</Button>
      <Button onClick={goToNextStep}>다음</Button>
    </div>
  );
};
```

---

### Example 7: 성능 측정

```typescript
// src/components/PerformanceMonitor.tsx (개발 환경 전용)
import { useEffect } from 'react';
import { useWizardStore } from '../stores/useWizardStore';

let renderCount = 0;

export const ComponentWithTracking: React.FC = () => {
  // 잘못된 패턴 (측정용)
  const store = useWizardStore();
  
  useEffect(() => {
    renderCount++;
    console.log(`Component rendered ${renderCount} times`);
  });
  
  return <div>...</div>;
};

// vs

export const OptimizedComponent: React.FC = () => {
  // 올바른 패턴 (측정용)
  const currentStep = useWizardStore((state) => state.currentStep);
  
  useEffect(() => {
    renderCount++;
    console.log(`Optimized component rendered ${renderCount} times`);
  });
  
  return <div>...</div>;
};

// 결과 비교: 10회 vs 2회 (80% 감소)
```

## 📁 New Files to Create

```
src/
└── hooks/
    ├── useWizardSelectors.ts         (NEW)
    ├── useProjectSelectors.ts        (NEW)
    ├── useFinancialSelectors.ts      (NEW)
    └── usePMFSelectors.ts            (NEW)
```

## ⚠️ Considerations

1. **과도한 최적화 지양**: 작은 컴포넌트는 전체 store 구독해도 OK
2. **Actions는 안정적**: Zustand의 actions는 참조가 안정적이므로 최적화 불필요
3. **Shallow vs Deep**: 대부분 shallow compare로 충분
4. **Custom Equality**: 필요한 경우에만 사용 (성능 오버헤드)
5. **측정 필수**: 최적화 전후 실제로 성능이 개선되는지 확인

## 🔗 Related Issues

- #001 - React.memo 적용 (함께 사용하면 시너지)
- #002 - useCallback 적용 (Selector와 함께 사용)
- #003 - useMemo 적용 (Computed values)

## 📚 References

- [Zustand Auto Generating Selectors](https://docs.pmnd.rs/zustand/guides/auto-generating-selectors)
- [Zustand Slices Pattern](https://docs.pmnd.rs/zustand/guides/slices-pattern)
- [React Re-renders Guide](https://www.developerway.com/posts/react-re-renders-guide)

## ✅ Acceptance Criteria

- [ ] 모든 Store에서 Selector 패턴 적용
- [ ] Custom Selector Hooks 생성
- [ ] Shallow compare 적절히 사용
- [ ] Actions만 구독하는 경우 최적화
- [ ] React DevTools Profiler로 성능 개선 확인
- [ ] Store 관련 리렌더링 50% 이상 감소
- [ ] 문서화: Selector 사용 가이드 작성

## ⏱️ Estimated Time

**1일** (8시간)
- 현재 패턴 분석: 2시간
- Selector 적용: 3시간
- Custom Hook 생성: 2시간
- 성능 측정 및 문서화: 1시간

## 👤 Assignee

_To be assigned_

## 📅 Timeline

- **Start Date**: TBD
- **Due Date**: TBD
- **Completed Date**: -

## 💬 Notes

Zustand Selector 패턴은 비교적 간단하면서도 큰 성능 개선 효과를 얻을 수 있습니다. React.memo, useCallback과 함께 사용하면 최대 효과를 발휘합니다.

