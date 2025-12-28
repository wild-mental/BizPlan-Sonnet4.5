# [#006] Error Boundary 및 에러 처리 로직 추가

## 📌 Status
`🟡 In Progress`

## 🏷️ Labels
`reliability` `error-handling` `priority-2`

## 📝 Description

현재 애플리케이션에는 체계적인 에러 핸들링이 부족하여 런타임 에러 발생 시 사용자 경험이 저하됩니다. Error Boundary를 구현하고 try-catch 블록을 추가하여 안정성을 높여야 합니다.

## 🎯 Goal

에러 발생 시 애플리케이션이 중단되지 않고, 사용자에게 적절한 피드백을 제공하여 **신뢰성을 향상**시킵니다.

## 📋 Tasks

### 1. Error Boundary 구현

- [x] `src/components/ErrorBoundary.tsx` 생성 ✅
- [x] 전역 Error Boundary를 App에 적용 ✅
- [ ] 페이지별 Error Boundary 적용 (선택적)
- [x] 에러 로깅 로직 추가 (Sentry 준비) ✅

### 2. API 에러 처리 (향후 대비)

- [ ] `src/lib/apiClient.ts` 생성
- [ ] API 에러 타입 정의
- [ ] 공통 에러 핸들러 구현
- [ ] Toast 알림과 연동

### 3. 비즈니스 로직 에러 처리

- [ ] BusinessPlanViewer의 생성 로직에 try-catch 추가
- [ ] FinancialSimulation의 계산 로직에 에러 처리 추가
- [ ] Store의 중요 액션에 에러 처리 추가

### 4. Form Validation 에러 처리

- [ ] QuestionForm에 validation 에러 처리
- [ ] ProjectCreate에 폼 검증 로직 강화
- [ ] 사용자 친화적인 에러 메시지 작성

### 5. Fallback UI 컴포넌트

- [ ] `src/components/ErrorFallback.tsx` 생성
- [ ] `src/components/LoadingFallback.tsx` 생성

## 💡 Implementation Example

### Example 1: Error Boundary

```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 로깅 (추후 Sentry로 전송)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 커스텀 에러 핸들러 호출
    this.props.onError?.(error, errorInfo);
    
    // TODO: Send to error tracking service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

// src/components/ErrorFallback.tsx
import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface ErrorFallbackProps {
  error: Error | null;
  onReset?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
    onReset?.();
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-8 h-8" />
            <CardTitle>문제가 발생했습니다</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            예상치 못한 오류가 발생했습니다. 불편을 드려 죄송합니다.
          </p>
          
          {process.env.NODE_ENV === 'development' && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-mono text-red-800 break-all">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleReload}
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
            <Button
              variant="outline"
              onClick={handleGoHome}
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              홈으로
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            문제가 계속되면 관리자에게 문의해주세요.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// src/App.tsx - 적용
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ProjectCreate />} />
            <Route path="wizard/:projectId/:stepNumber" element={<WizardStep />} />
            <Route path="business-plan/:projectId" element={<BusinessPlanViewer />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
```

---

### Example 2: API 에러 처리 (향후 대비)

```typescript
// src/lib/apiErrors.ts
export enum ApiErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return '알 수 없는 오류가 발생했습니다.';
};

// src/lib/apiClient.ts
import axios, { AxiosError } from 'axios';
import { ApiError, ApiErrorCode } from './apiErrors';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 토큰 추가 등
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      // 네트워크 에러
      throw new ApiError(
        ApiErrorCode.NETWORK_ERROR,
        '네트워크 연결을 확인해주세요.'
      );
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        throw new ApiError(
          ApiErrorCode.UNAUTHORIZED,
          '로그인이 필요합니다.',
          status
        );
      case 403:
        throw new ApiError(
          ApiErrorCode.FORBIDDEN,
          '접근 권한이 없습니다.',
          status
        );
      case 404:
        throw new ApiError(
          ApiErrorCode.NOT_FOUND,
          '요청한 리소스를 찾을 수 없습니다.',
          status
        );
      case 422:
        throw new ApiError(
          ApiErrorCode.VALIDATION_ERROR,
          '입력값을 확인해주세요.',
          status,
          data
        );
      default:
        throw new ApiError(
          ApiErrorCode.SERVER_ERROR,
          '서버 오류가 발생했습니다.',
          status
        );
    }
  }
);
```

---

### Example 3: 비즈니스 로직 에러 처리

```typescript
// src/pages/BusinessPlanViewer.tsx
import { useState } from 'react';
import { toast } from 'react-hot-toast'; // or your toast library
import { getErrorMessage } from '../lib/apiErrors';

export const BusinessPlanViewer: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // 실제 API 호출
      const result = await generateBusinessPlan(wizardData);
      setSections(result.sections);
      setIsGenerated(true);
      toast.success('사업계획서가 생성되었습니다.');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
      
      // 개발 환경에서는 콘솔에 상세 로그
      if (process.env.NODE_ENV === 'development') {
        console.error('Business plan generation failed:', err);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">오류 발생</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <Button onClick={handleGenerate} isLoading={isGenerating}>
        생성하기
      </Button>
    </div>
  );
};
```

