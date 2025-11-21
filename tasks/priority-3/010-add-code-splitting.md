# [#010] Code Splitting 및 Lazy Loading 적용

## 📌 Status
`🔲 Todo`

## 🏷️ Labels
`performance` `optimization` `priority-3`

## 📝 Description

현재 애플리케이션의 모든 코드가 초기 번들에 포함되어 있어 초기 로딩 시간이 길어집니다. Code Splitting과 Lazy Loading을 적용하여 필요한 코드만 로드하도록 최적화해야 합니다.

## 🎯 Goal

초기 로딩 시간을 **40% 감소**시키고, 페이지별로 필요한 코드만 로드하여 전반적인 성능을 향상시킵니다.

## 📋 Tasks

### 1. 라우트 기반 Code Splitting

- [ ] ProjectCreate Lazy Loading
- [ ] WizardStep Lazy Loading
- [ ] BusinessPlanViewer Lazy Loading

### 2. 컴포넌트 기반 Lazy Loading

- [ ] FinancialSimulation Lazy Loading (Step 4)
- [ ] PMFSurvey Lazy Loading (Step 5)
- [ ] 차트 라이브러리 (Recharts) Lazy Loading

### 3. Suspense Fallback 구현

- [ ] 페이지 로딩 Fallback UI
- [ ] 컴포넌트 로딩 Spinner
- [ ] 에러 처리와 통합

### 4. Dynamic Import

- [ ] 조건부 import (모달, 다이얼로그 등)
- [ ] 사용자 인터랙션 기반 import

### 5. Bundle Analyzer 설정

- [ ] vite-plugin-bundle-analyzer 설정
- [ ] 번들 크기 분석 및 문서화

## 💡 Implementation Example

### Example 1: 라우트 기반 Code Splitting

#### Before

```typescript
// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProjectCreate } from './pages/ProjectCreate';
import { WizardStep } from './pages/WizardStep';
import { BusinessPlanViewer } from './pages/BusinessPlanViewer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProjectCreate />} />
          <Route path="wizard/:projectId/:stepNumber" element={<WizardStep />} />
          <Route path="business-plan/:projectId" element={<BusinessPlanViewer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
```

#### After

```typescript
// src/App.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageLoadingFallback } from './components/PageLoadingFallback';

// ✅ Lazy Loading으로 페이지 import
const ProjectCreate = lazy(() => import('./pages/ProjectCreate'));
const WizardStep = lazy(() => import('./pages/WizardStep'));
const BusinessPlanViewer = lazy(() => import('./pages/BusinessPlanViewer'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <ProjectCreate />
                </Suspense>
              }
            />
            <Route
              path="wizard/:projectId/:stepNumber"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <WizardStep />
                </Suspense>
              }
            />
            <Route
              path="business-plan/:projectId"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <BusinessPlanViewer />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

// src/components/PageLoadingFallback.tsx
import React from 'react';
import { Spinner } from './ui/Spinner';

export const PageLoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600">로딩 중...</p>
    </div>
  </div>
);
```

**예상 효과**: 
- 초기 번들 크기: 500KB → 200KB (60% 감소)
- 초기 로딩 시간: 2초 → 0.8초 (60% 감소)

---

### Example 2: 컴포넌트 기반 Lazy Loading

```typescript
// src/pages/WizardStep.tsx
import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useWizardStore } from '../stores/useWizardStore';
import { QuestionForm } from '../components/wizard/QuestionForm';
import { Spinner } from '../components/ui/Spinner';

// ✅ Step 4, 5는 Lazy Loading
const FinancialSimulation = lazy(() => 
  import('../components/wizard/financial').then(module => ({
    default: module.FinancialSimulation
  }))
);

const PMFSurvey = lazy(() => 
  import('../components/wizard/pmf').then(module => ({
    default: module.PMFSurvey
  }))
);

export const WizardStep: React.FC = () => {
  const { stepNumber } = useParams();
  const { steps } = useWizardStore();
  const step = steps.find((s) => s.id === Number(stepNumber));
  const currentStepNumber = Number(stepNumber);

  const renderStepContent = () => {
    if (currentStepNumber === 4) {
      return (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <FinancialSimulation />
        </Suspense>
      );
    }

    if (currentStepNumber === 5) {
      return (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <PMFSurvey />
        </Suspense>
      );
    }

    return <QuestionForm questions={step?.questions || []} stepId={currentStepNumber} />;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {renderStepContent()}
    </div>
  );
};

// src/components/ComponentLoadingFallback.tsx
import React from 'react';
import { Card, CardContent } from './ui/Card';
import { Spinner } from './ui/Spinner';

export const ComponentLoadingFallback: React.FC = () => (
  <Card>
    <CardContent className="py-12">
      <div className="flex flex-col items-center justify-center">
        <Spinner size="md" />
        <p className="mt-4 text-sm text-gray-600">컴포넌트 로딩 중...</p>
      </div>
    </CardContent>
  </Card>
);
```

