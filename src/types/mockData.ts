import {
  Template,
  WizardStep,
  PMFQuestion,
  Risk,
  Recommendation,
  DraftSection,
} from './index';

// Templates
export const templates: Template[] = [
  {
    id: 'pre-startup',
    name: '예비창업패키지',
    description: '창업 준비 단계에 있는 예비 창업가를 위한 사업계획서',
    icon: '🚀',
    features: [
      '아이디어 검증 중심',
      'MVP 구축 계획',
      '초기 시장 조사',
      '기본 재무 설계',
    ],
  },
  {
    id: 'early-startup',
    name: '초기창업패키지',
    description: '사업을 시작한 지 1-2년 차 초기 스타트업을 위한 계획서',
    icon: '💼',
    features: [
      'PMF 검증 전략',
      '성장 전략 수립',
      '상세 재무 분석',
      '투자 유치 준비',
    ],
  },
  {
    id: 'bank-loan',
    name: '은행용 대출',
    description: '금융기관 대출 심사를 위한 표준 사업계획서',
    icon: '🏦',
    features: [
      '담보/신용 분석',
      '상환 계획 수립',
      '리스크 관리',
      '보수적 재무 예측',
    ],
  },
];

// Wizard Steps with Questions
export const wizardSteps: WizardStep[] = [
  {
    id: 1,
    title: '아이템 개요',
    description: '사업 아이템의 핵심 내용을 정리합니다',
    icon: '📝',
    status: 'pending',
    questions: [
      {
        id: 'item-name',
        type: 'text',
        label: '사업 아이템명',
        placeholder: '예: AI 기반 맞춤형 학습 플랫폼',
        required: true,
      },
      {
        id: 'item-summary',
        type: 'textarea',
        label: '한 문장 요약',
        description: '투자자에게 30초 안에 설명할 수 있는 핵심 가치',
        placeholder: '예: 학생의 학습 패턴을 분석하여 개인화된 학습 경로를 제공하는...',
        required: true,
      },
      {
        id: 'problem',
        type: 'textarea',
        label: '해결하고자 하는 문제',
        description: '타겟 고객이 겪고 있는 구체적인 문제',
        placeholder: '현재 교육 시장에서 학생들은...',
        required: true,
      },
      {
        id: 'solution',
        type: 'textarea',
        label: '솔루션',
        description: '문제를 어떻게 해결하는가?',
        placeholder: '우리의 플랫폼은...',
        required: true,
      },
      {
        id: 'target-customer',
        type: 'textarea',
        label: '타겟 고객',
        description: '구체적인 고객 페르소나',
        placeholder: '중학생 자녀를 둔 30-40대 학부모...',
        required: true,
      },
    ],
  },
  {
    id: 2,
    title: '시장 분석',
    description: '시장 규모와 경쟁 환경을 분석합니다',
    icon: '📊',
    status: 'pending',
    questions: [
      {
        id: 'market-size',
        type: 'textarea',
        label: '시장 규모 (TAM/SAM/SOM)',
        description: 'Total Addressable Market, Serviceable Available Market, Serviceable Obtainable Market',
        placeholder: 'TAM: 전체 교육 시장 10조원\nSAM: 온라인 교육 2조원\nSOM: 1년차 목표 100억원',
        required: true,
      },
      {
        id: 'market-trend',
        type: 'textarea',
        label: '시장 트렌드',
        description: '최근 3-5년간 시장 변화와 향후 전망',
        placeholder: 'COVID-19 이후 온라인 교육 시장이...',
        required: true,
      },
      {
        id: 'competitors',
        type: 'textarea',
        label: '경쟁사 분석',
        description: '주요 경쟁사 3-5개와 차별점',
        placeholder: '1. A사: 강점 OO, 약점 XX\n2. B사: ...',
        required: true,
      },
      {
        id: 'competitive-advantage',
        type: 'textarea',
        label: '경쟁 우위',
        description: '우리만의 핵심 차별화 요소',
        placeholder: '특허 기술, 독점 데이터, 네트워크 효과 등',
        required: true,
      },
    ],
  },
  {
    id: 3,
    title: '실현 방안',
    description: '비즈니스 모델과 실행 전략을 수립합니다',
    icon: '⚙️',
    status: 'pending',
    questions: [
      {
        id: 'business-model',
        type: 'textarea',
        label: '비즈니스 모델',
        description: '어떻게 수익을 창출하는가?',
        placeholder: 'B2C 구독형 모델: 월 2만원...',
        required: true,
      },
      {
        id: 'revenue-streams',
        type: 'textarea',
        label: '수익원',
        description: '다양한 수익 채널 (우선순위별)',
        placeholder: '1. 구독료 (70%)\n2. 광고 (20%)\n3. 프리미엄 콘텐츠 (10%)',
        required: true,
      },
      {
        id: 'marketing-strategy',
        type: 'textarea',
        label: '마케팅 전략',
        description: '고객 획득 채널과 전략',
        placeholder: 'SNS 마케팅, 바이럴 이벤트, 파트너십...',
        required: true,
      },
      {
        id: 'milestones',
        type: 'textarea',
        label: '주요 마일스톤',
        description: '향후 1-2년간 핵심 목표',
        placeholder: '3개월: MVP 출시\n6개월: 첫 1,000명 유저\n1년: 매출 1억...',
        required: true,
      },
    ],
  },
  {
    id: 4,
    title: '재무 계획',
    description: '재무 시뮬레이션과 손익분기점을 분석합니다',
    icon: '💰',
    status: 'pending',
    questions: [
      {
        id: 'financial-simulation',
        type: 'number',
        label: '재무 시뮬레이션',
        description: '아래 재무 계산기를 사용하여 입력해주세요',
        required: false,
      },
    ],
  },
  {
    id: 5,
    title: 'PMF 진단',
    description: 'Product-Market Fit 수준을 진단합니다',
    icon: '🎯',
    status: 'pending',
    questions: [
      {
        id: 'pmf-survey',
        type: 'radio',
        label: 'PMF 설문',
        description: '아래 설문에 답변해주세요',
        required: false,
      },
    ],
  },
];

