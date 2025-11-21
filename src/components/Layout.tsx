/**
 * 파일명: Layout.tsx
 * 
 * 파일 용도:
 * 마법사 페이지의 공통 레이아웃 컴포넌트
 * - 헤더, 사이드바, 메인 콘텐츠 영역 제공
 * - 마법사 진행 상태 표시
 * - 단계별 네비게이션 UI
 * 
 * 호출 구조:
 * Layout (이 컴포넌트)
 *   ├─> useWizardStore - 마법사 진행 상태
 *   │   ├─> currentStep - 현재 단계
 *   │   ├─> steps - 전체 단계 목록
 *   │   └─> isStepCompleted() - 단계 완료 여부
 *   │
 *   ├─> useProjectStore - 프로젝트 정보
 *   │   └─> currentProject - 현재 프로젝트
 *   │
 *   └─> 자식 컴포넌트
 *       ├─> SaveIndicator - 저장 상태 표시
 *       ├─> Progress - 진행률 바
 *       └─> Outlet - 라우트 콘텐츠 (WizardStep, BusinessPlanViewer)
 * 
 * 데이터 흐름:
 * useWizardStore → 진행률 계산 → Progress 컴포넌트
 * useWizardStore → 단계 목록 → 사이드바 네비게이션
 * 
 * 조건부 렌더링:
 * - /wizard/* 경로: 전체 레이아웃 (헤더 + 사이드바 + 콘텐츠)
 * - 기타 경로: Outlet만 렌더링 (레이아웃 없음)
 */

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useWizardStore } from '../stores/useWizardStore';
import { useProjectStore } from '../stores/useProjectStore';
import { SaveIndicator } from './SaveIndicator';
import { Progress } from './ui';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Layout 컴포넌트
 * 
 * 역할:
 * - 마법사 페이지의 공통 레이아웃 제공
 * - 헤더: 로고, 프로젝트명, 저장 상태
 * - 사이드바: 단계 목록, 진행률
 * - 메인: 각 단계의 콘텐츠 (Outlet)
 * 
 * 주요 기능:
 * 1. 진행률 계산 및 표시
 * 2. 단계별 네비게이션 (완료/진행 중/미완료 표시)
 * 3. 현재 단계 하이라이트
 * 4. 자동 저장 상태 표시
 * 
 * 조건부 렌더링:
 * - 마법사 페이지(/wizard/*)일 때만 레이아웃 표시
 * - 그 외 페이지는 Outlet만 렌더링
 * 
 * @returns {JSX.Element} 레이아웃 컴포넌트
 */
export const Layout: React.FC = () => {
  const location = useLocation();
  const { currentStep, steps, isStepCompleted } = useWizardStore();
  const { currentProject } = useProjectStore();

  const isWizardPage = location.pathname.startsWith('/wizard');

  // 마법사 페이지가 아닌 경우 레이아웃 없이 콘텐츠만 렌더링
  if (!isWizardPage) {
    return <Outlet />;
  }

  // 진행률 계산
  const completedSteps = steps.filter((step) => isStepCompleted(step.id)).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-xl font-bold text-primary-600">
                StartupPlan
              </Link>
              {currentProject && (
                <>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-700 font-medium">{currentProject.name}</span>
                </>
              )}
            </div>
            <SaveIndicator />
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">진행률</span>
              <span className="text-sm font-medium text-gray-900">
                {completedSteps}/{steps.length}
              </span>
            </div>
            <Progress value={progressPercentage} showLabel />
          </div>

          <nav className="space-y-1">
            {steps.map((step) => {
              const isCompleted = isStepCompleted(step.id);
              const isCurrent = currentStep === step.id;

              return (
                <Link
                  key={step.id}
                  to={`/wizard/${step.id}`}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isCurrent
                      ? 'bg-primary-50 text-primary-700'
                      : isCompleted
                      ? 'text-gray-700 hover:bg-gray-50'
                      : 'text-gray-400 hover:bg-gray-50'
                  )}
                >
                  <div className={cn(
                    'flex items-center justify-center w-6 h-6 rounded-full text-xs flex-shrink-0',
                    isCurrent
                      ? 'bg-primary-600 text-white'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  )}>
                    {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className="truncate">{step.title}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

