/**
 * 파일명: EarlyStartupBudgetCalculator.tsx
 * 
 * 파일 용도:
 * 초기창업패키지 자금 집행계획 계산기 컴포넌트
 * - 정부지원금 (70% 이하) + 자기부담금 (30% 이상) 매칭펀드 구조
 * - 자기부담금 = 현금 (10% 이상) + 현물 (20% 이하)
 * - 실시간 비율 검증 및 합계 계산
 * 
 * 사용처:
 * - 초기창업패키지 템플릿의 실현가능성(Solution) 단계
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, AlertCircle, CheckCircle2, Info } from 'lucide-react';
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

interface MatchingFund {
  totalBudget: number;
  governmentFund: number;
  selfCash: number;
  selfInKind: number;
  items: BudgetItem[];
}

interface EarlyStartupBudgetProps {
  stepId: number;
  onChange?: (data: MatchingFund) => void;
}

// ============================================
// 초기 데이터
// ============================================

const initialMatchingFund: MatchingFund = {
  totalBudget: 0,
  governmentFund: 0,
  selfCash: 0,
  selfInKind: 0,
  items: [
    { id: 'labor', name: '인건비', amount: 0, description: '' },
    { id: 'development', name: '개발비', amount: 0, description: '' },
    { id: 'marketing', name: '마케팅비', amount: 0, description: '' },
    { id: 'operation', name: '운영비', amount: 0, description: '' },
    { id: 'equipment', name: '장비비', amount: 0, description: '' },
  ],
};

// ============================================
// 메인 컴포넌트
// ============================================

export const EarlyStartupBudgetCalculator: React.FC<EarlyStartupBudgetProps> = ({
  stepId,
  onChange,
}) => {
  const { updateStepData, getStepData } = useWizardStore();
  const existingData = getStepData(stepId);
  
  // 기존 저장된 데이터가 있으면 로드, 없으면 초기값 사용
  const [matchingFund, setMatchingFund] = useState<MatchingFund>(() => {
    if (existingData?.matchingFund) {
      return existingData.matchingFund;
    }
    return initialMatchingFund;
  });

  // 데이터 변경 시 스토어 업데이트
  useEffect(() => {
    updateStepData(stepId, 'matchingFund', matchingFund);
    onChange?.(matchingFund);
  }, [matchingFund]);

  // 총 사업비 계산
  const totalBudget = useMemo(() => {
    return matchingFund.items.reduce((sum, item) => sum + item.amount, 0);
  }, [matchingFund.items]);

  // 비율 계산
  const ratios = useMemo(() => {
    if (totalBudget === 0) {
      return {
        governmentRatio: 0,
        selfCashRatio: 0,
        selfInKindRatio: 0,
        selfTotalRatio: 0,
      };
    }
    return {
      governmentRatio: (matchingFund.governmentFund / totalBudget) * 100,
      selfCashRatio: (matchingFund.selfCash / totalBudget) * 100,
      selfInKindRatio: (matchingFund.selfInKind / totalBudget) * 100,
      selfTotalRatio: ((matchingFund.selfCash + matchingFund.selfInKind) / totalBudget) * 100,
    };
  }, [matchingFund, totalBudget]);

  // 검증
  const validations = useMemo(() => {
    const fundTotal = matchingFund.governmentFund + matchingFund.selfCash + matchingFund.selfInKind;
    return {
      isTotalMatch: Math.abs(fundTotal - totalBudget) < 100, // 100원 오차 허용
      isGovernmentValid: ratios.governmentRatio <= 70,
      isSelfCashValid: ratios.selfCashRatio >= 10,
      isSelfInKindValid: ratios.selfInKindRatio <= 20,
      isSelfTotalValid: ratios.selfTotalRatio >= 30,
    };
  }, [matchingFund, totalBudget, ratios]);

  // 금액 변경 핸들러
  const handleItemAmountChange = (itemId: string, amount: number) => {
    setMatchingFund(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, amount } : item
      ),
    }));
  };

  // 설명 변경 핸들러
  const handleItemDescriptionChange = (itemId: string, description: string) => {
    setMatchingFund(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, description } : item
      ),
    }));
  };

  // 자금 구성 변경 핸들러
  const handleFundChange = (field: 'governmentFund' | 'selfCash' | 'selfInKind', value: number) => {
    setMatchingFund(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 자동 계산 (추천값)
  const handleAutoCalculate = () => {
    const govFund = Math.floor(totalBudget * 0.7); // 70%
    const cash = Math.floor(totalBudget * 0.1); // 10%
    const inKind = totalBudget - govFund - cash; // 나머지 (약 20%)
    
    setMatchingFund(prev => ({
      ...prev,
      governmentFund: govFund,
      selfCash: cash,
      selfInKind: inKind,
    }));
  };

  // 금액 포맷팅
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">총사업비 집행계획</h3>
          <p className="text-sm text-white/60">초기창업패키지 매칭펀드 구조</p>
        </div>
      </div>

      {/* 매칭펀드 구조 안내 */}
      <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-300 font-medium">매칭펀드 구조</p>
            <p className="text-blue-200/70 mt-1">
              총사업비 = 정부지원금(70% 이하) + 자기부담금(30% 이상)
              <br />
              자기부담금 = 현금(10% 이상) + 현물(20% 이하)
            </p>
          </div>
        </div>
      </div>

      {/* 사업비 항목별 입력 */}
      <div className="glass-card rounded-xl p-5 border border-white/10">
        <h4 className="font-semibold text-white mb-4">사업비 항목별 배분</h4>
        <div className="space-y-3">
          {matchingFund.items.map((item) => (
            <div key={item.id} className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-3 mb-2">
                <label className="text-sm text-white/80 w-20 flex-shrink-0">
                  {item.name}
                </label>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">₩</span>
                  <input
                    type="number"
                    value={item.amount || ''}
                    onChange={(e) => handleItemAmountChange(item.id, parseInt(e.target.value) || 0)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 pl-8 text-white text-right focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                    placeholder="0"
                  />
                </div>
              </div>
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleItemDescriptionChange(item.id, e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-blue-500/30 placeholder:text-white/30"
                placeholder="산출 근거 (예: 개발자 2명 x 6개월 x 500만원)"
              />
            </div>
          ))}
        </div>

        {/* 총 사업비 합계 */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-white/60">총 사업비</span>
          <span className="text-xl font-bold text-white">₩{formatCurrency(totalBudget)}</span>
        </div>
      </div>

      {/* 자금 구성 */}
      <div className="glass-card rounded-xl p-5 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-white">자금 구성 (매칭펀드)</h4>
          <button
            onClick={handleAutoCalculate}
            disabled={totalBudget === 0}
            className="text-sm text-blue-400 hover:text-blue-300 disabled:text-white/30 disabled:cursor-not-allowed"
          >
            자동 계산
          </button>
        </div>

        <div className="space-y-4">
          {/* 정부지원금 */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80">정부지원금</span>
                <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                  최대 70%
                </span>
              </div>
              <div className="flex items-center gap-2">
                {validations.isGovernmentValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-sm text-white/60">{ratios.governmentRatio.toFixed(1)}%</span>
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">₩</span>
              <input
                type="number"
                value={matchingFund.governmentFund || ''}
                onChange={(e) => handleFundChange('governmentFund', parseInt(e.target.value) || 0)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 pl-8 text-white text-right focus:outline-none focus:border-blue-500/50"
                placeholder="0"
              />
            </div>
          </div>

          {/* 자기부담금 - 현금 */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80">자기부담금 (현금)</span>
                <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
                  최소 10%
                </span>
              </div>
              <div className="flex items-center gap-2">
                {validations.isSelfCashValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-sm text-white/60">{ratios.selfCashRatio.toFixed(1)}%</span>
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">₩</span>
              <input
                type="number"
                value={matchingFund.selfCash || ''}
                onChange={(e) => handleFundChange('selfCash', parseInt(e.target.value) || 0)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 pl-8 text-white text-right focus:outline-none focus:border-blue-500/50"
                placeholder="0"
              />
            </div>
            <p className="text-xs text-white/40 mt-1">대표자 출자, 매출 재투자 등</p>
          </div>

          {/* 자기부담금 - 현물 */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80">자기부담금 (현물)</span>
                <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">
                  최대 20%
                </span>
              </div>
              <div className="flex items-center gap-2">
                {validations.isSelfInKindValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-sm text-white/60">{ratios.selfInKindRatio.toFixed(1)}%</span>
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">₩</span>
              <input
                type="number"
                value={matchingFund.selfInKind || ''}
                onChange={(e) => handleFundChange('selfInKind', parseInt(e.target.value) || 0)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 pl-8 text-white text-right focus:outline-none focus:border-blue-500/50"
                placeholder="0"
              />
            </div>
            <p className="text-xs text-white/40 mt-1">기존 장비, 사무실 임차료 등</p>
          </div>
        </div>

        {/* 합계 검증 */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/60">자금 구성 합계</span>
            <div className="flex items-center gap-2">
              {validations.isTotalMatch ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span className={`font-semibold ${validations.isTotalMatch ? 'text-white' : 'text-amber-400'}`}>
                ₩{formatCurrency(matchingFund.governmentFund + matchingFund.selfCash + matchingFund.selfInKind)}
              </span>
            </div>
          </div>
          {!validations.isTotalMatch && totalBudget > 0 && (
            <p className="text-xs text-amber-400 mt-1">
              자금 구성 합계가 총 사업비(₩{formatCurrency(totalBudget)})와 일치해야 합니다.
            </p>
          )}
        </div>
      </div>

      {/* 검증 결과 요약 */}
      <div className={`rounded-xl p-4 border ${
        Object.values(validations).every(v => v)
          ? 'bg-emerald-950/30 border-emerald-500/30'
          : 'bg-amber-950/30 border-amber-500/30'
      }`}>
        <h5 className="font-semibold text-white mb-3">검증 결과</h5>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <ValidationItem 
            label="정부지원금 ≤ 70%" 
            isValid={validations.isGovernmentValid} 
            value={`${ratios.governmentRatio.toFixed(1)}%`}
          />
          <ValidationItem 
            label="자기부담금 ≥ 30%" 
            isValid={validations.isSelfTotalValid}
            value={`${ratios.selfTotalRatio.toFixed(1)}%`}
          />
          <ValidationItem 
            label="현금 ≥ 10%" 
            isValid={validations.isSelfCashValid}
            value={`${ratios.selfCashRatio.toFixed(1)}%`}
          />
          <ValidationItem 
            label="현물 ≤ 20%" 
            isValid={validations.isSelfInKindValid}
            value={`${ratios.selfInKindRatio.toFixed(1)}%`}
          />
        </div>
      </div>
    </div>
  );
};

// 검증 항목 컴포넌트
const ValidationItem: React.FC<{ label: string; isValid: boolean; value: string }> = ({
  label,
  isValid,
  value,
}) => (
  <div className="flex items-center gap-2">
    {isValid ? (
      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    ) : (
      <AlertCircle className="w-4 h-4 text-amber-400" />
    )}
    <span className={isValid ? 'text-emerald-300' : 'text-amber-300'}>
      {label}: {value}
    </span>
  </div>
);

export default EarlyStartupBudgetCalculator;

