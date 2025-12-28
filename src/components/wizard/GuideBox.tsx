/**
 * 파일명: GuideBox.tsx
 * 
 * 파일 용도:
 * 사업계획서 작성 시 항목별 가이드를 표시하는 컴포넌트
 * - 작성 팁 (Tips)
 * - 예시 문구 (Examples)  
 * - 주의사항 (Warnings)
 * 
 * 사용처:
 * - WizardStep 컴포넌트 내 각 단계 상단
 * - QuestionForm 내 개별 질문 영역
 */

import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Lightbulb, AlertTriangle, FileText } from 'lucide-react';

// 가이드 박스 Props
interface GuideBoxProps {
  /** 가이드 제목 */
  title: string;
  /** 작성 팁 목록 */
  tips: string[];
  /** 예시 문구 목록 (선택) */
  examples?: string[];
  /** 주의사항 목록 (선택) */
  warnings?: string[];
  /** 접을 수 있는지 여부 */
  collapsible?: boolean;
  /** 기본 펼침 상태 */
  defaultExpanded?: boolean;
  /** 테마 색상 (emerald, blue, amber 등) */
  theme?: 'emerald' | 'blue' | 'amber' | 'purple';
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
}

// 테마별 스타일 정의
const themeStyles = {
  emerald: {
    container: 'bg-emerald-950/30 border-emerald-500/30',
    header: 'text-emerald-400',
    icon: 'text-emerald-400',
    tip: 'text-emerald-300',
    example: 'text-emerald-200/80 border-emerald-500/20',
    warning: 'bg-amber-950/30 border-amber-500/30 text-amber-300',
  },
  blue: {
    container: 'bg-blue-950/30 border-blue-500/30',
    header: 'text-blue-400',
    icon: 'text-blue-400',
    tip: 'text-blue-300',
    example: 'text-blue-200/80 border-blue-500/20',
    warning: 'bg-amber-950/30 border-amber-500/30 text-amber-300',
  },
  amber: {
    container: 'bg-amber-950/30 border-amber-500/30',
    header: 'text-amber-400',
    icon: 'text-amber-400',
    tip: 'text-amber-300',
    example: 'text-amber-200/80 border-amber-500/20',
    warning: 'bg-red-950/30 border-red-500/30 text-red-300',
  },
  purple: {
    container: 'bg-purple-950/30 border-purple-500/30',
    header: 'text-purple-400',
    icon: 'text-purple-400',
    tip: 'text-purple-300',
    example: 'text-purple-200/80 border-purple-500/20',
    warning: 'bg-amber-950/30 border-amber-500/30 text-amber-300',
  },
};

// 크기별 스타일 정의
const sizeStyles = {
  sm: {
    container: 'p-3 rounded-lg',
    title: 'text-sm',
    content: 'text-xs',
    icon: 'w-3 h-3',
  },
  md: {
    container: 'p-4 rounded-xl',
    title: 'text-base',
    content: 'text-sm',
    icon: 'w-4 h-4',
  },
  lg: {
    container: 'p-5 rounded-2xl',
    title: 'text-lg',
    content: 'text-base',
    icon: 'w-5 h-5',
  },
};

/**
 * GuideBox - 작성 가이드 박스 컴포넌트
 * 
 * @example
 * <GuideBox
 *   title="예비창업패키지 작성 가이드"
 *   tips={[
 *     '아이디어를 구체적인 개발 계획으로 변환하세요',
 *     '대표자 역량이 핵심 평가 요소입니다',
 *   ]}
 *   examples={['게토레이(범주:음료)와 같이 명칭과 범주를 명확히 정의']}
 *   warnings={['개인정보는 OOO으로 마스킹됩니다']}
 *   theme="emerald"
 *   collapsible
 * />
 */
