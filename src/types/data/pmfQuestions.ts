import { PMFQuestion } from '../index';

export const PMF_QUESTIONS_FALLBACK: PMFQuestion[] = [
  {
    id: 'pmf-1',
    question: '타겟 고객이 명확하게 정의되어 있습니까?',
    options: [
      { value: 1, label: '전혀 아니다' },
      { value: 2, label: '아니다' },
      { value: 3, label: '보통이다' },
      { value: 4, label: '그렇다' },
      { value: 5, label: '매우 그렇다' },
    ],
  },
  {
    id: 'pmf-2',
    question: '고객이 겪는 문제를 직접 인터뷰를 통해 검증했습니까?',
    options: [
      { value: 1, label: '전혀 아니다' },
      { value: 2, label: '아니다' },
      { value: 3, label: '보통이다' },
      { value: 4, label: '그렇다' },
      { value: 5, label: '매우 그렇다' },
    ],
  },
  {
    id: 'pmf-3',
    question: '우리 솔루션 없이는 고객이 큰 불편을 겪습니까?',
    options: [
      { value: 1, label: '전혀 아니다' },
      { value: 2, label: '아니다' },
      { value: 3, label: '보통이다' },
      { value: 4, label: '그렇다' },
      { value: 5, label: '매우 그렇다' },
    ],
  },
  {
    id: 'pmf-4',
    question: '경쟁사 대비 명확한 차별화 포인트가 있습니까?',
    options: [
      { value: 1, label: '전혀 아니다' },
      { value: 2, label: '아니다' },
      { value: 3, label: '보통이다' },
      { value: 4, label: '그렇다' },
      { value: 5, label: '매우 그렇다' },
    ],
  },
  {
    id: 'pmf-5',
    question: '유료로 전환할 의향이 있는 얼리어답터가 있습니까?',
    options: [
      { value: 1, label: '전혀 아니다' },
      { value: 2, label: '아니다' },
      { value: 3, label: '보통이다' },
      { value: 4, label: '그렇다' },
      { value: 5, label: '매우 그렇다' },
    ],
  },
  {
    id: 'pmf-6',
    question: '고객 추천율(NPS)이 높습니까?',
    options: [
      { value: 1, label: '전혀 아니다' },
      { value: 2, label: '아니다' },
      { value: 3, label: '보통이다' },
      { value: 4, label: '그렇다' },
      { value: 5, label: '매우 그렇다' },
    ],
  },
  {
    id: 'pmf-7',
    question: '시장 규모가 충분히 크고 성장하고 있습니까?',
    options: [
      { value: 1, label: '전혀 아니다' },
      { value: 2, label: '아니다' },
      { value: 3, label: '보통이다' },
      { value: 4, label: '그렇다' },
      { value: 5, label: '매우 그렇다' },
    ],
  },
  {
    id: 'pmf-8',
    question: '수익 모델이 명확하고 검증되었습니까?',
    options: [
      { value: 1, label: '전혀 아니다' },
      { value: 2, label: '아니다' },
      { value: 3, label: '보통이다' },
      { value: 4, label: '그렇다' },
      { value: 5, label: '매우 그렇다' },
    ],
  },
  {
    id: 'pmf-9',
    question: '제품/서비스를 지속적으로 개선할 수 있는 역량이 있습니까?',
    options: [
      { value: 1, label: '전혀 아니다' },
      { value: 2, label: '아니다' },
      { value: 3, label: '보통이다' },
      { value: 4, label: '그렇다' },
      { value: 5, label: '매우 그렇다' },
    ],
  },
  {
    id: 'pmf-10',
    question: '팀이 해당 시장에 대한 전문성을 보유하고 있습니까?',
    options: [
      { value: 1, label: '전혀 아니다' },
      { value: 2, label: '아니다' },
      { value: 3, label: '보통이다' },
      { value: 4, label: '그렇다' },
      { value: 5, label: '매우 그렇다' },
    ],
  },
];
