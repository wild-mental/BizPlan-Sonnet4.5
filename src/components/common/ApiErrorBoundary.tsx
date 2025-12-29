/**
 * 파일명: ApiErrorBoundary.tsx
 * 
 * 파일 용도:
 * API 에러를 처리하는 Error Boundary 컴포넌트
 * - 예상치 못한 에러 발생 시 사용자에게 친절한 안내
 * - 재시도 기능 제공
 */

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ApiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">오류가 발생했습니다</h3>
          <p className="text-white/60 mb-4">{this.state.error?.message}</p>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

