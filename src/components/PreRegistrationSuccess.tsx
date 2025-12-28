/**
 * 사전 등록 완료 화면 컴포넌트
 * Pre-registration success screen with discount code and sharing
 */

import React, { useState, useMemo } from 'react';
import { Check, Copy, CheckCircle2, Share2, X } from 'lucide-react';
import { Button } from './ui';
import { usePreRegistrationStore } from '../stores/usePreRegistrationStore';
import { formatPrice } from '../utils/pricing';
import { getCurrentPromotionPhase } from '../constants/promotion';

interface PreRegistrationSuccessProps {
  onClose?: () => void;
}

export const PreRegistrationSuccess: React.FC<PreRegistrationSuccessProps> = ({ onClose }) => {
  const { lastRegistration, clearLastRegistration } = usePreRegistrationStore();
  const [isCopied, setIsCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // 프로모션 Phase
  const phase = getCurrentPromotionPhase();
  const isPhaseA = phase === 'A';
  const gradientClass = isPhaseA
    ? 'from-rose-500 to-orange-500'
    : 'from-emerald-500 to-cyan-500';

  // 컨페티 위치 미리 계산 (렌더 중 Math.random 호출 방지)
  const confettiItems = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      backgroundColor: ['#F97316', '#10B981', '#8B5CF6', '#EC4899', '#3B82F6'][i % 5],
      left: `${(i * 17 + 5) % 100}%`,
      top: `${(i * 23 + 10) % 100}%`,
      animationDelay: `${(i * 0.1) % 2}s`,
      animationDuration: `${1 + (i % 3) * 0.3}s`,
    }));
  }, []);

  // 할인 코드 복사
  const handleCopyCode = async () => {
    if (!lastRegistration?.discountCode) return;

    try {
      await navigator.clipboard.writeText(lastRegistration.discountCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 닫기 핸들러
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      clearLastRegistration();
    }
  };

  // 공유 URL
  const shareUrl = 'https://makersround.world';
  const shareTitle = 'Makers Round - AI 사업계획서 심사 서비스';
  const shareText = lastRegistration
    ? `🎉 Makers Round 사전 등록 완료! ${lastRegistration.discountRate}% 할인 혜택을 받았어요. 당신도 지금 등록하세요!`
    : '';

  // Web Share API 사용
  const handleShare = async (method: 'native' | 'twitter' | 'copy') => {
    if (method === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else if (method === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    } else if (method === 'copy') {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert('링크가 복사되었습니다!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }

    setShowShareOptions(false);
  };

  // 등록 정보가 없으면 렌더링하지 않음
  if (!lastRegistration) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-title"
    >
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative w-full max-w-md glass-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          aria-label="닫기"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* 성공 아이콘 배경 */}
        <div className={`relative h-32 bg-gradient-to-r ${gradientClass} flex items-center justify-center`}>
          {/* 애니메이션 체크 아이콘 */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
          </div>

          {/* 컨페티 효과 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confettiItems.map((item) => (
              <div
                key={item.id}
                className="absolute w-2 h-2 rounded-full animate-bounce"
                style={{
                  backgroundColor: item.backgroundColor,
                  left: item.left,
                  top: item.top,
                  animationDelay: item.animationDelay,
                  animationDuration: item.animationDuration,
                }}
              />
            ))}
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="p-6 text-center">
          {/* 타이틀 */}
          <h2 id="success-title" className="text-2xl font-bold text-white mb-2">
            🎉 사전 등록이 완료되었습니다!
          </h2>
          <p className="text-white/60 mb-6">
            할인 코드가 이메일로 발송되었습니다.
          </p>

          {/* 할인 코드 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
            <p className="text-sm text-white/60 mb-2">할인 코드</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-mono font-bold text-white tracking-wider">
                {lastRegistration.discountCode}
              </span>
              <button
                onClick={handleCopyCode}
                className={`p-2 rounded-lg transition-all ${
                  isCopied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
                title="복사하기"
              >
                {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {isCopied && (
              <p className="text-sm text-emerald-400 mt-2">복사되었습니다!</p>
            )}
          </div>

          {/* 등록 요약 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/60">선택 요금제</span>
              <span className="font-semibold text-white">
                {lastRegistration.selectedPlan === 'plus'
                  ? '플러스'
                  : lastRegistration.selectedPlan === 'pro'
                  ? '프로'
                  : '프리미엄'}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/60">정가</span>
              <span className="text-white/40 line-through">
                ₩{formatPrice(lastRegistration.originalPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">할인가</span>
              <span className={`text-lg font-bold ${isPhaseA ? 'text-rose-400' : 'text-emerald-400'}`}>
                ₩{formatPrice(lastRegistration.discountedPrice)}
              </span>
            </div>
            <div className="border-t border-white/10 mt-3 pt-3 flex justify-between items-center">
              <span className="text-white/60">절약 금액</span>
              <span className={`font-bold ${isPhaseA ? 'text-rose-300' : 'text-emerald-300'}`}>
                ₩{formatPrice(lastRegistration.originalPrice - lastRegistration.discountedPrice)} 절약!
              </span>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="text-sm text-white/50 mb-6 space-y-1">
            <p>• 정식 오픈 시 등록하신 이메일로 안내드립니다.</p>
            <p>• 결제 시 할인 코드를 입력해주세요.</p>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex gap-3">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 bg-white/10 hover:bg-white/20 border-white/20"
            >
              홈으로 돌아가기
            </Button>
            
            <div className="relative">
              <Button
                onClick={() => {
                  if ('share' in navigator && typeof navigator.share === 'function') {
                    handleShare('native');
                  } else {
                    setShowShareOptions(!showShareOptions);
                  }
                }}
                className={`bg-gradient-to-r ${gradientClass}`}
              >
                <Share2 className="w-4 h-4 mr-2" />
                공유하기
              </Button>

              {/* 공유 옵션 드롭다운 */}
              {showShareOptions && (
                <div className="absolute bottom-full right-0 mb-2 bg-slate-800 border border-white/10 rounded-lg shadow-xl overflow-hidden">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    <span>🐦</span>
                    Twitter/X
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors border-t border-white/10"
                  >
                    <Copy className="w-4 h-4" />
                    링크 복사
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreRegistrationSuccess;

