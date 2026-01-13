/**
 * 파일명: SignupPage.tsx
 * 
 * 파일 용도:
 * 회원가입 페이지 컴포넌트 (사전등록 프로모션 통합)
 * - 이메일/비밀번호 가입 폼
 * - 소셜 로그인 버튼 (Google, Kakao, Naver) - Mocked
 * - 약관 동의 체크박스 (최소 UX)
 * - 선택한 요금제 표시 및 저장
 * - [NEW] 프로모션 할인 정보 및 카운트다운 표시
 * - [NEW] 유료 요금제 선택 시 전화번호/사업분야 필수 입력
 * 
 * URL 파라미터:
 * - plan: 선택한 요금제 (기본, 플러스, 프로, 프리미엄)
 * 
 * 데이터 흐름:
 * 1. 랜딩페이지에서 요금제 선택 → /signup?plan=프로 로 이동
 * 2. 회원가입 폼 작성 및 약관 동의
 * 3. 유료 요금제 + 프로모션 활성 시 사전등록 API도 함께 호출
 * 4. 가입 완료 시 useAuthStore에 사용자 정보 저장
 * 5. /writing-demo 페이지로 리다이렉트
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  Eye, 
  EyeOff,
  Rocket,
  Shield,
  Zap,
  Clock,
  Flame,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore, PricingPlanType } from '../stores/useAuthStore';
import { useCountdown, formatTimeUnit } from '../hooks';
import { usePreRegistrationStore } from '../stores/usePreRegistrationStore';
import {
  PHASE_A_END,
  PHASE_B_END,
  getCurrentPromotionPhase,
  getCurrentDiscountRate,
  isPromotionActive as checkPromotionActive,
} from '../constants/promotion';
import { formatPrice, getPlanPricing } from '../utils/pricing';
import { formatPhoneNumber, businessCategories } from '../schemas/preRegistrationSchema';
import { trackEvent } from '../utils/analytics';

/** 요금제별 표시 정보 */
const planDisplayInfo: Record<PricingPlanType, { color: string; badge: string; price: string; planKey?: 'plus' | 'pro' | 'premium' }> = {
  '기본': { color: 'emerald', badge: '무료', price: '무료' },
  '플러스': { color: 'blue', badge: '인기', price: '₩399,000', planKey: 'plus' },
  '프로': { color: 'purple', badge: '추천', price: '₩799,000', planKey: 'pro' },
  '프리미엄': { color: 'amber', badge: 'VIP', price: '₩1,199,000', planKey: 'premium' },
};

/** 한글 요금제명 → API 키 변환 */
const planNameToKey = (planName: PricingPlanType): 'plus' | 'pro' | 'premium' | null => {
  const mapping: Record<string, 'plus' | 'pro' | 'premium'> = {
    '플러스': 'plus',
    '프로': 'pro',
    '프리미엄': 'premium',
  };
  return mapping[planName] || null;
};

/** API 키 → 한글 요금제명 변환 (URL 파라미터용) */
const planKeyToName = (planKey: string | null): PricingPlanType | null => {
  if (!planKey) return null;
  const mapping: Record<string, PricingPlanType> = {
    'plus': '플러스',
    'pro': '프로',
    'premium': '프리미엄',
    'basic': '기본',
    // 한글 키도 그대로 허용
    '기본': '기본',
    '플러스': '플러스',
    '프로': '프로',
    '프리미엄': '프리미엄',
  };
  return mapping[planKey] || null;
};

/**
 * SignupPage 컴포넌트
 * 
 * 역할:
 * - 회원가입 UI 제공
 * - 소셜 로그인 및 이메일 가입 지원
 * - 약관 동의 처리
 * - 선택한 요금제와 함께 가입 정보 저장
 */
