/**
 * 파일명: GlassCard.tsx
 * 
 * 파일 용도:
 * 재사용 가능한 Glass morphism 카드 컴포넌트
 * - 일관된 glass-card 스타일 제공
 * - 다양한 패딩 옵션
 * - 호버 효과 지원
 * 
 * 사용 예시:
 * <GlassCard padding="md" className="hover-lift">
 *   카드 내용
 * </GlassCard>
 */

import React from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps {
  /** 카드 내용 */
  children: React.ReactNode;
  /** 추가 클래스명 */
  className?: string;
  /** 패딩 크기 */
  padding?: 'sm' | 'md' | 'lg';
  /** 호버 효과 활성화 */
  hover?: boolean;
}

/**
 * GlassCard 컴포넌트
 * 
 * 역할:
 * - 애플리케이션 전체에서 일관된 glass-card UI 제공
 * - 다양한 패딩 옵션으로 유연한 사용
 * - 호버 효과 옵션 제공
 * 
 * @param {GlassCardProps} props - 카드 속성
 * @returns {JSX.Element} Glass 카드 엘리먼트
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  padding = 'md',
  hover = false,
}) => {
  const paddingClass = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }[padding];

  return (
    <div
      className={cn(
        'glass-card rounded-2xl border border-white/10',
        paddingClass,
        hover && 'hover-lift',
        className
      )}
    >
      {children}
    </div>
  );
};

