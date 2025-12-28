/**
 * 파일명: TeamPage.tsx
 * 
 * 파일 용도:
 * 팀 소개 페이지 컴포넌트
 * - MakersWorld 대표 소개
 * - MakersRound AI 개발진 소개
 * - 8개 사업 도메인별 비즈니스 컨설턴트 소개
 * - 최종 CTA: 회원가입 (요금제 선택 → 가입)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Rocket,
  Sparkles,
  Brain,
  Users,
  Award,
  Check,
  Zap
} from 'lucide-react';
import { PricingCards } from '../components/PricingCards';

/** CEO 프로필 */
const ceoProfile = {
  name: '김메이커',
  role: 'CEO & Founder',
  company: 'Makers World',
  image: '👨‍💼',
  education: '서울대학교 경영학/컴퓨터공학 복수전공',
  career: [
    '전) 네이버 스타트업 지원 프로그램 총괄',
    '전) 중소벤처기업부 창업진흥원 자문위원',
    '전) Y Combinator Visiting Partner',
  ],
  achievements: [
    '예비창업패키지 심사위원 5년 역임',
    '창업 지원 기업 누적 500개사 돌파',
    '정부지원금 합격률 68% 달성 (업계 평균 32%)',
  ],
  quote: '"모든 창업자는 성공할 자격이 있습니다. 우리는 그 가능성을 현실로 만듭니다."',
};

/** AI 개발진 프로필 */
const aiDevelopers = [
  {
    role: 'AI Research Lead',
    specialty: 'LLM & Multi-Agent Systems',
    education: '국내 AI 특성화 대학원 박사',
    career: [
      '글로벌 AI 연구소 경력',
      '멀티에이전트 시스템 설계 전문',
      '국제 AI 학회 논문 다수 게재',
    ],
  },
  {
    role: 'ML Engineer',
    specialty: 'NLP & Document AI',
    education: '국내 주요 대학 컴퓨터공학 석사',
    career: [
      '대기업 AI 연구소 경력',
      '자연어 처리 엔진 개발 전문',
      '문서 처리 관련 특허 보유',
    ],
  },
  {
    role: 'Data Scientist',
    specialty: 'Financial Modeling & Analytics',
    education: '국내 주요 대학 응용통계학 석사',
    career: [
      '금융권 데이터 분석 경력',
      '핀테크 스타트업 경험',
      '금융 AI 모델링 경력 8년',
    ],
  },
];

