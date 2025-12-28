/**
 * 파일명: HeroSection.tsx
 * 
 * 파일 용도:
 * 랜딩페이지 히어로 섹션 컴포넌트
 * - 메인 헤드라인 및 CTA 버튼
 * - 배경 비디오 및 애니메이션 효과
 * - 플리핑 텍스트 애니메이션
 */

import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui';
import {
  Clock, Target, FileText, ArrowRight, ChevronRight, Cpu
} from 'lucide-react';

interface HeroSectionProps {
  /** 플리핑 텍스트 인덱스 */
  heroFlipIndex: number;
  /** 플리핑 애니메이션 상태 */
  isFlipping: boolean;
  /** CTA 클릭 핸들러 */
  onCTAClick: () => void;
  /** 섹션 스크롤 함수 */
  scrollToElement: (id: string) => void;
}

const heroFlipTexts = [
  { text: '예비창업패키지 합격', color: 'text-emerald-400' },
  { text: '초기창업패키지 합격', color: 'text-cyan-400' },
  { text: '정책자금지원 합격', color: 'text-blue-400' },
];

/**
 * HeroSection 컴포넌트
 * 
 * 역할:
 * - 랜딩페이지 메인 히어로 섹션
 * - 플리핑 텍스트 애니메이션
 * - CTA 버튼 제공
 */
export const HeroSection: React.FC<HeroSectionProps> = memo(({
  heroFlipIndex,
  isFlipping,
  onCTAClick,
  scrollToElement,
}) => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950">
      {/* Hero Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-label="배경 비디오"
        >
          <source src="/assets/MakersRoundHeroVideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950" />
      </div>

      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight animate-fade-in-up">
            <span className="text-flip-container">
              <span
                key={heroFlipIndex}
                className={`text-flip-item ${heroFlipTexts[heroFlipIndex].color} ${isFlipping ? 'text-flip-out' : 'text-flip-in'}`}
              >
                {heroFlipTexts[heroFlipIndex].text}
              </span>
            </span>
            <br />
            <span>사업계획서,</span>
            <br />
            <span className="text-gradient bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">최고의 </span>
            <span className="relative inline-block">
              <span className="text-gradient bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">AI 심사위원단</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 8C50 2 100 2 150 6C200 10 250 8 298 4" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="underline-gradient" x1="0" y1="0" x2="300" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="text-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">과 함께</span>
          </h1>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in w-full max-w-full px-4" style={{ animationDelay: '0.5s' }}>
            <Button
              size="lg"
              onClick={onCTAClick}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 px-4 sm:px-12 py-6 text-base sm:text-xl font-bold shadow-2xl shadow-emerald-500/25 border-0 group break-keep text-center w-full sm:w-auto"
              aria-label="사업계획서 작성 시작"
            >
              <span className="break-keep">지금 바로 작성하기</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Button>
            <Button
              size="lg"
              onClick={() => navigate('/evaluation-demo')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-4 sm:px-12 py-6 text-base sm:text-xl font-bold shadow-2xl shadow-purple-500/25 border-0 group break-keep text-center w-full sm:w-auto"
              aria-label="AI 심사위원단 평가 받기"
            >
              <span className="break-keep">지금 바로 심사받기</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Button>
            <Button
              size="lg"
              onClick={() => scrollToElement('makers-section')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 sm:px-12 py-6 text-base sm:text-xl font-bold shadow-2xl shadow-white/5 group break-keep text-center w-full sm:w-auto"
              aria-label="심사 영역 알아보기"
            >
              <span className="break-keep">심사 영역 알아보기</span>
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Button>
          </div>

          {/* Subheadlines */}
          <div className="space-y-4 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-xl md:text-2xl text-white/80 flex items-center justify-center gap-3">
              <Cpu className="w-6 h-6 text-cyan-400" aria-hidden="true" />
              <span>여섯가지 핵심 심사 영역별 <strong className="text-white">AI Multi-Agent</strong>가<br/>심사위원 관점의 완벽한 컨설팅을 제공합니다.</span>
            </p>
          </div>

          {/* Key Benefits */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.7s' }}>
            {[
              { icon: Clock, title: '쉽고 빠른 작성', desc: '영역별 답변으로 사업계획서 자동 생성', color: 'emerald' },
              { icon: Target, title: '합격률 극대화', desc: 'M.A.K.E.R.S 6가지 심사기준 사전 검증', color: 'cyan' },
              { icon: FileText, title: '즉시 다운로드', desc: '바로 제출 가능한 HWP/PDF 양식', color: 'blue' },
            ].map((item, i) => (
              <div key={i} className={`glass-card rounded-2xl p-6 hover-lift border border-${item.color}-500/20 flex-1 w-full sm:w-auto`}>
                <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/20 flex items-center justify-center mb-4 mx-auto`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-400`} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-8 h-12 rounded-full border-2 border-white/20 flex items-start justify-center p-2" aria-label="스크롤 안내">
              <div className="w-1.5 h-3 bg-white/40 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

