/**
 * 유료 요금제 선택 컴포넌트
 * 평가 결과에서 상세 기능 이용 시 표시되는 요금제 선택 화면
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Flame, Sparkles, Zap, Clock, Rocket } from 'lucide-react';
import { getPlanPricing, getPromotionStatus, formatPrice } from '../utils/pricing';
import type { PlanType } from '../utils/pricing';
import { PHASE_A_END, PHASE_B_END, PROMO_START_DATE, SERVICE_OPEN_DATE, DISCOUNT_RATE_PHASE_A, DISCOUNT_RATE_PHASE_B } from '../constants/promotion';

// 날짜 포맷팅 유틸리티 함수 (상세 형식)
const formatDateRange = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}.${month}.${day}`;
};

// 날짜 포맷팅 유틸리티 함수 (간단한 M/D 형식)
const formatDateShort = (dateString: string): string => {
  // ISO 문자열에서 날짜 부분만 추출하여 타임존 문제 방지
  const dateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    const month = parseInt(dateMatch[2], 10);
    const day = parseInt(dateMatch[3], 10);
    return `${month}/${day}`;
  }
  // 폴백: 기존 방식
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};

// Phase B 시작일 계산 (Phase A 종료일 다음 날)
const getPhaseBStartDate = (): Date => {
  const phaseAEnd = new Date(PHASE_A_END);
  phaseAEnd.setDate(phaseAEnd.getDate() + 1);
  return phaseAEnd;
};

// 유료 요금제 데이터
const paidPlans: Array<{
  name: string;
  planKey: PlanType;
  originalPrice: number;
  period: string;
  features: Array<string | { text: string; note: string }>;
  cta: string;
  popular: boolean;
}> = [
  { 
    name: '플러스', 
    planKey: 'plus',
    originalPrice: 399000,
    period: '2026 상반기 시즌', 
    features: [
      '기본 기능 전체', 
      '6개 영역 점수 리포트', 
      '통합 개선 피드백 제공', 
      { text: 'AI 고도화 토큰 제공', note: '약 3회 재작성 가능' }
    ], 
    cta: '플러스 사전등록', 
    popular: false 
  },
  { 
    name: '프로', 
    planKey: 'pro',
    originalPrice: 799000,
    period: '2026 상반기 시즌', 
    features: [
      '플러스 기능 전체', 
      '80점 미달 시 재작성 루프', 
      '파트별 고도화 피드백', 
      { text: '토큰 제한 없는 무제한 수정', note: '제출 마감까지 제공' }
    ], 
    cta: '프로 사전등록', 
    popular: true 
  },
  { 
    name: '프리미엄', 
    planKey: 'premium',
    originalPrice: 1199000,
    period: '2026 상반기 시즌', 
    features: [
      '프로 기능 전체', 
      { text: '도메인 특화 전문가 매칭', note: '사업 도메인별 선착순 모집' }, 
      { text: '1:1 원격 컨설팅', note: '회당 1시간, 최대 3회 제공' }, 
      '우선 지원'
    ], 
    cta: '프리미엄 사전등록', 
    popular: false 
  },
];

interface PaidPlanSelectorProps {
  /** 표시 제목 */
  title?: string;
  /** 설명 텍스트 */
  description?: string;
  /** 뒤로가기 핸들러 */
  onBack?: () => void;
}

