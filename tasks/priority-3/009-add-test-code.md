# [#009] 단위 테스트 및 통합 테스트 추가

## 📌 Status
`🔲 Todo`

## 🏷️ Labels
`testing` `quality` `priority-3`

## 📝 Description

현재 프로젝트에 테스트 코드가 전무하여 버그 발견 및 리팩토링 시 안전성이 보장되지 않습니다. 단위 테스트와 통합 테스트를 추가하여 코드 품질을 높여야 합니다.

## 🎯 Goal

테스트 커버리지를 **80% 이상** 달성하여 코드 안정성을 확보하고, 리팩토링과 기능 추가 시 자신감을 높입니다.

## 📋 Tasks

### 1. 테스트 환경 설정

- [ ] Vitest 설정
- [ ] React Testing Library 설정
- [ ] Testing Hooks Library 설정
- [ ] Coverage 설정
- [ ] Mock 설정 (MSW 등)

### 2. UI 컴포넌트 테스트

- [ ] Button 테스트
- [ ] Input, Textarea 테스트
- [ ] Card 컴포넌트 테스트
- [ ] Badge, Progress, Spinner 테스트

### 3. 비즈니스 로직 컴포넌트 테스트

- [ ] QuestionForm 테스트
- [ ] FinancialSimulation 테스트
- [ ] PMFSurvey 테스트
- [ ] BusinessPlanViewer 테스트

### 4. Custom Hook 테스트

- [ ] useAutoSave 테스트
- [ ] useFinancialCalc 테스트
- [ ] useAsyncAction 테스트 (Priority 2 작업 후)
- [ ] useFormValidation 테스트 (Priority 2 작업 후)

### 5. Store 테스트

- [ ] useWizardStore 테스트
- [ ] useProjectStore 테스트
- [ ] useFinancialStore 테스트
- [ ] usePMFStore 테스트

### 6. 유틸리티 함수 테스트

- [ ] cn() 함수 테스트
- [ ] 기타 헬퍼 함수 테스트

### 7. 통합 테스트

- [ ] Wizard 전체 플로우 테스트
- [ ] 프로젝트 생성 플로우 테스트

## 💡 Implementation Example

### Example 1: 테스트 환경 설정

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
      ],
    },
  },
});

// src/test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

// package.json에 추가
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@vitest/ui": "^1.0.0",
    "vitest": "^1.0.0",
    "@vitest/coverage-v8": "^1.0.0"
  }
}
```

---

### Example 2: UI 컴포넌트 테스트

```typescript
// src/components/ui/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies primary variant styles by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-primary-600');
  });

  it('applies secondary variant styles when specified', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary');
    expect(button).toHaveClass('bg-gray-600');
  });

  it('applies outline variant styles when specified', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByText('Outline');
    expect(button).toHaveClass('border-primary-600');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    // Spinner가 렌더링되는지 확인 (data-testid 등으로)
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByText('Custom');
    expect(button).toHaveClass('custom-class');
  });

  it('renders with small size', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByText('Small');
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });

  it('renders with large size', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByText('Large');
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });
});

// src/components/ui/Input.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('renders input with label', () => {
    render(<Input label="Username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('shows helper text when provided', () => {
    render(<Input helperText="Enter your email" />);
    expect(screen.getByText('Enter your email')).toBeInTheDocument();
  });

  it('calls onChange handler', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies error styles when error is present', () => {
    render(<Input error="Error" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('accepts ref', () => {
    const ref = { current: null };
    render(<Input ref={ref as any} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
```

---

### Example 3: Custom Hook 테스트

```typescript
// src/hooks/useAutoSave.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAutoSave } from './useAutoSave';

describe('useAutoSave', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls save function after delay', async () => {
    const saveFn = vi.fn();
    const data = { name: 'Test' };

    renderHook(() => useAutoSave(data, saveFn, 1000));

    // 즉시는 호출되지 않아야 함
    expect(saveFn).not.toHaveBeenCalled();

    // 1초 후 호출되어야 함
    vi.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(saveFn).toHaveBeenCalledWith(data);
    });
  });

  it('debounces multiple data changes', async () => {
    const saveFn = vi.fn();
    let data = { name: 'Test' };

    const { rerender } = renderHook(() => useAutoSave(data, saveFn, 1000));

    // 여러 번 데이터 변경
    data = { name: 'Test 2' };
    rerender();
    vi.advanceTimersByTime(500);

    data = { name: 'Test 3' };
    rerender();
    vi.advanceTimersByTime(500);

    // 마지막 변경만 저장되어야 함
    await waitFor(() => {
      expect(saveFn).toHaveBeenCalledTimes(1);
      expect(saveFn).toHaveBeenCalledWith({ name: 'Test 3' });
    });
  });

  it('cleans up timer on unmount', () => {
    const saveFn = vi.fn();
    const data = { name: 'Test' };

    const { unmount } = renderHook(() => useAutoSave(data, saveFn, 1000));

    unmount();
    vi.advanceTimersByTime(1000);

    // 언마운트 후에는 호출되지 않아야 함
    expect(saveFn).not.toHaveBeenCalled();
  });
});

