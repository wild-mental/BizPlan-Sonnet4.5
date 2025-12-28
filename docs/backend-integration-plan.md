# 백엔드 통합 구현 계획서

> Makers Round 프론트엔드-백엔드 API 연동 명세 (Full Version)

**문서 버전**: 2.0  
**작성일**: 2025-12-28  
**기준 브랜치**: `feat/pre-subscription`

---

## 목차

1. [개요](#1-개요)
2. [인증 API](#2-인증-api)
3. [사전등록 및 프로모션 API](#3-사전등록-및-프로모션-api)
4. [프로젝트 관리 API](#4-프로젝트-관리-api)
5. [사업계획서 작성 Wizard API](#5-사업계획서-작성-wizard-api)
6. [AI 평가 API](#6-ai-평가-api)
7. [사업계획서 생성 API](#7-사업계획서-생성-api)
8. [재무 시뮬레이션 API](#8-재무-시뮬레이션-api)
9. [문서 내보내기 API](#9-문서-내보내기-api)
10. [데이터베이스 스키마](#10-데이터베이스-스키마)
11. [구현 로드맵](#11-구현-로드맵)

---

## 1. 개요

### 1.1 현재 프론트엔드 구현 상태

| 기능 영역 | 구현 상태 | 관련 파일 |
|----------|----------|----------|
| 회원가입/로그인 | ✅ UI 완료 | `SignupPage.tsx`, `useAuthStore.ts` |
| 사전등록 프로모션 | ✅ UI 완료 | `SignupPage.tsx`, `promotion.ts` |
| 프로젝트 생성 | ✅ UI 완료 | `ProjectCreate.tsx`, `useProjectStore.ts` |
| Wizard 작성 | ✅ UI 완료 | `WizardStep.tsx`, `useWizardStore.ts` |
| AI 평가 데모 | ✅ UI 완료 | `EvaluationDemo/*`, `useEvaluationStore.ts` |
| 사업계획서 뷰어 | ✅ UI 완료 | `BusinessPlanViewer.tsx` |
| 재무 시뮬레이션 | ✅ UI 완료 | `FinancialSimulation.tsx`, `useFinancialStore.ts` |
| 문서 다운로드 | 🔶 UI만 | 백엔드 연동 필요 |

### 1.2 API 기본 규격

```yaml
Base URL: /api/v1
Content-Type: application/json
Authentication: Bearer JWT Token
Error Format:
  {
    "success": false,
    "error": {
      "code": "ERROR_CODE",
      "message": "사용자 친화적 메시지",
      "details": { ... }  # 선택적
    }
  }
```

### 1.3 공통 응답 구조

```typescript
// 성공 응답
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    totalPages?: number;
    totalCount?: number;
  };
}

// 에러 응답
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
```

---

## 2. 인증 API

### 2.1 회원가입

**관련 프론트엔드**: `src/pages/SignupPage.tsx`, `src/stores/useAuthStore.ts`

#### POST `/api/v1/auth/signup`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "홍길동",
  "plan": "플러스",
  "phone": "010-1234-5678",
  "businessCategory": "SaaS 온라인 서비스",
  "termsAgreed": true,
  "privacyAgreed": true,
  "marketingConsent": false,
  "promotionCode": "MR2026-XXXXX"
}
```

**Request Validation (Zod Schema 기반):**

```typescript
const signupSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string()
    .min(8, '비밀번호는 최소 8자 이상')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, '영문과 숫자를 포함해야 합니다'),
  name: z.string().min(2, '이름은 최소 2자 이상'),
  plan: z.enum(['기본', '플러스', '프로', '프리미엄']),
  phone: z.string().regex(/^01[016789]-\d{3,4}-\d{4}$/).optional(),
  businessCategory: z.enum([
    'SaaS 온라인 서비스',
    '온오프라인 교육사업',
    '글로벌 유통사업',
    '레저 관광업',
    '뷰티 코스메틱',
    'SNS 콘텐츠 수익화',
    '멀티 채널 마케팅',
    'IT Infra 보안 & AI 안전',
    '기타'
  ]).optional(),
  termsAgreed: z.literal(true),
  privacyAgreed: z.literal(true),
  marketingConsent: z.boolean(),
  promotionCode: z.string().optional()
});
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-user-id",
      "email": "user@example.com",
      "name": "홍길동",
      "plan": "플러스",
      "planStartDate": "2025-12-28T00:00:00Z",
      "planEndDate": "2026-06-30T23:59:59Z",
      "createdAt": "2025-12-28T10:00:00Z"
    },
    "subscription": {
      "planKey": "plus",
      "originalPrice": 399000,
      "discountedPrice": 279300,
      "discountRate": 30,
      "promotionPhase": "A",
      "promotionCode": "MR2026-XXXXX"
    },
    "tokens": {
      "accessToken": "eyJhbG...",
      "refreshToken": "eyJhbG...",
      "expiresIn": 3600
    }
  }
}
```

**Error Responses:**

| 상태 코드 | 에러 코드 | 설명 |
|----------|----------|------|
| 400 | `VALIDATION_ERROR` | 필드 유효성 검증 실패 |
| 409 | `EMAIL_ALREADY_EXISTS` | 이미 가입된 이메일 |
| 410 | `PROMOTION_EXPIRED` | 프로모션 기간 종료 |

---

### 2.2 소셜 로그인

#### POST `/api/v1/auth/social/{provider}`

**Path Parameters:**
- `provider`: `google` | `kakao` | `naver`

**Request Body:**

```json
{
  "accessToken": "social_provider_access_token",
  "plan": "프로",
  "termsAgreed": true,
  "privacyAgreed": true,
  "marketingConsent": false
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-user-id",
      "email": "user@gmail.com",
      "name": "홍길동",
      "provider": "google",
      "plan": "프로"
    },
    "isNewUser": true,
    "tokens": {
      "accessToken": "eyJhbG...",
      "refreshToken": "eyJhbG...",
      "expiresIn": 3600
    }
  }
}
```

---

### 2.3 로그인

#### POST `/api/v1/auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-user-id",
      "email": "user@example.com",
      "name": "홍길동",
      "plan": "플러스",
      "planEndDate": "2026-06-30T23:59:59Z"
    },
    "tokens": {
      "accessToken": "eyJhbG...",
      "refreshToken": "eyJhbG...",
      "expiresIn": 3600
    }
  }
}
```

---

### 2.4 토큰 갱신

#### POST `/api/v1/auth/refresh`

**Request Body:**

```json
{
  "refreshToken": "eyJhbG..."
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG...",
    "expiresIn": 3600
  }
}
```

---

## 3. 사전등록 및 프로모션 API

### 3.1 프로모션 상태 조회

**관련 프론트엔드**: `src/constants/promotion.ts`, `src/utils/pricing.ts`

#### GET `/api/v1/promotions/current`

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "isActive": true,
    "currentPhase": "A",
    "phases": [
      {
        "phase": "A",
        "name": "연말연시 특별 할인",
        "discountRate": 30,
        "startDate": "2024-12-29T00:00:00+09:00",
        "endDate": "2025-01-04T23:59:59+09:00",
        "isCurrentPhase": true
      },
      {
        "phase": "B",
        "name": "얼리버드 특가",
        "discountRate": 10,
        "startDate": "2025-01-05T00:00:00+09:00",
        "endDate": "2025-01-11T23:59:59+09:00",
        "isCurrentPhase": false
      }
    ],
    "countdown": {
      "targetDate": "2025-01-04T23:59:59+09:00",
      "remainingDays": 6,
      "remainingHours": 5,
      "remainingMinutes": 45,
      "remainingSeconds": 28
    },
    "pricing": {
      "plus": {
        "original": 399000,
        "discounted": 279300,
        "savings": 119700
      },
      "pro": {
        "original": 799000,
        "discounted": 559300,
        "savings": 239700
      },
      "premium": {
        "original": 1499000,
        "discounted": 1049300,
        "savings": 449700
      }
    }
  }
}
```

