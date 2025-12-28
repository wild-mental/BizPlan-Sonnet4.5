# 회원가입 + 사전등록 UX 통합 계획서

## 1. 개요

### 1.1 현재 상황
현재 두 개의 분리된 사용자 흐름이 존재합니다:

| 구분 | PreRegistrationModal | SignupPage |
|------|---------------------|------------|
| 타입 | 모달 오버레이 | 전체 페이지 |
| 트리거 | 프로모션 기간 중 유료 요금제 선택 | 가입 버튼 클릭 |
| 주요 기능 | 요금제 선택 + 할인 정보 + 카운트다운 | 소셜 로그인 + 이메일 가입 |
| 수집 정보 | 이름, 이메일, 전화번호, 사업분야 | 이메일, 이름, 비밀번호 |

### 1.2 목표
- **단일 UX 흐름**: 사전등록 이벤트를 회원가입 페이지에 통합
- **프로모션 연동**: 할인/카운트다운/페이즈 정보를 회원가입 시 표시
- **모달 제거**: PreRegistrationModal 대신 SignupPage에서 모든 기능 처리

---

## 2. 통합 후 UX 플로우

```
┌─────────────────────────────────────────────────────────────────┐
│                      랜딩페이지                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  요금제 선택 (기본/플러스/프로/프리미엄)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│              /signup?plan={선택요금제}로 이동                     │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   통합 회원가입 페이지                            │
│                                                                  │
│  ┌────────────────────┐  ┌────────────────────────────────────┐ │
│  │   Left Panel       │  │   Right Panel (Form)               │ │
│  │   ─────────────    │  │   ────────────────────             │ │
│  │  • 브랜드 로고     │  │  ┌─────────────────────────────┐   │ │
│  │  • 가치 제안       │  │  │ [조건부] 프로모션 헤더       │   │ │
│  │  • 혜택 목록       │  │  │ • 할인율 배지              │   │ │
│  │                    │  │  │ • 카운트다운 타이머        │   │ │
│  │  ┌──────────────┐  │  │  └─────────────────────────────┘   │ │
│  │  │ 선택 요금제  │  │  │                                    │ │
│  │  │ (할인 정보   │  │  │  ┌─────────────────────────────┐   │ │
│  │  │  포함)       │  │  │  │ [조건부] 요금제 선택 카드    │   │ │
│  │  └──────────────┘  │  │  │ (유료 요금제 + 할인가 표시)  │   │ │
│  │                    │  │  └─────────────────────────────┘   │ │
│  └────────────────────┘  │                                    │ │
│                          │  • 소셜 로그인 버튼들              │ │
│                          │  • 이메일 가입 폼                  │ │
│                          │  • 전화번호 (유료 요금제 선택 시 필수)   │ │
│                          │  • 사업분야 (유료 요금제 선택 시 필수)   │ │
│                          │  • 약관 동의                       │ │
│                          │  • 제출 버튼                       │ │
│                          └────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. 상세 구현 계획

### 3.1 Phase 1: 프로모션 상태 연동

**파일**: `src/pages/SignupPage.tsx`

**추가할 imports**:
```typescript
import { useCountdown, formatTimeUnit } from '../hooks';
import { 
  PHASE_A_END, 
  PHASE_B_END, 
  getCurrentPromotionPhase, 
  getCurrentDiscountRate,
  PRICING 
} from '../constants/promotion';
import { formatPrice } from '../utils/pricing';
import { Clock, Flame, Sparkles } from 'lucide-react';
```

**추가할 상태/훅**:
```typescript
// 프로모션 상태
const phase = getCurrentPromotionPhase();
const discountRate = getCurrentDiscountRate();
const isPromotionActive = phase !== 'ENDED';
const isPaidPlan = ['플러스', '프로', '프리미엄'].includes(currentPlan);

// 카운트다운
const targetDate = phase === 'A' ? PHASE_A_END : PHASE_B_END;
const countdown = useCountdown(targetDate);

