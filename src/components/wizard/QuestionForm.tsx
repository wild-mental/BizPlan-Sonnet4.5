/**
 * 파일명: QuestionForm.tsx
 * 
 * 파일 용도:
 * 마법사 단계별 질문 폼 렌더링 컴포넌트
 * - 질문 타입에 따라 적절한 입력 필드 생성
 * - 사용자 입력을 Store에 저장
 * - 자동 저장 기능
 * - 템플릿별 가이드 박스 표시 지원
 * 
 * 호출 구조:
 * QuestionForm (이 컴포넌트)
 *   ├─> useWizardStore - 마법사 데이터 관리
 *   │   ├─> updateStepData(stepId, questionId, value) - 답변 저장
 *   │   └─> getStepData(stepId) - 현재 단계 데이터 조회
 *   │
 *   ├─> useAutoSave(stepData, 1000) - 1초마다 자동 저장
 *   │
 *   ├─> GuideBox - 단계별 작성 가이드 표시
 *   │
 *   └─> UI 컴포넌트 렌더링
 *       ├─> Input (type=text, number)
 *       └─> Textarea (type=textarea)
 * 
 * 데이터 흐름:
 * 1. getStepData(stepId)로 기존 답변 로드
 * 2. 사용자 입력 → handleChange()
 * 3. updateStepData()로 Store 업데이트
 * 4. useAutoSave()가 변경 감지 후 1초 뒤 자동 저장
 * 
 * 사용하는 Store:
 * - useWizardStore: 질문 답변 데이터
 */

import React from 'react';
import { useWizardStore } from '../../stores/useWizardStore';
import { useAutoSave } from '../../hooks/useAutoSave';
import { Question } from '../../types';
import { ExtendedQuestion, GuideBox as GuideBoxType } from '../../types/templateQuestions';
import { Input, Textarea } from '../ui';
import { GuideBox, InlineGuide } from './GuideBox';

interface QuestionFormProps {
  /** 렌더링할 질문 목록 (기본 또는 확장) */
  questions: Question[] | ExtendedQuestion[];
  /** 현재 마법사 단계 ID */
  stepId: number;
  /** 단계별 가이드 박스 (선택) */
  guideBox?: GuideBoxType;
  /** 테마 색상 (템플릿별) */
  theme?: 'emerald' | 'blue' | 'amber' | 'purple';
}

/**
 * 질문이 확장된 타입인지 확인
 */
const isExtendedQuestion = (question: Question | ExtendedQuestion): question is ExtendedQuestion => {
  return 'guide' in question || 'examples' in question || 'warnings' in question;
};

/**
 * QuestionForm 컴포넌트
 * 
 * 역할:
 * - 마법사 단계별 질문 폼 렌더링
 * - 질문 타입별 적절한 입력 필드 제공 (text, textarea, number)
 * - 사용자 입력 데이터 관리 및 자동 저장
 * - 템플릿별 가이드 박스 및 인라인 가이드 표시
 * 
 * 주요 기능:
 * 1. 질문 타입에 따른 동적 폼 렌더링
 * 2. 실시간 데이터 Store 업데이트
 * 3. 1초 디바운스 자동 저장
 * 4. 필수/선택 필드 구분
 * 5. 템플릿별 작성 가이드 표시
 * 
 * @param {QuestionFormProps} props - 컴포넌트 props
 * @returns {JSX.Element} 질문 폼
 */
export const QuestionForm: React.FC<QuestionFormProps> = ({ 
  questions, 
  stepId, 
  guideBox,
  theme = 'emerald',
}) => {
  const { updateStepData, getStepData } = useWizardStore();
  const stepData = getStepData(stepId);

  // 자동 저장: 데이터 변경 후 1초(1000ms) 대기 후 저장
  useAutoSave(stepData, 1000);

  /**
   * 질문 답변 변경 핸들러
   * 
   * @param {string} questionId - 질문 ID
   * @param {any} value - 입력된 값
   */
  const handleChange = (questionId: string, value: any) => {
    updateStepData(stepId, questionId, value);
  };

  /**
   * 개별 질문 렌더링
   */
  const renderQuestion = (question: Question | ExtendedQuestion) => {
    const value = stepData[question.id] || '';
    const isExtended = isExtendedQuestion(question);

    // 공통 래퍼 컴포넌트
    const QuestionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <div key={question.id} className="space-y-1">
        {children}
        {/* 확장된 질문인 경우 인라인 가이드 표시 */}
        {isExtended && (question as ExtendedQuestion).guide && (
          <InlineGuide 
            text={(question as ExtendedQuestion).guide!} 
            theme={theme}
          />
        )}
        {/* 주의사항이 있는 경우 */}
        {isExtended && (question as ExtendedQuestion).warnings && (
          <div className="mt-2">
            {(question as ExtendedQuestion).warnings!.map((warning, idx) => (
              <p key={idx} className="text-xs text-amber-400/70 flex items-start gap-1">
                <span>⚠️</span>
                <span>{warning}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    );

    switch (question.type) {
      case 'text':
        return (
          <QuestionWrapper key={question.id}>
            <Input
              label={question.label}
              placeholder={question.placeholder}
              value={value}
              onChange={(e) => handleChange(question.id, e.target.value)}
              required={question.required}
              helperText={question.description}
            />
          </QuestionWrapper>
        );

      case 'textarea':
        return (
          <QuestionWrapper key={question.id}>
            <Textarea
              label={question.label}
              placeholder={question.placeholder}
              value={value}
              onChange={(e) => handleChange(question.id, e.target.value)}
              required={question.required}
              helperText={question.description}
              rows={6}
            />
          </QuestionWrapper>
        );

      case 'number':
        return (
          <QuestionWrapper key={question.id}>
            <Input
              type="number"
              label={question.label}
              placeholder={question.placeholder}
              value={value}
              onChange={(e) => handleChange(question.id, parseFloat(e.target.value) || 0)}
              required={question.required}
              helperText={question.description}
            />
          </QuestionWrapper>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 단계별 가이드 박스 (상단) */}
      {guideBox && (
        <GuideBox
          title={guideBox.title}
          tips={guideBox.tips}
          examples={guideBox.examples}
          warnings={guideBox.warnings}
          theme={theme}
          collapsible
          defaultExpanded={true}
        />
      )}

      {/* 질문 목록 */}
      {questions.map((question) => renderQuestion(question))}
    </div>
  );
};

