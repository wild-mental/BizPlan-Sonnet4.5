# Backend Async Processing Improvement Plan
## System Performance and Multi-User Service Scale Enhancement

**작성일**: 2025-01-XX  
**목적**: 백엔드 비동기 처리 전환에 따른 프론트엔드 호출 방식 변경 및 구현 계획 정리

---

## 1. 개요

### 1.1 배경
백엔드에서 장시간 소요되는 작업들(Gemini API 호출, 문서 생성, 이메일 발송 등)을 비동기로 전환하여 시스템 성능과 다중 사용자 서비스 규모를 개선합니다.

### 1.2 목표
- **응답성 향상**: 사용자가 장시간 대기하지 않고 즉시 피드백 받기
- **서버 부하 분산**: 동기 요청으로 인한 스레드 블로킹 방지
- **확장성 개선**: 동시 다중 사용자 처리 능력 향상
- **사용자 경험 개선**: 진행 상태 표시 및 중단/재시도 기능 제공

### 1.3 범위
이 문서는 프론트엔드 관점에서의 변경사항을 다룹니다. 백엔드 구현 세부사항은 별도 문서를 참조하세요.

---

## 2. 현재 구현 상태 점검

### 2.1 이미 비동기 처리된 엔드포인트

#### ✅ `POST /api/v1/evaluations`
- **현재 상태**: 비동기 처리 완료
- **구현 위치**: 
  - `src/services/evaluationApi.ts` - API 클라이언트
  - `src/stores/useEvaluationStore.ts` - 상태 관리 및 폴링
- **폴링 메커니즘**: `useEvaluationStore.pollStatus()` 사용
- **상태 조회**: `GET /api/v1/evaluations/{evaluationId}/status`
- **결과 조회**: `GET /api/v1/evaluations/{evaluationId}/result`

#### ✅ `POST /api/v1/projects/{projectId}/export`
- **현재 상태**: 비동기 처리 완료
- **구현 위치**:
  - `src/services/exportApi.ts` - API 클라이언트
  - `src/hooks/useDocumentExport.ts` - 폴링 훅
- **폴링 메커니즘**: `usePolling` 훅 사용
- **상태 조회**: `GET /api/v1/exports/{exportId}/status`
- **다운로드**: `GET /api/v1/exports/{exportId}/download`

### 2.2 동기 처리로 되어 있는 엔드포인트 (변경 필요)

#### ❌ `POST /api/v1/business-plan/generate`
- **현재 상태**: 동기 처리 (직접 응답 대기)
- **구현 위치**: 
  - `src/services/businessPlanApi.ts` - API 클라이언트
  - `src/pages/WizardStep.tsx` - `handleGenerateBusinessPlan()` 함수
- **현재 동작**: 
  ```typescript
  const response = await generateBusinessPlan(requestData);
  // 응답을 직접 기다림 (3-15초 대기)
  ```
- **문제점**: 
  - 타임아웃 위험 (현재 30초)
  - 사용자가 장시간 대기
  - 진행 상태 표시 불가

#### ❌ `POST /api/v1/auth/signup`
- **현재 상태**: 동기 처리
- **구현 위치**: `src/services/authApi.ts`
- **현재 동작**: 이메일 발송 완료까지 대기
- **문제점**: SMTP 호출 지연으로 인한 느린 응답

#### ❌ `POST /api/v1/auth/verify-email/resend`
- **현재 상태**: 동기 처리
- **구현 위치**: `src/services/authApi.ts`
- **현재 동작**: 이메일 발송 완료까지 대기
- **문제점**: SMTP 호출 지연으로 인한 느린 응답

#### ❌ `POST /api/v1/auth/password/reset-request`
- **현재 상태**: 동기 처리
- **구현 위치**: `src/services/authApi.ts`
- **현재 동작**: 이메일 발송 완료까지 대기
- **문제점**: SMTP 호출 지연으로 인한 느린 응답

#### ❌ `POST /api/v1/projects/{projectId}/financial/simulate`
- **현재 상태**: 프론트엔드 클라이언트 사이드 계산만 수행 (백엔드 API 호출 없음)
- **구현 위치**: `src/stores/useFinancialStore.ts`
- **현재 동작**: 클라이언트에서 직접 계산
- **참고**: 향후 복잡한 계산 로직이 백엔드로 이동할 경우를 대비

