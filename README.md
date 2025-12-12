# Makers World - AI 기반 비즈니스 빌딩 솔루션

**초보 창업자 생존율 제고를 위한 AI Multi-Agent 사업계획서 자동화 플랫폼**

## 🎯 랜딩페이지

고객 전환율 극대화를 위한 **C+A 하이브리드 전략** (결과 지향형 + 불안 해소형) 랜딩페이지가 포함되어 있습니다.

### 랜딩페이지 섹션 구성

| 섹션 | 목적 | 핵심 메시지 |
|------|------|------------|
| **Hero** | 첫인상 3초 | "정부지원금 합격 사업계획서, 10분이면 충분합니다" |
| **Problem** | 공감 유도 | "창업의 42%가 실패하는 이유" |
| **Solution** | 3대 기능 | 자동화, 시장분석, AI 컨설턴트 |
| **Personas** | 타겟 맞춤 | 5가지 고객 유형별 솔루션 |
| **Value Prop** | 핵심 가치 | 정부 양식 호환, PMF 진단 |
| **Before/After** | 효율성 비교 | 2주→10분, 500만원→무료 |
| **SEO Keywords** | 검색 최적화 | 예비창업패키지, 정부지원금 등 |
| **Final CTA** | 전환 유도 | 긴급성 + 무료 강조 |

### 타겟 페르소나

1. **김예비** - 예비창업패키지 지원자 (Core Target)
2. **최민혁** - 재창업가 / CTO 출신
3. **박사장** - 소상공인 (은행 대출)
4. **한서윤** - 시드투자 유치 준비 CEO
5. **이지은** - 대학생 창업동아리 리더

### 라우팅 구조

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | LandingPage | 고객 유입 Hook |
| `/app` | ProjectCreate | 프로젝트 생성 |
| `/wizard/:stepId` | WizardStep | 단계별 입력 |
| `/business-plan` | BusinessPlanViewer | 사업계획서 뷰어 |

📋 [랜딩페이지 체크리스트](./docs/landing-page-checklist.md)

## 🚀 핵심 기능

### 1. 사업계획서 작성 자동화
- 정부지원사업 합격 사업계획서 **10분 완성**
- HWP 포맷팅 자동화, 심사위원 관점 초안 제공
- 예비창업패키지 / 초기창업패키지 / 은행대출 템플릿

### 2. Data-Driven 시장 분석
- TAM/SAM/SOM 시장 규모 자동 산출
- 경쟁사 현황, 트렌드 데이터 실시간 분석
- 리포트 자동 생성

### 3. AI 비즈니스 컨설턴트 (Virtual Mentor)
- 수천 건 컨설팅 데이터 학습 특화 에이전트
- BM 진단 및 피보팅 전략 제시
- PMF 진단 리포트 + MVP 사업화 로드맵

## 🛠 기술 스택

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand (with persist middleware)
- **Routing:** React Router DOM v6
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Markdown:** React Markdown
- **Icons:** Lucide React
- **Utils:** clsx, tailwind-merge

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드된 결과 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── ui/                    # 공통 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Badge.tsx
│   │   ├── Progress.tsx
│   │   └── Spinner.tsx
│   ├── wizard/                # Wizard 전용 컴포넌트
│   │   ├── QuestionForm.tsx
│   │   ├── FinancialSimulation.tsx
│   │   └── PMFSurvey.tsx
│   ├── Layout.tsx            # 메인 레이아웃
│   └── SaveIndicator.tsx     # 저장 상태 표시
├── pages/
│   ├── ProjectCreate.tsx     # 프로젝트 생성 페이지
│   ├── WizardStep.tsx        # Wizard 단계별 페이지
│   └── BusinessPlanViewer.tsx # 사업계획서 뷰어
├── stores/
│   ├── useProjectStore.ts    # 프로젝트 상태 관리
│   ├── useWizardStore.ts     # Wizard 상태 관리
│   ├── useFinancialStore.ts  # 재무 상태 관리
│   └── usePMFStore.ts        # PMF 진단 상태 관리
├── hooks/
│   ├── useAutoSave.ts        # Auto-save 커스텀 훅
│   └── useFinancialCalc.ts   # 재무 계산 커스텀 훅
├── types/
│   ├── index.ts              # 타입 정의
│   └── mockData.ts           # Mock 데이터
├── lib/
│   └── utils.ts              # 유틸리티 함수
├── App.tsx                   # 라우팅 설정
├── main.tsx                  # 앱 진입점
└── index.css                 # 전역 스타일
```

## 🎨 디자인 시스템

- **Color Palette:**
  - Primary: Blue (#3b82f6 계열)
  - Gray: Neutral tones
  - Success: Green
  - Warning: Yellow
  - Danger: Red

- **Typography:** Inter 폰트 패밀리

- **Components:** Consistent design language with hover states, transitions, and focus states

## 📊 데이터 흐름

1. **입력 데이터:** 사용자가 Wizard에서 각 질문에 답변
2. **자동 저장:** Zustand store에 실시간 저장 (LocalStorage persist)
3. **계산 로직:** 재무 데이터는 입력 시 자동으로 메트릭 계산
4. **AI 생성:** Mock 데이터 기반으로 사업계획서 생성 시뮬레이션
5. **내보내기:** 생성된 계획서를 HWP/PDF로 내보내기 (시뮬레이션)

## 🔑 핵심 UX 특징

1. **직관적인 네비게이션:** 좌측 사이드바에서 현재 진행 상황 확인
2. **실시간 피드백:** 입력 즉시 자동 저장 및 검증
3. **시각적 피드백:** 진행률 바, 완료 체크마크, 색상 코딩
4. **부드러운 전환:** 페이지 전환 및 상태 변화 시 애니메이션
5. **반응형 디자인:** 다양한 화면 크기 지원

## 📝 주요 흐름

1. **시작:** 프로젝트 이름 입력 및 템플릿 선택
2. **입력:** 5단계 Wizard에서 각 질문에 답변
3. **재무 분석:** 실시간 차트로 재무 건전성 확인
4. **PMF 진단:** 설문 완료 후 진단 리포트 확인
5. **생성:** AI 사업계획서 자동 생성
6. **내보내기:** HWP/PDF 형식으로 다운로드

## 🚧 향후 개선 사항

- 실제 AI API 연동 (OpenAI, Anthropic 등)
- 백엔드 연동 (사용자 인증, 프로젝트 관리)
- 협업 기능 (팀원 초대, 댓글 등)
- 버전 히스토리 및 비교
- 템플릿 커스터마이징
- 다국어 지원

## 📄 라이선스

MIT License

---

**Made with ❤️ for early-stage entrepreneurs**
