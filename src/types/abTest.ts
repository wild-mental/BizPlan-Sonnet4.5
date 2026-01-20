export type ABExperimentStatus = 'draft' | 'running' | 'paused' | 'completed';

export interface ABVariant {
  id: string;
  name: string;
  weight: number;
  config?: Record<string, unknown>;
}

export interface ABExperiment {
  id: string;
  name: string;
  description?: string;
  targetPage: string;
  status: ABExperimentStatus;
  variants: ABVariant[];
  startDate?: string;
  endDate?: string;
}

export interface ABAssignment {
  experimentId: string;
  experimentName: string;
  variantId: string;
  variantName: string;
  config?: Record<string, unknown>;
}

export interface AssignedExperiment {
  experimentId: string;
  experimentName: string;
  variantId: string;
  variantName: string;
  variantConfig?: Record<string, unknown>;
  content?: Record<string, unknown>;
}

export interface ActiveExperimentsResponse {
  experiments: AssignedExperiment[];
  visitorId: string;
}

export interface PersonaData {
  jtbd?: string;
  source?: string;
}

export interface ContextData {
  pageLocation?: string;
  pageSection?: string;
  buttonText?: string;
  stepId?: string;
  errorType?: string;
}

export interface ConversionData {
  type?: string;
  value?: string;
}

export interface AttributionData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  referer?: string;
}

export interface DeviceData {
  userAgent?: string;
  ipAddress?: string;
}

export type AnalyticsEventType = 'exposure' | 'conversion' | 'error' | 'step_progress';

export interface AnalyticsEventRequest {
  eventType: AnalyticsEventType;
  eventName?: string;
  experimentId: string;
  experimentName?: string;
  variantId: string;
  variantName?: string;
  visitorId: string;
  userId?: string;
  clientId?: string;
  sessionId?: string;
  persona?: PersonaData;
  context?: ContextData;
  conversion?: ConversionData;
  attribution?: AttributionData;
  device?: DeviceData;
  properties?: Record<string, unknown>;
}

export interface ConversionRequest {
  experimentId: string;
  variantId: string;
  visitorId: string;
  userId?: string;
  conversionType: string;
  conversionValue?: string;
  metadata?: Record<string, unknown>;
}

export type ExperimentPage = '/' | 'signup' | 'evaluation-demo' | 'writing-demo';

export const EXPERIMENT_KEYS = {
  MAKERS_SECTION: 'makers-section-layout',
  HERO_CTA: 'hero-cta-text',
  PRICING: 'pricing-display',
  ONBOARDING: 'onboarding-flow',
} as const;

export type ExperimentKey = (typeof EXPERIMENT_KEYS)[keyof typeof EXPERIMENT_KEYS];

export interface ABTestState {
  visitorId: string | null;
  sessionId: string | null;
  experiments: Map<string, ABAssignment>;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}