### 2.3 현재 프론트엔드 인프라

#### ✅ 폴링 인프라
- **파일**: `src/hooks/usePolling.ts`
- **기능**: 
  - 주기적 API 호출
  - 자동 중지 조건 설정
  - 에러 처리
  - 성공/실패 콜백

#### ✅ API 클라이언트
- **파일**: `src/services/apiClient.ts`
- **설정**:
  - 타임아웃: 30초
  - 인증 토큰 자동 추가
  - 에러 인터셉터
  - 개발 환경 로깅

#### ✅ 상태 관리
- **라이브러리**: Zustand (persist middleware)
- **패턴**: 각 기능별 Store 분리

---

## 3. 비동기 전환 시 필요한 변경사항

### 3.1 공통 패턴

모든 비동기 엔드포인트는 다음 패턴을 따릅니다:

```
1. 요청 엔드포인트: POST /api/v1/{resource}
   → 응답: { taskId: string, status: 'pending' | 'processing' }

2. 상태 조회 엔드포인트: GET /api/v1/{resource}/{taskId}/status
   → 응답: { status: 'pending' | 'processing' | 'completed' | 'failed', progress?: number }

3. 결과 조회 엔드포인트: GET /api/v1/{resource}/{taskId}/result (완료 시)
   → 응답: { ...실제 결과 데이터... }
```

### 3.2 프론트엔드 호출 흐름 변경

#### Before (동기 처리)
```typescript
// 사용자가 버튼 클릭
const handleSubmit = async () => {
  setIsLoading(true);
  try {
    const response = await api.create(data);
    // 3-15초 대기...
    setResult(response.data);
  } catch (error) {
    setError(error);
  } finally {
    setIsLoading(false);
  }
};
```

#### After (비동기 처리)
```typescript
// 사용자가 버튼 클릭
const handleSubmit = async () => {
  setIsLoading(true);
  try {
    // 1. 작업 시작 요청
    const response = await api.create(data);
    const taskId = response.data.taskId;
    
    // 2. 폴링 시작
    startPolling(taskId);
  } catch (error) {
    setError(error);
    setIsLoading(false);
  }
};

// 폴링 로직
const startPolling = (taskId: string) => {
  const poll = async () => {
    const status = await api.getStatus(taskId);
    if (status.status === 'completed') {
      const result = await api.getResult(taskId);
      setResult(result);
      stopPolling();
    } else if (status.status === 'failed') {
      setError(status.errorMessage);
      stopPolling();
    }
    // 'pending' 또는 'processing'이면 계속 폴링
  };
  
  const interval = setInterval(poll, 2000);
  // stopPolling()에서 clearInterval(interval)
};
```

---

## 4. 엔드포인트별 상세 변경 계획

### 4.1 높은 우선순위

#### 4.1.1 `POST /api/v1/business-plan/generate`

**현재 구현 위치**:
- `src/services/businessPlanApi.ts`
- `src/pages/WizardStep.tsx` (167-249줄)
- `src/stores/useBusinessPlanStore.ts`

**변경 사항**:

1. **API 클라이언트 수정** (`src/services/businessPlanApi.ts`):
```typescript
export interface BusinessPlanGenerateResponse {
  // 변경 전: 전체 결과 포함
  // 변경 후: taskId만 반환
  taskId: string;
  status: 'pending' | 'processing';
  estimatedTime?: number; // 예상 소요 시간 (초)
}

export interface BusinessPlanStatus {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number; // 0-100
  currentStage?: string; // 'analyzing', 'generating', 'formatting' 등
  estimatedRemaining?: number; // 예상 남은 시간 (초)
  errorMessage?: string;
}

export const businessPlanApi = {
  // 변경: 즉시 taskId 반환
  generate: (data: BusinessPlanGenerateRequest) =>
    apiClient.post<ApiResponse<BusinessPlanGenerateResponse>>(
      '/api/v1/business-plan/generate', 
      data
    ),

  // 신규: 상태 조회
  getStatus: (taskId: string) =>
    apiClient.get<ApiResponse<BusinessPlanStatus>>(
      `/api/v1/business-plan/${taskId}/status`
    ),

  // 신규: 결과 조회 (완료 시)
  getResult: (taskId: string) =>
    apiClient.get<ApiResponse<BusinessPlanGenerateResponse>>(
      `/api/v1/business-plan/${taskId}/result`
    ),

  // 기존 유지
  get: (businessPlanId: string) =>
    apiClient.get<ApiResponse<BusinessPlanGenerateResponse>>(
      `/api/v1/business-plan/${businessPlanId}`
    ),
};
```

