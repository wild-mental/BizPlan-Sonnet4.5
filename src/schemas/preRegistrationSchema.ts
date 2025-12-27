/**
 * 사전 등록 폼 유효성 검사 스키마
 * Pre-registration form validation schema using Zod
 */

import { z } from 'zod';

// 한국 휴대폰 번호 정규식
const koreanPhoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;

// 사업 분야 카테고리
export const businessCategories = [
  'SaaS/소프트웨어',
  'E-Commerce/이커머스',
  'FinTech/금융',
  'HealthTech/헬스케어',
  'EdTech/교육',
  'FoodTech/식품',
  '제조/하드웨어',
  '기타',
] as const;

// 요금제 타입
export const planTypes = ['plus', 'pro', 'premium'] as const;

// 사전 등록 폼 스키마
export const preRegistrationSchema = z.object({
  // 이름: 2-50자 한글/영문
  name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다.')
    .max(50, '이름은 최대 50자까지 입력 가능합니다.')
    .regex(/^[가-힣a-zA-Z\s]+$/, '한글 또는 영문만 입력 가능합니다.'),

  // 이메일
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),

  // 전화번호: 한국 휴대폰 형식
  phone: z
    .string()
    .min(1, '전화번호를 입력해주세요.')
    .regex(koreanPhoneRegex, '올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)'),

  // 선택 요금제
  selectedPlan: z.enum(planTypes, {
    message: '요금제를 선택해주세요.',
  }),

  // 사업 분야 (선택)
  businessCategory: z.enum(businessCategories).optional(),

  // 개인정보 수집 동의 (필수)
  agreeTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: '개인정보 수집 및 이용에 동의해주세요.',
    }),

  // 마케팅 정보 수신 동의 (선택)
  agreeMarketing: z.boolean(),
});

// 타입 추론
export type PreRegistrationFormData = z.infer<typeof preRegistrationSchema>;

// 기본값
export const defaultFormValues: PreRegistrationFormData = {
  name: '',
  email: '',
  phone: '',
  selectedPlan: 'pro',
  businessCategory: undefined,
  agreeTerms: false,
  agreeMarketing: false,
};

// 전화번호 포맷팅 함수
export const formatPhoneNumber = (value: string): string => {
  // 숫자만 추출
  const numbers = value.replace(/[^0-9]/g, '');
  
  // 길이에 따라 포맷팅
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
};

