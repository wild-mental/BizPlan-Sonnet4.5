/**
 * 파일명: adminApi.ts
 * 
 * 파일 용도:
 * 어드민 관련 API 서비스
 * - 사용자 목록 조회
 * - 사용자 통계 조회
 */

import apiClient, { ApiResponse } from './apiClient';

// 타입 정의
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  phone?: string;
  businessCategory?: string;
  provider: string;
  emailVerified: boolean;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
  subscription?: SubscriptionInfo;
}

export interface SubscriptionInfo {
  plan: string;
  planKey: string;
  originalPrice: number;
  discountedPrice: number;
  discountRate: number;
  promotionPhase?: string;
  promotionCode?: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface PaginationInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UserListResponse {
  users: UserInfo[];
  pagination: PaginationInfo;
}

export interface OverallStatistics {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  marketingConsentUsers: number;
  paidPlanUsers: number;
  freePlanUsers: number;
}

export interface TimeSeriesData {
  date: string;
  count: number;
}

export interface PlanStatistics {
  plan: string;
  count: number;
  percentage: number;
}

export interface ProviderStatistics {
  provider: string;
  count: number;
  percentage: number;
}

export interface CategoryStatistics {
  category: string;
  count: number;
  percentage: number;
}

export interface UserStatisticsResponse {
  overall: OverallStatistics;
  signupByDate: TimeSeriesData[];
  signupByWeek: TimeSeriesData[];
  signupByMonth: TimeSeriesData[];
  byPlan: PlanStatistics[];
  byProvider: ProviderStatistics[];
  byCategory: CategoryStatistics[];
}

// API 함수
export const adminApi = {
  /**
   * 사용자 목록 조회
   */
  getUserList: (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
    planFilter?: string;
    providerFilter?: string;
    emailVerifiedFilter?: boolean;
    searchKeyword?: string;
  }) =>
    apiClient.get<ApiResponse<UserListResponse>>('/api/v1/admin/users', {
      params,
    }),

  /**
   * 사용자 통계 조회
   */
  getStatistics: () =>
    apiClient.get<ApiResponse<UserStatisticsResponse>>('/api/v1/admin/statistics'),
};
