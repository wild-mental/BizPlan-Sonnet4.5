# [#005] 중복 코드 제거 및 공통 컴포넌트 추출

## 📌 Status
`🟡 In Progress`

## 🏷️ Labels
`refactoring` `code-quality` `priority-2`

## 📝 Description

프로젝트 내에 반복되는 코드 패턴들이 여러 곳에서 발견됩니다. 이들을 재사용 가능한 컴포넌트나 유틸리티 함수로 추출하여 중복을 제거해야 합니다.

## 🎯 Goal

코드 라인 수를 **30-40% 감소**시키고, 유지보수성을 향상시킵니다.

## 📋 Tasks

### 1. GlassCard 컴포넌트 생성 (완료)

- [x] 반복되는 glass-card 스타일을 컴포넌트로 추출 ✅
- [x] `src/components/ui/GlassCard.tsx` 생성 ✅
- [x] 패딩 옵션 (sm, md, lg) 제공 ✅
- [x] 호버 효과 옵션 지원 ✅

### 2. StepIndicator 컴포넌트 생성

- [ ] 단계 표시 로직을 별도 컴포넌트로 분리
- [ ] `src/components/wizard/StepIndicator.tsx` 생성
- [ ] Layout에서 사용

### 3. SectionHeader 컴포넌트 생성

- [ ] 섹션 헤더 패턴을 컴포넌트로 추출
- [ ] `src/components/ui/SectionHeader.tsx` 생성
- [ ] 여러 페이지에서 재사용

### 4. EmptyState 컴포넌트 생성

- [ ] 빈 상태 UI를 컴포넌트로 추출
- [ ] `src/components/ui/EmptyState.tsx` 생성

### 5. 중복되는 className 패턴 정리

- [ ] 자주 사용되는 className 조합을 유틸리티 함수로 추출
- [ ] `src/lib/classNames.ts` 생성

## 💡 Implementation Example

### Example 1: FeatureIcon 컴포넌트

#### Before (중복 코드)

```typescript
// src/pages/ProjectCreate.tsx
<div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
  <span className="text-2xl">🤖</span>
</div>

<div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
  <span className="text-2xl">📊</span>
</div>

<div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
  <span className="text-2xl">🎯</span>
</div>
```

#### After (컴포넌트화)

```typescript
// src/components/ui/FeatureIcon.tsx
import React from 'react';
import { cn } from '../../lib/utils';

interface FeatureIconProps {
  emoji: string;
  size?: 'sm' | 'md' | 'lg';
  bgColor?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-lg',
  md: 'w-12 h-12 text-2xl',
  lg: 'w-16 h-16 text-3xl',
};

export const FeatureIcon: React.FC<FeatureIconProps> = ({ 
  emoji, 
  size = 'md',
  bgColor = 'bg-primary-100',
  className 
}) => (
  <div 
    className={cn(
      'rounded-full flex items-center justify-center mx-auto mb-3',
      sizeClasses[size],
      bgColor,
      className
    )}
  >
    <span>{emoji}</span>
  </div>
);

// src/pages/ProjectCreate.tsx
<FeatureIcon emoji="🤖" />
<FeatureIcon emoji="📊" />
<FeatureIcon emoji="🎯" />
```

**효과**: 코드 라인 수 **60% 감소** (18줄 → 3줄)

---

### Example 2: SectionHeader 컴포넌트

#### Before (중복 코드)

```typescript
// 여러 컴포넌트에서 반복
<div className="mb-6">
  <h2 className="text-2xl font-bold text-gray-900 mb-2">
    섹션 제목
  </h2>
  <p className="text-gray-600">
    섹션 설명
  </p>
</div>
```

#### After (컴포넌트화)

```typescript
// src/components/ui/SectionHeader.tsx
import React from 'react';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  description, 
  icon,
  action,
  className 
}) => (
  <div className={cn('mb-6', className)}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-2xl font-bold text-gray-900">
          {title}
        </h2>
      </div>
      {action}
    </div>
    {description && (
      <p className="text-gray-600 mt-2">
        {description}
      </p>
    )}
  </div>
);

// 사용 예시
<SectionHeader
  title="재무 시뮬레이션"
  description="기본 정보를 입력하여 주요 지표를 확인하세요"
  icon={<DollarSign className="w-6 h-6 text-primary-600" />}
  action={<Button size="sm">초기화</Button>}
/>
```

---

### Example 3: StepIndicator 컴포넌트

#### Before

```typescript
// src/components/Layout.tsx - 복잡한 단계 표시 로직
<div className="flex items-center gap-3 px-3 py-2 rounded-lg">
  <div className={cn(
    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
    isCurrent ? 'bg-primary-600 text-white' : 
    isCompleted ? 'bg-green-100 text-green-700' : 
    'bg-gray-100 text-gray-400'
  )}>
    {isCompleted ? <Check className="w-4 h-4" /> : step.id}
  </div>
  <div className="flex-1">
    <div className={cn(
      'text-sm font-medium',
      isCurrent ? 'text-primary-700' : 
      isCompleted ? 'text-gray-700' : 
      'text-gray-400'
    )}>
      {step.title}
    </div>
  </div>
</div>
```

#### After