---

### 3.2 사전등록 제출

#### POST `/api/v1/pre-registrations`

**Request Body:**

```json
{
  "name": "홍길동",
  "email": "user@example.com",
  "phone": "010-1234-5678",
  "plan": "pro",
  "businessCategory": "SaaS 온라인 서비스",
  "marketingConsent": true
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "registrationId": "uuid-registration-id",
    "plan": "pro",
    "promotionPhase": "A",
    "discountRate": 30,
    "discountCode": "MR2026-PRO-A1234",
    "originalPrice": 799000,
    "discountedPrice": 559300,
    "savings": 239700,
    "expiresAt": "2025-01-04T23:59:59+09:00",
    "createdAt": "2025-12-28T10:00:00Z"
  }
}
```

---

## 4. 프로젝트 관리 API

### 4.1 프로젝트 생성

**관련 프론트엔드**: `src/pages/ProjectCreate.tsx`, `src/stores/useProjectStore.ts`

#### POST `/api/v1/projects`

**Request Body:**

```json
{
  "name": "LearnAI",
  "templateId": "pre-startup",
  "supportProgram": "2026-1",
  "description": "AI 기반 맞춤형 학습 플랫폼"
}
```

**Template Types:**

| templateId | 이름 | 자금 구조 |
|------------|------|----------|
| `pre-startup` | 예비창업패키지 | 2단계 (1단계 2천만 + 2단계 4천만) |
| `early-startup` | 초기창업패키지 | 매칭펀드 (정부 70% + 자부담 30%) |
| `policy-fund` | 정책자금지원 | 대출형 |

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-project-id",
    "name": "LearnAI",
    "templateId": "pre-startup",
    "templateName": "예비창업패키지",
    "supportProgram": "2026-1",
    "status": "draft",
    "progress": {
      "currentStep": 1,
      "totalSteps": 8,
      "completedSteps": [],
      "percentComplete": 0
    },
    "createdAt": "2025-12-28T10:00:00Z",
    "updatedAt": "2025-12-28T10:00:00Z"
    }
  }
}
```

---

### 4.2 프로젝트 목록 조회

#### GET `/api/v1/projects`

**Query Parameters:**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `page` | number | 페이지 번호 (기본: 1) |
| `limit` | number | 페이지당 항목 수 (기본: 10) |
| `status` | string | `draft`, `in_progress`, `completed` |
| `templateId` | string | 템플릿 필터 |

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-project-1",
      "name": "LearnAI",
      "templateId": "pre-startup",
      "templateName": "예비창업패키지",
      "status": "in_progress",
      "progress": {
        "currentStep": 3,
        "totalSteps": 8,
        "percentComplete": 37.5
      },
      "lastModifiedAt": "2025-12-28T15:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "totalPages": 1,
    "totalCount": 1
  }
}
```

---

### 4.3 프로젝트 상세 조회

