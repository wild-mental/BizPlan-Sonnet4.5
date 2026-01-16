import { ulid } from 'ulid';

const VISITOR_ID_KEY = 'ab_visitor_id';
const SESSION_ID_KEY = 'ab_session_id';

export const getOrCreateVisitorId = (): string => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = ulid();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
};

export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = ulid();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
};

export const clearVisitorId = (): void => {
  localStorage.removeItem(VISITOR_ID_KEY);
};

export const clearSessionId = (): void => {
  sessionStorage.removeItem(SESSION_ID_KEY);
};

export const getAttribution = (): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  referer?: string;
} => {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmContent: params.get('utm_content') || undefined,
    referer: document.referrer || undefined,
  };
};

export const getDeviceInfo = (): { userAgent: string } => ({
  userAgent: navigator.userAgent,
});