export const PaidPlanSelector: React.FC<PaidPlanSelectorProps> = ({
  title = '요금제 선택',
  description = '상세 피드백과 개선 전략을 확인하려면 요금제를 선택하세요.',
  onBack,
}) => {
  const navigate = useNavigate();
  const promoStatus = getPromotionStatus();

  // 요금제 선택 핸들러
  const handleSelectPlan = (planKey: PlanType) => {
    // 회원가입 페이지로 이동 (plan 파라미터 포함)
    navigate(`/signup?plan=${planKey}`, { replace: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 text-slate-900 py-12">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 border border-purple-200 text-purple-600 text-sm mb-6">
            <Zap className="w-4 h-4" />
            유료 요금제 사전등록
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">{title}</h1>
          <p className="text-slate-500 max-w-xl mx-auto">{description}</p>
        </div>

        {/* 프로모션 배너 */}
        {promoStatus.isActive && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-center mb-4 flex items-center justify-center gap-2 text-slate-800">
                <Clock className="w-4 h-4 text-purple-600" />
                사전 등록 프로모션 일정
              </h3>
              
              {/* 타임라인 */}
              <div className="relative">
                {/* 배경 라인 - Phase A, B 부분 */}
                <div className="absolute top-5 left-0 w-[75%] h-1 bg-slate-200 rounded-l-full" />
                
                {/* 배경 라인 - 서비스 오픈 부분 (미세한 파란색) */}
                <div className="absolute top-5 right-0 w-[25%] h-1 bg-blue-400/20 rounded-r-full" />
                
                {/* 진행 상태 표시 */}
                <div className={`absolute top-5 left-0 h-1 rounded-full transition-all duration-500 ${
                  promoStatus.isPhaseA 
                    ? 'w-[40%] bg-gradient-to-r from-rose-500 to-orange-500' 
                    : promoStatus.isPhaseB
                    ? 'w-[75%] bg-gradient-to-r from-rose-500 via-orange-500 to-emerald-500'
                    : 'w-[75%] bg-gradient-to-r from-rose-500 via-orange-500 to-emerald-500'
                }`} />
                
                {/* 기간 표시 */}
                <div className="relative flex items-start">
                  {/* Phase A: 연말연시 특별 */}
                  <div className={`flex-[1.5] text-center ${promoStatus.isPhaseA ? 'opacity-100' : 'opacity-50'}`}>
                    <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                      promoStatus.isPhaseA 
                        ? 'bg-gradient-to-r from-rose-500 to-orange-500 shadow-lg shadow-rose-500/30' 
                        : 'bg-slate-200'
                    }`}>
                      <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm font-bold text-slate-800 mb-0.5">🔥 연말연시 특별</div>
                    <div className={`text-xl font-bold ${promoStatus.isPhaseA ? 'text-rose-500' : 'text-slate-400'}`}>
                      {DISCOUNT_RATE_PHASE_A}% 할인
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatDateShort(PROMO_START_DATE)} ~ {formatDateShort(PHASE_A_END)}
                    </div>
                    {promoStatus.isPhaseA && (
                      <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-rose-500/20 rounded-full text-xs text-rose-600 font-medium">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                        진행 중
                      </div>
                    )}
                  </div>
                  
                  {/* Phase B: 얼리버드 특가 */}
                  <div className={`flex-[1.5] text-center ${promoStatus.isPhaseB ? 'opacity-100' : 'opacity-50'}`}>
                    <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                      promoStatus.isPhaseB 
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30' 
                        : 'bg-slate-200'
                    }`}>
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm font-bold text-slate-800 mb-0.5">✨ 얼리버드 특가</div>
                    <div className={`text-xl font-bold ${promoStatus.isPhaseB ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {DISCOUNT_RATE_PHASE_B}% 할인
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatDateShort(getPhaseBStartDate().toISOString())} ~ {formatDateShort(PHASE_B_END)}
                    </div>
                    {promoStatus.isPhaseB && (
                      <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 rounded-full text-xs text-emerald-600 font-medium">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        진행 중
                      </div>
                    )}
                  </div>
                  
                  {/* 서비스 오픈 */}
                  <div className="flex-[1] text-center opacity-50">
                    <div className="w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1.5 bg-slate-200">
                      <Rocket className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="text-xs font-bold text-slate-800 mb-0.5">🚀 서비스 오픈</div>
                    <div className="text-sm font-bold text-slate-400">
                      정식 오픈
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatDateShort(SERVICE_OPEN_DATE)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 안내 메시지 */}
              <div className="mt-3 text-center text-xs text-slate-500">
                {promoStatus.isPhaseA ? (
                  <span>연말연시 기간에 등록하면 <strong className="text-rose-600">추가 20% 절약</strong> 혜택!</span>
                ) : (
                  <span>정부지원사업 접수 시작일 전까지 사전 등록 시 할인 적용</span>
                )}
              </div>
              
              <p className="text-center text-xs text-slate-400 mt-2">
                사전등록 시 할인코드가 이메일로 발송됩니다
              </p>
            </div>
          </div>
        )}

        {/* 요금제 카드 */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {paidPlans.map((plan) => {
            const planPricing = getPlanPricing(plan.planKey);
            // 프로모션이 활성화되어 있는 경우 할인 적용
            const hasDiscount = promoStatus.isActive && planPricing.isDiscounted;
            
            return (
              <div 
                key={plan.planKey} 
                className={`bg-white rounded-2xl p-6 relative flex flex-col transition-all hover:scale-[1.02] shadow-lg ${
                  plan.popular 
                    ? 'border-2 border-purple-500 shadow-purple-500/20' 
                    : 'border border-slate-200'
                }`}
              >
                {/* 할인 배지 */}
                {hasDiscount && (
                  <div className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 text-white ${
                    promoStatus.isPhaseA 
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500' 
                      : 'bg-gradient-to-r from-purple-500 to-blue-500'
                  }`}>
                    {promoStatus.isPhaseA ? <Flame className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                    {promoStatus.discountRate}% OFF
                  </div>
                )}
                
                {/* 요금제명과 인기 배지 */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                  {plan.popular && (
                    <div className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-xs font-bold text-white whitespace-nowrap">
                      가장 인기
                    </div>
                  )}
                </div>
                
                {/* 가격 영역 */}
                <div className="mb-6 min-w-0">
                  {hasDiscount ? (
                    <>
                      <div className="text-lg text-slate-400 line-through break-words">
                        ₩{formatPrice(planPricing.originalPrice)}
                      </div>
                      <div className={`text-2xl sm:text-3xl font-bold break-words overflow-wrap-anywhere ${
                        promoStatus.isPhaseA ? 'text-rose-500' : 'text-purple-600'
                      }`}>
                        ₩{formatPrice(planPricing.currentPrice)}
                      </div>
                      <div className={`text-sm font-medium mt-1 break-words ${
                        promoStatus.isPhaseA ? 'text-rose-400' : 'text-purple-500'
                      }`}>
                        ₩{formatPrice(planPricing.savings)} 절약!
                      </div>
                    </>
                  ) : (
                    <div className="text-2xl sm:text-3xl font-bold text-slate-800 break-words overflow-wrap-anywhere">₩{formatPrice(plan.originalPrice)}</div>
                  )}
                  <div className="text-sm text-slate-500 mt-2 break-words">{plan.period}</div>
                </div>
                
                {/* 기능 목록 */}
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((f, j) => {
                    const isObject = typeof f === 'object' && f !== null;
                    const text = isObject ? f.text : f;
                    const note = isObject ? f.note : null;
                    
                    return (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span>{text}</span>
                          {note && (
                            <div className="text-xs text-slate-400 mt-0.5">{note}</div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
                
                {/* CTA 버튼 */}
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan.planKey)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all cursor-pointer ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* 하단 안내 */}
        <div className="text-center mt-10 space-y-4">
          <div className="max-w-2xl mx-auto p-4 bg-slate-100 rounded-xl border border-slate-200">
            <p className="text-slate-600 text-sm font-medium mb-2">📧 사전등록 프로세스 안내</p>
            <ul className="text-slate-500 text-xs space-y-1">
              <li>1. 사전등록 완료 시 할인코드가 포함된 이메일이 발송됩니다</li>
              <li>2. 서비스 정식 오픈 후 할인코드로 결제를 진행합니다</li>
              <li>3. <strong className="text-slate-700">현재 단계에서는 결제가 발생하지 않습니다</strong></li>
            </ul>
          </div>
          
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-800 text-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              평가 결과로 돌아가기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaidPlanSelector;

