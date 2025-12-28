/**
 * 요금제 카드 컴포넌트 (공통)
 * LandingPage, TeamPage 등에서 공유하여 사용
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Flame, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { pricingPlans, PlanFeature } from '../constants/pricingPlans';
import { getPromotionStatus, getPlanPricing, formatPrice } from '../utils/pricing';
import { usePreRegistrationStore } from '../stores/usePreRegistrationStore';
import { PROMO_START_DATE, PHASE_A_END, PHASE_B_END } from '../constants/promotion';

// 날짜 포맷팅 유틸리티 함수 (간단한 M/D 형식)
const formatDateShort = (dateString: string): string => {
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

interface PricingCardsProps {
  /** 프로모션 타임테이블 표시 여부 */
  showTimetable?: boolean;
  /** 무료 요금제에 데모 버튼 표시 여부 */
  showDemoButtons?: boolean;
  /** 요금제 선택 시 커스텀 핸들러 (없으면 기본 동작) */
  onPlanSelect?: (planName: string) => void;
}

/**
 * 요금제 카드 그리드 컴포넌트
 */
export const PricingCards: React.FC<PricingCardsProps> = ({
  showTimetable = true,
  showDemoButtons = true,
  onPlanSelect,
}) => {
  const navigate = useNavigate();
  const { openModal } = usePreRegistrationStore();
  const promoStatus = getPromotionStatus();

  // 요금제 선택 핸들러
  const handlePlanSelect = (planName: string) => {
    if (onPlanSelect) {
      onPlanSelect(planName);
      return;
    }

    // 기본 동작: 프로모션 중이면 사전등록 모달, 아니면 회원가입
    const plan = pricingPlans.find(p => p.name === planName);
    if (plan?.planKey && promoStatus.isActive) {
      openModal(plan.planKey);
    } else {
      navigate(`/signup?plan=${encodeURIComponent(planName)}`);
    }
  };

  return (
    <>
      {/* 프로모션 타임테이블 */}
      {showTimetable && promoStatus.isActive && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="glass-card rounded-2xl p-4 border border-white/10">
            <h3 className="text-lg font-bold text-center mb-4">사전 등록 프로모션 일정</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phase A */}
              <div className={`rounded-xl p-4 ${promoStatus.isPhaseA ? 'bg-gradient-to-r from-rose-500/20 to-orange-500/20 border border-rose-500/30' : 'bg-white/5 border border-white/10'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Flame className={`w-5 h-5 ${promoStatus.isPhaseA ? 'text-rose-400' : 'text-white/40'}`} />
                  <span className={`font-bold ${promoStatus.isPhaseA ? 'text-rose-400' : 'text-white/40'}`}>
                    연말연시 특별 30% 할인
                  </span>
                  {promoStatus.isPhaseA && (
                    <span className="ml-auto text-xs bg-rose-500 px-2 py-0.5 rounded-full">진행 중</span>
                  )}
                </div>
                <p className={`text-sm ${promoStatus.isPhaseA ? 'text-white/70' : 'text-white/40'}`}>
                  {formatDateShort(PROMO_START_DATE)} ~ {formatDateShort(PHASE_A_END)}
                </p>
              </div>
              
              {/* Phase B */}
              <div className={`rounded-xl p-4 ${promoStatus.isPhaseB ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30' : 'bg-white/5 border border-white/10'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className={`w-5 h-5 ${promoStatus.isPhaseB ? 'text-emerald-400' : 'text-white/40'}`} />
                  <span className={`font-bold ${promoStatus.isPhaseB ? 'text-emerald-400' : 'text-white/40'}`}>
                    얼리버드 특가 10% 할인
                  </span>
                  {promoStatus.isPhaseB && (
                    <span className="ml-auto text-xs bg-emerald-500 px-2 py-0.5 rounded-full">진행 중</span>
                  )}
                </div>
                <p className={`text-sm ${promoStatus.isPhaseB ? 'text-white/70' : 'text-white/40'}`}>
                  {formatDateShort(getPhaseBStartDate().toISOString())} ~ {formatDateShort(PHASE_B_END)}
                </p>
              </div>
            </div>
            
            {promoStatus.isPhaseA && (
              <p className="text-center text-sm text-orange-300 mt-3">
                연말연시 기간에 등록하면 추가 20% 절약 혜택!
              </p>
            )}
          </div>
        </div>
      )}

      {/* 요금제 카드 그리드 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {pricingPlans.map((plan, i) => {
          const planPricing = plan.planKey ? getPlanPricing(plan.planKey) : null;
          // 프로모션이 활성화되어 있고, 요금제가 유료인 경우 할인 적용
          const hasDiscount = planPricing && promoStatus.isActive && planPricing.isDiscounted;
          
          return (
            <div 
              key={i} 
              className={`glass-card rounded-2xl p-6 hover-lift relative flex flex-col ${
                plan.popular ? 'border-2 border-purple-500 glow-purple' : 'border border-white/10'
              }`}
            >
              {/* 할인 배지 (유료 요금제만) */}
              {hasDiscount && (
                <div className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse ${
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
              <div className="mb-6 min-w-0">
                {plan.planKey === null ? (
                  <div className="text-3xl font-bold text-white/50 break-words">₩0 <span className="text-lg">(무료 데모)</span></div>
                ) : hasDiscount && planPricing ? (
                  <>
                    {/* 정가 (취소선) */}
                    <div className="text-lg text-white/40 line-through break-words">
                      ₩{formatPrice(planPricing.originalPrice)}
                    </div>
                    {/* 할인가 */}
                    <div className={`text-2xl sm:text-3xl font-bold break-words overflow-wrap-anywhere ${
                      promoStatus.isPhaseA ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      ₩{formatPrice(planPricing.currentPrice)}
                    </div>
                    {/* 절약 금액 */}
                    <div className={`text-sm font-medium mt-1 break-words ${
                      promoStatus.isPhaseA ? 'text-rose-300' : 'text-emerald-300'
                    }`}>
                      ₩{formatPrice(planPricing.savings)} 절약!
                    </div>
                    {/* Phase A 추가 절약 표시 */}
                    {promoStatus.isPhaseA && planPricing.extraSavingsVsPhaseB > 0 && (
                      <div className="text-xs text-orange-300 mt-1 break-words">
                        연말 특가 추가 혜택 ₩{formatPrice(planPricing.extraSavingsVsPhaseB)}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-2xl sm:text-3xl font-bold break-words overflow-wrap-anywhere">₩{plan.price}</div>
                )}
                {plan.period && <div className="text-sm text-white/60 mt-2 break-words">{plan.period}</div>}
              </div>
              
              {/* 기능 목록 */}
              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((f: PlanFeature, j: number) => {
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
              {plan.name === '기본' && showDemoButtons ? (
                // 무료 데모 전용: 두 개의 버튼이 있는 카드 영역
                <div className="bg-white/5 rounded-lg p-3 space-y-2">
                  <p className="text-xs text-white/50 text-center mb-2">무료 데모 바로가기</p>
                  <Button 
                    onClick={() => navigate('/writing-demo')} 
                    className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-sm py-2"
                  >
                    사업계획서 작성 데모
                  </Button>
                  <Button 
                    onClick={() => navigate('/demo/evaluation')} 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-sm py-2"
                  >
                    AI 평가받기 데모
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => handlePlanSelect(plan.name)} 
                  className={`w-full ${
                    hasDiscount && promoStatus.isPhaseA
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400'
                      : plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                        : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {hasDiscount && promoStatus.isPhaseA ? (
                    <>
                      <Flame className="w-4 h-4 mr-1" />
                      연말연시 특가 등록
                    </>
                  ) : hasDiscount ? (
                    '사전 등록하기'
                  ) : (
                    plan.cta
                  )}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

