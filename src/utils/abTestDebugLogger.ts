/**
 * 파일명: abTestDebugLogger.ts
 * 
 * 파일 용도:
 * AB테스트 디버그 로깅 유틸리티
 * - AB테스트 관련 디버그 로깅을 중앙화
 * - 관심사 분리 (비즈니스 로직과 로깅 로직 분리)
 * - 환경 변수로 온오프 제어 가능
 * - 일관된 로그 포맷 사용
 * - 개발 환경에서만 브라우저 콘솔에 출력
 */

/**
 * 디버그 로깅 설정 인터페이스
 */
interface DebugLoggingConfig {
  enabled: boolean;
  sessionId: string;
  runId: string;
}

/**
 * 디버그 로깅 설정 가져오기
 */
const getDebugLoggingConfig = (): DebugLoggingConfig => {
  return {
    enabled: import.meta.env.VITE_AB_TEST_DEBUG_LOGGING === 'true',
    sessionId: import.meta.env.VITE_AB_TEST_DEBUG_SESSION_ID || 'debug-session',
    runId: import.meta.env.VITE_AB_TEST_DEBUG_RUN_ID || 'run1',
  };
};

/**
 * AB테스트 디버그 로깅
 * 
 * 개발 환경에서만 브라우저 콘솔에 출력합니다.
 * 프로덕션 환경에서는 아무 작업도 수행하지 않습니다.
 * 
 * @param location - 로그 위치 (파일명:라인번호)
 * @param message - 로그 메시지
 * @param data - 로그 데이터
 * @param hypothesisId - 가설 ID (optional)
 */
export const logABTestDebug = (
  location: string,
  message: string,
  data: Record<string, unknown>,
  hypothesisId?: string
): void => {
  const config = getDebugLoggingConfig();
  
  if (!config.enabled) {
    return;
  }

  // 개발 환경에서만 브라우저 콘솔에 출력
  if (import.meta.env.DEV) {
    const timestamp = new Date().toISOString();
    const logData = {
      location,
      message,
      data,
      hypothesisId,
      timestamp,
      sessionId: config.sessionId,
      runId: config.runId,
    };

    console.group(`🔍 [ABTest Debug] ${message}`);
    console.log('📍 Location:', location);
    if (hypothesisId) {
      console.log('🧪 Hypothesis ID:', hypothesisId);
    }
    console.log('📊 Data:', data);
    console.log('🕐 Timestamp:', timestamp);
    console.log('📝 Session ID:', config.sessionId);
    console.log('🔄 Run ID:', config.runId);
    console.log('📄 Full Log:', logData);
    console.groupEnd();
  }
  
  // 프로덕션에서는 아무것도 하지 않음
};

/**
 * AB테스트 디버그 로깅 헬퍼 함수들
 */

/**
 * 실험 할당 확인 로깅
 */
export const logExperimentAssignment = (
  location: string,
  experimentName: string,
  assignment: {
    experimentId?: string;
    experimentName?: string;
    variantName?: string;
    config?: Record<string, unknown>;
  } | null,
  isLoading: boolean,
  hypothesisId?: string
): void => {
  logABTestDebug(
    location,
    'useExperiment assignment check',
    {
      experimentName,
      hasAssignment: !!assignment,
      assignment: assignment
        ? {
            experimentId: assignment.experimentId,
            experimentName: assignment.experimentName,
            variantName: assignment.variantName,
            hasConfig: !!assignment.config,
            config: assignment.config,
          }
        : null,
      isLoading,
    },
    hypothesisId
  );
};

/**
 * 실험 가져오기 호출 로깅
 */
export const logFetchExperiments = (
  location: string,
  page: string,
  visitorId: string,
  hypothesisId?: string
): void => {
  logABTestDebug(
    location,
    'fetchExperiments called',
    { page, visitorId },
    hypothesisId
  );
};

/**
 * API 응답 수신 로깅
 */
export const logApiResponse = (
  location: string,
  response: {
    success: boolean;
    data?: {
      experiments?: Array<{
        experimentName?: string;
        variantConfig?: Record<string, unknown>;
        content?: unknown;
      }>;
    };
  },
  hypothesisId?: string
): void => {
  logABTestDebug(
    location,
    'API response received',
    {
      success: response.success,
      experimentsCount: response.data?.experiments?.length || 0,
      experiments:
        response.data?.experiments?.map((e) => ({
          name: e.experimentName,
          variantConfig: e.variantConfig,
          content: e.content,
          hasVariantConfig: !!e.variantConfig,
          hasContent: !!e.content,
        })) || [],
    },
    hypothesisId
  );
};

