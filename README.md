# StartupPlan - AI 기반 사업계획서 작성 플랫폼

초기 창업가를 위한 SaaS형 비즈니스 컨설팅 플랫폼 MVP 프로토타입입니다.

## 🚀 주요 기능

### 1. 프로젝트 생성 및 템플릿 선택
- 예비창업패키지
- 초기창업패키지
- 은행용 대출

### 2. Wizard 기반 단계별 입력
- **Step 1: 아이템 개요** - 사업 아이템, 문제/솔루션, 타겟 고객
- **Step 2: 시장 분석** - 시장 규모, 경쟁 분석, 경쟁 우위
- **Step 3: 실현 방안** - 비즈니스 모델, 수익원, 마케팅 전략
- **Step 4: 재무 계획** - 재무 시뮬레이션 및 실시간 차트
- **Step 5: PMF 진단** - Product-Market Fit 진단 설문 및 리포트

### 3. Auto-save 기능
- 사용자 입력 1초 후 자동 저장
- 우측 상단에 저장 상태 표시

### 4. AI 사업계획서 생성
- Mock 데이터 기반 전문가급 사업계획서 자동 생성
- 섹션별 "다시 쓰기" 기능
- HWP/PDF 내보내기 (시뮬레이션)

### 5. 재무 시뮬레이션
- 실시간 재무 지표 계산 (LTV, CAC, LTV/CAC 비율)
- 손익분기점 분석 차트 (12개월 예측)
- Unit Economics 시각화

### 6. PMF 진단 리포트
- 10개 질문 기반 PMF 점수 산출
- 핵심 리스크 및 개선 제언 제공
- 시각적 진단 결과 표시

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
