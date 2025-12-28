# Makers Round - M.A.K.E.R.S AI 심사위원단

**스타트업 자금유치 라운드를 돕는 AI 심사위원단 솔루션** by Makers World

> 예비창업패키지 합격 / 초기창업패키지 합격 / 정책자금지원 합격
> 사업계획서, 최고의 AI 심사위원단과 함께

---

## 🎯 프로젝트 개요

스타트업 창업자를 위한 AI 기반 사업계획서 평가 및 작성 솔루션입니다.
M.A.K.E.R.S 6대 평가 영역에 기반한 AI 심사위원단이 사업계획서를 사전 평가하고 개선 피드백을 제공합니다.

### 핵심 기능

| 기능 | 설명 |
|------|------|
| **AI 평가 데모** | 6대 평가 영역 기반 사업계획서 사전 평가 체험 |
| **사업계획서 작성 데모** | 템플릿 기반 사업계획서 작성 체험 |
| **프로모션 시스템** | 2단계 할인 (Phase A: 30%, Phase B: 10%) |
| **통합 회원가입** | 요금제 선택 + 사전등록 할인 통합 UX |

---

## 🗺 라우팅 구조

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | LandingPage | 메인 랜딩페이지 |
| `/signup` | SignupPage | 회원가입 (요금제 선택 통합) |
| `/signup?plan=plus` | SignupPage | 특정 요금제로 회원가입 |
| `/team` | TeamPage | 팀 소개 페이지 |
| `/writing-demo` | ProjectCreate | 사업계획서 작성 데모 |
| `/evaluation-demo` | EvaluationDemoPage | AI 평가 데모 |
| `/wizard/:stepId` | WizardStep | 단계별 작성 마법사 |
| `/business-plan` | BusinessPlanViewer | 사업계획서 뷰어 |

---

## 🎬 랜딩페이지 섹션 구성

울트라 프리미엄 디자인의 **C+A 하이브리드 전략** 랜딩페이지

| # | 섹션 | ID | 설명 |
|---|------|-----|------|
| 1 | **Fixed Header** | - | 로고, 네비게이션, BGM 토글, CTA 버튼 |
| 2 | **Primary Hero** | - | 비디오 배경 + 3D 텍스트 플립 애니메이션 |
| 3 | **체험 피드백** | `#problem-section` | 4개 그룹별 자동 스크롤 캐러셀 (21개 후기) |
| 4 | **AI 심사위원단** | `#makers-section` | 통합 섹션 (좌우 2컬럼 + 토글 갤러리 뷰) |
| 5 | **사업분야 맞춤지원** | `#business-category` | 창업 유형별 + 도메인별 컨설팅 |
| 6 | **요금제** | `#pricing-section` | 4단계 시즌 구독 요금제 |
| 7 | **단계별 솔루션** | `#solution-steps` | 4개 페르소나별 문제/목표 매칭 |
| 8 | **기업 소개** | `#testimonials-section` | Makers World 소개 + 영상 |
| 9 | **Final CTA** | - | 무료 시작 유도 |
| 10 | **Footer** | - | 저작권 정보 |

---

## 🎪 M.A.K.E.R.S AI 심사위원단

정부지원사업 평가의 6가지 핵심 영역을 전담하는 AI 심사위원단

| 위원 | 영역 | 한국어 | 색상 | 평가 항목 |
|------|------|--------|------|----------|
| **M** | Marketability | 시장성 | purple | TAM/SAM/SOM, 경쟁사 분석 |
| **A** | Ability | 수행능력 | blue | 팀 구성, 창업자 역량 |
| **K** | Key Technology | 핵심기술 | cyan | 기술 혁신성, 지식재산권 |
| **E** | Economics | 경제성 | emerald | 매출/손익 계획, 자금 조달 |
| **R** | Realization | 실현가능성 | orange | 사업 추진 일정, 리스크 관리 |
| **S** | Social Impact | 사회적가치 | pink | 일자리 창출, ESG |

---

## 🚀 AI 평가 데모

`/evaluation-demo` 경로에서 체험 가능한 4단계 AI 평가 프로세스

### 단계 구성

| 단계 | 컴포넌트 | 설명 |
|------|----------|------|
| 1. 소개 | IntroSection | 6대 평가 영역 안내 + 무료/유료 기능 구분 |
| 2. 입력 | InputSection | 사업 아이디어 입력 폼 |
| 3. 분석 | AnalyzingSection | AI 분석 중 애니메이션 (6개 단계) |
| 4. 결과 | ResultSection | 레이더 차트 + 점수 + 피드백 |

