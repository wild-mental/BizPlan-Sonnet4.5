/**
 * 파일명: PreStartupBudgetCalculator.tsx
 * 
 * 파일 용도:
 * 예비창업패키지 자금 집행계획 계산기 컴포넌트
 * - 1단계 (약 2천만 원) + 2단계 (약 4천만 원) 구조
 * - 항목별 예산 배분 및 산출 근거 입력
 * - 실시간 합계 계산 및 검증
 * 
 * 사용처:
 * - 예비창업패키지 템플릿의 실현가능성(Solution) 단계
 */

import React, { useState, useEffect } from 'react';
import { Calculator, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useWizardStore } from '../../stores/useWizardStore';

// ============================================
// 타입 정의
// ============================================

interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  description: string;
}

interface BudgetPhase {
  phase: 1 | 2;
  name: string;
  maxAmount: number;
  description: string;
  items: BudgetItem[];
}

interface PreStartupBudgetProps {
  stepId: number;
  onChange?: (data: BudgetPhase[]) => void;
}

// ============================================
// 초기 데이터
// ============================================

const initialBudgetData: BudgetPhase[] = [
  {
    phase: 1,
    name: '1단계 (MVP 개발)',
    maxAmount: 20000000, // 2천만 원
    description: '아이디어 구체화 및 MVP 개발 단계',
    items: [
      { id: 'phase1-materials', name: '재료비', amount: 0, description: '' },
      { id: 'phase1-outsourcing', name: '외주용역비', amount: 0, description: '' },
      { id: 'phase1-labor', name: '인건비', amount: 0, description: '' },
      { id: 'phase1-equipment', name: '장비비', amount: 0, description: '' },
    ],
  },
  {
    phase: 2,
    name: '2단계 (서비스 고도화)',
    maxAmount: 40000000, // 4천만 원
    description: '서비스 출시 및 초기 마케팅 단계',
    items: [
      { id: 'phase2-development', name: '개발비', amount: 0, description: '' },
      { id: 'phase2-marketing', name: '마케팅비', amount: 0, description: '' },
      { id: 'phase2-operation', name: '운영비', amount: 0, description: '' },
      { id: 'phase2-labor', name: '인건비', amount: 0, description: '' },
    ],
  },
];

// ============================================
// 메인 컴포넌트
// ============================================

export const PreStartupBudgetCalculator: React.FC<PreStartupBudgetProps> = ({
  stepId,
  onChange,
}) => {
  const { updateStepData, getStepData } = useWizardStore();
  const existingData = getStepData(stepId);
  
  // 기존 저장된 데이터가 있으면 로드, 없으면 초기값 사용
  const [budgetData, setBudgetData] = useState<BudgetPhase[]>(() => {
    if (existingData?.budgetPhases) {
      return existingData.budgetPhases;
    }
    return initialBudgetData;
  });

  // 데이터 변경 시 스토어 업데이트
  useEffect(() => {
    updateStepData(stepId, 'budgetPhases', budgetData);
    onChange?.(budgetData);
  }, [budgetData]);

  // 금액 변경 핸들러
  const handleAmountChange = (phaseIndex: number, itemId: string, amount: number) => {
    setBudgetData(prev => {
      const newData = [...prev];
      const itemIndex = newData[phaseIndex].items.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        newData[phaseIndex].items[itemIndex].amount = amount;
      }
      return newData;
    });
  };

  // 설명 변경 핸들러
  const handleDescriptionChange = (phaseIndex: number, itemId: string, description: string) => {
    setBudgetData(prev => {
      const newData = [...prev];
      const itemIndex = newData[phaseIndex].items.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        newData[phaseIndex].items[itemIndex].description = description;
      }
      return newData;
    });
  };

  // 단계별 합계 계산
  const calculatePhaseTotal = (phase: BudgetPhase): number => {
    return phase.items.reduce((sum, item) => sum + item.amount, 0);
  };

  // 전체 합계 계산
  const calculateTotalBudget = (): number => {
    return budgetData.reduce((sum, phase) => sum + calculatePhaseTotal(phase), 0);
  };

  // 초과 여부 확인
  const isPhaseExceeded = (phase: BudgetPhase): boolean => {
    return calculatePhaseTotal(phase) > phase.maxAmount;
  };

  // 금액 포맷팅
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 - 라이트 테마 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">정부지원금 집행계획</h3>
          <p className="text-sm text-gray-500">예비창업패키지 1단계 + 2단계 구조</p>
        </div>
      </div>

      {/* 전체 예산 요약 - 라이트 테마 */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">총 예산</p>
            <p className="text-2xl font-bold text-gray-900">
              ₩{formatCurrency(calculateTotalBudget())}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">최대 한도</p>
            <p className="text-lg text-gray-700">₩{formatCurrency(60000000)}</p>
          </div>
        </div>
        {/* 진행률 바 */}
        <div className="mt-3">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                calculateTotalBudget() > 60000000 
                  ? 'bg-red-500' 
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
              }`}
              style={{ width: `${Math.min((calculateTotalBudget() / 60000000) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 단계별 예산 - 라이트 테마 */}
      {budgetData.map((phase, phaseIndex) => {
        const phaseTotal = calculatePhaseTotal(phase);
        const exceeded = isPhaseExceeded(phase);

        return (
          <div 
            key={phase.phase}
            className={`bg-white rounded-xl p-5 border ${
              exceeded ? 'border-red-300' : 'border-gray-200'
            } shadow-sm`}
          >
            {/* 단계 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  phase.phase === 1 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-cyan-100 text-cyan-700'
                }`}>
                  {phase.phase}
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900">{phase.name}</h4>
                  <p className="text-xs text-gray-500">{phase.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-2 ${exceeded ? 'text-red-600' : 'text-gray-700'}`}>
                  {exceeded ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : phaseTotal > 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : null}
                  <span className="font-semibold">₩{formatCurrency(phaseTotal)}</span>
                </div>
                <p className="text-xs text-gray-500">/ ₩{formatCurrency(phase.maxAmount)}</p>
              </div>
            </div>

            {/* 예산 항목 */}
            <div className="space-y-3">
              {phase.items.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <label className="text-sm text-gray-700 w-24 flex-shrink-0">
                      {item.name}
                    </label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
                      <input
                        type="number"
                        value={item.amount || ''}
                        onChange={(e) => handleAmountChange(phaseIndex, item.id, parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 pl-8 text-gray-900 text-right focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleDescriptionChange(phaseIndex, item.id, e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-emerald-400 placeholder:text-gray-400"
                    placeholder="산출 근거를 입력하세요 (예: 클라우드 서버 3개월 x 50만원)"
                  />
                </div>
              ))}
            </div>

            {/* 초과 경고 */}
            {exceeded && (
              <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>예산이 {formatCurrency(phaseTotal - phase.maxAmount)}원 초과되었습니다.</span>
              </div>
            )}
          </div>
        );
      })}

      {/* 작성 가이드 - 라이트 테마 */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
        <h5 className="font-semibold text-emerald-800 mb-2">💡 작성 팁</h5>
        <ul className="space-y-1 text-emerald-700">
          <li>• 1단계(2천만 원)는 재료비, 외주용역비 중심으로 구성하세요</li>
          <li>• 2단계(4천만 원)는 개발비, 마케팅비, 운영비를 포함하세요</li>
          <li>• 각 항목별로 구체적인 산출 근거를 작성해야 합니다</li>
          <li>• 예산은 최대 한도 내에서 현실적으로 배분하세요</li>
        </ul>
      </div>
    </div>
  );
};

export default PreStartupBudgetCalculator;

