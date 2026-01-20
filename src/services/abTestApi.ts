import apiClient, { ApiResponse } from './apiClient';
import {
  ActiveExperimentsResponse,
  AnalyticsEventRequest,
  ConversionRequest,
  ExperimentPage,
} from '../types/abTest';

export const abTestApi = {
  getActiveExperiments: async (
    page: ExperimentPage,
    visitorId: string
  ): Promise<ApiResponse<ActiveExperimentsResponse>> => {
    const response = await apiClient.get<ApiResponse<ActiveExperimentsResponse>>(
      '/api/v1/ab-tests/active',
      {
        params: {
          page,
          visitor_id: visitorId,
        },
      }
    );
    return response.data;
  },

  recordConversion: async (request: ConversionRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(
      '/api/v1/ab-tests/conversions',
      request
    );
    return response.data;
  },

  sendAnalyticsEvent: async (request: AnalyticsEventRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(
      '/api/v1/ab-tests/events',
      request
    );
    return response.data;
  },
};

export default abTestApi;
