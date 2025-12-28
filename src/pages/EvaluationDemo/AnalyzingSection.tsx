/**
 * 분석 중 애니메이션 섹션
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { EVALUATION_AREAS } from '../../types/evaluation';
import { useEvaluationStore } from '../../stores/useEvaluationStore';

export const AnalyzingSection: React.FC = () => {
  const { analyzingProgress, currentJuror } = useEvaluationStore();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* 타이틀 */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            AI 심사위원단이 분석 중입니다
          </h1>
          <p className="text-white/60 mb-12">
            6명의 전문 AI 심사위원이 사업계획서를 검토하고 있습니다.
          </p>

          {/* 심사위원 카드 그리드 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {EVALUATION_AREAS.map((area) => {
              const isActive = currentJuror === area.code;
              const isPassed = currentJuror && 
                EVALUATION_AREAS.findIndex(a => a.code === currentJuror) > 
                EVALUATION_AREAS.findIndex(a => a.code === area.code);

              return (
                <div
                  key={area.code}
                  className={`relative glass-card rounded-2xl p-4 border transition-all duration-500 ${
                    isActive 
                      ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105' 
                      : isPassed
                        ? 'border-emerald-500/30 opacity-60'
                        : 'border-white/10 opacity-40'
                  }`}
                >
                  {/* 심사위원 이미지 */}
                  <div className="relative mb-3">
                    <img
                      src={area.image}
                      alt={area.korean}
                      className={`w-20 h-20 mx-auto rounded-xl object-cover transition-all duration-500 ${
                        isActive ? 'scale-110' : ''
                      }`}
                    />
                    {/* 분석 중 표시 */}
                    {isActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-xl animate-pulse" />
                        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                      </div>
                    )}
                    {/* 완료 표시 */}
                    {isPassed && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </div>

                  {/* 영역 정보 */}
                  <div className="text-center">
                    <span className={`text-xl font-bold ${
                      isActive ? 'text-emerald-400' : isPassed ? 'text-emerald-400/60' : 'text-white/40'
                    }`}>
                      {area.code}
                    </span>
                    <p className={`text-sm ${
                      isActive ? 'text-white' : 'text-white/50'
                    }`}>
                      {area.korean}
                    </p>
                  </div>

                  {/* 분석 상태 텍스트 */}
                  {isActive && (
                    <p className="text-xs text-emerald-400 mt-2 animate-pulse">
                      분석 중...
                    </p>
                  )}
                  {isPassed && (
                    <p className="text-xs text-emerald-400/60 mt-2">
                      완료
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* 진행률 바 */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">분석 진행률</span>
              <span className="text-sm text-emerald-400 font-semibold">{analyzingProgress}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${analyzingProgress}%` }}
              />
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="glass-card rounded-xl p-4 border border-white/10 max-w-md mx-auto">
            <p className="text-white/60 text-sm">
              💡 각 심사위원은 해당 분야의 전문 지식과 심사 경험을 바탕으로 
              사업계획서를 다각도로 분석합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzingSection;

