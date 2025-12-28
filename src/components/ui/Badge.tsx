/**
 * 파일명: Badge.tsx
 * 
 * 파일 용도:
 * 재사용 가능한 배지(Badge) 컴포넌트
 * - 상태, 태그, 레이블 등을 표시하는 작은 UI 요소
 * - 5가지 variant 제공 (default, success, warning, danger, info)
 * - 작고 둥근 알약 형태
 * 
 * 사용 예시:
 * <Badge variant="success">완료</Badge>
 * <Badge variant="danger">긴급</Badge>
 * <Badge variant="info">새로운</Badge>
 */

import React, { memo } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  /** 배지 내용 */
  children: React.ReactNode;
  /** 배지 스타일 변형 */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * Badge 컴포넌트
 * 
 * 역할:
 * - 상태, 카테고리, 태그 등을 시각적으로 표시
 * - 색상으로 의미 전달 (성공=초록, 경고=노랑, 위험=빨강 등)
 * 
 * @param {BadgeProps} props - 배지 속성
 * @returns {JSX.Element} 배지 엘리먼트
 */
export const Badge: React.FC<BadgeProps> = memo(({ 
  children, 
  variant = 'default',
  className 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

