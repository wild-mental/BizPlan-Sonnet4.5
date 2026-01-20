import apiClient, { ApiResponse } from './apiClient';
import { Template, WizardStep, PMFQuestion } from '../types';

export const templateApi = {
  async getTemplates(): Promise<Template[]> {
    const { data } = await apiClient.get<ApiResponse<Template[]>>('/api/v1/public/templates');
    return data.data ?? [];
  },
  async getWizardSteps(): Promise<WizardStep[]> {
    const { data } = await apiClient.get<ApiResponse<WizardStep[]>>('/api/v1/public/templates/wizard-steps');
    return data.data ?? [];
  },
  async getPmfQuestions(): Promise<PMFQuestion[]> {
    const { data } = await apiClient.get<ApiResponse<PMFQuestion[]>>('/api/v1/public/templates/pmf-questions');
    return data.data ?? [];
  },
};
