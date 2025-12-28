/**
 * 파일명: PMFSurvey.tsx
 * 
 * 파일 용도:
 * Product-Market Fit 진단 설문조사 및 결과 분석 컴포넌트 (마법사 5단계)
 * - 10개 질문으로 PMF 수준 측정
 * - 점수 계산 및 등급 판정
 * - 리스크 분석 및 개선 제언
 * 
 * 호출 구조:
 * PMFSurvey (이 컴포넌트)
 *   ├─> usePMFStore - PMF 데이터 및 분석
 *   │   ├─> answers - 사용자 답변 목록
 *   │   ├─> report - 진단 결과 리포트
 *   │   ├─> updateAnswer(questionId, value) - 답변 저장
 *   │   └─> generateReport() - 리포트 생성
 *   │
 *   └─> UI 컴포넌트
 *       ├─> Card - 질문 카드
 *       ├─> Badge - 등급 표시
 *       ├─> Progress - 점수 진행률
 *       └─> Button - 제출 버튼
 * 
 * 데이터 흐름:
 * 1. pmfQuestions 로드 (10개 질문)
 * 2. 사용자 선택 → updateAnswer(questionId, value)
 * 3. 모든 질문 답변 완료 → generateReport()
 * 4. report 생성 (점수, 등급, 리스크, 개선 제언)
 * 5. 결과 화면 표시
 * 
 * 점수 등급:
 * - 85점 이상: excellent (PMF 달성)
 * - 70-84점: high (PMF 근접)
 * - 50-69점: medium (개선 필요)
 * - 50점 미만: low (재검토 필요)
 * 
 * 사용하는 Store:
 * - usePMFStore: PMF 설문 및 분석 데이터
 */

import React, { useState, memo, useCallback, useMemo } from 'react';
import { usePMFStore } from '../../stores/usePMFStore';
import { pmfQuestions } from '../../types/mockData';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '../ui';
import { Progress } from '../ui';
import { CheckCircle2, AlertCircle, TrendingUp, Target } from 'lucide-react';
import { PMF_SURVEY, UI_CONSTANTS } from '../../constants';

/**
 * PMFSurvey 컴포넌트
 * 
 * 역할:
 * - Product-Market Fit 수준 진단
 * - 비즈니스 강점과 약점 분석
 * - 개선 방향 제시
 * 
 * 주요 기능:
 * 1. 10개 질문 설문 (4점 척도)
 * 2. 답변 완료 시 진단 리포트 생성
 * 3. PMF 점수 및 등급 표시
 * 4. 핵심 리스크 식별 및 표시
 * 5. 우선순위별 개선 제언 제공
 * 
 * 화면 상태:
 * - showReport=false: 설문조사 화면
 * - showReport=true: 진단 결과 화면
 * 
 * @returns {JSX.Element} PMF 설문 또는 결과 화면
 */
export const PMFSurvey: React.FC = memo(() => {
  const { answers, report, updateAnswer, generateReport } = usePMFStore();
  const [showReport, setShowReport] = useState(false);

  /**
   * 답변 선택 핸들러
   * 
   * @param {string} questionId - 질문 ID
   * @param {number} value - 선택한 점수 (1-4)
   */
  const handleAnswerChange = useCallback((questionId: string, value: number) => {
    updateAnswer(questionId, value);
  }, [updateAnswer]);

  /**
   * 진단 결과 생성 및 표시
   * - generateReport()로 점수 계산 및 분석
   * - 결과 화면으로 전환
   */
  const handleSubmit = useCallback(() => {
    generateReport();
    setShowReport(true);
  }, [generateReport]);

  // 모든 질문에 답변했는지 확인
  const isAllAnswered = useMemo(
    () => answers.length === PMF_SURVEY.QUESTION_COUNT,
    [answers.length]
  );

  if (showReport && report) {
    return (
      <div className="space-y-6">
        {/* Score Display */}
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 mb-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{report.score}</div>
              <div className="text-sm text-primary-100">점</div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            PMF 진단 완료
          </h3>
          <Badge
            variant={
              report.level === 'excellent' ? 'success' :
              report.level === 'high' ? 'info' :
              report.level === 'medium' ? 'warning' : 'danger'
            }
            className="text-base px-4 py-1"
          >
            {report.level === 'excellent' && 'Product-Market Fit 달성'}
            {report.level === 'high' && 'Product-Market Fit 근접'}
            {report.level === 'medium' && '개선 필요'}
            {report.level === 'low' && '재검토 필요'}
          </Badge>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            {report.score >= 85 && '축하합니다! 제품-시장 적합성(PMF)을 달성했습니다. 이제 성장에 집중하세요.'}
            {report.score >= 70 && report.score < 85 && 'PMF에 근접했습니다. 몇 가지 개선으로 더욱 강력한 비즈니스를 만들 수 있습니다.'}
            {report.score >= 50 && report.score < 70 && 'PMF 달성을 위해 몇 가지 핵심 영역의 개선이 필요합니다.'}
            {report.score < 50 && '비즈니스 모델과 제품에 대한 근본적인 재검토가 필요합니다.'}
          </p>
        </div>

        {/* Progress Bar */}
        <div>
          <Progress value={report.score} max={UI_CONSTANTS.PROGRESS_MAX} className="h-3" />
        </div>

        {/* Risks */}
        {report.risks.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              핵심 리스크
            </h4>
            <div className="space-y-3">
              {report.risks.map((risk) => (
                <Card key={risk.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      <Badge
                        variant={
                          risk.severity === 'high' ? 'danger' :
                          risk.severity === 'medium' ? 'warning' : 'default'
                        }
                        className="flex-shrink-0"
                      >
                        {risk.severity === 'high' && '높음'}
                        {risk.severity === 'medium' && '중간'}
                        {risk.severity === 'low' && '낮음'}
                      </Badge>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-1">{risk.title}</h5>
                        <p className="text-sm text-gray-600">{risk.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            개선 제언
          </h4>
          <div className="space-y-3">
            {report.recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <Badge
                      variant={
                        rec.priority === 'high' ? 'info' :
                        rec.priority === 'medium' ? 'warning' : 'default'
                      }
                      className="flex-shrink-0"
                    >
                      {rec.priority === 'high' && '높음'}
                      {rec.priority === 'medium' && '중간'}
                      {rec.priority === 'low' && '낮음'}
                    </Badge>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-1">{rec.title}</h5>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setShowReport(false)}
          >
            다시 진단하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Product-Market Fit 진단
        </h3>
        <p className="text-gray-600">
          10개의 질문에 답변하여 현재 비즈니스의 PMF 수준을 확인하세요
        </p>
      </div>

      <div className="space-y-6">
        {pmfQuestions.map((question, index) => {
          const answer = answers.find((a) => a.questionId === question.id);

          return (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-base flex items-start gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="flex-1">{question.question}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-2">
                  {question.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswerChange(question.id, option.value)}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        answer?.value === option.value
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!isAllAnswered}
          size="lg"
        >
          진단 결과 보기
        </Button>
      </div>

      {!isAllAnswered && (
        <p className="text-sm text-gray-500 text-center">
          모든 질문에 답변해주세요 ({answers.length}/{pmfQuestions.length})
        </p>
      )}
    </div>
  );
});

PMFSurvey.displayName = 'PMFSurvey';

