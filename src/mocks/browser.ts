/**
 * 파일명: browser.ts
 * 
 * 파일 용도:
 * MSW (Mock Service Worker) 브라우저 설정
 * - 개발 환경에서 Mock API 활성화
 * - handlers를 사용하여 API 요청 모킹
 */

import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

