# 🎓 랜딩페이지 세부사항 완전 보강 교육 가이드

> **교육 대상**: React/TypeScript 기초 지식을 갖춘 프론트엔드 개발자  
> **소요 시간**: 약 2시간 30분  
> **난이도**: ⭐⭐⭐ 중급  
> **최종 목표**: 기존 랜딩페이지를 울트라 프리미엄 수준으로 고도화하는 전체 프로세스 습득

---

## 📚 목차

1. [교육 개요 및 학습 목표](#1-교육-개요-및-학습-목표) (10분)
2. [사전 준비 및 환경 설정](#2-사전-준비-및-환경-설정) (15분)
3. [Module 1: Primary Hero 섹션 추가](#3-module-1-primary-hero-섹션-추가) (25분)
4. [Module 2: 고정 헤더 네비게이션 바](#4-module-2-고정-헤더-네비게이션-바) (20분)
5. [Module 3: 섹션 순서 재배치](#5-module-3-섹션-순서-재배치) (10분)
6. [Module 4: 카테고리 지원 섹션](#6-module-4-카테고리-지원-섹션) (20분)
7. [Module 5: 페르소나 기반 솔루션 섹션](#7-module-5-페르소나-기반-솔루션-섹션) (20분)
8. [Module 6: 드래그 캐러셀 리뷰 섹션](#8-module-6-드래그-캐러셀-리뷰-섹션) (25분)
9. [멀티미디어 리소스 보강 가이드](#9-멀티미디어-리소스-보강-가이드) (15분)
10. [심화 학습 및 추가 과제](#10-심화-학습-및-추가-과제) (15분)
11. [Q&A 및 토론](#11-qa-및-토론) (15분)

---

## 1. 교육 개요 및 학습 목표

### 1.1 이 교육을 통해 배우는 것

✅ **기술적 스킬**
- React 컴포넌트 구조화 및 섹션 분리
- Tailwind CSS를 활용한 글래스모피즘 UI 구현
- useState/useEffect를 활용한 인터랙티브 UI
- 마우스 드래그 이벤트 핸들링
- 스무스 스크롤링 구현

✅ **디자인 스킬**
- 프리미엄 랜딩페이지 구성 원칙
- 그라데이션 및 색상 시스템 활용
- 반응형 레이아웃 설계
- 마이크로 인터랙션 적용

✅ **비즈니스 스킬**
- 페르소나 기반 콘텐츠 설계
- 고객 여정에 맞는 섹션 배치
- 전환율 최적화를 위한 CTA 설계

### 1.2 학습 결과물

이 교육을 완료하면 다음과 같은 랜딩페이지를 만들 수 있습니다:

```
┌─────────────────────────────────────────┐
│  🔒 Fixed Header Navigation Bar         │
├─────────────────────────────────────────┤
│                                         │
│  🚀 Primary Hero Section                │
│     "10분이면 충분합니다"               │
│                                         │
├─────────────────────────────────────────┤
│  📢 드래그 캐러셀 리뷰 섹션             │
│     ← [카드1] [카드2] [카드3] →         │
├─────────────────────────────────────────┤
│  🎯 M.A.K.E.R.S Hero Section            │
├─────────────────────────────────────────┤
│  📊 M.A.K.E.R.S Committee Cards         │
├─────────────────────────────────────────┤
│  💼 사업분야 맞춤지원 (4 카드)          │
├─────────────────────────────────────────┤
│  💰 요금제 (4 플랜)                     │
├─────────────────────────────────────────┤
│  👥 단계별 솔루션 (4 페르소나)          │
├─────────────────────────────────────────┤
│  ⭐ 고객 후기                           │
├─────────────────────────────────────────┤
│  🏁 Final CTA + Footer                  │
└─────────────────────────────────────────┘
```

---

## 2. 사전 준비 및 환경 설정

### 2.1 필수 사전 지식

| 항목 | 수준 | 확인 체크리스트 |
|------|------|----------------|
| HTML/CSS | 중급 | □ Flexbox, Grid 사용 가능 |
| JavaScript | 중급 | □ ES6+ 문법 이해 |
| React | 초중급 | □ 컴포넌트, Props, State 이해 |
| TypeScript | 초급 | □ 기본 타입 정의 가능 |
| Tailwind CSS | 초급 | □ 기본 유틸리티 클래스 사용 가능 |

### 2.2 개발 환경 설정

```bash
# 1. 프로젝트 클론 또는 생성
git clone [repository-url]
cd BizPlan-Sonnet4.5

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev -- --port 5174

# 4. 브라우저에서 확인
# http://localhost:5174
```

### 2.3 권장 VS Code 확장

```
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Prettier
- ESLint
```

### 2.4 프로젝트 구조 파악

```
📁 src/
├── 📄 pages/LandingPage.tsx  ← 주요 작업 파일
├── 📄 index.css              ← 글로벌 스타일
├── 📁 components/ui/         ← 공통 컴포넌트
└── 📄 App.tsx                ← 라우팅
```

#### 💡 실습 과제 2-1
> 프로젝트를 실행하고 현재 랜딩페이지 구조를 파악하세요.
> LandingPage.tsx 파일을 열고 몇 개의 섹션이 있는지 세어보세요.

---

## 3. Module 1: Primary Hero 섹션 추가

> ⏱ 소요 시간: 25분

### 3.1 학습 목표

- 기존 히어로 섹션 위에 새로운 히어로 섹션 추가
- 그라데이션 배경 및 애니메이션 효과 적용
- 복수의 CTA 버튼 구현

### 3.2 이론: 히어로 섹션의 역할

히어로 섹션은 랜딩페이지에서 가장 중요한 영역입니다.

```
┌──────────────────────────────────────┐
│  📍 Attention (주의 집중)            │
│  • 방문자의 시선을 첫 3초에 사로잡기 │
│                                      │
│  📍 Interest (관심 유발)             │
│  • 핵심 가치 제안 전달               │
│                                      │
│  📍 Desire (욕구 자극)               │
│  • 문제 해결 가능성 암시             │
│                                      │
│  📍 Action (행동 유도)               │
│  • CTA 버튼으로 다음 단계 유도       │
└──────────────────────────────────────┘
```

### 3.3 실습: Primary Hero 섹션 코드

#### Step 1: 섹션 기본 구조

```tsx
{/* ===== PRIMARY HERO SECTION ===== */}
<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950">
  {/* 배경 효과 */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* 그라데이션 오브 */}
    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full blur-[120px] animate-float" />
    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full blur-[100px] animate-float-slow" />
    
    {/* 그리드 패턴 */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
  </div>

  {/* 메인 콘텐츠 */}
  <div className="container mx-auto px-4 py-20 relative z-10">
    {/* ... */}
  </div>
</section>
```

#### Step 2: 헤드라인 구성

```tsx
{/* Main Headline */}
<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight animate-fade-in-up">
  정부지원금 합격 사업계획서,
  <br />
  <span className="relative">
    <span className="text-gradient bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
      10분이면 충분합니다
    </span>
    {/* 밑줄 SVG */}
    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12">
      <path d="M2 8C50 2 100 2 150 6C200 10 250 8 298 4" 
            stroke="url(#underline-gradient)" 
            strokeWidth="3" 
            strokeLinecap="round"/>
      <defs>
        <linearGradient id="underline-gradient" x1="0" y1="0" x2="300" y2="0">
          <stop offset="0%" stopColor="#34d399"/>
          <stop offset="50%" stopColor="#22d3ee"/>
          <stop offset="100%" stopColor="#3b82f6"/>
        </linearGradient>
      </defs>
    </svg>
  </span>
</h1>
```

#### Step 3: 서브타이틀과 CTA

```tsx
{/* Subheadlines */}
<div className="space-y-4 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
  <p className="text-xl md:text-2xl text-white/80 flex items-center justify-center gap-3">
    <Cpu className="w-6 h-6 text-cyan-400" />
    <span><strong className="text-white">AI Multi-Agent</strong>가 심사위원 관점의 완벽한 초안을 제공합니다.</span>
  </p>
  <p className="text-lg md:text-xl text-white/60 flex items-center justify-center gap-2">
    <BadgeCheck className="w-5 h-5 text-emerald-400" />
    <span>예비창업패키지 · 초기창업패키지 · 정책자금지원 모두 대응</span>
  </p>
</div>

{/* CTA Buttons */}
<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
  <Button 
    size="lg" 
    onClick={handleCTAClick} 
    className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 px-12 py-6 text-xl font-bold shadow-2xl shadow-emerald-500/25 border-0 group"
  >
    지금 바로 시작하기
    <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
  </Button>
</div>
```

### 3.4 핵심 개념 정리

| 개념 | 설명 | 코드 예시 |
|------|------|----------|
| **min-h-screen** | 최소 높이를 뷰포트 100%로 설정 | `className="min-h-screen"` |
| **글래스모피즘** | 반투명 배경 + 블러 효과 | `bg-white/10 backdrop-blur-xl` |
| **그라데이션 텍스트** | 텍스트에 그라데이션 적용 | `bg-clip-text text-transparent` |
| **애니메이션 딜레이** | 순차적 등장 효과 | `style={{ animationDelay: '0.3s' }}` |

### 3.5 자가 점검

- [ ] 새 히어로 섹션이 기존 섹션 위에 표시되나요?
- [ ] 배경 그라데이션 애니메이션이 동작하나요?
- [ ] CTA 버튼 호버 시 화살표가 이동하나요?
- [ ] 모바일에서도 레이아웃이 정상인가요?

#### 💡 실습 과제 3-1
> 헤드라인 텍스트를 본인의 서비스에 맞게 변경해보세요.
> 힌트: `text-gradient` 클래스를 활용하여 강조할 부분을 지정합니다.

#### 💡 실습 과제 3-2
> 그라데이션 오브의 색상을 변경해보세요.
> 힌트: `from-purple-600/30`을 다른 색상으로 바꿔봅니다.

---

## 4. Module 2: 고정 헤더 네비게이션 바

> ⏱ 소요 시간: 20분

### 4.1 학습 목표

- fixed 포지셔닝을 활용한 고정 헤더 구현
- 스크롤 감지 및 상태 관리
- 스무스 스크롤링 구현

### 4.2 이론: 고정 헤더의 UX 효과

```
┌─────────────────────────────────────────┐
│  ✅ 장점                                │
│  • 항상 네비게이션 접근 가능            │
│  • 브랜드 인지도 상시 노출              │
│  • 빠른 페이지 이동 지원                │
├─────────────────────────────────────────┤
│  ⚠️ 주의점                              │
│  • 콘텐츠 영역 가리지 않도록 scroll-mt  │
│  • 스크롤 시 배경 변화로 가독성 확보    │
│  • 모바일에서 충분한 터치 영역          │
└─────────────────────────────────────────┘
```

### 4.3 실습: 네비게이션 구현

#### Step 1: 네비게이션 데이터 정의

```tsx
// 컴포넌트 외부에 정의
const navLinks = [
  { label: '문제 해결', href: '#problem-section' },
  { label: 'AI 심사위원단', href: '#makers-section' },
  { label: 'M.A.K.E.R.S', href: '#makers-committee' },
  { label: '맞춤 지원', href: '#business-category' },
  { label: '요금제', href: '#pricing-section' },
  { label: '고객 후기', href: '#testimonials-section' },
];
```

#### Step 2: 스크롤 상태 관리

```tsx
const [isScrolled, setIsScrolled] = useState(false);

// 스크롤 감지
React.useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

#### Step 3: 스무스 스크롤 함수

```tsx
const scrollToSection = (href: string) => {
  const element = document.querySelector(href);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
```

#### Step 4: 헤더 컴포넌트

```tsx
<header 
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled 
      ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg' 
      : 'bg-transparent'
  }`}
>
  <nav className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
    {/* Left - Logo */}
    <button 
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="flex items-center gap-3 group"
    >
      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
        <Rocket className="w-5 h-5" />
      </div>
      <span className="font-bold text-lg">Makers Round</span>
    </button>

    {/* Center - Navigation Links */}
    <div className="hidden lg:flex items-center gap-1">
      {navLinks.map((link, i) => (
        <button
          key={i}
          onClick={() => scrollToSection(link.href)}
          className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
        >
          {link.label}
        </button>
      ))}
    </div>

    {/* Right - CTA Button */}
    <Button onClick={handleCTAClick} className="bg-gradient-to-r from-purple-600 to-blue-600">
      <FileText className="w-4 h-4 mr-2" />
      사업계획서 작성
    </Button>
  </nav>
</header>
```

#### Step 5: 섹션에 scroll-mt 적용

각 섹션에 고정 헤더 높이만큼 스크롤 마진을 추가합니다.

```tsx
<section id="problem-section" className="py-24 relative scroll-mt-20">
```

### 4.4 핵심 개념 정리

| 개념 | 설명 | 값 |
|------|------|-----|
| **fixed** | 뷰포트 기준 고정 | `position: fixed` |
| **z-50** | 다른 요소 위에 표시 | `z-index: 50` |
| **scroll-mt-20** | 스크롤 시 상단 여백 | `scroll-margin-top: 5rem` |
| **backdrop-blur-xl** | 배경 블러 효과 | `backdrop-filter: blur(24px)` |

### 4.5 자가 점검

- [ ] 스크롤 시 헤더 배경이 변하나요?
- [ ] 네비게이션 링크 클릭 시 해당 섹션으로 스크롤되나요?
- [ ] 섹션 이동 시 헤더에 가려지지 않나요?

#### 💡 실습 과제 4-1
> 스크롤 임계값을 50에서 100으로 변경하고 차이를 확인해보세요.

#### 💡 실습 과제 4-2 (심화)
> 현재 보고 있는 섹션의 네비게이션 링크를 하이라이트하는 기능을 추가해보세요.
> 힌트: `IntersectionObserver` API를 활용합니다.

---

## 5. Module 3: 섹션 순서 재배치

> ⏱ 소요 시간: 10분

### 5.1 학습 목표

- 사용자 여정에 맞는 섹션 순서 이해
- JSX 코드 블록 이동 방법

### 5.2 이론: 랜딩페이지 섹션 배치 원칙

```
┌─────────────────────────────────────────┐
│  AIDA 모델 기반 섹션 배치               │
├─────────────────────────────────────────┤
│                                         │
│  1. Attention (주의)                    │
│     └── Hero: 핵심 가치 제안            │
│                                         │
│  2. Interest (관심)                     │
│     └── Problem: 공감대 형성            │
│     └── Solution: 해결책 제시           │
│                                         │
│  3. Desire (욕구)                       │
│     └── Features: 기능 상세             │
│     └── Social Proof: 신뢰 구축         │
│                                         │
│  4. Action (행동)                       │
│     └── Pricing: 선택지 제공            │
│     └── CTA: 행동 유도                  │
│                                         │
└─────────────────────────────────────────┘
```

### 5.3 실습: 섹션 순서 변경

```tsx
// 변경 전
<PrimaryHero />
<MakersHero />      // ← 솔루션
<ProblemSection />  // ← 문제

// 변경 후 (문제 → 솔루션 순서)
<PrimaryHero />
<ProblemSection />  // ← 문제 먼저
<MakersHero />      // ← 그 다음 솔루션
```

### 5.4 네비게이션 동기화

섹션 순서를 변경하면 네비게이션 링크 순서도 동기화해야 합니다.

```tsx
const navLinks = [
  { label: '문제 해결', href: '#problem-section' },     // 순서 변경
  { label: 'AI 심사위원단', href: '#makers-section' },  // 순서 변경
  // ...
];
```

#### 💡 실습 과제 5-1
> 본인의 서비스에 맞게 섹션 순서를 재설계해보세요.
> AIDA 모델을 참고하여 이유를 설명해보세요.

---

## 6. Module 4: 카테고리 지원 섹션

> ⏱ 소요 시간: 20분

### 6.1 학습 목표

- 데이터 배열을 활용한 카드 렌더링
- 동적 클래스명 바인딩
- 호버 효과와 그룹 선택자

### 6.2 실습: 사업분야 맞춤지원 섹션

#### Step 1: 데이터 구조 정의

```tsx
const businessCategories = [
  {
    icon: Globe,
    title: '온라인 창업',
    desc: '온라인 쇼핑몰, 디지털 서비스 등 온라인 기반 창업 지원',
    tags: ['스마트스토어', 'SaaS'],
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: User,
    title: '1인 소자본 창업',
    desc: '최소 비용으로 시작하는 1인 창업 최적화 솔루션',
    tags: ['프리랜서', '크리에이터'],
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500'
  },
  // ... 더 많은 카테고리
];
```

#### Step 2: 카드 컴포넌트 렌더링

```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
  {businessCategories.map((item, i) => (
    <div 
      key={i} 
      className="glass-card rounded-2xl p-6 hover-lift border border-white/10 hover:border-white/20 transition-all group"
    >
      {/* Icon with gradient */}
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
        <item.icon className="w-7 h-7 text-white" />
      </div>
      
      {/* Title */}
      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
      
      {/* Description */}
      <p className="text-white/60 text-sm mb-4">{item.desc}</p>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag, j) => (
          <span 
            key={j} 
            className={`text-xs px-3 py-1.5 rounded-full bg-${item.color}-500/10 text-${item.color}-400 border border-${item.color}-500/20`}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  ))}
</div>
```

### 6.3 핵심 개념: group 선택자

```tsx
// 부모에 group 클래스 적용
<div className="group">
  {/* 자식 요소에서 group-hover 사용 */}
  <div className="group-hover:scale-110 transition-transform">
    <Icon />
  </div>
</div>
```

### 6.4 자가 점검

- [ ] 4개의 카드가 균등하게 배치되나요?
- [ ] 카드 호버 시 아이콘이 확대되나요?
- [ ] 태그 색상이 카테고리별로 다른가요?

#### 💡 실습 과제 6-1
> 새로운 사업 분야 카테고리를 2개 추가해보세요.

---

## 7. Module 5: 페르소나 기반 솔루션 섹션

> ⏱ 소요 시간: 20분

### 7.1 학습 목표

- 페르소나 데이터 구조화
- 요금제와 페르소나 연결
- 감정적 호소를 활용한 카드 디자인

### 7.2 이론: 페르소나 마케팅

```
┌─────────────────────────────────────────┐
│  페르소나 카드 구성 요소                │
├─────────────────────────────────────────┤
│                                         │
│  👤 인적 정보                           │
│     • 이름, 역할, 상황                  │
│                                         │
│  😰 Pain Point                          │
│     • 겪고 있는 구체적 문제             │
│     • 감정 상태                         │
│                                         │
│  🎯 Goal                                │
│     • 달성하고 싶은 목표                │
│                                         │
│  💡 Solution                            │
│     • 우리 서비스가 어떻게 도울 수 있는지│
│                                         │
└─────────────────────────────────────────┘
```

### 7.3 실습: 페르소나 카드 구현

```tsx
const personas = [
  {
    tier: '기본',
    tierDesc: '빠른 초안 작성으로 사업 본질에 집중',
    name: '김예비',
    role: '예비창업패키지 지원자',
    avatar: '👨‍💼',
    problem: '마감이 일주일 남았는데, 시장 분석과 재무 추정 항목을 어떻게 채워야 할지 막막합니다.',
    emotion: '불안, 초조, 막막함',
    goal: '5천만 원 지원금을 위한 전문가 수준 사업계획서 완성',
    color: 'slate',
    gradient: 'from-slate-500 to-zinc-600',
  },
  // ... 더 많은 페르소나
];
```

### 7.4 카드 레이아웃

```tsx
<div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
  {personas.map((persona, i) => (
    <div className={`glass-card rounded-2xl p-6 border ${persona.borderColor}`}>
      {/* Tier Badge */}
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${persona.gradient}`}>
        {persona.tier}
      </div>

      {/* Avatar & Info */}
      <div className="flex items-center gap-4 mb-5">
        <div className="text-4xl">{persona.avatar}</div>
        <div>
          <h3 className="text-lg font-bold">{persona.name}</h3>
          <p className="text-sm text-white/60">{persona.role}</p>
        </div>
      </div>

      {/* Problem */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-xs font-semibold text-red-400">겪고 있는 문제</span>
        </div>
        <p className="text-sm text-white/80">"{persona.problem}"</p>
      </div>

      {/* Emotion */}
      <div className="mb-4">
        <Heart className="w-4 h-4 text-pink-400" />
        <span className="text-xs text-white/50">감정: {persona.emotion}</span>
      </div>

      {/* Goal */}
      <div className={`p-4 rounded-xl bg-${persona.color}-500/10`}>
        <Target className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-semibold text-emerald-400">이루고 싶은 목표</span>
        <p className="text-sm text-white/90">{persona.goal}</p>
      </div>

      {/* CTA */}
      <button className={`w-full mt-5 py-3 rounded-xl bg-gradient-to-r ${persona.gradient}`}>
        {persona.tier} 요금제로 시작하기
      </button>
    </div>
  ))}
</div>
```

#### 💡 실습 과제 7-1
> 본인 서비스의 타겟 고객을 3명의 페르소나로 정의해보세요.

---

## 8. Module 6: 드래그 캐러셀 리뷰 섹션

> ⏱ 소요 시간: 25분

### 8.1 학습 목표

- 마우스 드래그 이벤트 핸들링
- 수평 스크롤 캐러셀 구현
- 텍스트 선택 방지

### 8.2 이론: 드래그 스크롤 원리

```
┌─────────────────────────────────────────┐
│  마우스 드래그 스크롤 동작 원리         │
├─────────────────────────────────────────┤
│                                         │
│  1. mousedown                           │
│     • 시작 위치 저장 (startX)           │
│     • 현재 스크롤 위치 저장             │
│                                         │
│  2. mousemove                           │
│     • 이동 거리 계산 (현재X - startX)   │
│     • scrollLeft 업데이트               │
│                                         │
│  3. mouseup / mouseleave                │
│     • 드래그 상태 해제                  │
│                                         │
└─────────────────────────────────────────┘
```

### 8.3 실습: 드래그 캐러셀 구현

#### Step 1: 컨테이너 설정

```tsx
<div 
  className="flex gap-4 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none"
  style={{ 
    scrollbarWidth: 'none', 
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch'
  }}
  onMouseDown={handleMouseDown}
  onMouseLeave={handleMouseLeave}
  onMouseUp={handleMouseUp}
  onMouseMove={handleMouseMove}
>
  {/* 카드들 */}
</div>
```

#### Step 2: 이벤트 핸들러

```tsx
onMouseDown={(e) => {
  const container = e.currentTarget;
  container.dataset.isDown = 'true';
  container.dataset.startX = String(e.pageX - container.offsetLeft);
  container.dataset.scrollLeft = String(container.scrollLeft);
}}

onMouseLeave={(e) => {
  e.currentTarget.dataset.isDown = 'false';
}}

onMouseUp={(e) => {
  e.currentTarget.dataset.isDown = 'false';
}}

onMouseMove={(e) => {
  const container = e.currentTarget;
  if (container.dataset.isDown !== 'true') return;
  e.preventDefault();
  const x = e.pageX - container.offsetLeft;
  const walk = (x - Number(container.dataset.startX)) * 2; // 스크롤 속도 조절
  container.scrollLeft = Number(container.dataset.scrollLeft) - walk;
}}
```

#### Step 3: 텍스트 선택 방지

```tsx
// select-none 클래스 추가
<div className="... select-none">
```

### 8.4 리뷰 카드 컴포넌트

```tsx
<div className="flex-shrink-0 w-[340px] glass-card rounded-2xl p-6">
  {/* Stars */}
  <div className="flex gap-1 mb-4">
    {[...Array(5)].map((_, j) => (
      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    ))}
  </div>
  
  {/* Content */}
  <p className="text-sm text-white/80 leading-relaxed mb-5 line-clamp-5">
    "{review.content}"
  </p>
  
  {/* Author */}
  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
    <div className="w-10 h-10 rounded-full bg-emerald-500/20">
      <User className="w-5 h-5" />
    </div>
    <div>
      <div className="font-semibold text-sm">{review.name}</div>
      <div className="text-xs text-white/50">{review.role}</div>
    </div>
  </div>
</div>
```

### 8.5 핵심 CSS 클래스

| 클래스 | 효과 |
|--------|------|
| `flex-shrink-0` | 카드 크기 유지 (축소 방지) |
| `w-[340px]` | 고정 너비 |
| `overflow-x-auto` | 수평 스크롤 허용 |
| `cursor-grab` | 드래그 가능 표시 |
| `active:cursor-grabbing` | 드래그 중 커서 변경 |
| `select-none` | 텍스트 선택 방지 |
| `line-clamp-5` | 5줄 이상 생략 |

#### 💡 실습 과제 8-1
> 드래그 속도를 조절해보세요. `walk` 계산에서 `* 2`를 `* 3`으로 변경해보세요.

#### 💡 실습 과제 8-2 (심화)
> 스크롤 위치에 따라 좌우 화살표 버튼의 활성/비활성 상태를 표시해보세요.

---

## 9. 멀티미디어 리소스 보강 가이드

> ⏱ 소요 시간: 15분

### 9.1 이미지 리소스 추가 가이드

#### Hero 섹션 배경 이미지/영상

```tsx
{/* 비디오 배경 */}
<video 
  autoPlay 
  muted 
  loop 
  playsInline
  className="absolute inset-0 w-full h-full object-cover opacity-30"
>
  <source src="/videos/hero-bg.mp4" type="video/mp4" />
</video>
```

#### 페르소나 실제 사진

```tsx
// 아바타 이모지 대신 실제 이미지 사용
<img 
  src={persona.imageUrl}
  alt={persona.name}
  className="w-16 h-16 rounded-full object-cover"
/>
```

### 9.2 애니메이션 고도화

#### Lottie 애니메이션 통합

```bash
npm install lottie-react
```

```tsx
import Lottie from 'lottie-react';
import rocketAnimation from './animations/rocket.json';

<Lottie 
  animationData={rocketAnimation}
  className="w-32 h-32"
/>
```

#### 스크롤 기반 애니메이션 (Framer Motion)

```bash
npm install framer-motion
```

```tsx
import { motion, useScroll, useTransform } from 'framer-motion';

const { scrollYProgress } = useScroll();
const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

<motion.div style={{ opacity }}>
  {/* 스크롤에 따라 투명도 변화 */}
</motion.div>
```

### 9.3 권장 멀티미디어 추가 항목

| 위치 | 리소스 타입 | 설명 |
|------|------------|------|
| Hero 배경 | 비디오/Lottie | 다이나믹한 첫인상 |
| M.A.K.E.R.S 카드 | SVG 아이콘 | 각 위원 고유 일러스트 |
| 페르소나 | 실제 사진 | 신뢰도 향상 |
| 고객 후기 | 비디오 후기 | 사회적 증거 강화 |
| CTA 버튼 | 마이크로 애니메이션 | 클릭 유도 |
| 로딩 상태 | 스켈레톤 UI | 체감 속도 개선 |

### 9.4 이미지 최적화 체크리스트

- [ ] WebP 포맷 사용
- [ ] lazy loading 적용 (`loading="lazy"`)
- [ ] srcset으로 반응형 이미지 제공
- [ ] alt 텍스트 필수 작성
- [ ] aspect-ratio로 레이아웃 시프트 방지

---

## 10. 심화 학습 및 추가 과제

> ⏱ 소요 시간: 15분

### 10.1 코드 품질 개선

#### 사용하지 않는 import 정리

```bash
# ESLint로 미사용 import 확인
npm run lint

# 또는 VS Code에서 "Organize Imports" 실행 (Shift+Alt+O)
```

#### 컴포넌트 분리

```tsx
// Before: 단일 파일에 모든 섹션
export const LandingPage = () => {
  return (
    <div>
      {/* 모든 섹션이 여기에... */}
    </div>
  );
};

// After: 섹션별 컴포넌트 분리
export const LandingPage = () => {
  return (
    <div>
      <HeaderNav />
      <PrimaryHero />
      <TestimonialCarousel />
      <MakersHero />
      <BusinessCategories />
      <Pricing />
      <PersonaSolutions />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
};
```

### 10.2 성능 최적화

#### React.memo 적용

```tsx
const ReviewCard = React.memo(({ review, groupColor }) => {
  // ...
});
```

#### 이미지 최적화

```tsx
// Next.js Image 컴포넌트 스타일
<img
  src={imageSrc}
  loading="lazy"
  decoding="async"
  className="..."
/>
```

### 10.3 접근성 개선

```tsx
// 키보드 네비게이션 지원
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
  aria-label="다음 리뷰 보기"
>
  ...
</button>

// 스크린 리더 지원
<section aria-labelledby="testimonials-heading">
  <h2 id="testimonials-heading" className="sr-only">고객 후기</h2>
  ...
</section>
```

### 10.4 분석 도구 연동

```tsx
// Google Analytics 이벤트 추적
const handleCTAClick = () => {
  // GA4 이벤트 전송
  gtag('event', 'cta_click', {
    event_category: 'engagement',
    event_label: 'hero_cta',
  });
  
  navigate('/app');
};
```

### 10.5 추가 과제 목록

| 난이도 | 과제 | 힌트 |
|--------|------|------|
| ⭐ | 다크/라이트 모드 토글 | `useState`, CSS variables |
| ⭐⭐ | 모바일 햄버거 메뉴 | `useState`, 애니메이션 |
| ⭐⭐ | 현재 섹션 네비 하이라이트 | `IntersectionObserver` |
| ⭐⭐⭐ | 스크롤 진행 표시바 | `useScroll` (Framer Motion) |
| ⭐⭐⭐ | 다국어 지원 | react-i18next |
| ⭐⭐⭐⭐ | A/B 테스트 구현 | Feature flags |

---

## 11. Q&A 및 토론

> ⏱ 소요 시간: 15분

### 11.1 자주 묻는 질문

**Q: Tailwind 동적 클래스가 적용되지 않아요**
```tsx
// ❌ 동적 문자열 조합 - 작동 안 함
className={`bg-${color}-500`}

// ✅ 전체 클래스명 사전 정의
const colorClasses = {
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
};
className={colorClasses[color]}
```

**Q: 드래그 중 클릭 이벤트가 발생해요**
```tsx
// 드래그 거리가 짧으면 클릭으로 간주
const handleMouseUp = (e) => {
  const distance = Math.abs(e.pageX - startX);
  if (distance < 5) {
    // 클릭 이벤트 처리
  }
  // 드래그 종료
};
```

**Q: 모바일에서 터치 스크롤이 안 돼요**
```tsx
// 터치 이벤트 추가
onTouchStart={handleTouchStart}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}

// 또는 CSS로 해결
style={{ WebkitOverflowScrolling: 'touch' }}
```

### 11.2 토론 주제

1. **섹션 수가 너무 많으면 문제인가요?**
   - 스크롤 뎁스와 전환율의 관계
   - 정보 밀도 vs 사용자 피로도

2. **애니메이션은 얼마나 써야 할까요?**
   - prefers-reduced-motion 존중
   - 의미있는 애니메이션 vs 장식적 애니메이션

3. **모바일 퍼스트 vs 데스크탑 퍼스트**
   - 타겟 사용자 분석의 중요성
   - 반응형 브레이크포인트 전략

### 11.3 피드백 및 개선 제안

교육 내용에 대한 피드백이나 개선 제안이 있으시면 공유해주세요.

---

## 📝 교육 수료 체크리스트

모든 항목을 완료했는지 확인하세요:

- [ ] Primary Hero 섹션 추가 완료
- [ ] 고정 헤더 네비게이션 구현 완료
- [ ] 섹션 순서 재배치 완료
- [ ] 사업분야 맞춤지원 섹션 추가 완료
- [ ] 페르소나 솔루션 섹션 추가 완료
- [ ] 드래그 캐러셀 구현 완료
- [ ] 텍스트 선택 방지 적용 완료
- [ ] 멀티미디어 추가 계획 수립

---

## 📚 참고 자료

### 공식 문서
- [React 공식 문서](https://react.dev/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [Framer Motion](https://www.framer.com/motion/)

### 디자인 레퍼런스
- [Dribbble - Landing Page](https://dribbble.com/search/landing-page)
- [Awwwards](https://www.awwwards.com/)
- [Land-book](https://land-book.com/)

### 학습 리소스
- [Josh Comeau's CSS for JS Developers](https://css-for-js.dev/)
- [Epic React by Kent C. Dodds](https://epicreact.dev/)

---

**교육 자료 작성 완료: 2025-12-12**

---

> 💡 **Tip**: 이 교육 자료를 PDF로 내보내거나, 슬라이드로 변환하여 발표 자료로 활용할 수 있습니다.
