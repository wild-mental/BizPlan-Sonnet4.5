/**
 * 파일명: utils.ts
 * 
 * 파일 용도:
 * 애플리케이션 전역에서 사용하는 유틸리티 함수 모음
 * - 클래스명 병합 (Tailwind CSS)
 * - Debounce 함수
 * - 통화/숫자 포맷팅
 * 
 * 함수 목록:
 * 1. cn() - Tailwind CSS 클래스명 조건부 병합
 * 2. debounce() - 함수 호출 지연 (연속 호출 방지)
 * 3. formatCurrency() - 한국 원화 형식으로 포맷
 * 4. formatNumber() - 한국 숫자 형식으로 포맷 (천 단위 구분)
 * 
 * 사용하는 라이브러리:
 * - clsx: 클래스명 조건부 처리
 * - tailwind-merge: Tailwind CSS 클래스 충돌 해결
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 클래스명 병합 함수
 * - clsx로 조건부 클래스명 처리
 * - tailwind-merge로 충돌하는 Tailwind 클래스 병합
 * 
 * 사용 예시:
 * cn('px-4 py-2', isActive && 'bg-blue-500', className)
 * cn('p-4', 'p-6') // → 'p-6' (충돌 해결)
 * 
 * @param {...ClassValue[]} inputs - 클래스명들
 * @returns {string} 병합된 클래스명 문자열
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Debounce 함수
 * - 연속적인 함수 호출을 지연시켜 마지막 호출만 실행
 * - 검색 입력, 자동 저장 등에 사용
 * 
 * 사용 예시:
 * const debouncedSearch = debounce(searchAPI, 500);
 * debouncedSearch('query'); // 500ms 후 실행 (연속 호출 시 타이머 리셋)
 * 
 * @param {Function} func - 실행할 함수
 * @param {number} wait - 지연 시간 (밀리초)
 * @returns {Function} Debounce가 적용된 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 통화 포맷팅 함수 (한국 원화)
 * 
 * 사용 예시:
 * formatCurrency(1000000) // → '₩1,000,000'
 * 
 * @param {number} value - 숫자 값
 * @returns {string} 포맷된 통화 문자열
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(value);
}

/**
 * 숫자 포맷팅 함수 (한국 형식)
 * 
 * 사용 예시:
 * formatNumber(1000000) // → '1,000,000'
 * 
 * @param {number} value - 숫자 값
 * @returns {string} 포맷된 숫자 문자열
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}