/** 도메인별 컨설턴트 프로필 */
const domainConsultants = [
  {
    domain: 'SaaS 온라인 서비스',
    domainColor: 'blue',
    icon: '💻',
    education: 'Stanford University MBA',
    career: [
      '전) AWS 한국 스타트업 담당',
      '전) 토스 B2B사업부 총괄',
      'SaaS 스타트업 3회 창업/EXIT',
    ],
    expertise: 'B2B SaaS 비즈니스 모델 설계, ARR 성장 전략',
    achievements: 'SaaS 스타트업 30개사 지원, 총 ARR 200억 원 달성',
  },
  {
    domain: '온오프라인 교육사업',
    domainColor: 'emerald',
    icon: '📚',
    education: '하버드 교육대학원 석사',
    career: [
      '전) 메가스터디 신규사업팀장',
      '전) 클래스101 COO',
      '에듀테크 스타트업 2회 창업',
    ],
    expertise: '교육 콘텐츠 수익화, 에듀테크 플랫폼 구축',
    achievements: '교육 스타트업 50개사 투자 유치 지원, 총 300억 원 펀딩',
  },
  {
    domain: '글로벌 유통사업',
    domainColor: 'cyan',
    icon: '🌏',
    education: '고려대학교 국제통상학 석사',
    career: [
      '전) KOTRA 해외진출 지원팀장',
      '전) 아마존 글로벌 셀링 한국 대표',
      '해외 바이어 네트워크 500개사 보유',
    ],
    expertise: '아마존/쿠팡 글로벌 셀링, 해외 시장 진출 전략',
    achievements: '아마존·쿠팡 셀러 150개사 육성, 연간 해외 매출 500억 원',
  },
  {
    domain: '레저 관광업',
    domainColor: 'amber',
    icon: '✈️',
    education: '경희대학교 관광학 박사',
    career: [
      '전) 하나투어 신사업본부장',
      '전) 한국관광공사 정책자문위원',
      '호텔/리조트 컨설팅 경력 15년',
    ],
    expertise: '관광 상품 개발, 지역관광 활성화 전략',
    achievements: '지역관광 활성화 프로젝트 50건, 정부지원금 합격률 87%',
  },
  {
    domain: '뷰티 코스메틱',
    domainColor: 'pink',
    icon: '💄',
    education: '파리 ESMOD 뷰티 MBA',
    career: [
      '전) 아모레퍼시픽 브랜드 디렉터',
      '전) 올리브영 MD팀장',
      '인디 뷰티 브랜드 2회 창업/EXIT',
    ],
    expertise: '뷰티 브랜딩, 유통 채널 입점 전략',
    achievements: '인디 뷰티 브랜드 40개 런칭, 올리브영·시코르 입점 성공률 90%',
  },
  {
    domain: 'SNS 콘텐츠 수익화',
    domainColor: 'purple',
    icon: '📱',
    education: '중앙대학교 미디어커뮤니케이션 석사',
    career: [
      '유튜브 구독자 150만 채널 운영',
      '전) 샌드박스네트워크 MCN 팀장',
      '크리에이터 이코노미 전문가',
    ],
    expertise: '콘텐츠 수익화 전략, MCN 사업 모델 설계',
    achievements: '크리에이터 200명 육성, 누적 콘텐츠 수익 100억 원',
  },
  {
    domain: '멀티 채널 마케팅',
    domainColor: 'orange',
    icon: '📊',
    education: 'Northwestern Kellogg MBA',
    career: [
      '전) Google Korea 마케팅 총괄',
      '전) Meta Korea 파트너십 매니저',
      'Google/Meta 공인 파트너 자격',
    ],
    expertise: '퍼포먼스 마케팅, D2C 브랜드 성장 전략',
    achievements: '퍼포먼스 마케팅 ROAS 평균 520%, D2C 브랜드 100개사 성장 지원',
  },
  {
    domain: 'IT Infra 보안 & AI 안전',
    domainColor: 'slate',
    icon: '🔐',
    education: 'MIT 사이버보안 석사',
    career: [
      '전) KISA 정보보호 심사원',
      '전) 삼성SDS 보안컨설팅팀장',
      'ISMS/ISO27001 인증 심사관',
    ],
    expertise: '정보보안 인증, AI 윤리 및 안전성 평가',
    achievements: '정보보안 인증 취득 80건, AI 서비스 안전성 평가 50건',
  },
];

// 요금제 데이터는 PricingCards 컴포넌트에서 관리

/**
 * TeamPage 컴포넌트
 */
