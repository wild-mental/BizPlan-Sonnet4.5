import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, TemplateType, SaveStatus } from '../types';

interface ProjectState {
  currentProject: Project | null;
  saveStatus: SaveStatus;
  
  createProject: (name: string, templateId: TemplateType) => void;
  updateProject: (updates: Partial<Project>) => void;
  setSaveStatus: (status: SaveStatus) => void;
  clearProject: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      currentProject: null,
      saveStatus: 'idle',

      createProject: (name: string, templateId: TemplateType) => {
        const newProject: Project = {
          id: `project-${Date.now()}`,
          name,
          templateId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          currentStep: 1,
          isCompleted: false,
        };
        set({ currentProject: newProject });
      },

      updateProject: (updates: Partial<Project>) => {
        set((state) => {
          if (!state.currentProject) return state;
          return {
            currentProject: {
              ...state.currentProject,
              ...updates,
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      setSaveStatus: (status: SaveStatus) => {
        set({ saveStatus: status });
      },

      clearProject: () => {
        set({ currentProject: null, saveStatus: 'idle' });
      },
    }),
    {
      name: 'project-storage',
    }
  )
);

