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

import React, { memo, useCallback } from 'react';
import { useWizardStore } from '../../stores/useWizardStore';
import { useProjectStore } from '../../stores/useProjectStore';
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

// ============================================
// QuestionWrapper 컴포넌트 (모듈 레벨 정의)
// ============================================

interface QuestionWrapperProps {
  /** 질문 ID (key용) */
  questionId: string;
  /** 확장된 질문 여부 */
  isExtended: boolean;
  /** 인라인 가이드 텍스트 */
  guide?: string;
  /** 주의사항 목록 */
  warnings?: string[];
  /** 테마 색상 */
  theme: 'emerald' | 'blue' | 'amber' | 'purple';
  /** 자식 요소 (Input, Textarea 등) */
  children: React.ReactNode;
}

/**
 * QuestionWrapper - 질문 입력 필드 래퍼 컴포넌트
 * 
 * 역할:
 * - 입력 필드와 가이드/경고를 함께 감싸는 컨테이너
 * - 모듈 레벨에 정의하여 렌더링 간 컴포넌트 참조 유지
 * - 이를 통해 리렌더링 시에도 Input 포커스 유지
 */
const QuestionWrapper: React.FC<QuestionWrapperProps> = ({
  questionId,
  isExtended,
  guide,
  warnings,
  theme,
  children,
}) => (
  <div key={questionId} className="space-y-1">
    {children}
    {/* 확장된 질문인 경우 인라인 가이드 표시 */}
    {isExtended && guide && (
      <InlineGuide text={guide} theme={theme} />
    )}
    {/* 주의사항이 있는 경우 */}
    {isExtended && warnings && warnings.length > 0 && (
      <div className="mt-2">
        {warnings.map((warning, idx) => (
          <p key={idx} className="text-xs text-amber-700 flex items-start gap-1">
            <span>⚠️</span>
            <span>{warning}</span>
          </p>
        ))}
      </div>
    )}
  </div>
);

// ============================================
// QuestionForm 메인 컴포넌트
// ============================================

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
export const QuestionForm: React.FC<QuestionFormProps> = memo(({ 
  questions, 
  stepId, 
  guideBox,
  theme = 'emerald',
}) => {
  const { updateStepData, getStepData } = useWizardStore();
  const { updateProject } = useProjectStore();
  const stepData = getStepData(stepId);

  // 자동 저장: 데이터 변경 후 1초(1000ms) 대기 후 저장
  useAutoSave(stepData, 1000);

  /**
   * 질문 답변 변경 핸들러
   * 
   * @param {string} questionId - 질문 ID
   * @param {any} value - 입력된 값
   */
  const handleChange = useCallback((questionId: string, value: any) => {
    updateStepData(stepId, questionId, value);
  }, [stepId, updateStepData]);

  /**
   * 포커스 해제 핸들러
   * - item-name 필드에서 포커스가 해제될 때 프로젝트명 업데이트
   * - 매 키 입력마다 업데이트하면 리렌더링으로 포커스가 해제되는 문제 방지
   * 
   * @param {string} questionId - 질문 ID
   * @param {string} value - 현재 값
   */
  const handleBlur = useCallback((questionId: string, value: string) => {
    // 아이템명 입력 완료 시 프로젝트명 자동 업데이트
    if (questionId === 'item-name') {
      updateProject({ name: value });
    }
  }, [updateProject]);

  /**
   * 개별 질문 렌더링
   */
  const renderQuestion = (question: Question | ExtendedQuestion) => {
    const value = stepData[question.id] || '';
    const isExtended = isExtendedQuestion(question);
    const extendedQ = isExtended ? (question as ExtendedQuestion) : null;

    // 공통 래퍼 props
    const wrapperProps = {
      questionId: question.id,
      isExtended,
      guide: extendedQ?.guide,
      warnings: extendedQ?.warnings,
      theme,
    };

    switch (question.type) {
      case 'text':
        return (
          <QuestionWrapper key={question.id} {...wrapperProps}>
            <Input
              label={question.label}
              placeholder={question.placeholder}
              value={value}
              onChange={(e) => handleChange(question.id, e.target.value)}
              onBlur={(e) => handleBlur(question.id, e.target.value)}
              required={question.required}
              helperText={question.description}
            />
          </QuestionWrapper>
        );

      case 'textarea':
        return (
          <QuestionWrapper key={question.id} {...wrapperProps}>
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
          <QuestionWrapper key={question.id} {...wrapperProps}>
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
});

QuestionForm.displayName = 'QuestionForm';