---

### Example 3: 차트 라이브러리 Lazy Loading

```typescript
// src/components/wizard/financial/BEPChart.tsx
import { lazy, Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Spinner } from '../../ui/Spinner';

// ✅ Recharts를 Lazy Loading
const LineChart = lazy(() => 
  import('recharts').then(module => ({ default: module.LineChart }))
);
const Line = lazy(() => 
  import('recharts').then(module => ({ default: module.Line }))
);
const XAxis = lazy(() => 
  import('recharts').then(module => ({ default: module.XAxis }))
);
const YAxis = lazy(() => 
  import('recharts').then(module => ({ default: module.YAxis }))
);
const CartesianGrid = lazy(() => 
  import('recharts').then(module => ({ default: module.CartesianGrid }))
);
const Tooltip = lazy(() => 
  import('recharts').then(module => ({ default: module.Tooltip }))
);
const Legend = lazy(() => 
  import('recharts').then(module => ({ default: module.Legend }))
);
const ResponsiveContainer = lazy(() => 
  import('recharts').then(module => ({ default: module.ResponsiveContainer }))
);

// 더 나은 방법: 전체 차트를 별도 컴포넌트로 분리
const ChartComponent = lazy(() => import('./BEPChartContent'));

interface BEPChartProps {
  data: Array<{
    units: number;
    revenue: number;
    cost: number;
    profit: number;
  }>;
}

export const BEPChart: React.FC<BEPChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 손익분기점 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            데이터를 입력하면 차트가 표시됩니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Suspense 
      fallback={
        <Card>
          <CardHeader>
            <CardTitle>📊 손익분기점 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Spinner />
            </div>
          </CardContent>
        </Card>
      }
    >
      <ChartComponent data={data} />
    </Suspense>
  );
};

// src/components/wizard/financial/BEPChartContent.tsx
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';

interface BEPChartContentProps {
  data: Array<{
    units: number;
    revenue: number;
    cost: number;
    profit: number;
  }>;
}

const BEPChartContent: React.FC<BEPChartContentProps> = ({ data }) => {
  const bepPoint = data.find((d) => d.profit >= 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 손익분기점 분석 (BEP)</CardTitle>
        {bepPoint && (
          <p className="text-sm text-gray-600 mt-2">
            손익분기점: <strong>{bepPoint.units}개</strong>
          </p>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="units" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#10b981" name="매출" strokeWidth={2} />
            <Line type="monotone" dataKey="cost" stroke="#ef4444" name="비용" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BEPChartContent;
```

---

### Example 4: Dynamic Import (모달, 다이얼로그)

```typescript
// src/components/ConfirmDialog.tsx
import { lazy, Suspense } from 'react';
import { Spinner } from './ui/Spinner';

// 모달은 실제로 열릴 때만 로드
const DialogContent = lazy(() => import('./ConfirmDialogContent'));

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <Suspense 
      fallback={
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <DialogContent
        onConfirm={onConfirm}
        onCancel={onCancel}
        title={title}
        message={message}
      />
    </Suspense>
  );
};

// 사용 예시
export const SomeComponent: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    setIsDialogOpen(true); // 이 시점에 DialogContent가 로드됨
  };

  return (
    <div>
      <Button onClick={handleDelete}>삭제</Button>
      <ConfirmDialog
        isOpen={isDialogOpen}
        onConfirm={() => {
          // 삭제 로직
          setIsDialogOpen(false);
        }}
        onCancel={() => setIsDialogOpen(false)}
        title="삭제 확인"
        message="정말 삭제하시겠습니까?"
      />
    </div>
  );
};
```

---

