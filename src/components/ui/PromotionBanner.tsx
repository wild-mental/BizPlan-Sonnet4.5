/**
 * PromotionBanner - 사전 등록 프로모션 배너 컴포넌트
 * 페이지 최상단에 고정되어 프로모션 정보와 카운트다운을 표시합니다.
 */

import React, { useState, useEffect } from 'react';
import { X, Clock, Sparkles, Flame } from 'lucide-react';
import { useCountdown, formatTimeUnit } from '../../hooks';
import {
  PHASE_A_END,
  PHASE_B_END,
  getCurrentPromotionPhase,
  getCurrentDiscountRate,
  isPromotionActive,
  type PromotionPhase,
} from '../../constants/promotion';

// localStorage 키
const BANNER_HIDDEN_KEY = 'promo_banner_hidden_until';
const HIDE_DURATION_MS = 24 * 60 * 60 * 1000; // 24시간

interface PromotionBannerProps {
  onRegisterClick?: () => void;
}

export const PromotionBanner: React.FC<PromotionBannerProps> = ({ onRegisterClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  
  // 현재 프로모션 Phase 확인
  const phase = getCurrentPromotionPhase();
  const discountRate = getCurrentDiscountRate();
  
  // Phase에 따른 카운트다운 대상 날짜 결정
  const targetDate = phase === 'A' ? PHASE_A_END : PHASE_B_END;
  const countdown = useCountdown(targetDate);

  // 배너 표시 여부 확인 (localStorage 기반)
  useEffect(() => {
    if (!isPromotionActive()) {
      setIsVisible(false);
      return;
    }

    const hiddenUntil = localStorage.getItem(BANNER_HIDDEN_KEY);
    if (hiddenUntil) {
      const hiddenUntilTime = parseInt(hiddenUntil, 10);
      if (Date.now() < hiddenUntilTime) {
        setIsVisible(false);
        return;
      }
    }
    
    setIsVisible(true);
  }, []);

  // 배너 닫기 핸들러 (24시간 숨김)
  const handleClose = () => {
    const hideUntil = Date.now() + HIDE_DURATION_MS;
    localStorage.setItem(BANNER_HIDDEN_KEY, hideUntil.toString());
    setIsVisible(false);
  };

  // 등록하기 클릭 핸들러
  const handleRegisterClick = () => {
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      // 기본 동작: pricing 섹션으로 스크롤
      const pricingSection = document.getElementById('pricing-section');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // 프로모션이 종료되었거나 배너가 숨겨진 경우
  if (!isVisible || phase === 'ENDED') {
    return null;
  }

  // Phase별 스타일 결정
  const isPhaseA = phase === 'A';
  const gradientClass = isPhaseA
    ? 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500'
    : 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500';
  
  const PhaseIcon = isPhaseA ? Flame : Sparkles;
  const phaseLabel = isPhaseA ? '연말연시 특별' : '공고 전 얼리버드';
  const countdownLabel = isPhaseA ? '30% 할인 마감까지' : '10% 할인 마감까지';

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-[60] ${gradientClass} shadow-lg`}
      role="banner"
      aria-label="프로모션 배너"
    >
      {/* 데스크톱/태블릿 뷰 */}
      <div className="hidden sm:flex items-center justify-between h-10 px-4 md:px-6 max-w-7xl mx-auto">
        {/* 왼쪽: 할인율 배지 */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-0.5 text-sm font-bold text-white">
            <PhaseIcon className="w-4 h-4" />
            {discountRate}% OFF
          </span>
          <span className="text-white/90 text-sm font-medium hidden md:inline">
            {phaseLabel}
          </span>
        </div>

        {/* 중앙: 카운트다운 */}
        <div className="flex items-center gap-3 text-white">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{countdownLabel}</span>
          <div className="flex items-center gap-1 font-mono font-bold text-lg">
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

        {/* 오른쪽: CTA + 닫기 버튼 */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRegisterClick}
            className="bg-white text-slate-900 hover:bg-white/90 transition-colors px-4 py-1.5 rounded-full text-sm font-semibold"
          >
            지금 등록하기
          </button>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="배너 닫기"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* 모바일 뷰 */}
      <div className="sm:hidden">
        {/* 축소 상태 */}
        <div 
          className={`flex items-center justify-between h-12 px-4 ${isMobileExpanded ? 'hidden' : 'flex'}`}
          onClick={() => setIsMobileExpanded(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setIsMobileExpanded(true)}
        >
          <div className="flex items-center gap-2">
            <PhaseIcon className="w-4 h-4 text-white" />
            <span className="text-white font-bold">{discountRate}% 할인</span>
          </div>
          
          <div className="flex items-center gap-2 font-mono font-bold text-white">
            <Clock className="w-4 h-4" />
            {countdown.days > 0 && <span>{countdown.days}일</span>}
            <span>
              {formatTimeUnit(countdown.hours)}:{formatTimeUnit(countdown.minutes)}:{formatTimeUnit(countdown.seconds)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="p-1"
            aria-label="배너 닫기"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* 확장 상태 */}
        {isMobileExpanded && (
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-white">
                <PhaseIcon className="w-4 h-4" />
                {phaseLabel} {discountRate}% OFF
              </span>
              <button
                onClick={handleClose}
                className="p-1"
                aria-label="배너 닫기"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-white">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{countdownLabel}</span>
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

            <div className="flex gap-2">
              <button
                onClick={handleRegisterClick}
                className="flex-1 bg-white text-slate-900 hover:bg-white/90 transition-colors py-2 rounded-full text-sm font-semibold"
              >
                지금 등록하기
              </button>
              <button
                onClick={() => setIsMobileExpanded(false)}
                className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium"
              >
                접기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionBanner;