---

### Example 4: Store 에러 처리

```typescript
// src/stores/useWizardStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WizardState {
  // ... existing state
  error: string | null;
  setError: (error: string | null) => void;
  updateStepData: (stepId: number, questionId: string, value: any) => void;
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      // ... existing state
      error: null,

      setError: (error) => set({ error }),

      updateStepData: (stepId, questionId, value) => {
        try {
          const { wizardData } = get();
          
          // Validation
          if (!stepId || !questionId) {
            throw new Error('Invalid step or question ID');
          }

          set({
            wizardData: {
              ...wizardData,
              [stepId]: {
                ...wizardData[stepId],
                [questionId]: value,
              },
            },
            error: null, // 성공 시 에러 초기화
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '데이터 업데이트 실패';
          set({ error: errorMessage });
          console.error('Failed to update step data:', error);
        }
      },
    }),
    {
      name: 'wizard-storage',
    }
  )
);
```

---

### Example 5: Form Validation 에러

```typescript
// src/components/wizard/QuestionForm.tsx
import { z } from 'zod';

const questionSchema = z.object({
  'item-name': z.string().min(1, '아이템명을 입력해주세요'),
  'target-customer': z.string().min(10, '최소 10자 이상 입력해주세요'),
  'customer-problem': z.string().min(20, '최소 20자 이상 입력해주세요'),
});

export const QuestionForm: React.FC<QuestionFormProps> = ({ questions, stepId }) => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleValidate = (questionId: string, value: any) => {
    try {
      questionSchema.shape[questionId].parse(value);
      // 검증 성공 - 에러 제거
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors((prev) => ({
          ...prev,
          [questionId]: error.errors[0].message,
        }));
      }
      return false;
    }
  };

  const handleChange = (questionId: string, value: any) => {
    updateStepData(stepId, questionId, value);
    handleValidate(questionId, value);
  };

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <div key={question.id}>
          <Input
            label={question.label}
            value={stepData[question.id] || ''}
            onChange={(e) => handleChange(question.id, e.target.value)}
            error={validationErrors[question.id]}
          />
        </div>
      ))}
    </div>
  );
};
```

## 📁 New Files to Create

```
src/
├── components/
│   ├── ErrorBoundary.tsx         (NEW)
│   ├── ErrorFallback.tsx         (NEW)
│   └── LoadingFallback.tsx       (NEW)
└── lib/
    ├── apiClient.ts              (NEW)
    └── apiErrors.ts              (NEW)
```

## ⚠️ Considerations

1. **에러 로깅**: Sentry 등 에러 트래킹 서비스 도입 고려
2. **사용자 친화적 메시지**: 기술적인 에러 메시지는 숨기고 이해하기 쉬운 메시지 표시
3. **재시도 로직**: 네트워크 에러 등에서 자동 재시도 고려
4. **Fallback UI**: 로딩 중 에러가 발생해도 부분적인 UI는 표시
5. **개발/프로덕션 구분**: 개발 환경에서는 상세 에러, 프로덕션에서는 간단한 메시지

## 🔗 Related Issues

- #007 - Custom Hook 추가 (useAsyncAction으로 에러 처리 추상화)
- #009 - 테스트 코드 추가 (에러 케이스 테스트)

## 📚 References

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Error Handling in React](https://kentcdodds.com/blog/use-react-error-boundary)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)

## ✅ Acceptance Criteria

- [ ] Error Boundary가 전역 및 주요 페이지에 적용됨
- [ ] 모든 비동기 작업에 try-catch 추가
- [ ] 사용자 친화적인 에러 메시지 작성
- [ ] API 에러 핸들링 인프라 구축
- [ ] Form validation 에러 처리 강화
- [ ] Fallback UI 컴포넌트 구현
- [ ] 에러 로깅 준비 (Sentry 통합 가능하도록)

## ⏱️ Estimated Time

**2일** (16시간)
- Error Boundary 구현: 3시간
- API 에러 처리 인프라: 4시간
- 비즈니스 로직 에러 처리: 4시간
- Form validation: 2시간
- Fallback UI: 2시간
- 테스트 및 검증: 1시간

## 👤 Assignee

_To be assigned_

## 📅 Timeline

- **Start Date**: 2025-11-23
- **Due Date**: 2025-11-24
- **Completed Date**: -

## 💬 Notes

에러 처리는 사용자 경험에 직접적인 영향을 미치므로 매우 중요합니다. 향후 프로덕션 환경에서 Sentry 등의 에러 모니터링 도구를 도입하는 것을 권장합니다.