export const GuideBox: React.FC<GuideBoxProps> = ({
  title,
  tips,
  examples,
  warnings,
  collapsible = false,
  defaultExpanded = true,
  theme = 'emerald',
  size = 'md',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const styles = themeStyles[theme];
  const sizes = sizeStyles[size];

  return (
    <div 
      className={`
        border ${styles.container} ${sizes.container}
        transition-all duration-300
      `}
    >
      {/* 헤더 */}
      <div 
        className={`
          flex items-center justify-between
          ${collapsible ? 'cursor-pointer' : ''}
        `}
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
      >
        <h4 className={`font-semibold ${styles.header} ${sizes.title} flex items-center gap-2`}>
          <Info className={`${sizes.icon} ${styles.icon}`} />
          {title}
        </h4>
        {collapsible && (
          <button 
            className={`${styles.icon} p-1 rounded-lg hover:bg-white/5 transition-colors`}
            aria-label={isExpanded ? '접기' : '펼치기'}
          >
            {isExpanded ? (
              <ChevronUp className={sizes.icon} />
            ) : (
              <ChevronDown className={sizes.icon} />
            )}
          </button>
        )}
      </div>

      {/* 콘텐츠 */}
      {isExpanded && (
        <div className="mt-3 space-y-3">
          {/* 팁 목록 */}
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li 
                key={index}
                className={`flex items-start gap-2 ${styles.tip} ${sizes.content}`}
              >
                <Lightbulb className={`${sizes.icon} mt-0.5 flex-shrink-0`} />
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          {/* 예시 섹션 */}
          {examples && examples.length > 0 && (
            <div className={`mt-3 pt-3 border-t ${styles.example}`}>
              <p className={`${sizes.content} font-medium flex items-center gap-2 mb-2`}>
                <FileText className={sizes.icon} />
                예시
              </p>
              <ul className="space-y-1">
                {examples.map((example, index) => (
                  <li 
                    key={index}
                    className={`${sizes.content} italic pl-6`}
                  >
                    "{example}"
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 주의사항 섹션 */}
          {warnings && warnings.length > 0 && (
            <div className={`mt-3 p-3 rounded-lg border ${styles.warning}`}>
              {warnings.map((warning, index) => (
                <p 
                  key={index}
                  className={`flex items-start gap-2 ${sizes.content}`}
                >
                  <AlertTriangle className={`${sizes.icon} mt-0.5 flex-shrink-0`} />
                  <span>{warning}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// 인라인 가이드 힌트 컴포넌트
// ============================================

interface InlineGuideProps {
  /** 가이드 텍스트 */
  text: string;
  /** 아이콘 표시 여부 */
  showIcon?: boolean;
  /** 테마 색상 */
  theme?: 'emerald' | 'blue' | 'amber' | 'purple' | 'gray';
}

/**
 * InlineGuide - 질문 하단에 표시되는 인라인 가이드
 * 
 * @example
 * <InlineGuide 
 *   text="명칭과 범주를 함께 기재하세요. 예: 게토레이(범주:음료)"
 *   theme="emerald"
 * />
 */
export const InlineGuide: React.FC<InlineGuideProps> = ({
  text,
  showIcon = true,
  theme = 'gray',
}) => {
  const colorStyles = {
    emerald: 'text-emerald-400/70',
    blue: 'text-blue-400/70',
    amber: 'text-amber-400/70',
    purple: 'text-purple-400/70',
    gray: 'text-white/50',
  };

  return (
    <p className={`text-xs ${colorStyles[theme]} mt-1 flex items-start gap-1`}>
      {showIcon && <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />}
      <span>{text}</span>
    </p>
  );
};

// ============================================
// 템플릿 비교 가이드 컴포넌트
// ============================================

interface TemplateComparisonProps {
  /** 선택된 템플릿 타입 */
  selectedTemplate: 'pre-startup' | 'early-startup';
}

/**
 * TemplateComparisonGuide - 템플릿별 핵심 차이점 표시
 */
export const TemplateComparisonGuide: React.FC<TemplateComparisonProps> = ({
  selectedTemplate,
}) => {
  const comparison = {
    'pre-startup': {
      name: '예비창업패키지',
      goal: '아이디어 실현 가능성 증명',
      focus: '대표자 개인 역량',
      budget: '1단계 2천만 + 2단계 4천만',
      strategy: 'MVP/시제품 완성',
      color: 'emerald',
    },
    'early-startup': {
      name: '초기창업패키지',
      goal: '시장성 검증 및 성장',
      focus: '조직적 수행 능력',
      budget: '정부 70% + 현금 10% + 현물 20%',
      strategy: '매출 성장 + 투자 유치',
      color: 'blue',
    },
  };

  const current = comparison[selectedTemplate];
  const colorClass = current.color === 'emerald' 
    ? 'border-emerald-500/30 bg-emerald-950/20' 
    : 'border-blue-500/30 bg-blue-950/20';
  const textClass = current.color === 'emerald' ? 'text-emerald-400' : 'text-blue-400';

  return (
    <div className={`border ${colorClass} rounded-xl p-4`}>
      <h4 className={`font-semibold ${textClass} mb-3`}>
        {current.name} 핵심 평가 기준
      </h4>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-white/50 text-xs">핵심 목표</p>
          <p className="text-white/80">{current.goal}</p>
        </div>
        <div>
          <p className="text-white/50 text-xs">평가 초점</p>
          <p className="text-white/80">{current.focus}</p>
        </div>
        <div>
          <p className="text-white/50 text-xs">자금 구조</p>
          <p className="text-white/80">{current.budget}</p>
        </div>
        <div>
          <p className="text-white/50 text-xs">성장 전략</p>
          <p className="text-white/80">{current.strategy}</p>
        </div>
      </div>
    </div>
  );
};

export default GuideBox;

