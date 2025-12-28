/**
 * 파일명: dataMasking.ts
 * 
 * 파일 용도:
 * 개인정보 자동 마스킹 유틸리티
 * - 정부지원사업 양식에서 요구하는 개인정보 마스킹 처리
 * - 이름, 학교, 전화번호, 이메일, 주소 등 식별 가능 정보 마스킹
 * - 실시간 미리보기 지원
 * 
 * 사용처:
 * - 사업계획서 미리보기 및 다운로드 시
 * - 질문 폼 입력 시 실시간 마스킹 피드백
 */

// ============================================
// 마스킹 패턴 정의
// ============================================

interface MaskingPattern {
  /** 패턴 이름 */
  name: string;
  /** 정규식 패턴 */
  pattern: RegExp;
  /** 대체 문자열 또는 대체 함수 */
  replace: string | ((match: string, ...groups: string[]) => string);
  /** 설명 */
  description: string;
}

/**
 * 마스킹 패턴 목록
 * 우선순위에 따라 순서대로 적용됨
 */
const MASKING_PATTERNS: MaskingPattern[] = [
  // 1. 한글 이름 (2-4자 + 직함)
  {
    name: 'korean-name-with-title',
    pattern: /([가-힣]{2,4})\s*(대표|사장|CEO|이사|대표이사|공동대표|사업주|창업자)/g,
    replace: 'OOO $2',
    description: '한글 이름 + 직함',
  },
  
  // 2. 한글 이름 (2-4자, 단독)
  {
    name: 'korean-name-standalone',
    pattern: /([가-힣]{2,4})\s*님/g,
    replace: 'OOO님',
    description: '한글 이름 + 님',
  },
  
  // 3. 전화번호
  {
    name: 'phone-number',
    pattern: /\d{2,3}-\d{3,4}-\d{4}/g,
    replace: '010-****-****',
    description: '휴대폰 번호',
  },
  
  // 4. 전화번호 (하이픈 없이)
  {
    name: 'phone-number-no-hyphen',
    pattern: /\b01[0-9]\d{7,8}\b/g,
    replace: '010********',
    description: '휴대폰 번호 (하이픈 없음)',
  },
  
  // 5. 이메일 주소
  {
    name: 'email',
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    replace: '***@***.***',
    description: '이메일 주소',
  },
  
  // 6. 대학교명 (구체적)
  {
    name: 'university-specific',
    pattern: /(서울|연세|고려|성균관|한양|중앙|경희|서강|이화여자|숙명여자|건국|동국|홍익|국민|숭실|세종|단국|인하|아주|경북|부산|전남|전북|충남|충북|강원|제주|카이스트|포항공과|KAIST|POSTECH|울산과학기술|한국과학기술원)대학교?/g,
    replace: 'OO대학교',
    description: '대학교명',
  },
  
  // 7. 대학교명 (일반 패턴)
  {
    name: 'university-general',
    pattern: /([가-힣]+)(대학교|대학원|대)/g,
    replace: 'OO$2',
    description: '대학교/대학원명',
  },
  
  // 8. 고등학교명
  {
    name: 'highschool',
    pattern: /([가-힣]+)(고등학교|고교)/g,
    replace: 'OO$2',
    description: '고등학교명',
  },
  
  // 9. 주소 (시/도 + 구/군/시)
  {
    name: 'address-city',
    pattern: /(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)(특별시|광역시|특별자치시|도|특별자치도)?\s*(시|군|구)?[가-힣]*(구|군|시|동|읍|면|리)[^,\n]*/g,
    replace: 'OO시 OO구',
    description: '상세 주소',
  },
  
  // 10. 사업자등록번호
  {
    name: 'business-registration',
    pattern: /\d{3}-\d{2}-\d{5}/g,
    replace: '***-**-*****',
    description: '사업자등록번호',
  },
  
  // 11. 주민등록번호
  {
    name: 'resident-registration',
    pattern: /\d{6}-[1-4]\d{6}/g,
    replace: '******-*******',
    description: '주민등록번호',
  },
  
  // 12. 계좌번호 (일반 패턴)
  {
    name: 'bank-account',
    pattern: /\d{11,14}/g,
    replace: (match) => '*'.repeat(match.length),
    description: '계좌번호',
  },
];

// ============================================
// 마스킹 함수
// ============================================

/**
 * 텍스트에서 개인정보를 마스킹 처리
 * 
 * @param text - 원본 텍스트
 * @param options - 마스킹 옵션
 * @returns 마스킹된 텍스트
 */
