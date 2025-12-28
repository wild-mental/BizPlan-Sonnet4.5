/**
 * M.A.K.E.R.S AI 평가 시뮬레이션 로직
 * 프론트엔드에서 데모용으로 사용하는 점수 산출 알고리즘
 */

import type { BusinessPlanInput, EvaluationResult, EvaluationArea, Feedback } from '../types/evaluation';
import { EVALUATION_AREAS } from '../types/evaluation';

/** 텍스트 완성도 기반 점수 계산 (0-100) */
const calculateTextScore = (text: string): number => {
  if (!text || text.trim().length === 0) return 30; // 미입력 시 기본 점수
  
  const length = text.trim().length;
  const baseScore = 50;
  
  // 글자 수 기반 가산점 (최대 30점)
  const lengthBonus = Math.min(length / 10, 30);
  
  // 숫자 포함 시 가산점 (구체성)
  const hasNumbers = /\d/.test(text) ? 10 : 0;
  
  // 전문 용어 포함 시 가산점
  const professionalTerms = ['TAM', 'SAM', 'SOM', 'BEP', 'ROI', 'MVP', 'PMF', 'ESG', 'KPI', 'OKR'];
  const hasTerms = professionalTerms.some(term => text.toUpperCase().includes(term)) ? 10 : 0;
  
  return Math.min(Math.round(baseScore + lengthBonus + hasNumbers + hasTerms), 100);
};

/** 시장성(M) 점수 계산 */
const calculateMarketabilityScore = (input: BusinessPlanInput['marketability']): number => {
  const score1 = calculateTextScore(input.targetCustomer);
  const score2 = calculateTextScore(input.marketSize);
  return Math.round((score1 + score2) / 2);
};

/** 수행능력(A) 점수 계산 */
const calculateAbilityScore = (input: BusinessPlanInput['ability']): number => {
  const score1 = calculateTextScore(input.teamComposition);
  const score2 = calculateTextScore(input.coreCompetency);
  return Math.round((score1 + score2) / 2);
};

/** 핵심기술(K) 점수 계산 */
const calculateKeyTechScore = (input: BusinessPlanInput['keyTechnology']): number => {
  const score1 = calculateTextScore(input.techDifferentiation);
  const score2 = calculateTextScore(input.intellectualProperty);
  return Math.round((score1 + score2) / 2);
};

/** 경제성(E) 점수 계산 */
const calculateEconomicsScore = (input: BusinessPlanInput['economics']): number => {
  const score1 = calculateTextScore(input.revenueProjection);
  const score2 = calculateTextScore(input.breakEvenPoint);
  return Math.round((score1 + score2) / 2);
};

/** 실현가능성(R) 점수 계산 */
const calculateRealizationScore = (input: BusinessPlanInput['realization']): number => {
  const score1 = calculateTextScore(input.milestones);
  const score2 = calculateTextScore(input.riskManagement);
  return Math.round((score1 + score2) / 2);
};

/** 사회적가치(S) 점수 계산 */
const calculateSocialValueScore = (input: BusinessPlanInput['socialValue']): number => {
  const score1 = calculateTextScore(input.jobCreation);
  const score2 = calculateTextScore(input.socialContribution);
  return Math.round((score1 + score2) / 2);
};

/** 합격 확률 계산 */
const calculatePassRate = (totalScore: number, scores: Record<EvaluationArea, number>): number => {
  // 기본 합격 확률 (총점 기반)
  let baseRate = totalScore * 0.8;
  
  // 최저 점수가 낮으면 감점
  const minScore = Math.min(...Object.values(scores));
  if (minScore < 50) {
    baseRate -= (50 - minScore) * 0.5;
  }
  
  // 모든 영역 60점 이상이면 가산점
  const allAbove60 = Object.values(scores).every(s => s >= 60);
  if (allAbove60) {
    baseRate += 10;
  }
  
  return Math.min(Math.max(Math.round(baseRate), 10), 95);
};

/** 강점 피드백 생성 */
const generateStrengths = (scores: Record<EvaluationArea, number>): Feedback[] => {
  const sortedAreas = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  
  const strengthMessages: Record<EvaluationArea, { title: string; description: string }> = {
    M: { title: '시장 분석 우수', description: 'TAM/SAM/SOM 분석이 체계적이고 타깃 고객 정의가 명확합니다.' },
    A: { title: '팀 역량 충분', description: '팀 구성이 적절하고 핵심 역량이 사업에 부합합니다.' },
    K: { title: '기술 차별화 명확', description: '핵심 기술의 혁신성과 차별화 포인트가 뚜렷합니다.' },
    E: { title: '재무 계획 구체적', description: '매출 추정이 현실적이고 수익 모델이 명확합니다.' },
    R: { title: '실행 계획 체계적', description: '마일스톤이 구체적이고 리스크 대응 방안이 있습니다.' },
    S: { title: '사회적 가치 높음', description: 'ESG 기여도가 높고 일자리 창출 계획이 구체적입니다.' },
  };
  
  return sortedAreas.map(([area, score], index) => ({
    area: area as EvaluationArea,
    title: `${EVALUATION_AREAS.find(a => a.code === area)?.korean}: ${strengthMessages[area as EvaluationArea].title}`,
    description: strengthMessages[area as EvaluationArea].description,
    isBlurred: index >= 2, // 무료: 2개만 표시
  }));
};

