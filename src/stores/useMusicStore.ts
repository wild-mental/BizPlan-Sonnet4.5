/**
 * 전역 음악 상태 관리 스토어
 * 사이트 전체에서 BGM 재생/중지를 동기화
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// BGM 트랙 목록
export const BGM_TRACKS = [
  '/assets/soundtrack/bgm1_StepForSuccess_A.mp3',
  '/assets/soundtrack/bgm2_StepForSuccess_B.mp3',
  '/assets/soundtrack/bgm3_BizStartPath_A.mp3',
  '/assets/soundtrack/bgm4_BizStartPath_B.mp3',
];

interface MusicState {
  // 재생 상태
  isPlaying: boolean;
  // 현재 트랙 인덱스
  currentTrackIndex: number;
  // 볼륨 (0-1)
  volume: number;
  // Audio 인스턴스 (persist 제외)
  audioInstance: HTMLAudioElement | null;
  
  // 액션
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  initAudio: () => void;
}

// 싱글톤 Audio 인스턴스 (스토어 외부에서 관리)
let globalAudioInstance: HTMLAudioElement | null = null;

export const useMusicStore = create<MusicState>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      currentTrackIndex: 0,
      volume: 0.3,
      audioInstance: null,

      // Audio 인스턴스 초기화 (브라우저에서만 실행)
      initAudio: () => {
        if (typeof window === 'undefined') return;
        
        if (!globalAudioInstance) {
          const { currentTrackIndex, volume } = get();
          globalAudioInstance = new Audio(BGM_TRACKS[currentTrackIndex]);
          globalAudioInstance.volume = volume;
          globalAudioInstance.loop = false;
          
          // 트랙 종료 시 다음 트랙으로 자동 전환
          globalAudioInstance.addEventListener('ended', () => {
            const state = get();
            const nextIndex = (state.currentTrackIndex + 1) % BGM_TRACKS.length;
            set({ currentTrackIndex: nextIndex });
            
            if (globalAudioInstance) {
              globalAudioInstance.src = BGM_TRACKS[nextIndex];
              if (state.isPlaying) {
                globalAudioInstance.play().catch(() => {});
              }
            }
          });
          
          set({ audioInstance: globalAudioInstance });
        }
        
        return globalAudioInstance;
      },

      // 재생/중지 토글
      togglePlay: () => {
        const { isPlaying, initAudio, volume, currentTrackIndex } = get();
        
        // Audio 인스턴스가 없으면 초기화
        if (!globalAudioInstance) {
          initAudio();
        }
        
        if (!globalAudioInstance) return;
        
        // 현재 트랙과 볼륨 동기화
        if (globalAudioInstance.src !== window.location.origin + BGM_TRACKS[currentTrackIndex]) {
          globalAudioInstance.src = BGM_TRACKS[currentTrackIndex];
        }
        globalAudioInstance.volume = volume;
        
        if (isPlaying) {
          globalAudioInstance.pause();
          set({ isPlaying: false });
        } else {
          globalAudioInstance.play().catch(() => {
            // 자동재생 정책으로 인한 실패 무시
          });
          set({ isPlaying: true });
        }
      },

      // 재생
      play: () => {
        const { initAudio, volume, currentTrackIndex } = get();
        
        if (!globalAudioInstance) {
          initAudio();
        }
        
        if (!globalAudioInstance) return;
        
        globalAudioInstance.src = BGM_TRACKS[currentTrackIndex];
        globalAudioInstance.volume = volume;
        globalAudioInstance.play().catch(() => {});
        set({ isPlaying: true });
      },

      // 중지
      pause: () => {
        if (globalAudioInstance) {
          globalAudioInstance.pause();
        }
        set({ isPlaying: false });
      },

      // 볼륨 설정
      setVolume: (volume: number) => {
        if (globalAudioInstance) {
          globalAudioInstance.volume = volume;
        }
        set({ volume });
      },

      // 다음 트랙
      nextTrack: () => {
        const { currentTrackIndex, isPlaying, volume } = get();
        const nextIndex = (currentTrackIndex + 1) % BGM_TRACKS.length;
        
        set({ currentTrackIndex: nextIndex });
        
        if (globalAudioInstance) {
          globalAudioInstance.src = BGM_TRACKS[nextIndex];
          globalAudioInstance.volume = volume;
          if (isPlaying) {
            globalAudioInstance.play().catch(() => {});
          }
        }
      },
    }),
    {
      name: 'music-storage',
      // audioInstance는 persist에서 제외
      partialize: (state) => ({
        isPlaying: state.isPlaying,
        currentTrackIndex: state.currentTrackIndex,
        volume: state.volume,
      }),
    }
  )
);

