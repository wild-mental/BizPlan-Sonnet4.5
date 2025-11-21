# [#007] Custom Hook 추가로 공통 로직 추출

## 📌 Status
`🔲 Todo`

## 🏷️ Labels
`refactoring` `reusability` `priority-2`

## 📝 Description

여러 컴포넌트에서 반복되는 로직들을 Custom Hook으로 추출하여 재사용성을 높이고 코드 중복을 제거해야 합니다.

## 🎯 Goal

공통 로직을 Custom Hook으로 추상화하여 코드 재사용성을 높이고, 유지보수를 용이하게 합니다.

## 📋 Tasks

### 1. useAsyncAction Hook

- [ ] 비동기 작업 상태 관리를 위한 Hook 생성
- [ ] `src/hooks/useAsyncAction.ts` 생성
- [ ] BusinessPlanViewer, ProjectCreate에 적용

### 2. useFormValidation Hook

- [ ] 폼 검증 로직을 위한 Hook 생성
- [ ] `src/hooks/useFormValidation.ts` 생성
- [ ] Zod와 연동
- [ ] QuestionForm, ProjectCreate에 적용

### 3. useDebounce Hook

- [ ] Debounce 로직을 위한 Hook 생성
- [ ] `src/hooks/useDebounce.ts` 생성
- [ ] 검색, 자동저장 등에 활용

### 4. useChartData Hook

- [ ] 차트 데이터 계산 로직을 위한 Hook 생성
- [ ] `src/hooks/useChartData.ts` 생성
- [ ] FinancialSimulation에서 차트 로직 분리

### 5. useLocalStorage Hook

- [ ] LocalStorage 관리를 위한 Hook 생성
- [ ] `src/hooks/useLocalStorage.ts` 생성
- [ ] 타입 안전한 Storage 접근

### 6. useMediaQuery Hook

- [ ] 반응형 디자인을 위한 Hook 생성
- [ ] `src/hooks/useMediaQuery.ts` 생성
- [ ] 모바일/데스크톱 분기 처리

### 7. usePrevious Hook

- [ ] 이전 값 추적을 위한 Hook 생성
- [ ] `src/hooks/usePrevious.ts` 생성
- [ ] 값 변경 감지에 활용

## 💡 Implementation Example

### Example 1: useAsyncAction

```typescript
// src/hooks/useAsyncAction.ts
import { useState, useCallback } from 'react';
import { getErrorMessage } from '../lib/apiErrors';

interface UseAsyncActionOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useAsyncAction = <T, Args extends any[]>(
  action: (...args: Args) => Promise<T>,
  options?: UseAsyncActionOptions
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (...args: Args) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await action(...args);
        setData(result);
        options?.onSuccess?.();
        return result;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        options?.onError?.(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [action, options]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    isLoading,
    error,
    data,
    reset,
  };
};

// 사용 예시 - BusinessPlanViewer.tsx
import { useAsyncAction } from '../hooks/useAsyncAction';
import { toast } from 'react-hot-toast';

export const BusinessPlanViewer: React.FC = () => {
  const {
    execute: generatePlan,
    isLoading: isGenerating,
    error,
  } = useAsyncAction(generateBusinessPlan, {
    onSuccess: () => {
      toast.success('사업계획서가 생성되었습니다.');
      setIsGenerated(true);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleGenerate = () => {
    generatePlan(wizardData);
  };

  return (
    <div>
      {error && <ErrorAlert message={error} />}
      <Button onClick={handleGenerate} isLoading={isGenerating}>
        생성하기
      </Button>
    </div>
  );
};
```

---

### Example 2: useFormValidation

