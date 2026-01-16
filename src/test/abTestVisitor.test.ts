import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getOrCreateVisitorId,
  getSessionId,
  clearVisitorId,
  clearSessionId,
  getAttribution,
  getDeviceInfo,
} from '../utils/abTestVisitor';

describe('abTestVisitor utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.stubGlobal('location', { search: '' });
    vi.stubGlobal('document', { referrer: '' });
  });

  describe('getOrCreateVisitorId', () => {
    it('creates a new visitor ID when none exists', () => {
      const visitorId = getOrCreateVisitorId();

      expect(visitorId).toBeDefined();
      expect(typeof visitorId).toBe('string');
      expect(visitorId.length).toBeGreaterThan(0);
    });

    it('returns existing visitor ID on subsequent calls', () => {
      const firstId = getOrCreateVisitorId();
      const secondId = getOrCreateVisitorId();

      expect(firstId).toBe(secondId);
    });

    it('persists visitor ID in localStorage', () => {
      const visitorId = getOrCreateVisitorId();

      expect(localStorage.getItem('ab_visitor_id')).toBe(visitorId);
    });
  });

  describe('getSessionId', () => {
    it('creates a new session ID when none exists', () => {
      const sessionId = getSessionId();

      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
      expect(sessionId.length).toBeGreaterThan(0);
    });

    it('returns existing session ID on subsequent calls', () => {
      const firstId = getSessionId();
      const secondId = getSessionId();

      expect(firstId).toBe(secondId);
    });

    it('persists session ID in sessionStorage', () => {
      const sessionId = getSessionId();

      expect(sessionStorage.getItem('ab_session_id')).toBe(sessionId);
    });
  });

  describe('clearVisitorId', () => {
    it('removes visitor ID from localStorage', () => {
      getOrCreateVisitorId();
      expect(localStorage.getItem('ab_visitor_id')).not.toBeNull();

      clearVisitorId();
      expect(localStorage.getItem('ab_visitor_id')).toBeNull();
    });
  });

  describe('clearSessionId', () => {
    it('removes session ID from sessionStorage', () => {
      getSessionId();
      expect(sessionStorage.getItem('ab_session_id')).not.toBeNull();

      clearSessionId();
      expect(sessionStorage.getItem('ab_session_id')).toBeNull();
    });
  });

  describe('getAttribution', () => {
    it('returns empty values when no UTM parameters', () => {
      vi.stubGlobal('location', { search: '' });
      vi.stubGlobal('document', { referrer: '' });

      const attribution = getAttribution();

      expect(attribution.utmSource).toBeUndefined();
      expect(attribution.utmMedium).toBeUndefined();
      expect(attribution.utmCampaign).toBeUndefined();
      expect(attribution.utmContent).toBeUndefined();
      expect(attribution.referer).toBeUndefined();
    });

    it('extracts UTM parameters from URL', () => {
      vi.stubGlobal('location', {
        search: '?utm_source=google&utm_medium=cpc&utm_campaign=test&utm_content=ad1',
      });
      vi.stubGlobal('document', { referrer: 'https://google.com' });

      const attribution = getAttribution();

      expect(attribution.utmSource).toBe('google');
      expect(attribution.utmMedium).toBe('cpc');
      expect(attribution.utmCampaign).toBe('test');
      expect(attribution.utmContent).toBe('ad1');
      expect(attribution.referer).toBe('https://google.com');
    });
  });

  describe('getDeviceInfo', () => {
    it('returns user agent', () => {
      const deviceInfo = getDeviceInfo();

      expect(deviceInfo.userAgent).toBeDefined();
      expect(typeof deviceInfo.userAgent).toBe('string');
    });
  });
});
