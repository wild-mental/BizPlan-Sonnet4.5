import { useEffect, useCallback } from 'react';
import { useABTestStore } from '../stores/useABTestStore';
import { ExperimentPage, EXPERIMENT_KEYS, ABAssignment } from '../types/abTest';

interface UseABTestOptions {
  page: ExperimentPage;
  autoFetch?: boolean;
  autoTrackExposure?: boolean;
}

interface UseABTestReturn {
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  getVariant: (experimentName: string) => ABAssignment | null;
  trackExposure: (experimentName: string, context?: Record<string, string>) => Promise<void>;
  trackConversion: (
    experimentName: string,
    conversionType: string,
    conversionValue?: string
  ) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useABTest = (options: UseABTestOptions): UseABTestReturn => {
  const {
    isLoading,
    isInitialized,
    error,
    initialize,
    fetchExperiments,
    getVariant,
    trackExposure,
    trackConversion,
  } = useABTestStore();

  const { page, autoFetch = true } = options;

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (isInitialized && autoFetch) {
      fetchExperiments(page);
    }
  }, [isInitialized, autoFetch, page, fetchExperiments]);

  const refetch = useCallback(() => fetchExperiments(page), [page, fetchExperiments]);

  return {
    isLoading,
    isInitialized,
    error,
    getVariant,
    trackExposure,
    trackConversion,
    refetch,
  };
};

interface UseExperimentOptions {
  experimentName: string;
  autoTrackExposure?: boolean;
  context?: Record<string, string>;
}

interface UseExperimentReturn<T extends string = string> {
  variant: T | null;
  variantConfig: Record<string, unknown> | undefined;
  isControl: boolean;
  isLoading: boolean;
  trackConversion: (conversionType: string, conversionValue?: string) => Promise<void>;
}

export const useExperiment = <T extends string = string>(
  options: UseExperimentOptions
): UseExperimentReturn<T> => {
  const { experimentName, autoTrackExposure = true, context } = options;

  const { isLoading, getVariant, trackExposure, trackConversion } = useABTestStore();

  const assignment = getVariant(experimentName);

  useEffect(() => {
    if (assignment && autoTrackExposure) {
      trackExposure(experimentName, context);
    }
  }, [assignment, autoTrackExposure, experimentName, context, trackExposure]);

  const handleConversion = useCallback(
    (conversionType: string, conversionValue?: string) =>
      trackConversion(experimentName, conversionType, conversionValue),
    [experimentName, trackConversion]
  );

  return {
    variant: (assignment?.variantName as T) || null,
    variantConfig: assignment?.config,
    isControl: assignment?.variantName === 'control',
    isLoading,
    trackConversion: handleConversion,
  };
};

export const useMakersSectionTest = () =>
  useExperiment<'control' | 'gallery' | 'carousel'>({
    experimentName: EXPERIMENT_KEYS.MAKERS_SECTION,
    context: { pageSection: 'makers-section' },
  });

export const useHeroCtaTest = () =>
  useExperiment<'control' | 'action' | 'benefit'>({
    experimentName: EXPERIMENT_KEYS.HERO_CTA,
    context: { pageSection: 'hero' },
  });

export const usePricingTest = () =>
  useExperiment<'control' | 'comparison' | 'minimal'>({
    experimentName: EXPERIMENT_KEYS.PRICING,
    context: { pageSection: 'pricing' },
  });

export const useOnboardingTest = () =>
  useExperiment<'control' | 'guided' | 'quick'>({
    experimentName: EXPERIMENT_KEYS.ONBOARDING,
    context: { pageSection: 'onboarding' },
  });

export { EXPERIMENT_KEYS };
