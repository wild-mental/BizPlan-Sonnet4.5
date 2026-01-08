/**
 * 파일명: App.tsx
 * 
 * 파일 용도:
 * 애플리케이션의 루트 컴포넌트 및 라우팅 설정
 * - React Router를 사용한 페이지 라우팅 구성
 * - 전체 애플리케이션의 네비게이션 구조 정의
 * 
 * 라우팅 구조:
 * / (루트)
 *   └─> LandingPage: 고객 유입용 랜딩페이지
 * /writing-demo
 *   └─> ProjectCreate: 사업계획서 작성 데모 페이지
 * /wizard/:stepId
 *   └─> Layout > WizardStep: 단계별 마법사 페이지
 * /business-plan
 *   └─> Layout > BusinessPlanViewer: 사업계획서 뷰어 페이지
 * /* (기타)
 *   └─> Navigate: 루트로 리다이렉트
 * 
 * 데이터 흐름:
 * - URL 변경 → React Router → 해당 페이지 컴포넌트 렌더링
 * - Layout 컴포넌트는 공통 레이아웃(헤더, 사이드바 등)을 제공
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { TeamPage } from './pages/TeamPage';
import { ProjectCreate } from './pages/ProjectCreate';
import { WizardStep } from './pages/WizardStep';
import { BusinessPlanViewer } from './pages/BusinessPlanViewer';
import { EvaluationDemoPage } from './pages/EvaluationDemo';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AdminPage } from './pages/AdminPage';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { trackPageView } from './utils/analytics';

/**
 * RouteTracker 컴포넌트
 * 
 * 역할:
 * - 라우트 변경 시 GA4 페이지뷰 이벤트 전송
 * - BrowserRouter 내부에서만 사용 가능 (useLocation 훅 사용)
 */
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

/**
 * App 컴포넌트
 * 
 * 역할:
 * - 애플리케이션의 최상위 컴포넌트
 * - BrowserRouter로 SPA 라우팅 활성화
 * - 모든 페이지 경로와 컴포넌트 매핑
 * 
 * @returns {JSX.Element} 라우터가 설정된 앱 컴포넌트
 */
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* GA4 페이지뷰 자동 추적 */}
        <RouteTracker />
        <Routes>
          {/* 랜딩페이지: 고객 유입 Hook */}
          <Route path="/" element={<LandingPage />} />

          {/* 회원가입: 요금제 선택 후 가입 */}
          <Route path="/signup" element={<SignupPage />} />

          {/* 로그인 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 이메일 인증 */}
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* 비밀번호 재설정 */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* 팀 소개 페이지 */}
          <Route path="/team" element={<TeamPage />} />

          {/* 앱 시작점: 프로젝트 생성 (사업계획서 작성 데모) */}
          <Route path="/writing-demo" element={<ProjectCreate />} />

          {/* AI 평가 데모: M.A.K.E.R.S 심사위원단 평가 체험 */}
          <Route path="/evaluation-demo" element={<EvaluationDemoPage />} />

          {/* 어드민 페이지 */}
          <Route path="/admin" element={<AdminPage />} />

          {/* 분석 대시보드 (공개) */}
          <Route path="/analytics" element={<AnalyticsDashboard />} />

          {/* Layout으로 감싸진 페이지들 (공통 레이아웃 적용) */}
          <Route element={<Layout />}>
            <Route path="/wizard/:stepId" element={<WizardStep />} />
            <Route path="/business-plan" element={<BusinessPlanViewer />} />
          </Route>

          {/* 404 처리: 모든 미정의 경로를 루트로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