#### GET `/api/v1/projects/{projectId}`

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-project-id",
    "name": "LearnAI",
    "templateId": "pre-startup",
    "templateName": "예비창업패키지",
    "supportProgram": "2026-1",
    "status": "in_progress",
    "progress": {
      "currentStep": 3,
      "totalSteps": 8,
      "completedSteps": [1, 2],
      "percentComplete": 25
    },
    "wizardData": {
      "1": {
        "item-name": "LearnAI",
        "item-category": "에듀테크",
        "item-summary": "AI 기반 맞춤형 학습 플랫폼..."
      },
      "2": {
        "market-status": "온라인 교육 시장 현황...",
        "pain-points": "개인화된 학습 경험 부재..."
      }
    },
    "financialData": {
      "customers": 1000,
      "pricePerCustomer": 35000,
      "year1Revenue": 420000000
    },
    "createdAt": "2025-12-28T10:00:00Z",
    "updatedAt": "2025-12-28T15:30:00Z"
  }
}
```

---

## 5. 사업계획서 작성 Wizard API

### 5.1 Wizard 데이터 저장 (자동 저장)

**관련 프론트엔드**: `src/pages/WizardStep.tsx`, `src/stores/useWizardStore.ts`, `src/hooks/useAutoSave.ts`

#### PUT `/api/v1/projects/{projectId}/wizard`

**Request Body:**

```json
{
  "currentStep": 3,
  "stepData": {
    "development-plan": "제품 개발 계획 상세 내용...",
    "budget-phase1": "1단계 자금 사용 계획...",
    "budget-phase2": "2단계 자금 사용 계획...",
    "budgetPhases": [
      {
        "phase": 1,
        "maxAmount": 20000000,
        "items": [
          {
            "id": "phase1-materials",
            "name": "재료비",
            "amount": 3000000,
            "description": "시제품 제작용 부품"
          },
          {
            "id": "phase1-outsourcing",
            "name": "외주용역비",
            "amount": 12000000,
            "description": "UI/UX 디자인 외주"
          },
          {
            "id": "phase1-labor",
            "name": "인건비",
            "amount": 5000000,
            "description": "개발자 인건비"
          }
        ],
        "totalAmount": 20000000
      },
      {
        "phase": 2,
        "maxAmount": 40000000,
        "items": [
          {
            "id": "phase2-marketing",
            "name": "마케팅비",
            "amount": 15000000,
            "description": "런칭 마케팅"
          },
          {
            "id": "phase2-equipment",
            "name": "기자재비",
            "amount": 10000000,
            "description": "서버 인프라"
          },
          {
            "id": "phase2-labor",
            "name": "인건비",
            "amount": 15000000,
            "description": "추가 인력 채용"
          }
        ],
        "totalAmount": 40000000
      }
    ]
  },
  "isStepComplete": false
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "projectId": "uuid-project-id",
    "currentStep": 3,
    "lastSavedAt": "2025-12-28T15:30:00Z",
    "progress": {
      "currentStep": 3,
      "completedSteps": [1, 2],
      "percentComplete": 25
    },
    "validationWarnings": [
      {
        "field": "budget-phase1",
        "type": "ratio",
        "message": "외주용역비 비율이 60%로 높습니다. 심사 시 설명이 필요할 수 있습니다."
      }
    ]
  }
}
```

---

### 5.2 Wizard 전체 데이터 조회

#### GET `/api/v1/projects/{projectId}/wizard`

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "projectId": "uuid-project-id",
    "templateId": "pre-startup",
    "currentStep": 3,
    "steps": [
      {
        "stepId": 1,
        "title": "아이디어 개요",
        "status": "completed",
        "data": {
          "item-name": "LearnAI",
          "item-category": "에듀테크",
          "deliverables": "웹 서비스 1종, 모바일 앱 2종",
          "team-status": "대표자(OOO): 서비스 기획 10년...",
          "item-summary": "AI 기반 맞춤형 학습 플랫폼...",
          "differentiation": "1. 적응형 AI 알고리즘..."
        }
      },
      {
        "stepId": 2,
        "title": "시장 분석",
        "status": "completed",
        "data": {
          "market-status": "온라인 교육 시장 현황...",
          "pain-points": "개인화된 학습 경험 부재...",
          "necessity": "AI 기술 발전으로 인한 기회..."
        }
      },
      {
        "stepId": 3,
        "title": "개발 계획",
        "status": "in_progress",
        "data": {
          "development-plan": "제품 개발 계획...",
          "budgetPhases": [...]
        }
      },
      {
        "stepId": 4,
        "title": "팀 구성",
        "status": "pending",
        "data": null
      },
      {
        "stepId": 5,
        "title": "핵심 기술",
        "status": "pending",
        "data": null
      },
      {
        "stepId": 6,
        "title": "재무 계획",
        "status": "pending",
        "data": null
      },
      {
        "stepId": 7,
        "title": "추진 일정",
        "status": "pending",
        "data": null
      },
      {
        "stepId": 8,
        "title": "사회적 가치",
        "status": "pending",
        "data": null
      }
    ],
    "lastSavedAt": "2025-12-28T15:30:00Z"
  }
}
```

---

### 5.3 자금 집행계획 검증

#### POST `/api/v1/projects/{projectId}/budget/validate`

**Request Body (예비창업패키지):**