### Example 5: Bundle Analyzer 설정

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['recharts'],
          'markdown-vendor': ['react-markdown', 'remark-gfm'],
          
          // Feature chunks
          'wizard': [
            './src/pages/WizardStep.tsx',
            './src/components/wizard/QuestionForm.tsx',
          ],
          'financial': [
            './src/components/wizard/FinancialSimulation.tsx',
            './src/stores/useFinancialStore.ts',
            './src/hooks/useFinancialCalc.ts',
          ],
          'pmf': [
            './src/components/wizard/PMFSurvey.tsx',
            './src/stores/usePMFStore.ts',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 500, // KB
  },
});

// package.json에 추가
{
  "scripts": {
    "build:analyze": "vite build && open dist/stats.html"
  },
  "devDependencies": {
    "rollup-plugin-visualizer": "^5.9.0"
  }
}
```

---

### Example 6: Prefetching (선택적)

```typescript
// src/utils/prefetch.ts
/**
 * 사용자가 특정 페이지로 이동할 가능성이 높을 때 미리 로드
 */
export const prefetchComponent = (importFn: () => Promise<any>) => {
  // Idle 시간에 prefetch
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      importFn();
    });
  } else {
    // Fallback for Safari
    setTimeout(() => {
      importFn();
    }, 1);
  }
};

// 사용 예시
import { prefetchComponent } from '../utils/prefetch';

export const ProjectCreate: React.FC = () => {
  const handleStartWizard = () => {
    // WizardStep으로 이동하기 전에 prefetch
    prefetchComponent(() => import('../pages/WizardStep'));
    
    navigate(`/wizard/${projectId}/1`);
  };

  return (
    <Button onClick={handleStartWizard}>시작하기</Button>
  );
};
```

## 📁 New Files to Create

```
src/
├── components/
│   ├── PageLoadingFallback.tsx           (NEW)
│   ├── ComponentLoadingFallback.tsx      (NEW)
│   └── wizard/
│       └── financial/
│           └── BEPChartContent.tsx       (NEW - separated for lazy loading)
└── utils/
    └── prefetch.ts                       (NEW - optional)
```

## ⚠️ Considerations

1. **Suspense Fallback 디자인**: 사용자 경험을 해치지 않는 적절한 로딩 UI
2. **Error Boundary 통합**: Lazy Loading 실패 시 에러 처리
3. **번들 크기 모니터링**: 정기적으로 번들 크기 확인
4. **과도한 분할 지양**: 너무 작은 청크는 오히려 성능 저하
5. **Network Waterfall**: Suspense 중첩 시 순차 로딩 주의

## 🔗 Related Issues

- #006 - 에러 처리 (Lazy Loading 실패 처리)
- #011 - 번들 최적화 (함께 진행 권장)

## 📚 References

- [React Lazy Loading](https://react.dev/reference/react/lazy)
- [Code Splitting Best Practices](https://web.dev/code-splitting-suspense/)
- [Vite Code Splitting](https://vitejs.dev/guide/features.html#code-splitting)

## ✅ Acceptance Criteria

- [ ] 모든 주요 페이지에 Lazy Loading 적용
- [ ] Step 4, 5 컴포넌트 Lazy Loading 적용
- [ ] 차트 라이브러리 Lazy Loading 적용
- [ ] Suspense Fallback UI 구현
- [ ] Bundle Analyzer 설정 및 분석
- [ ] 초기 번들 크기 40% 이상 감소
- [ ] 초기 로딩 시간 40% 이상 감소
- [ ] manualChunks 설정으로 vendor 분리

## ⏱️ Estimated Time

**2일** (16시간)
- 라우트 기반 Code Splitting: 4시간
- 컴포넌트 Lazy Loading: 4시간
- Fallback UI 구현: 2시간
- Bundle Analyzer 설정 및 최적화: 3시간
- 테스트 및 검증: 2시간
- 문서화: 1시간

## 👤 Assignee

_To be assigned_

## 📅 Timeline

- **Start Date**: 2025-11-24
- **Due Date**: 2025-11-26
- **Completed Date**: -

## 💬 Notes

Code Splitting은 사용자 경험에 직접적인 영향을 미치는 중요한 최적화입니다. 단, Suspense Fallback UI가 자주 보이면 오히려 사용자 경험이 나빠질 수 있으므로, 적절한 로딩 전략(prefetch, preload 등)을 고려해야 합니다.

