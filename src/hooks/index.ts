/**
 * 파일명: index.ts
 * 
 * 파일 용도:
 * Hooks 모듈의 진입점 (Barrel Export)
 * - 모든 custom hooks를 중앙에서 export
 * - import 경로 단순화
 * 
 * 사용 예시:
 * import { useAutoSave, useFinancialCalc } from '../hooks';
 * 
 * 대신:
 * import { useAutoSave } from '../hooks/useAutoSave';
 * import { useFinancialCalc } from '../hooks/useFinancialCalc';
 */

export { useAutoSave } from './useAutoSave';
export { useFinancialCalc } from './useFinancialCalc';
export { useCountdown, formatTimeUnit, formatCountdown } from './useCountdown';
export type { CountdownResult } from './useCountdown';

