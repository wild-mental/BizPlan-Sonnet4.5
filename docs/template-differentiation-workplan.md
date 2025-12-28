# 템플릿별 사업계획서 작성 차별화 작업 계획서

> 작성일: 2024-12-28
> 목표: 예비창업패키지 / 초기창업패키지 템플릿별 맞춤 작성 가이드 및 데모 체험 구현

---

## 1. 현황 분석

### 1.1 현재 구현 상태

| 구분 | 현재 상태 | 개선 필요 |
|------|----------|----------|
| 템플릿 선택 | 3종 (예창패, 초창패, 정책자금) | ✅ 구조 존재 |
| 질문 구성 | 모든 템플릿 동일 | ❌ 템플릿별 차별화 필요 |
| 작성 가이드 | 없음 | ❌ 항목별 가이드 추가 필요 |
| AI 프롬프트 | 템플릿 무관 동일 | ❌ 템플릿별 맞춤 프롬프트 필요 |
| 데이터 마스킹 | 미구현 | ❌ 개인정보 자동 마스킹 필요 |

### 1.2 핵심 차이점

```
예비창업패키지 (예창패)           초기창업패키지 (초창패)
├─ 목표: 아이디어 실현 가능성     ├─ 목표: 시장성 검증 및 성장
├─ 평가: 대표자 개인 역량 중심    ├─ 평가: 조직적 수행 능력 중심
├─ 자금: 1단계 2천만 + 2단계 4천만 ├─ 자금: 정부70% + 자기30% 매칭
├─ 전략: MVP/시제품 완성 초점     ├─ 전략: 매출/투자 확보 초점
└─ ESG: 기본 실천 계획           └─ ESG: 구체적 목표 수치
```

---

## 2. 프론트엔드 작업 계획

### Phase 1: 데이터 구조 개편 (2일)

#### 2.1.1 템플릿별 질문 데이터 분리

**파일: `src/types/templateQuestions.ts` (신규 생성)**

```typescript
// 예비창업패키지 질문 구조
export const PRE_STARTUP_QUESTIONS: WizardStep[] = [
  {
    id: 1,
    title: '일반현황 및 개요',
    description: '아이템 기본 정보와 핵심 요약',
    icon: '📋',
    questions: [
      {
        id: 'item-name',
        label: '아이템명',
        type: 'text',
        placeholder: 'AI 기반 맞춤형 학습 플랫폼 LearnAI',
        guide: '명칭과 범주를 명확히 정의하세요. 예: "게토레이(범주:음료)"',
        required: true,
      },
      {
        id: 'deliverables',
        label: '산출물',
        type: 'textarea',
        placeholder: '웹 서비스 1종, 모바일 앱(iOS/Android) 2종',
        guide: '협약 기간 내 완료 가능한 앱/웹 수량을 명시하세요.',
        required: true,
      },
      // ... 더 많은 질문
    ],
  },
  {
    id: 2,
    title: '문제인식 (Problem)',
    description: '시장 현황 및 아이템 개발 필요성',
    icon: '🔍',
    guideBox: {
      title: '작성 가이드',
      tips: [
        'Pain Point를 데이터(시장 규모 등)로 제시하세요',
        '왜 *지금*, *이 아이템*이어야 하는지 당위성을 서술하세요',
      ],
    },
    questions: [/* ... */],
  },
  // ... 나머지 단계
];

// 초기창업패키지 질문 구조
export const EARLY_STARTUP_QUESTIONS: WizardStep[] = [
  // 초창패 특화 질문 구조
];
```

#### 2.1.2 가이드 박스 컴포넌트

**파일: `src/components/wizard/GuideBox.tsx` (신규 생성)**

