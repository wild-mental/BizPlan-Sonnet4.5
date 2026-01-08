/**
 * 파일명: apiLogger.ts
 * 
 * 파일 용도:
 * 프론트엔드 API 요청/응답 로깅 유틸리티
 * - 재사용 가능한 로거 함수 제공
 * - 환경 변수로 온오프 제어
 * - 일관된 로그 포맷 사용
 */

import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * 로깅 설정 인터페이스
 */
interface LoggingConfig {
  enabled: boolean;
  logToConsole: boolean;
  logRequest: boolean;
  logResponse: boolean;
  logError: boolean;
}

/**
 * 로깅 설정 가져오기
 */
const getLoggingConfig = (): LoggingConfig => {
  const enabled = import.meta.env.VITE_API_LOGGING_ENABLED !== 'false';
  const logToConsole = import.meta.env.VITE_API_LOGGING_TO_CONSOLE !== 'false';
  const logRequest = import.meta.env.VITE_API_LOGGING_REQUEST !== 'false';
  const logResponse = import.meta.env.VITE_API_LOGGING_RESPONSE !== 'false';
  const logError = import.meta.env.VITE_API_LOGGING_ERROR !== 'false';

  return {
    enabled,
    logToConsole,
    logRequest,
    logResponse,
    logError,
  };
};

/**
 * 로그 데이터 인터페이스
 */
interface LogData {
  type: 'FRONTEND_REQUEST' | 'FRONTEND_RESPONSE' | 'FRONTEND_ERROR' | 'FRONTEND_MOCK';
  timestamp: string;
  method: string;
  url: string;
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  requestData?: any;
  responseData?: any;
  errorMessage?: string;
  errorData?: any;
  duration?: number;
  requestId?: string;
  isMock?: boolean;
  mockType?: 'MSW' | 'DIRECT' | 'LOCAL_STORE';
}

/**
 * MSW 활성화 여부 확인
 */
const isMSWEnabled = (): boolean => {
  return import.meta.env.VITE_ENABLE_MOCK_API === 'true';
};

/**
 * 프론트엔드 요청 로깅
 * 
 * @param config - Axios 요청 설정
 */
export const logFrontendRequest = (config: InternalAxiosRequestConfig): void => {
  const loggingConfig = getLoggingConfig();
  
  if (!loggingConfig.enabled || !loggingConfig.logRequest || !loggingConfig.logToConsole) {
    return;
  }

  const method = config.method?.toUpperCase() || 'UNKNOWN';
  const url = `${config.baseURL || ''}${config.url || ''}`;
  const timestamp = new Date().toISOString();
  const isMock = isMSWEnabled();
  const requestId =
    (config.headers as Record<string, string> | undefined)?.['X-Request-ID'] ??
    (config.headers as Record<string, string> | undefined)?.['x-request-id'];

  const logData: LogData = {
    type: 'FRONTEND_REQUEST',
    timestamp,
    method,
    url,
    headers: config.headers as Record<string, string>,
    requestData: config.data,
    isMock,
    mockType: isMock ? 'MSW' : undefined,
    requestId,
  };

  // Query params가 있는 경우 추가
  if (config.params) {
    logData.requestData = {
      ...logData.requestData,
      queryParams: config.params,
    };
  }

  // 콘솔에 로깅
  const mockLabel = isMock ? ' [모킹]' : '';
  const requestIdLabel = requestId ? ` [Request-ID: ${requestId}]` : '';
  console.group(`🔵 [API Request${mockLabel}] ${method} ${url}${requestIdLabel}`);
  console.log('Timestamp:', timestamp);
  console.log('Type:', logData.type);
  if (requestId) {
    console.log('Request ID:', requestId);
  }
  if (isMock) {
    console.log('⚠️ 모킹 호출 (MSW)');
  }
  console.log('Method:', method);
  console.log('URL:', url);
  console.log('Headers:', logData.headers);
  if (config.params) {
    console.log('Query Params:', config.params);
  }
  if (config.data) {
    console.log('Request Data:', config.data);
  }
  console.log('Full Log Data:', JSON.stringify(logData, null, 2));
  console.groupEnd();
};

/**
 * 프론트엔드 응답 로깅
 * 
 * @param response - Axios 응답
 * @param startTime - 요청 시작 시간 (optional)
 */