export const maskPersonalInfo = (
  text: string,
  options?: {
    /** 적용할 패턴 이름 목록 (기본: 전체) */
    patterns?: string[];
    /** 제외할 패턴 이름 목록 */
    excludePatterns?: string[];
  }
): string => {
  if (!text) return text;
  
  let masked = text;
  const patternsToApply = options?.patterns 
    ? MASKING_PATTERNS.filter(p => options.patterns!.includes(p.name))
    : MASKING_PATTERNS;
  
  const excludeSet = new Set(options?.excludePatterns || []);
  
  patternsToApply
    .filter(p => !excludeSet.has(p.name))
    .forEach(({ pattern, replace }) => {
      if (typeof replace === 'string') {
        masked = masked.replace(pattern, replace);
      } else {
        masked = masked.replace(pattern, replace);
      }
    });
  
  return masked;
};

/**
 * 마스킹 적용 결과 분석
 * 원본과 마스킹된 텍스트를 비교하여 변경 사항 반환
 * 
 * @param original - 원본 텍스트
 * @returns 마스킹 분석 결과
 */
export interface MaskingAnalysis {
  /** 원본 텍스트 */
  original: string;
  /** 마스킹된 텍스트 */
  masked: string;
  /** 마스킹 적용 여부 */
  hasMasking: boolean;
  /** 적용된 마스킹 목록 */
  appliedMasks: {
    patternName: string;
    description: string;
    count: number;
    examples: string[];
  }[];
}

export const analyzeMasking = (text: string): MaskingAnalysis => {
  const masked = maskPersonalInfo(text);
  const appliedMasks: MaskingAnalysis['appliedMasks'] = [];
  
  MASKING_PATTERNS.forEach(({ name, pattern, description }) => {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      appliedMasks.push({
        patternName: name,
        description,
        count: matches.length,
        examples: matches.slice(0, 3), // 최대 3개 예시
      });
    }
  });
  
  return {
    original: text,
    masked,
    hasMasking: text !== masked,
    appliedMasks,
  };
};

// ============================================
// 특정 패턴만 마스킹
// ============================================

/**
 * 이름만 마스킹
 */
export const maskNames = (text: string): string => {
  return maskPersonalInfo(text, {
    patterns: ['korean-name-with-title', 'korean-name-standalone'],
  });
};

/**
 * 연락처만 마스킹 (전화번호, 이메일)
 */
export const maskContacts = (text: string): string => {
  return maskPersonalInfo(text, {
    patterns: ['phone-number', 'phone-number-no-hyphen', 'email'],
  });
};

/**
 * 교육기관만 마스킹 (대학교, 고등학교)
 */
export const maskEducation = (text: string): string => {
  return maskPersonalInfo(text, {
    patterns: ['university-specific', 'university-general', 'highschool'],
  });
};

/**
 * 주소만 마스킹
 */
export const maskAddresses = (text: string): string => {
  return maskPersonalInfo(text, {
    patterns: ['address-city'],
  });
};

/**
 * 금융정보만 마스킹 (사업자번호, 주민번호, 계좌번호)
 */
export const maskFinancialInfo = (text: string): string => {
  return maskPersonalInfo(text, {
    patterns: ['business-registration', 'resident-registration', 'bank-account'],
  });
};

// ============================================
// React 컴포넌트용 훅
// ============================================

import { useState, useEffect, useMemo } from 'react';

/**
 * 마스킹 미리보기 훅
 * 입력 텍스트가 변경될 때마다 마스킹 결과를 분석
 */
export const useMaskingPreview = (text: string) => {
  const analysis = useMemo(() => analyzeMasking(text), [text]);
  return analysis;
};

// ============================================
// 정부지원사업 특화 마스킹
// ============================================

/**
 * 예비창업패키지 / 초기창업패키지용 전체 마스킹
 * 정부지원사업 양식에서 요구하는 모든 개인정보 마스킹
 */
export const maskForGovernmentProgram = (text: string): string => {
  // 모든 패턴 적용 (계좌번호 패턴은 너무 광범위하므로 제외)
  return maskPersonalInfo(text, {
    excludePatterns: ['bank-account'],
  });
};

/**
 * 팀 구성 섹션 특화 마스킹
 * 이름, 교육기관만 마스킹 (경력 정보는 유지)
 */
export const maskTeamSection = (text: string): string => {
  let masked = maskNames(text);
  masked = maskEducation(masked);
  return masked;
};

/**
 * 연락처 섹션 특화 마스킹
 */
export const maskContactSection = (text: string): string => {
  let masked = maskContacts(text);
  masked = maskAddresses(masked);
  return masked;
};

export default maskPersonalInfo;

