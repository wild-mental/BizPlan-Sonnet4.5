/**
 * 파일명: QuestionForm.tsx
 * 
 * 파일 용도:
 * 마법사 단계별 질문 폼 렌더링 컴포넌트
 * - 질문 타입에 따라 적절한 입력 필드 생성
 * - 사용자 입력을 Store에 저장
 * - 자동 저장 기능
 * 
 * 호출 구조:
 * QuestionForm (이 컴포넌트)
 *   ├─> useWizardStore - 마법사 데이터 관리
 *   │   ├─> updateStepData(stepId, questionId, value) - 답변 저장
 *   │   └─> getStepData(stepId) - 현재 단계 데이터 조회
 *   │
 *   ├─> useAutoSave(stepData, 1000) - 1초마다 자동 저장
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

import React, { useEffect } from 'react';
import { useWizardStore } from '../../stores/useWizardStore';
import { useAutoSave } from '../../hooks/useAutoSave';
import { Question } from '../../types';
import { Input, Textarea } from '../ui';

interface QuestionFormProps {
  /** 렌더링할 질문 목록 */
  questions: Question[];
  /** 현재 마법사 단계 ID */
  stepId: number;
}

/**
 * QuestionForm 컴포넌트
 * 
 * 역할:
 * - 마법사 단계별 질문 폼 렌더링
 * - 질문 타입별 적절한 입력 필드 제공 (text, textarea, number)
 * - 사용자 입력 데이터 관리 및 자동 저장
 * 
 * 주요 기능:
 * 1. 질문 타입에 따른 동적 폼 렌더링
 * 2. 실시간 데이터 Store 업데이트
 * 3. 1초 디바운스 자동 저장
 * 4. 필수/선택 필드 구분
 * 
 * @param {QuestionFormProps} props - 컴포넌트 props
 * @returns {JSX.Element} 질문 폼
 */
export const QuestionForm: React.FC<QuestionFormProps> = ({ questions, stepId }) => {
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

  return (
    <div className="space-y-6">
      {questions.map((question) => {
        const value = stepData[question.id] || '';

        switch (question.type) {
          case 'text':
            return (
              <Input
                key={question.id}
                label={question.label}
                placeholder={question.placeholder}
                value={value}
                onChange={(e) => handleChange(question.id, e.target.value)}
                required={question.required}
                helperText={question.description}
              />
            );

          case 'textarea':
            return (
              <Textarea
                key={question.id}
                label={question.label}
                placeholder={question.placeholder}
                value={value}
                onChange={(e) => handleChange(question.id, e.target.value)}
                required={question.required}
                helperText={question.description}
                rows={6}
              />
            );

          case 'number':
            return (
              <Input
                key={question.id}
                type="number"
                label={question.label}
                placeholder={question.placeholder}
                value={value}
                onChange={(e) => handleChange(question.id, parseFloat(e.target.value) || 0)}
                required={question.required}
                helperText={question.description}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

