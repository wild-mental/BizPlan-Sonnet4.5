/**
 * 파일명: BusinessPlanViewer.tsx
 * 
 * 파일 용도:
 * AI 생성 사업계획서 뷰어 페이지
 * - 백엔드 API로 생성된 사업계획서 표시
 * - 섹션별 재생성 기능
 * - HWP/PDF 내보내기 기능
 * 
 * 호출 구조:
 * BusinessPlanViewer (이 컴포넌트)
 *   ├─> useBusinessPlanStore - 생성된 사업계획서 데이터 조회
 *   ├─> handleRegenerate(sectionId) - 특정 섹션 재생성
 *   └─> handleExport(format) - 파일 내보내기 (HWP/PDF)
 * 
 * 데이터 흐름:
 * 1. useBusinessPlanStore에서 생성된 데이터 조회
 * 2. 데이터가 없으면 Wizard로 리다이렉트
 * 3. 생성 완료 → 섹션별 사업계획서 표시
 * 4. 각 섹션마다 "다시 쓰기" 버튼으로 재생성 가능
 * 5. HWP/PDF 내보내기 가능
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from '../components/ui';
import { mockBusinessPlan } from '../types/mockData';
import { useBusinessPlanStore } from '../stores/useBusinessPlanStore';
import { useProjectStore } from '../stores/useProjectStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileDown, Sparkles, RefreshCw, AlertCircle, X, AlertTriangle } from 'lucide-react';

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
  const navigate = useNavigate();
  
  // Store에서 생성된 사업계획서 데이터 가져오기
  const { 
    sections: storeSections, 
    isGenerated, 
    isLoading, 
    error,
    generatedData,
    updateSection,
    clearPlan,
    setError
  } = useBusinessPlanStore();
  
  // 프로젝트 정보 가져오기 (아이템명 표시용)
  const { currentProject } = useProjectStore();
  
  // Store에 데이터가 없으면 mockData 사용 (fallback)
  // 에러가 있어도 예제 문서 표시
  const sections = storeSections.length > 0 ? storeSections : mockBusinessPlan;
  
  // 에러 배너 표시 여부
  const [showErrorBanner, setShowErrorBanner] = useState(true);
  
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  
  // 예제 문서 사용 여부 (에러가 있거나 Store에 데이터가 없을 때)
  const isUsingMockData = error || storeSections.length === 0;

  /**
   * 특정 섹션 재생성
   * TODO: 실제 백엔드 API 연동 필요
   * 
   * @param {string} sectionId - 재생성할 섹션의 ID
   */
  const handleRegenerate = (sectionId: string) => {
    setRegeneratingSection(sectionId);
    
    // TODO: 실제 API 호출로 교체
    // 현재는 시뮬레이션
    setTimeout(() => {
      const currentSection = sections.find(s => s.id === sectionId);
      if (currentSection) {
        updateSection(sectionId, currentSection.content + '\n\n[AI가 새로운 내용을 생성했습니다]');
      }
      setRegeneratingSection(null);
    }, 2000);
  };

  /**
   * 사업계획서 파일 내보내기
   * TODO: 실제 백엔드 API 연동 필요
   * 
   * @param {('hwp'|'pdf')} format - 내보낼 파일 형식
   */
  const handleExport = (format: 'hwp' | 'pdf') => {
    // 실제 다운로드 URL이 있으면 사용
    if (generatedData?.exportOptions?.downloadUrls) {
      const url = generatedData.exportOptions.downloadUrls[format];
      if (url) {
        window.open(url, '_blank');
        return;
      }
    }
    
    window.alert(`${format.toUpperCase()} 다운로드 준비 완료!\n\n실제 환경에서는 파일이 다운로드됩니다.`);
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 text-slate-900 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-200/30 via-blue-200/20 to-indigo-200/30 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-slate-200/30 via-purple-200/20 to-blue-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 border border-purple-300 mb-6 shadow-2xl shadow-purple-200/50">
              <Spinner size="lg" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              AI가 사업계획서를 작성 중입니다...
            </h2>
            <p className="text-slate-600 font-medium text-lg">
              입력하신 정보를 분석하여 최적의 사업계획서를 작성하고 있습니다.
            </p>
            <div className="mt-8 max-w-md mx-auto">
              <div className="bg-slate-200 rounded-full h-3 overflow-hidden border border-purple-200 shadow-inner">
                <div className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50" style={{ width: '66%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 에러가 없고 생성된 데이터도 없으면 안내 화면 표시
  if (!error && !isGenerated && sections.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 text-slate-900 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-200/30 via-blue-200/20 to-indigo-200/30 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-slate-200/30 via-purple-200/20 to-blue-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-8 shadow-2xl shadow-purple-300/40 animate-pulse">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-6">
              사업계획서가 없습니다
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto font-medium">
              아직 생성된 사업계획서가 없습니다. Wizard를 완료하고 AI 사업계획서를 생성해주세요.
            </p>
            <Button 
              onClick={() => navigate('/wizard/1')} 
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-500 hover:via-blue-500 hover:to-purple-500 text-white shadow-2xl shadow-purple-300/30 hover:shadow-purple-300/40 px-8 py-4 text-lg font-semibold transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Wizard 시작하기
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * 에러 배너 닫기 핸들러
   */
  const handleDismissError = () => {
    setShowErrorBanner(false);
  };

  /**
   * 에러 초기화 및 다시 시도
   */
  const handleRetry = () => {
    setError(null);
    navigate('/wizard/6');
  };

  // 생성일시 표시 (API 응답 또는 현재 시간)
  const generatedDateTime = generatedData?.generatedAt 
    ? new Date(generatedData.generatedAt)
    : new Date();
  
  const formattedDate = generatedDateTime.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const formattedTime = generatedDateTime.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 text-slate-900 relative overflow-hidden">
      {/* 고급 배경 효과 - 밝은 톤 그라데이션 오브 */}
      <div className="fixed inset-0 pointer-events-none">
        {/* 메인 그라데이션 오브 */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-purple-200/30 via-blue-200/20 to-indigo-200/30 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-slate-200/30 via-purple-200/20 to-blue-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-purple-100/30 via-transparent to-transparent" />
        
        {/* 그리드 패턴 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* 미묘한 빛 효과 */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-white/50" />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* 에러 배너 - 백엔드 응답 실패 시 표시 */}
        {error && showErrorBanner && (
          <div className="mb-6 bg-white border border-red-200 rounded-xl p-5 relative shadow-lg overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-transparent to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-red-100 to-orange-100 border border-red-200 flex items-center justify-center shadow-md">
                <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-red-600 mb-2">
                  백엔드 API 응답 오류
                </h3>
                <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                  {error}
                </p>
                <p className="mt-3 text-xs text-slate-500 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  아래는 예제 사업계획서입니다. 실제 데이터가 아닙니다.
                </p>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRetry}
                    className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-300 shadow-sm"
                  >
                    다시 시도
                  </Button>
                </div>
              </div>
              <button
                onClick={handleDismissError}
                className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-300 border border-transparent hover:border-slate-200"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* 예제 문서 사용 중 알림 (에러 배너가 닫혔을 때) */}
        {isUsingMockData && !showErrorBanner && (
          <div className="mb-6 bg-white border border-amber-200 rounded-xl px-5 py-4 flex items-center gap-3 shadow-md">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-sm text-slate-700 font-medium flex-1">
              예제 문서를 표시 중입니다. 실제 데이터가 아닙니다.
            </span>
            <button
              onClick={() => setShowErrorBanner(true)}
              className="ml-auto text-sm text-amber-600 underline underline-offset-2 hover:text-amber-700 transition-colors font-medium"
            >
              자세히 보기
            </button>
          </div>
        )}

        {/* Header - 프리미엄 디자인 */}
        <div className="mb-8 bg-white border border-slate-200 rounded-xl px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
          {/* 헤더 배경 그라데이션 효과 */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-transparent to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex-1">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-4 transition-all duration-300 ${
                isUsingMockData 
                  ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200 shadow-md' 
                  : 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200 shadow-md'
              }`}>
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                {isUsingMockData ? '예제 문서' : 'AI 생성 완료'}
              </span>
              <h1 className="text-4xl font-bold text-slate-800 mb-3 leading-tight">
                {currentProject?.name ? `${currentProject.name} 사업계획서` : '사업계획서'}
              </h1>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  <p className="text-sm font-medium">
                    생성일시: {formattedDate} {formattedTime}
                  </p>
                </div>
              </div>
              {generatedData?.metadata && (
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <div className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200">
                    <span className="text-purple-700 font-semibold">{generatedData.metadata.totalSections}</span>
                    <span className="text-slate-500 ml-1">개 섹션</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
                    <span className="text-blue-700 font-semibold">{generatedData.metadata.wordCount.toLocaleString()}</span>
                    <span className="text-slate-500 ml-1">단어</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 ml-6">
              <Button
                variant="outline"
                onClick={() => handleExport('pdf')}
                className="font-semibold text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 shadow-sm"
              >
                <FileDown className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('hwp')}
                className="font-semibold text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 shadow-sm"
              >
                <FileDown className="w-4 h-4 mr-2" />
                HWP
              </Button>
            </div>
          </div>
        </div>

        {/* Content - 고급 섹션 디자인 */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* 섹션 번호 배지 */}
              <div className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
              
              {/* 섹션 헤더 */}
              <div className="px-6 py-5 bg-gradient-to-r from-purple-50 via-transparent to-blue-50 border-b border-slate-200 flex items-center justify-between relative overflow-hidden">
                {/* 헤더 배경 효과 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
                
                <h2 className="text-xl font-bold text-slate-800 ml-14 relative z-10">
                  {section.title}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRegenerate(section.id)}
                  disabled={regeneratingSection === section.id}
                  isLoading={regeneratingSection === section.id}
                  className="text-slate-500 hover:text-purple-600 hover:bg-purple-50 border border-transparent hover:border-purple-200 transition-all duration-300 relative z-10"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  다시 쓰기
                </Button>
              </div>
              
              {/* 본문 콘텐츠 */}
              <div className="px-8 py-8 relative">
                {/* 미묘한 왼쪽 보더 */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="prose prose-lg max-w-none 
                  prose-headings:text-slate-800 prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-6
                  prose-h1:text-3xl prose-h1:border-b prose-h1:border-slate-200 prose-h1:pb-3
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-purple-800
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-purple-700
                  prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-[15px]
                  prose-li:text-slate-600 prose-li:leading-relaxed prose-li:mb-2
                  prose-strong:text-slate-800 prose-strong:font-bold
                  prose-table:w-full prose-table:my-6 prose-table:border-collapse
                  prose-th:bg-gradient-to-r prose-th:from-purple-50 prose-th:to-blue-50 prose-th:text-slate-800 prose-th:font-semibold prose-th:px-4 prose-th:py-3 prose-th:border prose-th:border-slate-200
                  prose-td:text-slate-600 prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-slate-200 prose-td:bg-white
                  prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:border prose-code:border-purple-200 prose-code:font-mono
                  prose-pre:bg-slate-900 prose-pre:text-white/90 prose-pre:border prose-pre:border-slate-200 prose-pre:rounded-lg prose-pre:shadow-lg
                  prose-blockquote:text-slate-600 prose-blockquote:border-l-4 prose-blockquote:border-purple-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-purple-50 prose-blockquote:py-2 prose-blockquote:rounded-r
                  prose-a:text-blue-600 prose-a:font-medium prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-blue-700 hover:prose-a:underline-offset-4 transition-all
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
                  prose-img:rounded-lg prose-img:shadow-lg prose-img:border prose-img:border-slate-200
                  prose-hr:border-slate-200 prose-hr:my-8">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions - 프리미엄 버튼 */}
        <div className="mt-12 flex justify-center gap-4 pb-12">
          <Button
            variant="outline"
            onClick={() => navigate('/wizard/6')}
            className="text-slate-600 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 shadow-sm px-6 py-3 font-semibold"
          >
            수정하기
          </Button>
          <Button 
            onClick={() => handleExport('pdf')}
            className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-500 hover:via-blue-500 hover:to-purple-500 shadow-xl shadow-purple-300/30 hover:shadow-purple-300/40 px-8 py-3 font-semibold text-white transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center">
              <FileDown className="w-4 h-4 mr-2" />
              다운로드
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Button>
        </div>
      </div>
    </div>
  );
};

