/**
 * Makers Round 울트라 프리미엄 랜딩페이지
 * M.A.K.E.R.S AI 평가위원회 시스템
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import {
  Rocket, FileText, Sparkles, Clock, CheckCircle2, ArrowRight, Users, Award, Zap,
  Target, AlertTriangle, Brain, LineChart, Shield, GraduationCap, Building2,
  Briefcase, User, Coffee, ChevronRight, Check, Star, MessageSquare, Crown,
  TrendingUp, Globe, Lightbulb, BarChart3, Scale, Heart, Cpu, BadgeCheck
} from 'lucide-react';

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
const seoKeywords = ['정부사업지원금', '예비창업패키지', '초기창업패키지', 'AI 심사위원회', '멀티에이전트 AI', '사업계획서 자동작성', '1인 소자본 창업', '창업 트렌드'];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activePersona, setActivePersona] = useState(0);
  const [hoveredMaker, setHoveredMaker] = useState<number | null>(null);

  const handleCTAClick = () => navigate('/app');

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center gradient-mesh overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-rotate-slow" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-3 glass rounded-full px-6 py-3 mb-8 animate-fade-in">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Rocket className="w-4 h-4" />
              </div>
              <span className="font-semibold">Makers Round</span>
              <span className="text-white/40">|</span>
              <span className="text-white/60 text-sm">by Makers World</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight animate-fade-in-up">
              정부지원금 합격률을<br />
              <span className="text-gradient">6명의 AI 심사위원</span>이<br />
              높여드립니다
            </h1>

            {/* M.A.K.E.R.S Preview */}
            <div className="flex justify-center gap-2 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {makersCommittee.map((m, i) => (
                <div key={i} className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center font-bold text-xl shadow-lg`}>
                  {m.letter}
                </div>
              ))}
            </div>

            <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <strong className="text-white">M.A.K.E.R.S AI 평가위원회</strong>가<br />
              사업계획서의 6가지 핵심 영역을 사전 심사합니다
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Button size="lg" onClick={handleCTAClick} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-10 py-5 text-lg font-bold shadow-2xl animate-pulse-glow border-0">
                무료로 AI 심사 받아보기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
              {[
                { value: '3,500+', label: '사업계획서 심사' },
                { value: '94.7%', label: '사용자 만족도' },
                { value: '6명', label: 'AI 심사위원' },
                { value: '10분', label: '평균 소요시간' },
              ].map((s, i) => (
                <div key={i} className="text-center glass rounded-2xl p-4">
                  <div className="text-2xl md:text-3xl font-bold text-gradient">{s.value}</div>
                  <div className="text-sm text-white/60">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROBLEM SECTION ===== */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
              <AlertTriangle className="w-4 h-4" /> 창업의 현실
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              왜 <span className="text-red-400">42%</span>의 창업이 실패할까요?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Brain, title: '범용 AI의 한계', desc: 'ChatGPT 등 범용 LLM의 환각 현상과 비즈니스 도메인 전문성 부족', stat: '환각률 40%+' },
              { icon: Building2, title: '고비용 컨설팅 장벽', desc: '200~500만원의 컨설팅 비용은 초기 창업자에게 부담', stat: '평균 300만원' },
              { icon: Target, title: '솔루션의 부재', desc: '단발성 교육만 있고 지속적인 밀착형 가이드가 없음', stat: '피드백 부재' },
            ].map((p, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 hover-lift hover-border">
                <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center mb-4">
                  <p.icon className="w-7 h-7 text-red-400" />
                </div>
                <span className="text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-full">{p.stat}</span>
                <h3 className="text-xl font-bold mt-3 mb-2">{p.title}</h3>
                <p className="text-white/60">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== M.A.K.E.R.S COMMITTEE SECTION ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-radial" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
              <Crown className="w-4 h-4" /> 핵심 차별점
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">M.A.K.E.R.S</span> AI 평가위원회
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              정부지원사업 평가의 6가지 핵심 영역을 전담하는 AI 심사위원단
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {makersCommittee.map((m, i) => (
              <div
                key={i}
                className={`glass-card rounded-2xl p-6 hover-lift cursor-pointer transition-all ${hoveredMaker === i ? 'border-2 ' + m.borderColor + ' glow-purple' : 'border border-white/10'}`}
                onMouseEnter={() => setHoveredMaker(i)}
                onMouseLeave={() => setHoveredMaker(null)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center font-bold text-2xl shadow-lg`}>
                    {m.letter}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{m.name}</h3>
                    <p className="text-white/60 text-sm">{m.korean} 담당</p>
                  </div>
                </div>
                <div className={`mt-4 p-4 rounded-xl ${m.bgColor}`}>
                  <m.icon className="w-5 h-5 mb-2 opacity-80" />
                  <p className="text-sm text-white/80">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section className="py-24 relative">
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

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">고객 후기</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 hover-lift">
                <div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-white/80 mb-6">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{t.avatar}</span>
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-sm text-white/60">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
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
            지금 바로<br /><span className="text-gradient">AI 심사위원회</span>를 만나보세요
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
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">Makers Round</span>
          </div>
          <p className="text-white/40 text-sm">© 2024 Makers World. M.A.K.E.R.S AI 평가위원회</p>
        </div>
      </footer>
    </div>
  );
};
