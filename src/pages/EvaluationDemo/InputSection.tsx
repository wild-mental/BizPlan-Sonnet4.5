/**
 * 사업계획서 입력 섹션
 */

import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, FileText, Upload } from 'lucide-react';
import { EVALUATION_AREAS } from '../../types/evaluation';
import { useEvaluationStore } from '../../stores/useEvaluationStore';
import { SAMPLE_INPUT } from '../../utils/evaluationSimulator';

export const InputSection: React.FC = () => {
  const { businessPlanInput, setInput, setFullInput, setStep, startEvaluation } = useEvaluationStore();
  const [activeArea, setActiveArea] = useState(0);

  // 현재 활성 영역 정보
  const currentArea = EVALUATION_AREAS[activeArea];

  // 영역별 입력 필드 매핑
  const areaFieldMap: Record<string, { key: keyof typeof businessPlanInput; fields: string[] }> = {
    M: { key: 'marketability', fields: ['targetCustomer', 'marketSize'] },
    A: { key: 'ability', fields: ['teamComposition', 'coreCompetency'] },
    K: { key: 'keyTechnology', fields: ['techDifferentiation', 'intellectualProperty'] },
    E: { key: 'economics', fields: ['revenueProjection', 'breakEvenPoint'] },
    R: { key: 'realization', fields: ['milestones', 'riskManagement'] },
    S: { key: 'socialValue', fields: ['jobCreation', 'socialContribution'] },
  };

  const currentMapping = areaFieldMap[currentArea.code];

  // 입력값 변경 핸들러
  const handleInputChange = (fieldIndex: number, value: string) => {
    const fieldName = currentMapping.fields[fieldIndex];
    setInput(currentMapping.key, fieldName, value);
  };

  // 현재 영역의 입력값 가져오기
  const getCurrentValue = (fieldIndex: number): string => {
    const fieldName = currentMapping.fields[fieldIndex];
    const areaData = businessPlanInput[currentMapping.key] as Record<string, string>;
    return areaData[fieldName] || '';
  };

  // 다음/이전 영역 이동
  const handleNext = () => {
    if (activeArea < EVALUATION_AREAS.length - 1) {
      setActiveArea(activeArea + 1);
    }
  };

  const handlePrev = () => {
    if (activeArea > 0) {
      setActiveArea(activeArea - 1);
    }
  };

  // 평가 시작
  const handleStartEvaluation = () => {
    startEvaluation();
  };

  // 샘플 데이터 적용
  const handleUseSample = () => {
    setFullInput(SAMPLE_INPUT);
  };

  // 파일 업로드 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 업로드 핸들러
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // TODO: 파일 내용 파싱 및 입력 필드에 적용
      // 현재는 텍스트 파일만 지원 (추후 HWP/PDF 파싱 연동)
      console.log('업로드된 파일 내용:', content);
      alert('파일 업로드 기능은 준비 중입니다. 곧 지원될 예정입니다.');
    };
    reader.readAsText(file);
  };

  // 진행률 계산
  const progress = ((activeArea + 1) / EVALUATION_AREAS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="max-w-3xl mx-auto mb-8">
          <button
            onClick={() => setStep('intro')}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            소개로 돌아가기
          </button>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            사업계획서 정보 입력
          </h1>
          <p className="text-white/60 mb-6">
            각 영역별 핵심 질문에 답변해 주세요. 입력 내용이 상세할수록 정확한 평가가 가능합니다.
          </p>
          
          {/* 샘플 데이터 / 파일 업로드 버튼 */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleUseSample}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-all"
            >
              <FileText className="w-4 h-4" />
              샘플 데이터로 채우기
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-all"
            >
              <Upload className="w-4 h-4" />
              파일 업로드
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.hwp,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* 진행률 표시 */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">진행률</span>
            <span className="text-sm text-emerald-400">{activeArea + 1} / {EVALUATION_AREAS.length}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 영역 탭 */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {EVALUATION_AREAS.map((area, index) => (
              <button
                key={area.code}
                onClick={() => setActiveArea(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all ${
                  index === activeArea
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                <span className="text-lg mr-2">{area.code}</span>
                <span className="hidden md:inline">{area.korean}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 입력 폼 */}
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 mb-6">
            {/* 영역 헤더 */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={currentArea.image}
                alt={currentArea.korean}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-emerald-400">{currentArea.code}</span>
                  <span className="text-white/60">{currentArea.name}</span>
                </div>
                <h2 className="text-xl font-bold">{currentArea.korean}</h2>
              </div>
            </div>

            <p className="text-white/60 text-sm mb-6 pb-6 border-b border-white/10">
              {currentArea.description}
            </p>

            {/* 질문 입력 필드 */}
            <div className="space-y-6">
              {currentArea.questions.map((question, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    {question}
                  </label>
                  <textarea
                    value={getCurrentValue(idx)}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    placeholder="여기에 답변을 입력해 주세요..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-white/40 mt-1">
                    구체적으로 작성할수록 높은 점수를 받을 수 있습니다.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 네비게이션 버튼 */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={activeArea === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeArea === 0
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              이전
            </button>

            {activeArea === EVALUATION_AREAS.length - 1 ? (
              <button
                onClick={handleStartEvaluation}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 rounded-lg font-bold shadow-lg shadow-emerald-500/25 transition-all group"
              >
                <Sparkles className="w-5 h-5" />
                AI 심사 시작
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg font-medium transition-all"
              >
                다음
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSection;

