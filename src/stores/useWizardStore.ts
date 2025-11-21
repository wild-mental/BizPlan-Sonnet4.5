import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WizardData, WizardStep } from '../types';
import { wizardSteps } from '../types/mockData';

interface WizardState {
  currentStep: number;
  steps: WizardStep[];
  wizardData: WizardData;
  
  setCurrentStep: (step: number) => void;
  updateStepData: (stepId: number, questionId: string, value: any) => void;
  getStepData: (stepId: number) => Record<string, any>;
  isStepCompleted: (stepId: number) => boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  resetWizard: () => void;
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      steps: wizardSteps,
      wizardData: {},

      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      updateStepData: (stepId: number, questionId: string, value: any) => {
        set((state) => ({
          wizardData: {
            ...state.wizardData,
            [stepId]: {
              ...state.wizardData[stepId],
              [questionId]: value,
            },
          },
        }));
      },

      getStepData: (stepId: number) => {
        const state = get();
        return state.wizardData[stepId] || {};
      },

      isStepCompleted: (stepId: number) => {
        const state = get();
        const step = state.steps.find((s) => s.id === stepId);
        if (!step) return false;

        const stepData = state.wizardData[stepId] || {};
        const requiredQuestions = step.questions.filter((q) => q.required);

        return requiredQuestions.every((q) => {
          const value = stepData[q.id];
          if (value === undefined || value === null) return false;
          if (typeof value === 'string' && value.trim() === '') return false;
          return true;
        });
      },

      goToNextStep: () => {
        set((state) => {
          const nextStep = Math.min(state.currentStep + 1, state.steps.length);
          return { currentStep: nextStep };
        });
      },

      goToPreviousStep: () => {
        set((state) => {
          const prevStep = Math.max(state.currentStep - 1, 1);
          return { currentStep: prevStep };
        });
      },

      resetWizard: () => {
        set({ currentStep: 1, wizardData: {} });
      },
    }),
    {
      name: 'wizard-storage',
    }
  )
);