```json
{
  "templateType": "pre-startup",
  "budgetPhases": [
    {
      "phase": 1,
      "maxAmount": 20000000,
      "items": [
        { "id": "phase1-materials", "name": "재료비", "amount": 3000000 },
        { "id": "phase1-outsourcing", "name": "외주용역비", "amount": 12000000 },
        { "id": "phase1-labor", "name": "인건비", "amount": 5000000 }
      ]
    },
    {
      "phase": 2,
      "maxAmount": 40000000,
      "items": [
        { "id": "phase2-marketing", "name": "마케팅비", "amount": 15000000 },
        { "id": "phase2-equipment", "name": "기자재비", "amount": 10000000 },
        { "id": "phase2-labor", "name": "인건비", "amount": 15000000 }
      ]
    }
  ]
}
```

**Request Body (초기창업패키지):**

```json
{
  "templateType": "early-startup",
  "matchingFund": {
    "totalBudget": 150000000,
    "governmentFund": 105000000,
    "selfCash": 15000000,
    "selfInKind": 30000000,
    "items": [
      { "id": "labor", "name": "인건비", "amount": 50000000, "source": "government" },
      { "id": "outsourcing", "name": "외주용역비", "amount": 30000000, "source": "government" },
      { "id": "equipment", "name": "기자재비", "amount": 25000000, "source": "government" },
      { "id": "self-development", "name": "자체개발비", "amount": 30000000, "source": "self-in-kind" },
      { "id": "marketing", "name": "마케팅비", "amount": 15000000, "source": "self-cash" }
    ]
  }
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "isValid": true,
    "summary": {
      "totalBudget": 60000000,
      "phase1Total": 20000000,
      "phase2Total": 40000000,
      "phase1Remaining": 0,
      "phase2Remaining": 0
    },
    "validations": [
      {
        "rule": "phase1_max",
        "passed": true,
        "message": "1단계 예산이 한도 내입니다 (20,000,000 / 20,000,000원)"
      },
      {
        "rule": "phase2_max",
        "passed": true,
        "message": "2단계 예산이 한도 내입니다 (40,000,000 / 40,000,000원)"
      },
      {
        "rule": "required_categories",
        "passed": true,
        "message": "필수 항목이 모두 포함되어 있습니다"
      }
    ],
    "warnings": [
      {
        "type": "ratio",
        "field": "phase1-outsourcing",
        "message": "외주용역비 비율이 높습니다 (60%). 심사 시 상세 설명을 권장합니다.",
        "suggestion": "외주 용역 내역서를 별도로 준비하세요."
      }
    ],
    "recommendations": [
      {
        "type": "improvement",
        "message": "1단계에 재료비 비율을 높이면 시제품 개발 의지를 보여줄 수 있습니다."
      }
    ]
  }
}
```

---

## 6. AI 평가 API

### 6.1 평가 요청

**관련 프론트엔드**: `src/pages/EvaluationDemo/*`, `src/stores/useEvaluationStore.ts`

#### POST `/api/v1/evaluations`

**Request Body:**

```json
{
  "projectId": "uuid-project-id",
  "evaluationType": "full",
  "inputData": {
    "businessName": "LearnAI",
    "businessField": "에듀테크",
    "targetMarket": "초중고 학생 및 학부모",
    "problemStatement": "개인화된 학습 경험 부재로 인한 학습 효율 저하",
    "solutionSummary": "AI 기반 적응형 학습 플랫폼으로 개인 맞춤 교육 제공",
    "differentiators": [
      "실시간 학습 패턴 분석",
      "AI 튜터 챗봇",
      "게이미피케이션 요소"
    ],
    "teamExperience": "교육 IT 분야 평균 5년 이상 경력",
    "fundingGoal": 60000000
  },
  "options": {
    "includeDetailedFeedback": true,
    "language": "ko"
  }
}
```

**EvaluationType:**

| 타입 | 설명 | 포함 영역 |
|------|------|----------|
| `demo` | 무료 데모 | 6대 영역 점수, 합격률, 핵심 피드백 3개 |
| `basic` | 기본 평가 | + 영역별 상세 피드백 |
| `full` | 전체 평가 | + 개선 가이드, 재작성 제안 |

**Response (202 Accepted):**

```json
{
  "success": true,
  "data": {
    "evaluationId": "uuid-evaluation-id",
    "status": "processing",
    "estimatedTime": 30,
    "queuePosition": 1,
    "stages": [
      { "id": "market", "name": "시장성 분석", "status": "pending" },
      { "id": "ability", "name": "수행능력 분석", "status": "pending" },
      { "id": "technology", "name": "핵심기술 분석", "status": "pending" },
      { "id": "economics", "name": "경제성 분석", "status": "pending" },
      { "id": "realization", "name": "실현가능성 분석", "status": "pending" },
      { "id": "social", "name": "사회적가치 분석", "status": "pending" }
    ]
  }
}
```

---

### 6.2 평가 진행 상태 조회 (Polling/SSE)

#### GET `/api/v1/evaluations/{evaluationId}/status`

**Response (200 OK - 진행 중):**

```json
{
  "success": true,
  "data": {
    "evaluationId": "uuid-evaluation-id",
    "status": "processing",
    "progress": 50,
    "currentStage": "economics",
    "stages": [
      { "id": "market", "name": "시장성", "status": "completed", "score": 78 },
      { "id": "ability", "name": "수행능력", "status": "completed", "score": 82 },
      { "id": "technology", "name": "핵심기술", "status": "completed", "score": 75 },
      { "id": "economics", "name": "경제성", "status": "processing", "score": null },
      { "id": "realization", "name": "실현가능성", "status": "pending", "score": null },
      { "id": "social", "name": "사회적가치", "status": "pending", "score": null }
    ],
    "estimatedRemaining": 15
  }
}
```

