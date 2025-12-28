/**
 * 파일명: ProjectCreate.tsx
 * 
 * 파일 용도:
 * 프로젝트 생성 페이지 - 애플리케이션의 진입점
 * - 사용자로부터 프로젝트명과 템플릿 선택을 받음
 * - 프로젝트 생성 후 마법사 단계로 이동
 * 
 * 호출 구조:
 * ProjectCreate (이 컴포넌트)
 *   ├─> useProjectStore.createProject() - 프로젝트 생성
 *   ├─> useWizardStore.resetWizard() - 마법사 상태 초기화
 *   └─> navigate('/wizard/1') - 첫 번째 마법사 단계로 이동
 * 
 * 데이터 흐름:
 * 1. 사용자 입력 (프로젝트명, 템플릿) → 로컬 state
 * 2. 제출 시 → useProjectStore에 저장
 * 3. 마법사 초기화 → useWizardStore.resetWizard()
 * 4. 페이지 이동 → /wizard/1
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
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';
import { Rocket } from 'lucide-react';

/**
 * ProjectCreate 컴포넌트
 * 
 * 역할:
 * - 신규 프로젝트 생성을 위한 초기 설정 페이지
 * - 프로젝트 이름과 템플릿 선택 UI 제공
 * - 입력 유효성 검증 및 에러 처리
 * 
 * 주요 기능:
 * 1. 프로젝트명 입력 폼
 * 2. 템플릿 선택 (스타트업/소상공인/프리랜서)
 * 3. 입력 유효성 검증
 * 4. 프로젝트 생성 및 마법사로 이동
 * 
 * @returns {JSX.Element} 프로젝트 생성 페이지
 */
export const ProjectCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createProject } = useProjectStore();
  const { resetWizard } = useWizardStore();
  // Local state
  const [projectName, setProjectName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [error, setError] = useState('');

  /**
   * 폼 제출 핸들러
   * 
   * 처리 순서:
   * 1. 프로젝트명 유효성 검증
   * 2. 템플릿 선택 여부 검증
   * 3. useProjectStore.createProject() 호출
   * 4. useWizardStore.resetWizard() 호출
   * 5. /wizard/1 경로로 이동
   * 
   * @param {React.FormEvent} e - 폼 제출 이벤트
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      setError('프로젝트 이름을 입력해주세요.');
      return;
    }

    if (!selectedTemplate) {
      setError('템플릿을 선택해주세요.');
      return;
    }

    // Create new project
    createProject(projectName, selectedTemplate);
    resetWizard();
    
    // Navigate to wizard
    navigate('/wizard/1');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              사업계획서 작성 시작하기
            </h1>
            <p className="text-lg text-gray-600">
              AI가 도와주는 전문가급 사업계획서를 5단계로 완성하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project Name */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                프로젝트 이름
              </h2>
              <Input
                placeholder="예: 우리 회사의 새로운 사업"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  setError('');
                }}
                required
              />
            </div>

            {/* Template Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                템플릿 선택
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => {
                  const isDisabled = template.id === 'bank-loan';
                  return (
                    <Card
                      key={template.id}
                      className={`transition-all ${
                        isDisabled
                          ? 'opacity-60 cursor-not-allowed bg-gray-50'
                          : selectedTemplate === template.id
                            ? 'cursor-pointer ring-2 ring-primary-600 border-primary-600'
                            : 'cursor-pointer hover:border-primary-300'
                      }`}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedTemplate(template.id);
                          setError('');
                        }
                      }}
                    >
                      <CardHeader className="relative">
                        {isDisabled && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 bg-gray-500 text-white text-xs font-medium rounded-full">
                            오픈예정
                          </div>
                        )}
                        <div className="text-4xl mb-2">{template.icon}</div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {template.features.map((feature, index) => (
                            <li key={index} className={`flex items-start gap-2 text-xs ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
                              <span className={`mt-0.5 ${isDisabled ? 'text-gray-400' : 'text-primary-600'}`}>✓</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button type="submit" size="lg" className="px-8">
                사업계획서 작성 시작하기
              </Button>
            </div>
          </form>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">AI 자동 작성</h3>
              <p className="text-sm text-gray-600">
                입력한 내용을 바탕으로 AI가 전문적인 사업계획서를 생성합니다
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">재무 시뮬레이션</h3>
              <p className="text-sm text-gray-600">
                실시간 차트로 손익분기점과 수익성을 한눈에 확인하세요
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">PMF 진단</h3>
              <p className="text-sm text-gray-600">
                제품-시장 적합성을 진단하고 개선 방향을 제시합니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

