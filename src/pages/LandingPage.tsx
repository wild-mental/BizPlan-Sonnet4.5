/**
 * 파일명: LandingPage.tsx
 * 
 * 파일 용도:
 * Makers World 랜딩페이지 - 초보 창업자 생존율 제고를 위한 AI 비즈니스 빌딩 솔루션
 * 
 * 전략: C유형(결과 지향형) + A유형(불안 해소형) 하이브리드
 * 
 * 섹션 구성:
 * 1. Hero - 핵심 가치 제안 + Social Proof
 * 2. Problem - 창업 실패 원인 공감 유도
 * 3. Solution - 3대 핵심 기능
 * 4. Personas - 5가지 타겟 고객 유형
 * 5. Features - 상세 가치 제안
 * 6. Before/After - 효율성 비교
 * 7. Keywords - SEO + 신뢰 배지
 * 8. Final CTA - 강력한 마무리
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import {
  Rocket,
  FileText,
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
  Users,
  Award,
  Zap,
  Target,
  AlertTriangle,
  Brain,
  LineChart,
  Shield,
  GraduationCap,
  Building2,
  Briefcase,
  User,
  Coffee,
  ChevronRight,
  Check,
  Star,
  FileCheck,
  MessageSquare,
  PieChart,
  Lightbulb
} from 'lucide-react';

// 페르소나 데이터
const personas = [
  {
    id: 'kim',
    name: '김예비',
    role: '예비창업패키지 지원자',
    icon: User,
    problem: '마감이 일주일 남았는데, 시장 분석과 재무 추정 항목을 어떻게 채워야 할지 막막합니다.',
    goal: '5천만 원 지원금을 위한 전문가 수준 사업계획서 완성',
    emotion: '불안, 초조, 막막함',
    color: 'blue',
    badge: '가장 많이 사용'
  },
  {
    id: 'choi',
    name: '최민혁',
    role: '재창업가 (CTO 출신)',
    icon: Brain,
    problem: '첫 창업 때 시장 수요 없음으로 실패. 기술력만 믿고 2년간 개발했는데 아무도 원하지 않았습니다.',
    goal: '코드 한 줄 짜기 전, 데이터로 철저히 검증하고 PMF 찾기',
    emotion: '신중함, 분석적',
    color: 'purple',
    badge: 'PMF 진단 추천'
  },
  {
    id: 'park',
    name: '박사장',
    role: '2년 차 소상공인 (카페)',
    icon: Coffee,
    problem: '매출 정체로 3천만 원 대출이 필요한데, 은행에서 상권 분석과 추정 손익이 포함된 사업계획서를 요구합니다.',
    goal: '은행 대출 심사 통과하여 운영 자금 확보',
    emotion: '답답함, 숫자 울렁증',
    color: 'amber',
    badge: '소상공인 추천'
  },
  {
    id: 'han',
    name: '한서윤',
    role: '시드 투자 유치 준비 CEO',
    icon: Briefcase,
    problem: 'IR Deck 초안은 만들었지만, VC가 신뢰할 TAM-SAM-SOM 시장 규모와 근거가 부족합니다.',
    goal: '5억 원 시드 투자 유치를 위한 방어 가능한 IR Deck 완성',
    emotion: '야심 참, 압박감',
    color: 'emerald',
    badge: '투자유치 추천'
  },
  {
    id: 'lee',
    name: '이지은',
    role: '대학생 창업동아리 리더',
    icon: GraduationCap,
    problem: '창업경진대회 사업계획서를 써야 하는데, 팀원 모두 BM, CAC, LTV 같은 용어를 모릅니다.',
    goal: '경진대회 1등을 위한 완성도 높은 사업계획서 제출',
    emotion: '열정적, 막연함',
    color: 'rose',
    badge: '학생 추천'
  }
];

// 핵심 기능 데이터
const coreFeatures = [
  {
    icon: FileText,
    title: '사업계획서 작성 자동화',
    highlight: '10분 만에 완성',
    description: '정부지원사업 합격 사업계획서를 10분 만에 완성. 복잡한 HWP 포맷팅과 워딩, 심사위원 관점의 완벽한 초안을 제공합니다.',
    features: ['정부 공식 양식 완전 호환', 'HWP/PDF 자동 포맷팅', '합격 사례 템플릿 반영'],
    color: 'blue'
  },
  {
    icon: LineChart,
    title: 'Data-Driven 시장 분석',
    highlight: '실시간 리포트 생성',
    description: '아이디어 입력만으로 TAM/SAM/SOM 시장 규모, 경쟁사 현황, 트렌드 데이터를 실시간 분석하여 리포트를 생성합니다.',
    features: ['TAM/SAM/SOM 자동 산출', '경쟁사 벤치마크 분석', '최신 트렌드 반영'],
    color: 'emerald'
  },
  {
    icon: MessageSquare,
    title: 'AI 비즈니스 컨설턴트',
    highlight: 'Virtual Mentor',
    description: '수천 건의 컨설팅/교육 데이터를 학습한 특화 에이전트가 BM 진단 및 피보팅 전략을 제시합니다.',
    features: ['PMF 진단 리포트', '미비항목 자동 알림', 'MVP 사업화 로드맵'],
    color: 'purple'
  }
];

// SEO 키워드 배지
const seoKeywords = [
  '정부사업지원금', '예비창업패키지', '초기창업패키지',
  '온라인 창업', '1인 소자본 창업', '온라인 쇼핑몰 창업',
  '프랜차이즈 사업계획서', 'AI 분야 사업계획서', '최신 창업 트렌드'
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activePersona, setActivePersona] = useState(0);

  const handleCTAClick = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ============================================
          SECTION 1: Hero Section (강력한 첫인상)
          ============================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-28 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 border border-white/20">
              <Rocket className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold tracking-wide">Makers World</span>
              <span className="text-white/60">|</span>
              <span className="text-sm text-blue-200">AI 비즈니스 빌딩 솔루션</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              <span className="text-yellow-400">정부지원금 합격</span> 사업계획서,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                10분이면 충분합니다
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI Multi-Agent가 <strong className="text-white">심사위원 관점</strong>의 완벽한 초안을 제공합니다.<br />
              <span className="text-blue-200">예비창업패키지 · 초기창업패키지 · 은행대출</span> 모두 대응
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full text-sm text-green-300">
                <CheckCircle2 className="w-4 h-4" />
                정부 공식 양식 호환
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-sm text-purple-300">
                <Shield className="w-4 h-4" />
                환각 현상 최소화 AI
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-yellow-500/20 border border-yellow-400/30 rounded-full text-sm text-yellow-300">
                <Award className="w-4 h-4" />
                합격 사례 템플릿 반영
              </span>
            </div>

            {/* CTA Button - Hero */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                onClick={handleCTAClick}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900 px-10 py-5 text-lg font-bold shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all transform hover:scale-105 border-0"
              >
                지금 무료로 사업계획서 작성하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Social Proof Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { value: '2,847+', label: '사업계획서 생성', icon: FileText },
                { value: '97.3%', label: '사용자 만족도', icon: Star },
                { value: '10분', label: '평균 작성 시간', icon: Clock },
                { value: '24/7', label: '언제든 이용 가능', icon: Zap }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <stat.icon className="w-4 h-4 text-blue-300" />
                    <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                  </div>
                  <span className="text-sm text-blue-200">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ============================================
          SECTION 2: Problem Section (공감 유도)
          ============================================ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 rounded-full px-4 py-2 mb-6">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">창업의 현실</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              창업의 <span className="text-red-600">42%</span>가 실패하는 이유를 아시나요?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              대부분 '시장 수요 없음'이 원인입니다. 객관적 검증 없이 시작하면 실패합니다.
            </p>
          </div>

          {/* Problem Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Target,
                title: '객관적 데이터 검증 부재',
                description: '감에 의존한 시장 분석과 막연한 추정. 정확한 TAM/SAM/SOM 없이 뛰어드는 무모함.',
                stat: '실패 원인 1위'
              },
              {
                icon: Building2,
                title: '고비용 컨설팅 의존',
                description: '200~500만원의 컨설팅 비용. 초기 창업자에겐 감당하기 어려운 진입 장벽.',
                stat: '평균 300만원'
              },
              {
                icon: Brain,
                title: '범용 AI의 한계',
                description: 'ChatGPT 등 범용 LLM의 환각 현상(Hallucination)과 비즈니스 도메인 전문성 부족.',
                stat: '신뢰도 58%'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-red-50 rounded-2xl p-6 border border-red-100 hover:border-red-200 transition-all group"
              >
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <item.icon className="w-7 h-7 text-red-600" />
                </div>
                <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full mb-3">
                  {item.stat}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Transition Text */}
          <div className="text-center mt-16">
            <p className="text-xl text-gray-700 font-medium">
              하지만, <span className="text-blue-600 font-bold">Makers World</span>와 함께라면 다릅니다.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 3: Solution (3대 핵심 기능)
          ============================================ */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI 솔루션</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="text-blue-600">3가지 핵심 기능</span>으로 창업 성공률을 높입니다
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI Multi-Agent 기반으로 사업계획서 작성부터 시장 분석, 비즈니스 컨설팅까지
            </p>
          </div>

          {/* Core Features */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {coreFeatures.map((feature, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 border-2 hover:shadow-xl transition-all group ${feature.color === 'blue' ? 'border-blue-200 hover:border-blue-400' :
                  feature.color === 'emerald' ? 'border-emerald-200 hover:border-emerald-400' :
                    'border-purple-200 hover:border-purple-400'
                  }`}
              >
                {/* Feature Number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                  {index + 1}
                </div>

                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${feature.color === 'blue' ? 'bg-blue-100' :
                  feature.color === 'emerald' ? 'bg-emerald-100' : 'bg-purple-100'
                  }`}>
                  <feature.icon className={`w-8 h-8 ${feature.color === 'blue' ? 'text-blue-600' :
                    feature.color === 'emerald' ? 'text-emerald-600' : 'text-purple-600'
                    }`} />
                </div>

                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${feature.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                  feature.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                  {feature.highlight}
                </span>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>

                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className={`w-4 h-4 ${feature.color === 'blue' ? 'text-blue-500' :
                        feature.color === 'emerald' ? 'text-emerald-500' : 'text-purple-500'
                        }`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA Button - Middle */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={handleCTAClick}
              className="px-8 py-4 text-lg"
            >
              지금 바로 체험하기
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: Target Personas (당신을 위한 솔루션)
          ============================================ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">바로 당신을 위한</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              혹시 <span className="text-purple-600">이런 상황</span>이신가요?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Makers World는 다양한 창업 단계의 고민을 해결합니다
            </p>
          </div>

          {/* Persona Tabs */}
          <div className="max-w-5xl mx-auto">
            {/* Tab Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {personas.map((persona, index) => (
                <button
                  key={persona.id}
                  onClick={() => setActivePersona(index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activePersona === index
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <persona.icon className="w-4 h-4" />
                  {persona.name}
                </button>
              ))}
            </div>

            {/* Active Persona Card */}
            <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-3xl p-8 md:p-12 border border-purple-100 shadow-lg">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Persona Info */}
                <div className="md:w-1/3">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 ${personas[activePersona].color === 'blue' ? 'bg-blue-100' :
                    personas[activePersona].color === 'purple' ? 'bg-purple-100' :
                      personas[activePersona].color === 'amber' ? 'bg-amber-100' :
                        personas[activePersona].color === 'emerald' ? 'bg-emerald-100' : 'bg-rose-100'
                    }`}>
                    {React.createElement(personas[activePersona].icon, {
                      className: `w-10 h-10 ${personas[activePersona].color === 'blue' ? 'text-blue-600' :
                        personas[activePersona].color === 'purple' ? 'text-purple-600' :
                          personas[activePersona].color === 'amber' ? 'text-amber-600' :
                            personas[activePersona].color === 'emerald' ? 'text-emerald-600' : 'text-rose-600'
                        }`
                    })}
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${personas[activePersona].color === 'blue' ? 'bg-blue-100 text-blue-700' :
                    personas[activePersona].color === 'purple' ? 'bg-purple-100 text-purple-700' :
                      personas[activePersona].color === 'amber' ? 'bg-amber-100 text-amber-700' :
                        personas[activePersona].color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                    {personas[activePersona].badge}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900">{personas[activePersona].name}</h3>
                  <p className="text-gray-600">{personas[activePersona].role}</p>
                </div>

                {/* Right: Problem & Goal */}
                <div className="md:w-2/3 space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-semibold">겪고 있는 문제</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">"{personas[activePersona].problem}"</p>
                    <span className="inline-block mt-3 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm">
                      감정: {personas[activePersona].emotion}
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <Target className="w-5 h-5" />
                      <span className="font-semibold">이루고 싶은 목표</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{personas[activePersona].goal}</p>
                  </div>

                  <Button onClick={handleCTAClick} className="w-full md:w-auto">
                    {personas[activePersona].name}님을 위한 사업계획서 작성하기
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 5: Value Proposition (핵심 가치 제안)
          ============================================ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              왜 <span className="text-blue-600">Makers World</span>인가요?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: FileCheck,
                title: '정부 공식 양식 호환',
                description: '예비창업패키지, 초기창업패키지, 창업진흥원 공식 양식 완벽 지원'
              },
              {
                icon: Award,
                title: '합격 사례 템플릿',
                description: '실제 합격한 사업계획서 패턴과 워딩을 학습한 AI가 초안 작성'
              },
              {
                icon: PieChart,
                title: 'PMF 진단 리포트',
                description: '도출된 초안 기반 제품-시장 적합성 진단 및 미비항목 자동 알림'
              },
              {
                icon: Lightbulb,
                title: 'MVP 로드맵',
                description: '잠재 고객 인터뷰 템플릿과 MVP 사업화 로드맵까지 제시'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 6: Before/After (극적인 비교)
          ============================================ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              시간과 비용, <span className="text-blue-600">얼마나 절약될까요?</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Before */}
              <div className="bg-gray-100 rounded-2xl p-8 border-2 border-gray-200 relative">
                <div className="absolute -top-3 left-6">
                  <span className="px-4 py-1 bg-gray-500 text-white text-sm font-bold rounded-full">
                    기존 방식
                  </span>
                </div>
                <div className="space-y-6 mt-4">
                  <div>
                    <span className="text-gray-500 text-sm">소요 시간</span>
                    <div className="text-3xl font-bold text-gray-700">2주 이상</div>
                    <div className="w-full bg-gray-300 rounded-full h-3 mt-2">
                      <div className="bg-gray-500 h-3 rounded-full w-full"></div>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">컨설팅 비용</span>
                    <div className="text-3xl font-bold text-gray-700">200~500만원</div>
                    <div className="w-full bg-gray-300 rounded-full h-3 mt-2">
                      <div className="bg-gray-500 h-3 rounded-full w-full"></div>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">성공 확신</span>
                    <div className="text-3xl font-bold text-gray-700">불확실</div>
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-300 relative shadow-xl">
                <div className="absolute -top-3 left-6">
                  <span className="px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Makers World
                  </span>
                </div>
                <div className="space-y-6 mt-4">
                  <div>
                    <span className="text-gray-500 text-sm">소요 시간</span>
                    <div className="text-3xl font-bold text-blue-600">10분</div>
                    <div className="w-full bg-blue-200 rounded-full h-3 mt-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{ width: '1%' }}></div>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">비용</span>
                    <div className="text-3xl font-bold text-blue-600">무료</div>
                    <div className="w-full bg-blue-200 rounded-full h-3 mt-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">성공 확신</span>
                    <div className="text-3xl font-bold text-blue-600">데이터 기반 검증</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Summary */}
            <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600">99%</div>
                  <div className="text-sm text-gray-600">시간 절약</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-600">비용 절약</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">∞</div>
                  <div className="text-sm text-gray-600">수정 횟수 무제한</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">24/7</div>
                  <div className="text-sm text-gray-600">언제든 이용 가능</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 7: Keywords & Trust (SEO + 신뢰)
          ============================================ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              이런 분야의 사업계획서를 지원합니다
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {seoKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-default"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 8: Final CTA (강력한 마무리)
          ============================================ */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-400/30 rounded-full px-4 py-2 mb-8">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 text-sm font-medium">예비창업패키지 다음 마감이 다가오고 있습니다</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              더 이상 미루지 마세요.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                지금 바로 시작하세요.
              </span>
            </h2>

            <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto leading-relaxed">
              10분 후, <strong className="text-white">심사위원을 설득할 수 있는</strong><br />
              전문가급 사업계획서를 손에 넣으세요.
            </p>

            <Button
              size="lg"
              onClick={handleCTAClick}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900 px-12 py-5 text-xl font-bold shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all transform hover:scale-105 border-0"
            >
              지금 무료로 사업계획서 작성하기
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-blue-200 text-sm">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-400" />
                회원가입 필요 없음
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-400" />
                완전 무료
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-400" />
                즉시 다운로드
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-400" />
                HWP/PDF 지원
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="py-12 bg-slate-900 text-gray-400 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-white">Makers World</span>
                  <p className="text-xs text-gray-500">AI 기반 비즈니스 빌딩 솔루션</p>
                </div>
              </div>

              {/* Keywords for SEO */}
              <div className="text-center md:text-right text-xs text-gray-500">
                <p>정부지원금 | 예비창업패키지 | 사업계획서 자동작성</p>
                <p className="mt-1">© 2024 Makers World. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
