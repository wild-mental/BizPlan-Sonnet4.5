/**
 * 파일명: AdminPage.tsx
 * 
 * 파일 용도:
 * 어드민 페이지 컴포넌트
 * - 사용자 목록 조회 및 관리
 * - 사용자 통계 차트 시각화
 * - 필터링 및 정렬 기능
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  TrendingUp,
  Filter,
  Search,
  ArrowUpDown,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { adminApi, UserInfo, UserStatisticsResponse } from '../services/adminApi';
import { useAuthStore } from '../stores/useAuthStore';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

/**
 * AdminPage 컴포넌트
 */
export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  // 인증 확인
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/admin');
    }
  }, [isAuthenticated, navigate]);

  // 상태 관리
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [statistics, setStatistics] = useState<UserStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 필터 및 정렬 상태
  const [filters, setFilters] = useState({
    page: 0,
    size: 20,
    sortBy: 'createdAt',
    sortDirection: 'DESC' as 'ASC' | 'DESC',
    planFilter: '',
    providerFilter: '',
    emailVerifiedFilter: undefined as boolean | undefined,
    searchKeyword: '',
  });

  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // 데이터 로드
  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 사용자 목록 및 통계 동시 로드
      const [usersResponse, statsResponse] = await Promise.all([
        adminApi.getUserList(filters),
        adminApi.getStatistics(),
      ]);

      if (usersResponse.data.success && usersResponse.data.data) {
        setUsers(usersResponse.data.data.users);
        setPagination(usersResponse.data.data.pagination);
      }

      if (statsResponse.data.success && statsResponse.data.data) {
        setStatistics(statsResponse.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || '데이터를 불러오는데 실패했습니다');
      console.error('Admin data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 필터 변경 핸들러
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 0, // 필터 변경 시 첫 페이지로
    }));
  };

  // 정렬 변경
  const handleSort = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortDirection: prev.sortBy === field && prev.sortDirection === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && !statistics) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => navigate('/login')}>로그인 페이지로 이동</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-400" />
            어드민 대시보드
          </h1>
          <p className="text-white/60">사용자 관리 및 통계 조회</p>
        </div>

        {/* 통계 카드 */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="text-white/60 text-sm mb-1">전체 사용자</div>
              <div className="text-2xl font-bold text-purple-400">{statistics.overall.totalUsers}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="text-white/60 text-sm mb-1">이메일 인증 완료</div>
              <div className="text-2xl font-bold text-emerald-400">{statistics.overall.verifiedUsers}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="text-white/60 text-sm mb-1">유료 요금제 사용자</div>
              <div className="text-2xl font-bold text-blue-400">{statistics.overall.paidPlanUsers}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="text-white/60 text-sm mb-1">무료 요금제 사용자</div>
              <div className="text-2xl font-bold text-amber-400">{statistics.overall.freePlanUsers}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="text-white/60 text-sm mb-1">마케팅 동의</div>
              <div className="text-2xl font-bold text-rose-400">{statistics.overall.marketingConsentUsers}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="text-white/60 text-sm mb-1">미인증 사용자</div>
              <div className="text-2xl font-bold text-red-400">{statistics.overall.unverifiedUsers}</div>
            </div>
          </div>
        )}

        {/* 차트 섹션 */}
        {statistics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 가입 추이 (월별) */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                월별 가입 추이
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={statistics.signupByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} name="가입자 수" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 요금제별 분포 */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                요금제별 분포
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statistics.byPlan as any}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.plan}: ${entry.percentage.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {statistics.byPlan.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 소셜 로그인별 분포 */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                소셜 로그인별 분포
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statistics.byProvider}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="provider" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="#10b981" name="사용자 수" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 사업 분야별 분포 */}
            {statistics.byCategory.length > 0 && (
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  사업 분야별 분포
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statistics.byCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" fill="#f59e0b" name="사용자 수" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* 필터 섹션 */}
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-400" />
            필터 및 검색
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 검색 */}
            <div>
              <label className="block text-sm text-white/60 mb-2">검색</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  type="text"
                  placeholder="이메일 또는 이름"
                  value={filters.searchKeyword}
                  onChange={(e) => handleFilterChange('searchKeyword', e.target.value)}
                  className="bg-white/5 border-white/10 text-white pl-10"
                />
              </div>
            </div>

            {/* 요금제 필터 */}
            <div>
              <label className="block text-sm text-white/60 mb-2">요금제</label>
              <select
                value={filters.planFilter}
                onChange={(e) => handleFilterChange('planFilter', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">전체</option>
                <option value="기본">기본</option>
                <option value="플러스">플러스</option>
                <option value="프로">프로</option>
                <option value="프리미엄">프리미엄</option>
              </select>
            </div>

            {/* 제공자 필터 */}
            <div>
              <label className="block text-sm text-white/60 mb-2">로그인 방식</label>
              <select
                value={filters.providerFilter}
                onChange={(e) => handleFilterChange('providerFilter', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">전체</option>
                <option value="local">이메일</option>
                <option value="google">Google</option>
                <option value="kakao">Kakao</option>
                <option value="naver">Naver</option>
              </select>
            </div>

            {/* 이메일 인증 필터 */}
            <div>
              <label className="block text-sm text-white/60 mb-2">이메일 인증</label>
              <select
                value={filters.emailVerifiedFilter === undefined ? '' : filters.emailVerifiedFilter.toString()}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : e.target.value === 'true';
                  handleFilterChange('emailVerifiedFilter', value);
                }}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">전체</option>
                <option value="true">인증 완료</option>
                <option value="false">미인증</option>
              </select>
            </div>
          </div>
        </div>

        {/* 사용자 목록 테이블 */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              사용자 목록 ({pagination.totalElements}명)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">
                    <button
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center gap-1 hover:text-purple-400 transition-colors"
                    >
                      가입일
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">
                    <button
                      onClick={() => handleSort('email')}
                      className="flex items-center gap-1 hover:text-purple-400 transition-colors"
                    >
                      이메일
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:text-purple-400 transition-colors"
                    >
                      이름
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">전화번호</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">사업 분야</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">로그인 방식</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">요금제</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">인증 상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-white/80">
                      {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-white">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-white/60">{user.phone || '-'}</td>
                    <td className="px-4 py-3 text-sm text-white/60">{user.businessCategory || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 rounded text-xs bg-slate-700 text-white/80">
                        {user.provider === 'local' ? '이메일' : user.provider}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user.subscription ? (
                        <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          {user.subscription.plan}
                        </span>
                      ) : (
                        <span className="text-white/40">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user.emailVerified ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle className="w-4 h-4" />
                          인증
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400">
                          <XCircle className="w-4 h-4" />
                          미인증
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이징 */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-slate-700 flex items-center justify-between">
              <div className="text-sm text-white/60">
                {pagination.page * pagination.size + 1} - {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} / {pagination.totalElements}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevious}
                  className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
                >
                  이전
                </Button>
                <span className="text-sm text-white/60">
                  {pagination.page + 1} / {pagination.totalPages}
                </span>
                <Button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
                >
                  다음
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