```typescript
// src/hooks/useFormValidation.ts
import { useState, useCallback } from 'react';
import { z, ZodSchema } from 'zod';

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export const useFormValidation = <T extends Record<string, any>>(
  schema: ZodSchema<T>
) => {
  const [errors, setErrors] = useState<ValidationErrors<T>>({});

  const validate = useCallback(
    (data: T): boolean => {
      try {
        schema.parse(data);
        setErrors({});
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors: ValidationErrors<T> = {};
          error.errors.forEach((err) => {
            const field = err.path[0] as keyof T;
            fieldErrors[field] = err.message;
          });
          setErrors(fieldErrors);
        }
        return false;
      }
    },
    [schema]
  );

  const validateField = useCallback(
    (field: keyof T, value: any): boolean => {
      try {
        // 특정 필드만 검증
        const fieldSchema = schema.shape[field as any];
        if (fieldSchema) {
          fieldSchema.parse(value);
          setErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
          });
          return true;
        }
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors((prev) => ({
            ...prev,
            [field]: error.errors[0].message,
          }));
        }
        return false;
      }
    },
    [schema]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: keyof T) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  return {
    errors,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
  };
};

// 사용 예시 - ProjectCreate.tsx
import { z } from 'zod';
import { useFormValidation } from '../hooks/useFormValidation';

const projectSchema = z.object({
  projectName: z.string().min(1, '프로젝트 이름을 입력해주세요'),
  template: z.enum(['pre-startup', 'early-startup', 'bank-loan']),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export const ProjectCreate: React.FC = () => {
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: '',
    template: 'pre-startup',
  });

  const { errors, validate, validateField } = useFormValidation(projectSchema);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate(formData)) {
      createProject(formData.projectName, formData.template);
      navigate(`/wizard/${projectId}/1`);
    }
  };

  const handleChange = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="프로젝트 이름"
        value={formData.projectName}
        onChange={(e) => handleChange('projectName', e.target.value)}
        error={errors.projectName}
      />
      <Button type="submit">시작하기</Button>
    </form>
  );
};
```

---

### Example 3: useDebounce

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export const useDebounce = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 사용 예시 - 검색 기능
export const SearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // API 호출
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <Input
      placeholder="검색..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};
```

---

### Example 4: useChartData

```typescript
// src/hooks/useChartData.ts
import { useMemo } from 'react';
import { FinancialInput } from '../types';

export const useChartData = (input: FinancialInput) => {
  const bepData = useMemo(() => {
    if (!input.fixedCost || !input.avgTicket || !input.variableCostPerUnit) {
      return [];
    }

    const contributionMargin = input.avgTicket - input.variableCostPerUnit;
    const bepUnits = Math.ceil(input.fixedCost / contributionMargin);
    
    const data = [];
    const maxUnits = bepUnits * 1.5;
    
    for (let units = 0; units <= maxUnits; units += Math.ceil(maxUnits / 20)) {
      const revenue = units * input.avgTicket;
      const totalCost = input.fixedCost + units * input.variableCostPerUnit;
      
      data.push({
        units,
        revenue,
        cost: totalCost,
        profit: revenue - totalCost,
      });
    }
    
    return data;
  }, [input.fixedCost, input.avgTicket, input.variableCostPerUnit]);

  const unitEconomicsData = useMemo(() => {
    if (!input.cac || !input.ltv) return [];

    return [
      { name: 'CAC', value: input.cac, fill: '#ef4444' },
      { name: 'LTV', value: input.ltv, fill: '#10b981' },
    ];
  }, [input.cac, input.ltv]);

  const metrics = useMemo(() => {
    const monthlyRevenue = input.avgTicket * input.monthlyUsers;
    const grossMargin = input.cogs 
      ? ((monthlyRevenue - input.cogs) / monthlyRevenue) * 100 
      : 0;
    const ltvCacRatio = input.cac ? input.ltv / input.cac : 0;
    
    return {
      monthlyRevenue,
      grossMargin,
      ltvCacRatio,
      monthsToRecover: input.cac && input.avgTicket 
        ? input.cac / (input.avgTicket * 0.3) 
        : 0,
    };
  }, [input]);

  return {
    bepData,
    unitEconomicsData,
    metrics,
  };
};

// 사용 예시 - FinancialSimulation.tsx
import { useChartData } from '../../hooks/useChartData';