export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signup, socialLogin, isLoading, setSelectedPlan, selectedPlan } = useAuthStore();
  const { submitRegistration } = usePreRegistrationStore();

  // URL에서 요금제 파라미터 읽기 (영문 키를 한글로 변환)
  const planFromUrl = planKeyToName(searchParams.get('plan'));
  const currentPlan: PricingPlanType = planFromUrl || selectedPlan || '기본';

  // 프로모션 상태
  const phase = getCurrentPromotionPhase();
  const discountRate = getCurrentDiscountRate();
  const isPromotionActive = checkPromotionActive();
  const isPaidPlan = ['플러스', '프로', '프리미엄'].includes(currentPlan);
  const showPromotionFeatures = isPromotionActive && isPaidPlan;

  // 카운트다운 (프로모션 활성 시에만 사용)
  const targetDate = phase === 'A' ? PHASE_A_END : PHASE_B_END;
  const countdown = useCountdown(targetDate);

  // Phase별 스타일
  const isPhaseA = phase === 'A';
  const gradientClass = isPhaseA
    ? 'from-rose-500 to-orange-500'
    : 'from-emerald-500 to-cyan-500';
  const accentColor = isPhaseA ? 'rose' : 'emerald';
  const PhaseIcon = isPhaseA ? Flame : Sparkles;

  // 현재 요금제 할인 정보
  const planKey = planNameToKey(currentPlan);
  const planPricing = planKey ? getPlanPricing(planKey) : null;

  // 폼 상태 (전화번호/사업분야 추가)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    businessCategory: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isBusinessCategoryOpen, setIsBusinessCategoryOpen] = useState(false);

  // 약관 동의 상태 (최소 UX: 전체 동의 + 개별 항목)
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,      // 이용약관 (필수)
    privacy: false,    // 개인정보처리방침 (필수)
    marketing: false,  // 마케팅 수신 (선택)
  });

  // 에러 상태
  const [errors, setErrors] = useState<Record<string, string>>({});

  // URL 파라미터로 요금제 설정
  useEffect(() => {
    if (planFromUrl) {
      setSelectedPlan(planFromUrl);
    }
  }, [planFromUrl, setSelectedPlan]);

  // 전체 동의 처리
  const handleAllAgree = () => {
    const newValue = !agreements.all;
    setAgreements({
      all: newValue,
      terms: newValue,
      privacy: newValue,
      marketing: newValue,
    });
  };

  // 개별 동의 처리
  const handleSingleAgree = (key: keyof typeof agreements) => {
    if (key === 'all') return;
    
    const newAgreements = {
      ...agreements,
      [key]: !agreements[key],
    };
    
    // 모든 항목이 체크되면 전체 동의도 체크
    newAgreements.all = newAgreements.terms && newAgreements.privacy && newAgreements.marketing;
    setAgreements(newAgreements);
  };

  // 입력 값 변경 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 에러 클리어
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 전화번호 포맷팅 핸들러
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  }, [errors.phone]);

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다';
    }

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요';
    }

    // 유료 요금제 선택 시 전화번호/사업분야 필수
    if (isPaidPlan) {
      if (!formData.phone) {
        newErrors.phone = '전화번호를 입력해주세요';
      } else if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(formData.phone)) {
        newErrors.phone = '올바른 휴대폰 번호 형식이 아닙니다';
      }

      if (!formData.businessCategory) {
        newErrors.businessCategory = '사업 분야를 선택해주세요';
      }
    }

    if (!agreements.terms) {
      newErrors.terms = '이용약관에 동의해주세요';
    }

    if (!agreements.privacy) {
      newErrors.privacy = '개인정보처리방침에 동의해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 이메일 회원가입 처리
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

      // GA4 이벤트: 회원가입 완료
      trackEvent('signup_complete', {
        plan_name: currentPlan,
        method: 'email',
      });

      // 유료 요금제 선택 시 사전등록도 함께 처리 (할인 코드 발급)
      if (isPaidPlan && planKey) {
        try {
          await submitRegistration({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            selectedPlan: planKey,
            businessCategory: formData.businessCategory as typeof businessCategories[number] | undefined,
            agreeTerms: true,
            agreeMarketing: agreements.marketing,
          });
        } catch {
          // 사전등록 실패해도 회원가입은 성공했으므로 진행
          console.warn('Pre-registration failed, but signup succeeded');
        }
      }
      
      // 가입 완료 후 이메일 인증 대기 페이지로 이동
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}&pending=true`);
    } catch {
      setErrors({ submit: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.' });
    }
  };

  // 소셜 로그인 처리
  const handleSocialLogin = async (provider: 'google' | 'kakao' | 'naver') => {
    // 필수 약관 동의 확인
    if (!agreements.terms || !agreements.privacy) {
      setErrors({
        terms: !agreements.terms ? '이용약관에 동의해주세요' : '',
        privacy: !agreements.privacy ? '개인정보처리방침에 동의해주세요' : '',
      });
      return;
    }

    try {
      // NOTE: 실제 프로덕션 환경에서는 OAuth2 Provider의 인증 페이지로 리다이렉트 해야 합니다.
      // 현재 개발 환경에서는 유효한 Client ID/Secret이 없으므로,
      // 백엔드에서 모의 토큰("mock-...")을 받아 처리하도록 구성되어 있습니다.
      // 백엔드 SocialOAuthService는 "mock-" 접두사가 있는 토큰을 감지하여 테스트 유저로 로그인시킵니다.
      
      const mockAccessToken = `mock-${provider}-token-${Date.now()}`;
      
      await socialLogin(provider, mockAccessToken, currentPlan, agreements.terms, agreements.privacy, agreements.marketing);
      
      // GA4 이벤트: 소셜 로그인 회원가입 완료
      trackEvent('signup_complete', {
        plan_name: currentPlan,
        method: provider,
      });
      
      navigate('/writing-demo');
    } catch {
      setErrors({ submit: '소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.' });
    }
  };

  // planInfo 안전하게 가져오기 (fallback to 기본)
  const planInfo = planDisplayInfo[currentPlan] || planDisplayInfo['기본'];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-900/50 via-slate-900 to-slate-950 p-12 flex-col items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12 group">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-shadow">
              <Rocket className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-2xl leading-tight">Makers Round</span>
              <span className="text-white/40 text-xs">by Makers World</span>
            </div>
          </Link>

          {/* Value Props */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              AI가 만드는<br />
              완벽한 사업계획서
            </h1>
            <p className="text-xl text-white/70">
              6명의 AI 심사위원이 당신의 사업을<br />
              철저히 검증합니다.
            </p>

            <div className="space-y-4 pt-6">
              {[
                { icon: Zap, text: '30분 만에 사업계획서 완성' },
                { icon: Shield, text: '지원사업 별 합격률 예측 및 개선' },
                { icon: Check, text: 'HWP/PDF 즉시 다운로드' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 justify-center">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-white/80">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Plan Badge with Discount Info */}
          <div className="mt-12">
            <div className={`inline-flex flex-col items-center gap-3 px-6 py-4 rounded-2xl bg-${planInfo.color}-500/20 border border-${planInfo.color}-500/30`}>
              {/* 프로모션 할인 배지 */}
              {showPromotionFeatures && planPricing && (
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${gradientClass} text-white`}>
                  <PhaseIcon className="w-3 h-3" />
                  {discountRate}% OFF
                </span>
              )}
              
              <div className={`px-3 py-1 rounded-full bg-${planInfo.color}-500/30 text-${planInfo.color}-400 text-sm font-medium`}>
                {planInfo.badge}
              </div>
              
              <div className="text-center">
                <p className="text-sm text-white/60">선택한 요금제</p>
                <p className="text-xl font-bold">{currentPlan}</p>
                
                {/* 할인가 표시 */}
                {showPromotionFeatures && planPricing ? (
                  <div className="mt-1">
                    <p className="text-sm text-white/40 line-through">₩{formatPrice(planPricing.originalPrice)}</p>
                    <p className={`text-lg font-bold text-${accentColor}-400`}>
                      ₩{formatPrice(planPricing.currentPrice)}
                    </p>
                    <p className={`text-xs text-${accentColor}-300`}>
                      ₩{formatPrice(planPricing.savings)} 절약
                    </p>
                  </div>
                ) : (
                  <p className="text-lg font-bold mt-1">{planInfo.price}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Header */}
        <div className="p-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>돌아가기</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-4 py-6">
          <div className="w-full max-w-md">
            {/* Promotion Banner - 유료 요금제 + 프로모션 활성 시 */}
            {showPromotionFeatures && (
              <div className={`p-3 rounded-xl bg-gradient-to-r ${gradientClass} mb-4`}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  {/* 할인 문구 */}
                  <div className="flex items-center gap-2">
                    <PhaseIcon className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="font-bold text-white text-sm whitespace-nowrap">
                      {isPhaseA ? '🔥 30% 사전등록 할인' : '✨ 10% 사전등록 할인'}
                    </span>
                  </div>
                  
                  {/* 카운트다운 */}
                  <div className="flex items-center gap-1.5 text-white text-xs">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="whitespace-nowrap">마감</span>
                    <div className="flex items-center gap-0.5 font-mono font-bold whitespace-nowrap">
                      {countdown.days > 0 && (
                        <>
                          <span className="bg-white/20 rounded px-1 py-0.5">{countdown.days}</span>
                          <span className="text-white/70">일</span>
                        </>
                      )}
                      <span className="bg-white/20 rounded px-1 py-0.5">{formatTimeUnit(countdown.hours)}</span>
                      <span className="text-white/70">:</span>
                      <span className="bg-white/20 rounded px-1 py-0.5">{formatTimeUnit(countdown.minutes)}</span>
                      <span className="text-white/70">:</span>
                      <span className="bg-white/20 rounded px-1 py-0.5">{formatTimeUnit(countdown.seconds)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Plan Display */}
            <div className="lg:hidden mb-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-${planInfo.color}-500/20 border border-${planInfo.color}-500/30 text-sm`}>
                <span className="text-white/60">선택 요금제:</span>
                <span className="font-bold">{currentPlan}</span>
                <span className="text-white/60">({planInfo.price})</span>
              </div>
            </div>

            <div className="space-y-5">
            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold mb-1">회원가입</h2>
              <p className="text-white/60 text-sm">계정을 만들고 바로 시작하세요</p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-800 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google로 시작하기
              </button>

              <button
                onClick={() => handleSocialLogin('kakao')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FEE500] text-[#191919] rounded-lg font-medium text-sm hover:bg-[#FDD800] transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#191919" d="M12 3c-5.52 0-10 3.59-10 8.03 0 2.84 1.87 5.33 4.67 6.75l-1.18 4.36c-.1.38.34.68.67.47l5.2-3.44c.21.01.42.02.64.02 5.52 0 10-3.59 10-8.03S17.52 3 12 3z"/>
                </svg>
                카카오로 시작하기
              </button>

              <button
                onClick={() => handleSocialLogin('naver')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#03C75A] text-white rounded-lg font-medium text-sm hover:bg-[#02B350] transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="white" d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
                </svg>
                네이버로 시작하기
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-950 text-white/40">또는 이메일로 가입</span>
              </div>
            </div>

            {/* Email Signup Form */}
            <form onSubmit={handleEmailSignup} className="space-y-3">
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="이메일"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500"
                />
              </div>

              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="이름"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500"
                />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="비밀번호 (8자 이상, 영문과 숫자 포함)"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  name="passwordConfirm"
                  placeholder="비밀번호 확인"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  error={errors.passwordConfirm}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* 유료 요금제 선택 시 추가 필드 */}
              {isPaidPlan && (
                <>
                  {/* 전화번호 */}
                  <div>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="전화번호 (010-1234-5678)"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      error={errors.phone}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500"
                    />
                    {showPromotionFeatures && (
                      <p className="mt-1 text-xs text-white/40">
                        * 사전등록 할인코드 발송을 위해 필요합니다
                      </p>
                    )}
                  </div>

                  {/* 사업 분야 - 커스텀 드롭다운 */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsBusinessCategoryOpen(!isBusinessCategoryOpen)}
                      className={`w-full px-4 py-3 pr-10 bg-white/5 border rounded-lg text-left transition-all cursor-pointer ${
                        isBusinessCategoryOpen 
                          ? 'border-purple-500 ring-2 ring-purple-500/20' 
                          : 'border-white/10 hover:border-white/20'
                      } ${formData.businessCategory ? 'text-white' : 'text-white/40'}`}
                    >
                      {formData.businessCategory || '사업 분야 선택'}
                    </button>
                    <ChevronDown 
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none transition-transform ${
                        isBusinessCategoryOpen ? 'rotate-180' : ''
                      }`} 
                    />
                    
                    {/* 드롭다운 메뉴 */}
                    {isBusinessCategoryOpen && (
                      <>
                        {/* 배경 클릭 시 닫기 */}
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setIsBusinessCategoryOpen(false)}
                        />
                        <div className="absolute z-20 top-full left-0 right-0 mt-1 py-1 bg-slate-800 border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          {businessCategories.map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, businessCategory: category }));
                                setIsBusinessCategoryOpen(false);
                                if (errors.businessCategory) {
                                  setErrors(prev => ({ ...prev, businessCategory: '' }));
                                }
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                                formData.businessCategory === category
                                  ? 'bg-purple-500/20 text-purple-300'
                                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                    {errors.businessCategory && (
                      <p className="mt-1 text-xs text-red-400">{errors.businessCategory}</p>
                    )}
                  </div>
                </>
              )}

              {/* Terms Agreement - Minimal UX */}
              <div className="space-y-2 pt-2">
                {/* All Agree */}
                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${agreements.all ? 'bg-purple-500 border-purple-500' : 'border-white/30'}`}>
                    {agreements.all && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={agreements.all}
                    onChange={handleAllAgree}
                    className="hidden"
                  />
                  <span className="font-medium text-sm">전체 동의</span>
                </label>

                {/* Individual Terms */}
                <div className="pl-2 space-y-1.5">
                  {/* 이용약관 (필수) */}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${agreements.terms ? 'bg-purple-500 border-purple-500' : 'border-white/30'}`}>
                      {agreements.terms && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={agreements.terms}
                      onChange={() => handleSingleAgree('terms')}
                      className="hidden"
                    />
                    <span className="text-sm text-white/70 group-hover:text-white/90">
                      <span className="text-purple-400">[필수]</span> 이용약관 동의
                    </span>
                    <button type="button" className="ml-auto text-xs text-white/40 hover:text-white/60 underline">보기</button>
                  </label>
                  {errors.terms && <p className="text-xs text-red-400 ml-7">{errors.terms}</p>}

                  {/* 개인정보처리방침 (필수) */}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${agreements.privacy ? 'bg-purple-500 border-purple-500' : 'border-white/30'}`}>
                      {agreements.privacy && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={agreements.privacy}
                      onChange={() => handleSingleAgree('privacy')}
                      className="hidden"
                    />
                    <span className="text-sm text-white/70 group-hover:text-white/90">
                      <span className="text-purple-400">[필수]</span> 개인정보처리방침 동의
                    </span>
                    <button type="button" className="ml-auto text-xs text-white/40 hover:text-white/60 underline">보기</button>
                  </label>
                  {errors.privacy && <p className="text-xs text-red-400 ml-7">{errors.privacy}</p>}

                  {/* 마케팅 수신 (선택) */}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${agreements.marketing ? 'bg-purple-500 border-purple-500' : 'border-white/30'}`}>
                      {agreements.marketing && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={agreements.marketing}
                      onChange={() => handleSingleAgree('marketing')}
                      className="hidden"
                    />
                    <span className="text-sm text-white/70 group-hover:text-white/90">
                      <span className="text-white/40">[선택]</span> 마케팅 정보 수신 동의
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <p className="text-sm text-red-400 text-center">{errors.submit}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                isLoading={isLoading}
                className={`w-full py-3 text-base font-bold bg-gradient-to-r ${
                  showPromotionFeatures 
                    ? gradientClass + ' hover:opacity-90' 
                    : 'from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500'
                }`}
              >
                {showPromotionFeatures ? (
                  <>
                    <PhaseIcon className="w-4 h-4 mr-1.5 inline" />
                    가입하고 {discountRate}% 할인 받기
                  </>
                ) : (
                  '가입 후 무료 데모 체험하기'
                )}
              </Button>
            </form>

            {/* Login Link */}
            <p className="text-center text-white/60 text-sm">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 underline underline-offset-4">
                로그인
              </Link>
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


