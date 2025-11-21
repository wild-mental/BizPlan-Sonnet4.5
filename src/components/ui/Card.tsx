/**
 * 파일명: Card.tsx
 * 
 * 파일 용도:
 * 재사용 가능한 카드 컴포넌트 및 관련 하위 컴포넌트
 * - Compound Component 패턴으로 구성
 * - 카드 구조: Card > CardHeader > CardTitle/CardDescription + CardContent + CardFooter
 * - 호버 효과 및 클릭 이벤트 지원
 * 
 * 컴포넌트 목록:
 * - Card: 메인 컨테이너
 * - CardHeader: 헤더 영역 (상단 구분선)
 * - CardTitle: 제목
 * - CardDescription: 설명
 * - CardContent: 본문
 * - CardFooter: 푸터 영역 (하단 구분선)
 * 
 * 사용 예시:
 * <Card hover onClick={handleClick}>
 *   <CardHeader>
 *     <CardTitle>제목</CardTitle>
 *     <CardDescription>설명</CardDescription>
 *   </CardHeader>
 *   <CardContent>내용</CardContent>
 *   <CardFooter>액션 버튼</CardFooter>
 * </Card>
 */

import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  /** 카드 내용 */
  children: React.ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  /** 호버 시 그림자 효과 활성화 */
  hover?: boolean;
}

/**
 * Card 컴포넌트 (메인 컨테이너)
 * 
 * 역할:
 * - 콘텐츠를 카드 형태로 감싸는 컨테이너
 * - 선택적으로 클릭 및 호버 효과 제공
 * 
 * @param {CardProps} props - 카드 속성
 * @returns {JSX.Element} 카드 컨테이너
 */
export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  onClick,
  hover = false 
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        hover && 'hover:shadow-md transition-shadow cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardHeader 컴포넌트
 * - 카드의 헤더 영역 (하단 구분선 포함)
 */
export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200', className)}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardTitle 컴포넌트
 * - 카드의 제목 텍스트
 */
export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardDescription 컴포넌트
 * - 카드의 설명 텍스트 (제목 하단)
 */
export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => {
  return (
    <p className={cn('mt-1 text-sm text-gray-500', className)}>
      {children}
    </p>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardContent 컴포넌트
 * - 카드의 본문 영역
 */
export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardFooter 컴포넌트
 * - 카드의 푸터 영역 (상단 구분선, 회색 배경)
 */
export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-200 bg-gray-50', className)}>
      {children}
    </div>
  );
};

