# [#004] 매직 넘버를 상수로 추출

## 📌 Status
`🔲 Todo`

## 🏷️ Labels
`code-quality` `readability` `priority-1`

## 📝 Description

코드 내에 하드코딩된 숫자(매직 넘버)들이 산재해 있어 가독성과 유지보수성을 저해하고 있습니다. 이들을 의미 있는 상수로 추출하여 코드의 의도를 명확히 해야 합니다.

## 🎯 Goal

매직 넘버를 제거하여 코드 가독성을 높이고, 변경이 필요할 때 한 곳에서 관리할 수 있도록 합니다.

## 📋 Tasks

### 1. Wizard 관련 매직 넘버

- [ ] Step 번호 관련 숫자 (4, 5 등)를 상수로 추출
- [ ] Wizard 전체 Step 수 관련 숫자 추출

### 2. 타이머 관련 매직 넘버

- [ ] setTimeout 딜레이 값 (3000ms 등)을 상수로 추출
- [ ] Auto-save debounce 딜레이 (1000ms) 확인 및 문서화

### 3. UI 관련 매직 넘버

- [ ] 아이콘 크기 (w-12, h-12 등)를 Tailwind config 또는 상수로 추출
- [ ] Progress bar 최대값 (100) 등

### 4. 재무 계산 관련 매직 넘버

- [ ] 백분율 계산 관련 숫자 (100, 0.01 등)를 상수로 추출
- [ ] 기본 계산 기간 (12개월 등) 상수화

### 5. PMF 관련 매직 넘버

- [ ] 설문 점수 범위 (1-5 등)를 상수로 추출
- [ ] PMF 점수 임계값 상수화

## 💡 Implementation Example

### Example 1: Wizard Step 번호

#### Before

```typescript
// src/pages/WizardStep.tsx
export const WizardStep: React.FC = () => {
  const { stepNumber } = useParams();
  const step = steps.find((s) => s.id === Number(stepNumber));
  
  // ❌ 매직 넘버 - 4와 5가 무엇을 의미하는지 불명확
  const canProceed = 
    stepNumber === steps.length || 
    isCompleted || 
    stepNumber === 4 || 
    stepNumber === 5;
  
  return (
    <div>
      {stepNumber === 4 ? (
        <FinancialSimulation />
      ) : stepNumber === 5 ? (
        <PMFSurvey />
      ) : (
        <QuestionForm questions={step.questions} stepId={stepNumber} />
      )}
    </div>
  );
};
```

#### After

```typescript
// src/constants/wizard.ts
export const WIZARD_STEPS = {
  BUSINESS_MODEL: 1,
  TARGET_MARKET: 2,
  COMPETITIVE_ANALYSIS: 3,
  FINANCIAL_SIMULATION: 4,
  PMF_SURVEY: 5,
} as const;

export const TOTAL_WIZARD_STEPS = 5;

// src/pages/WizardStep.tsx
import { WIZARD_STEPS, TOTAL_WIZARD_STEPS } from '../constants/wizard';

export const WizardStep: React.FC = () => {
  const { stepNumber } = useParams();
  const currentStep = Number(stepNumber);
  const step = steps.find((s) => s.id === currentStep);
  
  // ✅ 의미가 명확한 상수 사용
  const canProceed = 
    currentStep === TOTAL_WIZARD_STEPS || 
    isCompleted || 
    currentStep === WIZARD_STEPS.FINANCIAL_SIMULATION || 
    currentStep === WIZARD_STEPS.PMF_SURVEY;
  
  return (
    <div>
      {currentStep === WIZARD_STEPS.FINANCIAL_SIMULATION ? (
        <FinancialSimulation />
      ) : currentStep === WIZARD_STEPS.PMF_SURVEY ? (
        <PMFSurvey />
      ) : (
        <QuestionForm questions={step.questions} stepId={currentStep} />
      )}
    </div>
  );
};
```

### Example 2: 타이머 딜레이

#### Before

```typescript
// src/pages/BusinessPlanViewer.tsx
const handleGenerate = () => {
  setIsGenerating(true);
  
  // ❌ 3000이 무엇을 의미하는지 불명확
  setTimeout(() => {
    setIsGenerating(false);
    setIsGenerated(true);
  }, 3000);
};
```

#### After

```typescript
// src/constants/timing.ts
export const TIMING = {
  AI_GENERATION_DELAY: 3000, // 3초
  AUTO_SAVE_DEBOUNCE: 1000,  // 1초
  TOAST_DURATION: 3000,       // 3초
  ANIMATION_DURATION: 300,    // 0.3초
} as const;

// src/pages/BusinessPlanViewer.tsx
import { TIMING } from '../constants/timing';

const handleGenerate = () => {
  setIsGenerating(true);
  
  // ✅ 명확한 의미의 상수 사용
  // Simulate AI generation (실제로는 API 호출로 대체될 예정)
  setTimeout(() => {
    setIsGenerating(false);
    setIsGenerated(true);
  }, TIMING.AI_GENERATION_DELAY);
};
```

### Example 3: 재무 계산 상수

#### Before

