/**
 * 파일명: useAutoSave.ts
 * 
 * 파일 용도:
 * 자동 저장 기능을 제공하는 Custom Hook
 * - 데이터 변경 감지 및 자동 저장
 * - Debounce를 통한 저장 요청 최적화
 * - 저장 상태 피드백 제공
 * 
 * 호출 구조:
 * useAutoSave (이 Hook)
 *   ├─> useProjectStore.setSaveStatus() - 저장 상태 업데이트
 *   │   └─> SaveIndicator 컴포넌트에서 표시
 *   │
 *   └─> debounce() - utils 함수
 * 
 * 사용하는 컴포넌트:
 * - QuestionForm: 질문 답변 자동 저장
 * 
 * 동작 과정:
 * 1. data 변경 감지 (useEffect)
 * 2. 변경되지 않았으면 스킵
 * 3. 변경되었으면 'saving' 상태 설정
 * 4. delay(기본 1초) 후 저장 시뮬레이션
 * 5. 'saved' 상태 설정
 * 6. 2초 후 'idle' 상태로 복귀
 * 
 * 최적화:
 * - Debounce로 연속 입력 시 불필요한 저장 요청 방지
 * - 이전 데이터와 비교하여 실제 변경 시만 저장
 */

import { useEffect, useRef } from 'react';
import { useProjectStore } from '../stores/useProjectStore';
import { debounce } from '../lib/utils';
import { TIMING } from '../constants';

/**
 * useAutoSave Hook
 * 
 * 역할:
 * - 데이터 변경 시 자동으로 저장
 * - 사용자에게 저장 상태 피드백
 * - 불필요한 저장 요청 방지
 * 
 * 주요 기능:
 * 1. 데이터 변경 감지 (깊은 비교)
 * 2. Debounce를 통한 저장 최적화
 * 3. 저장 상태 관리 (saving → saved → idle)
 * 
 * @param {any} data - 저장할 데이터
 * @param {number} delay - Debounce 지연 시간 (기본 1000ms)
 */
export const useAutoSave = (data: any, delay: number = TIMING.AUTO_SAVE_DEBOUNCE) => {
  const { setSaveStatus } = useProjectStore();
  const previousDataRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // 현재 데이터를 JSON 문자열로 변환하여 비교
    const currentData = JSON.stringify(data);

    // 데이터가 변경되지 않았으면 저장하지 않음
    if (previousDataRef.current === currentData) {
      return;
    }

    // 이전 데이터 업데이트
    previousDataRef.current = currentData;

    // 저장 중 상태로 변경
    setSaveStatus('saving');

    // Debounce를 적용한 저장 시뮬레이션
    const debouncedSave = debounce<() => void>(() => {
      // 저장 시뮬레이션 (실제로는 API 호출)
      setTimeout(() => {
        setSaveStatus('saved');

        // 저장 완료 후 idle 상태로 복귀
        setTimeout(() => {
          setSaveStatus('idle');
        }, TIMING.SAVE_STATUS_IDLE_DELAY);
      }, TIMING.SAVE_SIMULATION_DELAY);
    }, delay);

    debouncedSave();
  }, [data, delay, setSaveStatus]);
};

