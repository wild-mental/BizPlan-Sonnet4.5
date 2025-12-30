/**
 * 파일명: VerifyEmailPage.tsx
 * 
 * 파일 용도:
 * 이메일 인증 페이지 컴포넌트
 * - URL 파라미터로 받은 토큰으로 이메일 인증 처리
 * - 인증 성공/실패 메시지 표시
 * - 재발송 기능 제공
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { authApi } from '../services/authApi';

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      await authApi.verifyEmail(verificationToken);
      setStatus('success');
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(
        error.response?.data?.error?.message || '이메일 인증에 실패했습니다. 링크가 만료되었거나 유효하지 않습니다.'
      );
    }
  };

  const handleResend = async () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      await authApi.resendVerificationEmail(email);
      alert('인증 이메일이 재발송되었습니다. 이메일을 확인해주세요.');
    } catch (error: any) {
      alert(error.response?.data?.error?.message || '이메일 재발송에 실패했습니다.');
    }
  };

  if (status === 'no-token') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">인증 토큰이 없습니다</h1>
          <p className="text-gray-600 mb-6">
            이메일에서 받은 인증 링크를 클릭하여 접속해주세요.
          </p>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일 주소
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <Button onClick={handleResend} className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              인증 이메일 재발송
            </Button>
            <Link to="/signup" className="block text-sm text-indigo-600 hover:text-indigo-800">
              회원가입으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">이메일 인증 중...</h1>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">이메일 인증 완료!</h1>
          <p className="text-gray-600 mb-6">
            이메일 인증이 완료되었습니다. 이제 BizPlan의 모든 기능을 사용하실 수 있습니다.
          </p>
          <Button onClick={() => navigate('/login')} className="w-full">
            로그인하러 가기
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">인증 실패</h1>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일 주소
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <Button onClick={handleResend} className="w-full">
            <Mail className="w-4 h-4 mr-2" />
            인증 이메일 재발송
          </Button>
          <Link to="/signup" className="block text-sm text-indigo-600 hover:text-indigo-800">
            회원가입으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

