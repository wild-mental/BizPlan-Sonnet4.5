/**
 * 평가 결과 섹션
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, RefreshCw, Lock, TrendingUp, AlertTriangle, Lightbulb, Award, Sparkles } from 'lucide-react';
import { EVALUATION_AREAS } from '../../types/evaluation';
import { useEvaluationStore } from '../../stores/useEvaluationStore';
import ScoreRadarChart from '../../components/evaluation/ScoreRadarChart';
import PaidPlanSelector from '../../components/PaidPlanSelector';

export const ResultSection: React.FC = () => {
  const { evaluationResult, resetEvaluation } = useEvaluationStore();
  const [showPricing, setShowPricing] = useState(false);

  // showPricing이 변경될 때 스크롤을 최상단으로 이동
  // 모든 Hooks는 early return 전에 호출되어야 함
  useEffect(() => {
    if (showPricing) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showPricing]);

  if (!evaluationResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 text-slate-900 flex items-center justify-center">
        <p className="text-slate-500">평가 결과를 불러오는 중...</p>
      </div>
    );
  }

  // 요금제 선택 화면 표시
  if (showPricing) {
    return (
      <PaidPlanSelector 
        title="상세 기능 이용하기"
        description="강점 부각 전략, 개선 제안, 상세 피드백을 확인하려면 요금제를 선택하세요."
        onBack={() => setShowPricing(false)}
      />
    );
  }

  const { totalScore, passRate, scores, strengths, weaknesses, recommendations } = evaluationResult;

  // 점수 등급 계산
  const getGrade = (score: number): { label: string; color: string } => {
    if (score >= 90) return { label: 'S', color: 'text-purple-600' };
    if (score >= 80) return { label: 'A', color: 'text-blue-600' };
    if (score >= 70) return { label: 'B', color: 'text-indigo-500' };
    if (score >= 60) return { label: 'C', color: 'text-amber-500' };
    return { label: 'D', color: 'text-rose-500' };
  };

  const grade = getGrade(totalScore);

  // 합격 가능성 색상
  const getPassRateColor = (rate: number): string => {
    if (rate >= 70) return 'text-purple-600';
    if (rate >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  // 다시 평가하기
  const handleRetry = () => {
    resetEvaluation();
  };

  // 요금제 보기 (유료 기능 클릭 시)
  const handleViewPricing = () => {
    setShowPricing(true);
    // 스크롤을 최상단으로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 text-slate-900 py-12">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 border border-purple-200 text-purple-600 text-sm mb-6">
            <Award className="w-4 h-4" />
            AI 심사 완료
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
            AI 심사위원단 평가 결과
          </h1>
          <p className="text-slate-500">
            6대 핵심 평가 영역에 대한 종합 분석 결과입니다.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* 상단: 종합 점수 + 레이더 차트 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* 종합 점수 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-500 mb-6 text-center">종합 점수</h3>
              
              <div className="text-center mb-6">
                {/* 원형 점수 표시 */}
                <div className="relative inline-flex items-center justify-center w-40 h-40 mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="12"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${(totalScore / 100) * 440} 440`}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#9333ea" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-slate-800">{totalScore}</span>
                    <span className="text-slate-500 text-sm">/ 100점</span>
                  </div>
                </div>

                {/* 등급 */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-slate-500">등급:</span>
                  <span className={`text-2xl font-bold ${grade.color}`}>{grade.label}</span>
                </div>

                {/* 합격 가능성 */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500 mb-1">예상 합격 가능성</p>
                  <p className={`text-3xl font-bold ${getPassRateColor(passRate)}`}>
                    {passRate}%
                  </p>
                  <p className="text-xs text-rose-500 mt-2">
                    ※ 80% 이상 달성 시 합격 가능성이 높아집니다
                  </p>
                </div>
              </div>
            </div>

            {/* 레이더 차트 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-500 mb-4 text-center">6대 영역 분석</h3>
              <ScoreRadarChart scores={scores} />
            </div>
          </div>

          {/* 영역별 상세 점수 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg mb-8">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-800">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              영역별 상세 점수
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {EVALUATION_AREAS.map((area) => {
                const score = scores[area.code];
                // M.A.K.E.R.S 각 영역별 고유 컬러
                const areaColors: Record<string, { bg: string; text: string; border: string }> = {
                  M: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-300' },
                  A: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300' },
                  K: { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-300' },
                  E: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-300' },
                  R: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-300' },
                  S: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-300' },
                };
                const colorTheme = areaColors[area.code] || areaColors.M;
                
                return (
                  <div key={area.code} className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-2 rounded-xl ${colorTheme.bg} border-2 ${colorTheme.border} flex items-center justify-center text-2xl font-bold ${colorTheme.text}`}>
                      {score}
                    </div>
                    <p className={`font-bold ${colorTheme.text}`}>{area.code}</p>
                    <p className="text-slate-500 text-sm">{area.korean}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 강점 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
              <Lightbulb className="w-5 h-5 text-teal-600" />
              강점 분석
            </h3>
            <div className="space-y-4">
              {strengths.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl ${item.isBlurred ? 'bg-slate-100 relative overflow-hidden' : 'bg-teal-50 border border-teal-200'}`}
                >
                  {item.isBlurred ? (
                    <>
                      {/* 희미하게 보이는 콘텐츠 + 우측 버튼 */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 select-none pointer-events-none" style={{ filter: 'blur(3px)', transform: 'scaleY(0.95)' }}>
                          <p className="font-semibold text-teal-400 mb-1">{item.title}</p>
                          <p className="text-slate-400 text-sm">{item.description}</p>
                        </div>
                        {/* 유료 요금제 확인 버튼 - 우측 배치 */}
                        <button 
                          onClick={handleViewPricing}
                          className="relative z-10 flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-500 hover:text-slate-700 text-xs font-medium transition-all"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          유료 요금제에서 확인하기
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-teal-700 mb-1">{item.title}</p>
                          <p className="text-slate-600 text-sm">{item.description}</p>
                        </div>
                        {/* 강점 부각 전략 버튼 */}
                        <button
                          onClick={handleViewPricing}
                          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-700 text-xs font-medium transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          부각 전략 확인하기
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 약점 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              개선 필요 영역
            </h3>
            <div className="space-y-4">
              {weaknesses.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl ${item.isBlurred ? 'bg-slate-100 relative overflow-hidden' : 'bg-rose-50 border border-rose-200'}`}
                >
                  {item.isBlurred ? (
                    <>
                      {/* 희미하게 보이는 콘텐츠 + 우측 버튼 */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 select-none pointer-events-none" style={{ filter: 'blur(3px)', transform: 'scaleY(0.95)' }}>
                          <p className="font-semibold text-rose-400 mb-1">{item.title}</p>
                          <p className="text-slate-400 text-sm">{item.description}</p>
                        </div>
                        {/* 유료 요금제 확인 버튼 - 우측 배치 */}
                        <button 
                          onClick={handleViewPricing}
                          className="relative z-10 flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-500 hover:text-slate-700 text-xs font-medium transition-all"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          유료 요금제에서 확인하기
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-rose-600 mb-1">{item.title}</p>
                          <p className="text-slate-600 text-sm">{item.description}</p>
                        </div>
                        {/* 개선 전략 제안 버튼 */}
                        <button
                          onClick={handleViewPricing}
                          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-600 text-xs font-medium transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          개선 전략 제안 받기
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 개선 권장사항 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg mb-8">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">📋 개선 권장사항</h3>
            <ul className="space-y-3">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-sm text-purple-600 font-medium">
                    {idx + 1}
                  </span>
                  <span className="text-slate-600">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 transition-all shadow-sm"
            >
              <RefreshCw className="w-5 h-5" />
              다시 평가하기
            </button>
            <button
              onClick={handleViewPricing}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-purple-500/25 transition-all group"
            >
              상세 피드백 받기
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* 하단 안내 */}
          <div className="text-center mt-8 text-slate-400 text-sm">
            <p>
              🔒 상세 피드백, 개선 제안, AI 재작성 루프는 유료 요금제에서 제공됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultSection;
