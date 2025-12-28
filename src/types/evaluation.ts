/**
 * M.A.K.E.R.S AI 평가 관련 타입 정의
 */

/** 평가 영역 코드 */
export type EvaluationArea = 'M' | 'A' | 'K' | 'E' | 'R' | 'S';

/** 평가 영역 정보 */
export interface EvaluationAreaInfo {
  code: EvaluationArea;
  name: string;
  korean: string;
  description: string;
  questions: string[];
  image: string;
  color: string;
}

/** M.A.K.E.R.S 6대 평가 영역 상세 정보 */
export const EVALUATION_AREAS: EvaluationAreaInfo[] = [
  {
    code: 'M',
    name: 'Marketability',
    korean: '시장성',
    description: 'TAM/SAM/SOM, 경쟁사 분석, 타깃 고객 세분화',
    questions: [
      '타깃 고객은 누구인가요?',
      '예상 시장 규모는 어느 정도인가요?',
    ],
    image: '/assets/juror-single/j1_market_tr.png',
    color: 'emerald',
  },
  {
    code: 'A',
    name: 'Ability',
    korean: '수행능력',
    description: '팀 구성, 창업자 역량, 실행 가능성',
    questions: [
      '팀 구성원은 몇 명이고 어떤 역할을 담당하나요?',
      '창업자/팀의 핵심 역량은 무엇인가요?',
    ],
    image: '/assets/juror-single/j2_ability_tr.png',
    color: 'blue',
  },
  {
    code: 'K',
    name: 'Key Technology',
    korean: '핵심기술',
    description: '기술 혁신성, 차별화, 지식재산권',
    questions: [
      '핵심 기술의 차별점은 무엇인가요?',
      '특허/지식재산권을 보유하고 있나요?',
    ],
    image: '/assets/juror-single/j3_keytech_tr.png',
    color: 'purple',
  },
  {
    code: 'E',
    name: 'Economics',
    korean: '경제성',
    description: '매출/손익 계획, 자금 조달, 재무 건전성',
    questions: [
      '향후 3년간 예상 매출은 어떻게 되나요?',
      '손익분기점 도달 예상 시점은 언제인가요?',
    ],
    image: '/assets/juror-single/j4_economy_tr.png',
    color: 'amber',
  },
  {
    code: 'R',
    name: 'Realization',
    korean: '실현가능성',
    description: '사업화 전략, 로드맵, 마일스톤',
    questions: [
      '주요 사업화 일정과 마일스톤은 무엇인가요?',
      '예상되는 리스크와 대응 방안은 무엇인가요?',
    ],
    image: '/assets/juror-single/j5_realization_tr.png',
    color: 'cyan',
  },
  {
    code: 'S',
    name: 'Social Value',
    korean: '사회적가치',
    description: 'ESG, 일자리 창출, 지역사회 기여',
    questions: [
      '예상되는 일자리 창출 규모는 어느 정도인가요?',
      '사회적/환경적 기여 방안이 있나요?',
    ],
    image: '/assets/juror-single/j6_social_tr.png',
    color: 'rose',
  },
];

/** 사업계획서 입력 데이터 */
export interface BusinessPlanInput {
  marketability: {
    targetCustomer: string;
    marketSize: string;
  };
  ability: {
    teamComposition: string;
    coreCompetency: string;
  };
  keyTechnology: {
    techDifferentiation: string;
    intellectualProperty: string;
  };
  economics: {
    revenueProjection: string;
    breakEvenPoint: string;
  };
  realization: {
    milestones: string;
    riskManagement: string;
  };
  socialValue: {
    jobCreation: string;
    socialContribution: string;
  };
}

/** 초기 빈 입력 데이터 */
export const EMPTY_BUSINESS_PLAN_INPUT: BusinessPlanInput = {
  marketability: { targetCustomer: '', marketSize: '' },
  ability: { teamComposition: '', coreCompetency: '' },
  keyTechnology: { techDifferentiation: '', intellectualProperty: '' },
  economics: { revenueProjection: '', breakEvenPoint: '' },
  realization: { milestones: '', riskManagement: '' },
  socialValue: { jobCreation: '', socialContribution: '' },
};

/** 피드백 항목 */
export interface Feedback {
  area: EvaluationArea;
  title: string;
  description: string;
  isBlurred: boolean;
}

/** 평가 결과 */
export interface EvaluationResult {
  totalScore: number;
  passRate: number;
  scores: Record<EvaluationArea, number>;
  strengths: Feedback[];
  weaknesses: Feedback[];
  recommendations: string[];
  generatedAt: Date;
}

/** 평가 단계 */
export type EvaluationStep = 'intro' | 'input' | 'analyzing' | 'result';