2. **Store 수정** (`src/stores/useBusinessPlanStore.ts`):
```typescript
interface BusinessPlanState {
  // 기존 필드...
  
  // 신규: 비동기 작업 상태
  generationTaskId: string | null;
  generationStatus: 'idle' | 'pending' | 'processing' | 'completed' | 'failed';
  generationProgress: number; // 0-100
  generationStage: string | null;
  
  // 신규: 액션
  startGeneration: (requestData: BusinessPlanGenerateRequest) => Promise<string>;
  pollGenerationStatus: (taskId: string) => Promise<void>;
  fetchGenerationResult: (taskId: string) => Promise<void>;
  cancelGeneration: () => void;
}

export const useBusinessPlanStore = create<BusinessPlanState>()(
  persist(
    (set, get) => ({
      // ... 기존 상태 ...
      generationTaskId: null,
      generationStatus: 'idle',
      generationProgress: 0,
      generationStage: null,

      startGeneration: async (requestData) => {
        set({ 
          generationStatus: 'pending', 
          generationProgress: 0,
          error: null 
        });
        
        try {
          const response = await businessPlanApi.generate(requestData);
          if (response.data.success && response.data.data) {
            const taskId = response.data.data.taskId;
            set({ generationTaskId: taskId });
            return taskId;
          }
          throw new Error('생성 요청 실패');
        } catch (error: any) {
          set({
            generationStatus: 'failed',
            error: error.response?.data?.error?.message || '생성 시작 실패',
          });
          throw error;
        }
      },

      pollGenerationStatus: async (taskId: string) => {
        try {
          const response = await businessPlanApi.getStatus(taskId);
          if (response.data.success && response.data.data) {
            const status = response.data.data;
            set({
              generationStatus: status.status,
              generationProgress: status.progress || 0,
              generationStage: status.currentStage || null,
            });

            if (status.status === 'completed') {
              // 결과 조회
              await get().fetchGenerationResult(taskId);
            } else if (status.status === 'failed') {
              set({
                error: status.errorMessage || '생성 실패',
                generationStatus: 'failed',
              });
            }
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.error?.message || '상태 조회 실패',
            generationStatus: 'failed',
          });
          throw error;
        }
      },

      fetchGenerationResult: async (taskId: string) => {
        try {
          const response = await businessPlanApi.getResult(taskId);
          if (response.data.success && response.data.data) {
            const plan = response.data.data;
            // 기존 setGeneratedPlan 로직 사용
            const generatedData = {
              id: plan.businessPlanId,
              projectId: plan.projectId,
              // ... 변환 로직 ...
            };
            get().setGeneratedPlan(generatedData);
            set({ 
              generationStatus: 'completed',
              generationProgress: 100,
            });
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.error?.message || '결과 조회 실패',
            generationStatus: 'failed',
          });
          throw error;
        }
      },

      cancelGeneration: () => {
        set({
          generationTaskId: null,
          generationStatus: 'idle',
          generationProgress: 0,
          generationStage: null,
        });
      },
    }),
    { name: 'business-plan-storage' }
  )
);
```

3. **컴포넌트 수정** (`src/pages/WizardStep.tsx`):
```typescript
const handleGenerateBusinessPlan = useCallback(async () => {
  setIsGenerating(true);
  setGenerationError(null);
  
  // ... 요청 데이터 구성 ...
  
  try {
    // 1. 작업 시작
    const taskId = await useBusinessPlanStore.getState().startGeneration(requestData);
    
    // 2. 폴링 시작
    const { isPolling } = usePolling<BusinessPlanStatus>({
      fetcher: async () => {
        const response = await businessPlanApi.getStatus(taskId);
        if (response.data.success && response.data.data) {
          return response.data.data;
        }
        throw new Error('상태 조회 실패');
      },
      interval: 2000, // 2초마다 조회
      enabled: true,
      stopCondition: (data) => 
        data.status === 'completed' || data.status === 'failed',
      onSuccess: async (data) => {
        if (data.status === 'completed') {
          // 결과 조회 및 저장
          await useBusinessPlanStore.getState().fetchGenerationResult(taskId);
          setIsGenerating(false);
          navigate('/business-plan');
        } else if (data.status === 'failed') {
          setGenerationError(data.errorMessage || '생성 실패');
          setIsGenerating(false);
        }
      },
      onError: (error) => {
        setGenerationError(error.message);
        setIsGenerating(false);
      },
    });
    
  } catch (err) {
    setGenerationError(err instanceof Error ? err.message : '알 수 없는 오류');
    setIsGenerating(false);
  }
}, [/* ... */]);
```