```typescript
// src/hooks/useFinancialCalc.ts
const calculateMetrics = (input: FinancialInput) => {
  // ❌ 매직 넘버
  const monthlyRevenue = input.avgTicket * input.monthlyUsers;
  const grossMargin = (monthlyRevenue - input.cogs) / monthlyRevenue * 100;
  const paybackPeriod = input.cac / (input.avgTicket * 0.3);
  
  return { monthlyRevenue, grossMargin, paybackPeriod };
};
```

#### After

```typescript
// src/constants/financial.ts
export const FINANCIAL_CONSTANTS = {
  MONTHS_PER_YEAR: 12,
  PERCENTAGE_MULTIPLIER: 100,
  DEFAULT_MARGIN_RATE: 0.3, // 30% 마진
  MIN_GROSS_MARGIN: 20,      // 최소 마진 20%
  MAX_PAYBACK_PERIOD: 12,    // 최대 회수 기간 12개월
} as const;

export const PMF_SCORE_RANGE = {
  MIN: 0,
  MAX: 100,
  EXCELLENT: 80,
  GOOD: 60,
  FAIR: 40,
} as const;

// src/hooks/useFinancialCalc.ts
import { FINANCIAL_CONSTANTS } from '../constants/financial';

const calculateMetrics = (input: FinancialInput) => {
  // ✅ 명확한 의미의 상수 사용
  const monthlyRevenue = input.avgTicket * input.monthlyUsers;
  const grossMargin = (monthlyRevenue - input.cogs) / monthlyRevenue * FINANCIAL_CONSTANTS.PERCENTAGE_MULTIPLIER;
  const paybackPeriod = input.cac / (input.avgTicket * FINANCIAL_CONSTANTS.DEFAULT_MARGIN_RATE);
  
  return { monthlyRevenue, grossMargin, paybackPeriod };
};
```

### Example 4: PMF 설문 점수

#### Before

```typescript
// src/components/wizard/PMFSurvey.tsx
const calculatePMFScore = (responses: Record<string, number>) => {
  // ❌ 5가 무엇을 의미하는지 불명확
  const totalScore = Object.values(responses).reduce((sum, value) => sum + value, 0);
  return (totalScore / (Object.keys(responses).length * 5)) * 100;
};
```

#### After

```typescript
// src/constants/pmf.ts
export const PMF_SURVEY = {
  QUESTION_COUNT: 10,
  SCORE_MIN: 1,
  SCORE_MAX: 5,
  THRESHOLD_EXCELLENT: 80,
  THRESHOLD_GOOD: 60,
} as const;

// src/components/wizard/PMFSurvey.tsx
import { PMF_SURVEY } from '../constants/pmf';

const calculatePMFScore = (responses: Record<string, number>) => {
  // ✅ 명확한 의미의 상수 사용
  const totalScore = Object.values(responses).reduce((sum, value) => sum + value, 0);
  const maxPossibleScore = Object.keys(responses).length * PMF_SURVEY.SCORE_MAX;
  return (totalScore / maxPossibleScore) * FINANCIAL_CONSTANTS.PERCENTAGE_MULTIPLIER;
};
```

## 📁 Proposed File Structure

```
src/
├── constants/
│   ├── index.ts           # Re-export all constants
│   ├── wizard.ts          # Wizard step numbers, total steps
│   ├── timing.ts          # Delays, durations, timeouts
│   ├── financial.ts       # Financial calculation constants
│   ├── pmf.ts             # PMF survey constants
│   └── ui.ts              # UI-related constants (sizes, colors)
```

## ⚠️ Considerations

1. **상수 네이밍**: 대문자 SNAKE_CASE 사용 (예: `MAX_FILE_SIZE`)
2. **as const 사용**: TypeScript에서 리터럴 타입으로 추론되도록
3. **그룹화**: 관련 있는 상수끼리 객체로 묶기
4. **주석 추가**: 필요시 단위나 의미 명시 (예: `// milliseconds`, `// percentage`)
5. **과도한 추상화 지양**: 한 번만 사용되는 값은 인라인으로 유지

## 🔗 Related Issues

- #005 - 중복 코드 제거 (상수를 활용한 리팩토링)
- #007 - Custom Hook 추가 (계산 로직에서 상수 활용)

## 📚 References

- [Clean Code - Magic Numbers](https://refactoring.guru/smells/magic-numbers)
- [TypeScript const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)

## ✅ Acceptance Criteria

- [ ] 모든 매직 넘버가 의미 있는 상수로 추출됨
- [ ] `src/constants/` 디렉토리 생성 및 파일 구조 정리
- [ ] 상수에 필요한 주석 추가 (단위, 의미 등)
- [ ] `as const`로 타입 안전성 확보
- [ ] ESLint no-magic-numbers 규칙 추가 (선택사항)
- [ ] 문서화: 주요 상수 목록과 용도를 README에 추가

## ⏱️ Estimated Time

**0.5일** (4시간)
- 상수 파일 구조 설계: 0.5시간
- Wizard 관련 상수 추출: 1시간
- 재무/PMF 관련 상수 추출: 1.5시간
- UI 관련 상수 추출: 0.5시간
- 문서화 및 검증: 0.5시간

## 👤 Assignee

_To be assigned_

## 📅 Timeline

- **Start Date**: TBD
- **Due Date**: TBD
- **Completed Date**: -

## 💬 Notes

이 작업은 비교적 간단하지만 코드 전반의 가독성을 크게 향상시킵니다. 다른 리팩토링 작업과 병행하여 진행할 수 있습니다.

