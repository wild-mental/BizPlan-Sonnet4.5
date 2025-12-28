/**
 * 파일명: ErrorBoundary.tsx
 * 
 * 파일 용도:
 * React 에러 바운더리 컴포넌트
 * - 컴포넌트 트리에서 발생한 JavaScript 에러를 캐치
 * - 사용자 친화적인 에러 UI 표시
 * - 에러 로깅 및 리포팅 지원
 * 
 * 사용 예시:
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <App />
 * </ErrorBoundary>
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  /** 자식 컴포넌트 */
  children: ReactNode;
  /** 커스텀 에러 UI (선택사항) */
  fallback?: ReactNode;
  /** 에러 발생 시 콜백 */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  /** 에러 발생 여부 */
  hasError: boolean;
  /** 발생한 에러 객체 */
  error?: Error;
}

/**
 * ErrorBoundary 컴포넌트
 * 
 * 역할:
 * - 하위 컴포넌트 트리에서 발생한 에러를 캐치
 * - 에러 발생 시 폴백 UI 표시
 * - 에러 정보를 콜백으로 전달 (Sentry 등 리포팅 서비스 연동 가능)
 * 
 * @class ErrorBoundary
 * @extends {Component<Props, State>}
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  /**
   * 에러 발생 시 상태 업데이트
   * 
   * @param {Error} error - 발생한 에러 객체
   * @returns {State} 새로운 상태
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * 에러 정보 로깅 및 리포팅
   * 
   * @param {Error} error - 발생한 에러 객체
   * @param {ErrorInfo} errorInfo - 에러 정보 (컴포넌트 스택 등)
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 콘솔에 에러 로깅
    console.error('Error caught by boundary:', error, errorInfo);

    // 콜백으로 에러 전달 (Sentry 등 리포팅 서비스 연동 가능)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * 에러 상태 리셋
   * 페이지를 새로고침하여 컴포넌트를 완전히 재마운트하여 Hooks 호출 순서 문제를 방지
   */
  handleReset = () => {
    // 페이지를 새로고침하여 모든 컴포넌트를 완전히 재마운트
    // 이렇게 하면 Hooks 호출 순서 문제를 방지할 수 있습니다
    window.location.reload();
  };

  /**
   * 홈으로 이동
   */
  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 폴백 UI가 있으면 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card rounded-2xl p-8 border border-red-500/20 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">문제가 발생했습니다</h1>
            <p className="text-white/60 mb-6">
              예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 홈으로 돌아가주세요.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-500/10 rounded-lg border border-red-500/20 text-left">
                <p className="text-xs font-mono text-red-400 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                다시 시도
              </Button>
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="border-white/20 hover:bg-white/10"
              >
                <Home className="w-4 h-4 mr-2" />
                홈으로
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