```typescript
interface GuideBoxProps {
  title: string;
  tips: string[];
  examples?: string[];
  warnings?: string[];
}

export const GuideBox: React.FC<GuideBoxProps> = ({
  title,
  tips,
  examples,
  warnings,
}) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
        <Info className="w-4 h-4" />
        {title}
      </h4>
      <ul className="space-y-1 text-sm text-blue-700">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2">
            <span>💡</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
      {examples && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs text-blue-600 font-medium">예시:</p>
          {examples.map((ex, i) => (
            <p key={i} className="text-xs text-blue-600 italic">{ex}</p>
          ))}
        </div>
      )}
      {warnings && (
        <div className="mt-3 pt-3 border-t border-orange-200 bg-orange-50 rounded p-2">
          {warnings.map((w, i) => (
            <p key={i} className="text-xs text-orange-700">⚠️ {w}</p>
          ))}
        </div>
      )}
    </div>
  );
};
```

### Phase 2: 마법사 UI 개선 (3일)

#### 2.2.1 템플릿 컨텍스트 적용

**파일: `src/stores/useWizardStore.ts` 수정**

```typescript
interface WizardState {
  // 기존 필드...
  templateType: TemplateType | null;
  questions: WizardStep[];
  
  // 새로운 액션
  setTemplateType: (type: TemplateType) => void;
  loadQuestionsForTemplate: (type: TemplateType) => void;
}

// 템플릿에 따른 질문 로드
loadQuestionsForTemplate: (type: TemplateType) => {
  const questions = type === 'pre-startup' 
    ? PRE_STARTUP_QUESTIONS 
    : type === 'early-startup'
    ? EARLY_STARTUP_QUESTIONS
    : BANK_LOAN_QUESTIONS;
  
  set({ questions, templateType: type });
}
```

#### 2.2.2 QuestionForm 컴포넌트 개선

**파일: `src/components/wizard/QuestionForm.tsx` 수정**

```typescript
// 가이드 박스 렌더링 추가
{step.guideBox && (
  <GuideBox 
    title={step.guideBox.title}
    tips={step.guideBox.tips}
    examples={step.guideBox.examples}
    warnings={step.guideBox.warnings}
  />
)}

// 질문별 가이드 표시
{question.guide && (
  <p className="text-xs text-gray-500 mt-1">
    💡 {question.guide}
  </p>
)}
```

#### 2.2.3 템플릿별 UI 테마

**파일: `src/constants/templateThemes.ts` (신규 생성)**

```typescript
export const TEMPLATE_THEMES = {
  'pre-startup': {
    name: '예비창업패키지',
    primaryColor: 'emerald',
    icon: '🚀',
    badge: '아이디어 구체화',
    headerGradient: 'from-emerald-500 to-cyan-500',
    focusAreas: ['실현 가능성', 'MVP 개발', '대표자 역량'],
  },
  'early-startup': {
    name: '초기창업패키지',
    primaryColor: 'blue',
    icon: '💼',
    badge: '시장 진입 & 성장',
    headerGradient: 'from-blue-500 to-purple-500',
    focusAreas: ['시장성 검증', '매출 성장', '투자 유치'],
  },
};
```

### Phase 3: 자금 계획 계산기 차별화 (2일)

#### 2.3.1 예비창업패키지 자금 계산기

**파일: `src/components/wizard/PreStartupBudgetCalculator.tsx` (신규 생성)**

```typescript
// 1단계 (약 2천만 원) + 2단계 (약 4천만 원) 구조
interface BudgetPhase {
  phase: 1 | 2;
  maxAmount: number;
  categories: BudgetCategory[];
}

const PRE_STARTUP_BUDGET: BudgetPhase[] = [
  {
    phase: 1,
    maxAmount: 20000000, // 2천만 원
    categories: [
      { id: 'materials', name: '재료비', maxRatio: 0.3 },
      { id: 'outsourcing', name: '외주용역비', maxRatio: 0.5 },
      { id: 'equipment', name: '장비비', maxRatio: 0.2 },
    ],
  },
  {
    phase: 2,
    maxAmount: 40000000, // 4천만 원
    categories: [
      { id: 'development', name: '개발비', maxRatio: 0.4 },
      { id: 'marketing', name: '마케팅비', maxRatio: 0.3 },
      { id: 'operation', name: '운영비', maxRatio: 0.3 },
    ],
  },
];
```

#### 2.3.2 초기창업패키지 자금 계산기 (매칭펀드)

