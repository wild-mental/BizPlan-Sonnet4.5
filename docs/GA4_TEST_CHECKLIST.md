# GA4 MVP 테스트 체크리스트

## 테스트 환경 준비

### 1. 환경변수 설정
```bash
# MakersRound-Sonnet4.5/.env 파일에 GA4 Measurement ID 설정
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # 실제 GA4 측정 ID로 교체
VITE_GA_DEBUG_MODE=true
```

### 2. GA4 DebugView 활성화
1. Chrome에서 [GA Debugger 확장 프로그램](https://chrome.google.com/webstore/detail/google-analytics-debugger) 설치
2. Google Analytics > 관리 > DebugView 열기
3. 개발자 도구(F12) Console 탭에서 `[GA4]` 로그 확인

---

## 테스트 시나리오

### ✅ Phase 1: 기본 설정 확인

- [ ] 앱 실행 시 Console에 `[GA4] Initialized successfully` 로그 확인
- [ ] `measurementId`와 `debugMode` 값이 올바르게 표시되는지 확인

### ✅ Phase 2: 페이지뷰 자동 추적

| 페이지 | 경로 | 확인 방법 |
|--------|------|----------|
| - [ ] 랜딩페이지 | `/` | DebugView에서 `page_view` 이벤트 확인 |
| - [ ] 회원가입 | `/signup` | `page: /signup` 확인 |
| - [ ] 로그인 | `/login` | `page: /login` 확인 |
| - [ ] 작성 데모 | `/writing-demo` | `page: /writing-demo` 확인 |
| - [ ] 평가 데모 | `/evaluation-demo` | `page: /evaluation-demo` 확인 |
| - [ ] 마법사 1단계 | `/wizard/1` | `page: /wizard/1` 확인 |

**확인 방법:**
- Console에서 `[GA4] Page view: { path: '/경로', title: '페이지 제목' }` 로그 확인
- GA4 DebugView에서 `page_view` 이벤트 실시간 확인

---

### ✅ Phase 3: 전환 이벤트 테스트 (5개)

#### 3.1 `signup_complete` - 회원가입 완료

**테스트 시나리오:**
1. `/signup` 페이지로 이동
2. 이메일/비밀번호/이름 입력
3. 약관 동의 체크
4. "가입 후 무료 데모 체험하기" 버튼 클릭

**기대 결과:**
- [ ] Console: `[GA4] Event: { eventName: 'signup_complete', params: { plan_name: '기본', method: 'email' } }`
- [ ] DebugView: `signup_complete` 이벤트 확인

**소셜 로그인 테스트:**
1. 약관 동의 후 "Google로 시작하기" 클릭
- [ ] Console: `method: 'google'` 확인
- [ ] DebugView: `signup_complete` 이벤트 확인

---

#### 3.2 `preregistration_complete` - 사전등록 완료

**테스트 시나리오:**
1. `/signup?plan=plus` 또는 `/signup?plan=pro` 로 이동 (유료 요금제)
2. 이메일/비밀번호/이름/전화번호/사업분야 입력
3. 약관 동의 후 회원가입 완료

**기대 결과:**
- [ ] Console: `[GA4] Event: { eventName: 'preregistration_complete', params: { plan_name: 'plus', discount_rate: 30 } }`
- [ ] DebugView: `preregistration_complete` 이벤트 확인

---

#### 3.3 `wizard_complete` - 마법사 완료

**테스트 시나리오:**
1. `/writing-demo`에서 프로젝트 생성
2. `/wizard/1` ~ `/wizard/6` 단계 진행
3. 6단계에서 "AI 사업계획서 생성" 버튼 클릭
4. 생성 완료 후 `/business-plan` 페이지로 이동

**기대 결과:**
- [ ] Console: `[GA4] Event: { eventName: 'wizard_complete', params: { template_type: 'pre-startup', completion_rate: 100 } }`
- [ ] DebugView: `wizard_complete` 이벤트 확인

**주의:** 백엔드 서버가 실행 중이어야 실제 생성 성공 후 이벤트가 발생합니다.

---

#### 3.4 `evaluation_result_view` - 평가 결과 조회

**테스트 시나리오:**
1. `/evaluation-demo` 페이지로 이동
2. 아이디어 입력 후 "AI 평가 시작" 클릭
3. 분석 완료 후 결과 화면 확인

**기대 결과:**
- [ ] Console: `[GA4] Event: { eventName: 'evaluation_result_view', params: { total_score: 75, grade: 'B', pass_rate: 65 } }`
- [ ] DebugView: `evaluation_result_view` 이벤트 확인

---

#### 3.5 `export_document` - 문서 내보내기

**테스트 시나리오:**
1. `/business-plan` 페이지로 이동
2. "PDF" 또는 "HWP" 버튼 클릭

**기대 결과:**
- [ ] Console: `[GA4] Event: { eventName: 'export_document', params: { format: 'pdf', template_type: 'pre-startup' } }`
- [ ] DebugView: `export_document` 이벤트 확인

---

## 디버깅 팁

### Console 필터링
```javascript
// 브라우저 Console에서 GA4 로그만 필터링
// Filter 입력창에 "[GA4]" 입력
```

### dataLayer 확인
```javascript
// GA4 dataLayer 내용 확인
window.dataLayer
```

### 이벤트 전송 확인
```javascript
// Network 탭에서 GA4 요청 확인
// "collect?" 또는 "google-analytics.com" 필터링
```

---

## 문제 해결

### 이벤트가 전송되지 않는 경우

1. **환경변수 확인**
   - `VITE_GA_MEASUREMENT_ID`가 설정되어 있는지 확인
   - 앱 재시작 필요 (`npm run dev`)

2. **Measurement ID 형식 확인**
   - `G-XXXXXXXXXX` 형식이어야 함
   - 공백이나 특수문자 없이 정확히 입력

3. **디버그 모드 확인**
   - `VITE_GA_DEBUG_MODE=true` 설정 시 Console 로그 활성화

4. **GA4 속성 설정 확인**
   - GA4 관리 > 데이터 스트림 > 웹 스트림 설정 확인
   - DebugView가 활성화되어 있는지 확인

### DebugView에 이벤트가 표시되지 않는 경우

1. GA Debugger 확장 프로그램이 활성화되어 있는지 확인
2. 브라우저 캐시 삭제 후 재시도
3. GA4 콘솔에서 실시간 보고서로 확인 (DebugView 대신)

---

## 완료 체크리스트

### 구현 완료 항목
- [x] react-ga4 패키지 설치
- [x] `src/utils/analytics.ts` 유틸리티 생성
- [x] `main.tsx`에 GA4 초기화
- [x] `App.tsx`에 RouteTracker 추가
- [x] `SignupPage.tsx`에 signup_complete 이벤트
- [x] `usePreRegistrationStore.ts`에 preregistration_complete 이벤트
- [x] `WizardStep.tsx`에 wizard_complete 이벤트
- [x] `ResultSection.tsx`에 evaluation_result_view 이벤트
- [x] `BusinessPlanViewer.tsx`에 export_document 이벤트

### 테스트 완료 항목
- [ ] 모든 페이지뷰 자동 추적 확인
- [ ] signup_complete 이벤트 확인
- [ ] preregistration_complete 이벤트 확인
- [ ] wizard_complete 이벤트 확인
- [ ] evaluation_result_view 이벤트 확인
- [ ] export_document 이벤트 확인

---

## 다음 단계

GA4 MVP 테스트 완료 후 고려할 추가 작업:

1. **프로덕션 환경 설정**
   - `VITE_GA_DEBUG_MODE=false` 설정
   - 실제 GA4 Measurement ID 적용

2. **GA4 대시보드 설정**
   - 전환 이벤트 등록 (signup_complete, wizard_complete 등)
   - 사용자 정의 보고서 생성
   - 퍼널 분석 설정

3. **추가 이벤트 구현** (선택)
   - `landing_section_view` - 랜딩페이지 섹션 조회
   - `landing_cta_click` - CTA 버튼 클릭
   - `wizard_step_complete` - 개별 단계 완료
   - `evaluation_start` - 평가 시작

---

**작성일:** 2026-01-07  
**버전:** 1.0