### 무료 데모 체험 범위

- ✓ 6대 영역 점수
- ✓ 합격 예상 확률
- ✓ 핵심 피드백 3개

### 유료 추가 기능 (블러 처리)

- 🔒 영역별 상세 피드백
- 🔒 개선 가이드
- 🔒 AI 기반 재작성 루프

---

## ✍️ 사업계획서 작성 데모

`/writing-demo` 경로에서 시작하는 템플릿 기반 작성 데모

### 지원 템플릿

| 템플릿 | 대상 | 색상 |
|--------|------|------|
| 예비창업패키지 | 예비창업자 | emerald |
| 초기창업패키지 | 3년 이하 법인 | blue |
| 정책자금지원 | 소상공인/중소기업 | purple |

### Wizard 단계 (stepId)

1. `idea` - 아이디어 설명
2. `market` - 시장 분석
3. `team` - 팀 구성
4. `technology` - 핵심 기술
5. `financial` - 재무 계획
6. `schedule` - 추진 일정
7. `social` - 사회적 가치
8. `summary` - 요약 및 다운로드

---

## 💰 요금제 및 프로모션

### 요금제

| 플랜 | 가격 | 핵심 기능 |
|------|------|----------|
| **기본** | 무료 | 체험 기능 |
| **플러스** | ₩399,000 | 6개 영역 점수 리포트, 통합 피드백 |
| **프로** | ₩799,000 | 80점 미달 재작성 루프, 무제한 수정 |
| **프리미엄** | ₩1,499,000 | 전문가 매칭, 1:1 컨설팅 |

### 프로모션 시스템 (2단계)

| Phase | 기간 | 할인율 | 설명 |
|-------|------|--------|------|
| **Phase A** | ~2026-01-03 | 30% | 연말연시 특별 할인 |
| **Phase B** | ~2026-03-01 | 10% | 정부지원사업 접수 전 얼리버드 |

---

## 🧭 네비게이션

### 헤더 (LandingPage)

| 위치 | 구성 |
|------|------|
| 왼쪽 | Makers Round 로고 |
| 중앙 | 6개 섹션 링크 (lg 이상) |
| 오른쪽 | BGM 토글 + CTA 버튼 |

### DemoHeader (데모 페이지 공통)

| 위치 | 구성 |
|------|------|
| 왼쪽 | 뒤로가기 + 로고 + 서브타이틀 |
| 중앙 | 진행 단계 표시 |
| 오른쪽 | BGM 토글 + 회원가입 버튼 |

### 전역 BGM 상태

- `useMusicStore` Zustand 스토어로 전역 관리
- 4개 트랙 자동 순환 재생
- localStorage 동기화 (페이지 이동 간 상태 유지)
- 볼륨 30% 기본 설정

---

## 🛠 기술 스택

### 프레임워크 및 라이브러리

| 분류 | 기술 | 버전 |
|------|------|------|
| **Framework** | React | 19.2.0 |
| **Build Tool** | Vite | 7.2.4 |
| **Language** | TypeScript | 5.9.3 |
| **Styling** | Tailwind CSS | 3.4.1 |
| **State** | Zustand | 5.0.8 |
| **Routing** | React Router DOM | 7.9.6 |
| **Forms** | React Hook Form + Zod | 7.66.1 / 4.1.12 |
| **Charts** | Recharts | 3.4.1 |
| **Icons** | Lucide React | 0.554.0 |
| **HTTP** | Axios | 1.13.2 |

### 상태 관리 (Zustand Stores)

| 스토어 | 용도 |
|--------|------|
| `useAuthStore` | 인증 상태 |
| `useProjectStore` | 프로젝트 정보 |
| `useWizardStore` | 마법사 단계 상태 |
| `useBusinessPlanStore` | 사업계획서 데이터 |
| `useEvaluationStore` | AI 평가 상태 |
| `useMusicStore` | 전역 BGM 상태 |
| `usePreRegistrationStore` | 사전등록 상태 |
| `useFinancialStore` | 재무 시뮬레이션 |
| `usePMFStore` | PMF 진단 |

