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
      
      // 현재 선택된 첫 번째 필드에 내용 추가
      const targetField = currentMapping.fields[0];
      const currentVal = getCurrentValue(0);
      
      const confirm = window.confirm(`파일 내용(${file.name})을 현재 질문에 추가하시겠습니까?\n\n* 텍스트 파일만 지원됩니다.`);
      
      if (confirm) {
        handleInputChange(0, currentVal ? currentVal + "\n\n" + content : content);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 진행률 계산
  const progress = ((activeArea + 1) / EVALUATION_AREAS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 text-slate-900 py-12">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="max-w-3xl mx-auto mb-8">
          <button
            onClick={() => setStep('intro')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            소개로 돌아가기
          </button>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
            사업계획서 정보 입력
          </h1>
          <p className="text-slate-500 mb-6">
            각 영역별 핵심 질문에 답변해 주세요. 입력 내용이 상세할수록 정확한 평가가 가능합니다.
          </p>
          
          {/* 샘플 데이터 / 파일 업로드 버튼 */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleUseSample}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-300 hover:border-slate-400 rounded-lg transition-all bg-white shadow-sm"
            >
              <FileText className="w-4 h-4" />
              샘플 데이터로 채우기
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-300 hover:border-slate-400 rounded-lg transition-all bg-white shadow-sm"
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
            <span className="text-sm text-slate-500">진행률</span>
            <span className="text-sm text-purple-600 font-medium">{activeArea + 1} / {EVALUATION_AREAS.length}</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
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
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all shadow-sm ${
                  index === activeArea
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
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
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-lg mb-6">
            {/* 영역 헤더 */}
            <div className="flex items-center gap-6 mb-6">
              <img
                src={currentArea.image}
                alt={currentArea.korean}
                className="w-40 h-40 rounded-2xl object-cover shadow-xl border-2 border-purple-200"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-4xl font-bold text-purple-600">{currentArea.code}</span>
                  <span className="text-slate-500 text-xl">{currentArea.name}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{currentArea.korean}</h2>
                {/* 핵심 질문 (Tagline) */}
                <p className="text-slate-600 font-medium italic text-sm">
                  "{currentArea.tagline}"
                </p>
              </div>
            </div>

            {/* PSST 시각화 그래픽 */}
            <div className="flex items-center justify-center gap-1 mb-4">
              {[
                { code: 'P', name: 'Problem', areas: ['[1. Problem]'] },
                { code: 'S', name: 'Solution', areas: ['[2. Solution]'] },
                { code: 'S', name: 'Scale-up', areas: ['[3. Scale-up]'] },
                { code: 'T', name: 'Team', areas: ['[4. Team]'] },
              ].map((psst, idx) => {
                const isPrimary = currentArea.primaryCoverage.area.includes(psst.areas[0]);
                const isSecondary = currentArea.secondaryCoverage.area?.includes(psst.areas[0]);
                const isActive = isPrimary || isSecondary;
                
                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all ${
                      isPrimary 
                        ? 'bg-teal-100 border-2 border-teal-400' 
                        : isSecondary 
                          ? 'bg-purple-100 border-2 border-purple-400'
                          : 'bg-slate-100 border border-slate-200'
                    }`}
                    title={psst.name}
                  >
                    <span className={`text-xl font-bold ${
                      isPrimary ? 'text-teal-700' : isSecondary ? 'text-purple-600' : 'text-slate-400'
                    }`}>
                      {psst.code}
                    </span>
                    {/* 활성화된 영역만 풀네임 표시 */}
                    {isActive && (
                      <span className={`text-[10px] mt-0.5 font-medium ${
                        isPrimary ? 'text-teal-600' : 'text-purple-500'
                      }`}>
                        {psst.name}
                      </span>
                    )}
                  </div>
                );
              })}
              <div className="ml-4 flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-teal-500 rounded-full border-2 border-teal-300" />
                  <span className="text-slate-600 font-medium">핵심</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-purple-500 rounded-full border-2 border-purple-300" />
                  <span className="text-slate-600 font-medium">보조</span>
                </span>
              </div>
            </div>

            {/* PSST 커버리지 정보 */}
            <div className={`grid gap-4 mb-6 pb-6 border-b border-slate-200 ${
              currentArea.secondaryCoverage.area ? 'md:grid-cols-2' : 'md:grid-cols-1'
            }`}>
              {/* 핵심 평가 영역 */}
              <div className="bg-teal-50 border-l-4 border-teal-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 bg-teal-500 rounded-full" />
                  <span className="text-xs font-bold text-teal-700">핵심 평가 영역</span>
                </div>
                <p className="text-sm text-slate-700 font-medium mb-2">{currentArea.primaryCoverage.area}</p>
                <ul className="space-y-1">
                  {currentArea.primaryCoverage.items.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-teal-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 보조 평가 영역 */}
              {currentArea.secondaryCoverage.area && (
                <div className="bg-purple-50 border-l-4 border-purple-400 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 bg-purple-500 rounded-full" />
                    <span className="text-xs font-bold text-purple-700">보조 평가 영역</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium mb-2">{currentArea.secondaryCoverage.area}</p>
                  <ul className="space-y-1">
                    {currentArea.secondaryCoverage.items.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <span className="text-purple-500 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 질문 입력 필드 */}
            <div className="space-y-6">
              {currentArea.questions.map((question, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {question}
                  </label>
                  <textarea
                    value={getCurrentValue(idx)}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    placeholder="여기에 답변을 입력해 주세요..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-slate-400 mt-1">
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
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              이전
            </button>

            {activeArea === EVALUATION_AREAS.length - 1 ? (
              <button
                onClick={handleStartEvaluation}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-bold shadow-lg shadow-purple-500/25 transition-all group"
              >
                <Sparkles className="w-5 h-5" />
                AI 심사 시작
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-lg font-medium transition-all"
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

