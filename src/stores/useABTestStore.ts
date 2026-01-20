import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ABAssignment,
  AnalyticsEventRequest,
  AnalyticsEventType,
  ConversionRequest,
  ExperimentPage,
} from '../types/abTest';
import { abTestApi } from '../services/abTestApi';
import {
  getOrCreateVisitorId,
  getSessionId,
  getAttribution,
  getDeviceInfo,
} from '../utils/abTestVisitor';
import { trackABTestExposure, trackABTestConversion } from '../utils/analytics';
import { logFetchExperiments, logApiResponse, logProcessingExperiment } from '../utils/abTestDebugLogger';

interface ABTestState {
  visitorId: string | null;
  sessionId: string | null;
  experiments: Record<string, ABAssignment>;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  exposedExperiments: Set<string>;
}

interface ABTestActions {
  initialize: () => void;
  fetchExperiments: (page: ExperimentPage) => Promise<void>;
  getVariant: (experimentName: string) => ABAssignment | null;
  trackExposure: (experimentName: string, context?: Record<string, string>) => Promise<void>;
  trackConversion: (
    experimentName: string,
    conversionType: string,
    conversionValue?: string
  ) => Promise<void>;
  trackEvent: (
    eventType: AnalyticsEventType,
    experimentName: string,
    eventName?: string,
    properties?: Record<string, unknown>
  ) => Promise<void>;
  reset: () => void;
}

type ABTestStore = ABTestState & ABTestActions;

const initialState: ABTestState = {
  visitorId: null,
  sessionId: null,
  experiments: {},
  isLoading: false,
  isInitialized: false,
  error: null,
  exposedExperiments: new Set<string>(),
};

export const useABTestStore = create<ABTestStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      initialize: () => {
        const visitorId = getOrCreateVisitorId();
        const sessionId = getSessionId();
        set({ visitorId, sessionId, isInitialized: true });
      },

      fetchExperiments: async (page: ExperimentPage) => {
        const state = get();
        if (!state.visitorId) {
          state.initialize();
        }

        const visitorId = get().visitorId;
        if (!visitorId) return;

        set({ isLoading: true, error: null });

        try {
          logFetchExperiments('useABTestStore.ts:83', page, visitorId, 'A');
          const response = await abTestApi.getActiveExperiments(page, visitorId);

          logApiResponse('useABTestStore.ts:86', response, 'A');

          if (response.success && response.data) {
            const newExperiments: Record<string, ABAssignment> = {};

            for (const exp of response.data.experiments) {
              logProcessingExperiment('useABTestStore.ts:92', exp, 'A');
              newExperiments[exp.experimentName] = {
                experimentId: exp.experimentId,
                experimentName: exp.experimentName,
                variantId: exp.variantId,
                variantName: exp.variantName,
                config: exp.variantConfig || exp.content,
              };
            }

            set((prev) => ({
              experiments: { ...prev.experiments, ...newExperiments },
              isLoading: false,
            }));
          } else {
            set({ isLoading: false, error: response.error?.message || 'Failed to fetch experiments' });
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          set({ isLoading: false, error: message });
        }
      },

      getVariant: (experimentName: string) => {
        const { experiments } = get();
        return experiments[experimentName] || null;
      },

      trackExposure: async (experimentName: string, context?: Record<string, string>) => {
        const state = get();
        const assignment = state.experiments[experimentName];

        if (!assignment || !state.visitorId) return;

        if (state.exposedExperiments.has(experimentName)) return;

        set((prev) => ({
          exposedExperiments: new Set(prev.exposedExperiments).add(experimentName),
        }));

        const attribution = getAttribution();
        const device = getDeviceInfo();

        const request: AnalyticsEventRequest = {
          eventType: 'exposure',
          eventName: 'experiment_exposure',
          experimentId: assignment.experimentId,
          experimentName: assignment.experimentName,
          variantId: assignment.variantId,
          variantName: assignment.variantName,
          visitorId: state.visitorId,
          sessionId: state.sessionId || undefined,
          context: context
            ? {
                pageLocation: context.pageLocation,
                pageSection: context.pageSection,
              }
            : undefined,
          attribution,
          device,
        };

        try {
          await abTestApi.sendAnalyticsEvent(request);
          trackABTestExposure(
            assignment.experimentName,
            assignment.variantName,
            assignment.experimentId,
            assignment.variantId
          );
        } catch (err) {
          console.error('Failed to track exposure:', err);
        }
      },

      trackConversion: async (
        experimentName: string,
        conversionType: string,
        conversionValue?: string
      ) => {
        const state = get();
        const assignment = state.experiments[experimentName];

        if (!assignment || !state.visitorId) return;

        const request: ConversionRequest = {
          experimentId: assignment.experimentId,
          variantId: assignment.variantId,
          visitorId: state.visitorId,
          conversionType,
          conversionValue,
        };

        try {
          await abTestApi.recordConversion(request);
          trackABTestConversion(
            assignment.experimentName,
            assignment.variantName,
            conversionType,
            conversionValue,
            assignment.experimentId,
            assignment.variantId
          );
        } catch (err) {
          console.error('Failed to track conversion:', err);
        }
      },

      trackEvent: async (
        eventType: AnalyticsEventType,
        experimentName: string,
        eventName?: string,
        properties?: Record<string, unknown>
      ) => {
        const state = get();
        const assignment = state.experiments[experimentName];

        if (!assignment || !state.visitorId) return;

        const attribution = getAttribution();
        const device = getDeviceInfo();

        const request: AnalyticsEventRequest = {
          eventType,
          eventName,
          experimentId: assignment.experimentId,
          experimentName: assignment.experimentName,
          variantId: assignment.variantId,
          variantName: assignment.variantName,
          visitorId: state.visitorId,
          sessionId: state.sessionId || undefined,
          attribution,
          device,
          properties,
        };

        try {
          await abTestApi.sendAnalyticsEvent(request);
        } catch (err) {
          console.error('Failed to track event:', err);
        }
      },

      reset: () => {
        set({
          ...initialState,
          visitorId: get().visitorId,
          sessionId: get().sessionId,
        });
      },
    }),
    {
      name: 'ab-test-storage',
      partialize: (state) => ({
        visitorId: state.visitorId,
        experiments: state.experiments,
      }),
    }
  )
);