---

### 6.3 평가 결과 조회

#### GET `/api/v1/evaluations/{evaluationId}/result`

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "evaluationId": "uuid-evaluation-id",
    "projectId": "uuid-project-id",
    "completedAt": "2025-12-28T15:35:00Z",
    "summary": {
      "totalScore": 76,
      "grade": "B",
      "passRate": 71,
      "passRateMessage": "현재 점수로는 합격 가능성이 보통입니다. 80점 이상 달성 시 합격 가능성이 높아집니다."
    },
    "scores": {
      "market": {
        "score": 78,
        "label": "시장성",
        "letter": "M",
        "color": "purple",
        "maxScore": 100
      },
      "ability": {
        "score": 82,
        "label": "수행능력",
        "letter": "A",
        "color": "blue",
        "maxScore": 100
      },
      "technology": {
        "score": 75,
        "label": "핵심기술",
        "letter": "K",
        "color": "cyan",
        "maxScore": 100
      },
      "economics": {
        "score": 70,
        "label": "경제성",
        "letter": "E",
        "color": "emerald",
        "maxScore": 100
      },
      "realization": {
        "score": 74,
        "label": "실현가능성",
        "letter": "R",
        "color": "orange",
        "maxScore": 100
      },
      "social": {
        "score": 77,
        "label": "사회적가치",
        "letter": "S",
        "color": "pink",
        "maxScore": 100
      }
    },
    "strengths": [
      {
        "area": "ability",
        "title": "팀 구성 우수",
        "description": "교육 IT 분야의 전문 경력을 갖춘 팀 구성이 돋보입니다.",
        "isBlurred": false
      },
      {
        "area": "market",
        "title": "명확한 타깃 시장",
        "description": "초중고 학생과 학부모라는 명확한 타깃 설정이 좋습니다.",
        "isBlurred": false
      },
      {
        "area": "technology",
        "title": "AI 기술 차별화",
        "description": "적응형 학습 AI는 기존 서비스와의 차별화 포인트입니다.",
        "isBlurred": true
      }
    ],
    "weaknesses": [
      {
        "area": "economics",
        "title": "수익 모델 구체화 필요",
        "description": "B2C 과금 모델의 구체적인 가격 정책이 필요합니다.",
        "isBlurred": false
      },
      {
        "area": "realization",
        "title": "개발 일정 촉박",
        "description": "AI 모델 개발 기간이 다소 낙관적으로 설정되어 있습니다.",
        "isBlurred": true
      }
    ],
    "recommendations": [
      {
        "priority": 1,
        "area": "economics",
        "title": "수익 모델 보완",
        "description": "B2B(학원/학교) 연계 모델을 추가하면 수익 안정성이 높아집니다.",
        "isBlurred": true
      },
      {
        "priority": 2,
        "area": "realization",
        "title": "MVP 범위 조정",
        "description": "핵심 기능 3개로 MVP 범위를 좁히고 단계적 확장을 권장합니다.",
        "isBlurred": true
      },
      {
        "priority": 3,
        "area": "social",
        "title": "ESG 요소 강화",
        "description": "교육 격차 해소 기여도를 수치화하면 사회적 가치 점수가 상승합니다.",
        "isBlurred": true
      }
    ],
    "accessLevel": "demo",
    "upgradePrompt": {
      "message": "상세 피드백과 개선 전략을 확인하려면 유료 플랜을 이용하세요.",
      "availablePlans": ["plus", "pro", "premium"]
    }
  }
}
```

---

## 7. 사업계획서 생성 API

### 7.1 사업계획서 생성 요청

**관련 프론트엔드**: `src/pages/BusinessPlanViewer.tsx`, `src/stores/useBusinessPlanStore.ts`

#### POST `/api/v1/projects/{projectId}/business-plan/generate`

**Request Body:**

```json
{
  "outputFormat": "markdown",
  "options": {
    "maskPersonalInfo": true,
    "includeFinancialTables": true,
    "includeEsgSection": true,
    "language": "ko"
  },
  "regenerateSections": []
}
```

**Response (202 Accepted):**

```json
{
  "success": true,
  "data": {
    "generationId": "uuid-generation-id",
    "status": "processing",
    "estimatedTime": 60,
    "sections": [
      { "id": "overview", "title": "1. 일반현황 및 개요", "status": "pending" },
      { "id": "problem", "title": "2. 문제인식", "status": "pending" },
      { "id": "solution", "title": "3. 해결방안", "status": "pending" },
      { "id": "market", "title": "4. 시장분석", "status": "pending" },
      { "id": "team", "title": "5. 팀 구성", "status": "pending" },
      { "id": "financial", "title": "6. 재무계획", "status": "pending" },
      { "id": "schedule", "title": "7. 추진일정", "status": "pending" },
      { "id": "social", "title": "8. 사회적 가치", "status": "pending" }
    ]
  }
}
```

---

### 7.2 사업계획서 조회

#### GET `/api/v1/projects/{projectId}/business-plan`

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-business-plan-id",
    "projectId": "uuid-project-id",
    "templateId": "pre-startup",
    "version": 3,
    "status": "generated",
    "sections": [
      {
        "id": "overview",
        "title": "1. 일반현황 및 개요",
        "order": 1,
        "content": "## 1.1 아이템명\n\n**LearnAI** (범주: 에듀테크)\n\n## 1.2 주요 산출물\n\n| 구분 | 산출물 | 비고 |\n|------|--------|------|\n| 웹 | 학습 플랫폼 | React 기반 |\n| 앱 | iOS/Android 앱 | React Native |\n\n## 1.3 대표자 현황\n\n- **대표자**: OOO\n- **주요 경력**: 서비스 기획 10년, OO기업 PM 출신\n\n...",
        "wordCount": 450,
        "lastEditedAt": "2025-12-28T16:00:00Z"
      },
      {
        "id": "problem",
        "title": "2. 문제인식",
        "order": 2,
        "content": "## 2.1 시장 현황\n\n글로벌 에듀테크 시장은 2024년 기준 3,500억 달러 규모로...\n\n## 2.2 문제점 (Pain Point)\n\n1. **개인화 부재**: 획일적인 커리큘럼...\n2. **낮은 학습 지속률**: 평균 완주율 15%...\n\n...",
        "wordCount": 520,
        "lastEditedAt": "2025-12-28T16:00:00Z"
      }
    ],
    "metadata": {
      "totalWordCount": 8500,
      "estimatedPages": 25,
      "generatedAt": "2025-12-28T16:00:00Z",
      "aiModel": "gemini-1.5-pro"
    },
    "financialSummary": {
      "totalBudget": 60000000,
      "phase1": 20000000,
      "phase2": 40000000,
      "year1Revenue": 420000000,
      "breakEvenMonth": 18
    }
  }
}
```

