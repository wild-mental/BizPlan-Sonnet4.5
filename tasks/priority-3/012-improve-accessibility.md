# [#012] 접근성(A11y) 개선

## 📌 Status
`🔲 Todo`

## 🏷️ Labels
`accessibility` `a11y` `priority-3`

## 📝 Description

현재 애플리케이션의 접근성(Accessibility)이 부족하여 스크린 리더 사용자, 키보드 네비게이션 사용자 등이 사용하기 어려울 수 있습니다. WCAG 2.1 AA 기준을 충족하도록 접근성을 개선해야 합니다.

## 🎯 Goal

WCAG 2.1 AA 기준을 **80% 이상** 충족하여 모든 사용자가 애플리케이션을 불편 없이 사용할 수 있도록 합니다.

## 📋 Tasks

### 1. 시맨틱 HTML

- [ ] 적절한 HTML 태그 사용 (`<nav>`, `<main>`, `<article>` 등)
- [ ] Heading 계층 구조 확립 (h1 → h2 → h3)
- [ ] 랜드마크 역할 명시

### 2. ARIA 속성 추가

- [ ] `aria-label`, `aria-labelledby` 추가
- [ ] `aria-describedby` 추가
- [ ] `aria-live` 영역 설정 (동적 콘텐츠)
- [ ] `aria-expanded`, `aria-hidden` 등 상태 속성

### 3. 키보드 네비게이션

- [ ] 모든 인터랙티브 요소 Tab 접근 가능
- [ ] Focus 스타일 명확히 표시
- [ ] Modal/Dialog Trap Focus
- [ ] Skip to content 링크 추가

### 4. 색상 대비 개선

- [ ] WCAG AA 기준 대비율 4.5:1 이상
- [ ] 색상에만 의존하지 않는 정보 전달
- [ ] 포커스 인디케이터 명확히

### 5. 폼 접근성

- [ ] Label과 Input 연결
- [ ] 에러 메시지 명확히 전달
- [ ] 필수 필드 표시
- [ ] Placeholder는 Label 대용 금지

### 6. 이미지 및 아이콘 접근성

- [ ] 모든 이미지에 적절한 alt 텍스트
- [ ] 장식용 이미지는 `alt=""` 또는 `aria-hidden`
- [ ] 아이콘 버튼에 aria-label

### 7. 스크린 리더 테스트

- [ ] NVDA/JAWS (Windows) 테스트
- [ ] VoiceOver (Mac) 테스트
- [ ] 주요 플로우 테스트

## 💡 Implementation Example

### Example 1: 시맨틱 HTML 및 랜드마크

#### Before

```typescript
// ❌ div 남용, 의미 없는 구조
<div className="header">
  <div className="logo">Logo</div>
  <div className="nav">
    <div onClick={handleClick}>Home</div>
    <div onClick={handleClick}>About</div>
  </div>
</div>

<div className="content">
  <div className="sidebar">...</div>
  <div className="main">...</div>
</div>
```

#### After

```typescript
// ✅ 시맨틱 HTML 사용
<header role="banner">
  <div className="logo">Logo</div>
  <nav role="navigation" aria-label="주요 메뉴">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>

<div className="container">
  <aside role="complementary" aria-label="사이드바">
    {/* Sidebar content */}
  </aside>
  <main role="main" id="main-content">
    {/* Main content */}
  </main>
</div>

<footer role="contentinfo">
  {/* Footer content */}
</footer>
```

---

### Example 2: Heading 계층 구조

#### Before

```typescript
// ❌ 계층 구조 없음, 건너뛰기
<h1>프로젝트 생성</h1>
<h3>템플릿 선택</h3>  {/* h2를 건너뜀 */}
<h4>스타트업 초기 단계</h4>
```

#### After

```typescript
// ✅ 올바른 계층 구조
<h1>프로젝트 생성</h1>
<h2>템플릿 선택</h2>
<h3>스타트업 초기 단계</h3>
<p>상세 설명...</p>
```

---

### Example 3: ARIA 속성

