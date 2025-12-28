/**
 * 데모 공통 헤더 컴포넌트
 * writing-demo와 evaluation-demo에서 공통으로 사용
 * - 로고 + 뒤로가기
 * - 진행 단계 표시
 * - BGM 토글 (전역 상태 동기화)
 * - 회원가입 버튼
 */

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket, Music, Music2 } from 'lucide-react';
import { useMusicStore } from '../stores/useMusicStore';

export type DemoType = 'writing' | 'evaluation';

export interface DemoStep {
  id: string;
  label: string;
}

interface DemoHeaderProps {
  /** 데모 타입 */
  demoType: DemoType;
  /** 현재 단계 ID */
  currentStep: string | number;
  /** 단계 목록 */
  steps: DemoStep[];
  /** 테마 (다크/라이트) */
  theme?: 'dark' | 'light';
  /** 추가 정보 (템플릿명, 프로젝트명 등) */
  subtitle?: string;
}

export const DemoHeader: React.FC<DemoHeaderProps> = ({
  demoType,
  currentStep,
  steps,
  theme = 'dark',
  subtitle,
}) => {
  const navigate = useNavigate();
  
  // 전역 음악 상태 사용
  const { isPlaying, togglePlay, initAudio } = useMusicStore();
  
  // 컴포넌트 마운트 시 Audio 초기화
  useEffect(() => {
    initAudio();
  }, [initAudio]);

  // 뒤로가기 처리
  const handleGoBack = () => {
    navigate(-1);
  };

  const isDark = theme === 'dark';

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl border-b ${
        isDark 
          ? 'bg-slate-950/80 border-white/10' 
          : 'bg-white/80 border-gray-200'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* 왼쪽: 뒤로가기 + 로고 */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark 
                ? 'text-white/60 hover:text-white hover:bg-white/10' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="뒤로가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-shadow ${
              isDark
                ? 'bg-gradient-to-br from-purple-500 to-blue-500 group-hover:shadow-purple-500/25'
                : 'bg-gradient-to-br from-purple-500 to-blue-500 group-hover:shadow-purple-500/25'
            }`}>
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className={`font-bold hidden sm:inline ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              MakersRound
            </span>
          </Link>

          {/* 서브타이틀 (템플릿명 등) */}
          {subtitle && (
            <>
              <span className={isDark ? 'text-white/30' : 'text-gray-300'}>|</span>
              <span className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                {subtitle}
              </span>
            </>
          )}
        </div>

        {/* 중앙: 진행 단계 표시 */}
        <div className="hidden md:flex items-center gap-1.5">
          {steps.map((step, idx) => {
            const isCurrentStep = String(currentStep) === String(step.id);
            const stepIndex = steps.findIndex(s => String(s.id) === String(step.id));
            const currentIndex = steps.findIndex(s => String(s.id) === String(currentStep));
            const isPassed = stepIndex < currentIndex;
            
            return (
              <React.Fragment key={step.id}>
                <div 
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    isCurrentStep
                      ? demoType === 'evaluation'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-purple-500/20 text-purple-400'
                      : isPassed
                        ? isDark ? 'text-white/60' : 'text-gray-600'
                        : isDark ? 'text-white/30' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-4 h-px ${
                    isPassed 
                      ? isDark ? 'bg-white/40' : 'bg-gray-400'
                      : isDark ? 'bg-white/20' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* 오른쪽: BGM + 회원가입 */}
        <div className="flex items-center gap-3">
          {/* BGM 토글 */}
          <button
            onClick={togglePlay}
            className="relative flex items-center gap-2 group"
            title={isPlaying ? '음악 끄기' : '음악 켜기'}
          >
            <div className={`relative w-10 h-6 rounded-full transition-all duration-300 ${
              isPlaying 
                ? demoType === 'evaluation' 
                  ? 'bg-emerald-500/30' 
                  : 'bg-purple-500/30'
                : isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-gray-200 hover:bg-gray-300'
            }`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                isPlaying 
                  ? demoType === 'evaluation'
                    ? 'left-5 bg-emerald-400'
                    : 'left-5 bg-purple-400'
                  : `left-1 ${isDark ? 'bg-white/60' : 'bg-gray-500'}`
              }`}>
                {isPlaying ? (
                  <Music className="w-2.5 h-2.5 text-slate-900" />
                ) : (
                  <Music2 className={`w-2.5 h-2.5 ${isDark ? 'text-slate-900' : 'text-white'}`} />
                )}
              </div>
            </div>
          </button>

          {/* 회원가입 버튼 */}
          <Link
            to="/signup"
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              demoType === 'evaluation'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90'
                : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90'
            }`}
          >
            회원가입
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default DemoHeader;