**파일: `src/components/wizard/EarlyStartupBudgetCalculator.tsx` (신규 생성)**

```typescript
// 정부지원금 70% + 자기부담금 30% (현금10% + 현물20%)
interface MatchingFund {
  totalBudget: number;
  governmentRatio: 0.7;
  selfFundingRatio: 0.3;
  cashRatio: 0.1;
  inKindRatio: 0.2;
}

const calculateMatchingFund = (total: number): MatchingFund => {
  return {
    totalBudget: total,
    governmentRatio: 0.7,
    governmentAmount: total * 0.7,
    selfFundingRatio: 0.3,
    selfFundingAmount: total * 0.3,
    cashAmount: total * 0.1,      // 현금 10%
    inKindAmount: total * 0.2,    // 현물 20%
  };
};
```

### Phase 4: 개인정보 마스킹 (1일)

#### 2.4.1 자동 마스킹 유틸리티

**파일: `src/utils/dataMasking.ts` (신규 생성)**

```typescript
// 개인정보 마스킹 규칙
const MASKING_PATTERNS = [
  { pattern: /([가-힣]{2,4})\s*(대표|사장|CEO)/g, replace: 'OOO $2' },
  { pattern: /\d{3}-\d{4}-\d{4}/g, replace: '010-****-****' },
  { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replace: '***@***.***' },
  { pattern: /(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)(시|도)?.*?(구|군|시)/g, replace: 'OO시 OO구' },
  { pattern: /([가-힣]+대학교|[가-힣]+대)/g, replace: 'OO대학교' },
];

export const maskPersonalInfo = (text: string): string => {
  let masked = text;
  MASKING_PATTERNS.forEach(({ pattern, replace }) => {
    masked = masked.replace(pattern, replace);
  });
  return masked;
};

// 마스킹 미리보기 컴포넌트
export const MaskingPreview: React.FC<{ original: string }> = ({ original }) => {
  const masked = maskPersonalInfo(original);
  const hasMasking = original !== masked;
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
      <p className="font-medium text-yellow-800">🔒 개인정보 마스킹 적용 결과</p>
      {hasMasking ? (
        <p className="text-yellow-700 mt-1">{masked}</p>
      ) : (
        <p className="text-green-600 mt-1">✓ 마스킹 대상 정보 없음</p>
      )}
    </div>
  );
};
```

---

## 3. 백엔드 작업 계획

### Phase 1: API 스키마 확장 (2일)

#### 3.1.1 템플릿별 요청/응답 구조

**파일: `backend/src/dto/business-plan.dto.ts`**

```typescript
// 예비창업패키지 요청 DTO
export class PreStartupPlanRequestDto {
  @IsString()
  itemName: string;
  
  @IsString()
  deliverables: string;
  
  @IsObject()
  problem: {
    marketStatus: string;
    painPoints: string;
    necessity: string;
  };
  
  @IsObject()
  solution: {
    developmentPlan: string;
    differentiators: string;
    budgetPhase1: BudgetAllocation;
    budgetPhase2: BudgetAllocation;
  };
  
  @IsObject()
  growth: {
    marketEntry: string;
    businessModel: string;
    esgPlan: string;
  };
  
  @IsObject()
  team: {
    founderCapability: string;
    hiringPlan: string;
    partnerships: string;
  };
}

// 초기창업패키지 요청 DTO
export class EarlyStartupPlanRequestDto {
  // 기창업자 추가 필드
  @IsString()
  companyName: string;
  
  @IsNumber()
  foundedYear: number;
  
  @IsObject()
  trackRecord: {
    revenue: number;
    customers: number;
    achievements: string[];
  };
  
  @IsObject()
  matchingFund: {
    totalBudget: number;
    governmentFund: number;
    selfCash: number;
    selfInKind: number;
  };
  
  @IsObject()
  investmentPlan: {
    targetRound: 'Pre-A' | 'Series-A' | 'Series-B';
    targetAmount: number;
    timeline: string;
  };
  
  // ... 나머지 필드
}
```

#### 3.1.2 템플릿별 AI 프롬프트

