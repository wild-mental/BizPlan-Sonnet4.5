/**
 * 평가 데모 소개 섹션
 */

import React from 'react';
import { ArrowRight, Sparkles, Target, Shield, TrendingUp, Users, Lightbulb } from 'lucide-react';
import { EVALUATION_AREAS } from '../../types/evaluation';
import { useEvaluationStore } from '../../stores/useEvaluationStore';

export const IntroSection: React.FC = () => {
  const setStep = useEvaluationStore((state) => state.setStep);

  const handleStart = () => {
    setStep('input');
  };

  // 아이콘 매핑
  const areaIcons: Record<string, React.ReactNode> = {
    M: <Target className="w-6 h-6" />,
    A: <Users className="w-6 h-6" />,
    K: <Lightbulb className="w-6 h-6" />,
    E: <TrendingUp className="w-6 h-6" />,
    R: <Shield className="w-6 h-6" />,
    S: <Sparkles className="w-6 h-6" />,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* 히어로 섹션 */}
      <section className="relative py-20 overflow-hidden">
        {/* 배경 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-slate-950 to-slate-950" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* 배지 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              무료 AI 평가 체험
            </div>

            {/* 타이틀 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                M.A.K.E.R.S
              </span>
              <br />
              AI 심사위원단 평가
            </h1>

            {/* 설명 */}
            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              정부지원사업 심사 기준에 맞춘 6대 핵심 평가 영역으로
              <br className="hidden md:block" />
              당신의 사업계획서를 객관적으로 진단합니다.
            </p>

            {/* CTA 버튼 */}
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 rounded-xl text-lg font-bold shadow-2xl shadow-emerald-500/25 transition-all group"
            >
              평가 시작하기
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 6대 평가 영역 소개 */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              6대 핵심 평가 영역
            </h2>
            <p className="text-white/60">
              예비창업패키지, 초기창업패키지 심사 기준 반영
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {EVALUATION_AREAS.map((area) => (
              <div
                key={area.code}
                className="glass-card rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  {/* 이니셜 */}
                  <div className={`w-12 h-12 rounded-xl bg-${area.color}-500/20 flex items-center justify-center text-${area.color}-400`}>
                    {areaIcons[area.code]}
                  </div>
                  {/* 코드 */}
                  <div>
                    <span className="text-2xl font-bold text-emerald-400">{area.code}</span>
                    <span className="text-white/40 text-sm ml-2">{area.name}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">{area.korean}</h3>
                <p className="text-white/50 text-sm">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 체험 범위 안내 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold mb-6 text-center">
                🎁 무료 데모 체험 범위
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 text-sm">✓</span>
                  </div>
                  <span className="text-white/80">6대 영역별 점수 확인</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 text-sm">✓</span>
                  </div>
                  <span className="text-white/80">종합 점수 및 합격 예상 확률</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 text-sm">✓</span>
                  </div>
                  <span className="text-white/80">강점 2개, 약점 1개 피드백</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-white/40 text-sm">🔒</span>
                  </div>
                  <span className="text-white/40">상세 피드백은 유료 요금제에서 제공</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 CTA */}
      <section className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 rounded-xl text-xl font-bold shadow-2xl shadow-emerald-500/25 transition-all group"
          >
            지금 바로 평가 시작하기
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default IntroSection;