4. **UI 개선**: 진행 상태 표시 컴포넌트 추가
```typescript
// src/components/wizard/GenerationProgress.tsx
export const GenerationProgress: React.FC = () => {
  const { generationStatus, generationProgress, generationStage } = 
    useBusinessPlanStore();
  
  if (generationStatus === 'idle') return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">사업계획서 생성 중...</h3>
        
        {/* 진행 바 */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${generationProgress}%` }}
          />
        </div>
        
        {/* 현재 단계 */}
        {generationStage && (
          <p className="text-sm text-gray-600 mb-2">
            {getStageLabel(generationStage)}
          </p>
        )}
        
        {/* 진행률 */}
        <p className="text-sm text-gray-500">{generationProgress}%</p>
        
        {/* 취소 버튼 */}
        <button
          onClick={() => useBusinessPlanStore.getState().cancelGeneration()}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          취소
        </button>
      </div>
    </div>
  );
};
```

**작업 항목**:
- [ ] `businessPlanApi.ts` - API 클라이언트 수정
- [ ] `useBusinessPlanStore.ts` - Store에 비동기 상태 추가
- [ ] `WizardStep.tsx` - 폴링 로직 추가
- [ ] `GenerationProgress.tsx` - 진행 상태 UI 컴포넌트 생성
- [ ] 타입 정의 추가 (`BusinessPlanStatus`)

---

#### 4.1.2 `POST /api/v1/evaluations`

**현재 상태**: 이미 비동기 처리 완료

**개선 사항**:
- 현재 구현이 올바르게 되어 있으나, 에러 처리 및 재시도 로직 강화 필요
- 진행 상태 표시 UI 개선

**작업 항목**:
- [ ] 에러 발생 시 재시도 로직 추가
- [ ] 타임아웃 처리 (예: 5분 초과 시 자동 취소)
- [ ] 진행 상태 UI 개선

---

#### 4.1.3 `POST /api/v1/projects/{projectId}/export`

**현재 상태**: 이미 비동기 처리 완료

**개선 사항**:
- 현재 구현이 올바르게 되어 있으나, 대용량 파일 처리 시 메모리 최적화 필요

**작업 항목**:
- [ ] 다운로드 진행률 표시 (Blob 다운로드 시)
- [ ] 대용량 파일 처리 최적화

---

### 4.2 중간 우선순위

#### 4.2.1 `POST /api/v1/auth/signup`

**현재 구현 위치**: `src/services/authApi.ts`

**변경 사항**:

1. **API 클라이언트 수정**:
```typescript
export interface SignupResponse {
  // 변경 전: 즉시 사용자 정보 반환
  // 변경 후: 이메일 발송 작업 ID 반환
  taskId: string;
  user: User; // 기본 사용자 정보는 즉시 반환
  status: 'pending' | 'completed';
}

export interface EmailTaskStatus {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errorMessage?: string;
}

export const authApi = {
  signup: (data: SignupRequest) =>
    apiClient.post<ApiResponse<SignupResponse>>('/api/v1/auth/signup', data),

  // 신규: 이메일 발송 상태 조회
  getEmailTaskStatus: (taskId: string) =>
    apiClient.get<ApiResponse<EmailTaskStatus>>(
      `/api/v1/auth/email-tasks/${taskId}/status`
    ),
  
  // 기존 유지
  // ...
};
```

2. **Store 수정** (`src/stores/useAuthStore.ts`):
```typescript
interface AuthState {
  // 기존 필드...
  
