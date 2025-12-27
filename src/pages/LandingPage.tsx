/**
 * Makers Round 울트라 프리미엄 랜딩페이지
 * M.A.K.E.R.S AI 심사위원단 시스템
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, PromotionBanner } from '../components/ui';
import PreRegistrationModal from '../components/PreRegistrationModal';
import PreRegistrationSuccess from '../components/PreRegistrationSuccess';
import {
  Rocket, FileText, Sparkles, Clock, CheckCircle2, ArrowRight, Users, Award, Zap,
  Target, AlertTriangle, Brain, LineChart, Shield, GraduationCap, Building2,
  Briefcase, User, Coffee, ChevronRight, Check, Star, MessageSquare,
  TrendingUp, Globe, Lightbulb, BarChart3, Scale, Heart, Cpu,
  Volume2, VolumeX, Flame
} from 'lucide-react';
import { getPlanPricing, getPromotionStatus, formatPrice } from '../utils/pricing';
import { usePreRegistrationStore } from '../stores/usePreRegistrationStore';
import type { PlanType } from '../utils/pricing';

// BGM 트랙 목록
const bgmTracks = [
  '/assets/soundtrack/bgm1_StepForSuccess_A.mp3',
  '/assets/soundtrack/bgm2_StepForSuccess_B.mp3',
  '/assets/soundtrack/bgm3_BizStartPath_A.mp3',
  '/assets/soundtrack/bgm4_BizStartPath_B.mp3',
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

// 요금제 데이터 (할인가 정보 포함)
const pricingPlans = [
  { 
    name: '기본', 
    planKey: null as null, // 무료 요금제는 할인 미적용
    price: '무료', 
    originalPrice: 0,
    period: '', 
    features: ['사업계획서 핵심 질문 리스트 제공', '사업계획서 자동 생성 체험', 'AI 심사위원 평가 체험', 'HWP/PDF 다운로드 체험'], 
    cta: '무료 데모', 
    popular: false 
  },
  { 
    name: '플러스', 
    planKey: 'plus' as const,
    price: '399,000', 
    originalPrice: 399000,
    period: '2026 상반기 시즌', 
    features: ['기본 기능 전체', 'M.A.K.E.R.S AI 평가', '6개 영역 점수 리포트', '개선 피드백 제공'], 
    cta: '플러스 시작', 
    popular: false 
  },
  { 
    name: '프로', 
    planKey: 'pro' as const,
    price: '799,000', 
    originalPrice: 799000,
    period: '2026 상반기 시즌', 
    features: ['플러스 기능 전체', '80점 미달 시 재작성 루프', '파트별 고도화 피드백', '무제한 수정'], 
    cta: '프로 시작', 
    popular: true 
  },
  { 
    name: '프리미엄', 
    planKey: 'premium' as const,
    price: '1,499,000', 
    originalPrice: 1499000,
    period: '2026 상반기 시즌', 
    features: ['프로 기능 전체', '도메인 특화 전문가 매칭', '1:1 원격 컨설팅', '우선 지원'], 
    cta: '프리미엄 시작', 
    popular: false 
  },
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

// 히어로 섹션 플리핑 텍스트 데이터
const heroFlipTexts = [
  { text: '예비창업패키지 합격', color: 'text-emerald-400' },
  { text: '초기창업패키지 합격', color: 'text-cyan-400' },
  { text: '정책자금지원 합격', color: 'text-blue-400' },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activePersona, setActivePersona] = useState(0);
  const [hoveredMaker, setHoveredMaker] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  // 사전 등록 스토어
  const { openModal: openPreRegistrationModal, lastRegistration } = usePreRegistrationStore();

  // AI 심사위원단 Flip 상태
  const [isMakersFlipped, setIsMakersFlipped] = useState(false);
  const [makersGalleryIndex, setMakersGalleryIndex] = useState(0);

  // 히어로 섹션 텍스트 플리핑 상태
  const [heroFlipIndex, setHeroFlipIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // AI 심사위원 상세 데이터
  const makersDetailData = [
    {
      letter: 'M',
      name: 'Marketability',
      korean: '시장성 전문 AI',
      color: 'from-purple-500 to-violet-600',
      image: '/assets/juror-single/j1_market_tr.png',
      trainingData: '2.3M+',
      trainingDesc: '시장 분석 보고서, 산업 리서치, VC 투자 데이터',
      accuracy: '96.2%',
      benchmarks: ['TAM/SAM/SOM 산출', '경쟁사 분석', '타깃 고객 세분화'],
      specialFeature: '최신 프론티어 AI 3종 전이학습',
      validationScore: '92.8',
      description: '국내외 120만 건의 시장 리서치 데이터로 학습된 AI가 실시간으로 시장 규모, 성장률, 경쟁 구도를 분석합니다. 정부지원사업 심사위원 출신 전문가 30여 명의 피드백으로 미세 튜닝되었습니다.'
    },
    {
      letter: 'A',
      name: 'Ability',
      korean: '수행능력 전문 AI',
      color: 'from-blue-500 to-indigo-600',
      image: '/assets/juror-single/j2_ability_tr.png',
      trainingData: '1.8M+',
      trainingDesc: '창업 팀 분석, HR 데이터, 성공 사례 연구',
      accuracy: '94.7%',
      benchmarks: ['팀 역량 평가', '실행 가능성 분석', '인프라 보유 판단'],
      specialFeature: '연쇄창업자 성공 패턴 학습',
      validationScore: '91.3',
      description: '실리콘밸리 스타트업 5만 개사의 팀 구성과 성공/실패 데이터를 학습. 창업자의 백그라운드, 팀 구성, 역할 분담을 분석하여 실행 가능성을 점수화합니다.'
    },
    {
      letter: 'K',
      name: 'Key Technology',
      korean: '핵심기술 전문 AI',
      color: 'from-cyan-500 to-teal-600',
      image: '/assets/juror-single/j3_keytech_tr.png',
      trainingData: '3.1M+',
      trainingDesc: '특허 데이터, 기술 논문, R&D 보고서',
      accuracy: '97.1%',
      benchmarks: ['기술 혁신성 평가', '특허 회피 분석', 'IP 보호 전략'],
      specialFeature: 'KIPRIS 연동 실시간 특허 검색',
      validationScore: '94.6',
      description: '국내외 특허 300만 건 및 기술 논문 데이터로 학습. 기술의 혁신성, 진입장벽, 지식재산권 보호 가능성을 종합 평가합니다.'
    },
    {
      letter: 'E',
      name: 'Economics',
      korean: '경제성 전문 AI',
      color: 'from-emerald-500 to-green-600',
      image: '/assets/juror-single/j4_economy_tr.png',
      trainingData: '2.7M+',
      trainingDesc: '재무제표, 투자 라운드, 손익 분석 데이터',
      accuracy: '95.8%',
      benchmarks: ['Unit Economics 검증', 'BEP 분석', 'LTV/CAC 최적화'],
      specialFeature: '업종별 벤치마크 내장',
      validationScore: '93.2',
      description: '국내 스타트업 재무데이터 10만 건 및 상장사 재무제표로 학습. 현실적인 매출 추정, 손익분기점 분석, 자금 조달 계획을 점검합니다.'
    },
    {
      letter: 'R',
      name: 'Realization',
      korean: '실현가능성 전문 AI',
      color: 'from-orange-500 to-amber-600',
      image: '/assets/juror-single/j5_realization_tr.png',
      trainingData: '1.5M+',
      trainingDesc: '프로젝트 마일스톤, 리스크 관리 사례',
      accuracy: '93.4%',
      benchmarks: ['실행 계획 검증', '리스크 요인 분석', '마일스톤 현실성'],
      specialFeature: 'OKR/KPI 기반 목표 설정 지원',
      validationScore: '90.7',
      description: '실제 스타트업 실행 데이터와 프로젝트 관리 사례로 학습. 추진 일정의 현실성, 리스크 관리 방안, 단계별 실행 계획을 평가합니다.'
    },
    {
      letter: 'S',
      name: 'Social Value',
      korean: '사회적가치 전문 AI',
      color: 'from-pink-500 to-rose-600',
      image: '/assets/juror-single/j6_social_tr.png',
      trainingData: '1.2M+',
      trainingDesc: 'ESG 보고서, 사회적기업 사례, 정부 정책',
      accuracy: '92.9%',
      benchmarks: ['일자리 창출 효과', '지역 균형 발전', 'ESG 적합성'],
      specialFeature: '정부 정책 방향 실시간 반영',
      validationScore: '89.5',
      description: 'ESG 평가, 사회적기업 성공 사례, 정부 정책 문서로 학습. 일자리 창출, 지역사회 기여, 환경 영향 등 사회적 가치를 종합 평가합니다.'
    }
  ];

  // BGM 상태 관리
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackIndexRef = useRef(0);

  // BGM 초기화
  useEffect(() => {
    // Audio 객체 생성
    const audio = new Audio(bgmTracks[0]);
    audio.volume = 0.3;
    audioRef.current = audio;

    // 트랙 종료 시 다음 트랙으로 자동 전환
    const handleTrackEnd = () => {
      trackIndexRef.current = (trackIndexRef.current + 1) % bgmTracks.length;
      audio.src = bgmTracks[trackIndexRef.current];
      audio.play().catch(() => { });
    };

    audio.addEventListener('ended', handleTrackEnd);

    // 컨포넌트 언마운트 시 정리
    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleTrackEnd);
      audioRef.current = null;
    };
  }, []);

  // BGM 토글 함수
  const toggleBgm = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isBgmPlaying) {
      audio.pause();
      setIsBgmPlaying(false);
    } else {
      audio.play()
        .then(() => {
          setIsBgmPlaying(true);
        })
        .catch(() => { });
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

  // 히어로 섹션 텍스트 플리핑 애니메이션
  useEffect(() => {
    const flipInterval = setInterval(() => {
      setIsFlipping(true);
      
      // 페이드 아웃 후 인덱스 변경
      setTimeout(() => {
        setHeroFlipIndex((prev) => (prev + 1) % heroFlipTexts.length);
        setIsFlipping(false);
      }, 400);
    }, 3000);

    return () => clearInterval(flipInterval);
  }, []);

  const handleCTAClick = () => navigate('/app');

  // 요금제 선택 시 프로모션 활성화 여부에 따라 모달 또는 회원가입 페이지로 이동
  const handlePlanSelect = (planName: string) => {
    const promoStatus = getPromotionStatus();
    
    // 프로모션 활성화 중이고 유료 요금제인 경우 사전 등록 모달 오픈
    if (promoStatus.isActive && planName !== '기본') {
      const planKeyMap: Record<string, 'plus' | 'pro' | 'premium'> = {
        '플러스': 'plus',
        '프로': 'pro',
        '프리미엄': 'premium',
      };
      const planKey = planKeyMap[planName];
      if (planKey) {
        openPreRegistrationModal(planKey);
        return;
      }
    }
    
    // 기본 요금제 또는 프로모션 종료 시 회원가입 페이지로 이동
    navigate(`/signup?plan=${encodeURIComponent(planName)}`);
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ===== PROMOTION BANNER (사전 등록 프로모션) ===== */}
      <PromotionBanner 
        onRegisterClick={() => openPreRegistrationModal('pro')} 
        onVisibilityChange={setIsBannerVisible}
      />
      
      {/* ===== FIXED HEADER NAVIGATION ===== */}
      <header
        className={`fixed left-0 w-full z-50 transition-all duration-300 ${
          isBannerVisible ? 'top-12 sm:top-10' : 'top-0'
        } ${isScrolled
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
              title={isBgmPlaying ? 'BGM 끄기' : 'BGM 켜기'}
            >
              {/* Label */}
              <span className={`text-xs font-medium transition-colors hidden sm:block ${isBgmPlaying ? 'text-emerald-400' : 'text-white/50'}`}>
                BGM
              </span>

              {/* Toggle Track */}
              <div className={`relative w-14 h-7 rounded-full transition-all duration-300 ${isBgmPlaying
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30'
                : 'bg-white/10 hover:bg-white/15'
                }`}>
                {/* Toggle Knob */}
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300 ${isBgmPlaying ? 'left-8' : 'left-1'
                  }`}>
                  {isBgmPlaying ? (
                    <Volume2 className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <VolumeX className="w-3 h-3 text-slate-400" />
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
        {/* Hero Background Video - Full Viewport Width */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/assets/MakersRoundHeroVideo.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950" />
        </div>

        {/* Dynamic Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
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
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Button
                size="lg"
                onClick={handleCTAClick}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 px-12 py-6 text-xl font-bold shadow-2xl shadow-emerald-500/25 border-0 group"
              >
                지금 바로 작성하기
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                onClick={() => document.getElementById('makers-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-12 py-6 text-xl font-bold shadow-2xl shadow-purple-500/25 border-0 group"
              >
                지금 바로 심사받기
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                onClick={() => document.getElementById('makers-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 hover:bg-white/20 border border-white/20 px-12 py-6 text-xl font-bold shadow-2xl shadow-white/5 group"
              >
                심사 영역 알아보기
                <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Subheadlines */}
            <div className="space-y-4 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <p className="text-xl md:text-2xl text-white/80 flex items-center justify-center gap-3">
                <Cpu className="w-6 h-6 text-cyan-400" />
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

      {/* ===== AI 심사위원단 + M.A.K.E.R.S 통합 섹션 (Flip 기능) ===== */}
      <section id="makers-section" className="py-24 relative overflow-hidden scroll-mt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slow" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* ===== FRONT SIDE ===== */}
          {!isMakersFlipped && (
            <div className="animate-fade-in">
              {/* Section Title */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 glass rounded-full px-6 py-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">Makers Round</span>
                  <span className="text-white/40">|</span>
                  <span className="text-white/60 text-sm">by Makers World</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="text-gradient">M.A.K.E.R.S</span> AI 심사위원단
                </h2>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {[
                    { letter: 'M', korean: '시장성', color: 'purple' },
                    { letter: 'A', korean: '수행능력', color: 'blue' },
                    { letter: 'K', korean: '핵심기술', color: 'cyan' },
                    { letter: 'E', korean: '경제성', color: 'emerald' },
                    { letter: 'R', korean: '실현가능성', color: 'orange' },
                    { letter: 'S', korean: '사회적가치', color: 'pink' },
                  ].map((item, i) => (
                    <span key={i} className={`px-3 py-1 rounded-full bg-${item.color}-500/20 border border-${item.color}-500/30 text-white font-medium text-sm flex items-center gap-1.5`}>
                      <span className={`w-5 h-5 rounded bg-${item.color}-500/40 flex items-center justify-center text-xs font-bold`}>{item.letter}</span>
                      {item.korean}
                    </span>
                  ))}
                </div>
                <p className="text-xl text-white/60 max-w-2xl mx-auto">
                  정부지원사업 평가의 6가지 핵심 영역을 전담하는 AI 심사위원단
                </p>
              </div>

              {/* Two Column Layout */}
              <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                {/* Left Column */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                    정부지원금 합격률을<br />
                    <span className="text-gradient">6명의 AI 심사위원</span>이<br />
                    높여드립니다
                  </h3>

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

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Button size="lg" onClick={handleCTAClick} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-6 py-4 text-lg font-bold shadow-2xl animate-pulse-glow border-0">
                      무료로 AI 심사 받아보기
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => { setIsMakersFlipped(true); setMakersGalleryIndex(0); }}
                      className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-4 text-lg font-semibold"
                    >
                      최고의 전문성 확인하기
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: '3,500+', label: '사업계획서 심사' },
                      { value: '94.7%', label: '사용자 만족도' },
                      { value: '10분', label: '평균 소요시간' },
                    ].map((s, i) => (
                      <div key={i} className="text-center glass rounded-xl p-3">
                        <div className="text-xl md:text-2xl font-bold text-gradient">{s.value}</div>
                        <div className="text-xs text-white/60">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                  <div className="rounded-2xl overflow-hidden shadow-xl shadow-purple-500/20 border border-white/10">
                    <video autoPlay muted loop playsInline className="w-full h-auto">
                      <source src="/assets/AI_스타트업_사업계획서_솔루션_영상_프롬프트.mp4" type="video/mp4" />
                    </video>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {makersCommittee.map((m, i) => (
                      <div
                        key={i}
                        className={`glass-card rounded-xl p-4 hover-lift cursor-pointer transition-all ${hoveredMaker === i ? 'border-2 ' + m.borderColor + ' glow-purple' : 'border border-white/10'}`}
                        onMouseEnter={() => setHoveredMaker(i)}
                        onMouseLeave={() => setHoveredMaker(null)}
                        onClick={() => { setMakersGalleryIndex(i); setIsMakersFlipped(true); }}
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
          )}

          {/* ===== BACK SIDE (Gallery) ===== */}
          {isMakersFlipped && (
            <div className="animate-fade-in">
              {/* Back Header */}
              <div className="text-center mb-8">
                <button
                  onClick={() => setIsMakersFlipped(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm mb-6 transition-all"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" /> 돌아가기
                </button>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  AI 심사위원 <span className="text-gradient">전문성 상세</span>
                </h2>
                <p className="text-white/60">6가지 핵심 평가영역에 대한 AI 심사위원단의 전문성을 확인하세요</p>
              </div>

              {/* Gallery Navigation Icons */}
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-12 max-w-5xl mx-auto">
                {makersDetailData.map((agent, i) => (
                  <button
                    key={i}
                    onClick={() => setMakersGalleryIndex(i)}
                    className={`relative group transition-all duration-100 ${makersGalleryIndex === i ? 'scale-110 z-10' : 'scale-100 hover:scale-110 opacity-60 hover:opacity-100'}`}
                  >
                    {/* Icon Background */}
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg transition-all duration-100 overflow-hidden
                        ${makersGalleryIndex === i
                        ? `bg-gradient-to-br ${agent.color} ring-2 ring-white/50 ring-offset-2 ring-offset-slate-900 shadow-xl`
                        : 'bg-white/10 border border-white/10'
                      }`}
                    >
                      {/* Letter (Hide on Inactive Hover) */}
                      <span className={`transition-opacity duration-100 ${makersGalleryIndex !== i ? 'group-hover:opacity-0' : ''}`}>
                        {agent.letter}
                      </span>

                      {/* Hover Label (Shown in Center when Inactive & Hovered) */}
                      {makersGalleryIndex !== i && (
                        <div className="absolute inset-0 flex items-center justify-center p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-100 bg-black/40 backdrop-blur-md">
                          <span className="text-[10px] font-bold text-white leading-tight break-keep text-center">
                            {agent.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Active Label (Shown Below when Active) */}
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-max text-center transition-all duration-100
                        ${makersGalleryIndex === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
                    >
                      <div className="text-xs font-bold text-white/90 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm border border-white/10">
                        {agent.name}
                      </div>
                    </div>
                  </button>
                ))}
                
                {/* CTA Button */}
                <Button
                  size="lg"
                  onClick={handleCTAClick}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 px-6 py-3 text-sm font-bold shadow-lg shadow-emerald-500/25 border-0 ml-4"
                >
                  무료로 AI 심사 받아보기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Detail Card */}
              <div className="max-w-4xl mx-auto">
                {makersDetailData.map((agent, i) => (
                  <div
                    key={i}
                    className={`glass-card rounded-3xl p-8 border border-white/10 ${makersGalleryIndex === i ? 'block' : 'hidden'}`}
                  >
                    {/* Agent Header */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
                      <img 
                        src={agent.image} 
                        alt={`${agent.name} AI`} 
                        className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl flex-shrink-0"
                      />
                      <div className="text-center md:text-left">
                        <h3 className="text-2xl md:text-3xl font-bold mb-1">{agent.name} Agent</h3>
                        <p className="text-white/60 text-lg mb-4">{agent.korean} 심사위원</p>
                        {/* Stats Grid - Inline with header on desktop */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="glass rounded-xl p-3 text-center">
                            <div className="text-xl font-bold text-gradient mb-0.5">{agent.trainingData}</div>
                            <div className="text-xs text-white/60">학습 데이터</div>
                          </div>
                          <div className="glass rounded-xl p-3 text-center">
                            <div className="text-xl font-bold text-emerald-400 mb-0.5">{agent.accuracy}</div>
                            <div className="text-xs text-white/60">정확도</div>
                          </div>
                          <div className="glass rounded-xl p-3 text-center">
                            <div className="text-xl font-bold text-cyan-400 mb-0.5">{agent.validationScore}</div>
                            <div className="text-xs text-white/60">검증 점수</div>
                          </div>
                          <div className="glass rounded-xl p-3 text-center">
                            <div className="text-sm font-bold text-amber-400 mb-0.5">✨</div>
                            <div className="text-xs text-white/60 line-clamp-2">{agent.specialFeature}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Training Description */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-purple-400 mb-2">학습 데이터 출처</h4>
                      <p className="text-white/70 text-sm">{agent.trainingDesc}</p>
                    </div>

                    {/* Benchmarks */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-blue-400 mb-2">평가 기능</h4>
                      <div className="flex flex-wrap gap-2">
                        {agent.benchmarks.map((b, j) => (
                          <span key={j} className="px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs">
                            ✓ {b}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-white/80 text-sm leading-relaxed">{agent.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gallery Navigation Arrows */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setMakersGalleryIndex((prev) => (prev - 1 + 6) % 6)}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                >
                  <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
                <button
                  onClick={() => setMakersGalleryIndex((prev) => (prev + 1) % 6)}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== BUSINESS CATEGORY SUPPORT SECTION ===== */}
      <section id="business-category" className="py-24 relative overflow-hidden scroll-mt-20" >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" >
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

          {/* Domain Consulting Support */}
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-400 text-sm font-medium mb-4">
                ✨ 프리미엄 전문 컨설팅
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">사업 도메인별 전문가 컨설팅</h3>
              <p className="text-white/60 text-base max-w-2xl mx-auto">
                각 분야 10년 이상 경력의 검증된 전문가들이 여러분의 사업을 함께 설계합니다
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {[
                {
                  name: 'SaaS 온라인 서비스',
                  color: 'blue',
                  icon: '💻',
                  teamSize: '8명',
                  expertise: 'AWS·Azure 아키텍트, 프로덕트 매니저 출신',
                  achievements: 'B2B SaaS 스타트업 누적 30개사 지원, 총 ARR 200억 원 달성'
                },
                {
                  name: '온오프라인 교육사업',
                  color: 'emerald',
                  icon: '📚',
                  teamSize: '6명',
                  expertise: '에듀테크·학원사업·기업교육 전문가 그룹',
                  achievements: '교육 스타트업 50개사 투자 유치 지원, 총 300억 원 펀딩 성공'
                },
                {
                  name: '글로벌 유통사업',
                  color: 'cyan',
                  icon: '🌏',
                  teamSize: '10명',
                  expertise: 'KOTRA 출신, 해외 바이어 네트워크 보유',
                  achievements: '아마존·쿠팡 셀러 150개사 육성, 연간 해외 매출 500억 원 지원'
                },
                {
                  name: '레저 관광업',
                  color: 'amber',
                  icon: '✈️',
                  teamSize: '5명',
                  expertise: '관광학 박사·호텔리어·여행사 CEO 출신',
                  achievements: '지역관광 활성화 프로젝트 50건, 정부지원금 합격률 87%'
                },
                {
                  name: '뷰티 코스메틱',
                  color: 'pink',
                  icon: '💄',
                  teamSize: '7명',
                  expertise: '대기업 뷰티 브랜드 디렉터·MD 출신 그룹',
                  achievements: '인디 뷰티 브랜드 40개 런칭, 올리브영·시코르 입점 성공률 90%'
                },
                {
                  name: 'SNS 콘텐츠 수익화',
                  color: 'purple',
                  icon: '📱',
                  teamSize: '9명',
                  expertise: '100만 구독자 크리에이터·MCN 대표 출신',
                  achievements: '크리에이터 200명 육성, 누적 콘텐츠 수익 100억 원 돌파'
                },
                {
                  name: '멀티 채널 마케팅',
                  color: 'orange',
                  icon: '📊',
                  teamSize: '12명',
                  expertise: 'Google·Meta·네이버 공인 파트너 집단',
                  achievements: '퍼포먼스 마케팅 ROAS 평균 520% 달성, D2C 브랜드 100개사 성장 지원'
                },
                {
                  name: 'IT Infra 보안 & AI 안전',
                  color: 'slate',
                  icon: '🔐',
                  teamSize: '11명',
                  expertise: 'ISMS·ISO27001 심사원, AI 윤리 인증 전문가',
                  achievements: '정보보안 인증 취득 80건, AI 서비스 안전성 평가 50건 수행'
                },
              ].map((domain, i) => (
                <div
                  key={i}
                  className={`glass-card rounded-2xl p-6 border border-${domain.color}-500/20 hover:border-${domain.color}-500/40 transition-all hover-lift group`}
                >
                  {/* Domain Badge */}
                  <div className={`inline-flex items-center px-4 py-1.5 rounded-full bg-${domain.color}-500/20 text-${domain.color}-400 text-sm font-bold mb-4`}>
                    {domain.name}
                  </div>

                  {/* Team Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${domain.color}-400 to-${domain.color}-600 flex items-center justify-center text-3xl`}>
                      {domain.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-base flex items-center gap-2">
                        전문 컨설턴트
                        <span className={`text-${domain.color}-400`}>{domain.teamSize}</span>
                      </div>
                      <div className={`text-${domain.color}-400/80 text-sm`}>{domain.expertise}</div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <p className="text-white/70 text-sm leading-relaxed">
                    📈 {domain.achievements}
                  </p>
                </div>
              ))}
            </div>
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
      <section id="pricing-section" className="py-24 relative scroll-mt-20" >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
              <Zap className="w-4 h-4" /> 요금제
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">합리적인 가격, 압도적인 가치</h2>
          </div>

          {/* 프로모션 기간 타임테이블 */}
          {getPromotionStatus().isActive && (
            <div className="max-w-4xl mx-auto mb-12">
              <div className="glass-card rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-center mb-6 flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  사전 등록 프로모션 일정
                </h3>
                
                {/* 타임라인 */}
                <div className="relative">
                  {/* 배경 라인 */}
                  <div className="absolute top-6 left-0 right-0 h-1 bg-white/10 rounded-full" />
                  
                  {/* 진행 상태 표시 */}
                  <div className={`absolute top-6 left-0 h-1 rounded-full transition-all duration-500 ${
                    getPromotionStatus().isPhaseA 
                      ? 'w-1/2 bg-gradient-to-r from-rose-500 to-orange-500' 
                      : 'w-full bg-gradient-to-r from-rose-500 via-orange-500 to-emerald-500'
                  }`} />
                  
                  {/* 기간 표시 */}
                  <div className="relative flex justify-between">
                    {/* Phase A: 연말연시 특별 */}
                    <div className={`flex-1 text-center ${getPromotionStatus().isPhaseA ? 'opacity-100' : 'opacity-50'}`}>
                      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
                        getPromotionStatus().isPhaseA 
                          ? 'bg-gradient-to-r from-rose-500 to-orange-500 shadow-lg shadow-rose-500/30' 
                          : 'bg-white/20'
                      }`}>
                        <Flame className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold text-white mb-1">🔥 연말연시 특별</div>
                      <div className={`text-2xl font-bold mb-1 ${getPromotionStatus().isPhaseA ? 'text-rose-400' : 'text-white/50'}`}>
                        30% 할인
                      </div>
                      <div className="text-sm text-white/60">12/28 ~ 1/3</div>
                      {getPromotionStatus().isPhaseA && (
                        <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-rose-500/20 rounded-full text-xs text-rose-300 font-medium">
                          <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
                          진행 중
                        </div>
                      )}
                    </div>
                    
                    {/* Phase B: 공고 전 얼리버드 */}
                    <div className={`flex-1 text-center ${getPromotionStatus().isPhaseB ? 'opacity-100' : 'opacity-50'}`}>
                      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
                        getPromotionStatus().isPhaseB 
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30' 
                          : 'bg-white/20'
                      }`}>
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold text-white mb-1">✨ 공고 전 얼리버드</div>
                      <div className={`text-2xl font-bold mb-1 ${getPromotionStatus().isPhaseB ? 'text-emerald-400' : 'text-white/50'}`}>
                        10% 할인
                      </div>
                      <div className="text-sm text-white/60">1/4 ~ 접수 시작일</div>
                      {getPromotionStatus().isPhaseB && (
                        <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 rounded-full text-xs text-emerald-300 font-medium">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                          진행 중
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 안내 메시지 */}
                <div className="mt-6 text-center text-sm text-white/50">
                  {getPromotionStatus().isPhaseA ? (
                    <span>연말연시 기간에 등록하면 <strong className="text-rose-300">추가 20% 절약</strong> 혜택!</span>
                  ) : (
                    <span>정부지원사업 접수 시작일 전까지 사전 등록 시 할인 적용</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, i) => {
              // 할인 정보 계산 (무료 요금제 제외)
              const promoStatus = getPromotionStatus();
              const planPricing = plan.planKey ? getPlanPricing(plan.planKey) : null;
              const hasDiscount = planPricing && planPricing.isDiscounted;
              
              return (
                <div key={i} className={`glass-card rounded-2xl p-6 hover-lift relative ${plan.popular ? 'border-2 border-purple-500 glow-purple' : 'border border-white/10'}`}>
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
                  <div className="mb-6">
                    {plan.price === '무료' ? (
                      <div className="text-4xl font-bold">무료</div>
                    ) : hasDiscount && planPricing ? (
                      <>
                        {/* 정가 (취소선) */}
                        <div className="text-lg text-white/40 line-through">
                          ₩{formatPrice(planPricing.originalPrice)}
                        </div>
                        {/* 할인가 */}
                        <div className={`text-3xl font-bold ${
                          promoStatus.isPhaseA ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          ₩{formatPrice(planPricing.currentPrice)}
                        </div>
                        {/* 절약 금액 */}
                        <div className={`text-sm font-medium mt-1 ${
                          promoStatus.isPhaseA ? 'text-rose-300' : 'text-emerald-300'
                        }`}>
                          ₩{formatPrice(planPricing.savings)} 절약!
                        </div>
                        {/* Phase A 추가 절약 표시 */}
                        {promoStatus.isPhaseA && planPricing.extraSavingsVsPhaseB > 0 && (
                          <div className="text-xs text-orange-300 mt-1">
                            연말 특가 추가 혜택 ₩{formatPrice(planPricing.extraSavingsVsPhaseB)}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-4xl font-bold">₩{plan.price}</div>
                    )}
                    {plan.period && <div className="text-sm text-white/60 mt-2">{plan.period}</div>}
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-white/80">
                        <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA 버튼 */}
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
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== STEP-BY-STEP SOLUTION SECTION ===== */}
      <section id="solution-steps" className="py-24 relative overflow-hidden scroll-mt-20" >
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

                {/* Problem & Emotion */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-semibold text-red-400">겪고 있는 문제</span>
                    <span className="text-xs text-white/40">|</span>
                    <span className="text-xs text-pink-400/80">{persona.emotion}</span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">"{persona.problem}"</p>
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
                  onClick={() => handlePlanSelect(persona.tier)}
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
              어떤 요금제가 맞는지 모르겠다면, <button onClick={() => handlePlanSelect('기본')} className="text-purple-400 hover:text-purple-300 underline underline-offset-4">무료로 시작</button>해보세요
            </p>
          </div>
        </div>
      </section>

      {/* ===== MAKERS WORLD INTRODUCTION ===== */}
      <section id="testimonials-section" className="py-24 relative overflow-hidden scroll-mt-20" >
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
              Makers World가<br/>당신의 사업 여정을 함께합니다
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
            <p className="text-lg text-white/60 mb-6">
              Makers World와 함께라면, 당신의 아이디어가 현실이 됩니다.
            </p>
            {/* Team Intro Button */}
            <Button
              onClick={() => { navigate('/team'); window.scrollTo(0, 0); }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-3 font-semibold border-0"
            >
              <Users className="w-5 h-5 mr-2" />
              팀 소개 보기
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ===== SEO KEYWORDS ===== */}
      <section className="py-16" >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {seoKeywords.map((k, i) => (
              <span key={i} className="px-4 py-2 glass rounded-full text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors">#{k}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24 relative overflow-hidden" >
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
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 border-t border-white/10" >
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">Makers Round</span>
          </div>
          <p className="text-white/40 text-sm">© 2024 Makers World. M.A.K.E.R.S AI 심사위원단</p>
        </div>
      </footer>

      {/* ===== 사전 등록 모달 ===== */}
      <PreRegistrationModal />

      {/* ===== 사전 등록 완료 화면 ===== */}
      {lastRegistration && <PreRegistrationSuccess />}
    </div>
  );
};
