/**
 * 파일명: useProjectStore.ts
 * 
 * 파일 용도:
 * 프로젝트 정보 관리를 위한 Zustand Store
 * - 현재 작업 중인 프로젝트 정보 저장
 * - 프로젝트 생성, 수정, 삭제
 * - 자동 저장 상태 관리
 * - localStorage에 자동 영속화
 * 
 * 호출 구조:
 * useProjectStore (이 Store)
 *   ├─> createProject() - ProjectCreate 페이지에서 호출
 *   ├─> updateProject() - 프로젝트 정보 수정 시 호출
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
import { Project, TemplateType, SaveStatus } from '../types';

interface ProjectState {
  /** 현재 작업 중인 프로젝트 */
  currentProject: Project | null;
  /** 저장 상태 ('idle' | 'saving' | 'saved' | 'error') */
  saveStatus: SaveStatus;
  
  /** 새 프로젝트 생성 */
  createProject: (name: string, templateId: TemplateType) => void;
  /** 프로젝트 정보 업데이트 */
  updateProject: (updates: Partial<Project>) => void;
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
    (set) => ({
      currentProject: null,
      saveStatus: 'idle',

      /**
       * 새 프로젝트 생성
       * - 고유 ID 자동 생성 (타임스탬프 기반)
       * - 생성/수정 시간 기록
       * 
       * @param {string} name - 프로젝트 이름
       * @param {TemplateType} templateId - 선택한 템플릿 ID
       */
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

      /**
       * 프로젝트 정보 업데이트
       * - 자동으로 updatedAt 갱신
       * 
       * @param {Partial<Project>} updates - 업데이트할 필드들
       */
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
    }
  )
);