```typescript
// src/components/wizard/QuestionForm.tsx
export const QuestionForm: React.FC<QuestionFormProps> = ({ questions, stepId }) => {
  return (
    <form 
      onSubmit={handleSubmit}
      aria-label="질문 응답 폼"
    >
      {questions.map((question) => (
        <div 
          key={question.id}
          role="group"
          aria-labelledby={`question-${question.id}`}
        >
          <label 
            id={`question-${question.id}`}
            htmlFor={`input-${question.id}`}
            className="block text-sm font-medium text-gray-700"
          >
            {question.label}
            {question.required && (
              <span 
                aria-label="필수" 
                className="text-red-600"
              >
                *
              </span>
            )}
          </label>
          
          {question.description && (
            <p 
              id={`description-${question.id}`}
              className="text-sm text-gray-600 mt-1"
            >
              {question.description}
            </p>
          )}
          
          <Input
            id={`input-${question.id}`}
            name={question.id}
            value={stepData[question.id] || ''}
            onChange={(e) => handleChange(question.id, e.target.value)}
            aria-describedby={
              question.description 
                ? `description-${question.id}` 
                : undefined
            }
            aria-required={question.required}
            aria-invalid={!!errors[question.id]}
          />
          
          {errors[question.id] && (
            <div 
              role="alert"
              aria-live="polite"
              className="text-red-600 text-sm mt-1"
            >
              {errors[question.id]}
            </div>
          )}
        </div>
      ))}
    </form>
  );
};
```

---

### Example 4: 키보드 네비게이션 및 Focus Management

```typescript
// src/components/Layout.tsx
export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg"
      >
        본문으로 건너뛰기
      </a>

      <header>
        {/* Header content */}
      </header>

      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
};

// src/index.css - Focus 스타일
/* ✅ 명확한 focus indicator */
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Skip to content를 스크린 리더에서만 보이게 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

### Example 5: Modal Focus Trap

```typescript
// src/components/Modal.tsx
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // 모달이 열릴 때 첫 번째 포커스 가능한 요소로 포커스 이동
    closeButtonRef.current?.focus();

    // Focus trap 구현
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        // Tab + Shift: 첫 요소에서 마지막으로
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
        // Tab: 마지막 요소에서 첫 번째로
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-xl font-bold">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="모달 닫기"
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
```

---

### Example 6: 버튼 및 아이콘 접근성

```typescript
// src/components/ui/Button.tsx
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', isLoading = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        aria-busy={isLoading}
        aria-disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2" aria-hidden="true" />
            <span className="sr-only">로딩 중...</span>
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

// 아이콘만 있는 버튼
<button
  onClick={handleDelete}
  aria-label="삭제"
  title="삭제"
>
  <Trash2 className="w-5 h-5" aria-hidden="true" />
</button>

// 텍스트와 아이콘 함께 있는 버튼
<button onClick={handleSave}>
  <Save className="w-4 h-4 mr-2" aria-hidden="true" />
  저장
</button>
```

---

### Example 7: 색상 대비 개선

```typescript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        // ✅ WCAG AA 기준을 충족하는 색상
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // 흰색 배경에 4.5:1 대비
          600: '#2563eb',  // 더 높은 대비
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // 에러, 경고, 성공 색상도 충분한 대비 확보
        error: {
          600: '#dc2626',  // 흰색 배경에 4.5:1 이상
        },
        success: {
          600: '#16a34a',
        },
        warning: {
          600: '#ca8a04',
        },
      },
    },
  },
};

// 색상에만 의존하지 않는 정보 전달
<div className="flex items-center gap-2">
  <Badge className="bg-red-100 text-red-800 border border-red-200">
    <XCircle className="w-4 h-4 mr-1" aria-hidden="true" />
    오류
  </Badge>
  <Badge className="bg-green-100 text-green-800 border border-green-200">
    <CheckCircle className="w-4 h-4 mr-1" aria-hidden="true" />
    완료
  </Badge>
