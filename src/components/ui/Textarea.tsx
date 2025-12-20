/**
 * 파일명: Textarea.tsx
 * 
 * 파일 용도:
 * 재사용 가능한 여러 줄 텍스트 입력 컴포넌트
 * - 레이블, 에러 메시지, 도움말 텍스트 지원
 * - forwardRef로 ref 전달 가능
 * - 세로 크기 조절 가능 (resize-y)
 * - 표준 HTML textarea 속성 모두 지원
 * 
 * 사용 예시:
 * <Textarea
 *   label="사업 개요"
 *   placeholder="사업에 대해 설명해주세요"
 *   rows={6}
 *   required
 *   helperText="최소 100자 이상 입력해주세요"
 * />
 */

import React from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 텍스트 영역 레이블 */
  label?: string;
  /** 에러 메시지 */
  error?: string;
  /** 도움말 텍스트 */
  helperText?: string;
}

/**
 * Textarea 컴포넌트
 * 
 * 역할:
 * - 긴 텍스트 입력을 위한 UI 제공
 * - Input 컴포넌트와 일관된 스타일
 * - 에러 상태 시각화
 * 
 * @param {TextareaProps} props - 텍스트 영역 속성
 * @param {React.Ref<HTMLTextAreaElement>} ref - textarea element ref
 * @returns {JSX.Element} 텍스트 영역
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          rows={4}
          className={cn(
            'w-full px-3 py-2 border rounded-lg shadow-sm transition-colors resize-y',
            'text-gray-900 placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300',
            'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

