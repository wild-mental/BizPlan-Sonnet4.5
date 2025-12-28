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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../stores/useProjectStore';
import { useWizardStore } from '../stores/useWizardStore';
import { templates } from '../types/mockData';
import { TemplateType } from '../types';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';
import { Rocket, Sparkles, FileText, BarChart3, Check, Info } from 'lucide-react';

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
  const { resetWizard } = useWizardStore();
  // Local state
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [error, setError] = useState('');

  /**
   * 폼 제출 핸들러
   * 
   * 처리 순서:
   * 1. 템플릿 선택 여부 검증
   * 2. useProjectStore.createProject() 호출 (임시 이름으로 생성)
   * 3. useWizardStore.resetWizard() 호출
   * 4. /wizard/1 경로로 이동
   * 
   * @param {React.FormEvent} e - 폼 제출 이벤트
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTemplate) {
      setError('템플릿을 선택해주세요.');
      return;
    }

    // Create new project with template name as temporary project name
    const templateName = templates.find(t => t.id === selectedTemplate)?.name || '새 프로젝트';
    createProject(templateName, selectedTemplate);
    resetWizard();
    
    // Navigate to wizard
    navigate('/wizard/1');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Demo Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">무료 데모 체험</span>
            </div>
            
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl mb-4 shadow-lg shadow-emerald-500/25">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              사업계획서 작성 데모
            </h1>
            <p className="text-lg text-white/60">
              AI가 도와주는 전문가급 사업계획서 작성 과정을 체험해보세요
            </p>
          </div>

          {/* Demo 범위 안내 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
            <div className="flex items-start gap-3 mb-4">
              <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">데모에서 체험할 수 있는 기능</h3>
                <p className="text-white/50 text-sm">기본 요금제의 핵심 기능을 무료로 체험해보세요</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>사업계획서 핵심 질문 리스트</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>AI 기반 사업계획서 자동 생성</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>재무 시뮬레이션 체험</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-white/40 text-xs">
                * HWP/PDF 다운로드는 2026년 정부지원사업 양식 통합공고 후 제공됩니다
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Template Selection */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                지원사업 템플릿 선택
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => {
                  const isDisabled = template.id === 'bank-loan';
                  return (
                    <div
                      key={template.id}
                      className={`rounded-xl p-5 transition-all ${
                        isDisabled
                          ? 'opacity-50 cursor-not-allowed bg-white/5 border border-white/10'
                          : selectedTemplate === template.id
                            ? 'cursor-pointer ring-2 ring-emerald-500 bg-emerald-500/10 border border-emerald-500/30'
                            : 'cursor-pointer bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/10'
                      }`}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedTemplate(template.id);
                          setError('');
                        }
                      }}
                    >
                      <div className="relative">
                        {isDisabled && (
                          <div className="absolute top-0 right-0 px-2 py-0.5 bg-gray-500 text-white text-xs font-medium rounded-full">
                            오픈예정
                          </div>
                        )}
                        <div className="text-4xl mb-3">{template.icon}</div>
                        <h3 className={`text-base font-semibold mb-1 ${isDisabled ? 'text-white/50' : 'text-white'}`}>
                          {template.name}
                        </h3>
                        <p className={`text-xs mb-4 ${isDisabled ? 'text-white/30' : 'text-white/60'}`}>
                          {template.description}
                        </p>
                      </div>
                      <ul className="space-y-1.5">
                        {template.features.map((feature, index) => (
                          <li key={index} className={`flex items-start gap-2 text-xs ${isDisabled ? 'text-white/30' : 'text-white/70'}`}>
                            <span className={`mt-0.5 ${isDisabled ? 'text-white/30' : 'text-emerald-400'}`}>✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
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

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button 
                type="submit" 
                size="lg" 
                className="px-8 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 shadow-lg shadow-emerald-500/25"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                데모 체험 시작하기
              </Button>
            </div>
          </form>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold text-white mb-1">AI 자동 작성</h3>
              <p className="text-sm text-white/60">
                입력한 내용을 바탕으로 AI가 전문적인 사업계획서를 생성합니다
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">재무 시뮬레이션</h3>
              <p className="text-sm text-white/60">
                실시간 차트로 손익분기점과 수익성을 한눈에 확인하세요
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-white mb-1">PMF 진단</h3>
              <p className="text-sm text-white/60">
                제품-시장 적합성을 진단하고 개선 방향을 제시합니다
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <button 
              onClick={() => navigate('/')} 
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              ← 메인 페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