/** 약점 피드백 생성 */
const generateWeaknesses = (scores: Record<EvaluationArea, number>): Feedback[] => {
  const sortedAreas = Object.entries(scores)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3);
  
  const weaknessMessages: Record<EvaluationArea, { title: string; description: string }> = {
    M: { title: '시장 분석 보완 필요', description: '타깃 고객 정의나 시장 규모 추정이 더 구체적이어야 합니다.' },
    A: { title: '팀 역량 보강 필요', description: '핵심 인력 확보나 역할 분담이 더 명확해야 합니다.' },
    K: { title: '기술 차별화 부족', description: '경쟁사 대비 기술 우위를 더 명확히 제시해야 합니다.' },
    E: { title: '재무 계획 미흡', description: '매출 추정 근거나 손익분기점 분석이 필요합니다.' },
    R: { title: '실행 계획 불명확', description: '마일스톤이 불명확하고 리스크 대응 계획이 부족합니다.' },
    S: { title: '사회적 가치 미제시', description: '일자리 창출이나 사회 기여 방안이 더 구체적이어야 합니다.' },
  };
  
  return sortedAreas.map(([area, score], index) => ({
    area: area as EvaluationArea,
    title: `${EVALUATION_AREAS.find(a => a.code === area)?.korean}: ${weaknessMessages[area as EvaluationArea].title}`,
    description: weaknessMessages[area as EvaluationArea].description,
    isBlurred: index >= 1, // 무료: 1개만 표시
  }));
};

/** 개선 권장사항 생성 */
const generateRecommendations = (scores: Record<EvaluationArea, number>): string[] => {
  const recommendations: string[] = [];
  
  const lowestAreas = Object.entries(scores)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 2);
  
  const recommendationMap: Record<EvaluationArea, string> = {
    M: '시장 규모를 수치로 제시하고 TAM/SAM/SOM을 명확히 구분하세요.',
    A: '팀원별 역할과 관련 경력을 구체적으로 기술하세요.',
    K: '특허 출원 계획이나 기술 로드맵을 추가하세요.',
    E: '월별 매출 추정과 비용 구조를 상세히 작성하세요.',
    R: '분기별 마일스톤과 성과 지표(KPI)를 설정하세요.',
    S: '고용 계획과 ESG 활동을 구체적으로 제시하세요.',
  };
  
  lowestAreas.forEach(([area]) => {
    recommendations.push(recommendationMap[area as EvaluationArea]);
  });
  
  recommendations.push('플러스 요금제에서 더 상세한 개선 피드백을 받아보세요.');
  
  return recommendations;
};

/** 평가 시뮬레이션 실행 */
export const simulateEvaluation = async (
  input: BusinessPlanInput
): Promise<EvaluationResult> => {
  // 각 영역별 점수 계산
  const scores: Record<EvaluationArea, number> = {
    M: calculateMarketabilityScore(input.marketability),
    A: calculateAbilityScore(input.ability),
    K: calculateKeyTechScore(input.keyTechnology),
    E: calculateEconomicsScore(input.economics),
    R: calculateRealizationScore(input.realization),
    S: calculateSocialValueScore(input.socialValue),
  };
  
  // 총점 계산
  const totalScore = Math.round(
    Object.values(scores).reduce((sum, score) => sum + score, 0) / 6
  );
  
  // 합격 확률 계산
  const passRate = calculatePassRate(totalScore, scores);
  
  return {
    totalScore,
    passRate,
    scores,
    strengths: generateStrengths(scores),
    weaknesses: generateWeaknesses(scores),
    recommendations: generateRecommendations(scores),
    generatedAt: new Date(),
  };
};

/** 샘플 입력 데이터 */
export const SAMPLE_INPUT: BusinessPlanInput = {
  marketability: {
    targetCustomer: '20-30대 1인 창업자 및 초기 스타트업 대표, 예비창업패키지/초기창업패키지 지원 예정자',
    marketSize: '국내 창업지원 시장 연간 5조원 규모, TAM 5000억, SAM 500억, SOM 50억 목표',
  },
  ability: {
    teamComposition: 'CEO(사업개발 10년), CTO(AI 개발 8년), CMO(마케팅 5년) 총 3명',
    coreCompetency: 'AI/ML 기술력, 정부지원사업 심사 경험, B2B SaaS 운영 경험',
  },
  keyTechnology: {
    techDifferentiation: 'LLM 기반 사업계획서 자동 작성, M.A.K.E.R.S 6대 영역 멀티에이전트 평가 시스템',
    intellectualProperty: 'AI 사업계획서 생성 알고리즘 특허 출원 중, 상표등록 완료',
  },
  economics: {
    revenueProjection: '1년차 5억, 2년차 15억, 3년차 30억 목표. 구독 모델 기반 월 정액제',
    breakEvenPoint: '2년차 상반기 BEP 달성 예상, 월 구독자 5000명 목표',
  },
  realization: {
    milestones: 'Q1: MVP 출시, Q2: 베타 테스트, Q3: 정식 런칭, Q4: 해외 진출 준비',
    riskManagement: '기술 리스크: 외부 AI 모델 의존도 낮춤. 시장 리스크: 다각화 전략',
  },
  socialValue: {
    jobCreation: '1년차 5명, 2년차 15명, 3년차 30명 신규 고용 계획',
    socialContribution: '창업 실패율 감소 기여, 청년 창업 지원, 지역 일자리 창출',
  },
};