**파일: `backend/src/services/ai-prompt.service.ts`**

```typescript
export class AiPromptService {
  
  getSystemPrompt(templateType: TemplateType): string {
    const basePrompt = `당신은 정부 창업지원사업 사업계획서 작성 전문가입니다.`;
    
    if (templateType === 'pre-startup') {
      return `${basePrompt}
      
      ## 예비창업패키지 평가 기준
      - 핵심 목표: 아이디어의 '실현 가능성(Feasibility)' 증명
      - 평가 초점: 대표자 개인의 개발/사업화 능력
      - 산출물: 협약 기간 내 MVP/시제품 완성
      
      ## 작성 원칙
      1. 추상적 아이디어를 구체적 '개발 계획'으로 변환
      2. 자금 계획은 1단계(2천만원)/2단계(4천만원) 구조 준수
      3. ESG 기본 실천 계획 포함
      4. 개인정보(이름, 학교 등)는 'OOO'로 마스킹`;
    }
    
    if (templateType === 'early-startup') {
      return `${basePrompt}
      
      ## 초기창업패키지 평가 기준
      - 핵심 목표: 제품의 '시장성(Marketability)' 검증
      - 평가 초점: 조직적 수행 능력 및 투자 유치 가능성
      - 산출물: 매출 성장 및 투자 라운드 진입
      
      ## 작성 원칙
      1. 시장 검증 데이터(트랙 레코드) 기반 서술
      2. 매칭펀드 구조(정부70% + 자기30%) 준수
      3. 구체적 목표 수치(매출, SOM, ROI) 제시
      4. 투자 라운드(Pre-A, Series-A 등) 명시`;
    }
    
    return basePrompt;
  }
  
  getSectionPrompt(templateType: TemplateType, section: string): string {
    const prompts = {
      'pre-startup': {
        problem: `
          ## 문제인식(Problem) 섹션 작성 가이드
          - 시장의 빈틈(Gap)을 데이터로 제시
          - "왜 지금, 이 아이템이어야 하는가" 당위성 논증
          - Pain Point를 고객 관점에서 구체화
        `,
        solution: `
          ## 실현가능성(Solution) 섹션 작성 가이드
          - 아이디어 → 제품화 과정을 단계별 로드맵으로 서술
          - 1단계(2천만원): 재료비, 외주용역비 산출 근거
          - 2단계(4천만원): 개발비, 마케팅비 산출 근거
        `,
        // ... 나머지 섹션
      },
      'early-startup': {
        problem: `
          ## 문제인식(Problem) 섹션 작성 가이드
          - 기존 제품 운영 중 발견한 시장의 한계 정의
          - 고객 피드백 데이터 기반 Up-leveling 필요성
          - 고도화를 통한 경쟁 우위 확보 방안
        `,
        solution: `
          ## 실현가능성(Solution) 섹션 작성 가이드
          - 기술적 장벽(특허, 데이터 우위) 강조
          - 매칭펀드: 정부 70% + 현금 10% + 현물 20%
          - 각 항목별 산출 근거 및 집행 계획
        `,
        // ... 나머지 섹션
      },
    };
    
    return prompts[templateType]?.[section] || '';
  }
}
```

### Phase 2: 문서 생성 엔진 확장 (3일)

#### 3.2.1 템플릿별 HWP/PDF 레이아웃

**파일: `backend/src/services/document-generator.service.ts`**

