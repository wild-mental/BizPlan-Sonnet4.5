/**
 * 파일명: SaveIndicator.tsx
 * 
 * 파일 용도:
 * 자동 저장 상태 표시 컴포넌트
 * - 저장 중, 저장 완료, 저장 실패 상태를 시각적으로 표시
 * - 헤더에 위치하여 사용자에게 저장 상태를 실시간 피드백
 * 
 * 호출 구조:
 * SaveIndicator (이 컴포넌트)
 *   └─> useProjectStore
 *       └─> saveStatus - 저장 상태 ('idle' | 'saving' | 'saved' | 'error')
 * 
 * 데이터 흐름:
 * useProjectStore.saveStatus → 상태에 따른 아이콘 및 텍스트 표시
 * 
 * 상태별 표시:
 * - idle: 표시 안 함
 * - saving: 구름 아이콘 + "저장 중..."
 * - saved: 체크 아이콘 + "저장됨"
 * - error: 경고 아이콘 + "저장 실패"
 */

import React from 'react';
import { useProjectStore } from '../stores/useProjectStore';
import { Check, Cloud, AlertCircle } from 'lucide-react';

interface SaveIndicatorProps {
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * SaveIndicator 컴포넌트
 * 
 * 역할:
 * - 자동 저장 상태를 시각적으로 표시
 * - 사용자에게 데이터 손실 방지를 위한 피드백 제공
 * 
 * 표시 조건:
 * - saveStatus가 'idle'이 아닐 때만 표시
 * 
 * 상태별 스타일:
 * - saving: 회색 (진행 중)
 * - saved: 초록색 (성공)
 * - error: 빨간색 (실패)
 * 
 * @returns {JSX.Element | null} 저장 상태 표시 UI (idle일 경우 null)
 */
export const SaveIndicator: React.FC<SaveIndicatorProps> = ({ className = '' }) => {
  const { saveStatus } = useProjectStore();

  // idle 상태일 때는 아무것도 표시하지 않음
  if (saveStatus === 'idle') return null;

  // 상태별 표시 정보 매핑
  const indicators = {
    saving: {
      icon: Cloud,
      text: '저장 중...',
      colorClass: 'text-gray-600',
    },
    saved: {
      icon: Check,
      text: '저장됨',
      colorClass: 'text-green-600',
    },
    error: {
      icon: AlertCircle,
      text: '저장 실패',
      colorClass: 'text-red-600',
    },
  };

  const indicator = indicators[saveStatus];
  const Icon = indicator.icon;

  return (
    <div className={`flex items-center gap-2 text-sm ${indicator.colorClass} ${className}`}>
      <Icon className="h-4 w-4" />
      <span>{indicator.text}</span>
    </div>
  );
};

