import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock zustand persist middleware to be a pass-through in tests
vi.mock('zustand/middleware', async () => {
  const actual = await vi.importActual<typeof import('zustand/middleware')>('zustand/middleware');
  return {
    ...actual,
    persist: (fn: unknown) => fn, // Make persist a no-op wrapper
  };
});

vi.mock('../services/abTestApi', () => ({
  abTestApi: {
    getActiveExperiments: vi.fn(),
    recordConversion: vi.fn(),
    sendAnalyticsEvent: vi.fn(),
  },
}));

vi.mock('../utils/abTestVisitor', () => ({
  getOrCreateVisitorId: vi.fn(() => 'test-visitor-id'),
  getSessionId: vi.fn(() => 'test-session-id'),
  getAttribution: vi.fn(() => ({})),
  getDeviceInfo: vi.fn(() => ({ userAgent: 'test-agent' })),
}));

import { abTestApi } from '../services/abTestApi';
import { useABTestStore } from '../stores/useABTestStore';

describe('useABTestStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    
    const store = useABTestStore.getState();
    store.reset();
    useABTestStore.setState({
      visitorId: null,
      sessionId: null,
      experiments: {},
      isLoading: false,
      isInitialized: false,
      error: null,
      exposedExperiments: new Set(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialize', () => {
    it('sets visitor and session IDs', () => {
      const { result } = renderHook(() => useABTestStore());

      act(() => {
        result.current.initialize();
      });

      expect(result.current.visitorId).toBe('test-visitor-id');
      expect(result.current.sessionId).toBe('test-session-id');
      expect(result.current.isInitialized).toBe(true);
    });
  });

  describe('fetchExperiments', () => {
    it('fetches and stores experiments', async () => {
      vi.mocked(abTestApi.getActiveExperiments).mockResolvedValue({
        success: true,
        data: {
          experiments: [
            {
              experimentId: 'exp-1',
              experimentName: 'test-experiment',
              variantId: 'var-1',
              variantName: 'control',
              variantConfig: { color: 'blue' },
            },
          ],
          visitorId: 'test-visitor-id',
        },
      });

      const { result } = renderHook(() => useABTestStore());

      act(() => {
        result.current.initialize();
      });

      await act(async () => {
        await result.current.fetchExperiments('landing');
      });

      expect(abTestApi.getActiveExperiments).toHaveBeenCalledWith('landing', 'test-visitor-id');
      expect(result.current.experiments['test-experiment']).toEqual({
        experimentId: 'exp-1',
        experimentName: 'test-experiment',
        variantId: 'var-1',
        variantName: 'control',
        config: { color: 'blue' },
      });
    });

    it('handles API error gracefully', async () => {
      vi.mocked(abTestApi.getActiveExperiments).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useABTestStore());

      act(() => {
        result.current.initialize();
      });

      await act(async () => {
        await result.current.fetchExperiments('landing');
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('getVariant', () => {
    it('returns assignment for existing experiment', () => {
      const { result } = renderHook(() => useABTestStore());

      act(() => {
        useABTestStore.setState({
          experiments: {
            'test-experiment': {
              experimentId: 'exp-1',
              experimentName: 'test-experiment',
              variantId: 'var-1',
              variantName: 'control',
            },
          },
        });
      });

      const variant = result.current.getVariant('test-experiment');

      expect(variant).toEqual({
        experimentId: 'exp-1',
        experimentName: 'test-experiment',
        variantId: 'var-1',
        variantName: 'control',
      });
    });

    it('returns null for non-existent experiment', () => {
      const { result } = renderHook(() => useABTestStore());
      const variant = result.current.getVariant('non-existent');

      expect(variant).toBeNull();
    });
  });

  describe('trackExposure', () => {
    it('sends exposure event only once per experiment', async () => {
      vi.mocked(abTestApi.sendAnalyticsEvent).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useABTestStore());

      act(() => {
        useABTestStore.setState({
          visitorId: 'test-visitor-id',
          sessionId: 'test-session-id',
          experiments: {
            'test-experiment': {
              experimentId: 'exp-1',
              experimentName: 'test-experiment',
              variantId: 'var-1',
              variantName: 'control',
            },
          },
          exposedExperiments: new Set(),
        });
      });

      await act(async () => {
        await result.current.trackExposure('test-experiment');
      });

      expect(abTestApi.sendAnalyticsEvent).toHaveBeenCalledTimes(1);

      await act(async () => {
        await result.current.trackExposure('test-experiment');
      });

      expect(abTestApi.sendAnalyticsEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('trackConversion', () => {
    it('sends conversion event', async () => {
      vi.mocked(abTestApi.recordConversion).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useABTestStore());

      act(() => {
        useABTestStore.setState({
          visitorId: 'test-visitor-id',
          experiments: {
            'test-experiment': {
              experimentId: 'exp-1',
              experimentName: 'test-experiment',
              variantId: 'var-1',
              variantName: 'control',
            },
          },
        });
      });

      await act(async () => {
        await result.current.trackConversion('test-experiment', 'signup', '100');
      });

      expect(abTestApi.recordConversion).toHaveBeenCalledWith({
        experimentId: 'exp-1',
        variantId: 'var-1',
        visitorId: 'test-visitor-id',
        conversionType: 'signup',
        conversionValue: '100',
      });
    });
  });

  describe('reset', () => {
    it('clears experiments but preserves visitor ID', () => {
      const { result } = renderHook(() => useABTestStore());

      act(() => {
        useABTestStore.setState({
          visitorId: 'test-visitor-id',
          sessionId: 'test-session-id',
          experiments: {
            'test-experiment': {
              experimentId: 'exp-1',
              experimentName: 'test-experiment',
              variantId: 'var-1',
              variantName: 'control',
            },
          },
          isInitialized: true,
        });
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.visitorId).toBe('test-visitor-id');
      expect(result.current.experiments).toEqual({});
      expect(result.current.isInitialized).toBe(false);
    });
  });
});