```typescript
// src/components/wizard/StepIndicator.tsx
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StepIndicatorProps {
  stepNumber: number;
  title: string;
  isCurrent: boolean;
  isCompleted: boolean;
  onClick?: () => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  stepNumber,
  title,
  isCurrent,
  isCompleted,
  onClick,
}) => {
  const containerClass = cn(
    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
    onClick && 'cursor-pointer',
    isCurrent && 'bg-primary-50 text-primary-700',
    !isCurrent && isCompleted && 'text-gray-700 hover:bg-gray-50',
    !isCurrent && !isCompleted && 'text-gray-400 hover:bg-gray-50'
  );

  const iconClass = cn(
    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
    isCurrent && 'bg-primary-600 text-white',
    isCompleted && !isCurrent && 'bg-green-100 text-green-700',
    !isCompleted && !isCurrent && 'bg-gray-100 text-gray-400'
  );

  return (
    <div className={containerClass} onClick={onClick}>
      <div className={iconClass}>
        {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{title}</div>
      </div>
    </div>
  );
};

// src/components/Layout.tsx - 사용
{steps.map((step) => (
  <StepIndicator
    key={step.id}
    stepNumber={step.id}
    title={step.title}
    isCurrent={currentStep === step.id}
    isCompleted={isStepCompleted(step.id)}
    onClick={() => setCurrentStep(step.id)}
  />
))}
```

---

### Example 4: EmptyState 컴포넌트

```typescript
// src/components/ui/EmptyState.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => (
  <div className={cn('text-center py-12', className)}>
    {Icon && (
      <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    )}
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      {title}
    </h3>
    {description && (
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        {description}
      </p>
    )}
    {action && (
      <Button onClick={action.onClick}>
        {action.label}
      </Button>
    )}
  </div>
);

// 사용 예시
<EmptyState
  icon={FileText}
  title="아직 프로젝트가 없습니다"
  description="새 프로젝트를 생성하여 시작하세요"
  action={{
    label: "프로젝트 생성",
    onClick: () => navigate('/create')
  }}
/>
```

---

### Example 5: className 유틸리티

```typescript
// src/lib/classNames.ts
import { cn } from './utils';

/**
 * 자주 사용되는 className 조합
 */
export const commonClasses = {
  // 카드 스타일
  card: 'bg-white rounded-lg border border-gray-200 p-6',
  cardHover: 'bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer',
  
  // 입력 필드
  inputLabel: 'block text-sm font-medium text-gray-700 mb-1',
  inputField: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent',
  
  // 버튼 그룹
  buttonGroup: 'flex gap-2',
  
  // 섹션 구분
  section: 'py-6 border-b border-gray-200 last:border-b-0',
  
  // 페이지 컨테이너
  pageContainer: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
} as const;

/**
 * 조건부 스타일 헬퍼
 */
export const getStatusClass = (status: 'success' | 'error' | 'warning' | 'info') => {
  const statusMap = {
    success: 'bg-green-100 text-green-800 border-green-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return statusMap[status];
};

// 사용 예시
import { commonClasses, getStatusClass } from '../lib/classNames';

<div className={commonClasses.card}>
  <label className={commonClasses.inputLabel}>프로젝트 이름</label>
  <input className={commonClasses.inputField} />
</div>

<Badge className={getStatusClass('success')}>완료</Badge>
```

## 📁 New Files to Create

```
src/
├── components/
│   ├── ui/
│   │   ├── FeatureIcon.tsx       (NEW)
│   │   ├── SectionHeader.tsx     (NEW)
│   │   └── EmptyState.tsx        (NEW)
│   └── wizard/
│       └── StepIndicator.tsx     (NEW)
└── lib/
    └── classNames.ts             (NEW)
```

## ⚠️ Considerations

1. **과도한 추상화 지양**: 2-3회 이상 반복될 때만 컴포넌트화
2. **Props 설계**: 유연하되 복잡하지 않게
3. **기본값 제공**: 일반적인 사용 케이스를 기본값으로
4. **타입 안정성**: TypeScript 타입을 명확히 정의
5. **문서화**: 복잡한 컴포넌트는 JSDoc 추가

## 🔗 Related Issues

- #001 - React.memo 적용 (새로 생성한 컴포넌트에도 적용)
- #004 - 매직 넘버 제거 (상수와 함께 활용)
- #008 - 복잡한 컴포넌트 분리

## 📚 References

- [DRY Principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
- [React Component Patterns](https://kentcdodds.com/blog/react-component-patterns)
- [Compound Components](https://kentcdodds.com/blog/compound-components-with-react-hooks)

## ✅ Acceptance Criteria

- [ ] 모든 중복 코드가 재사용 가능한 컴포넌트로 추출됨
- [ ] 새로운 컴포넌트들이 TypeScript로 타입 안전하게 작성됨
- [ ] 기존 코드에서 새 컴포넌트를 사용하도록 변경됨
- [ ] 컴포넌트에 적절한 Props 설계 및 기본값 설정
- [ ] 코드 라인 수가 30% 이상 감소
- [ ] 새 컴포넌트에 React.memo 적용 (성능 최적화)

## ⏱️ Estimated Time

**2일** (16시간)
- FeatureIcon, EmptyState 생성: 2시간
- SectionHeader 생성: 2시간
- StepIndicator 생성: 3시간
- classNames 유틸리티 생성: 2시간
- 기존 코드 리팩토링: 5시간
- 테스트 및 검증: 2시간

## 👤 Assignee

_To be assigned_

## 📅 Timeline

- **Start Date**: 2025-11-23
- **Due Date**: 2025-11-24
- **Completed Date**: -

## 💬 Notes

이 작업은 코드베이스의 전반적인 품질을 크게 향상시키며, 향후 개발 속도도 빠르게 만듭니다. Priority 1 작업 완료 후 진행하는 것이 좋습니다.