```typescript
export class DocumentGeneratorService {
  
  async generateDocument(
    data: BusinessPlanData,
    templateType: TemplateType,
    format: 'hwp' | 'pdf'
  ): Promise<Buffer> {
    // 템플릿별 레이아웃 선택
    const layout = this.getLayoutForTemplate(templateType);
    
    // 섹션별 콘텐츠 생성
    const sections = this.generateSections(data, templateType);
    
    // 정부 양식 호환성 검증
    this.validateGovernmentFormat(sections, templateType);
    
    // 문서 생성
    if (format === 'hwp') {
      return this.generateHwp(sections, layout);
    } else {
      return this.generatePdf(sections, layout);
    }
  }
  
  private getLayoutForTemplate(type: TemplateType) {
    const layouts = {
      'pre-startup': {
        headerTitle: '예비창업패키지 사업계획서',
        sections: ['일반현황', '개요', '문제인식', '실현가능성', '성장전략', '팀구성'],
        budgetFormat: 'two-phase', // 1단계/2단계
        requiresESG: true,
      },
      'early-startup': {
        headerTitle: '초기창업패키지 사업계획서',
        sections: ['일반현황', '개요', '문제인식', '실현가능성', '성장전략', '팀구성'],
        budgetFormat: 'matching-fund', // 매칭펀드
        requiresTrackRecord: true,
        requiresInvestmentPlan: true,
      },
    };
    
    return layouts[type];
  }
}
```

### Phase 3: 검증 및 피드백 엔진 (2일)

#### 3.3.1 템플릿별 검증 규칙

**파일: `backend/src/services/validation.service.ts`**

```typescript
export class ValidationService {
  
  validatePlan(data: BusinessPlanData, templateType: TemplateType): ValidationResult {
    const rules = this.getRulesForTemplate(templateType);
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // 공통 검증
    if (!data.itemName || data.itemName.length < 5) {
      errors.push({ field: 'itemName', message: '아이템명은 5자 이상이어야 합니다' });
    }
    
    // 템플릿별 검증
    if (templateType === 'pre-startup') {
      // 예비창업패키지 검증
      if (!data.deliverables) {
        errors.push({ field: 'deliverables', message: '산출물을 명시해주세요' });
      }
      
      if (data.budget.phase1 > 20000000) {
        errors.push({ field: 'budget.phase1', message: '1단계 예산은 2천만원을 초과할 수 없습니다' });
      }
      
      if (!data.founderCapability) {
        warnings.push({ field: 'team', message: '대표자 역량은 예비창업패키지 핵심 평가 요소입니다' });
      }
    }
    
    if (templateType === 'early-startup') {
      // 초기창업패키지 검증
      const { governmentFund, selfCash, selfInKind, totalBudget } = data.matchingFund;
      
      if (governmentFund > totalBudget * 0.7) {
        errors.push({ field: 'matchingFund', message: '정부지원금은 총 사업비의 70%를 초과할 수 없습니다' });
      }
      
      if (selfCash < totalBudget * 0.1) {
        errors.push({ field: 'matchingFund.selfCash', message: '자기부담금(현금)은 최소 10% 이상이어야 합니다' });
      }
      
      if (!data.trackRecord || data.trackRecord.length === 0) {
        warnings.push({ field: 'trackRecord', message: '시장 검증 성과(트랙 레코드)를 추가하면 평가에 유리합니다' });
      }
      
      if (!data.investmentPlan) {
        warnings.push({ field: 'investmentPlan', message: '투자 유치 계획을 구체적으로 명시하세요' });
      }
    }
    
    return { isValid: errors.length === 0, errors, warnings };
  }
}
```

---

## 4. 데이터베이스 스키마 확장

### 4.1 템플릿 메타데이터 테이블

```sql
CREATE TABLE template_configs (
  id VARCHAR(36) PRIMARY KEY,
  template_type ENUM('pre-startup', 'early-startup', 'bank-loan') NOT NULL,
  version VARCHAR(10) NOT NULL DEFAULT '2025',
  
  -- 구조 정보
  sections JSON NOT NULL,           -- 섹션 구성
  questions JSON NOT NULL,          -- 질문 목록
  validation_rules JSON NOT NULL,   -- 검증 규칙
  
  -- AI 프롬프트
  system_prompt TEXT NOT NULL,
  section_prompts JSON NOT NULL,
  
  -- 자금 계획 구조
  budget_structure JSON NOT NULL,
  
  -- 메타데이터
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 예비창업패키지 2025 설정
INSERT INTO template_configs (id, template_type, version, sections, budget_structure) VALUES (
  'pre-startup-2025',
  'pre-startup',
  '2025',
  '["일반현황", "개요", "문제인식", "실현가능성", "성장전략", "팀구성"]',
  '{"type": "two-phase", "phase1": 20000000, "phase2": 40000000}'
);

-- 초기창업패키지 2025 설정
INSERT INTO template_configs (id, template_type, version, budget_structure) VALUES (
  'early-startup-2025',
  'early-startup',
  '2025',
  '["일반현황", "개요", "문제인식", "실현가능성", "성장전략", "팀구성"]',
  '{"type": "matching-fund", "govRatio": 0.7, "cashRatio": 0.1, "inKindRatio": 0.2}'
);
```