export const TeamPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-shadow">
              <Rocket className="w-5 h-5" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-lg leading-tight">Makers Round</span>
              <span className="text-white/40 text-xs">by Makers World</span>
            </div>
          </Link>

          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>돌아가기</span>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[150px]" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
            <Users className="w-4 h-4" /> 팀 소개
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Makers World
            </span>
            <br />
            <span className="text-white">팀을 소개합니다</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            AI 기술과 비즈니스 전문성이 만나,<br />
            창업자의 성공을 설계합니다.
          </p>
        </div>
      </section>

      {/* CEO Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-4">
              <Award className="w-4 h-4" /> 대표이사
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">Leadership</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="glass-card rounded-3xl p-8 md:p-12 border border-amber-500/20">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-6xl md:text-7xl shadow-2xl shadow-amber-500/20">
                    {ceoProfile.image}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold mb-1">{ceoProfile.name}</h3>
                  <p className="text-amber-400 font-medium mb-2">{ceoProfile.role}</p>
                  <p className="text-white/60 text-sm mb-4">{ceoProfile.education}</p>

                  {/* Career */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white/80 mb-2">경력</h4>
                    <ul className="space-y-1">
                      {ceoProfile.career.map((item, i) => (
                        <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                          <span className="text-amber-400 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Achievements */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-white/80 mb-2">주요 성과</h4>
                    <div className="flex flex-wrap gap-2">
                      {ceoProfile.achievements.map((item, i) => (
                        <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg italic text-white/80 border-l-4 border-amber-500 pl-4">
                    {ceoProfile.quote}
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Development Team Section */}
      <section className="py-20 relative bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-4">
              <Brain className="w-4 h-4" /> AI 개발진
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">MakersRound AI Team</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              탄탄한 전문성을 갖춘 AI 연구진이 M.A.K.E.R.S 멀티에이전트 시스템을 구축했습니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {aiDevelopers.map((dev, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all hover-lift"
              >
                {/* Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-purple-300">{dev.role}</h3>
                  <p className="text-white/60 text-sm mt-1">{dev.specialty}</p>
                </div>

                {/* Education */}
                <p className="text-white/60 text-sm text-center mb-4">{dev.education}</p>

                {/* Career */}
                <ul className="space-y-1 mb-4">
                  {dev.career.map((item, j) => (
                    <li key={j} className="text-xs text-white/50 flex items-start gap-2">
                      <Check className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domain Consultants Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-4">
              <Sparkles className="w-4 h-4" /> 도메인 전문가
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Business Consultants</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              8개 핵심 사업 도메인별 10년 이상 경력의 검증된 전문가 그룹
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {domainConsultants.map((consultant, i) => (
              <div
                key={i}
                className={`glass-card rounded-2xl p-6 border border-${consultant.domainColor}-500/20 hover:border-${consultant.domainColor}-500/40 transition-all hover-lift`}
              >
                {/* Domain Badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${consultant.domainColor}-500/20 text-${consultant.domainColor}-400 text-xs font-bold mb-3`}>
                  <span>{consultant.icon}</span>
                  {consultant.domain}
                </div>

                {/* Role */}
                <h3 className={`font-bold text-lg mb-3 text-${consultant.domainColor}-300`}>
                  {consultant.domain} 리드 컨설턴트
                </h3>

                {/* Education */}
                <p className="text-white/50 text-xs mb-3">{consultant.education}</p>

                {/* Career Highlights */}
                <ul className="space-y-1 mb-3">
                  {consultant.career.slice(0, 2).map((item, j) => (
                    <li key={j} className="text-xs text-white/60 flex items-start gap-1.5">
                      <span className={`text-${consultant.domainColor}-400`}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Expertise */}
                <div className="pt-3 border-t border-white/10">
                  <p className="text-xs text-white/40 mb-1">전문 분야</p>
                  <p className="text-xs text-white/70">{consultant.expertise}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Pricing Selection */}
      <section className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
              <Zap className="w-4 h-4" /> 지금 시작하기
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Makers World 팀과 함께<br />
              <span className="text-gradient bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                성공적인 창업을 시작하세요
              </span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              요금제를 선택하고 지금 바로 회원가입하세요
            </p>
          </div>

          {/* Pricing Cards (공통 컴포넌트) */}
          <div className="mb-12">
            <PricingCards showTimetable={true} showDemoButtons={true} />
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Rocket className="w-4 h-4" />
            </div>
            <span className="font-bold">Makers Round</span>
          </div>
          <p className="text-white/40 text-sm">© 2024 Makers World. M.A.K.E.R.S AI 심사위원단</p>
        </div>
      </footer>
    </div>
  );
};