// Phase 스타일
const isPhaseA = phase === 'A';
const gradientClass = isPhaseA 
  ? 'from-rose-500 to-orange-500' 
  : 'from-emerald-500 to-cyan-500';
const PhaseIcon = isPhaseA ? Flame : Sparkles;
```

---

### 3.2 Phase 2: UI 컴포넌트 추가

#### 3.2.1 프로모션 헤더 배너 (조건부 렌더링)

유료 요금제 선택 + 프로모션 활성 시 폼 상단에 표시:

```tsx
{isPromotionActive && isPaidPlan && (
  <div className={`p-4 rounded-xl bg-gradient-to-r ${gradientClass} mb-6`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <PhaseIcon className="w-5 h-5 text-white" />
        <span className="font-bold text-white">
          {isPhaseA ? '🔥 30% 사전등록 할인' : '✨ 10% 사전등록 할인'}
        </span>
      </div>
      
      {/* 카운트다운 */}
      <div className="flex items-center gap-2 text-white text-sm">
        <Clock className="w-4 h-4" />
        <span>마감까지</span>
        <div className="flex items-center gap-1 font-mono font-bold">
          <span className="bg-white/20 rounded px-1.5 py-0.5">
            {formatTimeUnit(countdown.hours)}
          </span>
          <span>:</span>
          <span className="bg-white/20 rounded px-1.5 py-0.5">
            {formatTimeUnit(countdown.minutes)}
          </span>
          <span>:</span>
          <span className="bg-white/20 rounded px-1.5 py-0.5">
            {formatTimeUnit(countdown.seconds)}
          </span>
        </div>
      </div>
    </div>
  </div>
)}
```

#### 3.2.2 Left Panel 요금제 배지 업데이트

할인가 정보 포함하도록 수정:

```tsx
{/* Selected Plan Badge with Discount */}
<div className="mt-12">
  <div className={`inline-flex flex-col items-center gap-3 px-6 py-4 rounded-2xl ...`}>
    {isPromotionActive && isPaidPlan && (
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${gradientClass} text-white`}>
        <PhaseIcon className="w-3 h-3 inline mr-1" />
        {discountRate}% OFF
      </span>
    )}
    <div className="text-center">
      <p className="text-sm text-white/60">선택한 요금제</p>
      <p className="text-xl font-bold">{currentPlan}</p>
      {isPromotionActive && isPaidPlan ? (
        <>
          <p className="text-sm text-white/40 line-through">{planInfo.price}</p>
          <p className={`text-lg font-bold text-${isPhaseA ? 'rose' : 'emerald'}-400`}>
            ₩{formatPrice(getDiscountedPrice(currentPlan))}
          </p>
        </>
      ) : (
        <p className="text-lg font-bold">{planInfo.price}</p>
      )}
    </div>
  </div>
</div>
```

---

### 3.3 Phase 3: 폼 필드 확장

#### 3.3.1 전화번호 필드 추가 (선택)

프로모션 활성 시 전화번호 수집 (할인코드 발송용):

```tsx
// formData 확장
const [formData, setFormData] = useState({
  email: '',
  password: '',
  passwordConfirm: '',
  name: '',
  phone: '',           // NEW
  businessCategory: '', // NEW
});

// 전화번호 포맷팅 (preRegistrationSchema에서 가져옴)
const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const formatted = formatPhoneNumber(e.target.value);
  setFormData(prev => ({ ...prev, phone: formatted }));
};

// JSX (프로모션 활성 + 유료 요금제일 때만 표시)
{isPromotionActive && isPaidPlan && (
  <>
    <div>
      <Input
        type="tel"
        name="phone"
        placeholder="전화번호 (할인코드 발송용)"
        value={formData.phone}
        onChange={handlePhoneChange}
        className="..."
      />
      <p className="mt-1 text-xs text-white/40">
        * 사전등록 할인코드 발송을 위해 필요합니다
      </p>
    </div>

    <div>
      <select
        name="businessCategory"
        value={formData.businessCategory}
        onChange={handleInputChange}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg ..."
      >
        <option value="">사업 분야 (선택)</option>
        {businessCategories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  </>
)}
```

---

### 3.4 Phase 4: API 연동 수정

#### 3.4.1 회원가입 시 사전등록 정보 함께 처리

```typescript
const handleEmailSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    // 기본 회원가입
    await signup({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      plan: currentPlan,
      termsAgreed: agreements.terms,
      privacyAgreed: agreements.privacy,
      marketingConsent: agreements.marketing,
    });

    // 프로모션 활성 + 유료 요금제인 경우 사전등록도 처리
    if (isPromotionActive && isPaidPlan && formData.phone) {
      await submitPreRegistration({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        selectedPlan: planNameToKey(currentPlan), // '플러스' -> 'plus'
        businessCategory: formData.businessCategory,
        agreeTerms: true,
        agreeMarketing: agreements.marketing,
      });
    }

    navigate('/writing-demo');
  } catch (error) {
    setErrors({ submit: '회원가입 중 오류가 발생했습니다.' });
  }
};
```

---

### 3.5 Phase 5: PreRegistrationModal 제거/비활성화

#### 3.5.1 모달 호출 제거

**파일**: `src/pages/LandingPage.tsx`

기존 요금제 버튼에서 모달 오픈 대신 signup 페이지로 이동:

```tsx
// Before
const handlePlanSelect = (plan: PlanType) => {
  if (isPromotionActive && isPaidPlan(plan)) {
    openPreRegistrationModal(plan);
  } else {
    navigate(`/signup?plan=${plan}`);
  }
};

// After
const handlePlanSelect = (plan: PlanType) => {
  navigate(`/signup?plan=${plan}`);
};
```

#### 3.5.2 모달 컴포넌트 정리 (선택사항)

- `PreRegistrationModal.tsx` 파일 삭제 또는 deprecated 주석 처리
- 관련 스토어 (`usePreRegistrationStore`)에서 모달 상태 제거 가능

---

## 4. 파일 변경 목록

| 파일 | 변경 유형 | 설명 |
|------|---------|------|
| `src/pages/SignupPage.tsx` | **수정** | 프로모션 UI 통합, 폼 필드 확장 |
| `src/pages/LandingPage.tsx` | **수정** | 모달 호출 → signup 리다이렉트로 변경 |
| `src/components/PreRegistrationModal.tsx` | **삭제/비활성화** | 더 이상 사용하지 않음 |
| `src/stores/usePreRegistrationStore.ts` | **수정** | 모달 상태 제거, API 호출만 유지 |
| `src/App.tsx` | **수정** | PreRegistrationModal import 제거 |

---

## 5. UI/UX 상세 스펙

### 5.1 프로모션 활성 시 (유료 요금제)

```
┌────────────────────────────────────────────────────────────┐
│ 🔥 30% 사전등록 할인                    마감까지 02:15:33  │ ← 그라데이션 배너
└────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  회원가입                                                    │
│  계정을 만들고 바로 시작하세요                               │
│                                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐               │
│  │ Google     │ │ Kakao      │ │ Naver      │               │
│  └────────────┘ └────────────┘ └────────────┘               │
│                                                              │
│  ─────────── 또는 이메일로 가입 ───────────                  │
│                                                              │
│  [이메일 입력]                                               │
│  [이름 입력]                                                 │
│  [비밀번호 입력]                                             │
│  [비밀번호 확인]                                             │
│  [전화번호 입력] ← 프로모션 시에만 표시                      │
│  [사업분야 선택] ← 프로모션 시에만 표시                      │
│                                                              │
│  ☑ 전체 동의                                                │
│    ☑ [필수] 이용약관                                        │
│    ☑ [필수] 개인정보처리방침                                │
│    ☑ [선택] 마케팅 수신                                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        가입 후 무료 데모 체험하기                      │   │ ← 그라데이션 버튼
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  이미 계정이 있으신가요? 로그인                             │
└──────────────────────────────────────────────────────────────┘
```

### 5.2 프로모션 비활성 시 (또는 기본 요금제)

```
┌──────────────────────────────────────────────────────────────┐
│  회원가입                                                    │
│  계정을 만들고 바로 시작하세요                               │
│                                                              │
│  (프로모션 배너 없음)                                        │
│  (전화번호/사업분야 필드 없음)                               │
│                                                              │
│  ... 기존 폼 ...                                            │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. 구현 우선순위 및 일정

| 순서 | 작업 | 예상 시간 | 의존성 |
|------|------|----------|--------|
| 1 | Phase 1: 프로모션 상태 연동 | 30분 | 없음 |
| 2 | Phase 2: 프로모션 헤더 배너 | 1시간 | Phase 1 |
| 3 | Phase 3: 폼 필드 확장 | 1시간 | Phase 1 |
| 4 | Phase 4: API 연동 수정 | 1시간 | Phase 3 |
| 5 | Phase 5: 모달 제거 | 30분 | Phase 1-4 |
| 6 | 테스트 및 QA | 1시간 | 전체 |

**총 예상 시간**: 5시간

---

## 7. 롤백 계획

만약 통합 후 이슈가 발생할 경우:

1. `PreRegistrationModal.tsx`는 삭제하지 않고 deprecated 처리
2. Feature flag로 신/구 UX 전환 가능하도록 구현
3. Git 브랜치 전략: `feature/signup-preregistration-integration`

---

## 8. 체크리스트

### 구현 완료 체크 ✅
- [x] 프로모션 상태 연동 (phase, discountRate, countdown)
- [x] 프로모션 헤더 배너 구현
- [x] Left Panel 요금제 배지 할인 정보 표시
- [x] 전화번호 필드 추가 (유료 요금제 필수)
- [x] 사업분야 필드 추가 (유료 요금제 필수)
- [x] 회원가입 API + 사전등록 API 통합 호출
- [x] LandingPage에서 모달 호출 제거
- [x] PreRegistrationModal 임포트 제거 (컴포넌트 파일은 유지)

### QA 체크
- [ ] 기본 요금제 선택 시 기존 UX 동작 확인
- [ ] 유료 요금제 + 프로모션 활성 시 할인 정보 표시 확인
- [ ] 카운트다운 타이머 정상 동작 확인
- [ ] 소셜 로그인 + 사전등록 연동 확인
- [ ] 이메일 가입 + 사전등록 연동 확인
- [ ] 모바일 반응형 레이아웃 확인
- [ ] 프로모션 종료(ENDED) 상태 시 기본 UX 확인

---

## 10. 구현 완료 (2025-12-28)

### 변경된 파일
1. **`src/pages/SignupPage.tsx`** - 사전등록 프로모션 기능 통합
   - 프로모션 상태 연동 (phase, 할인율, 카운트다운)
   - 유료 요금제 선택 시 전화번호/사업분야 필수 입력
   - 프로모션 헤더 배너 (할인율 + 카운트다운)
   - Left Panel에 할인 정보 표시
   - 회원가입 + 사전등록 API 통합 호출

2. **`src/pages/LandingPage.tsx`** - 모달 호출 제거
   - `PreRegistrationModal` 임포트 제거
   - 요금제 선택 시 모달 대신 `/signup?plan=` 으로 이동
   - `PromotionBanner` 클릭도 signup 페이지로 이동

### 빌드 상태
- ✅ TypeScript 컴파일 성공
- ✅ Vite 빌드 성공
- ⚠️ 번들 크기 경고 (1.17MB) - 추후 코드 스플리팅 권장

---

## 9. 참고 파일

- `src/pages/SignupPage.tsx` - 메인 수정 대상
- `src/components/PreRegistrationModal.tsx` - 참고/제거 대상
- `src/constants/promotion.ts` - 프로모션 상수
- `src/hooks/useCountdown.ts` - 카운트다운 훅
- `src/schemas/preRegistrationSchema.ts` - 폼 스키마
- `src/stores/usePreRegistrationStore.ts` - 사전등록 스토어

