/**
 * 파일명: templateThemes.ts
 * 
 * 파일 용도:
 * 템플릿별 UI 테마 및 스타일 정의
 * - 색상, 아이콘, 그라디언트 등 비주얼 요소
 * - 템플릿별 포커스 영역 및 평가 기준
 */

import { TemplateType } from '../types';

/** 템플릿 테마 정의 */
export interface TemplateTheme {
  /** 템플릿 이름 */
  name: string;
  /** 템플릿 약칭 */
  shortName: string;
  /** 주요 색상 (Tailwind 색상명) */
  primaryColor: string;
  /** 아이콘 (이모지) */
  icon: string;
  /** 배지 텍스트 */
  badge: string;
  /** 헤더 그라디언트 클래스 */
  headerGradient: string;
  /** 포커스 영역 */
  focusAreas: string[];
  /** 평가 핵심 */
  evaluationFocus: string;
  /** 목표 */
  goal: string;
  /** 버튼 그라디언트 클래스 */
  buttonGradient: string;
  /** 보더 색상 클래스 */
  borderColor: string;
  /** 배경 그라디언트 */
  bgGradient: string;
}

/** 템플릿별 테마 설정 */
export const TEMPLATE_THEMES: Record<TemplateType, TemplateTheme> = {
  'pre-startup': {
    name: '예비창업패키지',
    shortName: '예창패',
    primaryColor: 'emerald',
    icon: '🚀',
    badge: '아이디어 구체화',
    headerGradient: 'from-emerald-500 to-cyan-500',
    focusAreas: ['실현 가능성', 'MVP 개발', '대표자 역량'],
    evaluationFocus: '대표자 개인의 개발/사업화 능력',
    goal: '아이디어의 실현 가능성(Feasibility) 증명 및 시제품 제작 완료',
    buttonGradient: 'from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400',
    borderColor: 'border-emerald-500/30',
    bgGradient: 'from-emerald-950/20 via-slate-950 to-cyan-950/20',
  },
  'early-startup': {
    name: '초기창업패키지',
    shortName: '초창패',
    primaryColor: 'blue',
    icon: '💼',
    badge: '시장 진입 & 성장',
    headerGradient: 'from-blue-500 to-purple-500',
    focusAreas: ['시장성 검증', '매출 성장', '투자 유치'],
    evaluationFocus: '팀의 조직적 수행 능력 및 투자 유치 가능성',
    goal: '제품의 시장성(Marketability) 검증 및 매출/투자(Growth) 확대',
    buttonGradient: 'from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400',
    borderColor: 'border-blue-500/30',
    bgGradient: 'from-blue-950/20 via-slate-950 to-purple-950/20',
  },
  'bank-loan': {
    name: '정책자금 및 은행 대출',
    shortName: '정책자금',
    primaryColor: 'amber',
    icon: '🏦',
    badge: '오픈 예정',
    headerGradient: 'from-amber-500 to-orange-500',
    focusAreas: ['재무 안정성', '상환 능력', '담보 가치'],
    evaluationFocus: '기업의 재무 건전성 및 상환 계획',
    goal: '금융기관 대출 심사 통과 및 자금 조달',
    buttonGradient: 'from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400',
    borderColor: 'border-amber-500/30',
    bgGradient: 'from-amber-950/20 via-slate-950 to-orange-950/20',
  },
};

