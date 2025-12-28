/**
 * 파일명: WizardStep.tsx
 * 
 * 파일 용도:
 * 마법사 단계별 페이지 컨테이너 (PSST 프레임워크 기반 6단계)
 * - URL 파라미터로 현재 단계 결정
 * - 단계에 맞는 컴포넌트 렌더링 (QuestionForm, FinancialSimulation)
 * - 단계 간 이동 및 진행 상태 관리
 * - 마지막 단계에서 AI 사업계획서 생성 (백엔드 API 호출)
 * 
 * 호출 구조:
 * WizardStep (이 컴포넌트)
 *   ├─> useWizardStore - 마법사 상태 관리
 *   │   ├─> setCurrentStep() - 현재 단계 설정
 *   │   ├─> isStepCompleted() - 단계 완료 여부 확인
 *   │   ├─> goToNextStep() - 다음 단계로 이동
 *   │   └─> goToPreviousStep() - 이전 단계로 이동
 *   │
 *   ├─> useBusinessPlanStore - 생성된 사업계획서 저장
 *   │
 *   ├─> businessPlanApi - 백엔드 API 호출
 *   │
 *   └─> 단계별 컴포넌트 렌더링
 *       ├─> QuestionForm (1-5단계) - 질문 폼 (PSST)
 *       └─> FinancialSimulation (6단계) - 재무 시뮬레이션 + AI 생성
 * 
 * PSST 프레임워크:
 * 1. 문제 인식 (Problem)
 * 2. 시장 분석
 * 3. 실현 방안 (Solution)
 * 4. 사업화 전략 (Scale-up)
 * 5. 팀 역량 (Team)
 * 6. 재무 계획 → AI 사업계획서 생성 (백엔드 API 호출)
 * 
 * 데이터 흐름:
 * URL (/wizard/:stepId) → stepId 추출 → 해당 단계 렌더링
 * ↓
 * 사용자 입력 → 각 단계 컴포넌트 → useWizardStore 업데이트
 * ↓
 * 완료 시 → 백엔드 API 호출 → 응답 저장 → navigate('/business-plan')
 * 
 * 사용하는 Store:
 * - useWizardStore: 마법사 진행 상태 및 단계별 데이터
 * - useBusinessPlanStore: 생성된 사업계획서 데이터
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWizardStore } from '../stores/useWizardStore';
import { useBusinessPlanStore } from '../stores/useBusinessPlanStore';
import { useProjectStore } from '../stores/useProjectStore';
import { Button, Spinner } from '../components/ui';
import { ChevronLeft, ChevronRight, Sparkles, AlertCircle, Info } from 'lucide-react';
import { QuestionForm } from '../components/wizard/QuestionForm';
import { FinancialSimulation } from '../components/wizard/FinancialSimulation';
import { PreStartupBudgetCalculator } from '../components/wizard/PreStartupBudgetCalculator';
import { EarlyStartupBudgetCalculator } from '../components/wizard/EarlyStartupBudgetCalculator';
import { TemplateComparisonGuide } from '../components/wizard/GuideBox';
import { TEMPLATE_THEMES } from '../constants/templateThemes';
import { ExtendedWizardStep } from '../types/templateQuestions';
import { 
  generateBusinessPlan, 
  buildBusinessPlanRequest 
} from '../services/businessPlanApi';

/**
 * WizardStep 컴포넌트
 * 
 * 역할:
 * - 마법사 단계별 페이지 라우팅 및 렌더링
 * - 단계 간 네비게이션 제어
 * - 진행 상태 동기화
 * 
 * 주요 기능:
 * 1. URL 파라미터로 현재 단계 결정
 * 2. 단계별 적절한 컴포넌트 렌더링
 * 3. 이전/다음 버튼으로 단계 이동
 * 4. 단계 완료 여부에 따른 진행 제어
 * 5. 마지막 단계 완료 시 사업계획서 페이지로 이동
 * 
 * @returns {JSX.Element} 마법사 단계 페이지
 */
