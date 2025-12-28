/**
 * 사전 등록 모달 컴포넌트
 * Pre-registration modal with form validation
 */

import React, { useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Check, Flame, Sparkles, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui';
import { useCountdown, formatTimeUnit } from '../hooks';
import { usePreRegistrationStore } from '../stores/usePreRegistrationStore';
import {
  preRegistrationSchema,
  type PreRegistrationFormData,
  defaultFormValues,
  businessCategories,
  formatPhoneNumber,
} from '../schemas/preRegistrationSchema';
import {
  PHASE_A_END,
  PHASE_B_END,
  getCurrentPromotionPhase,
  getCurrentDiscountRate,
  PRICING,
} from '../constants/promotion';
import { formatPrice } from '../utils/pricing';

interface PreRegistrationModalProps {
  onSuccess?: (discountCode: string) => void;
}

export const PreRegistrationModal: React.FC<PreRegistrationModalProps> = ({ onSuccess }) => {
  const {
    isModalOpen,
    selectedPlan,
    isSubmitting,
    error,
    closeModal,
    submitRegistration,
    clearError,
  } = usePreRegistrationStore();

  // 폼 설정
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<PreRegistrationFormData>({
    resolver: zodResolver(preRegistrationSchema),
    defaultValues: defaultFormValues,
  });

  // 프로모션 Phase 및 카운트다운
  const phase = getCurrentPromotionPhase();
  const discountRate = getCurrentDiscountRate();
  const targetDate = phase === 'A' ? PHASE_A_END : PHASE_B_END;
  const countdown = useCountdown(targetDate);

  // 선택된 요금제 감시
  const watchedPlan = watch('selectedPlan');

  // 모달 열릴 때 선택된 요금제 적용, 닫힐 때 폼 리셋
  useEffect(() => {
    if (isModalOpen && selectedPlan) {
      // 모달이 열리면서 선택된 요금제로 설정
      setValue('selectedPlan', selectedPlan);
    } else if (!isModalOpen) {
      // 모달이 닫히면 폼 리셋
      reset(defaultFormValues);
      clearError();
    }
  }, [isModalOpen, selectedPlan, setValue, reset, clearError]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal]);

  // 폼 제출 핸들러
  const onSubmit = async (data: PreRegistrationFormData) => {
    try {
      const response = await submitRegistration({
        ...data,
        agreeMarketing: data.agreeMarketing || false,
      });
      if (onSuccess) {
        onSuccess(response.discountCode);
      }
    } catch (err) {
      // 에러는 스토어에서 처리됨
      console.error('Registration failed:', err);
    }
  };

  // 전화번호 포맷팅 핸들러
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value);
      setValue('phone', formatted, { shouldValidate: true });
    },
    [setValue]
  );

  // Phase 스타일
  const isPhaseA = phase === 'A';
  const accentColor = isPhaseA ? 'rose' : 'emerald';
  const gradientClass = isPhaseA
    ? 'from-rose-500 to-orange-500'
    : 'from-emerald-500 to-cyan-500';
  const PhaseIcon = isPhaseA ? Flame : Sparkles;

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-white/10 shadow-2xl">
        {/* 헤더 */}
        <div className={`relative p-6 border-b border-white/10 bg-gradient-to-r ${gradientClass} rounded-t-2xl`}>
          {/* 닫기 버튼 */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* 타이틀 */}
          <div className="flex items-center gap-3 mb-2">
            <PhaseIcon className="w-8 h-8 text-white" />
            <h2 id="modal-title" className="text-2xl font-bold text-white">
              2026 상반기 시즌 사전 등록
            </h2>
          </div>

          {/* 서브타이틀 + 카운트다운 */}
          <p className="text-white/90 mb-4">
            {isPhaseA
              ? '🔥 지금 등록하면 30% 할인 혜택!'
              : '✨ 지금 등록하면 10% 할인 혜택!'}
          </p>

          {/* 카운트다운 */}
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-4 h-4" />
            <span className="text-sm">할인 마감까지</span>
            <div className="flex items-center gap-1 font-mono font-bold">
              {countdown.days > 0 && (
                <>
                  <span className="bg-white/20 rounded px-2 py-0.5">{countdown.days}</span>
                  <span className="text-white/70">일</span>
                </>
              )}
              <span className="bg-white/20 rounded px-2 py-0.5">{formatTimeUnit(countdown.hours)}</span>
              <span className="text-white/70">:</span>
              <span className="bg-white/20 rounded px-2 py-0.5">{formatTimeUnit(countdown.minutes)}</span>
              <span className="text-white/70">:</span>
              <span className="bg-white/20 rounded px-2 py-0.5">{formatTimeUnit(countdown.seconds)}</span>
            </div>
          </div>
        </div>

        {/* 폼 영역 */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* 에러 메시지 */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 요금제 선택 */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              요금제 선택 <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['plus', 'pro', 'premium'] as const).map((plan) => {
                const pricing = PRICING[plan];
                const isSelected = watchedPlan === plan;
                const discountedPrice = isPhaseA ? pricing.discount30 : pricing.discount10;
                const savings = isPhaseA ? pricing.savings30 : pricing.savings10;

                return (
                  <label
                    key={plan}
                    className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? `border-2 border-${accentColor}-500 bg-${accentColor}-500/10`
                        : 'border border-white/20 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <input
                      type="radio"
                      value={plan}
                      {...register('selectedPlan')}
                      className="sr-only"
                    />

                    {/* 선택 체크 */}
                    {isSelected && (
                      <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-${accentColor}-500 flex items-center justify-center`}>
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* 할인 배지 */}
                    <span className={`inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-xs font-bold mb-2 bg-gradient-to-r ${gradientClass} text-white`}>
                      <PhaseIcon className="w-3 h-3" />
                      {discountRate}% OFF
                    </span>

                    {/* 요금제 이름 */}
                    <span className="font-bold text-white">{pricing.name}</span>

                    {/* 정가 (취소선) */}
                    <span className="text-sm text-white/40 line-through">
                      ₩{formatPrice(pricing.original)}
                    </span>

                    {/* 할인가 */}
                    <span className={`text-lg font-bold text-${accentColor}-400`}>
                      ₩{formatPrice(discountedPrice)}
                    </span>

                    {/* 절약 금액 */}
                    <span className={`text-xs text-${accentColor}-300`}>
                      ₩{formatPrice(savings)} 절약
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.selectedPlan && (
              <p className="mt-2 text-sm text-red-400">{errors.selectedPlan.message}</p>
            )}
          </div>

          {/* 이름 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
              이름 <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all"
              placeholder="홍길동"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* 이메일 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
              이메일 <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all"
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* 전화번호 */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
              전화번호 <span className="text-red-400">*</span>
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <input
                  id="phone"
                  type="tel"
                  {...field}
                  onChange={handlePhoneChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all"
                  placeholder="010-1234-5678"
                />
              )}
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-400">{errors.phone.message}</p>
            )}
          </div>

          {/* 사업 분야 (선택) */}
          <div>
            <label htmlFor="businessCategory" className="block text-sm font-medium text-white/80 mb-2">
              사업 분야 <span className="text-white/40">(선택)</span>
            </label>
            <select
              id="businessCategory"
              {...register('businessCategory')}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all"
            >
              <option value="" className="bg-slate-900">선택해주세요</option>
              {businessCategories.map((category) => (
                <option key={category} value={category} className="bg-slate-900">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* 동의 체크박스 */}
          <div className="space-y-3">
            {/* 개인정보 수집 동의 (필수) */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                {...register('agreeTerms')}
                className="mt-1 w-5 h-5 rounded border-white/30 bg-white/5 text-emerald-500 focus:ring-emerald-500/20"
              />
              <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                <span className="text-red-400">[필수]</span> 개인정보 수집 및 이용에 동의합니다
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-sm text-red-400 ml-8">{errors.agreeTerms.message}</p>
            )}

            {/* 마케팅 정보 수신 동의 (선택) */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                {...register('agreeMarketing')}
                className="mt-1 w-5 h-5 rounded border-white/30 bg-white/5 text-emerald-500 focus:ring-emerald-500/20"
              />
              <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                [선택] 마케팅 정보 수신에 동의합니다 (이벤트, 할인 정보 등)
              </span>
            </label>
          </div>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 text-lg font-bold bg-gradient-to-r ${gradientClass} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                등록 중...
              </>
            ) : (
              <>
                <PhaseIcon className="w-5 h-5 mr-2" />
                사전 등록 완료하기
              </>
            )}
          </Button>

          {/* 안내 문구 */}
          <p className="text-center text-sm text-white/40">
            등록하신 이메일로 할인 코드가 발송됩니다.
            <br />
            정식 오픈 시 해당 코드로 할인가 결제가 가능합니다.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PreRegistrationModal;

