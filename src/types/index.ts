// Template Types
export type TemplateType = 'pre-startup' | 'early-startup' | 'bank-loan';

export interface Template {
  id: TemplateType;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

// Project Types
export interface Project {
  id: string;
  name: string;
  templateId: TemplateType;
  createdAt: string;
  updatedAt: string;
  currentStep: number;
  isCompleted: boolean;
}

// Wizard Step Types
export type StepStatus = 'pending' | 'in-progress' | 'completed';

export interface WizardStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: StepStatus;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox';
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface Answer {
  questionId: string;
  value: string | number | boolean | string[];
}

export interface WizardData {
  [stepId: number]: {
    [questionId: string]: any;
  };
}

// Financial Types
export interface FinancialInput {
  customers: number;
  pricePerCustomer: number;
  cac: number;
  fixedCosts: number;
  variableCostRate: number;
  churnRate: number;
  ltv?: number;
}

export interface FinancialMetrics {
  revenue: number;
  totalCosts: number;
  profit: number;
  ltv: number;
  ltvCacRatio: number;
  breakEvenPoint: number;
}

export interface ChartDataPoint {
  month: number;
  revenue: number;
  costs: number;
  profit: number;
}

// PMF Survey Types
export interface PMFQuestion {
  id: string;
  question: string;
  options: {
    value: number;
    label: string;
  }[];
}

export interface PMFAnswer {
  questionId: string;
  value: number;
}

export interface PMFReport {
  score: number;
  level: 'low' | 'medium' | 'high' | 'excellent';
  risks: Risk[];
  recommendations: Recommendation[];
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

// AI Draft Types
export interface DraftSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface BusinessPlan {
  id: string;
  projectId: string;
  sections: DraftSection[];
  generatedAt: string;
}

// Save Status Types
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
