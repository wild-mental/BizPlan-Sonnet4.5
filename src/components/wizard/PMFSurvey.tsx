import React, { useState } from 'react';
import { usePMFStore } from '../../stores/usePMFStore';
import { pmfQuestions } from '../../types/mockData';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '../ui';
import { Progress } from '../ui';
import { CheckCircle2, AlertCircle, TrendingUp, Target } from 'lucide-react';

export const PMFSurvey: React.FC = () => {
  const { answers, report, updateAnswer, generateReport } = usePMFStore();
  const [showReport, setShowReport] = useState(false);

  const handleAnswerChange = (questionId: string, value: number) => {
    updateAnswer(questionId, value);
  };

  const handleSubmit = () => {
    generateReport();
    setShowReport(true);
  };

  const isAllAnswered = answers.length === pmfQuestions.length;

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
          <Progress value={report.score} max={100} className="h-3" />
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
};

