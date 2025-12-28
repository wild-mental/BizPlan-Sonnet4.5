/**
 * M.A.K.E.R.S 6대 영역 점수 레이더 차트
 */

import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { EvaluationArea } from '../../types/evaluation';

interface ScoreRadarChartProps {
  scores: Record<EvaluationArea, number>;
}

export const ScoreRadarChart: React.FC<ScoreRadarChartProps> = ({ scores }) => {
  const data = [
    { subject: '시장성', fullName: 'Marketability', score: scores.M, fullMark: 100 },
    { subject: '수행능력', fullName: 'Ability', score: scores.A, fullMark: 100 },
    { subject: '핵심기술', fullName: 'Key Technology', score: scores.K, fullMark: 100 },
    { subject: '경제성', fullName: 'Economics', score: scores.E, fullMark: 100 },
    { subject: '실현가능성', fullName: 'Realization', score: scores.R, fullMark: 100 },
    { subject: '사회적가치', fullName: 'Social Impact', score: scores.S, fullMark: 100 },
  ];

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { subject: string; fullName: string; score: number } }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-slate-800 font-semibold">{item.subject}</p>
          <p className="text-slate-500 text-xs">{item.fullName}</p>
          <p className="text-purple-600 font-bold text-lg">{item.score}점</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid 
          stroke="rgba(100,116,139,0.2)" 
          strokeDasharray="3 3"
        />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: 'rgb(71,85,105)', fontSize: 12 }}
          tickLine={{ stroke: 'rgba(100,116,139,0.3)' }}
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 100]}
          tick={{ fill: 'rgb(100,116,139)', fontSize: 10 }}
          tickCount={5}
          axisLine={{ stroke: 'rgba(100,116,139,0.2)' }}
        />
        <Radar
          name="점수"
          dataKey="score"
          stroke="#9333ea"
          strokeWidth={2}
          fill="#9333ea"
          fillOpacity={0.3}
          dot={{ fill: '#9333ea', strokeWidth: 2, r: 4 }}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default ScoreRadarChart;