  // 신규: 이메일 발송 상태
  emailTaskId: string | null;
  emailTaskStatus: 'idle' | 'pending' | 'completed' | 'failed';
  
  // 신규: 액션
  pollEmailTask: (taskId: string) => Promise<void>;
}

// signup 액션 수정
signup: async (data: SignupRequest) => {
  set({ isLoading: true, error: null });
  try {
    const response = await authApi.signup(data);
    if (response.data.success && response.data.data) {
      const { user, tokens, taskId } = response.data.data;
      
      // 사용자 정보는 즉시 저장
      set({ user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
      
      // 이메일 발송은 비동기로 처리
      if (taskId) {
        set({ emailTaskId: taskId, emailTaskStatus: 'pending' });
        // 백그라운드에서 폴링 (선택적)
        // get().pollEmailTask(taskId);
      }
      
      set({ isLoading: false });
      return { user, tokens };
    }
    throw new Error('회원가입 실패');
  } catch (error: any) {
    set({
      error: error.response?.data?.error?.message || '회원가입 실패',
      isLoading: false,
    });
    throw error;
  }
},
```

3. **컴포넌트 수정** (`src/pages/SignupPage.tsx`):
```typescript
// 이메일 발송은 백그라운드에서 처리되므로 사용자 경험에 큰 영향 없음
// 다만, 이메일 발송 실패 시 재시도 버튼 제공 가능
```

**작업 항목**:
- [ ] `authApi.ts` - API 클라이언트 수정
- [ ] `useAuthStore.ts` - 이메일 작업 상태 추가
- [ ] 이메일 발송 실패 시 재시도 UI 추가 (선택적)

---

#### 4.2.2 `POST /api/v1/auth/verify-email/resend`

**변경 사항**: `signup`과 동일한 패턴 적용

**작업 항목**:
- [ ] `authApi.ts` - API 클라이언트 수정
- [ ] `VerifyEmailPage.tsx` - 폴링 로직 추가 (선택적, 사용자 경험 개선)

---

#### 4.2.3 `POST /api/v1/auth/password/reset-request`

**변경 사항**: `signup`과 동일한 패턴 적용

**작업 항목**:
- [ ] `authApi.ts` - API 클라이언트 수정
- [ ] `ForgotPasswordPage.tsx` - 성공 메시지 표시 (이메일 발송은 백그라운드)

---

#### 4.2.4 `POST /api/v1/projects/{projectId}/financial/simulate`

**현재 상태**: 프론트엔드 클라이언트 사이드 계산

**참고 사항**:
- 현재는 백엔드 API 호출이 없음
- 향후 복잡한 계산 로직이 백엔드로 이동할 경우를 대비한 준비

**예상 변경사항** (향후):
```typescript
// 현재: 클라이언트 사이드 계산
updateInput: (input: Partial<FinancialInput>) => {
  // 즉시 계산
  const metrics = calculateMetrics(input);
  set({ input, metrics });
}

// 향후: 백엔드 API 호출 (비동기)
updateInput: async (input: Partial<FinancialInput>) => {
  set({ isLoading: true });
  try {
    const response = await financialApi.simulate(projectId, input);
    const taskId = response.data.taskId;
    // 폴링 시작...
  } catch (error) {
    // 에러 처리
  }
}
```

**작업 항목**:
- [ ] 백엔드 API 스펙 확정 대기
- [ ] API 스펙 확정 후 위 패턴 적용

---

## 5. 공통 유틸리티 및 훅 개선

### 5.1 `usePolling` 훅 개선

**현재 위치**: `src/hooks/usePolling.ts`

**개선 사항**:
1. **타임아웃 처리 추가**:
```typescript
interface UsePollingOptions<T> {
  // ... 기존 옵션 ...
  timeout?: number; // 최대 폴링 시간 (밀리초)
  onTimeout?: () => void;
}

export function usePolling<T>({
  // ... 기존 파라미터 ...
  timeout,
  onTimeout,
}: UsePollingOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (enabled && timeout) {
      timeoutRef.current = setTimeout(() => {
        setIsPolling(false);
        onTimeout?.();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, timeout);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [enabled, timeout, onTimeout]);
  
  // ... 기존 로직 ...
}
```

2. **재시도 로직 추가**:
```typescript
interface UsePollingOptions<T> {
  // ... 기존 옵션 ...
  maxRetries?: number; // 최대 재시도 횟수
  retryDelay?: number; // 재시도 지연 시간 (밀리초)
}

export function usePolling<T>({
  // ... 기존 파라미터 ...
  maxRetries = 3,
  retryDelay = 1000,
}: UsePollingOptions<T>) {
  const retryCountRef = useRef(0);
  
  const poll = useCallback(async () => {
    try {
      const result = await fetcher();
      retryCountRef.current = 0; // 성공 시 재시도 카운트 리셋
      // ... 기존 로직 ...
    } catch (err) {
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        setTimeout(poll, retryDelay);
      } else {
        const error = err as Error;
        setError(error);
        onError?.(error);
        setIsPolling(false);
      }
    }
  }, [fetcher, maxRetries, retryDelay, /* ... */]);
  
  // ... 기존 로직 ...
}
```

**작업 항목**:
- [ ] `usePolling.ts` - 타임아웃 처리 추가
- [ ] `usePolling.ts` - 재시도 로직 추가
- [ ] 타입 정의 업데이트

---

### 5.2 공통 진행 상태 컴포넌트

**신규 파일**: `src/components/common/AsyncTaskProgress.tsx`

```typescript
interface AsyncTaskProgressProps {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number; // 0-100
  stage?: string;
  errorMessage?: string;
  onCancel?: () => void;
  title?: string;
}

export const AsyncTaskProgress: React.FC<AsyncTaskProgressProps> = ({
  status,
  progress = 0,
  stage,
  errorMessage,
  onCancel,
  title = '처리 중...',
}) => {
  if (status === 'idle' || status === 'completed') return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        
        {status === 'failed' ? (
          <div className="text-red-600">
            <p className="font-medium">오류가 발생했습니다</p>
            {errorMessage && <p className="text-sm mt-2">{errorMessage}</p>}
          </div>
        ) : (
          <>
            {/* 진행 바 */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* 현재 단계 */}
            {stage && (
              <p className="text-sm text-gray-600 mb-2">{stage}</p>
            )}
            
            {/* 진행률 */}
            <p className="text-sm text-gray-500">{progress}%</p>
          </>
        )}
        
        {/* 취소 버튼 */}
        {onCancel && status !== 'failed' && (
          <button
            onClick={onCancel}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            취소
          </button>
        )}
      </div>
    </div>
  );
};
```

**작업 항목**:
- [ ] `AsyncTaskProgress.tsx` - 공통 진행 상태 컴포넌트 생성
- [ ] 각 비동기 작업에 적용

---

## 6. 에러 처리 및 사용자 경험 개선

### 6.1 에러 처리 전략

1. **네트워크 에러**: 재시도 로직 적용
2. **타임아웃 에러**: 사용자에게 알림 및 수동 재시도 옵션 제공
3. **서버 에러 (500)**: 에러 메시지 표시 및 지원팀 연락 정보 제공
4. **비즈니스 로직 에러 (400)**: 구체적인 에러 메시지 표시

### 6.2 사용자 경험 개선

1. **진행 상태 표시**: 모든 비동기 작업에 진행률 표시
2. **취소 기능**: 장시간 작업에 취소 버튼 제공
3. **백그라운드 처리**: 이메일 발송 등은 백그라운드에서 처리
4. **알림**: 완료/실패 시 토스트 메시지 표시

---

## 7. 구현 우선순위 및 일정

### Phase 1: 높은 우선순위 (즉시 적용)
1. ✅ `POST /api/v1/evaluations` - 개선 (재시도, 타임아웃)
2. ✅ `POST /api/v1/projects/{projectId}/export` - 개선 (다운로드 진행률)
3. ❌ `POST /api/v1/business-plan/generate` - 비동기 전환

**예상 소요 시간**: 3-5일

### Phase 2: 중간 우선순위 (단계적 적용)
4. ❌ `POST /api/v1/auth/signup` - 비동기 전환
5. ❌ `POST /api/v1/auth/verify-email/resend` - 비동기 전환
6. ❌ `POST /api/v1/auth/password/reset-request` - 비동기 전환

**예상 소요 시간**: 2-3일

### Phase 3: 향후 대비
7. ❌ `POST /api/v1/projects/{projectId}/financial/simulate` - 백엔드 API 스펙 확정 대기

---

## 8. 테스트 계획

### 8.1 단위 테스트
- 각 API 클라이언트 함수 테스트
- Store 액션 테스트
- 폴링 로직 테스트

### 8.2 통합 테스트
- 전체 비동기 작업 흐름 테스트
- 에러 시나리오 테스트
- 타임아웃 시나리오 테스트

### 8.3 사용자 테스트
- 실제 사용자 시나리오 테스트
- 성능 테스트 (동시 다중 사용자)
- 사용자 경험 테스트

---

## 9. 백엔드 협업 사항

### 9.1 필요한 백엔드 변경사항

1. **공통 응답 형식**:
```json
{
  "success": true,
  "data": {
    "taskId": "uuid-string",
    "status": "pending"
  }
}
```

2. **상태 조회 엔드포인트**:
```
GET /api/v1/{resource}/{taskId}/status
```

3. **결과 조회 엔드포인트**:
```
GET /api/v1/{resource}/{taskId}/result
```

4. **진행률 정보**: 상태 조회 응답에 `progress` 필드 포함

### 9.2 백엔드와의 협의 사항

- [ ] 작업 ID 형식 (UUID 권장)
- [ ] 상태 값 정의 (`pending`, `processing`, `completed`, `failed`)
- [ ] 폴링 간격 권장값 (2초 권장)
- [ ] 타임아웃 정책 (작업별 최대 소요 시간)
- [ ] 에러 메시지 형식
- [ ] 취소 기능 지원 여부

---

## 10. 마이그레이션 전략

### 10.1 점진적 전환
1. 백엔드가 비동기 API를 먼저 제공
2. 프론트엔드에서 새 API를 사용하도록 변경
3. 기존 동기 API는 deprecated 처리 후 제거

### 10.2 하위 호환성
- 기존 동기 API가 완전히 제거될 때까지 양쪽 모두 지원
- Feature flag를 사용하여 점진적 롤아웃

---

## 11. 모니터링 및 로깅

### 11.1 로깅
- 모든 비동기 작업 시작/완료/실패 로깅
- 폴링 횟수 및 소요 시간 로깅
- 에러 발생 시 상세 로그 기록

### 11.2 모니터링 지표
- 평균 작업 완료 시간
- 폴링 횟수 분포
- 에러 발생률
- 사용자 취소율

---

## 12. 참고 자료

- [현재 구현 상태 문서](./frontend-backend-integration-tasks.md)
- [API 테스트 시나리오](./FRONTEND_BACKEND_API_TEST_SCENARIOS.md)
- [백엔드 통합 계획](./backend-integration-plan.md)

---

## 부록: 코드 예제

### A.1 완전한 비동기 작업 예제

```typescript
// Store 예제
const useAsyncTaskStore = create((set, get) => ({
  taskId: null,
  status: 'idle',
  progress: 0,
  
  startTask: async (data: TaskRequest) => {
    const response = await taskApi.create(data);
    const taskId = response.data.data.taskId;
    set({ taskId, status: 'pending' });
    return taskId;
  },
  
  pollStatus: async (taskId: string) => {
    const response = await taskApi.getStatus(taskId);
    const status = response.data.data;
    set({
      status: status.status,
      progress: status.progress || 0,
    });
    
    if (status.status === 'completed') {
      await get().fetchResult(taskId);
    }
  },
  
  fetchResult: async (taskId: string) => {
    const response = await taskApi.getResult(taskId);
    // 결과 처리...
  },
}));

// 컴포넌트 예제
const MyComponent = () => {
  const { taskId, status, progress, startTask, pollStatus } = useAsyncTaskStore();
  
  const handleStart = async () => {
    const taskId = await startTask(data);
    
    usePolling({
      fetcher: () => pollStatus(taskId),
      interval: 2000,
      enabled: status !== 'completed' && status !== 'failed',
      stopCondition: (data) => data.status === 'completed' || data.status === 'failed',
    });
  };
  
  return (
    <>
      <button onClick={handleStart}>시작</button>
      <AsyncTaskProgress 
        status={status}
        progress={progress}
      />
    </>
  );
};
```

---

**문서 버전**: 1.0  
**최종 수정일**: 2025-01-XX  
**작성자**: AI Agent  
**검토자**: (미정)