---

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── ui/                    # 공통 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── wizard/                # 마법사 관련 컴포넌트
│   │   ├── QuestionForm.tsx
│   │   ├── FinancialSimulation.tsx
│   │   └── ...
│   ├── evaluation/            # 평가 관련 컴포넌트
│   │   └── ScoreRadarChart.tsx
│   ├── DemoHeader.tsx         # 데모 공통 헤더
│   ├── PaidPlanSelector.tsx   # 유료 요금제 선택
│   ├── PricingCards.tsx       # 요금제 카드
│   └── Layout.tsx             # 레이아웃 래퍼
├── pages/
│   ├── LandingPage.tsx        # 메인 랜딩페이지
│   ├── SignupPage.tsx         # 회원가입
│   ├── TeamPage.tsx           # 팀 소개
│   ├── ProjectCreate.tsx      # 프로젝트 생성 (작성 데모)
│   ├── WizardStep.tsx         # 단계별 마법사
│   ├── BusinessPlanViewer.tsx # 사업계획서 뷰어
│   └── EvaluationDemo/        # AI 평가 데모
│       ├── index.tsx
│       ├── IntroSection.tsx
│       ├── InputSection.tsx
│       ├── AnalyzingSection.tsx
│       └── ResultSection.tsx
├── stores/                    # Zustand 스토어
├── hooks/                     # 커스텀 훅
│   ├── useAutoSave.ts
│   ├── useCountdown.ts
│   └── useFinancialCalc.ts
├── constants/                 # 상수 정의
│   ├── pricingPlans.ts
│   ├── promotion.ts
│   └── templateThemes.ts
├── utils/                     # 유틸리티 함수
│   ├── pricing.ts
│   ├── evaluationSimulator.ts
│   └── dataMasking.ts
├── types/                     # TypeScript 타입 정의
├── schemas/                   # Zod 스키마
├── services/                  # API 서비스
├── App.tsx                    # 라우팅 설정
├── main.tsx                   # 엔트리포인트
└── index.css                  # 글로벌 스타일

public/assets/
├── juror-logos/               # 로고 및 합성 이미지
├── juror-single/              # 개별 AI 심사위원 이미지
├── soundtrack/                # BGM 트랙 (4개)
├── profiles/                  # 프로필 이미지
└── *.mp4                      # 비디오 파일

docs/                          # 프로젝트 문서
tasks/                         # 개선 작업 목록
```

---

## 🖼️ 미디어 리소스

### 이미지

| 경로 | 용도 |
|------|------|
| `juror-single/j1~j6_*.png` | 6개 AI 심사위원 캐릭터 |
| `juror-logos/all-jurors-*.png` | 심사위원단 합성 이미지 |
| `MakersRoundHeroWallpaper.png` | 히어로 배경 |

### 영상

| 파일 | 위치 |
|------|------|
| `MakersRoundHeroVideo.mp4` | Primary Hero 배경 |
| `AI_스타트업_사업계획서_솔루션_영상_프롬프트.mp4` | AI 심사위원단 섹션 |
| `1_251204_메이커스월드_소개영상.mp4` | 기업 소개 섹션 |

### BGM

| 파일 | 설명 |
|------|------|
| `bgm1_StepForSuccess_A.mp3` | 트랙 1 |
| `bgm2_StepForSuccess_B.mp3` | 트랙 2 |
| `bgm3_BizStartPath_A.mp3` | 트랙 3 |
| `bgm4_BizStartPath_B.mp3` | 트랙 4 |

---

## 🎨 CSS 애니메이션

### 주요 애니메이션

| 이름 | 효과 | 지속 시간 |
|------|------|----------|
| `text-flip-in/out` | 3D 텍스트 플립 | 0.6s |
| `animate-fade-in` | 페이드인 | 0.8s |
| `animate-fade-in-up` | 아래→위 페이드 | 1s |
| `animate-float` | 부유 효과 | 6s (무한) |
| `animate-pulse-glow` | 글로우 펄스 | 3s (무한) |

### 글래스모피즘

- `.glass`: 반투명 + 블러 효과
- `.glass-card`: 카드형 글래스 효과
- `.hover-lift`: 호버 시 상승 효과

---

## 📦 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 프리뷰
npm run preview

# 린트 검사
npm run lint
```

### 환경 설정

| 항목 | 값 |
|------|-----|
| 개발 서버 포트 | 5173 (기본) |
| Node.js | 18+ 권장 |
| 패키지 매니저 | npm |

---

## 📄 라이선스

MIT License

---

**Made with ❤️ by Makers World**

*Last Updated: 2025-12-28*
