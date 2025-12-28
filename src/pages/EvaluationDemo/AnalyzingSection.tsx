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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 text-slate-900 flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* 타이틀 */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
            AI 심사위원단이 분석 중입니다
          </h1>
          <p className="text-slate-500 mb-12">
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
                  className={`relative bg-white rounded-2xl p-4 border transition-all duration-500 shadow-sm overflow-hidden ${
                    isActive 
                      ? 'border-purple-500 shadow-lg shadow-purple-500/20 scale-105' 
                      : isPassed
                        ? 'border-teal-300'
                        : 'border-slate-200 opacity-50'
                  }`}
                >
                  {/* 분석 중 - 카드 전체 오버레이 */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-blue-500/10 animate-pulse rounded-2xl" />
                  )}
                  
                  {/* 심사위원 이미지 */}
                  <div className="relative mb-3 z-10">
                    <img
                      src={area.image}
                      alt={area.korean}
                      className={`w-36 h-36 mx-auto rounded-2xl object-cover transition-all duration-500 shadow-lg ${
                        isActive ? 'scale-105' : ''
                      }`}
                    />
                    {/* 완료 표시 */}
                    {isPassed && (
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white text-base">✓</span>
                      </div>
                    )}
                  </div>

                  {/* 영역 정보 */}
                  <div className="text-center relative z-10">
                    <div className="relative inline-flex items-center justify-center">
                      <span className={`text-xl font-bold ${
                        isActive ? 'text-purple-600/30' : isPassed ? 'text-teal-600' : 'text-slate-400'
                      }`}>
                        {area.code}
                      </span>
                      {/* 분석 중 로더 - 이니셜 위에 오버랩 */}
                      {isActive && (
                        <Loader2 className="absolute w-6 h-6 text-purple-600 animate-spin" />
                      )}
                    </div>
                    <p className={`text-sm ${
                      isActive ? 'text-slate-700' : 'text-slate-500'
                    }`}>
                      {area.korean}
                    </p>
                  </div>

                  {/* 분석 상태 텍스트 */}
                  <div className="relative z-10">
                    {isActive && (
                      <p className="text-xs text-purple-600 mt-2 animate-pulse font-medium">
                        분석 중...
                      </p>
                    )}
                    {isPassed && (
                      <p className="text-xs text-teal-600 mt-2 font-medium">
                        완료
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 진행률 바 */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">분석 진행률</span>
              <span className="text-sm text-purple-600 font-semibold">{analyzingProgress}%</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${analyzingProgress}%` }}
              />
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 max-w-md mx-auto shadow-sm">
            <p className="text-slate-500 text-sm">
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

