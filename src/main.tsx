/**
 * 파일명: main.tsx
 * 
 * 파일 용도:
 * React 애플리케이션의 진입점(Entry Point)
 * - DOM에 React 앱을 마운트하고 초기화
 * - StrictMode로 잠재적 문제를 감지
 * 
 * 호출 구조:
 * main.tsx (진입점)
 *   └─> App.tsx (라우팅 설정)
 *       ├─> ProjectCreate (프로젝트 생성 페이지)
 *       ├─> Layout (레이아웃 래퍼)
 *       │   ├─> WizardStep (마법사 단계 페이지)
 *       │   └─> BusinessPlanViewer (사업계획서 뷰어)
 *       └─> Navigate (404 리다이렉트)
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * React 애플리케이션 마운트
 * - #root DOM 요소에 React 앱을 렌더링
 * - StrictMode를 사용하여 개발 중 잠재적 문제를 조기 발견
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
