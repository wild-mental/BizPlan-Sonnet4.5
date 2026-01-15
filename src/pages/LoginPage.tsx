/**
 * 파일명: LoginPage.tsx
 * 
 * 파일 용도:
 * 로그인 페이지 컴포넌트
 * - 이메일/비밀번호 로그인
 * - 소셜 로그인 버튼 (Google, Kakao, Naver) - Mocked
 * - 비밀번호 찾기 링크
 * - 회원가입 링크
 * 
 * URL 파라미터:
 * - redirect: 로그인 후 이동할 경로
 * 
 * 데이터 흐름:
 * 1. 로그인 폼 작성
 * 2. 로그인 API 호출
 * 3. 로그인 성공 시 useAuthStore에 사용자 정보 저장
 * 4. redirect 파라미터가 있으면 해당 경로로, 없으면 /writing-demo로 이동
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Rocket,
  Shield,
  Zap,
  Check,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/useAuthStore';

/**
 * LoginPage 컴포넌트
 * 
 * 역할:
 * - 로그인 UI 제공
 * - 소셜 로그인 및 이메일 로그인 지원
 * - 로그인 후 리다이렉트 처리
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, socialLogin, isLoading } = useAuthStore();

  // redirect 파라미터 읽기
  const redirectPath = searchParams.get('redirect') || '/writing-demo';

  // 폼 상태
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // 에러 상태
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 입력 값 변경 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 에러 클리어
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 이메일 로그인 처리
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      // 로그인 성공 시 redirect 경로로 이동
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      setErrors({ 
        submit: error.response?.data?.error?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.' 
      });
    }
  };

  // 소셜 로그인 처리
  const handleSocialLogin = async (provider: 'google' | 'kakao' | 'naver') => {
    try {
      // NOTE: 실제 프로덕션 환경에서는 OAuth2 Provider의 인증 페이지로 리다이렉트 해야 합니다.
      // 현재 개발 환경에서는 유효한 Client ID/Secret이 없으므로,
      // 백엔드에서 모의 토큰("mock-...")을 받아 처리하도록 구성되어 있습니다.
      // 백엔드 SocialOAuthService는 "mock-" 접두사가 있는 토큰을 감지하여 테스트 유저로 로그인시킵니다.
      
      const mockAccessToken = `mock-${provider}-token-${Date.now()}`;
      
      // 로그인 페이지에서는 기본 요금제로, 약관 동의는 기본값 사용 (기존 사용자도 로그인 가능하도록)
      await socialLogin(provider, mockAccessToken, '기본', true, true, false);
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      setErrors({ submit: '소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-900/50 via-slate-900 to-slate-950 p-12 flex-col items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12 group">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-shadow">
              <Rocket className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-2xl leading-tight">Makers Round</span>
              <span className="text-white/40 text-xs">by Makers World</span>
            </div>
          </Link>

          {/* Value Props */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              AI가 만드는<br />
              완벽한 사업계획서
            </h1>
            <p className="text-xl text-white/70">
              6명의 AI 심사위원이 당신의 사업을<br />
              철저히 검증합니다.
            </p>

            <div className="space-y-4 pt-6">
              {[
                { icon: Zap, text: '30분 만에 사업계획서 완성' },
                { icon: Shield, text: '지원사업 별 합격률 예측 및 개선' },
                { icon: Check, text: 'HWP/PDF 즉시 다운로드' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 justify-center">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-white/80">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Header */}
        <div className="p-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>돌아가기</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-4 py-6">
          <div className="w-full max-w-md">
            <div className="space-y-5">
              {/* Title */}
              <div>
                <h2 className="text-2xl font-bold mb-1">로그인</h2>
                <p className="text-white/60 text-sm">계정에 로그인하여 계속하세요</p>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-800 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google로 로그인
                </button>

                <button
                  onClick={() => handleSocialLogin('kakao')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FEE500] text-[#191919] rounded-lg font-medium text-sm hover:bg-[#FDD800] transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#191919" d="M12 3c-5.52 0-10 3.59-10 8.03 0 2.84 1.87 5.33 4.67 6.75l-1.18 4.36c-.1.38.34.68.67.47l5.2-3.44c.21.01.42.02.64.02 5.52 0 10-3.59 10-8.03S17.52 3 12 3z"/>
                  </svg>
                  카카오로 로그인
                </button>

                <button
                  onClick={() => handleSocialLogin('naver')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#03C75A] text-white rounded-lg font-medium text-sm hover:bg-[#02B350] transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="white" d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
                  </svg>
                  네이버로 로그인
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-950 text-white/40">또는 이메일로 로그인</span>
                </div>
              </div>

              {/* Email Login Form */}
              <form onSubmit={handleEmailLogin} className="space-y-3">
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="이메일"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500"
                  />
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="비밀번호"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-purple-400 hover:text-purple-300 underline underline-offset-4"
                  >
                    비밀번호를 잊으셨나요?
                  </Link>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <p className="text-sm text-red-400 text-center">{errors.submit}</p>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full py-3 text-base font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
                >
                  로그인
                </Button>
              </form>

              {/* Signup Link */}
              <p className="text-center text-white/60 text-sm">
                계정이 없으신가요?{' '}
                <Link to="/signup" className="text-purple-400 hover:text-purple-300 underline underline-offset-4">
                  회원가입
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
