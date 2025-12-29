/**
 * 파일명: LoadingOverlay.tsx
 * 
 * 파일 용도:
 * 로딩 상태를 표시하는 오버레이 컴포넌트
 * - API 호출 중 사용자에게 피드백 제공
 * - 전체 화면 또는 특정 영역에 표시 가능
 */

import { Loader2 } from 'lucide-react';

interface Props {
  isLoading: boolean;
  message?: string;
  fullScreen?: boolean;
}

export function LoadingOverlay({ isLoading, message = '처리 중...', fullScreen = false }: Props) {
  if (!isLoading) return null;

  const baseClasses = 'flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50';
  const containerClasses = fullScreen
    ? `fixed inset-0 ${baseClasses}`
    : `absolute inset-0 ${baseClasses}`;

  return (
    <div className={containerClasses}>
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
      <p className="text-white/80 text-sm">{message}</p>
    </div>
  );
}

