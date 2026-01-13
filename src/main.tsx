/**
 * 파일명: main.tsx
 * 
 * 파일 용도:
 * React 애플리케이션의 진입점(Entry Point)
 * - DOM에 React 앱을 마운트하고 초기화
 * - StrictMode로 잠재적 문제를 감지
 * - React Query 설정
 * - Mock API 활성화 (개발 환경)
 * - Google Analytics 4 초기화
 * 
 * 호출 구조:
 * main.tsx (진입점)
 *   └─> QueryClientProvider (React Query)
 *       └─> App.tsx (라우팅 설정)
 *           ├─> ProjectCreate (프로젝트 생성 페이지)
 *           ├─> Layout (레이아웃 래퍼)
 *           │   ├─> WizardStep (마법사 단계 페이지)
 *           │   └─> BusinessPlanViewer (사업계획서 뷰어)
 *           └─> Navigate (404 리다이렉트)
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import App from './App.tsx'
import { initializeGA } from './utils/analytics'

// Google Analytics 4 초기화
initializeGA()

// React Query 클라이언트 설정
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
})

// Mock API 활성화 (개발 환경)
async function enableMocking() {
  // 프로덕션 환경이거나 MOCK_API가 명시적으로 켜져있지 않으면 비활성화
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_MOCK_API !== 'true') {
    return
  }

  const { worker } = await import('./mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

/**
 * React 애플리케이션 마운트
 * - Mock API 활성화 후 앱 렌더링
 * - QueryClientProvider로 React Query 활성화
 * - #root DOM 요소에 React 앱을 렌더링
 * - StrictMode를 사용하여 개발 중 잠재적 문제를 조기 발견
 */
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>,
  )
})
