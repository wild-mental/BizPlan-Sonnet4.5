/**
 * 분석 API 클라이언트
 * 
 * 공개 분석 API를 호출하는 클라이언트입니다.
 * 인증이 필요하지 않은 별도의 axios 인스턴스를 사용합니다.
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';

// ============================================================
// 타입 정의
// ============================================================

/** 시간대별 데이터 */
export interface HourlyData {
  hour: number;
  hourLabel: string;
  count: number;
}

/** 시간대별 이용량 응답 */
export interface HourlyUsageResponse {
  date: string;
  category: string;
  totalCount: number;
  uniqueRequests: number;
  peakHour: number;
  hourlyData: HourlyData[];
}

/** 일별 데이터 */
export interface DailyData {
  date: string;
  landingPageViews: number;
  writingDemoUsage: number;
  evaluationDemoUsage: number;
  totalRequests: number;
}

/** 일별 이용량 응답 */
export interface DailyUsageResponse {
  startDate: string;
  endDate: string;
  data: DailyData[];
}

/** 서비스 이용 요약 응답 */
export interface UsageSummaryResponse {
  startDate: string;
  endDate: string;
  totalRequests: number;
  landingPageViews: number;
  writingDemoUsage: number;
  evaluationDemoUsage: number;
  uniqueRequestIds: number;
}

/** API 응답 래퍼 */
interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

// ============================================================
// API 클라이언트 설정
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * 인증 없는 공개 API용 axios 인스턴스
 */
const publicApiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터: data 추출
publicApiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponseWrapper<unknown>>) => {
    return response;
  },
  (error) => {
    console.error('[Analytics API Error]', error);
    return Promise.reject(error);
  }
);

// ============================================================
// API 함수
// ============================================================

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 */
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * 랜딩 페이지 시간대별 접속 추이 조회
 * @param date 조회 날짜 (기본값: 오늘)
 */
export const getLandingHourlyUsage = async (date?: Date): Promise<HourlyUsageResponse> => {
  const params = date ? { date: formatDate(date) } : {};
  const response = await publicApiClient.get<ApiResponseWrapper<HourlyUsageResponse>>(
    '/api/v1/public/analytics/landing/hourly',
    { params }
  );
  return response.data.data;
};

/**
 * 사업계획서 작성 데모 시간대별 이용 추이 조회
 * @param date 조회 날짜 (기본값: 오늘)
 */
export const getWritingDemoHourlyUsage = async (date?: Date): Promise<HourlyUsageResponse> => {
  const params = date ? { date: formatDate(date) } : {};
  const response = await publicApiClient.get<ApiResponseWrapper<HourlyUsageResponse>>(
    '/api/v1/public/analytics/writing-demo/hourly',
    { params }
  );
  return response.data.data;
};

/**
 * AI 평가 데모 시간대별 이용 추이 조회
 * @param date 조회 날짜 (기본값: 오늘)
 */
export const getEvaluationDemoHourlyUsage = async (date?: Date): Promise<HourlyUsageResponse> => {
  const params = date ? { date: formatDate(date) } : {};
  const response = await publicApiClient.get<ApiResponseWrapper<HourlyUsageResponse>>(
    '/api/v1/public/analytics/evaluation-demo/hourly',
    { params }
  );
  return response.data.data;
};

/**
 * 서비스 이용 요약 조회
 * @param startDate 시작 날짜 (기본값: 7일 전)
 * @param endDate 종료 날짜 (기본값: 오늘)
 */
export const getUsageSummary = async (startDate?: Date, endDate?: Date): Promise<UsageSummaryResponse> => {
  const params: Record<string, string> = {};
  if (startDate) params.startDate = formatDate(startDate);
  if (endDate) params.endDate = formatDate(endDate);
  
  const response = await publicApiClient.get<ApiResponseWrapper<UsageSummaryResponse>>(
    '/api/v1/public/analytics/summary',
    { params }
  );
  return response.data.data;
};

/**
 * 일별 이용 추이 조회
 * @param startDate 시작 날짜 (기본값: 7일 전)
 * @param endDate 종료 날짜 (기본값: 오늘)
 */
export const getDailyUsage = async (startDate?: Date, endDate?: Date): Promise<DailyUsageResponse> => {
  const params: Record<string, string> = {};
  if (startDate) params.startDate = formatDate(startDate);
  if (endDate) params.endDate = formatDate(endDate);
  
  const response = await publicApiClient.get<ApiResponseWrapper<DailyUsageResponse>>(
    '/api/v1/public/analytics/daily',
    { params }
  );
  return response.data.data;
};

/**
 * 모든 시간대별 데이터 한번에 조회
 * @param date 조회 날짜
 */
export const getAllHourlyUsage = async (date?: Date): Promise<{
  landing: HourlyUsageResponse;
  writingDemo: HourlyUsageResponse;
  evaluationDemo: HourlyUsageResponse;
}> => {
  const [landing, writingDemo, evaluationDemo] = await Promise.all([
    getLandingHourlyUsage(date),
    getWritingDemoHourlyUsage(date),
    getEvaluationDemoHourlyUsage(date),
  ]);
  
  return { landing, writingDemo, evaluationDemo };
};
