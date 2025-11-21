import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWizardStore } from '../stores/useWizardStore';
import { Button } from '../components/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { QuestionForm } from '../components/wizard/QuestionForm';
import { FinancialSimulation } from '../components/wizard/FinancialSimulation';
import { PMFSurvey } from '../components/wizard/PMFSurvey';

export const WizardStep: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const { currentStep, setCurrentStep, steps, isStepCompleted, goToNextStep, goToPreviousStep } = useWizardStore();

  const stepNumber = parseInt(stepId || '1', 10);
  const step = steps.find((s) => s.id === stepNumber);

  useEffect(() => {
    if (stepNumber !== currentStep) {
      setCurrentStep(stepNumber);
    }
  }, [stepNumber, currentStep, setCurrentStep]);

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

  const handleNext = () => {
    if (stepNumber < steps.length) {
      goToNextStep();
      navigate(`/wizard/${stepNumber + 1}`);
    } else {
      // Navigate to business plan viewer
      navigate('/business-plan');
    }
  };

  const handlePrevious = () => {
    if (stepNumber > 1) {
      goToPreviousStep();
      navigate(`/wizard/${stepNumber - 1}`);
    }
  };

  const isCompleted = isStepCompleted(stepNumber);
  const canProceed = stepNumber === steps.length || isCompleted || stepNumber === 4 || stepNumber === 5;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{step.icon}</span>
          <div>
            <div className="text-sm text-gray-500 font-medium">
              Step {step.id} / {steps.length}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{step.title}</h1>
          </div>
        </div>
        <p className="text-gray-600 mt-2">{step.description}</p>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-6">
        {stepNumber === 4 ? (
          <FinancialSimulation />
        ) : stepNumber === 5 ? (
          <PMFSurvey />
        ) : (
          <QuestionForm questions={step.questions} stepId={stepNumber} />
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
        >
          {stepNumber === steps.length ? '사업계획서 생성' : '다음'}
          {stepNumber < steps.length && <ChevronRight className="w-4 h-4 ml-1" />}
        </Button>
      </div>

      {/* Help Text */}
      {!isCompleted && stepNumber !== 4 && stepNumber !== 5 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          필수 항목(*)을 모두 입력하면 다음 단계로 진행할 수 있습니다.
        </div>
      )}
    </div>
  );
};

