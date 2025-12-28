/**
 * AI 심사위원단 평가 데모 페이지
 * M.A.K.E.R.S 6대 핵심 평가 영역 체험
 */

import React, { useEffect } from 'react';
import { useEvaluationStore } from '../../stores/useEvaluationStore';
import { DemoHeader } from '../../components/DemoHeader';
import IntroSection from './IntroSection';
import InputSection from './InputSection';
import AnalyzingSection from './AnalyzingSection';
import ResultSection from './ResultSection';

// 평가 데모 단계 정의
const evaluationSteps = [
  { id: 'intro', label: '소개' },
  { id: 'input', label: '입력' },
  { id: 'analyzing', label: '분석' },
  { id: 'result', label: '결과' },
];

export const EvaluationDemoPage: React.FC = () => {
  const { currentStep } = useEvaluationStore();

  // 페이지 진입 시 스크롤 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  // 현재 단계에 맞는 컴포넌트 렌더링
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'intro':
        return <IntroSection />;
      case 'input':
        return <InputSection />;
      case 'analyzing':
        return <AnalyzingSection />;
      case 'result':
        return <ResultSection />;
      default:
        return <IntroSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* 통합 데모 헤더 */}
      <DemoHeader
        demoType="evaluation"
        currentStep={currentStep}
        steps={evaluationSteps}
        theme="dark"
        subtitle="AI 심사위원단 평가"
      />

      {/* 메인 콘텐츠 (헤더 높이만큼 패딩) */}
      <main className="pt-16">
        {renderCurrentStep()}
      </main>
    </div>
  );
};

export default EvaluationDemoPage;

