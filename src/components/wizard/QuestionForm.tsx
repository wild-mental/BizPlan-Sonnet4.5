import React, { useEffect } from 'react';
import { useWizardStore } from '../../stores/useWizardStore';
import { useAutoSave } from '../../hooks/useAutoSave';
import { Question } from '../../types';
import { Input, Textarea } from '../ui';

interface QuestionFormProps {
  questions: Question[];
  stepId: number;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ questions, stepId }) => {
  const { updateStepData, getStepData } = useWizardStore();
  const stepData = getStepData(stepId);

  // Auto-save
  useAutoSave(stepData, 1000);

  const handleChange = (questionId: string, value: any) => {
    updateStepData(stepId, questionId, value);
  };

  return (
    <div className="space-y-6">
      {questions.map((question) => {
        const value = stepData[question.id] || '';

        switch (question.type) {
          case 'text':
            return (
              <Input
                key={question.id}
                label={question.label}
                placeholder={question.placeholder}
                value={value}
                onChange={(e) => handleChange(question.id, e.target.value)}
                required={question.required}
                helperText={question.description}
              />
            );

          case 'textarea':
            return (
              <Textarea
                key={question.id}
                label={question.label}
                placeholder={question.placeholder}
                value={value}
                onChange={(e) => handleChange(question.id, e.target.value)}
                required={question.required}
                helperText={question.description}
                rows={6}
              />
            );

          case 'number':
            return (
              <Input
                key={question.id}
                type="number"
                label={question.label}
                placeholder={question.placeholder}
                value={value}
                onChange={(e) => handleChange(question.id, parseFloat(e.target.value) || 0)}
                required={question.required}
                helperText={question.description}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

