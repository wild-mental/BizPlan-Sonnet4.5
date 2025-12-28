/**
 * 파일명: Progress.tsx
 * 
 * 파일 용도:
 * 재사용 가능한 진행률 표시 컴포넌트
 * - 0-100% 진행률을 시각적으로 표시
 * - 선택적으로 퍼센트 레이블 표시
 * - 부드러운 애니메이션 효과
 * 
 * 사용 예시:
 * <Progress value={75} max={100} showLabel />
 * <Progress value={completedSteps} max={totalSteps} />
 */

import React, { memo } from 'react';
import { cn } from '../../lib/utils';
import { UI_CONSTANTS } from '../../constants';

interface ProgressProps {
  /** 현재 진행 값 */
  value: number;
  /** 최대 값 (기본값: 100) */
  max?: number;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 퍼센트 레이블 표시 여부 */
  showLabel?: boolean;
}

/**
 * Progress 컴포넌트
 * 
 * 역할:
 * - 작업 진행 상황을 시각적으로 표시
 * - 마법사 단계, 파일 업로드 등에 활용
 * 
 * 특징:
 * - 자동으로 0-100% 범위로 정규화
 * - 부드러운 transition 효과
 * 
 * @param {ProgressProps} props - 진행률 속성
 * @returns {JSX.Element} 진행률 바
 */
export const Progress: React.FC<ProgressProps> = memo(({ 
  value, 
  max = UI_CONSTANTS.PROGRESS_MAX, 
  className,
  showLabel = false 
}) => {
  // 퍼센트 계산 (0-100% 범위로 제한)
  const percentage = Math.min(Math.max((value / max) * UI_CONSTANTS.PROGRESS_MAX, UI_CONSTANTS.PROGRESS_MIN), UI_CONSTANTS.PROGRESS_MAX);

  return (
    <div className={cn('w-full', className)}>
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-primary-600 transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-gray-600 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
});

Progress.displayName = 'Progress';

