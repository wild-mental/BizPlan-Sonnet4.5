import React from 'react';
import { useProjectStore } from '../stores/useProjectStore';
import { Check, Cloud, AlertCircle } from 'lucide-react';

export const SaveIndicator: React.FC = () => {
  const { saveStatus } = useProjectStore();

  if (saveStatus === 'idle') return null;

  const indicators = {
    saving: {
      icon: Cloud,
      text: '저장 중...',
      className: 'text-gray-600',
    },
    saved: {
      icon: Check,
      text: '저장됨',
      className: 'text-green-600',
    },
    error: {
      icon: AlertCircle,
      text: '저장 실패',
      className: 'text-red-600',
    },
  };

  const indicator = indicators[saveStatus];
  const Icon = indicator.icon;

  return (
    <div className={`flex items-center gap-2 text-sm ${indicator.className}`}>
      <Icon className="h-4 w-4" />
      <span>{indicator.text}</span>
    </div>
  );
};