/**
 * 실험 처리 로깅
 */
export const logProcessingExperiment = (
  location: string,
  experiment: {
    experimentName?: string;
    variantConfig?: Record<string, unknown>;
    content?: unknown;
  },
  hypothesisId?: string
): void => {
  logABTestDebug(
    location,
    'Processing experiment',
    {
      experimentName: experiment.experimentName,
      variantConfig: experiment.variantConfig,
      content: experiment.content,
      hasVariantConfig: !!experiment.variantConfig,
      hasContent: !!experiment.content,
      expKeys: Object.keys(experiment),
    },
    hypothesisId
  );
};

/**
 * VariantConfig 확인 로깅
 */
export const logVariantConfigCheck = (
  location: string,
  variantConfig: Record<string, unknown> | undefined,
  variant: string | null,
  isLoading: boolean,
  hypothesisId?: string
): void => {
  logABTestDebug(
    location,
    'useMakersSectionTest variantConfig check',
    {
      variantConfig,
      variantConfigType: typeof variantConfig,
      hasVariantConfig: !!variantConfig,
      sectionOrder: variantConfig?.sectionOrder,
      isMakersDetailOpen: variantConfig?.isMakersDetailOpen,
      variant,
      isLoading,
    },
    hypothesisId
  );
};

/**
 * 추출된 값 로깅
 */
export const logExtractedValues = (
  location: string,
  sectionOrder: string | undefined,
  isMakersDetailOpenDefault: boolean | undefined,
  hypothesisId?: string
): void => {
  logABTestDebug(
    location,
    'useMakersSectionTest extracted values',
    {
      sectionOrder,
      isMakersDetailOpenDefault,
      willUseDefault: !sectionOrder,
    },
    hypothesisId
  );
};

/**
 * LandingPage 섹션 순서 메모 로깅
 */
export const logSectionOrderMemo = (
  location: string,
  isLoading: boolean,
  sectionOrder: string | undefined,
  calculatedOrder: string,
  isUsingDefault: boolean,
  hypothesisId?: string
): void => {
  logABTestDebug(
    location,
    isUsingDefault ? 'LandingPage sectionOrder memo - using default' : 'LandingPage sectionOrder memo - using actual data',
    {
      isLoading,
      sectionOrder,
      calculatedOrder,
      isUsingDefault,
    },
    hypothesisId
  );
};

/**
 * LandingPage 섹션 순서 계산 로깅
 */
export const logSectionOrderCalculation = (
  location: string,
  sectionOrder: string,
  testimonialsIndex: number,
  makersIndex: number,
  result: boolean,
  hypothesisId?: string
): void => {
  logABTestDebug(
    location,
    'LandingPage isMakersBeforeTestimonials calculation',
    {
      sectionOrder,
      testimonialsIndex,
      makersIndex,
      result,
    },
    hypothesisId
  );
};

/**
 * 컴포넌트 렌더링 로깅
 */
export const logComponentRender = (
  location: string,
  componentName: string,
  data?: Record<string, unknown>,
  hypothesisId?: string
): void => {
  logABTestDebug(
    location,
    `${componentName} component rendered`,
    {
      ...data,
      timestamp: Date.now(),
    },
    hypothesisId
  );
};

/**
 * 섹션 렌더링 순서 결정 로깅
 */
export const logSectionRenderDecision = (
  location: string,
  isMakersBeforeTestimonials: boolean,
  sectionOrder: string,
  variant: string | null,
  isMakersDetailOpen: boolean,
  hypothesisId?: string
): void => {
  logABTestDebug(
    location,
    'Rendering section order decision',
    {
      isMakersBeforeTestimonials,
      sectionOrder,
      variant,
      isMakersDetailOpen,
      willRenderMakersFirst: isMakersBeforeTestimonials,
    },
    hypothesisId
  );
};

/**
 * Variant 순서 렌더링 로깅
 */
export const logVariantOrderRender = (
  location: string,
  isMakersBeforeTestimonials: boolean,
  sectionOrder: string,
  orderType: 'Makers first' | 'Testimonials first',
  hypothesisId?: string
): void => {
  logABTestDebug(
    location,
    `Rendering ${orderType === 'Makers first' ? 'Variant' : 'Control'} order: ${orderType}`,
    {
      isMakersBeforeTestimonials,
      sectionOrder,
      timestamp: Date.now(),
    },
    hypothesisId
  );
};
