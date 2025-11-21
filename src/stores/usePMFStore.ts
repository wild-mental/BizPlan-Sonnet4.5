import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PMFAnswer, PMFReport } from '../types';
import { mockRisks, mockRecommendations } from '../types/mockData';

interface PMFState {
  answers: PMFAnswer[];
  report: PMFReport | null;
  
  updateAnswer: (questionId: string, value: number) => void;
  generateReport: () => void;
  reset: () => void;
}

export const usePMFStore = create<PMFState>()(
  persist(
    (set, get) => ({
      answers: [],
      report: null,

      updateAnswer: (questionId: string, value: number) => {
        set((state) => {
          const existingIndex = state.answers.findIndex((a) => a.questionId === questionId);
          
          if (existingIndex >= 0) {
            const newAnswers = [...state.answers];
            newAnswers[existingIndex] = { questionId, value };
            return { answers: newAnswers };
          } else {
            return { answers: [...state.answers, { questionId, value }] };
          }
        });
      },

      generateReport: () => {
        const { answers } = get();
        
        // Calculate average score
        const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0);
        const averageScore = answers.length > 0 ? totalScore / answers.length : 0;
        const score = Math.round((averageScore / 5) * 100);

        // Determine level
        let level: 'low' | 'medium' | 'high' | 'excellent';
        if (score >= 85) level = 'excellent';
        else if (score >= 70) level = 'high';
        else if (score >= 50) level = 'medium';
        else level = 'low';

        // Filter risks and recommendations based on score
        const risks = score < 70 ? mockRisks : mockRisks.slice(0, 2);
        const recommendations = mockRecommendations;

        const report: PMFReport = {
          score,
          level,
          risks,
          recommendations,
        };

        set({ report });
      },

      reset: () => {
        set({ answers: [], report: null });
      },
    }),
    {
      name: 'pmf-storage',
    }
  )
);

