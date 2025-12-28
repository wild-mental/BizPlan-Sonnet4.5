/**
 * 파일명: ProjectCreate.tsx
 * 
 * 파일 용도:
 * 프로젝트 생성 페이지 - 애플리케이션의 진입점
 * - 사용자로부터 템플릿 선택을 받음
 * - 프로젝트 생성 후 마법사 단계로 이동
 * - 프로젝트명(사업 아이템명)은 마법사 1단계에서 입력
 * 
 * 호출 구조:
 * ProjectCreate (이 컴포넌트)
 *   ├─> useProjectStore.createProject() - 프로젝트 생성
 *   ├─> useWizardStore.resetWizard() - 마법사 상태 초기화
 *   └─> navigate('/wizard/1') - 첫 번째 마법사 단계로 이동
 * 
 * 데이터 흐름:
 * 1. 사용자 입력 (템플릿) → 로컬 state
 * 2. 제출 시 → useProjectStore에 저장 (임시 이름으로 생성)
 * 3. 마법사 초기화 → useWizardStore.resetWizard()
 * 4. 페이지 이동 → /wizard/1 (사업 아이템명 입력)
 * 
 * 사용하는 Store:
 * - useProjectStore: 프로젝트 정보 관리
 * - useWizardStore: 마법사 진행 상태 관리
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../stores/useProjectStore';
import { useWizardStore } from '../stores/useWizardStore';
import { templates } from '../types/mockData';
import { TemplateType } from '../types';
import { Button } from '../components/ui';
import { DemoHeader } from '../components/DemoHeader';
import { Sparkles, FileText, BarChart3 } from 'lucide-react';
import { TEMPLATE_THEMES } from '../constants/templateThemes';

/**
 * ProjectCreate 컴포넌트
 * 
 * 역할:
 * - 신규 프로젝트 생성을 위한 초기 설정 페이지
 * - 템플릿 선택 UI 제공
 * - 입력 유효성 검증 및 에러 처리
 * 
 * 주요 기능:
 * 1. 템플릿 선택 (예비창업패키지/초기창업패키지/정책자금)
 * 2. 입력 유효성 검증
 * 3. 프로젝트 생성 및 마법사로 이동
 * 
 * @returns {JSX.Element} 프로젝트 생성 페이지
 */