// src/hooks/useFinancialCalc.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFinancialCalc } from './useFinancialCalc';
import { FinancialInput } from '../types';

describe('useFinancialCalc', () => {
  it('calculates monthly revenue correctly', () => {
    const { result } = renderHook(() => useFinancialCalc());
    
    const input: FinancialInput = {
      monthlyUsers: 1000,
      avgTicket: 50000,
      cogs: 10000000,
      cac: 30000,
      ltv: 150000,
      fixedCost: 5000000,
      variableCostPerUnit: 10000,
    };

    const metrics = result.current.calculateMetrics(input);
    
    expect(metrics.monthlyRevenue).toBe(50000000); // 1000 * 50000
  });

  it('calculates gross margin correctly', () => {
    const { result } = renderHook(() => useFinancialCalc());
    
    const input: FinancialInput = {
      monthlyUsers: 1000,
      avgTicket: 50000,
      cogs: 10000000,
      cac: 30000,
      ltv: 150000,
      fixedCost: 5000000,
      variableCostPerUnit: 10000,
    };

    const metrics = result.current.calculateMetrics(input);
    
    // (50000000 - 10000000) / 50000000 * 100 = 80%
    expect(metrics.grossMargin).toBe(80);
  });

  it('calculates LTV/CAC ratio correctly', () => {
    const { result } = renderHook(() => useFinancialCalc());
    
    const input: FinancialInput = {
      monthlyUsers: 1000,
      avgTicket: 50000,
      cogs: 10000000,
      cac: 30000,
      ltv: 150000,
      fixedCost: 5000000,
      variableCostPerUnit: 10000,
    };

    const metrics = result.current.calculateMetrics(input);
    
    // 150000 / 30000 = 5
    expect(metrics.ltvCacRatio).toBe(5);
  });

  it('handles zero values safely', () => {
    const { result } = renderHook(() => useFinancialCalc());
    
    const input: FinancialInput = {
      monthlyUsers: 0,
      avgTicket: 0,
      cogs: 0,
      cac: 0,
      ltv: 0,
      fixedCost: 0,
      variableCostPerUnit: 0,
    };

    const metrics = result.current.calculateMetrics(input);
    
    expect(metrics.monthlyRevenue).toBe(0);
    expect(metrics.ltvCacRatio).toBe(0); // division by zero 처리 확인
  });
});
```

---

### Example 4: Store 테스트

```typescript
// src/stores/useWizardStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWizardStore } from './useWizardStore';

describe('useWizardStore', () => {
  beforeEach(() => {
    // 각 테스트 전에 store 초기화
    const { result } = renderHook(() => useWizardStore());
    act(() => {
      result.current.resetWizard();
    });
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useWizardStore());
    
    expect(result.current.currentStep).toBe(1);
    expect(result.current.steps).toHaveLength(5);
    expect(result.current.wizardData).toEqual({});
  });

  it('updates step data correctly', () => {
    const { result } = renderHook(() => useWizardStore());
    
    act(() => {
      result.current.updateStepData(1, 'item-name', 'Test Project');
    });

    const stepData = result.current.getStepData(1);
    expect(stepData['item-name']).toBe('Test Project');
  });

  it('checks step completion correctly', () => {
    const { result } = renderHook(() => useWizardStore());
    
    // 초기에는 완료되지 않음
    expect(result.current.isStepCompleted(1)).toBe(false);

    // 필수 질문에 답변
    act(() => {
      result.current.updateStepData(1, 'item-name', 'Test');
      result.current.updateStepData(1, 'target-customer', 'Customer');
      result.current.updateStepData(1, 'customer-problem', 'Problem');
    });

    // 완료됨
    expect(result.current.isStepCompleted(1)).toBe(true);
  });

  it('navigates to next step', () => {
    const { result } = renderHook(() => useWizardStore());
    
    act(() => {
      result.current.goToNextStep();
    });

    expect(result.current.currentStep).toBe(2);
  });

  it('navigates to previous step', () => {
    const { result } = renderHook(() => useWizardStore());
    
    act(() => {
      result.current.setCurrentStep(3);
      result.current.goToPreviousStep();
    });

    expect(result.current.currentStep).toBe(2);
  });

  it('does not go below step 1', () => {
    const { result } = renderHook(() => useWizardStore());
    
    act(() => {
      result.current.goToPreviousStep();
    });

    expect(result.current.currentStep).toBe(1);
  });

  it('does not go above last step', () => {
    const { result } = renderHook(() => useWizardStore());
    const lastStep = result.current.steps.length;
    
    act(() => {
      result.current.setCurrentStep(lastStep);
      result.current.goToNextStep();
    });

    expect(result.current.currentStep).toBe(lastStep);
  });

  it('resets wizard to initial state', () => {
    const { result } = renderHook(() => useWizardStore());
    
    // 데이터 추가
    act(() => {
      result.current.updateStepData(1, 'test', 'value');
      result.current.setCurrentStep(3);
    });

    // 초기화
    act(() => {
      result.current.resetWizard();
    });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.wizardData).toEqual({});
  });
});
```

---

### Example 5: 통합 테스트

```typescript
// src/test/integration/wizard-flow.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from '../../App';

