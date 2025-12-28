/**
 * 평가 결과 섹션
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, RefreshCw, Lock, TrendingUp, AlertTriangle, Lightbulb, Award } from 'lucide-react';
import { EVALUATION_AREAS } from '../../types/evaluation';
import { useEvaluationStore } from '../../stores/useEvaluationStore';
import ScoreRadarChart from '../../components/evaluation/ScoreRadarChart';

export const ResultSection: React.FC = () => {
  const navigate = useNavigate();
  const { evaluationResult, resetEvaluation } = useEvaluationStore();

  if (!evaluationResult) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>평가 결과를 불러오는 중...</p>
      </div>
    );
  }

  const { totalScore, passRate, scores, strengths, weaknesses, recommendations } = evaluationResult;

  // 점수 등급 계산
  const getGrade = (score: number): { label: string; color: string } => {
    if (score >= 90) return { label: 'S', color: 'text-emerald-400' };
    if (score >= 80) return { label: 'A', color: 'text-cyan-400' };
    if (score >= 70) return { label: 'B', color: 'text-blue-400' };
    if (score >= 60) return { label: 'C', color: 'text-amber-400' };
    return { label: 'D', color: 'text-rose-400' };
  };

  const grade = getGrade(totalScore);

  // 합격 가능성 색상
  const getPassRateColor = (rate: number): string => {
    if (rate >= 70) return 'text-emerald-400';
    if (rate >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  // 다시 평가하기
  const handleRetry = () => {
    resetEvaluation();
  };

  // 요금제 보기
  const handleViewPricing = () => {
    navigate('/#pricing-section');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
            <Award className="w-4 h-4" />
            AI 심사 완료
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            M.A.K.E.R.S AI 심사 결과
          </h1>
          <p className="text-white/60">
            6대 핵심 평가 영역에 대한 종합 분석 결과입니다.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* 상단: 종합 점수 + 레이더 차트 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* 종합 점수 */}
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white/60 mb-6 text-center">종합 점수</h3>
              
              <div className="text-center mb-6">
                {/* 원형 점수 표시 */}
                <div className="relative inline-flex items-center justify-center w-40 h-40 mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
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
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold">{totalScore}</span>
                    <span className="text-white/60 text-sm">/ 100점</span>
                  </div>
                </div>

                {/* 등급 */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-white/60">등급:</span>
                  <span className={`text-2xl font-bold ${grade.color}`}>{grade.label}</span>
                </div>

                {/* 합격 가능성 */}
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-white/60 mb-1">예상 합격 가능성</p>
                  <p className={`text-3xl font-bold ${getPassRateColor(passRate)}`}>
                    {passRate}%
                  </p>
                </div>
              </div>
            </div>

            {/* 레이더 차트 */}
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white/60 mb-4 text-center">6대 영역 분석</h3>
              <ScoreRadarChart scores={scores} />
            </div>
          </div>

          {/* 영역별 상세 점수 */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 mb-8">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              영역별 상세 점수
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {EVALUATION_AREAS.map((area) => {
                const score = scores[area.code];
                const areaGrade = getGrade(score);
                return (
                  <div key={area.code} className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-2 rounded-xl bg-white/5 flex items-center justify-center text-2xl font-bold ${areaGrade.color}`}>
                      {score}
                    </div>
                    <p className="text-emerald-400 font-bold">{area.code}</p>
                    <p className="text-white/60 text-sm">{area.korean}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 강점 */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-emerald-400" />
              강점 분석
            </h3>
            <div className="space-y-4">
              {strengths.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl ${item.isBlurred ? 'bg-white/5 relative overflow-hidden' : 'bg-emerald-500/10 border border-emerald-500/20'}`}
                >
                  {item.isBlurred && (
                    <div className="absolute inset-0 backdrop-blur-sm bg-slate-900/50 flex items-center justify-center z-10">
                      <div className="text-center">
                        <Lock className="w-5 h-5 text-white/40 mx-auto mb-1" />
                        <span className="text-white/40 text-sm">유료 요금제에서 확인</span>
                      </div>
                    </div>
                  )}
                  <p className="font-semibold text-emerald-400 mb-1">{item.title}</p>
                  <p className="text-white/70 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 약점 */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              개선 필요 영역
            </h3>
            <div className="space-y-4">
              {weaknesses.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl ${item.isBlurred ? 'bg-white/5 relative overflow-hidden' : 'bg-amber-500/10 border border-amber-500/20'}`}
                >
                  {item.isBlurred && (
                    <div className="absolute inset-0 backdrop-blur-sm bg-slate-900/50 flex items-center justify-center z-10">
                      <div className="text-center">
                        <Lock className="w-5 h-5 text-white/40 mx-auto mb-1" />
                        <span className="text-white/40 text-sm">유료 요금제에서 확인</span>
                      </div>
                    </div>
                  )}
                  <p className="font-semibold text-amber-400 mb-1">{item.title}</p>
                  <p className="text-white/70 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 개선 권장사항 */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 mb-8">
            <h3 className="text-lg font-semibold mb-4">📋 개선 권장사항</h3>
            <ul className="space-y-3">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-sm text-white/60">
                    {idx + 1}
                  </span>
                  <span className="text-white/70">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              다시 평가하기
            </button>
            <button
              onClick={handleViewPricing}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 rounded-xl font-bold shadow-lg shadow-emerald-500/25 transition-all group"
            >
              상세 피드백 받기
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* 하단 안내 */}
          <div className="text-center mt-8 text-white/40 text-sm">
            <p>
              🔒 상세 피드백, 개선 제안, PDF 리포트는 유료 요금제에서 제공됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultSection;

