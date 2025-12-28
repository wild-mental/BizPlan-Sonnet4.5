/**
 * 파일명: MaskingPreview.tsx
 * 
 * 파일 용도:
 * 개인정보 마스킹 미리보기 컴포넌트
 * - 사용자 입력 시 실시간 마스킹 결과 표시
 * - 마스킹 적용 항목 상세 분석
 * - 정부지원사업 양식 제출 전 확인용
 * 
 * 사용처:
 * - 팀 구성 (Team) 단계
 * - 사업계획서 미리보기/다운로드 전
 */

import React, { useState } from 'react';
import { Eye, EyeOff, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useMaskingPreview, MaskingAnalysis } from '../../utils/dataMasking';

// ============================================
// 컴포넌트 Props
// ============================================

interface MaskingPreviewProps {
  /** 마스킹 대상 텍스트 */
  text: string;
  /** 제목 */
  title?: string;
  /** 기본 펼침 상태 */
  defaultExpanded?: boolean;
  /** 테마 색상 */
  theme?: 'emerald' | 'blue' | 'amber' | 'gray';
}

// ============================================
// 메인 컴포넌트
// ============================================

/**
 * MaskingPreview - 개인정보 마스킹 미리보기
 * 
 * @example
 * <MaskingPreview 
 *   text="대표자 김철수 (서울대학교 졸업)" 
 *   title="팀 구성 마스킹 미리보기"
 * />
 */
export const MaskingPreview: React.FC<MaskingPreviewProps> = ({
  text,
  title = '개인정보 마스킹 미리보기',
  defaultExpanded = false,
  theme = 'emerald',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showOriginal, setShowOriginal] = useState(false);
  
  // 마스킹 분석 결과
  const analysis = useMaskingPreview(text);
  
  // 테마 스타일
  const themeStyles = {
    emerald: {
      container: 'border-emerald-500/30 bg-emerald-950/20',
      header: 'text-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-400',
    },
    blue: {
      container: 'border-blue-500/30 bg-blue-950/20',
      header: 'text-blue-400',
      badge: 'bg-blue-500/20 text-blue-400',
    },
    amber: {
      container: 'border-amber-500/30 bg-amber-950/20',
      header: 'text-amber-400',
      badge: 'bg-amber-500/20 text-amber-400',
    },
    gray: {
      container: 'border-gray-500/30 bg-gray-950/20',
      header: 'text-gray-400',
      badge: 'bg-gray-500/20 text-gray-400',
    },
  };
  
  const styles = themeStyles[theme];

  if (!text) {
    return null;
  }

  return (
    <div className={`rounded-xl border ${styles.container} overflow-hidden`}>
      {/* 헤더 */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Shield className={`w-5 h-5 ${styles.header}`} />
          <span className={`font-medium ${styles.header}`}>{title}</span>
          {analysis.hasMasking ? (
            <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-400">
              {analysis.appliedMasks.reduce((sum, m) => sum + m.count, 0)}개 항목 마스킹
            </span>
          ) : (
            <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
              마스킹 대상 없음
            </span>
          )}
        </div>
        <button className="text-white/40 hover:text-white/60">
          {isExpanded ? '접기' : '펼치기'}
        </button>
      </div>

      {/* 콘텐츠 */}
      {isExpanded && (
        <div className="border-t border-white/10 p-4 space-y-4">
          {/* 원본/마스킹 토글 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">미리보기</span>
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white/80 transition-colors"
            >
              {showOriginal ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>마스킹 보기</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>원본 보기</span>
                </>
              )}
            </button>
          </div>

          {/* 텍스트 미리보기 */}
          <div className="bg-white/5 rounded-lg p-4">
            <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono">
              {showOriginal ? analysis.original : analysis.masked}
            </pre>
          </div>

          {/* 마스킹 상세 분석 */}
          {analysis.hasMasking && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white/60 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                마스킹 적용 항목
              </h4>
              <div className="space-y-2">
                {analysis.appliedMasks.map((mask, index) => (
                  <div 
                    key={index}
                    className="bg-white/5 rounded-lg p-3 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white/80">
                          {mask.description}
                        </span>
                        <span className="px-1.5 py-0.5 text-xs rounded bg-white/10 text-white/60">
                          {mask.count}개
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {mask.examples.map((example, i) => (
                          <code 
                            key={i}
                            className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-300 line-through"
                          >
                            {example}
                          </code>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 안내 메시지 */}
          <div className="bg-white/5 rounded-lg p-3 text-xs text-white/50">
            💡 정부지원사업 양식 제출 시 개인정보(이름, 학교, 연락처 등)는 자동으로 "OOO" 형태로 
            마스킹되어 제출됩니다.
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// 인라인 마스킹 표시 컴포넌트
// ============================================

interface InlineMaskingBadgeProps {
  /** 마스킹 적용 여부 */
  hasMasking: boolean;
  /** 마스킹 항목 수 */
  count?: number;
}

/**
 * InlineMaskingBadge - 인라인 마스킹 상태 배지
 */
export const InlineMaskingBadge: React.FC<InlineMaskingBadgeProps> = ({
  hasMasking,
  count = 0,
}) => {
  if (!hasMasking) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
        <CheckCircle2 className="w-3 h-3" />
        <span>개인정보 없음</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs text-amber-400">
      <Shield className="w-3 h-3" />
      <span>{count}개 자동 마스킹</span>
    </span>
  );
};

// ============================================
// 마스킹 미리보기 모달
// ============================================

interface MaskingPreviewModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 마스킹 분석 결과 */
  analysis: MaskingAnalysis;
  /** 확인 핸들러 */
  onConfirm?: () => void;
}

/**
 * MaskingPreviewModal - 마스킹 미리보기 전체 모달
 */
export const MaskingPreviewModal: React.FC<MaskingPreviewModalProps> = ({
  isOpen,
  onClose,
  analysis,
  onConfirm,
}) => {
  const [showOriginal, setShowOriginal] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900 rounded-2xl border border-white/10 shadow-2xl">
        {/* 헤더 */}
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">개인정보 마스킹 확인</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-white/40 hover:text-white/60"
            >
              ✕
            </button>
          </div>
          {analysis.hasMasking && (
            <p className="text-white/60 text-sm mt-2">
              {analysis.appliedMasks.reduce((sum, m) => sum + m.count, 0)}개의 
              개인정보가 감지되어 자동으로 마스킹됩니다.
            </p>
          )}
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 space-y-6">
          {/* 원본/마스킹 토글 */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowOriginal(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                !showOriginal 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
            >
              마스킹 적용 결과
            </button>
            <button
              onClick={() => setShowOriginal(true)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                showOriginal 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
            >
              원본 (마스킹 전)
            </button>
          </div>

          {/* 텍스트 미리보기 */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono leading-relaxed">
              {showOriginal ? analysis.original : analysis.masked}
            </pre>
          </div>

          {/* 마스킹 상세 */}
          {analysis.hasMasking && !showOriginal && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white/60">마스킹 적용 항목</h4>
              <div className="grid grid-cols-2 gap-2">
                {analysis.appliedMasks.map((mask, index) => (
                  <div 
                    key={index}
                    className="bg-white/5 rounded-lg p-3 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white/80">{mask.description}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                        {mask.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-white/10 p-6">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white/80 border border-white/10 hover:border-white/20"
            >
              취소
            </button>
            {onConfirm && (
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400"
              >
                확인 및 계속
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaskingPreview;