// PMF Survey Questions
export const pmfQuestions: PMFQuestion[] = [
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

// Mock PMF Report Data
export const mockRisks: Risk[] = [
  {
    id: 'risk-1',
    title: '타겟 고객 검증 부족',
    description: '실제 고객 인터뷰와 데이터 기반 검증이 부족합니다. 최소 20명 이상의 타겟 고객과 심층 인터뷰를 진행하세요.',
    severity: 'high',
  },
  {
    id: 'risk-2',
    title: '경쟁 우위 명확화 필요',
    description: '경쟁사 대비 차별화 포인트가 불분명합니다. 핵심 가치 제안(UVP)을 더욱 구체화하세요.',
    severity: 'medium',
  },
  {
    id: 'risk-3',
    title: '수익 모델 검증',
    description: '수익 모델이 이론적으로는 타당하나 실제 검증이 필요합니다. 파일럿 테스트를 진행하세요.',
    severity: 'medium',
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'MVP 빠른 출시',
    description: '완벽한 제품보다 핵심 기능만 담은 MVP를 빠르게 출시하여 시장 반응을 확인하세요.',
    priority: 'high',
  },
  {
    id: 'rec-2',
    title: '얼리어답터 확보',
    description: '초기 10-20명의 열성 고객을 확보하여 제품 개선과 입소문 확산의 기반을 만드세요.',
    priority: 'high',
  },
  {
    id: 'rec-3',
    title: '지표 기반 의사결정',
    description: '핵심 지표(North Star Metric)를 정의하고 데이터 기반으로 의사결정하는 체계를 구축하세요.',
    priority: 'medium',
  },
  {
    id: 'rec-4',
    title: '파트너십 전략',
    description: '고객 접점이 있는 기업과의 전략적 파트너십을 통해 초기 고객 획득 비용을 절감하세요.',
    priority: 'medium',
  },
];

// Mock AI Generated Business Plan
export const mockBusinessPlan: DraftSection[] = [
  {
    id: 'section-1',
    title: '1. 사업 개요',
    content: `
### 1.1 사업 아이템

**AI 기반 맞춤형 학습 플랫폼 "LearnAI"**

LearnAI는 학생 개개인의 학습 패턴, 강점, 약점을 AI가 분석하여 최적화된 학습 경로를 제공하는 혁신적인 에듀테크 플랫폼입니다.

### 1.2 핵심 가치 제안

- **개인화 학습 경로**: 학생별 맞춤 커리큘럼 자동 생성
- **실시간 취약점 분석**: AI 기반 학습 패턴 분석 및 개선 방안 제시
- **학부모 대시보드**: 자녀의 학습 현황을 실시간으로 확인

### 1.3 비전

2027년까지 국내 1위 AI 학습 플랫폼으로 성장하여 100만 명의 학생에게 맞춤형 교육 기회를 제공합니다.
    `,
    order: 1,
  },
  {
    id: 'section-2',
    title: '2. 시장 분석',
    content: `
### 2.1 시장 규모

**TAM (Total Addressable Market)**
- 국내 전체 교육 시장: 약 25조 원 (2024년 기준)

**SAM (Serviceable Available Market)**
- 온라인 교육 시장: 약 5조 원
- 중고등학생 대상 온라인 교육: 약 2조 원

**SOM (Serviceable Obtainable Market)**
- 1년차 목표: 100억 원 (시장 점유율 0.5%)
- 3년차 목표: 500억 원 (시장 점유율 2.5%)

### 2.2 시장 트렌드

1. **에듀테크 시장 급성장**: COVID-19 이후 온라인 교육 시장이 연평균 22% 성장
2. **개인화 교육 수요 증가**: 학생별 맞춤 교육에 대한 학부모 니즈 확대
3. **AI 기술 활용 확대**: 교육 분야 AI 도입이 글로벌 트렌드로 자리잡음

### 2.3 경쟁 분석

| 경쟁사 | 강점 | 약점 | 우리의 차별점 |
|--------|------|------|---------------|
| A사(메가스터디) | 브랜드 인지도 | 개인화 부족 | AI 기반 맞춤 학습 |
| B사(대교) | 오프라인 네트워크 | 온라인 전환 미흡 | 완전한 온라인 플랫폼 |
| C사(해외 플랫폼) | 글로벌 기술력 | 한국 교육과정 미반영 | 한국형 커리큘럼 |
    `,
    order: 2,
  },
  {
    id: 'section-3',
    title: '3. 사업 모델',
    content: `
### 3.1 비즈니스 모델

**B2C 구독형 SaaS 모델**

- 월 구독료: 29,000원
- 연간 구독 할인: 290,000원 (17% 할인)
- 무료 체험: 14일

### 3.2 수익원

1. **구독 수익 (75%)**
   - 기본 플랜: 월 29,000원
   - 프리미엄 플랜: 월 49,000원 (1:1 화상 과외 포함)

2. **기업 제휴 (15%)**
   - 학원, 교육청 대상 B2B 라이선스

3. **프리미엄 콘텐츠 (10%)**
   - 유명 강사 특강, 입시 컨설팅

### 3.3 고객 획득 전략

1. **바이럴 마케팅**
   - 추천 보상 프로그램: 친구 초대 시 1개월 무료
   - SNS 인플루언서 협업

2. **콘텐츠 마케팅**
   - 유튜브 교육 콘텐츠
   - 블로그 입시 정보 제공

3. **파트너십**
   - 학원/교육청 제휴
   - 학습지/교재 업체 협력
    `,
    order: 3,
  },
  {
    id: 'section-4',
    title: '4. 재무 계획',
    content: `
### 4.1 초기 투자 계획

**총 필요 자금: 5억 원**

- 기술 개발: 2억 원 (40%)
- 마케팅: 1.5억 원 (30%)
- 운영비: 1억 원 (20%)
- 예비비: 0.5억 원 (10%)

### 4.2 손익 전망

| 구분 | 1년차 | 2년차 | 3년차 |
|------|-------|-------|-------|
| 매출 | 3억 원 | 15억 원 | 50억 원 |
| 영업비용 | 5억 원 | 12억 원 | 35억 원 |
| 영업이익 | -2억 원 | 3억 원 | 15억 원 |

### 4.3 주요 가정

- 월 평균 신규 가입자: 1년차 200명 → 3년차 1,500명
- 이탈률 (Churn Rate): 월 5%
- 객단가 (ARPU): 35,000원
- CAC (고객획득비용): 50,000원
- LTV (생애가치): 420,000원 (평균 12개월 구독 가정)
- **LTV/CAC 비율: 8.4** (우수)

### 4.4 손익분기점

- BEP 달성 시점: 창업 후 18개월
- BEP 고객 수: 약 1,200명 (누적)
    `,
    order: 4,
  },
  {
    id: 'section-5',
    title: '5. 실행 계획',
    content: `
### 5.1 주요 마일스톤

**Phase 1: MVP 개발 (3개월)**
- 핵심 AI 알고리즘 개발
- 베타 테스터 100명 모집
- 피드백 기반 개선

**Phase 2: 정식 출시 (6개월)**
- 마케팅 캠페인 시작
- 첫 1,000명 유저 확보
- 월 구독 수익 3천만 원 달성

**Phase 3: 성장 가속화 (12개월)**
- 기업 제휴 확대
- 누적 유저 10,000명
- 시리즈 A 투자 유치 (30억 원)

### 5.2 팀 구성

- **CEO (1명)**: 전략 및 경영 총괄
- **CTO (1명)**: 기술 개발 총괄
- **AI 엔지니어 (2명)**: 알고리즘 개발
- **백엔드 개발자 (2명)**: 서버 및 인프라
- **프론트엔드 개발자 (2명)**: 웹/앱 UI 개발
- **마케터 (2명)**: 콘텐츠 및 성장 마케팅

### 5.3 리스크 관리

| 리스크 | 대응 방안 |
|--------|-----------|
| 기술 개발 지연 | 애자일 개발 방법론 도입, 외주 개발 병행 |
| 고객 확보 부진 | 무료 체험 확대, 바이럴 이벤트 강화 |
| 경쟁 심화 | 지속적 기술 혁신, 고객 락인 전략 |
| 법적 규제 | 법률 자문, 개인정보보호 강화 |
    `,
    order: 5,
  },
  {
    id: 'section-6',
    title: '6. 결론',
    content: `
### 6.1 핵심 요약

LearnAI는 AI 기술을 활용하여 학생 개개인에게 최적화된 학습 경험을 제공하는 혁신적인 에듀테크 플랫폼입니다.

**핵심 경쟁력**
1. 차별화된 AI 기술력
2. 검증된 비즈니스 모델
3. 명확한 시장 기회
4. 우수한 팀 역량

**투자 포인트**
- 연평균 22% 성장하는 시장
- 8.4배의 우수한 LTV/CAC 비율
- 18개월 내 손익분기점 달성 예정
- 3년 내 누적 매출 70억 원 전망

### 6.2 향후 비전

교육의 본질인 "개인 맞춤 성장"을 기술로 구현하여, 모든 학생이 자신의 잠재력을 최대한 발휘할 수 있는 세상을 만들겠습니다.
    `,
    order: 6,
  },
];

