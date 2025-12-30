/**
 * 파일명: ForgotPasswordPage.tsx
 * 
 * 파일 용도:
 * 비밀번호 재설정 요청 페이지 컴포넌트
 * - 이메일 입력으로 비밀번호 재설정 링크 요청
 * - 요청 성공 메시지 표시
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { authApi } from '../services/authApi';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'form' | 'loading' | 'success'>('form');

  const validateEmail = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setStatus('loading');
    try {
      await authApi.requestPasswordReset(email);
      setStatus('success');
    } catch (error: any) {
      setStatus('form');
      setErrors({
        submit: error.response?.data?.error?.message || '요청 처리 중 오류가 발생했습니다.',
      });
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">이메일 발송 완료</h1>
          <p className="text-gray-600 mb-2">
            <strong>{email}</strong>로 비밀번호 재설정 링크를 발송했습니다.
          </p>
          <p className="text-gray-600 mb-6 text-sm">
            이메일을 확인하고 링크를 클릭하여 비밀번호를 재설정해주세요.
            <br />
            (링크는 1시간 동안 유효합니다)
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/login')} className="w-full">
              로그인 페이지로 돌아가기
            </Button>
            <button
              onClick={() => {
                setStatus('form');
                setEmail('');
              }}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              다른 이메일로 재시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Mail className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">비밀번호 찾기</h1>
          <p className="text-gray-600">가입하신 이메일 주소를 입력해주세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일 주소
            </label>
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              placeholder="example@email.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={status === 'loading'}>
            {status === 'loading' ? '발송 중...' : '재설정 링크 발송'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800">
            <ArrowLeft className="w-4 h-4 mr-1" />
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