describe('Wizard Flow Integration', () => {
  beforeEach(() => {
    // 각 테스트 전에 localStorage 초기화
    localStorage.clear();
  });

  it('completes full wizard flow', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // 1. 프로젝트 생성
    const projectNameInput = screen.getByLabelText(/프로젝트 이름/i);
    await user.type(projectNameInput, 'Test Project');

    const templateCard = screen.getByText(/스타트업 초기 단계/i);
    await user.click(templateCard);

    const startButton = screen.getByText(/시작하기/i);
    await user.click(startButton);

    // 2. Step 1 - 비즈니스 모델
    await waitFor(() => {
      expect(screen.getByText(/비즈니스 모델/i)).toBeInTheDocument();
    });

    const itemNameInput = screen.getByPlaceholderText(/아이템 이름/i);
    await user.type(itemNameInput, 'AI 챗봇');

    const nextButton = screen.getByText(/다음/i);
    await user.click(nextButton);

    // 3. Step 2 - 타겟 시장
    await waitFor(() => {
      expect(screen.getByText(/타겟 시장/i)).toBeInTheDocument();
    });

    // ... 나머지 단계들

    // 마지막 단계까지 완료 확인
    await waitFor(() => {
      expect(screen.getByText(/사업계획서 생성/i)).toBeInTheDocument();
    });
  });

  it('saves progress automatically', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // 프로젝트 생성 및 데이터 입력
    // ...

    // 페이지 새로고침 시뮬레이션
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // 저장된 데이터가 복원되었는지 확인
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/아이템 이름/i);
      expect(input).toHaveValue('AI 챗봇');
    });
  });
});
```

## 📁 New Files/Directory Structure

```
src/
├── test/
│   ├── setup.ts                        (NEW)
│   ├── integration/                    (NEW)
│   │   └── wizard-flow.test.tsx
│   └── utils/                          (NEW)
│       └── test-utils.tsx              (render with providers)
├── components/
│   └── ui/
│       ├── Button.test.tsx             (NEW)
│       ├── Input.test.tsx              (NEW)
│       └── ...
├── hooks/
│   ├── useAutoSave.test.ts             (NEW)
│   ├── useFinancialCalc.test.ts        (NEW)
│   └── ...
└── stores/
    ├── useWizardStore.test.ts          (NEW)
    ├── useProjectStore.test.ts         (NEW)
    └── ...
```

## ⚠️ Considerations

1. **테스트 격리**: 각 테스트는 독립적이어야 하며 서로 영향을 주지 않아야 함
2. **Mock 사용**: API 호출, localStorage 등은 적절히 Mock
3. **비동기 처리**: waitFor, findBy 등을 적절히 사용
4. **Coverage 목표**: 핵심 로직은 100%, 전체 80% 이상
5. **CI/CD 통합**: GitHub Actions 등에서 자동 실행

## 🔗 Related Issues

- #006 - 에러 처리 (에러 케이스 테스트)
- #007 - Custom Hook 추가 (Hook 테스트)
- #008 - 복잡한 컴포넌트 분리 (테스트하기 쉬운 구조)

## 📚 References

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Hooks](https://react-hooks-testing-library.com/)
- [Kent C. Dodds - Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## ✅ Acceptance Criteria

- [ ] Vitest 환경 설정 완료
- [ ] 모든 UI 컴포넌트 테스트 작성 (7개)
- [ ] 주요 비즈니스 로직 컴포넌트 테스트 작성 (4개)
- [ ] Custom Hook 테스트 작성 (최소 4개)
- [ ] Store 테스트 작성 (4개)
- [ ] 통합 테스트 작성 (최소 2개)
- [ ] 테스트 커버리지 80% 이상 달성
- [ ] CI/CD 파이프라인에 테스트 추가

## ⏱️ Estimated Time

**1주** (40시간)
- 테스트 환경 설정: 4시간
- UI 컴포넌트 테스트: 8시간
- 비즈니스 로직 컴포넌트 테스트: 8시간
- Hook & Store 테스트: 10시간
- 통합 테스트: 6시간
- Coverage 보완 및 문서화: 4시간

## 👤 Assignee

_To be assigned_

## 📅 Timeline

- **Start Date**: 2025-11-24
- **Due Date**: 2025-11-30
- **Completed Date**: -

## 💬 Notes

테스트 코드는 초기 투자 시간이 크지만, 장기적으로 버그 발견 시간을 크게 단축시키고 리팩토링 시 자신감을 줍니다. TDD (Test-Driven Development) 방식도 고려해볼 수 있습니다.

