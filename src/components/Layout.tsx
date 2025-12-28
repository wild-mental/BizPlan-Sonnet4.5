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
import { DemoHeader } from './DemoHeader';
import { Progress } from './ui';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { TEMPLATE_THEMES } from '../constants/templateThemes';

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
  const { currentStep, steps, isStepCompleted, templateType, getActiveSteps } = useWizardStore();
  const { currentProject } = useProjectStore();

  const isWizardPage = location.pathname.startsWith('/wizard');

  // 마법사 페이지가 아닌 경우 레이아웃 없이 콘텐츠만 렌더링
  if (!isWizardPage) {
    return <Outlet />;
  }

  // 템플릿별 테마 가져오기
  const theme = templateType ? TEMPLATE_THEMES[templateType] : null;
  const themeColor = theme?.primaryColor || 'primary';
  
  // 활성화된 단계 목록 (템플릿별 또는 기본)
  const activeSteps = getActiveSteps();

  // 진행률 계산
  const completedSteps = activeSteps.filter((step) => isStepCompleted(step.id)).length;
  const progressPercentage = (completedSteps / activeSteps.length) * 100;

  // 테마별 스타일 클래스
  const themeStyles = {
    emerald: {
      headerBg: 'bg-gradient-to-r from-emerald-600 to-cyan-600',
      sidebarBg: 'bg-emerald-50',
      sidebarBorder: 'border-emerald-200',
      currentBg: 'bg-emerald-100 text-emerald-800',
      currentIcon: 'bg-emerald-600 text-white',
      completedIcon: 'bg-emerald-500 text-white',
      progressBar: 'bg-emerald-500',
    },
    blue: {
      headerBg: 'bg-gradient-to-r from-blue-600 to-purple-600',
      sidebarBg: 'bg-blue-50',
      sidebarBorder: 'border-blue-200',
      currentBg: 'bg-blue-100 text-blue-800',
      currentIcon: 'bg-blue-600 text-white',
      completedIcon: 'bg-blue-500 text-white',
      progressBar: 'bg-blue-500',
    },
    amber: {
      headerBg: 'bg-gradient-to-r from-amber-600 to-orange-600',
      sidebarBg: 'bg-amber-50',
      sidebarBorder: 'border-amber-200',
      currentBg: 'bg-amber-100 text-amber-800',
      currentIcon: 'bg-amber-600 text-white',
      completedIcon: 'bg-amber-500 text-white',
      progressBar: 'bg-amber-500',
    },
    primary: {
      headerBg: 'bg-white',
      sidebarBg: 'bg-white',
      sidebarBorder: 'border-gray-200',
      currentBg: 'bg-primary-50 text-primary-700',
      currentIcon: 'bg-primary-600 text-white',
      completedIcon: 'bg-green-500 text-white',
      progressBar: 'bg-primary-500',
    },
  };
  
  const currentTheme = themeStyles[themeColor as keyof typeof themeStyles] || themeStyles.primary;

  // 작성 데모 단계 정의 (간결한 라벨 사용)
  const stepLabels: Record<string, string> = {
    '일반현황 및 개요': '일반현황',
    '문제인식 (Problem)': 'Problem',
    '실현가능성 (Solution)': 'Solution',
    '성장전략 (Scale-up)': 'Scale-up',
    '팀 구성 (Team)': 'Team',
    '재무 계획': '재무계획',
  };
  
  const writingSteps = activeSteps.map((step) => ({
    id: String(step.id),
    label: stepLabels[step.title] || step.title,
  }));

  // 서브타이틀 생성 (템플릿명 + 프로젝트명)
  const subtitle = [
    theme ? `${theme.icon} ${theme.name}` : null,
    currentProject?.name,
  ].filter(Boolean).join(' | ');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 통합 데모 헤더 */}
      <DemoHeader
        demoType="writing"
        currentStep={String(currentStep)}
        steps={writingSteps}
        theme="light"
        subtitle={subtitle || '사업계획서 작성'}
      />

      <div className="flex max-w-7xl mx-auto pt-16">
        {/* Sidebar */}
        <aside className={cn(
          'w-64 border-r min-h-[calc(100vh-4rem)] p-6',
          theme ? `${currentTheme.sidebarBg} ${currentTheme.sidebarBorder}` : 'bg-white border-gray-200'
        )}>
          {/* 템플릿 정보 표시 */}
          {theme && (
            <div className="mb-6 p-3 rounded-lg bg-white/80 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{theme.icon}</span>
                <span className="font-semibold text-gray-900">{theme.name}</span>
              </div>
              <p className="text-xs text-gray-500">{theme.badge}</p>
            </div>
          )}
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">진행률</span>
              <span className="text-sm font-medium text-gray-900">
                {completedSteps}/{activeSteps.length}
              </span>
            </div>
            <Progress value={progressPercentage} showLabel />
          </div>

          <nav className="space-y-1">
            {activeSteps.map((step) => {
              const isCompleted = isStepCompleted(step.id);
              const isCurrent = currentStep === step.id;

              return (
                <Link
                  key={step.id}
                  to={`/wizard/${step.id}`}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isCurrent
                      ? currentTheme.currentBg
                      : isCompleted
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-400 hover:bg-gray-100'
                  )}
                >
                  <div className={cn(
                    'flex items-center justify-center w-6 h-6 rounded-full text-xs flex-shrink-0',
                    isCurrent
                      ? currentTheme.currentIcon
                      : isCompleted
                      ? currentTheme.completedIcon
                      : 'bg-gray-200 text-gray-500'
                  )}>
                    {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className="truncate">{step.title}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* 평가 초점 안내 */}
          {theme && (
            <div className="mt-6 p-3 rounded-lg bg-white/80 border border-gray-200">
              <p className="text-xs text-gray-500 mb-2">📌 핵심 평가 영역</p>
              <div className="flex flex-wrap gap-1">
                {theme.focusAreas.map((area, i) => (
                  <span 
                    key={i} 
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      themeColor === 'emerald' 
                        ? 'bg-emerald-100 text-emerald-700'
                        : themeColor === 'blue'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                    )}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

