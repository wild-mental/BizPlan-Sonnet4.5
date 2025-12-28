/**
 * 유료 요금제 선택 컴포넌트
 * 평가 결과에서 상세 기능 이용 시 표시되는 요금제 선택 화면
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Flame, Sparkles, Zap } from 'lucide-react';
import { getPlanPricing, getPromotionStatus, formatPrice } from '../utils/pricing';
import type { PlanType } from '../utils/pricing';

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
    cta: '플러스 시작', 
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
    cta: '프로 시작', 
    popular: true 
  },
  { 
    name: '프리미엄', 
    planKey: 'premium',
    originalPrice: 1499000,
    period: '2026 상반기 시즌', 
    features: [
      '프로 기능 전체', 
      { text: '도메인 특화 전문가 매칭', note: '사업 도메인별 선착순 모집' }, 
      { text: '1:1 원격 컨설팅', note: '회당 1시간, 최대 3회 제공' }, 
      '우선 지원'
    ], 
    cta: '프리미엄 시작', 
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
    <div className="min-h-screen bg-slate-950 text-white py-12">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-10">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm mb-6 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              평가 결과로 돌아가기
            </button>
          )}
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
            <Zap className="w-4 h-4" />
            유료 요금제
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-white/60 max-w-xl mx-auto">{description}</p>
        </div>

        {/* 프로모션 배너 */}
        {promoStatus.isActive && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className={`rounded-xl p-4 text-center ${
              promoStatus.isPhaseA 
                ? 'bg-gradient-to-r from-rose-500/20 to-orange-500/20 border border-rose-500/30' 
                : 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                {promoStatus.isPhaseA ? (
                  <Flame className="w-5 h-5 text-rose-400" />
                ) : (
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                )}
                <span className={`font-bold ${promoStatus.isPhaseA ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {promoStatus.isPhaseA ? '🔥 연말연시 특별 30% 할인' : '✨ 얼리버드 10% 할인'}
                </span>
              </div>
              <p className="text-white/60 text-sm">
                {promoStatus.isPhaseA 
                  ? '1월 3일까지 등록하면 최대 할인 혜택!'
                  : '정부지원사업 접수 전까지 사전 등록 할인!'}
              </p>
            </div>
          </div>
        )}

        {/* 요금제 카드 */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {paidPlans.map((plan) => {
            const planPricing = getPlanPricing(plan.planKey);
            const hasDiscount = planPricing.isDiscounted;
            
            return (
              <div 
                key={plan.planKey} 
                className={`glass-card rounded-2xl p-6 relative flex flex-col transition-all hover:scale-[1.02] ${
                  plan.popular 
                    ? 'border-2 border-purple-500 shadow-lg shadow-purple-500/20' 
                    : 'border border-white/10'
                }`}
              >
                {/* 할인 배지 */}
                {hasDiscount && (
                  <div className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    promoStatus.isPhaseA 
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500' 
                      : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                  }`}>
                    {promoStatus.isPhaseA ? <Flame className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                    {promoStatus.discountRate}% OFF
                  </div>
                )}
                
                {/* 인기 배지 */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-xs font-bold">
                    가장 인기
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                
                {/* 가격 영역 */}
                <div className="mb-6">
                  {hasDiscount ? (
                    <>
                      <div className="text-lg text-white/40 line-through">
                        ₩{formatPrice(planPricing.originalPrice)}
                      </div>
                      <div className={`text-3xl font-bold ${
                        promoStatus.isPhaseA ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        ₩{formatPrice(planPricing.currentPrice)}
                      </div>
                      <div className={`text-sm font-medium mt-1 ${
                        promoStatus.isPhaseA ? 'text-rose-300' : 'text-emerald-300'
                      }`}>
                        ₩{formatPrice(planPricing.savings)} 절약!
                      </div>
                    </>
                  ) : (
                    <div className="text-3xl font-bold">₩{formatPrice(plan.originalPrice)}</div>
                  )}
                  <div className="text-sm text-white/60 mt-2">{plan.period}</div>
                </div>
                
                {/* 기능 목록 */}
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((f, j) => {
                    const isObject = typeof f === 'object' && f !== null;
                    const text = isObject ? f.text : f;
                    const note = isObject ? f.note : null;
                    
                    return (
                      <li key={j} className="flex items-start gap-2 text-sm text-white/80">
                        <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span>{text}</span>
                          {note && (
                            <div className="text-xs text-white/40 mt-0.5">{note}</div>
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
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* 하단 안내 */}
        <div className="text-center mt-10 text-white/40 text-sm">
          <p>결제 후 즉시 모든 기능 이용 가능 • 환불 규정 적용</p>
        </div>
      </div>
    </div>
  );
};

export default PaidPlanSelector;