export const FinancialSimulation: React.FC = () => {
  const { input } = useFinancialStore();
  const { bepData, unitEconomicsData, metrics } = useChartData(input);

  return (
    <div>
      <MetricsSummary metrics={metrics} />
      <BEPChart data={bepData} />
      <UnitEconomicsChart data={unitEconomicsData} />
    </div>
  );
};
```

---

### Example 5: useLocalStorage

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect, useCallback } from 'react';

export const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// 사용 예시
export const ThemeToggle: React.FC = () => {
  const [theme, setTheme, removeTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  return (
    <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
};
```

---

### Example 6: useMediaQuery

```typescript
// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    // Create event listener
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Add listener
    media.addEventListener('change', listener);

    // Cleanup
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
};

// Convenient breakpoint hooks
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');

// 사용 예시
export const ResponsiveLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  return (
    <div>
      {isMobile ? (
        <MobileNav />
      ) : isTablet ? (
        <TabletNav />
      ) : (
        <DesktopNav />
      )}
    </div>
  );
};
```

---

### Example 7: usePrevious

```typescript
// src/hooks/usePrevious.ts
import { useEffect, useRef } from 'react';

export const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
};

// 사용 예시 - 값 변경 감지
export const StepTracker: React.FC = () => {
  const { currentStep } = useWizardStore();
  const previousStep = usePrevious(currentStep);

  useEffect(() => {
    if (previousStep !== undefined && currentStep !== previousStep) {
      console.log(`Step changed from ${previousStep} to ${currentStep}`);
      // Analytics tracking
      trackStepChange(previousStep, currentStep);
    }
  }, [currentStep, previousStep]);

  return <div>Current Step: {currentStep}</div>;
};
```

## 📁 New Files to Create

```
src/
└── hooks/
    ├── index.ts                  (UPDATE - export all hooks)
    ├── useAsyncAction.ts         (NEW)
    ├── useFormValidation.ts      (NEW)
    ├── useDebounce.ts            (NEW)
    ├── useChartData.ts           (NEW)
    ├── useLocalStorage.ts        (NEW)
    ├── useMediaQuery.ts          (NEW)
    └── usePrevious.ts            (NEW)
```

## ⚠️ Considerations

1. **의존성 관리**: useCallback, useMemo를 적절히 사용하여 성능 최적화
2. **타입 안정성**: Generic을 활용하여 타입 안전성 확보
3. **에러 처리**: Hook 내부에서 에러를 적절히 처리
4. **테스트**: 각 Hook에 대한 단위 테스트 작성
5. **문서화**: JSDoc 주석으로 사용법 명시

## 🔗 Related Issues

- #001, #002, #003 - 성능 최적화 (Hook 내부에서도 적용)
- #006 - 에러 처리 (useAsyncAction에서 활용)
- #008 - 복잡한 컴포넌트 분리 (Hook으로 로직 분리)

## 📚 References

- [React Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [useHooks](https://usehooks.com/) - Custom Hook 예시 모음
- [Hooks Testing Library](https://react-hooks-testing-library.com/)

## ✅ Acceptance Criteria

- [ ] 7개 Custom Hook 모두 구현
- [ ] TypeScript Generic을 활용한 타입 안전성 확보
- [ ] 각 Hook에 JSDoc 주석 추가
- [ ] 기존 컴포넌트에서 새 Hook 사용
- [ ] hooks/index.ts에서 모든 Hook export
- [ ] 성능 최적화 (useCallback, useMemo) 적용
- [ ] 에러 처리 로직 포함

## ⏱️ Estimated Time

**3일** (24시간)
- useAsyncAction, useFormValidation: 6시간
- useDebounce, useLocalStorage: 3시간
- useChartData: 4시간
- useMediaQuery, usePrevious: 2시간
- 기존 코드 리팩토링: 6시간
- 문서화 및 테스트: 3시간

## 👤 Assignee

_To be assigned_

## 📅 Timeline

- **Start Date**: 2025-11-23
- **Due Date**: 2025-11-24
- **Completed Date**: -

## 💬 Notes

Custom Hook은 React의 핵심 패턴이며, 코드 재사용성과 테스트 용이성을 크게 향상시킵니다. 이 작업은 프로젝트의 장기적인 유지보수성에 큰 도움이 됩니다.