export const ProjectCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createProject } = useProjectStore();
  const { resetWizard, loadTemplateQuestions } = useWizardStore();
  // Local state
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [error, setError] = useState('');

  /**
   * 템플릿 선택 핸들러
   */
  const handleTemplateSelect = useCallback((template: TemplateType) => {
    setSelectedTemplate(template);
    setError('');
  }, []);

  /**
   * 폼 제출 핸들러
   * 
   * 처리 순서:
   * 1. 템플릿 선택 여부 검증
   * 2. useProjectStore.createProject() 호출 (임시 이름으로 생성)
   * 3. useWizardStore.resetWizard() 호출
   * 4. 템플릿별 질문 로드 (예비창업/초기창업 차별화)
   * 5. /wizard/1 경로로 이동
   * 
   * @param {React.FormEvent} e - 폼 제출 이벤트
   */
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTemplate) {
      setError('템플릿을 선택해주세요.');
      return;
    }

    // Create new project with empty name (will be filled when user enters item-name)
    createProject('', selectedTemplate);
    resetWizard();
    
    // 템플릿별 질문 로드 (예비창업패키지/초기창업패키지 차별화)
    loadTemplateQuestions(selectedTemplate);
    
    // Navigate to wizard
    navigate('/wizard/1');
  }, [selectedTemplate, createProject, resetWizard, loadTemplateQuestions, navigate]);

  // 작성 데모 단계 정의
  const demoSteps = [
    { id: 'select', label: '템플릿 선택' },
    { id: 'writing', label: '작성' },
    { id: 'preview', label: '미리보기' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 통합 데모 헤더 */}
      <DemoHeader
        demoType="writing"
        currentStep="select"
        steps={demoSteps}
        theme="dark"
        subtitle="사업계획서 작성"
      />

      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-5">
            {/* Demo Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">무료 작성 체험</span>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              사업계획서 작성 데모
            </h1>
            <p className="text-base text-white/60">
              AI가 도와주는 전문가급 사업계획서 작성 과정을 체험해보세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Selection */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5">
              <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                지원사업 템플릿 선택
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => {
                  const isDisabled = template.id === 'bank-loan';
                  const theme = TEMPLATE_THEMES[template.id];
                  const isSelected = selectedTemplate === template.id;
                  
                  // 선택된 템플릿의 테마 색상 적용
                  const selectedStyles = template.id === 'pre-startup'
                    ? 'ring-2 ring-emerald-500 bg-emerald-500/10 border border-emerald-500/30'
                    : template.id === 'early-startup'
                      ? 'ring-2 ring-blue-500 bg-blue-500/10 border border-blue-500/30'
                      : 'ring-2 ring-amber-500 bg-amber-500/10 border border-amber-500/30';
                  
                  return (
                    <div
                      key={template.id}
                      className={`rounded-xl p-4 transition-all ${
                        isDisabled
                          ? 'opacity-50 cursor-not-allowed bg-white/5 border border-white/10'
                          : isSelected
                            ? `cursor-pointer ${selectedStyles}`
                            : 'cursor-pointer bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10'
                      }`}
                      onClick={() => {
                        if (!isDisabled) {
                          handleTemplateSelect(template.id);
                        }
                      }}
                    >
                      <div className="relative">
                        {isDisabled && (
                          <div className="absolute top-0 right-0 px-2 py-0.5 bg-gray-500 text-white text-xs font-medium rounded-full">
                            오픈예정
                          </div>
                        )}
                        {/* 템플릿 뱃지 */}
                        {!isDisabled && theme && (
                          <div className={`absolute top-0 right-0 px-2 py-0.5 text-xs font-medium rounded-full ${
                            template.id === 'pre-startup' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {theme.badge}
                          </div>
                        )}
                        <div className="text-3xl mb-2">{template.icon}</div>
                        <h3 className={`text-base font-semibold mb-1 ${isDisabled ? 'text-white/50' : 'text-white'}`}>
                          {template.name}
                        </h3>
                        <p className={`text-xs mb-2 ${isDisabled ? 'text-white/30' : 'text-white/60'}`}>
                          {template.description}
                        </p>
                        {/* 핵심 목표 표시 */}
                        {!isDisabled && theme && (
                          <p className={`text-xs mb-4 ${
                            template.id === 'pre-startup' 
                              ? 'text-emerald-400/80' 
                              : 'text-blue-400/80'
                          }`}>
                            📌 {theme.goal}
                          </p>
                        )}
                      </div>
                      <ul className="space-y-1.5">
                        {template.features.map((feature, index) => (
                          <li key={index} className={`flex items-start gap-2 text-xs ${isDisabled ? 'text-white/30' : 'text-white/70'}`}>
                            <span className={`mt-0.5 ${
                              isDisabled 
                                ? 'text-white/30' 
                                : template.id === 'pre-startup'
                                  ? 'text-emerald-400'
                                  : template.id === 'early-startup'
                                    ? 'text-blue-400'
                                    : 'text-amber-400'
                            }`}>✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {/* 포커스 영역 표시 */}
                      {!isDisabled && theme && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <p className="text-xs text-white/40 mb-2">핵심 평가 영역</p>
                          <div className="flex flex-wrap gap-1">
                            {theme.focusAreas.map((area, i) => (
                              <span 
                                key={i} 
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  template.id === 'pre-startup'
                                    ? 'bg-emerald-500/10 text-emerald-300'
                                    : 'bg-blue-500/10 text-blue-300'
                                }`}
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Demo 범위 안내 */}
            <div className="max-w-xl mx-auto p-4 rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-emerald-500/20 text-center">
              <div className="text-base font-semibold text-white mb-2">🎁 무료 데모 체험 범위</div>
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-emerald-400 font-medium text-sm">✓ 핵심 질문 리스트</span>
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-emerald-400 font-medium text-sm">✓ AI 자동 생성</span>
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-emerald-400 font-medium text-sm">✓ 재무 시뮬레이션</span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs text-white/40 mb-1.5">🔒 유료 요금제 추가 기능</div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/40 text-xs">HWP/PDF 다운로드</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/40 text-xs">공공기관 양식 적용</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/40 text-xs">AI기반 재작성 루프</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/40 text-xs">전문 컨설턴트 피드백</span>
                </div>
              </div>
              <p className="text-white/30 text-xs mt-1 pt-2">
                * HWP/PDF 다운로드는 2026년 정부지원사업 양식 통합공고 후 제공됩니다
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button 
                type="submit" 
                size="lg" 
                className="px-8 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 shadow-lg shadow-emerald-500/25"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                사업계획서 작성 데모 체험
              </Button>
            </div>
          </form>

          {/* Features */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">🤖</span>
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">AI 자동 작성</h3>
              <p className="text-xs text-white/60">
                AI가 전문적인 사업계획서를 생성
              </p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold text-purple-400">PSST</span>
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">PSST 프레임워크</h3>
              <p className="text-xs text-white/60">
                체계적인 사업계획서 구조
              </p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">재무 시뮬레이션</h3>
              <p className="text-xs text-white/60">
                손익분기점과 수익성 확인
              </p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">PMF 진단</h3>
              <p className="text-xs text-white/60">
                제품-시장 적합성 진단
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

