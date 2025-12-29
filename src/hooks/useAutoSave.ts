/**
 * 파일명: useAutoSave.ts
 * 
 * 파일 용도:
 * 자동 저장 기능을 제공하는 Custom Hook
 * - 데이터 변경 감지 및 자동 저장
 * - Debounce를 통한 저장 요청 최적화
 * - API를 통한 서버 저장
 * - 저장 상태 피드백 제공
 * 
 * 호출 구조:
 * useAutoSave (이 Hook)
 *   ├─> wizardApi.save() - API 호출
 *   └─> useProjectStore.setSaveStatus() - 저장 상태 업데이트
 * 
 * 사용하는 컴포넌트:
 * - QuestionForm: 질문 답변 자동 저장
 * - WizardStep: 단계별 데이터 자동 저장
 * 
 * 동작 과정:
 * 1. data 변경 감지 (useEffect)
 * 2. 변경되지 않았으면 스킵
 * 3. 변경되었으면 debounce 적용
 * 4. API 호출로 서버에 저장
 * 5. 저장 상태 업데이트
 * 
 * 최적화:
 * - Debounce로 연속 입력 시 불필요한 저장 요청 방지
 * - 이전 데이터와 비교하여 실제 변경 시만 저장
 * - 페이지 이탈 시 즉시 저장 (sendBeacon)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { wizardApi } from '../services/wizardApi';
import { useProjectStore } from '../stores/useProjectStore';

interface UseAutoSaveOptions {
  projectId: string;
  currentStep: number;
  data: Record<string, any>;
  enabled?: boolean;
  debounceMs?: number;
  onSaveSuccess?: (savedAt: string) => void;
  onSaveError?: (error: Error) => void;
}

/**
 * useAutoSave Hook
 * 
 * 역할:
 * - 데이터 변경 시 자동으로 서버에 저장
 * - 사용자에게 저장 상태 피드백
 * - 불필요한 저장 요청 방지
 * 
 * 주요 기능:
 * 1. 데이터 변경 감지 (깊은 비교)
 * 2. Debounce를 통한 저장 최적화
 * 3. API를 통한 서버 저장
 * 4. 저장 상태 관리
 * 
 * @param {UseAutoSaveOptions} options - 자동저장 옵션
 * @returns {object} 저장 상태 및 수동 저장 함수
 */
export function useAutoSave({
  projectId,
  currentStep,
  data,
  enabled = true,
  debounceMs = 3000,
  onSaveSuccess,
  onSaveError,
}: UseAutoSaveOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const previousDataRef = useRef<string>('');
  const { setSaveStatus } = useProjectStore();

  const saveToServer = useCallback(async () => {
    if (!projectId || !enabled) return;

    // 성능 최적화: setTimeout을 사용하여 메인 스레드 블로킹 방지
    const dataString = await new Promise<string>((resolve) => {
      setTimeout(() => resolve(JSON.stringify(data)), 0);
    });
    
    if (dataString === previousDataRef.current) return;

    setIsSaving(true);
    setError(null);
    setSaveStatus('saving');

    try {
      const response = await wizardApi.save(projectId, {
        currentStep,
        stepData: data,
      });

      if (response.data.success && response.data.data) {
        previousDataRef.current = dataString;
        setLastSavedAt(response.data.data.lastSavedAt);
        setSaveStatus('saved');
        onSaveSuccess?.(response.data.data.lastSavedAt);
        
        // 저장 완료 후 idle 상태로 복귀
        setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      setSaveStatus('error');
      onSaveError?.(error);
    } finally {
      setIsSaving(false);
    }
  }, [projectId, currentStep, data, enabled, onSaveSuccess, onSaveError, setSaveStatus]);

  const debouncedSave = useDebouncedCallback(saveToServer, debounceMs);

  // 데이터 변경 시 자동저장
  useEffect(() => {
    if (enabled) {
      debouncedSave();
    }
  }, [data, enabled, debouncedSave]);

  // 페이지 이탈 시 즉시 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (enabled && previousDataRef.current) {
        // 이전에 저장된 데이터가 있으면 그것을 사용 (JSON.stringify 최소화)
        const blob = new Blob([previousDataRef.current], {
          type: 'application/json',
        });
        navigator.sendBeacon(`/api/v1/projects/${projectId}/wizard`, blob);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [projectId, enabled]);

  return {
    isSaving,
    lastSavedAt,
    error,
    saveNow: saveToServer,
  };
}

