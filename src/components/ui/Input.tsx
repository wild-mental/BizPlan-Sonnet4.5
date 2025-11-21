/**
 * 파일명: Input.tsx
 * 
 * 파일 용도:
 * 재사용 가능한 입력 필드 컴포넌트
 * - 레이블, 에러 메시지, 도움말 텍스트 지원
 * - forwardRef로 ref 전달 가능
 * - 필수 필드 표시 (*)
 * - 표준 HTML input 속성 모두 지원
 * 
 * 사용 예시:
 * <Input
 *   label="이메일"
 *   type="email"
 *   placeholder="example@email.com"
 *   required
 *   helperText="이메일 형식으로 입력해주세요"
 *   error={errors.email}
 * />
 */

import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 입력 필드 레이블 */
  label?: string;
  /** 에러 메시지 (표시 시 빨간색 스타일 적용) */
  error?: string;
  /** 도움말 텍스트 */
  helperText?: string;
}

/**
 * Input 컴포넌트
 * 
 * 역할:
 * - 폼 입력 필드 UI 제공
 * - 에러 상태 시각화
 * - 접근성 지원 (레이블, 필수 필드 표시)
 * 
 * @param {InputProps} props - 입력 필드 속성
 * @param {React.Ref<HTMLInputElement>} ref - input element ref
 * @returns {JSX.Element} 입력 필드
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 border rounded-lg shadow-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
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

Input.displayName = 'Input';

