/**
 * 파일명: Spinner.tsx
 * 
 * 파일 용도:
 * 재사용 가능한 로딩 스피너 컴포넌트
 * - 로딩 중임을 나타내는 회전 애니메이션
 * - 3가지 크기 옵션 (sm, md, lg)
 * - SVG 기반으로 선명한 표시
 * 
 * 사용 예시:
 * <Spinner size="lg" />
 * <Spinner size="sm" className="text-white" />
 */

import React from 'react';
import { cn } from '../../lib/utils';

interface SpinnerProps {
  /** 스피너 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * Spinner 컴포넌트
 * 
 * 역할:
 * - 데이터 로딩, 처리 중 상태 표시
 * - 부드러운 회전 애니메이션
 * 
 * @param {SpinnerProps} props - 스피너 속성
 * @returns {JSX.Element} 로딩 스피너
 */
export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <svg
      className={cn('animate-spin text-primary-600', sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

