# [#002] useCallback을 이벤트 핸들러에 적용

## 📌 Status
`🔲 Todo`

## 🏷️ Labels
`performance` `optimization` `priority-1`

## 📝 Description

현재 이벤트 핸들러 함수들이 매 렌더링마다 새로 생성되어 자식 컴포넌트의 불필요한 리렌더링을 유발합니다. useCallback을 사용하여 함수 참조를 유지해야 합니다.

## 🎯 Goal

이벤트 핸들러 함수의 재생성을 방지하여 자식 컴포넌트의 불필요한 리렌더링을 **40% 감소**시킵니다.

## 📋 Tasks

### 1. QuestionForm 컴포넌트

- [ ] `handleChange` 함수에 useCallback 적용
- [ ] `handleBlur` 함수에 useCallback 적용 (있는 경우)

### 2. FinancialSimulation 컴포넌트

- [ ] 입력 필드 onChange 핸들러에 useCallback 적용
- [ ] 차트 관련 이벤트 핸들러에 useCallback 적용

### 3. PMFSurvey 컴포넌트

- [ ] 설문 응답 핸들러에 useCallback 적용
- [ ] 제출 핸들러에 useCallback 적용

### 4. WizardStep 컴포넌트

- [ ] `handleNext` 함수에 useCallback 적용
- [ ] `handlePrevious` 함수에 useCallback 적용

### 5. BusinessPlanViewer 컴포넌트

- [ ] `handleGenerate` 함수에 useCallback 적용
- [ ] `handleRegenerate` 함수에 useCallback 적용
- [ ] `handleDownloadPDF` 함수에 useCallback 적용

### 6. ProjectCreate 컴포넌트

- [ ] `handleSubmit` 함수에 useCallback 적용
- [ ] `handleTemplateSelect` 함수에 useCallback 적용

## 💡 Implementation Example

### Before

```typescript
// src/components/wizard/QuestionForm.tsx
export const QuestionForm: React.FC<QuestionFormProps> = ({ questions, stepId }) => {
  const { updateStepData, getStepData } = useWizardStore();
  
  // ❌ 매 렌더링마다 새로운 함수 생성
  const handleChange = (questionId: string, value: any) => {
    updateStepData(stepId, questionId, value);
  };

  return questions.map((question) => (
    <Input 
      key={question.id}
      onChange={(e) => handleChange(question.id, e.target.value)}
    />
  ));
};
```

### After

```typescript
// src/components/wizard/QuestionForm.tsx
export const QuestionForm: React.FC<QuestionFormProps> = ({ questions, stepId }) => {
  const { updateStepData, getStepData } = useWizardStore();
  
  // ✅ 의존성이 변경될 때만 함수 재생성
  const handleChange = useCallback((questionId: string, value: any) => {
    updateStepData(stepId, questionId, value);
  }, [stepId, updateStepData]);

  // ✅ 각 Input의 onChange도 메모이제이션
  const createOnChangeHandler = useCallback((questionId: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(questionId, e.target.value);
    };
  }, [handleChange]);

  return questions.map((question) => (
    <Input 
      key={question.id}
      onChange={createOnChangeHandler(question.id)}
    />
  ));
};
```

### Alternative: Inline useCallback (간단한 경우)

```typescript
const handleSubmit = useCallback((e: React.FormEvent) => {
  e.preventDefault();
  if (!projectName.trim()) {
    setError('프로젝트 이름을 입력해주세요.');
    return;
  }
  createProject(projectName, selectedTemplate);
  navigate(`/wizard/${projectId}/1`);
}, [projectName, selectedTemplate, createProject, navigate, projectId]);
```

## ⚠️ Considerations

1. **의존성 배열 정확히 명시**: ESLint exhaustive-deps 규칙 준수
2. **Zustand Store 함수**: Store의 action 함수는 안정적인 참조를 가지므로 의존성에 포함해도 안전
3. **과도한 사용 지양**: 간단한 컴포넌트나 최적화가 불필요한 곳에는 적용하지 않음
4. **React.memo와 함께 사용**: 자식 컴포넌트가 React.memo로 감싸져 있어야 효과 극대화

## 🔗 Related Issues

- #001 - React.memo 적용 (자식 컴포넌트 최적화)
- #003 - useMemo 적용 (계산값 최적화)

## 📚 References

- [useCallback 공식 문서](https://react.dev/reference/react/useCallback)
- [Kent C. Dodds - When to use useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)
- [React Performance Optimization](https://react.dev/learn/render-and-commit#optimizing-performance)

## ✅ Acceptance Criteria

- [ ] 모든 이벤트 핸들러에 useCallback 적용
- [ ] 의존성 배열이 정확히 명시됨
- [ ] ESLint exhaustive-deps 경고 없음
- [ ] React DevTools Profiler로 성능 개선 확인
- [ ] 함수 재생성으로 인한 리렌더링이 40% 이상 감소

## ⏱️ Estimated Time

**1일** (8시간)
- QuestionForm & FinancialSimulation: 3시간
- PMFSurvey & WizardStep: 2시간
- BusinessPlanViewer & ProjectCreate: 2시간
- 테스트 및 검증: 1시간

## 👤 Assignee

_To be assigned_

## 📅 Timeline

- **Start Date**: TBD
- **Due Date**: TBD
- **Completed Date**: -

## 💬 Notes

이 작업은 #001 (React.memo)과 함께 적용될 때 최대 효과를 발휘합니다. 가능하면 동시에 진행하거나 순차적으로 바로 이어서 작업하는 것을 권장합니다.

