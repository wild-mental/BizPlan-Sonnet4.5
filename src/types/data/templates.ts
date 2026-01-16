import { Template } from '../index';

export const TEMPLATES_FALLBACK: Template[] = [
  {
    id: 'pre-startup',
    name: '예비창업패키지',
    description: '창업 준비 단계에 있는 예비 창업가를 위한 사업계획서',
    icon: '🚀',
    features: ['아이디어 검증 중심', 'MVP 구축 계획', '초기 시장 조사', '기본 재무 설계'],
  },
  {
    id: 'early-startup',
    name: '초기창업패키지',
    description: '사업을 시작한 지 1-2년 차 초기 스타트업을 위한 계획서',
    icon: '💼',
    features: ['PMF 검증 전략', '성장 전략 수립', '상세 재무 분석', '투자 유치 준비'],
  },
  {
    id: 'bank-loan',
    name: '정책자금 및 은행 대출',
    description: '금융기관 대출 심사를 위한 표준 사업계획서',
    icon: '🏦',
    features: ['담보/신용 분석', '상환 계획 수립', '리스크 관리', '보수적 재무 예측'],
  },
];
