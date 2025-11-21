/**
 * 파일명: BusinessPlanViewer.tsx
 * 
 * 파일 용도:
 * AI 생성 사업계획서 뷰어 페이지
 * - 마법사 완료 후 사업계획서를 AI로 생성하고 표시
 * - 섹션별 재생성 기능
 * - HWP/PDF 내보내기 기능
 * 
 * 호출 구조:
 * BusinessPlanViewer (이 컴포넌트)
 *   ├─> handleGenerate() - AI 사업계획서 생성 (시뮬레이션)
 *   ├─> handleRegenerate(sectionId) - 특정 섹션 재생성
 *   └─> handleExport(format) - 파일 내보내기 (HWP/PDF)
 * 
 * 데이터 흐름:
 * 1. 초기 상태: 생성 대기 화면
 * 2. 생성 버튼 클릭 → 로딩 (3초 시뮬레이션)
 * 3. 생성 완료 → 섹션별 사업계획서 표시
 * 4. 각 섹션마다 "다시 쓰기" 버튼으로 재생성 가능
 * 5. HWP/PDF 내보내기 가능
 * 
 * Mock Data:
 * - mockBusinessPlan: 사업계획서 섹션 목록
 */

import React, { useState } from 'react';
import { Button, Spinner, Badge } from '../components/ui';
import { mockBusinessPlan } from '../types/mockData';
import ReactMarkdown from 'react-markdown';
import { FileDown, Sparkles, RefreshCw } from 'lucide-react';

/**
 * BusinessPlanViewer 컴포넌트
 * 
 * 역할:
 * - AI가 생성한 사업계획서를 표시하고 관리
 * - 섹션별 내용 재생성 기능
 * - 문서 내보내기 (HWP, PDF)
 * 
 * 주요 기능:
 * 1. AI 사업계획서 생성 (시뮬레이션)
 * 2. 마크다운 형식의 계획서 렌더링
 * 3. 섹션별 AI 재생성
 * 4. HWP/PDF 형식으로 내보내기
 * 
 * 상태:
 * - isGenerating: 생성 중 여부
 * - isGenerated: 생성 완료 여부
 * - sections: 사업계획서 섹션 목록
 * - regeneratingSection: 재생성 중인 섹션 ID
 * 
 * @returns {JSX.Element} 사업계획서 뷰어 페이지
 */
export const BusinessPlanViewer: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [sections, setSections] = useState(mockBusinessPlan);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);

  /**
   * AI 사업계획서 생성 시뮬레이션
   * - 실제로는 API 호출이 필요
   * - 현재는 3초 딜레이 후 완료 처리
   */
  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 3000);
  };

  /**
   * 특정 섹션 재생성
   * 
   * @param {string} sectionId - 재생성할 섹션의 ID
   */
  const handleRegenerate = (sectionId: string) => {
    setRegeneratingSection(sectionId);
    
    // Simulate regeneration
    setTimeout(() => {
      setSections(sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            content: section.content + '\n\n[AI가 새로운 내용을 생성했습니다]',
          };
        }
        return section;
      }));
      setRegeneratingSection(null);
    }, 2000);
  };

  /**
   * 사업계획서 파일 내보내기
   * 
   * @param {('hwp'|'pdf')} format - 내보낼 파일 형식
   */
  const handleExport = (format: 'hwp' | 'pdf') => {
    window.alert(`${format.toUpperCase()} 다운로드 준비 완료!\n\n실제 환경에서는 파일이 다운로드됩니다.`);
  };

  if (!isGenerated) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          {!isGenerating ? (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                AI 사업계획서 생성
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                지금까지 입력하신 내용을 바탕으로 전문가 수준의 사업계획서를 생성합니다.
                생성된 계획서는 수정 가능하며, HWP/PDF 형식으로 다운로드할 수 있습니다.
              </p>
              <Button onClick={handleGenerate} size="lg">
                <Sparkles className="w-5 h-5 mr-2" />
                AI 사업계획서 생성하기
              </Button>
            </>
          ) : (
            <>
              <Spinner size="lg" className="mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                AI가 사업계획서를 작성 중입니다...
              </h2>
              <p className="text-gray-600">
                입력하신 정보를 분석하여 최적의 사업계획서를 작성하고 있습니다.
              </p>
              <div className="mt-8 max-w-md mx-auto">
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-primary-600 rounded-full animate-pulse" style={{ width: '66%' }} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge variant="success" className="mb-2">
              <Sparkles className="w-3 h-3 mr-1" />
              AI 생성 완료
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900">
              사업계획서
            </h1>
            <p className="text-gray-600 mt-2">
              생성일: {new Date().toLocaleDateString('ko-KR')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
            >
              <FileDown className="w-4 h-4 mr-2" />
              PDF 내보내기
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('hwp')}
            >
              <FileDown className="w-4 h-4 mr-2" />
              HWP 내보내기
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {section.title}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRegenerate(section.id)}
                disabled={regeneratingSection === section.id}
                isLoading={regeneratingSection === section.id}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                다시 쓰기
              </Button>
            </div>
            <div className="px-6 py-6">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="mt-8 flex justify-center gap-4 pb-8">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
        >
          돌아가기
        </Button>
        <Button onClick={() => handleExport('pdf')}>
          <FileDown className="w-4 h-4 mr-2" />
          다운로드
        </Button>
      </div>
    </div>
  );
};