export const WizardStep: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const { 
    currentStep, 
    setCurrentStep, 
    steps, 
    extendedSteps,
    templateType,
    isStepCompleted, 
    markStepVisited, 
    goToNextStep, 
    goToPreviousStep, 
    getAllDataWithDefaults,
    getActiveSteps,
  } = useWizardStore();
  const { setGeneratedPlan, setLoading, setError, isLoading, error } = useBusinessPlanStore();
  const { currentProject } = useProjectStore();
  
  // AI 사업계획서 생성 중 상태 (로컬 상태 + Store 상태 병행)
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const stepNumber = parseInt(stepId || '1', 10);
  
  // 템플릿별 질문이 있으면 사용, 없으면 기본 질문 사용
  const activeSteps = getActiveSteps();
  const step = activeSteps.find((s) => s.id === stepNumber);
  
  // 확장된 단계인지 확인 (가이드 박스가 있는지)
  const extendedStep = step as ExtendedWizardStep | undefined;
  const hasGuideBox = extendedStep?.guideBox !== undefined;
  
  // 현재 템플릿 테마 가져오기
  const theme = templateType ? TEMPLATE_THEMES[templateType] : null;
  const themeColor = theme?.primaryColor || 'emerald';

  /**
   * URL 파라미터와 Store 상태 동기화
   * [개발/디버깅 모드] 모든 단계 진입 시 방문 기록 저장 (완료 체크 표시)
   */
  useEffect(() => {
    if (stepNumber !== currentStep) {
      setCurrentStep(stepNumber);
    }
    
    // [개발/디버깅 모드] 모든 단계 진입 시 방문 기록 (체크 표시를 위해)
    markStepVisited(stepNumber);
  }, [stepNumber, currentStep, setCurrentStep, markStepVisited]);

  if (!step) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">단계를 찾을 수 없습니다</h2>
          <Button onClick={() => navigate('/wizard/1')}>첫 단계로 이동</Button>
        </div>
      </div>
    );
  }

  /**
   * 다음 단계로 이동 또는 AI 사업계획서 생성
   * 
   * 처리 순서:
   * 1. 마지막 단계가 아니면 → 다음 단계 번호로 이동
   * 2. 마지막 단계이면 → 백엔드 API 호출하여 AI 사업계획서 생성
   */
  const handleNext = () => {
    if (stepNumber < steps.length) {
      goToNextStep();
      navigate(`/wizard/${stepNumber + 1}`);
    } else {
      // 마지막 단계: AI 사업계획서 생성 (백엔드 API 호출)
      handleGenerateBusinessPlan();
    }
  };

  /**
   * AI 사업계획서 생성 및 결과 페이지 이동
   * - 백엔드 API (POST /api/v1/business-plan/generate) 호출
   * - 생성 완료 후 결과 페이지로 이동
   */
  const handleGenerateBusinessPlan = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setLoading(true);
    
    // Wizard 데이터 수집 (빈 값은 placeholder로 대체)
    const wizardData = getAllDataWithDefaults();
    console.log('=== AI 사업계획서 생성 요청 준비 ===');
    console.log('Wizard 데이터:', JSON.stringify(wizardData, null, 2));
    
    // API 요청 데이터 구성
    const requestData = buildBusinessPlanRequest(wizardData);
    
    try {
      // 백엔드 API 호출
      const response = await generateBusinessPlan(requestData);
      
      if (response.success && response.data) {
        // 성공: 생성된 사업계획서 저장 및 결과 페이지로 이동
        console.log('=== AI 사업계획서 생성 성공 ===');
        setGeneratedPlan(response.data);
        setIsGenerating(false);
        navigate('/business-plan');
      } else {
        // 실패: 에러 메시지 저장 후 결과 페이지로 이동 (예제 문서 표시)
        const errorMessage = response.error?.message || '사업계획서 생성에 실패했습니다.';
        console.error('=== AI 사업계획서 생성 실패 ===', response.error);
        setError(errorMessage);
        setIsGenerating(false);
        // 에러가 있어도 결과 페이지로 이동하여 예제 문서 + 에러 배너 표시
        navigate('/business-plan');
      }
    } catch (err) {
      // 예외 발생: 에러 메시지 저장 후 결과 페이지로 이동
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      console.error('=== AI 사업계획서 생성 중 예외 발생 ===', err);
      setError(errorMessage);
      setIsGenerating(false);
      // 에러가 있어도 결과 페이지로 이동하여 예제 문서 + 에러 배너 표시
      navigate('/business-plan');
    }
  };

  /**
   * 이전 단계로 이동
   * - 첫 단계가 아니면 이전 단계 번호로 이동
   */
  const handlePrevious = () => {
    if (stepNumber > 1) {
      goToPreviousStep();
      navigate(`/wizard/${stepNumber - 1}`);
    }
  };

  const isCompleted = isStepCompleted(stepNumber);
  // [개발/디버깅 모드] 단계 완료 여부와 관계없이 항상 다음 버튼 활성화
  const canProceed = true;
  const isLastStep = stepNumber === steps.length;

  // AI 생성 중 로딩 오버레이
  if (isGenerating) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-16">
          <Spinner size="lg" className="mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            AI가 사업계획서를 작성 중입니다...
          </h2>
          <p className="text-gray-600">
            백엔드 서버에 요청을 전송하고 응답을 기다리는 중입니다.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            입력하신 정보를 분석하여 최적의 사업계획서를 작성하고 있습니다.
          </p>
          <div className="mt-8 max-w-md mx-auto">
            <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-primary-600 rounded-full animate-pulse" style={{ width: '66%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 발생 시 에러 UI
  if (generationError) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            사업계획서 생성에 실패했습니다
          </h2>
          <p className="text-gray-600 mb-2">
            {generationError}
          </p>
          <p className="text-sm text-gray-500 mb-8">
            백엔드 서버(localhost:8080)가 실행 중인지 확인해주세요.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setGenerationError(null)}
            >
              돌아가기
            </Button>
            <Button onClick={handleGenerateBusinessPlan}>
              <Sparkles className="w-4 h-4 mr-1" />
              다시 시도
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3단계(실현가능성)에서 자금 계산기 표시 여부
  const showBudgetCalculator = stepNumber === 3 && templateType && templateType !== 'bank-loan';

  return (
    <div className="max-w-3xl mx-auto">
      {/* 템플릿 정보 배지 */}
      {theme && (
        <div className="mb-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
            themeColor === 'emerald' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : themeColor === 'blue'
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}>
            <span>{theme.icon}</span>
            <span className="font-medium">{theme.name}</span>
            <span className="text-white/40">|</span>
            <span className="text-white/60">{theme.badge}</span>
          </div>
        </div>
      )}

      {/* Step Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{step.icon}</span>
          <div>
            <div className={`text-sm font-medium ${
              themeColor === 'emerald' ? 'text-emerald-400' 
              : themeColor === 'blue' ? 'text-blue-400' 
              : 'text-gray-500'
            }`}>
              Step {step.id} / {activeSteps.length}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{step.title}</h1>
          </div>
        </div>
        <p className="text-gray-600 mt-2">{step.description}</p>
        
        {/* 템플릿 비교 가이드 (1단계에서만 표시) */}
        {stepNumber === 1 && templateType && templateType !== 'bank-loan' && (
          <div className="mt-4">
            <TemplateComparisonGuide selectedTemplate={templateType} />
          </div>
        )}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-6">
        {stepNumber === 6 ? (
          <FinancialSimulation />
        ) : (
          <>
            {/* 질문 폼 (가이드 박스 포함) */}
            <QuestionForm 
              questions={step.questions} 
              stepId={stepNumber}
              guideBox={hasGuideBox ? extendedStep?.guideBox : undefined}
              theme={themeColor === 'blue' ? 'blue' : themeColor === 'amber' ? 'amber' : 'emerald'}
            />
            
            {/* 3단계: 자금 계획 계산기 */}
            {showBudgetCalculator && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <Info className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    정부지원금 집행계획 계산기
                  </h3>
                </div>
                {templateType === 'pre-startup' ? (
                  <PreStartupBudgetCalculator stepId={stepNumber} />
                ) : (
                  <EarlyStartupBudgetCalculator stepId={stepNumber} />
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={stepNumber === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          이전
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className={
            themeColor === 'emerald' 
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400'
              : themeColor === 'blue'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400'
                : ''
          }
        >
          {isLastStep ? (
            <>
              <Sparkles className="w-4 h-4 mr-1" />
              AI 사업계획서 생성
            </>
          ) : (
            <>
              다음
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>

      {/* 진행 상태 표시 */}
      <div className="mt-6">
        <div className="flex justify-center gap-2">
          {activeSteps.map((s) => (
            <div
              key={s.id}
              className={`w-2 h-2 rounded-full transition-all ${
                s.id === stepNumber
                  ? themeColor === 'emerald' 
                    ? 'w-6 bg-emerald-500' 
                    : themeColor === 'blue'
                      ? 'w-6 bg-blue-500'
                      : 'w-6 bg-primary-500'
                  : s.id < stepNumber
                    ? 'bg-gray-400'
                    : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

