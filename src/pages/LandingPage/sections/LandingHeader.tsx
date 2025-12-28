/**
 * 파일명: LandingHeader.tsx
 * 
 * 파일 용도:
 * 랜딩페이지 헤더 네비게이션 컴포넌트
 * - 고정 헤더 네비게이션
 * - BGM 토글 기능
 * - 스크롤 시 스타일 변경
 */

import React, { memo } from 'react';
import { Rocket, FileText, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../../../components/ui';
import { useMusicStore } from '../../../stores/useMusicStore';

interface NavLink {
  label: string;
  href: string;
}

interface LandingHeaderProps {
  /** 스크롤 상태 */
  isScrolled: boolean;
  /** 배너 표시 여부 */
  isBannerVisible: boolean;
  /** 섹션 스크롤 함수 */
  scrollToSection: (href: string) => void;
  /** CTA 클릭 핸들러 */
  onCTAClick: () => void;
  /** 네비게이션 링크 */
  navLinks: NavLink[];
}

/**
 * LandingHeader 컴포넌트
 * 
 * 역할:
 * - 랜딩페이지 상단 고정 헤더
 * - 네비게이션 링크 제공
 * - BGM 토글 기능
 * - CTA 버튼
 */
export const LandingHeader: React.FC<LandingHeaderProps> = memo(({
  isScrolled,
  isBannerVisible,
  scrollToSection,
  onCTAClick,
  navLinks,
}) => {
  const { isPlaying: isBgmPlaying, togglePlay: toggleBgm } = useMusicStore();

  return (
    <header
      className={`fixed left-0 w-full z-50 transition-all duration-300 ${
        isBannerVisible ? 'top-12 sm:top-10' : 'top-0'
      } ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Left - Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 group"
          aria-label="홈으로 이동"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-shadow">
            <Rocket className="w-5 h-5" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-lg leading-tight">Makers Round</span>
            <span className="text-white/40 text-xs hidden md:block">by Makers World</span>
          </div>
        </button>

        {/* Center - Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link, i) => (
            <button
              key={i}
              onClick={() => scrollToSection(link.href)}
              className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              aria-label={`${link.label} 섹션으로 이동`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right - BGM Toggle + CTA Button */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* BGM Toggle Switch */}
          <button
            onClick={toggleBgm}
            className="relative flex items-center gap-2 group"
            aria-label={isBgmPlaying ? 'BGM 끄기' : 'BGM 켜기'}
            aria-pressed={isBgmPlaying}
          >
            {/* Label */}
            <span className={`text-xs font-medium transition-colors hidden sm:block ${isBgmPlaying ? 'text-emerald-400' : 'text-white/50'}`}>
              BGM
            </span>

            {/* Toggle Track */}
            <div className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              isBgmPlaying
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30'
                : 'bg-white/10 hover:bg-white/15'
            }`}>
              {/* Toggle Knob */}
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300 ${
                isBgmPlaying ? 'left-8' : 'left-1'
              }`}>
                {isBgmPlaying ? (
                  <Volume2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                ) : (
                  <VolumeX className="w-3 h-3 text-slate-400" aria-hidden="true" />
                )}
              </div>

              {/* Playing Indicator */}
              {isBgmPlaying && (
                <div className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
                </div>
              )}
            </div>
          </button>

          {/* CTA Button */}
          <Button
            onClick={onCTAClick}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-5 py-2.5 text-sm font-semibold border-0 shadow-lg shadow-purple-500/20"
            aria-label="사업계획서 작성 시작"
          >
            <FileText className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">사업계획서 작성</span>
            <span className="sm:hidden">시작하기</span>
          </Button>
        </div>
      </nav>
    </header>
  );
});

LandingHeader.displayName = 'LandingHeader';

