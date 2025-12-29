/**
 * 파일명: useProjectStore.ts
 * 
 * 파일 용도:
 * 프로젝트 정보 관리를 위한 Zustand Store
 * - 현재 작업 중인 프로젝트 정보 저장
 * - 프로젝트 생성, 수정, 삭제
 * - 자동 저장 상태 관리
 * - API 연동을 통한 프로젝트 관리
 * - localStorage에 자동 영속화
 * 
 * 호출 구조:
 * useProjectStore (이 Store)
 *   ├─> createProject() - ProjectCreate 페이지에서 호출
 *   ├─> updateProject() - 프로젝트 정보 수정 시 호출
 *   ├─> fetchProjects() - 프로젝트 목록 조회
 *   ├─> fetchProject() - 프로젝트 상세 조회
 *   ├─> setSaveStatus() - useAutoSave hook에서 호출
 *   └─> clearProject() - 프로젝트 초기화
 * 
 * 사용하는 컴포넌트:
 * - ProjectCreate: 프로젝트 생성
 * - Layout: 프로젝트명 표시
 * - SaveIndicator: 저장 상태 표시
 * 
 * 영속화:
 * - localStorage 키: 'project-storage'
 * - 브라우저 새로고침 시에도 데이터 유지
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project as LocalProject, TemplateType, SaveStatus } from '../types';
import { projectApi, Project as ApiProject, CreateProjectRequest } from '../services/projectApi';

interface ProjectState {
  /** 프로젝트 목록 */
  projects: ApiProject[];
  /** 현재 작업 중인 프로젝트 */
  currentProject: ApiProject | null;
  /** 저장 상태 ('idle' | 'saving' | 'saved' | 'error') */
  saveStatus: SaveStatus;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  
  /** 프로젝트 목록 조회 */
  fetchProjects: () => Promise<void>;
  /** 프로젝트 상세 조회 */
  fetchProject: (id: string) => Promise<void>;
  /** 새 프로젝트 생성 */
  createProject: (data: CreateProjectRequest) => Promise<ApiProject>;
  /** 프로젝트 정보 업데이트 */
  updateProject: (id: string, data: Partial<CreateProjectRequest>) => Promise<void>;
  /** 프로젝트 삭제 */
  deleteProject: (id: string) => Promise<void>;
  /** 현재 프로젝트 설정 */
  setCurrentProject: (project: ApiProject | null) => void;
  /** 저장 상태 설정 */
  setSaveStatus: (status: SaveStatus) => void;
  /** 프로젝트 초기화 */
  clearProject: () => void;
}

/**
 * useProjectStore
 * 
 * 역할:
 * - 프로젝트 생명주기 관리
 * - 프로젝트 메타데이터 저장
 * - 자동 저장 피드백 제공
 * 
 * 주요 기능:
 * 1. 프로젝트 생성 (이름, 템플릿)
 * 2. 프로젝트 정보 업데이트 (자동으로 updatedAt 갱신)
 * 3. 저장 상태 추적
 * 4. localStorage 자동 영속화
 */
export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      saveStatus: 'idle',
      isLoading: false,
      error: null,

      /**
       * 프로젝트 목록 조회
       */
      fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await projectApi.getAll();
          if (response.data.success && response.data.data) {
            set({ projects: response.data.data, isLoading: false });
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.error?.message || '프로젝트 목록을 불러오는데 실패했습니다',
            isLoading: false,
          });
        }
      },

      /**
       * 프로젝트 상세 조회
       */
      fetchProject: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await projectApi.getById(id);
          if (response.data.success && response.data.data) {
            set({ currentProject: response.data.data, isLoading: false });
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.error?.message || '프로젝트를 불러오는데 실패했습니다',
            isLoading: false,
          });
        }
      },

      /**
       * 새 프로젝트 생성
       * - API를 통한 프로젝트 생성
       * 
       * @param {CreateProjectRequest} data - 프로젝트 생성 데이터
       * @returns {Promise<ApiProject>} 생성된 프로젝트
       */
      createProject: async (data: CreateProjectRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await projectApi.create(data);
          if (response.data.success && response.data.data) {
            const newProject = response.data.data;
            set((state) => ({
              projects: [...state.projects, newProject],
              currentProject: newProject,
              isLoading: false,
            }));
            return newProject;
          }
          throw new Error('프로젝트 생성 실패');
        } catch (error: any) {
          set({
            error: error.response?.data?.error?.message || '프로젝트 생성에 실패했습니다',
            isLoading: false,
          });
          throw error;
        }
      },

      /**
       * 프로젝트 정보 업데이트
       * - API를 통한 프로젝트 수정
       * 
       * @param {string} id - 프로젝트 ID
       * @param {Partial<CreateProjectRequest>} data - 업데이트할 필드들
       */
      updateProject: async (id: string, data: Partial<CreateProjectRequest>) => {
        try {
          const response = await projectApi.update(id, data);
          if (response.data.success && response.data.data) {
            set((state) => ({
              projects: state.projects.map((p) =>
                p.id === id ? response.data.data! : p
              ),
              currentProject:
                state.currentProject?.id === id ? response.data.data : state.currentProject,
            }));
          }
        } catch (error: any) {
          set({ error: error.response?.data?.error?.message });
          throw error;
        }
      },

      /**
       * 프로젝트 삭제
       */
      deleteProject: async (id: string) => {
        try {
          await projectApi.delete(id);
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
            currentProject: state.currentProject?.id === id ? null : state.currentProject,
          }));
        } catch (error: any) {
          set({ error: error.response?.data?.error?.message });
          throw error;
        }
      },

      /**
       * 현재 프로젝트 설정
       */
      setCurrentProject: (project) => set({ currentProject: project }),

      /**
       * 저장 상태 설정
       * - SaveIndicator 컴포넌트에서 표시
       * 
       * @param {SaveStatus} status - 저장 상태
       */
      setSaveStatus: (status: SaveStatus) => {
        set({ saveStatus: status });
      },

      /**
       * 프로젝트 초기화
       * - 현재 프로젝트 삭제
       * - 저장 상태 리셋
       */
      clearProject: () => {
        set({ currentProject: null, saveStatus: 'idle' });
      },
    }),
    {
      name: 'project-storage',
      partialize: (state) => ({
        currentProject: state.currentProject,
        saveStatus: state.saveStatus,
      }),
    }
  )
);