export const logFrontendResponse = (
  response: AxiosResponse,
  startTime?: number
): void => {
  const loggingConfig = getLoggingConfig();
  
  if (!loggingConfig.enabled || !loggingConfig.logResponse || !loggingConfig.logToConsole) {
    return;
  }

  const method = response.config.method?.toUpperCase() || 'UNKNOWN';
  const url = `${response.config.baseURL || ''}${response.config.url || ''}`;
  const status = response.status;
  const timestamp = new Date().toISOString();
  const duration = startTime ? Date.now() - startTime : undefined;
  const isMock = isMSWEnabled();
  const requestIdHeader =
    (response.config.headers as Record<string, string> | undefined)?.['X-Request-ID'] ??
    (response.config.headers as Record<string, string> | undefined)?.['x-request-id'];
  const responseRequestId =
    (response.headers as Record<string, string> | undefined)?.['x-request-id'] ?? requestIdHeader;

  const logData: LogData = {
    type: 'FRONTEND_RESPONSE',
    timestamp,
    method,
    url,
    status,
    statusText: response.statusText,
    headers: response.headers as Record<string, string>,
    responseData: response.data,
    duration,
    isMock,
    mockType: isMock ? 'MSW' : undefined,
    requestId: responseRequestId,
  };

  // 콘솔에 로깅
  const mockLabel = isMock ? ' [모킹]' : '';
  const requestIdLabel = responseRequestId ? ` [Request-ID: ${responseRequestId}]` : '';
  console.group(`🟢 [API Response${mockLabel}] ${method} ${url} - ${status}${requestIdLabel}`);
  console.log('Timestamp:', timestamp);
  console.log('Type:', logData.type);
  if (responseRequestId) {
    console.log('Request ID:', responseRequestId);
  }
  if (isMock) {
    console.log('⚠️ 모킹 응답 (MSW)');
  }
  console.log('Status:', status);
  console.log('Status Text:', response.statusText);
  if (duration !== undefined) {
    console.log('Duration:', `${duration}ms`);
  }
  console.log('Response Data:', response.data);
  if (response.headers) {
    console.log('Response Headers:', response.headers);
  }
  console.log('Full Log Data:', JSON.stringify(logData, null, 2));
  console.groupEnd();
};

/**
 * 프론트엔드 에러 로깅
 * 
 * @param error - Axios 에러
 * @param startTime - 요청 시작 시간 (optional)
 */
export const logFrontendError = (
  error: AxiosError,
  startTime?: number
): void => {
  const loggingConfig = getLoggingConfig();
  
  if (!loggingConfig.enabled || !loggingConfig.logError || !loggingConfig.logToConsole) {
    return;
  }

  const originalRequest = error.config;
  const method = originalRequest?.method?.toUpperCase() || 'UNKNOWN';
  const url = originalRequest 
    ? `${originalRequest.baseURL || ''}${originalRequest.url || ''}`
    : 'UNKNOWN';
  const status = error.response?.status || 'NO_RESPONSE';
  const timestamp = new Date().toISOString();
  const duration = startTime ? Date.now() - startTime : undefined;
  const requestIdHeader =
    (originalRequest?.headers as Record<string, string> | undefined)?.['X-Request-ID'] ??
    (originalRequest?.headers as Record<string, string> | undefined)?.['x-request-id'];
  const responseRequestId =
    (error.response?.headers as Record<string, string> | undefined)?.['x-request-id'] ??
    requestIdHeader;

  const logData: LogData = {
    type: 'FRONTEND_ERROR',
    timestamp,
    method,
    url,
    status: typeof status === 'number' ? status : undefined,
    errorMessage: error.message,
    errorData: error.response?.data,
    duration,
    requestId: responseRequestId,
  };

  // 콘솔에 로깅
  const requestIdLabel = responseRequestId ? ` [Request-ID: ${responseRequestId}]` : '';
  console.group(`🔴 [API Error] ${method} ${url} - ${status}${requestIdLabel}`);
  console.log('Timestamp:', timestamp);
  console.log('Type:', logData.type);
  if (responseRequestId) {
    console.log('Request ID:', responseRequestId);
  }
  console.log('Status:', status);
  console.log('Error Message:', error.message);
  if (error.response) {
    console.log('Response Data:', error.response.data);
    console.log('Response Headers:', error.response.headers);
  } else if (error.request) {
    console.log('Request made but no response received:', error.request);
  }
  if (duration !== undefined) {
    console.log('Duration:', `${duration}ms`);
  }
  console.log('Full Error:', error);
  console.log('Full Log Data:', JSON.stringify(logData, null, 2));
  console.groupEnd();
};

/**
 * 직접 모킹된 API 호출 로깅
 * (MSW를 사용하지 않고 직접 모킹된 경우)
 * 
 * @param method - HTTP 메서드
 * @param url - API URL
 * @param requestData - 요청 데이터
 * @param responseData - 응답 데이터 (optional)
 * @param mockType - 모킹 타입 ('DIRECT' | 'LOCAL_STORE')
 */
export const logMockedCall = (
  method: string,
  url: string,
  requestData?: any,
  responseData?: any,
  mockType: 'DIRECT' | 'LOCAL_STORE' = 'DIRECT'
): void => {
  const loggingConfig = getLoggingConfig();
  
  if (!loggingConfig.enabled || !loggingConfig.logRequest || !loggingConfig.logToConsole) {
    return;
  }

  const timestamp = new Date().toISOString();

  const logData: LogData = {
    type: 'FRONTEND_MOCK',
    timestamp,
    method: method.toUpperCase(),
    url,
    requestData,
    responseData,
    isMock: true,
    mockType,
  };

  // 콘솔에 로깅
  const mockTypeLabel = mockType === 'LOCAL_STORE' ? '로컬 스토어' : '직접 모킹';
  console.group(`🟡 [모킹 호출: ${mockTypeLabel}] ${method.toUpperCase()} ${url}`);
  console.log('Timestamp:', timestamp);
  console.log('Type:', logData.type);
  console.log('⚠️ 모킹 호출:', mockTypeLabel);
  console.log('Method:', method.toUpperCase());
  console.log('URL:', url);
  if (requestData) {
    console.log('Request Data:', requestData);
  }
  if (responseData) {
    console.log('Response Data:', responseData);
  }
  console.log('Full Log Data:', JSON.stringify(logData, null, 2));
  console.groupEnd();
};