</div>
```

---

### Example 8: 동적 콘텐츠 알림

```typescript
// src/components/SaveIndicator.tsx
export const SaveIndicator: React.FC = () => {
  const { lastSaved, isSaving } = useAutoSave();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="flex items-center gap-2 text-sm"
    >
      {isSaving ? (
        <>
          <Spinner size="sm" aria-hidden="true" />
          <span>저장 중...</span>
        </>
      ) : lastSaved ? (
        <>
          <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />
          <span>
            마지막 저장: {formatDistanceToNow(lastSaved, { locale: ko, addSuffix: true })}
          </span>
        </>
      ) : null}
    </div>
  );
};
```

---

### Example 9: 접근성 테스트 도구 설정

```typescript
// package.json
{
  "devDependencies": {
    "@axe-core/react": "^4.8.0",
    "eslint-plugin-jsx-a11y": "^6.8.0"
  }
}

// src/main.tsx (개발 환경에서만)
if (process.env.NODE_ENV !== 'production') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}

// .eslintrc.js
module.exports = {
  extends: [
    'plugin:jsx-a11y/recommended',
  ],
  plugins: ['jsx-a11y'],
  rules: {
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/no-autofocus': 'warn',
  },
};
```

## 📁 Files to Update

```
src/
├── components/
│   ├── Layout.tsx                  (UPDATE - 시맨틱 HTML, Skip link)
│   ├── Modal.tsx                   (NEW - Focus trap)
│   ├── ui/
│   │   ├── Button.tsx              (UPDATE - ARIA 속성)
│   │   ├── Input.tsx               (UPDATE - Label 연결)
│   │   └── ...
│   └── wizard/
│       └── QuestionForm.tsx        (UPDATE - ARIA, 에러 처리)
├── index.css                       (UPDATE - Focus 스타일)
└── main.tsx                        (UPDATE - axe-core 추가)
```

## ⚠️ Considerations

1. **과도한 ARIA 지양**: 네이티브 HTML이 우선, ARIA는 보완
2. **테스트 필수**: 실제 스크린 리더로 테스트
3. **점진적 개선**: 한 번에 모든 것을 고치려 하지 말고 우선순위별로
4. **디자인과 협업**: 색상 대비 등은 디자이너와 협의
5. **법적 요구사항**: 특정 국가/산업에서는 접근성이 법적 의무

## 🔗 Related Issues

- #005 - 중복 코드 제거 (새 컴포넌트에도 접근성 적용)
- #006 - 에러 처리 (에러 메시지 접근성)

## 📚 References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [React Accessibility](https://react.dev/learn/accessibility)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## ✅ Acceptance Criteria

- [ ] 모든 페이지에 시맨틱 HTML 적용
- [ ] Heading 계층 구조 확립
- [ ] 모든 폼에 Label-Input 연결
- [ ] ARIA 속성 추가 (live region, label 등)
- [ ] 키보드로 모든 기능 사용 가능
- [ ] Focus 스타일 명확히 표시
- [ ] Modal/Dialog에 Focus trap 구현
- [ ] 색상 대비 4.5:1 이상
- [ ] 모든 이미지/아이콘에 적절한 텍스트 대체
- [ ] axe-core 검사 통과 (치명적 오류 0개)
- [ ] ESLint jsx-a11y 규칙 통과
- [ ] 스크린 리더 테스트 완료

## ⏱️ Estimated Time

**3일** (24시간)
- 시맨틱 HTML 및 구조 개선: 4시간
- ARIA 속성 추가: 5시간
- 키보드 네비게이션 및 Focus 관리: 5시간
- 색상 대비 개선: 2시간
- 폼 접근성 개선: 3시간
- 스크린 리더 테스트: 3시간
- 문서화: 2시간

## 👤 Assignee

_To be assigned_

## 📅 Timeline

- **Start Date**: 2025-11-24
- **Due Date**: 2025-11-27
- **Completed Date**: -

## 💬 Notes

접근성은 모든 사용자를 위한 것이며, 장애인뿐만 아니라 임시적 장애(부상, 환경) 사용자, 고령자, 저속 인터넷 사용자 등 모두에게 도움이 됩니다. 또한 SEO에도 긍정적인 영향을 미칩니다.