---

### 7.3 섹션 재생성

#### POST `/api/v1/projects/{projectId}/business-plan/sections/{sectionId}/regenerate`

**Request Body:**

```json
{
  "instruction": "시장 규모 데이터를 최신 자료로 업데이트해주세요",
  "preserveFormatting": true
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "sectionId": "market",
    "previousVersion": 2,
    "newVersion": 3,
    "content": "## 4.1 시장 규모\n\n2025년 기준 글로벌 에듀테크 시장은 4,200억 달러 규모로...",
    "changes": {
      "addedLines": 12,
      "removedLines": 8,
      "modifiedLines": 5
    },
    "generatedAt": "2025-12-28T16:30:00Z"
  }
}
```

---

## 8. 재무 시뮬레이션 API

### 8.1 재무 시뮬레이션 계산

**관련 프론트엔드**: `src/components/wizard/FinancialSimulation.tsx`, `src/stores/useFinancialStore.ts`

#### POST `/api/v1/projects/{projectId}/financial/simulate`

**Request Body:**

```json
{
  "inputs": {
    "customers": {
      "year1": 1000,
      "year2": 3000,
      "year3": 8000,
      "growthRate": 200
    },
    "pricing": {
      "pricePerCustomer": 35000,
      "subscriptionModel": "monthly",
      "churnRate": 5
    },
    "costs": {
      "fixedCosts": {
        "labor": 180000000,
        "rent": 24000000,
        "utilities": 6000000
      },
      "variableCosts": {
        "serverPerCustomer": 500,
        "supportPerCustomer": 1000
      },
      "marketing": {
        "year1": 30000000,
        "year2": 50000000,
        "year3": 80000000
      }
    },
    "funding": {
      "governmentGrant": 60000000,
      "investmentRound": "pre-seed",
      "investmentAmount": 0
    }
  }
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "summary": {
      "breakEvenMonth": 18,
      "cumulativeProfitYear3": 450000000,
      "irr": 35.2,
      "paybackPeriod": "1년 6개월"
    },
    "yearlyProjections": [
      {
        "year": 1,
        "revenue": 420000000,
        "costs": 450000000,
        "grossProfit": 420000000,
        "operatingProfit": -30000000,
        "netProfit": -30000000,
        "customers": 1000,
        "arpu": 35000
      },
      {
        "year": 2,
        "revenue": 1260000000,
        "costs": 720000000,
        "grossProfit": 1110000000,
        "operatingProfit": 390000000,
        "netProfit": 312000000,
        "customers": 3000,
        "arpu": 35000
      },
      {
        "year": 3,
        "revenue": 3360000000,
        "costs": 1200000000,
        "grossProfit": 2960000000,
        "operatingProfit": 1760000000,
        "netProfit": 1408000000,
        "customers": 8000,
        "arpu": 35000
      }
    ],
    "monthlyProjections": [
      { "month": 1, "revenue": 35000000, "costs": 37500000, "profit": -2500000, "cumulative": -2500000 },
      { "month": 2, "revenue": 36750000, "costs": 37500000, "profit": -750000, "cumulative": -3250000 }
    ],
    "charts": {
      "revenueGrowth": [
        { "label": "1년차", "value": 420000000 },
        { "label": "2년차", "value": 1260000000 },
        { "label": "3년차", "value": 3360000000 }
      ],
      "profitMargin": [
        { "label": "1년차", "value": -7.1 },
        { "label": "2년차", "value": 24.8 },
        { "label": "3년차", "value": 41.9 }
      ]
    },
    "risks": [
      {
        "type": "high_burn_rate",
        "severity": "medium",
        "message": "1년차 월평균 현금 소진율이 높습니다. 런웨이 확보에 유의하세요.",
        "suggestion": "정부지원금 외 추가 자금 확보를 고려하세요."
      }
    ]
  }
}
```

---

## 9. 문서 내보내기 API

### 9.1 문서 내보내기 요청

#### POST `/api/v1/projects/{projectId}/export`

**Request Body:**

