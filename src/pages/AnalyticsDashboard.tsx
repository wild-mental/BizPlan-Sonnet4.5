/**
 * AnalyticsDashboard.tsx
 * 
 * 서비스 이용 현황 분석 대시보드 페이지
 * 
 * 주요 기능:
 * - 랜딩 페이지, 사업계획서 작성 데모, AI 평가 데모 이용 현황 시각화
 * - 시간대별 이용 추이 차트 (LineChart)
 * - 일별 이용 추이 차트 (BarChart)
 * - 이용 요약 카드 및 상세 테이블
 * - CSV 내보내기 기능
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  RefreshCw,
  Download,
  Calendar,
  Activity,
  FileText,
  Bot,
  Eye,
  TrendingUp,
} from 'lucide-react';
import {
  getAllHourlyUsage,
  getDailyUsage,
  getUsageSummary,
  type HourlyUsageResponse,
  type DailyUsageResponse,
  type UsageSummaryResponse,
} from '../services/analyticsApi';

// ============================================================
// 타입 정의
// ============================================================

interface CombinedHourlyData {
  hour: number;
  hourLabel: string;
  landing: number;
  writingDemo: number;
  evaluationDemo: number;
}

// ============================================================
// 유틸리티 함수
// ============================================================

/**
 * 날짜를 한국어 형식으로 포맷팅
 */
const formatDateKR = (date: Date): string => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * ISO 문자열을 짧은 날짜로 포맷팅
 */
const formatShortDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

/**
 * 숫자에 천 단위 콤마 추가
 */
const formatNumber = (num: number): string => {
  return num.toLocaleString('ko-KR');
};

// ============================================================
// 컴포넌트
// ============================================================

/**
 * 요약 카드 컴포넌트
 */
interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
  bgColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon, title, value, color, bgColor }) => (
  <div className={`rounded-xl p-6 ${bgColor} border border-gray-100 shadow-sm hover:shadow-md transition-shadow`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{formatNumber(value)}</p>
      </div>
    </div>
  </div>
);

/**
 * 데이터 테이블 컴포넌트
 */
interface DataTableProps {
  data: CombinedHourlyData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            시간대
          </th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            랜딩 페이지
          </th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            작성 데모
          </th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            평가 데모
          </th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            합계
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row) => (
          <tr key={row.hour} className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
              {row.hourLabel}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">
              {formatNumber(row.landing)}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">
              {formatNumber(row.writingDemo)}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">
              {formatNumber(row.evaluationDemo)}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
              {formatNumber(row.landing + row.writingDemo + row.evaluationDemo)}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot className="bg-gray-100">
        <tr>
          <td className="px-4 py-3 text-sm font-bold text-gray-900">합계</td>
          <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
            {formatNumber(data.reduce((sum, row) => sum + row.landing, 0))}
          </td>
          <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
            {formatNumber(data.reduce((sum, row) => sum + row.writingDemo, 0))}
          </td>
          <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
            {formatNumber(data.reduce((sum, row) => sum + row.evaluationDemo, 0))}
          </td>
          <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
            {formatNumber(data.reduce((sum, row) => sum + row.landing + row.writingDemo + row.evaluationDemo, 0))}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
);

/**
 * 분석 대시보드 메인 컴포넌트
 */
export const AnalyticsDashboard: React.FC = () => {
  // ============================================================
  // 상태 관리
  // ============================================================
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // API 응답 데이터
  const [hourlyData, setHourlyData] = useState<{
    landing: HourlyUsageResponse | null;
    writingDemo: HourlyUsageResponse | null;
    evaluationDemo: HourlyUsageResponse | null;
  }>({ landing: null, writingDemo: null, evaluationDemo: null });
  
  const [dailyData, setDailyData] = useState<DailyUsageResponse | null>(null);
  const [summary, setSummary] = useState<UsageSummaryResponse | null>(null);

  // ============================================================
  // 데이터 로드
  // ============================================================

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 7일 전부터 오늘까지의 데이터 조회
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);

      const [hourlyResult, dailyResult, summaryResult] = await Promise.all([
        getAllHourlyUsage(selectedDate),
        getDailyUsage(startDate, endDate),
        getUsageSummary(startDate, endDate),
      ]);

      setHourlyData(hourlyResult);
      setDailyData(dailyResult);
      setSummary(summaryResult);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('데이터 로드 실패:', err);
      setError('데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  // 초기 로드 및 날짜 변경 시 로드
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 5분 주기 자동 새로고침
  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [loadData]);

  // ============================================================
  // 차트 데이터 가공
  // ============================================================

  const combinedHourlyData: CombinedHourlyData[] = useMemo(() => {
    if (!hourlyData.landing || !hourlyData.writingDemo || !hourlyData.evaluationDemo) {
      return [];
    }

    return hourlyData.landing.hourlyData.map((item, index) => ({
      hour: item.hour,
      hourLabel: item.hourLabel,
      landing: item.count,
      writingDemo: hourlyData.writingDemo!.hourlyData[index]?.count || 0,
      evaluationDemo: hourlyData.evaluationDemo!.hourlyData[index]?.count || 0,
    }));
  }, [hourlyData]);

  const dailyChartData = useMemo(() => {
    if (!dailyData) return [];
    
    return dailyData.data.map((item) => ({
      date: formatShortDate(item.date),
      fullDate: item.date,
      landing: item.landingPageViews,
      writingDemo: item.writingDemoUsage,
      evaluationDemo: item.evaluationDemoUsage,
      total: item.totalRequests,
    }));
  }, [dailyData]);

  // ============================================================
  // 이벤트 핸들러
  // ============================================================

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleExportCSV = () => {
    if (!combinedHourlyData.length) return;

    const headers = ['시간대', '랜딩 페이지', '작성 데모', '평가 데모', '합계'];
    const rows = combinedHourlyData.map((row) => [
      row.hourLabel,
      row.landing,
      row.writingDemo,
      row.evaluationDemo,
      row.landing + row.writingDemo + row.evaluationDemo,
    ]);

    // 합계 행 추가
    const totals = ['합계',
      combinedHourlyData.reduce((sum, row) => sum + row.landing, 0),
      combinedHourlyData.reduce((sum, row) => sum + row.writingDemo, 0),
      combinedHourlyData.reduce((sum, row) => sum + row.evaluationDemo, 0),
      combinedHourlyData.reduce((sum, row) => sum + row.landing + row.writingDemo + row.evaluationDemo, 0),
    ];
    rows.push(totals.map(String));

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics_${selectedDate.toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // ============================================================
  // 렌더링
  // ============================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">서비스 분석 대시보드</h1>
                <p className="text-sm text-gray-500">실시간 이용 현황 모니터링</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* 날짜 선택 */}
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={handleDateChange}
                  className="text-sm text-gray-700 bg-transparent border-none focus:outline-none"
                />
              </div>
              
              {/* 새로고침 버튼 */}
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                새로고침
              </button>
              
              {/* CSV 내보내기 */}
              <button
                onClick={handleExportCSV}
                disabled={!combinedHourlyData.length}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-sm font-medium text-white hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                CSV 내보내기
              </button>
            </div>
          </div>
          
          {/* 마지막 업데이트 시간 */}
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-2">
              마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* 로딩 상태 */}
        {isLoading && !summary && (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-gray-500">데이터를 불러오는 중...</p>
            </div>
          </div>
        )}

        {/* 대시보드 콘텐츠 */}
        {summary && (
          <>
            {/* 요약 카드 */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <SummaryCard
                icon={<Eye className="w-6 h-6 text-blue-600" />}
                title="랜딩 페이지 조회"
                value={summary.landingPageViews}
                color="bg-blue-100"
                bgColor="bg-white"
              />
              <SummaryCard
                icon={<FileText className="w-6 h-6 text-green-600" />}
                title="사업계획서 작성"
                value={summary.writingDemoUsage}
                color="bg-green-100"
                bgColor="bg-white"
              />
              <SummaryCard
                icon={<Bot className="w-6 h-6 text-purple-600" />}
                title="AI 평가 데모"
                value={summary.evaluationDemoUsage}
                color="bg-purple-100"
                bgColor="bg-white"
              />
              <SummaryCard
                icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
                title="총 API 요청"
                value={summary.totalRequests}
                color="bg-orange-100"
                bgColor="bg-white"
              />
            </section>

            {/* 선택된 날짜 표시 */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                {formatDateKR(selectedDate)} 시간대별 이용 추이
              </h2>
            </div>

            {/* 시간대별 라인 차트 */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">시간대별 이용 추이</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedHourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="hourLabel" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="landing"
                      name="랜딩 페이지"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="writingDemo"
                      name="작성 데모"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="evaluationDemo"
                      name="평가 데모"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* 시간대별 데이터 테이블 */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">시간대별 상세 데이터</h3>
              <DataTable data={combinedHourlyData} />
            </section>

            {/* 일별 바 차트 */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">최근 7일 일별 이용 추이</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="landing"
                      name="랜딩 페이지"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="writingDemo"
                      name="작성 데모"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="evaluationDemo"
                      name="평가 데모"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-white/60 border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            MakersRound 서비스 분석 대시보드 • 5분마다 자동 새로고침
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AnalyticsDashboard;