### 4.2 사업계획서 저장 스키마 확장

```sql
ALTER TABLE business_plans ADD COLUMN template_version VARCHAR(10) DEFAULT '2025';
ALTER TABLE business_plans ADD COLUMN budget_allocation JSON;
ALTER TABLE business_plans ADD COLUMN track_record JSON;
ALTER TABLE business_plans ADD COLUMN investment_plan JSON;
ALTER TABLE business_plans ADD COLUMN esg_plan JSON;
```

---

## 5. 구현 일정

| 주차 | 프론트엔드 | 백엔드 | 담당 |
|------|----------|--------|------|
| 1주차 | Phase 1: 데이터 구조 개편 | Phase 1: API 스키마 확장 | FE/BE |
| 1주차 | Phase 2: 마법사 UI 개선 | - | FE |
| 2주차 | Phase 3: 자금 계산기 | Phase 2: 문서 생성 엔진 | FE/BE |
| 2주차 | Phase 4: 개인정보 마스킹 | Phase 3: 검증 엔진 | FE/BE |
| 3주차 | 통합 테스트 및 QA | DB 마이그레이션 | 전체 |

---

## 6. AI 에이전트 프롬프트 예제

### 6.1 프론트엔드 작업 프롬프트

```
@src/types/templateQuestions.ts 파일을 새로 생성해서 예비창업패키지(PRE_STARTUP_QUESTIONS)와 
초기창업패키지(EARLY_STARTUP_QUESTIONS) 질문 구조를 분리해줘.

각 질문에는 다음 속성을 포함해야 해:
- id, label, type, placeholder, required
- guide: 작성 가이드 힌트
- examples: 예시 문구 (선택)
- warnings: 주의사항 (선택)

위 문서의 "AI 작성 및 데이터 매핑 핵심 가이드" 내용을 guide와 placeholder에 반영해줘.
```

### 6.2 백엔드 작업 프롬프트

```
@backend/src/services/ai-prompt.service.ts 파일을 생성해서 템플릿별 AI 시스템 프롬프트를 관리해줘.

예비창업패키지 프롬프트에는:
- 실현 가능성 증명 초점
- 대표자 개인 역량 강조
- 1단계/2단계 자금 구조

초기창업패키지 프롬프트에는:
- 시장성 검증 초점
- 조직적 수행 능력 강조
- 매칭펀드(70/30) 구조
- 투자 유치 계획 필수

를 반영해줘.
```

---

## 7. 체크리스트

### 프론트엔드
- [ ] `templateQuestions.ts` 생성 (예창패/초창패 분리)
- [ ] `GuideBox.tsx` 컴포넌트 생성
- [ ] `useWizardStore.ts` 템플릿 로딩 로직 추가
- [ ] `QuestionForm.tsx` 가이드 박스 렌더링
- [ ] `PreStartupBudgetCalculator.tsx` 생성
- [ ] `EarlyStartupBudgetCalculator.tsx` 생성
- [ ] `dataMasking.ts` 유틸리티 생성
- [ ] 템플릿별 UI 테마 적용

### 백엔드
- [ ] 템플릿별 DTO 정의
- [ ] AI 프롬프트 서비스 구현
- [ ] 문서 생성 엔진 확장
- [ ] 검증 서비스 구현
- [ ] DB 스키마 마이그레이션

### 테스트
- [ ] 예비창업패키지 E2E 테스트
- [ ] 초기창업패키지 E2E 테스트
- [ ] 자금 계산 로직 단위 테스트
- [ ] 개인정보 마스킹 테스트