```json
{
  "format": "hwp",
  "templateType": "2026_예비창업패키지",
  "options": {
    "maskPersonalInfo": true,
    "includeAppendix": true,
    "includeCoverPage": true,
    "pageNumbering": true,
    "watermark": false
  },
  "sections": ["all"]
}
```

**Format Options:**

| 형식 | Content-Type | 파일 확장자 |
|------|-------------|------------|
| `hwp` | `application/vnd.hancom.hwp` | `.hwp` |
| `pdf` | `application/pdf` | `.pdf` |
| `docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | `.docx` |

**Response (202 Accepted):**

```json
{
  "success": true,
  "data": {
    "exportId": "uuid-export-id",
    "status": "processing",
    "format": "hwp",
    "estimatedSize": "2.5MB",
    "estimatedTime": 30
  }
}
```

---

### 9.2 내보내기 상태 확인

#### GET `/api/v1/exports/{exportId}/status`

**Response (200 OK - 완료):**

```json
{
  "success": true,
  "data": {
    "exportId": "uuid-export-id",
    "status": "completed",
    "format": "hwp",
    "fileName": "사업계획서_LearnAI_20251228.hwp",
    "fileSize": 2621440,
    "downloadUrl": "/api/v1/exports/uuid-export-id/download",
    "expiresAt": "2025-12-29T16:00:00Z",
    "completedAt": "2025-12-28T16:01:00Z"
  }
}
```

---

### 9.3 파일 다운로드

#### GET `/api/v1/exports/{exportId}/download`

**Response Headers:**

```
Content-Type: application/vnd.hancom.hwp
Content-Disposition: attachment; filename="사업계획서_LearnAI_20251228.hwp"
Content-Length: 2621440
```

**Response Body:** Binary file content

---

## 10. 데이터베이스 스키마

### 10.1 사용자 및 인증

```sql
-- 사용자 테이블
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    provider ENUM('local', 'google', 'kakao', 'naver') DEFAULT 'local',
    provider_id VARCHAR(255),
    business_category VARCHAR(100),
    marketing_consent BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_provider (provider, provider_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 구독 테이블
CREATE TABLE subscriptions (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    plan ENUM('기본', '플러스', '프로', '프리미엄') NOT NULL,
    plan_key ENUM('basic', 'plus', 'pro', 'premium') NOT NULL,
    original_price DECIMAL(10,0) NOT NULL,
    discounted_price DECIMAL(10,0),
    discount_rate INT,
    promotion_phase ENUM('A', 'B', 'NONE'),
    promotion_code VARCHAR(50),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 사전등록 테이블
CREATE TABLE pre_registrations (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    plan_key ENUM('plus', 'pro', 'premium') NOT NULL,
    business_category VARCHAR(100),
    promotion_phase ENUM('A', 'B') NOT NULL,
    discount_code VARCHAR(50) NOT NULL UNIQUE,
    marketing_consent BOOLEAN DEFAULT false,
    converted_to_user BOOLEAN DEFAULT false,
    converted_at TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_discount_code (discount_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 10.2 프로젝트 및 사업계획서

```sql
-- 프로젝트 테이블
CREATE TABLE projects (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    name VARCHAR(200) NOT NULL,
    template_id VARCHAR(50) NOT NULL,
    support_program VARCHAR(50),
    description TEXT,
    status ENUM('draft', 'in_progress', 'completed', 'archived') DEFAULT 'draft',
    current_step INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES template_definitions(id),
    INDEX idx_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Wizard 데이터 테이블
CREATE TABLE wizard_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    step_number INT NOT NULL,
    step_data JSON NOT NULL,
    is_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY uk_project_step (project_id, step_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 사업계획서 테이블
CREATE TABLE business_plans (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    version INT DEFAULT 1,
    status ENUM('draft', 'generating', 'generated', 'exported') DEFAULT 'draft',
    sections JSON NOT NULL,
    metadata JSON,
    financial_summary JSON,
    generated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project_version (project_id, version DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 재무 데이터 테이블
CREATE TABLE financial_data (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    inputs JSON NOT NULL,
    projections JSON,
    simulation_result JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 10.3 AI 평가

```sql
-- AI 평가 테이블
CREATE TABLE evaluations (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    evaluation_type ENUM('demo', 'basic', 'full') NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    input_data JSON NOT NULL,
    result JSON,
    total_score INT,
    pass_rate INT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_project_created (project_id, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 평가 영역별 점수 테이블
CREATE TABLE evaluation_scores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    evaluation_id CHAR(36) NOT NULL,
    area_code ENUM('market', 'ability', 'technology', 'economics', 'realization', 'social') NOT NULL,
    score INT NOT NULL,
    feedback TEXT,
    strengths JSON,
    weaknesses JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE,
    UNIQUE KEY uk_eval_area (evaluation_id, area_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 10.4 문서 내보내기

```sql
-- 내보내기 작업 테이블
CREATE TABLE exports (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    business_plan_id CHAR(36),
    format ENUM('hwp', 'pdf', 'docx') NOT NULL,
    template_type VARCHAR(100),
    options JSON,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size BIGINT,
    error_message TEXT,
    expires_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (business_plan_id) REFERENCES business_plans(id) ON DELETE SET NULL,
    INDEX idx_user_created (user_id, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 11. 구현 로드맵

### 11.1 Phase 1: 핵심 인증 및 프로젝트 (2주)

| 순서 | 기능 | API | 예상 일정 |
|------|------|-----|----------|
| 1-1 | 회원가입 | `POST /auth/signup` | 3일 |
| 1-2 | 로그인/로그아웃 | `POST /auth/login`, `/logout` | 2일 |
| 1-3 | 소셜 로그인 | `POST /auth/social/{provider}` | 3일 |
| 1-4 | 프로젝트 CRUD | `GET/POST/PUT/DELETE /projects` | 3일 |
| 1-5 | 프로모션 조회 | `GET /promotions/current` | 1일 |

**담당**: 백엔드 1인  
**의존성**: DB 스키마 설계 완료

### 11.2 Phase 2: Wizard 및 자동저장 (2주)

| 순서 | 기능 | API | 예상 일정 |
|------|------|-----|----------|
| 2-1 | Wizard 저장 | `PUT /projects/{id}/wizard` | 3일 |
| 2-2 | Wizard 조회 | `GET /projects/{id}/wizard` | 2일 |
| 2-3 | 자금 검증 | `POST /projects/{id}/budget/validate` | 3일 |
| 2-4 | 템플릿 데이터 | `GET /templates/{id}` | 2일 |

**담당**: 백엔드 1인  
**의존성**: Phase 1 완료

### 11.3 Phase 3: AI 통합 (3주)

| 순서 | 기능 | API | 예상 일정 |
|------|------|-----|----------|
| 3-1 | AI 평가 요청 | `POST /evaluations` | 5일 |
| 3-2 | 평가 상태 조회 | `GET /evaluations/{id}/status` | 2일 |
| 3-3 | 평가 결과 조회 | `GET /evaluations/{id}/result` | 3일 |
| 3-4 | 사업계획서 생성 | `POST /projects/{id}/business-plan/generate` | 5일 |
| 3-5 | 섹션 재생성 | `POST /.../sections/{id}/regenerate` | 3일 |

**담당**: 백엔드 1인 + AI 엔지니어 1인  
**의존성**: Gemini API 연동, 프롬프트 엔지니어링

### 11.4 Phase 4: 문서 내보내기 (2주)

| 순서 | 기능 | API | 예상 일정 |
|------|------|-----|----------|
| 4-1 | 내보내기 요청 | `POST /projects/{id}/export` | 5일 |
| 4-2 | 상태 확인 | `GET /exports/{id}/status` | 2일 |
| 4-3 | 파일 다운로드 | `GET /exports/{id}/download` | 3일 |

**담당**: 백엔드 1인  
**의존성**: HWP 템플릿 개발, PDF 생성 라이브러리

### 11.5 전체 일정 요약

```
Week 1-2:  Phase 1 - 인증 및 프로젝트 기본
Week 3-4:  Phase 2 - Wizard 및 자동저장
Week 5-7:  Phase 3 - AI 평가 및 사업계획서 생성
Week 8-9:  Phase 4 - 문서 내보내기
Week 10:   통합 테스트 및 버그 수정
```

**총 예상 기간**: 10주 (약 2.5개월)

---

## 부록: 프론트엔드 API 클라이언트

### A.1 Axios 인스턴스 설정

```typescript
// src/services/apiClient.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: JWT 토큰 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 토큰 갱신 및 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && originalRequest) {
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const response = await axios.post('/api/v1/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        useAuthStore.getState().setTokens(accessToken, newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return apiClient(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = '/signup';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### A.2 API 서비스 모듈

```typescript
// src/services/authApi.ts
import apiClient from './apiClient';

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  plan: string;
  phone?: string;
  businessCategory?: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingConsent: boolean;
  promotionCode?: string;
}

export const authApi = {
  signup: (data: SignupRequest) => 
    apiClient.post('/auth/signup', data),
  
  login: (email: string, password: string) => 
    apiClient.post('/auth/login', { email, password }),
  
  socialLogin: (provider: string, accessToken: string, plan: string) =>
    apiClient.post(`/auth/social/${provider}`, { accessToken, plan }),
  
  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),
  
  logout: () =>
    apiClient.post('/auth/logout'),
};
```

```typescript
// src/services/projectApi.ts
import apiClient from './apiClient';

export const projectApi = {
  create: (data: { name: string; templateId: string; supportProgram?: string }) =>
    apiClient.post('/projects', data),
  
  getAll: (params?: { page?: number; status?: string }) =>
    apiClient.get('/projects', { params }),
  
  getById: (projectId: string) =>
    apiClient.get(`/projects/${projectId}`),
  
  update: (projectId: string, data: Partial<{ name: string; status: string }>) =>
    apiClient.put(`/projects/${projectId}`, data),
  
  delete: (projectId: string) =>
    apiClient.delete(`/projects/${projectId}`),
  
  saveWizard: (projectId: string, stepData: object) =>
    apiClient.put(`/projects/${projectId}/wizard`, stepData),
  
  getWizard: (projectId: string) =>
    apiClient.get(`/projects/${projectId}/wizard`),
  
  validateBudget: (projectId: string, budgetData: object) =>
    apiClient.post(`/projects/${projectId}/budget/validate`, budgetData),
};
```

```typescript
// src/services/evaluationApi.ts
import apiClient from './apiClient';

export const evaluationApi = {
  create: (projectId: string, inputData: object) =>
    apiClient.post('/evaluations', { projectId, inputData }),
  
  getStatus: (evaluationId: string) =>
    apiClient.get(`/evaluations/${evaluationId}/status`),
  
  getResult: (evaluationId: string) =>
    apiClient.get(`/evaluations/${evaluationId}/result`),
};
```

---

*문서 작성일: 2025-12-28*  
*작성자: AI Assistant*  
*검토 필요: 백엔드 개발팀*

