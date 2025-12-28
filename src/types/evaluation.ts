/**
 * M.A.K.E.R.S AI 평가 관련 타입 정의
 */

/** 평가 영역 코드 */
export type EvaluationArea = 'M' | 'A' | 'K' | 'E' | 'R' | 'S';

/** PSST 커버리지 정보 */
export interface PsstCoverage {
  /** PSST 영역명 */
  area: string;
  /** 커버하는 항목들 */
  items: string[];
}

/** 평가 영역 정보 */
export interface EvaluationAreaInfo {
  code: EvaluationArea;
  name: string;
  korean: string;
  /** 핵심 질문 (한 줄 설명) */
  tagline: string;
  /** 짧은 설명 */
  description: string;
  /** 주 담당 PSST 영역 */
  primaryCoverage: PsstCoverage;
  /** 교차 지원 PSST 영역 */
  secondaryCoverage: PsstCoverage;
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
    tagline: '시장이 존재하는가? 고객이 원하는가? 경쟁에서 이길 수 있는가?',
    description: 'TAM/SAM/SOM, 경쟁사 분석, 타깃 고객 세분화',
    primaryCoverage: {
      area: '[1. Problem] 문제 인식',
      items: [
        '국내·외 시장 현황 및 문제점',
        '시장 내 기존 제품/서비스의 한계 및 미충족 수요',
      ],
    },
    secondaryCoverage: {
      area: '[3. Scale-up] 성장전략',
      items: [
        '경쟁사 분석 및 차별적 경쟁 우위',
        '목표 시장 진입 전략 (타겟 고객 규모 및 특성 분석)',
      ],
    },
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
    tagline: '이 팀은 목표를 달성할 역량을 갖추었는가?',
    description: '팀 구성, 창업자 역량, 실행 가능성',
    primaryCoverage: {
      area: '[4. Team] 팀 구성',
      items: [
        '대표자의 보유 역량 (개발, 사업화, 경영 능력 등)',
        '팀원 역량 및 추가 인력 채용 계획',
        '업무 파트너(협력 기업/기관) 현황 및 활용 방안',
      ],
    },
    secondaryCoverage: {
      area: '[0. 일반현황]',
      items: [
        '현재 팀 구성 현황 (직위, 담당 업무, 경력 등)',
      ],
    },
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
    tagline: '기술적 차별성과 진입장벽(Moat)이 있는가?',
    description: '기술 혁신성, 차별화, 지식재산권',
    primaryCoverage: {
      area: '[2. Solution] 실현 가능성',
      items: [
        '창업 아이템의 기술적 차별성 및 경쟁력 확보 전략',
        '핵심 기능 및 성능 구현 방법',
      ],
    },
    secondaryCoverage: {
      area: '[0. 개요]',
      items: [
        '창업 아이템의 핵심 기능·성능 및 고객 제공 혜택',
      ],
    },
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
    tagline: '수익을 창출하고 지속 성장 가능한가?',
    description: '매출/손익 계획, 자금 조달, 재무 건전성',
    primaryCoverage: {
      area: '[3. Scale-up] 성장전략',
      items: [
        '비즈니스 모델 (수익화 모델, 가격 정책, 유통 구조)',
        '사업 확장을 위한 투자유치(자금 확보) 전략',
      ],
    },
    secondaryCoverage: {
      area: '[2. Solution] 실현 가능성',
      items: [
        '사업비 집행 계획 (정부지원금 및 대응자금 운용의 적정성)',
      ],
    },
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
    tagline: '구체적인 계획이 있고, 결과물이 나오는가?',
    description: '사업화 전략, 로드맵, 마일스톤',
    primaryCoverage: {
      area: '[2. Solution] 실현 가능성',
      items: [
        '창업 아이템의 개발 계획 (아이디어 구체화 프로세스)',
        '협약 기간 내 달성 가능한 최종 산출물 (형태, 수량)',
      ],
    },
    secondaryCoverage: {
      area: '[3. Scale-up] 성장전략',
      items: [
        '사업 전체 로드맵 (개발-출시-성장 단계별 일정)',
      ],
    },
    questions: [
      '주요 사업화 일정과 마일스톤은 무엇인가요?',
      '예상되는 리스크와 대응 방안은 무엇인가요?',
    ],
    image: '/assets/juror-single/j5_realization_tr.png',
    color: 'cyan',
  },
  {
    code: 'S',
    name: 'Social Impact',
    korean: '사회적가치',
    tagline: '기업의 사회적 책임(ESG)을 고려하는가?',
    description: 'ESG, 일자리 창출, 지역사회 기여',
    primaryCoverage: {
      area: '[3. Scale-up] 성장전략',
      items: [
        '중장기 사회적 가치 도입 계획 (ESG 경영 전략)',
        '환경(E): 친환경 원료, 에너지 절감, 폐기물 감소 등',
        '사회(S): 일자리 창출, 지역사회 공헌, 약자 배려 등',
        '지배구조(G): 투명 경영, 윤리 경영, 근로 환경 개선 등',
      ],
    },
    secondaryCoverage: {
      area: '',
      items: [],
    },
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

