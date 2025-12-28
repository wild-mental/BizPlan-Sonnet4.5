/**
 * 파일명: index.ts
 * 
 * 파일 용도:
 * wizard 컴포넌트 모듈 내보내기
 * - 마법사 관련 모든 컴포넌트 중앙 관리
 * - 깔끔한 import 경로 제공
 */

// 기본 폼 컴포넌트
export { QuestionForm } from './QuestionForm';
export { FinancialSimulation } from './FinancialSimulation';

// 가이드 컴포넌트
export { 
  GuideBox, 
  InlineGuide, 
  TemplateComparisonGuide 
} from './GuideBox';

// 자금 계획 계산기
export { PreStartupBudgetCalculator } from './PreStartupBudgetCalculator';
export { EarlyStartupBudgetCalculator } from './EarlyStartupBudgetCalculator';

// 개인정보 마스킹
export { 
  MaskingPreview, 
  InlineMaskingBadge, 
  MaskingPreviewModal 
} from './MaskingPreview';

