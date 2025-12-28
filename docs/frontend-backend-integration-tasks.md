# 프론트엔드 백엔드 통합 작업 계획

> Makers Round 프론트엔드의 백엔드 API 연동을 위한 작업 목록

**문서 버전**: 1.0  
**작성일**: 2025-12-28  
**관련 문서**: [backend-integration-plan.md](./backend-integration-plan.md)

---

## 목차

1. [개요](#1-개요)
2. [Phase 1: 기반 인프라 구축](#2-phase-1-기반-인프라-구축)
3. [Phase 2: 인증 시스템 연동](#3-phase-2-인증-시스템-연동)
4. [Phase 3: 프로젝트 관리 연동](#4-phase-3-프로젝트-관리-연동)
5. [Phase 4: Wizard 데이터 동기화](#5-phase-4-wizard-데이터-동기화)
6. [Phase 5: AI 평가 연동](#6-phase-5-ai-평가-연동)
7. [Phase 6: 사업계획서 생성 연동](#7-phase-6-사업계획서-생성-연동)
8. [Phase 7: 문서 내보내기 연동](#8-phase-7-문서-내보내기-연동)
9. [작업 체크리스트](#9-작업-체크리스트)
10. [일정 및 우선순위](#10-일정-및-우선순위)

---

## 1. 개요

### 1.1 현재 상태

현재 프론트엔드는 **목업 데이터**와 **localStorage 기반 상태 관리**로 구현되어 있습니다.

| 영역 | 현재 상태 | 변경 필요 |
|------|----------|----------|
| 인증 | `useAuthStore` (localStorage) | API 연동 |
| 프로젝트 | `useProjectStore` (localStorage) | API 연동 |
| Wizard | `useWizardStore` (localStorage) | API 연동 + 자동저장 |
| 평가 | `useEvaluationStore` (목업) | API 연동 |
| 사업계획서 | `useBusinessPlanStore` (목업) | API 연동 |
| 재무 | `useFinancialStore` (localStorage) | API 연동 |

### 1.2 작업 범위

```
📁 신규 생성
├── src/services/           # API 클라이언트 모듈
│   ├── apiClient.ts        # Axios 인스턴스
│   ├── authApi.ts          # 인증 API
│   ├── projectApi.ts       # 프로젝트 API
│   ├── wizardApi.ts        # Wizard API
│   ├── evaluationApi.ts    # AI 평가 API
│   ├── businessPlanApi.ts  # 사업계획서 API
│   └── exportApi.ts        # 문서 내보내기 API
├── src/hooks/
│   ├── useApiQuery.ts      # React Query 래퍼
│   ├── useAutoSave.ts      # 자동저장 훅 (기존 개선)
│   └── usePolling.ts       # 상태 폴링 훅
└── src/components/common/
    ├── ApiErrorBoundary.tsx
    └── LoadingOverlay.tsx

📁 수정 필요
├── src/stores/             # Zustand 스토어 수정
├── src/pages/              # 페이지 컴포넌트 수정
└── src/components/         # UI 컴포넌트 수정
```

---

## 2. Phase 1: 기반 인프라 구축

### 2.1 패키지 설치

```bash
npm install @tanstack/react-query axios
npm install -D @tanstack/react-query-devtools
```

### 2.2 API 클라이언트 생성

**파일**: `src/services/apiClient.ts`

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

// API 응답 타입 정의
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    page?: number;
    totalPages?: number;
    totalCount?: number;
  };
}

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config;
    
    // 401 에러 시 토큰 갱신 시도
    if (error.response?.status === 401 && originalRequest) {
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error('No refresh token');
        
        const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
          '/api/v1/auth/refresh',
          { refreshToken }
        );
        
        if (response.data.success && response.data.data) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          useAuthStore.getState().setTokens(accessToken, newRefreshToken);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch {
        useAuthStore.getState().logout();
        window.location.href = '/signup';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2.3 React Query 설정

**파일**: `src/main.tsx` 수정

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

### 2.4 환경 변수 설정

**파일**: `.env.development`

```env
VITE_API_BASE_URL=/api/v1
VITE_ENABLE_MOCK_API=true
```

**파일**: `.env.production`

```env
VITE_API_BASE_URL=https://api.makersround.com/v1
VITE_ENABLE_MOCK_API=false
```

### 2.5 Vite 프록시 설정 확인

**파일**: `vite.config.ts`

```typescript
export default defineConfig({
  // ... 기존 설정
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

### 2.6 공통 에러 처리 컴포넌트

**파일**: `src/components/common/ApiErrorBoundary.tsx`

```typescript
import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ApiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">오류가 발생했습니다</h3>
          <p className="text-white/60 mb-4">{this.state.error?.message}</p>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 2.7 로딩 오버레이 컴포넌트

**파일**: `src/components/common/LoadingOverlay.tsx`

```typescript
import { Loader2 } from 'lucide-react';

interface Props {
  isLoading: boolean;
  message?: string;
  fullScreen?: boolean;
}

export function LoadingOverlay({ isLoading, message = '처리 중...', fullScreen = false }: Props) {
  if (!isLoading) return null;

  const baseClasses = 'flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50';
  const containerClasses = fullScreen
    ? `fixed inset-0 ${baseClasses}`
    : `absolute inset-0 ${baseClasses}`;

  return (
    <div className={containerClasses}>
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
      <p className="text-white/80 text-sm">{message}</p>
    </div>
  );
}
```

---

## 3. Phase 2: 인증 시스템 연동

### 3.1 인증 API 서비스

**파일**: `src/services/authApi.ts`

```typescript
import apiClient, { ApiResponse } from './apiClient';

// 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
  planEndDate?: string;
  provider?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  plan: string;
  phone?: string;
  businessCategory?: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingConsent: boolean;
  promotionCode?: string;
}

export interface SignupResponse {
  user: User;
  subscription: {
    planKey: string;
    originalPrice: number;
    discountedPrice: number;
    discountRate: number;
  };
  tokens: AuthTokens;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

// API 함수
export const authApi = {
  signup: (data: SignupRequest) =>
    apiClient.post<ApiResponse<SignupResponse>>('/auth/signup', data),

  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', { email, password }),

  socialLogin: (provider: 'google' | 'kakao' | 'naver', accessToken: string, plan: string) =>
    apiClient.post<ApiResponse<LoginResponse & { isNewUser: boolean }>>(
      `/auth/social/${provider}`,
      { accessToken, plan }
    ),

  refresh: (refreshToken: string) =>
    apiClient.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken }),

  logout: () =>
    apiClient.post<ApiResponse<null>>('/auth/logout'),

  getProfile: () =>
    apiClient.get<ApiResponse<User>>('/auth/profile'),
};
```

### 3.2 useAuthStore 수정

**파일**: `src/stores/useAuthStore.ts` 수정

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, User, AuthTokens, SignupRequest } from '../services/authApi';

interface AuthState {
  // 상태
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 액션
  signup: (data: SignupRequest) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'kakao' | 'naver', token: string, plan: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  loadProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signup: async (data: SignupRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.signup(data);
          if (response.data.success && response.data.data) {
            const { user, tokens } = response.data.data;
            set({
              user,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.error?.message || '회원가입에 실패했습니다',
            isLoading: false,
          });
          throw error;
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(email, password);
          if (response.data.success && response.data.data) {
            const { user, tokens } = response.data.data;
            set({
              user,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.error?.message || '로그인에 실패했습니다',
            isLoading: false,
          });
          throw error;
        }
      },

      socialLogin: async (provider, token, plan) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.socialLogin(provider, token, plan);
          if (response.data.success && response.data.data) {
            const { user, tokens } = response.data.data;
            set({
              user,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.error?.message || '소셜 로그인에 실패했습니다',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },

      loadProfile: async () => {
        if (!get().accessToken) return;
        try {
          const response = await authApi.getProfile();
          if (response.data.success && response.data.data) {
            set({ user: response.data.data });
          }
        } catch {
          // 토큰 만료 시 로그아웃 처리
          get().logout();
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### 3.3 SignupPage 수정

**파일**: `src/pages/SignupPage.tsx` 수정 사항

```typescript
// 기존 목업 제출 로직을 API 호출로 변경
const onSubmit = async (data: SignupFormData) => {
  try {
    await signup({
      email: data.email,
      password: data.password,
      name: data.name,
      plan: currentPlan,
      phone: data.phone,
      businessCategory: data.businessCategory,
      termsAgreed: true,
      privacyAgreed: true,
      marketingConsent: data.marketingConsent || false,
      promotionCode: promotionCode,
    });
    
    // 성공 시 대시보드 또는 프로젝트 생성 페이지로 이동
    navigate('/projects/create');
  } catch (error) {
    // 에러는 스토어에서 처리됨
    toast.error(authError || '회원가입에 실패했습니다');
  }
};

// 스토어에서 상태 가져오기
const { signup, isLoading, error: authError, clearError } = useAuthStore();

// 에러 표시
useEffect(() => {
  if (authError) {
    toast.error(authError);
    clearError();
  }
}, [authError, clearError]);
```

---

## 4. Phase 3: 프로젝트 관리 연동

### 4.1 프로젝트 API 서비스

**파일**: `src/services/projectApi.ts`

```typescript
import apiClient, { ApiResponse } from './apiClient';

export interface Project {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  supportProgram?: string;
  description?: string;
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  progress: {
    currentStep: number;
    totalSteps: number;
    completedSteps: number[];
    percentComplete: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  templateId: string;
  supportProgram?: string;
  description?: string;
}

export const projectApi = {
  create: (data: CreateProjectRequest) =>
    apiClient.post<ApiResponse<Project>>('/projects', data),

  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get<ApiResponse<Project[]>>('/projects', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Project>>(`/projects/${id}`),

  update: (id: string, data: Partial<CreateProjectRequest>) =>
    apiClient.put<ApiResponse<Project>>(`/projects/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/projects/${id}`),
};
```

### 4.2 useProjectStore 수정

**파일**: `src/stores/useProjectStore.ts` 수정

```typescript
import { create } from 'zustand';
import { projectApi, Project, CreateProjectRequest } from '../services/projectApi';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;

  // 액션
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createProject: (data: CreateProjectRequest) => Promise<Project>;
  updateProject: (id: string, data: Partial<CreateProjectRequest>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectApi.getAll();
      if (response.data.success && response.data.data) {
        set({ projects: response.data.data, isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || '프로젝트 목록을 불러오는데 실패했습니다',
        isLoading: false,
      });
    }
  },

  fetchProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectApi.getById(id);
      if (response.data.success && response.data.data) {
        set({ currentProject: response.data.data, isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || '프로젝트를 불러오는데 실패했습니다',
        isLoading: false,
      });
    }
  },

  createProject: async (data: CreateProjectRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectApi.create(data);
      if (response.data.success && response.data.data) {
        const newProject = response.data.data;
        set((state) => ({
          projects: [...state.projects, newProject],
          currentProject: newProject,
          isLoading: false,
        }));
        return newProject;
      }
      throw new Error('프로젝트 생성 실패');
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || '프로젝트 생성에 실패했습니다',
        isLoading: false,
      });
      throw error;
    }
  },

  updateProject: async (id: string, data: Partial<CreateProjectRequest>) => {
    try {
      const response = await projectApi.update(id, data);
      if (response.data.success && response.data.data) {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? response.data.data! : p
          ),
          currentProject:
            state.currentProject?.id === id ? response.data.data : state.currentProject,
        }));
      }
    } catch (error: any) {
      set({ error: error.response?.data?.error?.message });
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    try {
      await projectApi.delete(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error?.message });
      throw error;
    }
  },

  setCurrentProject: (project) => set({ currentProject: project }),
}));
```

### 4.3 ProjectCreate 페이지 수정

**파일**: `src/pages/ProjectCreate.tsx` 수정 사항

```typescript
// 프로젝트 생성 후 Wizard로 이동
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const project = await createProject({
      name: projectName,
      templateId: selectedTemplate,
      supportProgram: selectedProgram,
    });
    
    // Wizard 페이지로 이동
    navigate(`/writing-demo?projectId=${project.id}`);
  } catch (error) {
    toast.error('프로젝트 생성에 실패했습니다');
  }
};
```

---

## 5. Phase 4: Wizard 데이터 동기화

### 5.1 Wizard API 서비스

**파일**: `src/services/wizardApi.ts`

```typescript
import apiClient, { ApiResponse } from './apiClient';

export interface WizardStep {
  stepId: number;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  data: Record<string, any> | null;
}

export interface WizardData {
  projectId: string;
  templateId: string;
  currentStep: number;
  steps: WizardStep[];
  lastSavedAt: string;
}

export interface SaveWizardRequest {
  currentStep: number;
  stepData: Record<string, any>;
  isStepComplete?: boolean;
}

export interface BudgetValidationResult {
  isValid: boolean;
  summary: {
    totalBudget: number;
    phase1Total: number;
    phase2Total: number;
  };
  validations: Array<{
    rule: string;
    passed: boolean;
    message: string;
  }>;
  warnings: Array<{
    type: string;
    field: string;
    message: string;
    suggestion?: string;
  }>;
}

export const wizardApi = {
  get: (projectId: string) =>
    apiClient.get<ApiResponse<WizardData>>(`/projects/${projectId}/wizard`),

  save: (projectId: string, data: SaveWizardRequest) =>
    apiClient.put<ApiResponse<{ lastSavedAt: string; progress: any }>>(`/projects/${projectId}/wizard`, data),

  validateBudget: (projectId: string, budgetData: any) =>
    apiClient.post<ApiResponse<BudgetValidationResult>>(`/projects/${projectId}/budget/validate`, budgetData),
};
```

### 5.2 자동저장 훅 개선

**파일**: `src/hooks/useAutoSave.ts`

```typescript
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { wizardApi } from '../services/wizardApi';

interface UseAutoSaveOptions {
  projectId: string;
  currentStep: number;
  data: Record<string, any>;
  enabled?: boolean;
  debounceMs?: number;
  onSaveSuccess?: (savedAt: string) => void;
  onSaveError?: (error: Error) => void;
}

export function useAutoSave({
  projectId,
  currentStep,
  data,
  enabled = true,
  debounceMs = 3000,
  onSaveSuccess,
  onSaveError,
}: UseAutoSaveOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const previousDataRef = useRef<string>('');

  const saveToServer = useCallback(async () => {
    if (!projectId || !enabled) return;

    const dataString = JSON.stringify(data);
    if (dataString === previousDataRef.current) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await wizardApi.save(projectId, {
        currentStep,
        stepData: data,
      });

      if (response.data.success && response.data.data) {
        previousDataRef.current = dataString;
        setLastSavedAt(response.data.data.lastSavedAt);
        onSaveSuccess?.(response.data.data.lastSavedAt);
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      onSaveError?.(error);
    } finally {
      setIsSaving(false);
    }
  }, [projectId, currentStep, data, enabled, onSaveSuccess, onSaveError]);

  const debouncedSave = useDebouncedCallback(saveToServer, debounceMs);

  // 데이터 변경 시 자동저장
  useEffect(() => {
    if (enabled) {
      debouncedSave();
    }
  }, [data, enabled, debouncedSave]);

  // 페이지 이탈 시 즉시 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (enabled && JSON.stringify(data) !== previousDataRef.current) {
        // 동기적으로 저장 시도 (navigator.sendBeacon 사용)
        const blob = new Blob([JSON.stringify({ currentStep, stepData: data })], {
          type: 'application/json',
        });
        navigator.sendBeacon(`/api/v1/projects/${projectId}/wizard`, blob);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [projectId, currentStep, data, enabled]);

  return {
    isSaving,
    lastSavedAt,
    error,
    saveNow: saveToServer,
  };
}
```

### 5.3 useWizardStore 수정

**파일**: `src/stores/useWizardStore.ts` 주요 수정

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wizardApi, WizardData } from '../services/wizardApi';

interface WizardState {
  // 기존 상태
  projectId: string | null;
  templateType: string | null;
  currentStep: number;
  wizardData: Record<number, Record<string, any>>;

  // 백엔드 동기화 상태
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  syncError: string | null;

  // 액션
  loadFromServer: (projectId: string) => Promise<void>;
  syncToServer: () => Promise<void>;
  setProjectId: (id: string) => void;
  // ... 기존 액션들
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      projectId: null,
      templateType: null,
      currentStep: 1,
      wizardData: {},
      isLoading: false,
      isSyncing: false,
      lastSyncedAt: null,
      syncError: null,

      // 서버에서 데이터 로드
      loadFromServer: async (projectId: string) => {
        set({ isLoading: true, syncError: null });
        try {
          const response = await wizardApi.get(projectId);
          if (response.data.success && response.data.data) {
            const serverData = response.data.data;
            
            // 서버 데이터를 로컬 형식으로 변환
            const wizardData: Record<number, Record<string, any>> = {};
            serverData.steps.forEach((step) => {
              if (step.data) {
                wizardData[step.stepId] = step.data;
              }
            });

            set({
              projectId,
              templateType: serverData.templateId,
              currentStep: serverData.currentStep,
              wizardData,
              lastSyncedAt: serverData.lastSavedAt,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({
            syncError: error.response?.data?.error?.message || '데이터 로드 실패',
            isLoading: false,
          });
        }
      },

      // 서버로 데이터 동기화
      syncToServer: async () => {
        const { projectId, currentStep, wizardData } = get();
        if (!projectId) return;

        set({ isSyncing: true, syncError: null });
        try {
          const response = await wizardApi.save(projectId, {
            currentStep,
            stepData: wizardData[currentStep] || {},
          });

          if (response.data.success && response.data.data) {
            set({
              lastSyncedAt: response.data.data.lastSavedAt,
              isSyncing: false,
            });
          }
        } catch (error: any) {
          set({
            syncError: error.response?.data?.error?.message || '동기화 실패',
            isSyncing: false,
          });
        }
      },

      setProjectId: (id: string) => set({ projectId: id }),

      // ... 기존 액션들 유지
    }),
    {
      name: 'wizard-storage',
      partialize: (state) => ({
        // 로컬에는 최소한의 정보만 저장 (오프라인 지원용)
        projectId: state.projectId,
        templateType: state.templateType,
        currentStep: state.currentStep,
        wizardData: state.wizardData,
      }),
    }
  )
);
```

### 5.4 WizardStep 페이지 수정

**파일**: `src/pages/WizardStep.tsx` 주요 수정

```typescript
// 프로젝트 ID로 데이터 로드
const [searchParams] = useSearchParams();
const projectId = searchParams.get('projectId');

useEffect(() => {
  if (projectId) {
    loadFromServer(projectId);
  }
}, [projectId, loadFromServer]);

// 자동저장 훅 사용
const { isSaving, lastSavedAt, error: saveError } = useAutoSave({
  projectId: projectId || '',
  currentStep,
  data: wizardData[currentStep] || {},
  enabled: !!projectId,
});

// 저장 상태 표시
<div className="text-sm text-white/60">
  {isSaving ? (
    <span className="flex items-center gap-1">
      <Loader2 className="w-3 h-3 animate-spin" />
      저장 중...
    </span>
  ) : lastSavedAt ? (
    <span>마지막 저장: {formatRelativeTime(lastSavedAt)}</span>
  ) : null}
</div>
```

---

## 6. Phase 5: AI 평가 연동

### 6.1 평가 API 서비스

**파일**: `src/services/evaluationApi.ts`

```typescript
import apiClient, { ApiResponse } from './apiClient';

export interface EvaluationRequest {
  projectId: string;
  evaluationType: 'demo' | 'basic' | 'full';
  inputData: {
    businessName: string;
    businessField: string;
    targetMarket: string;
    problemStatement: string;
    solutionSummary: string;
    differentiators: string[];
    teamExperience: string;
    fundingGoal: number;
  };
}

export interface EvaluationStatus {
  evaluationId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStage: string;
  stages: Array<{
    id: string;
    name: string;
    status: string;
    score: number | null;
  }>;
  estimatedRemaining?: number;
}

export interface EvaluationResult {
  evaluationId: string;
  summary: {
    totalScore: number;
    grade: string;
    passRate: number;
    passRateMessage: string;
  };
  scores: Record<string, {
    score: number;
    label: string;
    letter: string;
    color: string;
    maxScore: number;
  }>;
  strengths: Array<{
    area: string;
    title: string;
    description: string;
    isBlurred: boolean;
  }>;
  weaknesses: Array<{
    area: string;
    title: string;
    description: string;
    isBlurred: boolean;
  }>;
  recommendations: Array<{
    priority: number;
    area: string;
    title: string;
    description: string;
    isBlurred: boolean;
  }>;
  accessLevel: 'demo' | 'basic' | 'full';
}

export const evaluationApi = {
  create: (data: EvaluationRequest) =>
    apiClient.post<ApiResponse<{ evaluationId: string; status: string }>>('/evaluations', data),

  getStatus: (evaluationId: string) =>
    apiClient.get<ApiResponse<EvaluationStatus>>(`/evaluations/${evaluationId}/status`),

  getResult: (evaluationId: string) =>
    apiClient.get<ApiResponse<EvaluationResult>>(`/evaluations/${evaluationId}/result`),
};
```

### 6.2 폴링 훅

**파일**: `src/hooks/usePolling.ts`

```typescript
import { useCallback, useEffect, useRef, useState } from 'react';

interface UsePollingOptions<T> {
  fetcher: () => Promise<T>;
  interval: number;
  enabled?: boolean;
  stopCondition?: (data: T) => boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function usePolling<T>({
  fetcher,
  interval,
  enabled = true,
  stopCondition,
  onSuccess,
  onError,
}: UsePollingOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const poll = useCallback(async () => {
    try {
      const result = await fetcher();
      setData(result);
      setError(null);
      onSuccess?.(result);

      if (stopCondition?.(result)) {
        setIsPolling(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
    }
  }, [fetcher, stopCondition, onSuccess, onError]);

  useEffect(() => {
    if (!enabled) {
      setIsPolling(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setIsPolling(true);
    poll(); // 초기 실행

    intervalRef.current = setInterval(poll, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, poll]);

  const stop = useCallback(() => {
    setIsPolling(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return { data, isPolling, error, stop };
}
```

### 6.3 useEvaluationStore 수정

**파일**: `src/stores/useEvaluationStore.ts` 수정

```typescript
import { create } from 'zustand';
import { evaluationApi, EvaluationRequest, EvaluationStatus, EvaluationResult } from '../services/evaluationApi';

interface EvaluationState {
  // 상태
  evaluationId: string | null;
  status: EvaluationStatus | null;
  result: EvaluationResult | null;
  isLoading: boolean;
  isPolling: boolean;
  error: string | null;

  // 액션
  startEvaluation: (data: EvaluationRequest) => Promise<string>;
  pollStatus: (evaluationId: string) => Promise<EvaluationStatus>;
  fetchResult: (evaluationId: string) => Promise<EvaluationResult>;
  reset: () => void;
}

export const useEvaluationStore = create<EvaluationState>((set, get) => ({
  evaluationId: null,
  status: null,
  result: null,
  isLoading: false,
  isPolling: false,
  error: null,

  startEvaluation: async (data: EvaluationRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await evaluationApi.create(data);
      if (response.data.success && response.data.data) {
        const { evaluationId } = response.data.data;
        set({ evaluationId, isLoading: false, isPolling: true });
        return evaluationId;
      }
      throw new Error('평가 시작 실패');
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || '평가를 시작할 수 없습니다',
        isLoading: false,
      });
      throw error;
    }
  },

  pollStatus: async (evaluationId: string) => {
    try {
      const response = await evaluationApi.getStatus(evaluationId);
      if (response.data.success && response.data.data) {
        const status = response.data.data;
        set({ status });
        
        if (status.status === 'completed') {
          set({ isPolling: false });
        }
        
        return status;
      }
      throw new Error('상태 조회 실패');
    } catch (error: any) {
      set({ error: error.response?.data?.error?.message });
      throw error;
    }
  },

  fetchResult: async (evaluationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await evaluationApi.getResult(evaluationId);
      if (response.data.success && response.data.data) {
        const result = response.data.data;
        set({ result, isLoading: false });
        return result;
      }
      throw new Error('결과 조회 실패');
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || '결과를 불러올 수 없습니다',
        isLoading: false,
      });
      throw error;
    }
  },

  reset: () => set({
    evaluationId: null,
    status: null,
    result: null,
    isLoading: false,
    isPolling: false,
    error: null,
  }),
}));
```

### 6.4 EvaluationDemo 페이지 수정

**파일**: `src/pages/EvaluationDemo/index.tsx` 주요 수정

```typescript
const { startEvaluation, pollStatus, fetchResult, status, result, isPolling } = useEvaluationStore();

// 평가 시작
const handleStartEvaluation = async () => {
  try {
    const evaluationId = await startEvaluation({
      projectId: currentProjectId,
      evaluationType: 'demo',
      inputData: {
        businessName: wizardData['item-name'],
        businessField: wizardData['item-category'],
        // ... 나머지 필드
      },
    });
    
    setCurrentSection('analyzing');
  } catch (error) {
    toast.error('평가를 시작할 수 없습니다');
  }
};

// 상태 폴링
usePolling({
  fetcher: () => pollStatus(evaluationId!),
  interval: 2000,
  enabled: isPolling && !!evaluationId,
  stopCondition: (status) => status.status === 'completed' || status.status === 'failed',
  onSuccess: (status) => {
    if (status.status === 'completed') {
      fetchResult(evaluationId!);
      setCurrentSection('result');
    }
  },
});
```

---

## 7. Phase 6: 사업계획서 생성 연동

### 7.1 사업계획서 API 서비스

**파일**: `src/services/businessPlanApi.ts`

```typescript
import apiClient, { ApiResponse } from './apiClient';

export interface BusinessPlanSection {
  id: string;
  title: string;
  order: number;
  content: string;
  wordCount: number;
  lastEditedAt: string;
}

export interface BusinessPlan {
  id: string;
  projectId: string;
  templateId: string;
  version: number;
  status: 'draft' | 'generating' | 'generated' | 'exported';
  sections: BusinessPlanSection[];
  metadata: {
    totalWordCount: number;
    estimatedPages: number;
    generatedAt: string;
    aiModel: string;
  };
  financialSummary: {
    totalBudget: number;
    phase1: number;
    phase2: number;
    year1Revenue: number;
    breakEvenMonth: number;
  };
}

export interface GenerateRequest {
  outputFormat: 'markdown' | 'html';
  options: {
    maskPersonalInfo: boolean;
    includeFinancialTables: boolean;
    includeEsgSection: boolean;
    language: string;
  };
  regenerateSections?: string[];
}

export const businessPlanApi = {
  generate: (projectId: string, data: GenerateRequest) =>
    apiClient.post<ApiResponse<{ generationId: string; status: string }>>(`/projects/${projectId}/business-plan/generate`, data),

  get: (projectId: string) =>
    apiClient.get<ApiResponse<BusinessPlan>>(`/projects/${projectId}/business-plan`),

  regenerateSection: (projectId: string, sectionId: string, instruction?: string) =>
    apiClient.post<ApiResponse<BusinessPlanSection>>(`/projects/${projectId}/business-plan/sections/${sectionId}/regenerate`, { instruction }),

  updateSection: (projectId: string, sectionId: string, content: string) =>
    apiClient.put<ApiResponse<BusinessPlanSection>>(`/projects/${projectId}/business-plan/sections/${sectionId}`, { content }),
};
```

### 7.2 useBusinessPlanStore 수정

**파일**: `src/stores/useBusinessPlanStore.ts` 수정

```typescript
import { create } from 'zustand';
import { businessPlanApi, BusinessPlan, GenerateRequest } from '../services/businessPlanApi';

interface BusinessPlanState {
  businessPlan: BusinessPlan | null;
  isGenerating: boolean;
  isLoading: boolean;
  error: string | null;

  generate: (projectId: string, options?: Partial<GenerateRequest>) => Promise<void>;
  fetch: (projectId: string) => Promise<void>;
  regenerateSection: (projectId: string, sectionId: string, instruction?: string) => Promise<void>;
  updateSection: (projectId: string, sectionId: string, content: string) => Promise<void>;
}

export const useBusinessPlanStore = create<BusinessPlanState>((set, get) => ({
  businessPlan: null,
  isGenerating: false,
  isLoading: false,
  error: null,

  generate: async (projectId, options = {}) => {
    set({ isGenerating: true, error: null });
    try {
      const response = await businessPlanApi.generate(projectId, {
        outputFormat: 'markdown',
        options: {
          maskPersonalInfo: true,
          includeFinancialTables: true,
          includeEsgSection: true,
          language: 'ko',
          ...options,
        },
      });
      
      if (response.data.success) {
        // 생성 완료 후 결과 가져오기
        await get().fetch(projectId);
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || '사업계획서 생성 실패',
        isGenerating: false,
      });
      throw error;
    }
  },

  fetch: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await businessPlanApi.get(projectId);
      if (response.data.success && response.data.data) {
        set({ businessPlan: response.data.data, isLoading: false, isGenerating: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message,
        isLoading: false,
      });
    }
  },

  regenerateSection: async (projectId, sectionId, instruction) => {
    try {
      const response = await businessPlanApi.regenerateSection(projectId, sectionId, instruction);
      if (response.data.success && response.data.data) {
        set((state) => ({
          businessPlan: state.businessPlan ? {
            ...state.businessPlan,
            sections: state.businessPlan.sections.map((s) =>
              s.id === sectionId ? response.data.data! : s
            ),
          } : null,
        }));
      }
    } catch (error: any) {
      set({ error: error.response?.data?.error?.message });
      throw error;
    }
  },

  updateSection: async (projectId, sectionId, content) => {
    try {
      const response = await businessPlanApi.updateSection(projectId, sectionId, content);
      if (response.data.success && response.data.data) {
        set((state) => ({
          businessPlan: state.businessPlan ? {
            ...state.businessPlan,
            sections: state.businessPlan.sections.map((s) =>
              s.id === sectionId ? response.data.data! : s
            ),
          } : null,
        }));
      }
    } catch (error: any) {
      set({ error: error.response?.data?.error?.message });
      throw error;
    }
  },
}));
```

---

## 8. Phase 7: 문서 내보내기 연동

### 8.1 내보내기 API 서비스

**파일**: `src/services/exportApi.ts`

```typescript
import apiClient, { ApiResponse } from './apiClient';

export interface ExportRequest {
  format: 'hwp' | 'pdf' | 'docx';
  templateType: string;
  options: {
    maskPersonalInfo: boolean;
    includeAppendix: boolean;
    includeCoverPage: boolean;
    pageNumbering: boolean;
    watermark: boolean;
  };
}

export interface ExportStatus {
  exportId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  format: string;
  fileName?: string;
  fileSize?: number;
  downloadUrl?: string;
  expiresAt?: string;
  completedAt?: string;
  errorMessage?: string;
}

export const exportApi = {
  create: (projectId: string, data: ExportRequest) =>
    apiClient.post<ApiResponse<{ exportId: string; status: string }>>(`/projects/${projectId}/export`, data),

  getStatus: (exportId: string) =>
    apiClient.get<ApiResponse<ExportStatus>>(`/exports/${exportId}/status`),

  download: async (exportId: string): Promise<Blob> => {
    const response = await apiClient.get(`/exports/${exportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
```

### 8.2 문서 다운로드 훅

**파일**: `src/hooks/useDocumentExport.ts`

```typescript
import { useState, useCallback } from 'react';
import { exportApi, ExportRequest, ExportStatus } from '../services/exportApi';
import { usePolling } from './usePolling';

interface UseDocumentExportOptions {
  onComplete?: (status: ExportStatus) => void;
  onError?: (error: Error) => void;
}

export function useDocumentExport({ onComplete, onError }: UseDocumentExportOptions = {}) {
  const [exportId, setExportId] = useState<string | null>(null);
  const [status, setStatus] = useState<ExportStatus | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 상태 폴링
  const { isPolling } = usePolling<ExportStatus>({
    fetcher: async () => {
      if (!exportId) throw new Error('No export ID');
      const response = await exportApi.getStatus(exportId);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Status fetch failed');
    },
    interval: 2000,
    enabled: isExporting && !!exportId,
    stopCondition: (data) => data.status === 'completed' || data.status === 'failed',
    onSuccess: (data) => {
      setStatus(data);
      if (data.status === 'completed') {
        setIsExporting(false);
        onComplete?.(data);
      } else if (data.status === 'failed') {
        setIsExporting(false);
        setError(new Error(data.errorMessage || 'Export failed'));
        onError?.(new Error(data.errorMessage || 'Export failed'));
      }
    },
    onError: (err) => {
      setError(err);
      onError?.(err);
    },
  });

  const startExport = useCallback(async (projectId: string, options: ExportRequest) => {
    setIsExporting(true);
    setError(null);
    setStatus(null);

    try {
      const response = await exportApi.create(projectId, options);
      if (response.data.success && response.data.data) {
        setExportId(response.data.data.exportId);
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      setIsExporting(false);
      onError?.(error);
    }
  }, [onError]);

  const downloadFile = useCallback(async () => {
    if (!status?.downloadUrl || !exportId) return;

    try {
      const blob = await exportApi.download(exportId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = status.fileName || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err as Error);
    }
  }, [exportId, status]);

  return {
    startExport,
    downloadFile,
    status,
    isExporting: isExporting || isPolling,
    error,
  };
}
```

### 8.3 다운로드 버튼 컴포넌트

**파일**: `src/components/wizard/DownloadButton.tsx` 수정

```typescript
import { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { useDocumentExport } from '../../hooks/useDocumentExport';
import { useProjectStore } from '../../stores/useProjectStore';

export function DownloadButton() {
  const [format, setFormat] = useState<'hwp' | 'pdf'>('hwp');
  const { currentProject } = useProjectStore();
  const { startExport, downloadFile, status, isExporting, error } = useDocumentExport({
    onComplete: () => {
      // 자동 다운로드
      downloadFile();
    },
    onError: (err) => {
      toast.error(`다운로드 실패: ${err.message}`);
    },
  });

  const handleExport = async () => {
    if (!currentProject) return;

    await startExport(currentProject.id, {
      format,
      templateType: currentProject.templateId === 'pre-startup' 
        ? '2026_예비창업패키지' 
        : '2026_초기창업패키지',
      options: {
        maskPersonalInfo: true,
        includeAppendix: true,
        includeCoverPage: true,
        pageNumbering: true,
        watermark: false,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setFormat('hwp')}
          className={`px-4 py-2 rounded-lg ${
            format === 'hwp' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/70'
          }`}
        >
          HWP
        </button>
        <button
          onClick={() => setFormat('pdf')}
          className={`px-4 py-2 rounded-lg ${
            format === 'pdf' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/70'
          }`}
        >
          PDF
        </button>
      </div>

      <button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold disabled:opacity-50"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {status?.status === 'processing' ? '문서 생성 중...' : '준비 중...'}
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            {format.toUpperCase()} 다운로드
          </>
        )}
      </button>

      {error && (
        <p className="text-red-400 text-sm text-center">{error.message}</p>
      )}
    </div>
  );
}
```

---

## 9. 작업 체크리스트

### 9.1 기반 인프라 (Phase 1)

- [ ] `@tanstack/react-query` 패키지 설치
- [ ] `axios` 패키지 설치
- [ ] `src/services/apiClient.ts` 생성
- [ ] `src/main.tsx`에 QueryClientProvider 추가
- [ ] 환경 변수 파일 설정 (`.env.development`, `.env.production`)
- [ ] `vite.config.ts` 프록시 설정 확인
- [ ] `ApiErrorBoundary` 컴포넌트 생성
- [ ] `LoadingOverlay` 컴포넌트 생성

### 9.2 인증 시스템 (Phase 2)

- [ ] `src/services/authApi.ts` 생성
- [ ] `src/stores/useAuthStore.ts` API 연동으로 수정
- [ ] `SignupPage.tsx` API 호출 로직 추가
- [ ] 소셜 로그인 SDK 연동 (Google, Kakao, Naver)
- [ ] 토큰 갱신 로직 테스트
- [ ] 로그아웃 시 상태 초기화 확인

### 9.3 프로젝트 관리 (Phase 3)

- [ ] `src/services/projectApi.ts` 생성
- [ ] `src/stores/useProjectStore.ts` API 연동으로 수정
- [ ] `ProjectCreate.tsx` API 호출 로직 추가
- [ ] 프로젝트 목록 페이지 추가 (선택)
- [ ] 프로젝트 삭제 확인 모달 추가

### 9.4 Wizard 동기화 (Phase 4)

- [ ] `src/services/wizardApi.ts` 생성
- [ ] `src/hooks/useAutoSave.ts` 개선
- [ ] `src/stores/useWizardStore.ts` API 연동으로 수정
- [ ] `WizardStep.tsx` 자동저장 훅 적용
- [ ] 저장 상태 UI 표시
- [ ] 오프라인 폴백 처리
- [ ] `sendBeacon` 페이지 이탈 시 저장 테스트

### 9.5 AI 평가 (Phase 5)

- [ ] `src/services/evaluationApi.ts` 생성
- [ ] `src/hooks/usePolling.ts` 생성
- [ ] `src/stores/useEvaluationStore.ts` API 연동으로 수정
- [ ] `EvaluationDemo/index.tsx` API 호출 로직 추가
- [ ] 진행 상태 애니메이션 UI
- [ ] 평가 실패 시 재시도 UI

### 9.6 사업계획서 생성 (Phase 6)

- [ ] `src/services/businessPlanApi.ts` 생성
- [ ] `src/stores/useBusinessPlanStore.ts` API 연동으로 수정
- [ ] `BusinessPlanViewer.tsx` API 호출 로직 추가
- [ ] 섹션별 재생성 UI
- [ ] 섹션 편집 기능 (선택)

### 9.7 문서 내보내기 (Phase 7)

- [ ] `src/services/exportApi.ts` 생성
- [ ] `src/hooks/useDocumentExport.ts` 생성
- [ ] `DownloadButton.tsx` 수정
- [ ] 다운로드 진행 상태 UI
- [ ] 파일 자동 다운로드 테스트

---

## 10. 일정 및 우선순위

### 10.1 우선순위별 작업 분류

| 우선순위 | Phase | 작업 내용 | 예상 기간 |
|---------|-------|----------|----------|
| P0 (필수) | 1 | 기반 인프라 구축 | 2일 |
| P0 (필수) | 2 | 인증 시스템 연동 | 3일 |
| P0 (필수) | 3 | 프로젝트 관리 연동 | 2일 |
| P1 (중요) | 4 | Wizard 데이터 동기화 | 4일 |
| P1 (중요) | 5 | AI 평가 연동 | 3일 |
| P2 (보통) | 6 | 사업계획서 생성 연동 | 3일 |
| P2 (보통) | 7 | 문서 내보내기 연동 | 2일 |

### 10.2 백엔드 의존성

| 프론트엔드 Phase | 필요한 백엔드 API | 백엔드 Phase |
|-----------------|------------------|-------------|
| Phase 2 (인증) | `/auth/*` | Phase 1 |
| Phase 3 (프로젝트) | `/projects/*` | Phase 1 |
| Phase 4 (Wizard) | `/projects/{id}/wizard` | Phase 2 |
| Phase 5 (평가) | `/evaluations/*` | Phase 3 |
| Phase 6 (사업계획서) | `/business-plan/*` | Phase 3 |
| Phase 7 (내보내기) | `/exports/*` | Phase 4 |

### 10.3 전체 일정 (예상)

```
Week 1: Phase 1-2 (기반 + 인증) - 백엔드 Phase 1 완료 후
Week 2: Phase 3-4 (프로젝트 + Wizard) - 백엔드 Phase 2 완료 후
Week 3: Phase 5-6 (평가 + 사업계획서) - 백엔드 Phase 3 완료 후
Week 4: Phase 7 + 통합 테스트 - 백엔드 Phase 4 완료 후
```

**프론트엔드 총 예상 기간**: 4주 (백엔드 진행과 병행)

---

## 부록: Mock API 설정 (개발용)

백엔드 API가 준비되기 전까지 Mock API를 사용하여 개발을 진행할 수 있습니다.

**파일**: `src/mocks/handlers.ts`

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  // 인증 Mock
  http.post('/api/v1/auth/signup', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        user: { id: 'mock-user-id', email: body.email, name: body.name, plan: body.plan },
        tokens: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: 3600,
        },
      },
    });
  }),

  // 프로젝트 Mock
  http.get('/api/v1/projects', () => {
    return HttpResponse.json({
      success: true,
      data: [],
    });
  }),

  // ... 추가 핸들러
];
```

**파일**: `src/main.tsx` (개발 환경에서만)

```typescript
async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MOCK_API !== 'true') {
    return;
  }

  const { worker } = await import('./mocks/browser');
  return worker.start({ onUnhandledRequest: 'bypass' });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    // ...
  );
});
```

---

*문서 작성일: 2025-12-28*  
*작성자: AI Assistant*  
*관련 문서: [backend-integration-plan.md](./backend-integration-plan.md)*

