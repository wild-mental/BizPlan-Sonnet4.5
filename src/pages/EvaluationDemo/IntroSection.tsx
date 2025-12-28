/**
 * 평가 데모 소개 섹션
 */

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { EVALUATION_AREAS } from '../../types/evaluation';
import { useEvaluationStore } from '../../stores/useEvaluationStore';

export const IntroSection: React.FC = () => {
  const setStep = useEvaluationStore((state) => state.setStep);

  const handleStart = () => {
    setStep('input');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
      {/* 히어로 섹션 */}
      <section className="relative py-4 overflow-hidden w-full">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* 배지 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              무료 AI 평가 체험
            </div>

            {/* 타이틀 */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                M.A.K.E.R.S
              </span>
              {' '}AI 심사위원단
            </h1>

            {/* 설명 */}
            <p className="text-base md:text-lg text-white/70 mb-0 max-w-2xl mx-auto">
              6대 핵심 평가 영역으로 사업계획서를 객관적으로 진단합니다
            </p>

            {/* AI 심사위원단 이미지 - 큰 사이즈, 음수 마진으로 오버랩 */}
            <div className="relative -mb-8 -mt-4">
              {/* 배경 글로우 효과 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div 
                  className="w-[90%] h-[70%] rounded-full blur-3xl"
                  style={{ background: 'radial-gradient(ellipse at center, rgba(147, 51, 234, 0.4) 0%, rgba(59, 130, 246, 0.25) 30%, rgba(99, 102, 241, 0.1) 50%, transparent 70%)' }}
                />
              </div>
              <img 
                src="/assets/juror-logos/all-jurors-fullbody-tr.png" 
                alt="M.A.K.E.R.S AI 심사위원단" 
                className="relative z-10 w-full max-w-2xl mx-auto h-auto drop-shadow-2xl"
              />
              {/* 하단 그라데이션 오버레이 - 자연스러운 블렌딩 */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-800 to-transparent z-20" />
            </div>

            {/* 6대 평가 영역 (컴팩트) - 이미지 위로 살짝 올라옴 */}
            <div className="relative z-20 flex flex-wrap justify-center gap-2 mb-4 max-w-3xl mx-auto">
              {EVALUATION_AREAS.map((area) => (
                <div
                  key={area.code}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-sm border border-white/10 text-sm"
                >
                  <span className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">
                    {area.code}
                  </span>
                  <span className="text-white/80">{area.korean}</span>
                </div>
              ))}
            </div>

            {/* 데모 체험 범위 */}
            <div className="relative z-20 max-w-xl mx-auto mb-6 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-purple-500/20">
              <div className="text-base font-semibold text-white mb-2">🎁 무료 데모 체험 범위</div>
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-purple-400 font-medium text-sm">✓ 6대 영역 점수</span>
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-purple-400 font-medium text-sm">✓ 합격 예상 확률</span>
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-purple-400 font-medium text-sm">✓ 핵심 피드백 3개</span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs text-white/40 mb-1.5">🔒 유료 요금제 추가 기능</div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/40 text-xs">영역별 상세 피드백</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/40 text-xs">개선 가이드</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/40 text-xs">AI기반 재작성 루프</span>
                </div>
              </div>
            </div>

            {/* CTA 버튼 */}
            <div className="relative z-20">
              <button
                onClick={handleStart}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl text-lg font-bold shadow-2xl shadow-purple-500/25 transition-all group"
              >
                AI 평가 데모 체험
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntroSection;
