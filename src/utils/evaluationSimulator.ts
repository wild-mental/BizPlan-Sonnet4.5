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

/** 샘플 입력 데이터 - AI 기반 맞춤형 학습 플랫폼 LearnAI */
export const SAMPLE_INPUT: BusinessPlanInput = {
  marketability: {
    targetCustomer: '1차 타겟: 중학생 자녀를 둔 35-45세 학부모 (월 사교육비 30-50만원 지출). 국내 중학생 130만명, 학부모 가구 110만 가구. 2차 타겟: 고등학생 및 초등 고학년으로 확장 계획.',
    marketSize: 'TAM: 국내 사교육 시장 25조원, 글로벌 에듀테크 350조원. SAM: 국내 온라인 교육 5조원, AI 학습 플랫폼 1조원. SOM: 1년차 100억원(점유율 1%), 3년차 500억원(점유율 5%) 목표.',
  },
  ability: {
    teamComposition: 'CEO 김민수(38세): 에듀테크 12년 경력, 전 메가스터디 사업본부장, 서울대 경영학 석사. CTO 이정호(35세): AI/ML 전문가, 전 네이버 AI Lab 연구원, KAIST 박사. CPO 박서연(33세): UX 디자인 8년, 전 토스 프로덕트 디자이너. 개발팀 3명(백엔드 2, 프론트 1).',
    coreCompetency: 'CEO의 12년 에듀테크 경험과 학원 네트워크. CTO의 AI 논문 15편 게재 및 특허 3건. CPO의 DAU 100만 서비스 설계 경험. CEO의 전 스타트업 Exit 경험(2019년 30억 매각). 교육청, 대형 학원 의사결정권자와의 네트워크.',
  },
  keyTechnology: {
    techDifferentiation: '자체 개발 적응형 AI 알고리즘으로 학생별 학습 경로 실시간 최적화(특허 출원 완료). 학습 행동 데이터 기반 취약 영역 0.1단원 수준 정밀 진단. 학부모 대시보드로 실시간 학습 현황 공유. 한국 교육과정 100% 연계 내신·수능 동시 대비.',
    intellectualProperty: '딥러닝 기반 학습 패턴 분석 모델 정확도 92% 달성, 특허 출원 완료. 베타 테스트 사용자 만족도 4.5/5. Python/TensorFlow AI 엔진, React Native 앱, AWS 클라우드. 향후 GPT-4 연동 AI 튜터 기능 고도화 예정.',
  },
  economics: {
    revenueProjection: 'B2C 구독형 SaaS: 기본 월 29,000원, 프리미엄 월 49,000원(1:1 화상 튜터링 포함). ARPU 35,000원. 1년차 매출 3억원, 2년차 15억원, 3년차 50억원 목표. 수익원: 구독(75%), B2B 라이선스(15%), 프리미엄 콘텐츠(10%).',
    breakEvenPoint: 'BEP 달성 시점: 창업 후 18개월, BEP 고객 수 1,200명(누적). CAC 50,000원, LTV 420,000원(평균 12개월 구독). LTV/CAC 비율 8.4배(우수).',
  },
  realization: {
    milestones: '3개월: MVP 정식 출시, 베타 테스터 500명 전환, PMF 검증. 6개월: 유료 1,000명, 월 매출 3,000만원. 12개월: 유료 5,000명, 월 매출 1.5억원, 시리즈A 30억원 유치. 24개월: 유료 20,000명, 월 매출 6억원, B2B 50건. 36개월: 누적 100억원, 해외 진출.',
    riskManagement: '기술 개발 지연: 애자일 개발, 외주 병행. 고객 확보 부진: 무료 체험 확대, 바이럴 이벤트. 경쟁 심화: 지속적 기술 혁신, 고객 락인. 법적 규제: 법률 자문, 개인정보보호 강화. 서울시교육청 MOU 체결, 대형 학원 3곳 파일럿 진행 중.',
  },
  socialValue: {
    jobCreation: '6개월 내: 프론트엔드 2명, 마케터 1명 채용. 1년 내: AI 엔지니어 1명, 영업 2명, 콘텐츠 기획 1명. 2년 내: 해외 사업 1명, CS팀 3명. 총 인원 6명 → 17명으로 확대.',
    socialContribution: '교육 격차 해소: AI 맞춤 학습으로 지역/경제적 격차 완화. 학습 효율 40% 향상으로 사교육비 절감 기대. 청년 AI 인재 양성 프로그램 운영 계획. 지방 교육청 무상 서비스 제공 검토.',
  },
};

