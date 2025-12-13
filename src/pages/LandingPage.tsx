/**
 * Makers Round 울트라 프리미엄 랜딩페이지
 * M.A.K.E.R.S AI 심사위원단 시스템
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import {
  Rocket, FileText, Sparkles, Clock, CheckCircle2, ArrowRight, Users, Award, Zap,
  Target, AlertTriangle, Brain, LineChart, Shield, GraduationCap, Building2,
  Briefcase, User, Coffee, ChevronRight, Check, Star, MessageSquare, Crown,
  TrendingUp, Globe, Lightbulb, BarChart3, Scale, Heart, Cpu, BadgeCheck,
  Volume2, VolumeX
} from 'lucide-react';

// BGM 트랙 목록
const bgmTracks = [
  '/assets/bgm1_StepForSuccess_A.mp3',
  '/assets/bgm2_StepForSuccess_B.mp3',
  '/assets/bgm3_BizStartPath_A.mp3',
  '/assets/bgm4_BizStartPath_B.mp3',
];

// M.A.K.E.R.S 위원회 데이터
const makersCommittee = [
  { letter: 'M', name: 'Marketability', korean: '시장성', icon: TrendingUp, color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/30', description: '시장 규모, 고객 수요, 경쟁 상황, 타깃 시장 분석' },
  { letter: 'A', name: 'Ability', korean: '수행능력', icon: Users, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30', description: '팀 구성, 창업자의 역량, 실행 가능성, 인프라 보유' },
  { letter: 'K', name: 'Key Technology', korean: '핵심기술', icon: Cpu, color: 'from-cyan-500 to-teal-600', bgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-500/30', description: '기술의 혁신성, 차별화, 지식재산권, 기술 보호' },
  { letter: 'E', name: 'Economics', korean: '경제성', icon: BarChart3, color: 'from-emerald-500 to-green-600', bgColor: 'bg-emerald-500/20', borderColor: 'border-emerald-500/30', description: '매출·손익 계획, 자금 조달, 투자 회수, 재무 건전성' },
  { letter: 'R', name: 'Realization', korean: '실현가능성', icon: Target, color: 'from-orange-500 to-amber-600', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/30', description: '사업 추진 일정, 단계별 실행 계획, 리스크 관리' },
  { letter: 'S', name: 'Social Value', korean: '사회적가치', icon: Heart, color: 'from-pink-500 to-rose-600', bgColor: 'bg-pink-500/20', borderColor: 'border-pink-500/30', description: '일자리 창출, 지역 균형, ESG, 정부 정책 방향' },
];

// 요금제 데이터
const pricingPlans = [
  { name: '기본', price: '무료', period: '', features: ['사업계획서 자동 생성', 'HWP/PDF 다운로드', '기본 템플릿 3종'], cta: '무료 시작', popular: false },
  { name: '플러스', price: '29,000', period: '월', features: ['기본 기능 전체', 'M.A.K.E.R.S AI 평가', '6개 영역 점수 리포트', '개선 피드백 제공'], cta: '플러스 시작', popular: false },
  { name: '프로', price: '79,000', period: '월', features: ['플러스 기능 전체', '80점 미달 시 재작성 루프', '파트별 고도화 피드백', '무제한 수정'], cta: '프로 시작', popular: true },
  { name: '프리미엄', price: '199,000', period: '월', features: ['프로 기능 전체', '도메인 특화 전문가 매칭', '1:1 원격 컨설팅', '우선 지원'], cta: '프리미엄 시작', popular: false },
];

// 페르소나 데이터
const personas = [
  { id: 'kim', name: '김예비', role: '예비창업패키지 지원자', icon: User, problem: '마감이 일주일 남았는데 시장 분석과 재무 추정을 어떻게 채워야 할지 막막합니다.', goal: '5천만 원 지원금을 위한 전문가 수준 사업계획서 완성', emotion: '불안, 초조', color: 'blue', badge: '가장 많이 사용' },
  { id: 'choi', name: '최민혁', role: '재창업가 (CTO 출신)', icon: Brain, problem: '첫 창업 때 시장 수요 없음으로 실패. 이번엔 데이터로 검증하고 싶습니다.', goal: '코드 한 줄 짜기 전 PMF 철저히 검증', emotion: '신중함, 분석적', color: 'purple', badge: 'PMF 진단 추천' },
  { id: 'park', name: '박사장', role: '소상공인 (카페)', icon: Coffee, problem: '은행에서 상권 분석과 추정 손익이 포함된 사업계획서를 요구합니다.', goal: '은행 대출 심사 통과하여 운영 자금 확보', emotion: '답답함', color: 'amber', badge: '소상공인 추천' },
  { id: 'han', name: '한서윤', role: '시드 투자 유치 CEO', icon: Briefcase, problem: 'IR Deck을 만들었지만 TAM-SAM-SOM 근거가 부족합니다.', goal: '5억 원 시드 투자 유치를 위한 IR Deck 완성', emotion: '압박감', color: 'emerald', badge: '투자유치 추천' },
  { id: 'lee', name: '이지은', role: '대학생 창업동아리', icon: GraduationCap, problem: '팀원 모두 BM, CAC, LTV 같은 용어를 모릅니다.', goal: '창업경진대회 1등을 위한 완성도 높은 사업계획서', emotion: '열정적, 막연함', color: 'rose', badge: '학생 추천' },
];

// 고객 후기 데이터
const testimonials = [
  { name: '이창업', role: '예비창업패키지 합격자', content: 'M.A.K.E.R.S 평가 덕분에 제 사업계획서의 약점을 정확히 파악했습니다. 경제성 부분을 보완해서 최종 합격!', rating: 5, avatar: '👨‍💼' },
  { name: '박스타트업', role: '초기창업패키지 합격자', content: '6명의 AI 심사위원 피드백이 실제 심사위원 질문과 거의 일치했어요. 면접 준비까지 완벽!', rating: 5, avatar: '👩‍💻' },
  { name: '김대표', role: '시드 투자 유치 성공', content: 'IR Deck 작성할 때 시장성 분석이 특히 도움됐습니다. VC 미팅에서 자신있게 답변할 수 있었어요.', rating: 5, avatar: '🧑‍💼' },
];

// SEO 키워드
const seoKeywords = ['정부사업지원금', '예비창업패키지', '초기창업패키지', 'AI 심사위원단', '멀티에이전트 AI', '사업계획서 자동작성', '1인 소자본 창업', '창업 트렌드'];

// 네비게이션 링크 데이터
const navLinks = [
  { label: '고객 후기', href: '#problem-section' },
  { label: 'AI 심사위원단', href: '#makers-section' },
  { label: '맞춤 지원', href: '#business-category' },
  { label: '요금제', href: '#pricing-section' },
  { label: '단계별 솔루션', href: '#solution-steps' },
  { label: '기업 소개', href: '#testimonials-section' },
];

// Auto-scroll carousel component with hover pause and drag support
interface Review {
  name: string;
  role: string;
  content: string;
}

interface AutoScrollCarouselProps {
  reviews: Review[];
  color: string;
  direction: 'left' | 'right';
}

const AutoScrollCarousel: React.FC<AutoScrollCarouselProps> = ({ reviews, color, direction }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });

  // Speed: always positive, direction handled differently
  const speed = 0.5;
  // Quadruple reviews for infinite scroll
  const allReviews = [...reviews, ...reviews, ...reviews, ...reviews];

  // Auto-scroll animation using scrollLeft
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animate = () => {
      if (!isPausedRef.current && !isDraggingRef.current && container && container.scrollWidth > 0) {
        container.scrollLeft += speed;

        // Infinite loop: reset when reaching boundary
        const oneSetWidth = container.scrollWidth / 4;

        if (container.scrollLeft >= oneSetWidth * 2) {
          container.scrollLeft -= oneSetWidth;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += oneSetWidth;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed]);

  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
    isDraggingRef.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    const container = containerRef.current;
    if (container) {
      dragStartRef.current = {
        x: e.pageX - container.offsetLeft,
        scrollLeft: container.scrollLeft
      };
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const container = containerRef.current;
    if (container) {
      const x = e.pageX - container.offsetLeft;
      let walk = (x - dragStartRef.current.x) * 2;
      // Invert drag direction for right-direction groups (compensate for scaleX(-1))
      if (direction === 'right') {
        walk = -walk;
      }
      container.scrollLeft = dragStartRef.current.scrollLeft - walk;
    }
  };

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto cursor-grab active:cursor-grabbing select-none"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        transform: direction === 'right' ? 'scaleX(-1)' : 'none',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div
        className="flex gap-6"
        style={{
          width: 'max-content',
          transform: direction === 'right' ? 'scaleX(-1)' : 'none',
        }}
      >
        {allReviews.map((review, reviewIndex) => (
          <div key={reviewIndex} className="flex items-center gap-6">
            {/* Loop separator */}
            {reviewIndex > 0 && reviewIndex % reviews.length === 0 && (
              <div className="flex-shrink-0 flex flex-col items-center justify-center px-4">
                <div className={`w-px h-20 bg-gradient-to-b from-transparent via-${color}-500/50 to-transparent`} />
                <div className={`text-${color}-400/50 text-xs mt-2`}>●</div>
                <div className={`w-px h-20 bg-gradient-to-b from-transparent via-${color}-500/50 to-transparent`} />
              </div>
            )}
            <div
              className={`flex-shrink-0 w-[612px] glass-card rounded-2xl p-8 border border-${color}-500/20 hover:border-${color}-500/40 transition-all select-none`}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-lg text-white/80 leading-relaxed mb-6 select-none">
                "{review.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className={`w-12 h-12 rounded-full bg-${color}-500/20 flex items-center justify-center`}>
                  <User className="w-6 h-6 text-white/60" />
                </div>
                <div>
                  <div className="font-semibold">{review.name}</div>
                  <div className="text-sm text-white/50">{review.role}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activePersona, setActivePersona] = useState(0);
  const [hoveredMaker, setHoveredMaker] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // BGM 상태 관리
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // BGM 초기화
  useEffect(() => {
    // Audio 객체 생성
    const audio = new Audio();
    audio.volume = 0.3;
    audio.preload = 'auto';
    audioRef.current = audio;

    // 트랙 종료 시 다음 트랙으로 자동 전환
    const handleTrackEnd = () => {
      setCurrentTrackIndex((prev) => {
        const nextIndex = (prev + 1) % bgmTracks.length;
        return nextIndex;
      });
    };

    audio.addEventListener('ended', handleTrackEnd);

    // 컨포넌트 언마운트 시 정리
    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleTrackEnd);
      audioRef.current = null;
    };
  }, []);

  // 트랙 변경 시 새 트랙 로드 및 재생 (재생 중일 때만)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isBgmPlaying) return;

    // 새 트랙 로드 및 재생
    audio.src = bgmTracks[currentTrackIndex];
    audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn('BGM 재생 실패:', error.message);
      });
    }
  }, [currentTrackIndex, isBgmPlaying]);

  // BGM 토글 함수
  const toggleBgm = () => {
    const audio = audioRef.current;
    if (!audio) {
      console.warn('Audio 객체가 초기화되지 않았습니다.');
      return;
    }

    if (isBgmPlaying) {
      // 재생 중이면 일시정지
      audio.pause();
      setIsBgmPlaying(false);
    } else {
      // 재생 시작
      audio.src = bgmTracks[currentTrackIndex];
      audio.load();

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsBgmPlaying(true);
          })
          .catch((error) => {
            console.warn('BGM 재생 실패:', error.message);
            // 사용자 상호작용 필요 시 상태 변경하지 않음
          });
      }
    }
  };

  // 스크롤 감지
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTAClick = () => navigate('/app');

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ===== FIXED HEADER NAVIGATION ===== */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-transparent'
          }`}
      >
        <nav className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          {/* Left - Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-shadow">
              <Rocket className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg">Makers Round</span>
              <span className="text-white/40 text-sm ml-2 hidden md:inline">by Makers World</span>
            </div>
          </button>

          {/* Center - Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <button
                key={i}
                onClick={() => scrollToSection(link.href)}
                className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right - BGM Toggle + CTA Button */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* BGM Toggle Button */}
            <button
              onClick={toggleBgm}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${isBgmPlaying
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30'
                : 'bg-white/10 hover:bg-white/20'
                }`}
              title={isBgmPlaying ? 'BGM 끄기' : 'BGM 켜기'}
            >
              {isBgmPlaying ? (
                <Volume2 className="w-5 h-5 text-white" />
              ) : (
                <VolumeX className="w-5 h-5 text-white/70" />
              )}
              {isBgmPlaying && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
            </button>

            {/* CTA Button */}
            <Button
              onClick={handleCTAClick}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-5 py-2.5 text-sm font-semibold border-0 shadow-lg shadow-purple-500/20"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">사업계획서 작성</span>
              <span className="sm:hidden">시작하기</span>
            </Button>
          </div>
        </nav>
      </header>
      {/* ===== PRIMARY HERO SECTION - 정부지원금 ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950">
        {/* Dynamic Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full blur-[100px] animate-float-slow" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

          {/* Radial glow from center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Concept Art Image */}
            <div className="flex justify-center mb-3 animate-fade-in">
              <img
                src="/assets/0_MakersRound-logo-transparent.png"
                alt="Makers Round Concept Art"
                className="w-[60vw] md:w-[45vw] lg:w-[35vw] max-h-[450px] h-auto object-contain"
              />
            </div>

            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 mb-10 animate-fade-in border border-emerald-500/30">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-sm font-medium">AI 기반 자동화 시스템</span>
              </div>
              <span className="text-white/30">|</span>
              <span className="text-white/60 text-sm">실시간 분석 가능</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight animate-fade-in-up">
              정부지원금 합격 사업계획서,
              <br />
              <span className="relative">
                <span className="text-gradient bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">10분이면 충분합니다</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 8C50 2 100 2 150 6C200 10 250 8 298 4" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="underline-gradient" x1="0" y1="0" x2="300" y2="0">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="50%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Subheadlines */}
            <div className="space-y-4 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <p className="text-xl md:text-2xl text-white/80 flex items-center justify-center gap-3">
                <Cpu className="w-6 h-6 text-cyan-400" />
                <span><strong className="text-white">AI Multi-Agent</strong>가 심사위원 관점의 완벽한 초안을 제공합니다.</span>
              </p>
              <p className="text-lg md:text-xl text-white/60 flex items-center justify-center gap-2">
                <BadgeCheck className="w-5 h-5 text-emerald-400" />
                <span>예비창업패키지 · 초기창업패키지 · 정책자금지원 모두 대응</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Button
                size="lg"
                onClick={handleCTAClick}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 px-12 py-6 text-xl font-bold shadow-2xl shadow-emerald-500/25 border-0 group"
              >
                지금 바로 시작하기
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <button
                onClick={() => document.getElementById('makers-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors px-6 py-3"
              >
                <span>AI 심사위원단 알아보기</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.7s' }}>
              {[
                { icon: Clock, title: '10분 완성', desc: '답변만 입력하면 AI가 전문 사업계획서 자동 생성', color: 'emerald' },
                { icon: Target, title: '합격률 극대화', desc: 'M.A.K.E.R.S 6가지 심사기준 사전 검증', color: 'cyan' },
                { icon: FileText, title: '즉시 다운로드', desc: 'HWP/PDF 형식으로 바로 제출 가능', color: 'blue' },
              ].map((item, i) => (
                <div key={i} className={`glass-card rounded-2xl p-6 hover-lift border border-${item.color}-500/20`}>
                  <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/20 flex items-center justify-center mb-4 mx-auto`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-white/60">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-8 h-12 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
                <div className="w-1.5 h-3 bg-white/40 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== REAL TESTIMONIALS SECTION (문제 해결) ===== */}
      <section id="problem-section" className="py-24 relative scroll-mt-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-emerald-950/10 to-slate-950" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
              <MessageSquare className="w-4 h-4" /> 실제 사용자 리뷰
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Makers Round 서비스 <span className="text-gradient">사용자 리얼 후기</span>
            </h2>
            <p className="text-white/60 text-lg">좌우로 드래그하여 더 많은 후기를 확인하세요</p>
          </div>

          {/* Testimonial Groups */}
          {[
            {
              group: 'Group 1',
              title: '예비창업패키지 & 정부지원사업 지원자',
              persona: '김예비 유형',
              color: 'emerald',
              reviews: [
                { name: '이*우', role: '예비창업패키지 준비 / IT 플랫폼', content: '마감 3일 남기고 멘붕이었는데, \'Basic 기능\'으로 10분 만에 HWP 초안 뽑고 소름 돋았습니다. 줄 간격, 폰트 깨짐 없이 공공기관 양식 그대로 나오네요. 덕분에 내용 다듬는 데만 집중해서 마감 1시간 전에 여유 있게 제출했습니다.' },
                { name: '박*현', role: '청년창업사관학교 지원 / 제조 스타트업', content: '솔직히 처음엔 짜증 났습니다. \'Pro 기능\' 쓰는데 점수가 72점이라며 계속 반려당했거든요. 근데 AI가 지적해 준 \'경쟁사 대비 차별점\'을 고치고 나니 비로소 글이 논리적으로 변하더군요. 결국 합격했습니다. 그 깐깐함이 신의 한 수였어요.' },
                { name: '최*진', role: '초기창업패키지 / 에듀테크', content: 'Social Value 위원이 \'ESG 및 일자리 창출 효과\'를 구체적인 숫자로 제안해 줘서 놀랐습니다. 교육 사업이라 막연하게만 썼던 가치를 정량화하니 심사위원들이 보는 눈이 달라지는 게 느껴졌습니다.' },
                { name: '김*수', role: '로컬 크리에이터 지원 / 관광업', content: '시장 분석이 제일 어려웠는데, Marketability 위원이 최신 관광 트렌드 통계를 긁어와서 근거로 넣어주니 신뢰도가 확 올라갔습니다. 혼자 구글링할 땐 안 나오던 자료들이라 너무 유용했습니다.' },
                { name: '정*영', role: '예비 창업자 / 생활 소비재', content: '컨설팅 업체에 300만 원 부르는 거 보고 포기했다가 메이커스 라운드를 썼습니다. 비용은 1/10도 안 되는데 퀄리티는 훨씬 낫네요. 특히 \'실현 가능성\' 파트에서 구체적인 마일스톤 잡아주는 게 진짜 전문가 같았습니다.' },
                { name: '오*민', role: 'R&D 과제 기획 / 헬스케어', content: '기술은 자신 있는데 사업계획서로 푸는 게 고역이었습니다. Key Technology 위원이 제 기술 용어를 심사위원이 이해하기 쉬운 비즈니스 언어로 번역해 줘서, 기술성 평가에서 만점을 받았습니다.' },
                { name: '강*호', role: '재도전성공패키지 / 모빌리티', content: '지난번 탈락 이유를 몰랐는데, 이번에 시뮬레이션 돌려보고 알았습니다. 제가 \'자금 조달 계획\'이 너무 부실했더군요. Economics 위원이 지적해 준 대로 수정해서 이번엔 서류 통과했습니다.' },
              ]
            },
            {
              group: 'Group 2',
              title: '기술 검증 & 피벗이 필요한 재창업가',
              persona: '최민혁 유형',
              color: 'blue',
              reviews: [
                { name: '황*석', role: 'AI 솔루션 개발 / CTO 출신', content: '개발자라 그런지 \'감\'으로 사업하는 걸 싫어합니다. 여기는 6개 에이전트가 각기 다른 관점으로 데이터를 들이대며 팩폭을 날려줍니다. 뼈는 좀 아팠지만, 덕분에 개발 착수 전에 타겟 시장을 B2C에서 B2B로 바꿀 수 있었습니다.' },
                { name: '윤*재', role: '블록체인 스타트업 / 연쇄창업가', content: '과거엔 팀원들끼리 \'이거 될 거야\'라며 희망 회로만 돌렸는데, Makers Round는 냉정하더군요. \'Ability 위원\'이 팀 내 마케팅 역량 부족을 지적해 줘서, 급하게 그로스 마케터를 영입하는 계기가 됐습니다.' },
                { name: '서*준', role: '핀테크 / 백엔드 개발자', content: '기술적 우위만 강조하던 제 IR 자료가 쓰레기였다는 걸 깨달았습니다. \'고객이 왜 돈을 내야 하는가\'에 대한 질문을 끊임없이 던지는 피드백 루프 덕분에 진짜 PMF를 고민하게 되었습니다.' },
                { name: '임*호', role: '하드웨어 스타트업 / 엔지니어', content: '특허만 믿고 있었는데, Key Technology 위원이 \'특허 회피 가능성\'에 대한 리스크를 짚어줬을 때 소름 돋았습니다. 덕분에 방어 논리를 미리 준비해서 투자자 미팅 때 잘 넘어갔습니다.' },
                { name: '권*우', role: 'SaaS 서비스 / 3년 차 개발', content: '프리미엄 컨설팅 연계해서 SaaS 전문가분께 조언받았습니다. AI가 잡아준 논리 구조 위에 실제 업계의 KPI(Churn rate 등) 관리 노하우가 더해지니 완벽해지더군요.' },
              ]
            },
            {
              group: 'Group 3',
              title: '소상공인 & 자영업자',
              persona: '박사장 유형',
              color: 'amber',
              reviews: [
                { name: '이*숙', role: '카페 운영 5년 차 / 대출 심사용', content: '숫자만 보면 머리가 하얘지는 사람입니다. 은행에서 사업계획서 가져오라길래 막막했는데, 매출이랑 지출 대충 입력하니까 Economics 위원이 알아서 3년 치 추정 손익 계산서를 만들어주네요. 은행 직원이 누가 도와줬냐고 물어봤어요.' },
                { name: '김*철', role: '요식업 프랜차이즈 준비 / 가맹점주 모집', content: '컴퓨터 잘 못 다루는데 사용법이 카톡만큼 쉬워요. 질문하는 대로 대답만 했더니 그럴싸한 사업 소개서가 뚝딱 나왔습니다. 덕분에 가맹점주 미팅 때 태블릿으로 보여주면서 자신감 있게 설명했습니다.' },
                { name: '박*미', role: '의류 쇼핑몰 / 정책 자금 신청', content: '소상공인 대출받으려는데 \'경쟁력\' 쓰라는 칸에서 막혔어요. 그냥 \'옷이 예쁘다\'라고 썼는데, AI가 \'트렌드 기반의 큐레이션 역량\'이라고 고급스럽게 바꿔주더라고요.' },
                { name: '조*환', role: '밀키트 제조 / 판로 개척', content: '식당 장사만 하다가 유통하려니 막막했는데, Marketability 위원이 타겟 고객을 \'30대 맞벌이 부부\'로 좁혀주고 시장 규모까지 잡아줘서 방향 잡기가 훨씬 수월했습니다.' },
              ]
            },
            {
              group: 'Group 4',
              title: '투자 유치(IR) 준비 CEO',
              persona: '한서윤 유형',
              color: 'purple',
              reviews: [
                { name: '장*희', role: '플랫폼 스타트업 / Seed 라운드', content: 'VC들이 항상 묻는 TAM-SAM-SOM 그리는 법을 여기서 제대로 배웠습니다. 예전엔 그냥 큰 숫자만 적었는데, AI가 논리적인 산출 근거를 잡아주니 투자자가 고개를 끄덕이더군요.' },
                { name: '배*성', role: '바이오 벤처 / Pre-A 준비', content: 'IR Deck 만들 때마다 스토리가 꼬였는데, Makers Round가 잡아준 목차 흐름대로 가니까 기승전결이 딱 떨어집니다. 심사위원들이 \'준비 많이 했네\'라고 하더군요.' },
                { name: '유*나', role: '푸드테크 / 엑셀러레이팅', content: 'Realization 위원이 지적한 \'초기 진입 장벽\'에 대한 대비책을 미리 세워둔 덕분에, 데모데이 Q&A 시간 때 공격적인 질문을 아주 여유 있게 방어했습니다.' },
                { name: '송*민', role: '커머스 솔루션 / 팁스(TIPS) 준비', content: '팁스 운영사 미팅 전에 모의고사는 필수입니다. AI가 예상했던 질문이 실제 미팅에서 80% 이상 나왔습니다. 미리 답변을 준비해 가서 당황하지 않았어요.' },
                { name: '한*석', role: '에듀테크 / 엔젤 투자 유치', content: '혼자 상상했던 \'장밋빛 매출 계획\'을 Economics 위원이 \'현실적인 성장률\'로 조정해 줬습니다. 처음엔 실망했지만, 오히려 그 현실적인 숫자가 투자자들에겐 더 신뢰를 줬습니다.' },
              ]
            },
          ].map((group, groupIndex) => (
            <div key={groupIndex} className="mb-12">
              {/* Group Header */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className={`px-3 py-1 rounded-full bg-${group.color}-500/20 text-${group.color}-400 text-xs font-bold`}>
                  📌 {group.group}
                </span>
                <h3 className="text-xl font-bold">{group.title}</h3>
              </div>

              {/* Auto-sliding Carousel with Drag - JS based */}
              <AutoScrollCarousel
                reviews={group.reviews}
                color={group.color}
                direction={groupIndex % 2 === 0 ? 'left' : 'right'}
              />
            </div>
          ))}

          {/* Scroll hint */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <ChevronRight className="w-4 h-4" />
              <span>마우스를 올리면 슬라이딩이 멈추고, 드래그로 위치 조절 가능</span>
              <ChevronRight className="w-4 h-4 rotate-180" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== AI 심사위원단 + M.A.K.E.R.S 통합 섹션 ===== */}
      <section id="makers-section" className="py-24 relative overflow-hidden scroll-mt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slow" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Title */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
              <Crown className="w-4 h-4" /> 핵심 차별점
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">M.A.K.E.R.S</span> AI 심사위원단
            </h2>
            {/* Korean Terms Tagline */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {['시장성', '실현가능성', '핵심기술', '수익성', '사업화', '사회적가치'].map((term, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-white font-medium text-sm">
                  {term}
                </span>
              ))}
            </div>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              정부지원사업 평가의 6가지 핵심 영역을 전담하는 AI 심사위원단
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Left Column - AI 심사위원단 Hero Content */}
            <div className="flex flex-col justify-center">
              {/* Brand Badge */}
              <div className="inline-flex items-center gap-3 glass rounded-full px-6 py-3 mb-8 w-fit">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Rocket className="w-4 h-4" />
                </div>
                <span className="font-semibold">Makers Round</span>
                <span className="text-white/40">|</span>
                <span className="text-white/60 text-sm">by Makers World</span>
              </div>

              {/* Headline */}
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                정부지원금 합격률을<br />
                <span className="text-gradient">6명의 AI 심사위원</span>이<br />
                높여드립니다
              </h3>

              {/* M.A.K.E.R.S Preview */}
              <div className="flex gap-2 mb-6">
                {makersCommittee.map((m, i) => (
                  <div key={i} className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center font-bold text-lg shadow-lg`}>
                    {m.letter}
                  </div>
                ))}
              </div>

              <p className="text-lg text-white/70 mb-8">
                <strong className="text-white">M.A.K.E.R.S AI 심사위원단</strong>이<br />
                사업계획서의 6가지 핵심 영역을 사전 심사합니다
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" onClick={handleCTAClick} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-8 py-4 text-lg font-bold shadow-2xl animate-pulse-glow border-0">
                  무료로 AI 심사 받아보기
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: '3,500+', label: '사업계획서 심사' },
                  { value: '94.7%', label: '사용자 만족도' },
                  { value: '6명', label: 'AI 심사위원' },
                  { value: '10분', label: '평균 소요시간' },
                ].map((s, i) => (
                  <div key={i} className="text-center glass rounded-xl p-3">
                    <div className="text-xl md:text-2xl font-bold text-gradient">{s.value}</div>
                    <div className="text-xs text-white/60">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Promo Video + M.A.K.E.R.S Committee Cards */}
            <div className="flex flex-col gap-6">
              {/* Promo Video - Top of Right Column */}
              <div className="rounded-2xl overflow-hidden shadow-xl shadow-purple-500/20 border border-white/10">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto"
                >
                  <source src="/assets/AI_스타트업_사업계획서_솔루션_영상_프롬프트.mp4" type="video/mp4" />
                  브라우저가 비디오 태그를 지원하지 않습니다.
                </video>
              </div>

              {/* M.A.K.E.R.S Committee Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {makersCommittee.map((m, i) => (
                  <div
                    key={i}
                    className={`glass-card rounded-xl p-4 hover-lift cursor-pointer transition-all ${hoveredMaker === i ? 'border-2 ' + m.borderColor + ' glow-purple' : 'border border-white/10'}`}
                    onMouseEnter={() => setHoveredMaker(i)}
                    onMouseLeave={() => setHoveredMaker(null)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center font-bold text-lg shadow-lg flex-shrink-0`}>
                        {m.letter}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate">{m.name}</h4>
                        <p className="text-white/60 text-xs">{m.korean}</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/70 line-clamp-2">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BUSINESS CATEGORY SUPPORT SECTION ===== */}
      <section id="business-category" className="py-24 relative overflow-hidden scroll-mt-20">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
              <Briefcase className="w-4 h-4" /> 사업분야 맞춤지원
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              어떤 창업이든, <span className="text-gradient">완벽하게 지원</span>합니다
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              예비창업자부터 초기창업자까지, 모든 단계에 최적화된 솔루션
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Globe,
                title: '온라인 창업',
                desc: '온라인 쇼핑몰, 디지털 서비스 등 온라인 기반 창업 지원',
                tags: ['스마트스토어', 'SaaS'],
                color: 'blue',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: User,
                title: '1인 소자본 창업',
                desc: '최소 비용으로 시작하는 1인 창업 최적화 솔루션',
                tags: ['프리랜서', '크리에이터'],
                color: 'emerald',
                gradient: 'from-emerald-500 to-teal-500'
              },
              {
                icon: Building2,
                title: '프랜차이즈 사업',
                desc: '프랜차이즈 사업계획서 전문 양식 지원',
                tags: ['가맹점', '본사'],
                color: 'amber',
                gradient: 'from-amber-500 to-orange-500'
              },
              {
                icon: Cpu,
                title: 'AI 분야 창업',
                desc: 'AI 스타트업 특화 사업계획서 및 트렌드 분석',
                tags: ['LLM', 'AI 에이전트'],
                color: 'purple',
                gradient: 'from-purple-500 to-pink-500'
              },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 hover-lift border border-white/10 hover:border-white/20 transition-all group"
              >
                {/* Icon with gradient background */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>

                {/* Description */}
                <p className="text-white/60 text-sm mb-4 leading-relaxed">{item.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, j) => (
                    <span
                      key={j}
                      className={`text-xs px-3 py-1.5 rounded-full bg-${item.color}-500/10 text-${item.color}-400 border border-${item.color}-500/20`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-white/50 text-sm mb-4">그 외 모든 업종 지원 가능</p>
            <Button
              onClick={handleCTAClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-8 py-3 font-semibold border-0"
            >
              내 사업에 맞는 계획서 작성하기
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section id="pricing-section" className="py-24 relative scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
              <Zap className="w-4 h-4" /> 요금제
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">합리적인 가격, 압도적인 가치</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`glass-card rounded-2xl p-6 hover-lift relative ${plan.popular ? 'border-2 border-purple-500 glow-purple' : 'border border-white/10'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-xs font-bold">
                    가장 인기
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price === '무료' ? '무료' : `₩${plan.price}`}</span>
                  {plan.period && <span className="text-white/60">/{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-white/80">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button onClick={handleCTAClick} className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-white/10 hover:bg-white/20'}`}>
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STEP-BY-STEP SOLUTION SECTION ===== */}
      <section id="solution-steps" className="py-24 relative overflow-hidden scroll-mt-20">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
              <Users className="w-4 h-4" /> 단계별 솔루션
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              혹시 이런 상황이신가요?
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Makers World는 다양한 단계의 고민을 해결합니다
            </p>
          </div>

          {/* Persona Cards */}
          {/* Persona Cards - 2x2 Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                tier: '기본',
                tierDesc: '빠른 초안 작성으로 사업 본질에 집중',
                name: '김예비',
                role: '예비창업패키지 지원자',
                avatar: '👨‍💼',
                problem: '마감이 일주일 남았는데, 시장 분석과 재무 추정 항목을 어떻게 채워야 할지 막막합니다.',
                emotion: '불안, 초조, 막막함',
                goal: '5천만 원 지원금을 위한 전문가 수준 사업계획서 완성',
                color: 'slate',
                gradient: 'from-slate-500 to-zinc-600',
                borderColor: 'border-slate-500/30'
              },
              {
                tier: '플러스',
                tierDesc: '심사위원회 평가 추천',
                name: '최민혁',
                role: '재창업가 (CTO 출신)',
                avatar: '🧑‍💻',
                problem: '첫 창업 때 시장 수요 없음으로 실패. 기술력만 믿고 2년간 개발했는데 아무도 원하지 않았습니다.',
                emotion: '신중함, 분석적',
                goal: '코드 한 줄 짜기 전, 데이터로 철저히 검증하고 PMF 찾기',
                color: 'blue',
                gradient: 'from-blue-500 to-indigo-600',
                borderColor: 'border-blue-500/30'
              },
              {
                tier: '프로',
                tierDesc: '사업 위기를 극복할 인사이트 확보',
                name: '박사장',
                role: '2년 차 소상공인 (카페)',
                avatar: '☕',
                problem: '매출 정체로 3천만 원 대출이 필요한데, 은행에서 상권 분석과 추정 손익이 포함된 사업계획서를 요구합니다.',
                emotion: '답답함, 숫자 울렁증',
                goal: '은행 대출 심사 통과하여 운영 자금 확보',
                color: 'purple',
                gradient: 'from-purple-500 to-violet-600',
                borderColor: 'border-purple-500/30'
              },
              {
                tier: '프리미엄',
                tierDesc: '투자유치를 위한 수준높은 사업 컨설팅',
                name: '한서윤',
                role: '투자 유치 준비 CEO',
                avatar: '👩‍💼',
                problem: 'IR Deck 초안은 만들었지만, VC가 신뢰할 TAM-SAM-SOM 시장 규모와 근거가 부족합니다.',
                emotion: '야심 참, 압박감',
                goal: '5억 원 투자 유치를 위한 방어 가능한 IR Deck 완성',
                color: 'amber',
                gradient: 'from-amber-500 to-orange-600',
                borderColor: 'border-amber-500/30'
              },
            ].map((persona, i) => (
              <div
                key={i}
                className={`glass-card rounded-2xl p-6 hover-lift border ${persona.borderColor} transition-all group relative overflow-hidden`}
              >
                {/* Tier Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${persona.gradient} text-xs font-bold text-white shadow-lg`}>
                  {persona.tier}
                </div>

                {/* Tier Description */}
                <div className="mb-5">
                  <span className={`text-xs text-${persona.color}-400 font-medium`}>{persona.tierDesc}</span>
                </div>

                {/* Avatar & Info */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="text-4xl">{persona.avatar}</div>
                  <div>
                    <h3 className="text-lg font-bold">{persona.name}</h3>
                    <p className="text-sm text-white/60">{persona.role}</p>
                  </div>
                </div>

                {/* Problem */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-semibold text-red-400">겪고 있는 문제</span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">"{persona.problem}"</p>
                </div>

                {/* Emotion */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-400" />
                    <span className="text-xs text-white/50">감정: {persona.emotion}</span>
                  </div>
                </div>

                {/* Goal */}
                <div className={`p-4 rounded-xl bg-${persona.color}-500/10 border border-${persona.color}-500/20`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">이루고 싶은 목표</span>
                  </div>
                  <p className="text-sm text-white/90 font-medium">{persona.goal}</p>
                </div>

                {/* CTA */}
                <button
                  onClick={handleCTAClick}
                  className={`w-full mt-5 py-3 rounded-xl bg-gradient-to-r ${persona.gradient} text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                >
                  {persona.tier} 요금제로 시작하기
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Bottom message */}
          <div className="text-center mt-12">
            <p className="text-white/50">
              어떤 요금제가 맞는지 모르겠다면, <button onClick={handleCTAClick} className="text-purple-400 hover:text-purple-300 underline underline-offset-4">무료로 시작</button>해보세요
            </p>
          </div>
        </div>
      </section>

      {/* ===== MAKERS WORLD INTRODUCTION ===== */}
      <section id="testimonials-section" className="py-24 relative overflow-hidden scroll-mt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full blur-[80px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Title */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-6">
              <Globe className="w-4 h-4" /> 전방위 창업자 지원 서비스
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              당신의 창업 여정을 함께합니다
            </h2>

            {/* 3단계 창업 여정 with descriptions */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              {[
                { icon: Rocket, title: '창업 시작', desc: '아이디어 구체화부터 사업계획서 작성까지', color: 'from-blue-500 to-cyan-500' },
                { icon: Target, title: '자금 확보', desc: '정부지원금, 투자유치, 대출 등 다양한 경로', color: 'from-purple-500 to-pink-500' },
                { icon: TrendingUp, title: '성장 가속', desc: '시장 분석, 마케팅 전략, 사업 확장까지', color: 'from-emerald-500 to-teal-500' },
              ].map((item, i) => (
                <div key={i} className="glass-card rounded-xl p-5 border border-white/10 text-center hover-lift">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Makers World는 창업의 시작부터 성장까지,<br className="hidden md:block" />
              모든 단계에서 당신의 든든한 파트너가 됩니다.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-center mb-12">
            {/* Left Column - Logo */}
            <div className="flex flex-col items-center justify-center">
              <img
                src="/assets/2_Makersworld-logo-neon.png"
                alt="Makers World Logo"
                className="h-48 md:h-64 lg:h-72 w-auto object-contain"
              />
            </div>

            {/* Right Column - Video */}
            <div className="flex flex-col">
              <div className="w-full rounded-2xl overflow-hidden shadow-xl shadow-indigo-500/20 border border-white/10">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto"
                >
                  <source src="/assets/1_251204_메이커스월드_소개영상.mp4" type="video/mp4" />
                  브라우저가 비디오 태그를 지원하지 않습니다.
                </video>
              </div>
            </div>
          </div>

          {/* Tagline - Full Width Bottom */}
          <div className="glass-card rounded-2xl p-10 border border-indigo-500/20 text-center max-w-4xl mx-auto">
            <p className="text-3xl md:text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              "세상의 모든 Maker를 위한 World"
            </p>
            <p className="text-lg text-white/60">
              Makers World와 함께라면, 당신의 아이디어가 현실이 됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SEO KEYWORDS ===== */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {seoKeywords.map((k, i) => (
              <span key={i} className="px-4 py-2 glass rounded-full text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors">#{k}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-slate-900" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            지금 바로<br /><span className="text-gradient">AI 심사위원단</span>를 만나보세요
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-xl mx-auto">
            무료로 시작하고, 6명의 AI 심사위원에게<br />사업계획서 피드백을 받아보세요
          </p>
          <Button size="lg" onClick={handleCTAClick} className="bg-gradient-to-r from-purple-600 to-blue-600 px-12 py-5 text-xl font-bold shadow-2xl animate-pulse-glow border-0">
            무료로 시작하기 <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/60 text-sm">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" />회원가입 불필요</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" />기본 기능 무료</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" />즉시 다운로드</span>
          </div>
        </div>
      </section >

      {/* ===== FOOTER ===== */}
      < footer className="py-12 border-t border-white/10" >
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">Makers Round</span>
          </div>
          <p className="text-white/40 text-sm">© 2024 Makers World. M.A.K.E.R.S AI 심사위원단</p>
        </div>
      </footer >
    </div >
  );
};