/** 템플릿별 자금 구조 */
export const BUDGET_STRUCTURES = {
  'pre-startup': {
    type: 'two-phase' as const,
    description: '1단계 + 2단계 분리 집행',
    phases: [
      {
        phase: 1,
        name: '1단계 (MVP 개발)',
        maxAmount: 20000000, // 2천만 원
        description: '재료비, 외주용역비 중심',
        categories: [
          { id: 'materials', name: '재료비', maxRatio: 0.3, description: '클라우드, 장비, 소프트웨어' },
          { id: 'outsourcing', name: '외주용역비', maxRatio: 0.5, description: '개발, 디자인 외주' },
          { id: 'labor', name: '인건비', maxRatio: 0.3, description: '대표자 인건비' },
        ],
      },
      {
        phase: 2,
        name: '2단계 (서비스 고도화)',
        maxAmount: 40000000, // 4천만 원
        description: '개발비, 마케팅비, 운영비',
        categories: [
          { id: 'development', name: '개발비', maxRatio: 0.4, description: '앱 개발, 기능 고도화' },
          { id: 'marketing', name: '마케팅비', maxRatio: 0.3, description: '온라인 광고, 홍보' },
          { id: 'operation', name: '운영비', maxRatio: 0.3, description: '인건비, 사무실' },
        ],
      },
    ],
    totalMax: 60000000, // 6천만 원
  },
  'early-startup': {
    type: 'matching-fund' as const,
    description: '정부지원금 + 자기부담금 매칭',
    ratios: {
      government: { ratio: 0.7, maxRatio: 0.7, description: '정부지원금 (최대 70%)' },
      selfCash: { ratio: 0.1, minRatio: 0.1, description: '자기부담금 - 현금 (최소 10%)' },
      selfInKind: { ratio: 0.2, maxRatio: 0.2, description: '자기부담금 - 현물 (최대 20%)' },
    },
    categories: [
      { id: 'labor', name: '인건비', description: '정규직, 계약직 인건비' },
      { id: 'development', name: '개발비', description: '제품 고도화, 기술 개발' },
      { id: 'marketing', name: '마케팅비', description: '광고, 홍보, 영업' },
      { id: 'operation', name: '운영비', description: '임차료, 관리비 등' },
      { id: 'equipment', name: '장비비', description: '개발 장비, 서버 등' },
    ],
    maxTotal: 300000000, // 3억 원 (예시)
  },
  'bank-loan': {
    type: 'loan' as const,
    description: '대출 신청금 + 담보/신용',
    // 추후 구현
  },
};

/** 템플릿별 작성 팁 */
export const WRITING_TIPS: Record<TemplateType, string[]> = {
  'pre-startup': [
    '아이디어를 구체적인 "개발 계획"과 "물리적 산출물"로 변환하세요',
    '대표자 개인의 개발/사업화 능력을 강조하세요',
    '1단계(2천만)/2단계(4천만) 자금 구조를 명확히 하세요',
    'ESG 실천 계획은 필수 포함 항목입니다',
    '거창한 확장보다 MVP 완성에 집중하세요',
  ],
  'early-startup': [
    '시장 검증 데이터(트랙 레코드)를 반드시 포함하세요',
    '팀의 조직적 수행 능력을 강조하세요',
    '매칭펀드 비율(정부 70% + 자기 30%)을 정확히 맞추세요',
    '투자 유치 계획(Pre-A, Series A 등)을 구체적으로 명시하세요',
    '측정 가능한 ESG 목표와 실천 방안을 제시하세요',
  ],
  'bank-loan': [
    '재무제표의 건전성을 강조하세요',
    '구체적인 상환 계획을 수립하세요',
    '담보 가치와 신용 등급을 명시하세요',
    '보수적인 매출 추정으로 신뢰도를 높이세요',
    '리스크 관리 방안을 포함하세요',
  ],
};

/** 템플릿 선택 시 표시할 비교 정보 */
export const TEMPLATE_COMPARISON = [
  {
    aspect: '핵심 목표',
    'pre-startup': '아이디어 실현 가능성 증명',
    'early-startup': '시장성 검증 및 성장',
    'bank-loan': '재무 건전성 및 상환 능력',
  },
  {
    aspect: '평가 초점',
    'pre-startup': '대표자 개인 역량',
    'early-startup': '조직적 수행 능력',
    'bank-loan': '재무 안정성',
  },
  {
    aspect: '자금 구조',
    'pre-startup': '1단계 2천만 + 2단계 4천만',
    'early-startup': '정부 70% + 현금 10% + 현물 20%',
    'bank-loan': '대출금 + 담보/신용',
  },
  {
    aspect: '성장 전략',
    'pre-startup': 'MVP/시제품 완성',
    'early-startup': '매출 성장 + 투자 유치',
    'bank-loan': '안정적 성장 + 상환',
  },
];

/**
 * 템플릿 타입에 따른 테마 반환
 */
export const getTemplateTheme = (templateType: TemplateType): TemplateTheme => {
  return TEMPLATE_THEMES[templateType];
};

/**
 * 템플릿 타입에 따른 자금 구조 반환
 */
export const getBudgetStructure = (templateType: TemplateType) => {
  return BUDGET_STRUCTURES[templateType];
};

