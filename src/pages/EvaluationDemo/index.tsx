/**
 * AI 심사위원단 평가 데모 페이지
 * M.A.K.E.R.S 6대 핵심 평가 영역 체험
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, Music2 } from 'lucide-react';
import { useEvaluationStore } from '../../stores/useEvaluationStore';
import IntroSection from './IntroSection';
import InputSection from './InputSection';
import AnalyzingSection from './AnalyzingSection';
import ResultSection from './ResultSection';

export const EvaluationDemoPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentStep, resetEvaluation } = useEvaluationStore();
  const [isBgmPlaying, setIsBgmPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // 페이지 진입 시 상태 초기화 옵션
  useEffect(() => {
    // 페이지 최상단으로 스크롤
    window.scrollTo(0, 0);
  }, [currentStep]);

  // BGM 토글
  const toggleBgm = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/assets/soundtrack/landing-page-bgm.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
    
    if (isBgmPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsBgmPlaying(!isBgmPlaying);
  };

  // 홈으로 돌아가기
  const handleGoHome = () => {
    resetEvaluation();
    navigate('/');
  };

  // 현재 단계에 맞는 컴포넌트 렌더링
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'intro':
        return <IntroSection />;
      case 'input':
        return <InputSection />;
      case 'analyzing':
        return <AnalyzingSection />;
      case 'result':
        return <ResultSection />;
      default:
        return <IntroSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* 고정 헤더 */}
      <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* 로고 / 뒤로가기 */}
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">MakersRound</span>
          </button>

          {/* 현재 단계 표시 */}
          <div className="hidden md:flex items-center gap-2">
            {['intro', 'input', 'analyzing', 'result'].map((step, idx) => (
              <React.Fragment key={step}>
                <div 
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentStep === step 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'text-white/40'
                  }`}
                >
                  {step === 'intro' && '소개'}
                  {step === 'input' && '입력'}
                  {step === 'analyzing' && '분석'}
                  {step === 'result' && '결과'}
                </div>
                {idx < 3 && (
                  <div className="w-4 h-px bg-white/20" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* BGM 토글 */}
          <button
            onClick={toggleBgm}
            className="relative flex items-center gap-2 group"
            title={isBgmPlaying ? '음악 끄기' : '음악 켜기'}
          >
            <div className={`relative w-10 h-6 rounded-full transition-all duration-300 ${
              isBgmPlaying ? 'bg-emerald-500/30' : 'bg-white/10 hover:bg-white/15'
            }`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                isBgmPlaying 
                  ? 'left-5 bg-emerald-400' 
                  : 'left-1 bg-white/60'
              }`}>
                {isBgmPlaying ? (
                  <Music className="w-2.5 h-2.5 text-slate-900" />
                ) : (
                  <Music2 className="w-2.5 h-2.5 text-slate-900" />
                )}
              </div>
            </div>
          </button>
        </nav>
      </header>

      {/* 메인 콘텐츠 (헤더 높이만큼 패딩) */}
      <main className="pt-16">
        {renderCurrentStep()}
      </main>
    </div>
  );
};

export default EvaluationDemoPage;

