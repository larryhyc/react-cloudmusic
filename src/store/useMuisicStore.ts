// src/store/useMusicStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SongType, isInUrl } from '@/type/globle';
import { APIURL } from '@/lib/constoct';

type PlayMode = 'sequential' | 'random' | 'loop';

interface MusicState {
  // 状态
  index: number;
  currentSong: SongType | null;
  playlist: SongType[];
  isInUrl: isInUrl | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playMode: PlayMode;
  message: string;
  songCache: Record<string, SongType>;

  // 操作方法
  setIndex: (index: number) => void;
  fetchCurrentSong: (index: number) => Promise<void>;
  chakedSong: (id: number) => Promise<isInUrl>;
  setCurrentSong: (song: SongType | null) => void;
  setPlaylist: (songs: SongType[]) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  togglePlayMode: () => void;
  nextSong: () => Promise<void>;
  prevSong: () => Promise<void>;
  clearError: () => void;
}

const useMusicStore = create<MusicState>()(
  devtools(
    (set, get) => ({
      // 初始状态
      index: 0,
      currentSong: null,
      playlist: [],
      isInUrl: null,
      isPlaying: false,
      isLoading: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      playMode: 'sequential',
      message: '',
      songCache: {},

      // 基础操作方法

      // 设置当前歌曲索引
      setIndex: (index) => set({ index }, false, 'setIndex'),
      // 设置播放列表
      // 检查歌曲url是否存在
      chakedSong: async (id: number): Promise<void> => {
        try {
          const res = await fetch(`${APIURL}/check/music/url?id=${id}`);
          const data = await res.json();
          set({ isInUrl: data }, false, 'chakedSong');
        } catch (error) {
          console.error('检查歌曲失败:', error);
          const errorResult = { success: false, message: '检查歌曲失败' };
          set({ isInUrl: errorResult }, false, 'chakedSongError');
        }
      },

      // 获取当前歌曲URL并设置
      fetchCurrentSong: async () => {
        const { playlist, songCache, isInUrl, index } = get();
        const song = playlist[index];
        if (!song) return;

        set({ isLoading: true }, false, 'startLoading');

        try {
          // 获取歌曲URL
          const res = await fetch(
            `${APIURL}/song/url/v1?id=${song.id}&level=exhigh`
          );
          const data = await res.json();

          if (!data?.data?.[0]?.url) {
            throw new Error('无效的歌曲URL数据');
          }

          const songWithUrl = { ...song, url: data.data[0].url };

          set(
            {
              currentSong: songWithUrl,
              isPlaying: true,
              currentTime: 0,
              isInUrl: isInUrl,
              message: '',
              songCache: { ...songCache, [song.id]: songWithUrl },
              isLoading: false,
            },
            false,
            'fetchCurrentSong'
          );
        } catch (error) {
          console.error('获取歌曲URL失败:', error);
          set(
            {
              isInUrl: null,
              message: '获取歌曲URL失败',
              isPlaying: false,
              isLoading: false,
            },
            false,
            'fetchCurrentSongError'
          );
        }
      },

      // 设置当前歌曲
      setCurrentSong: (song) =>
        set({ currentSong: song }, false, 'setCurrentSong'),

      // 设置播放列表
      setPlaylist: (songs) => {
        const { currentSong } = get();
        const shouldStop =
          currentSong && !songs.some((s) => s.id === currentSong.id);

        set(
          {
            playlist: songs,
            isPlaying: shouldStop ? false : get().isPlaying,
            currentSong: shouldStop ? null : currentSong,
          },
          false,
          'setPlaylist'
        );
      },

      // 播放控制
      play: () => set({ isPlaying: true }, false, 'play'),
      pause: () => set({ isPlaying: false }, false, 'pause'),
      togglePlay: () =>
        set((state) => ({ isPlaying: !state.isPlaying }), false, 'togglePlay'),

      // 播放进度控制
      setCurrentTime: (time) =>
        set({ currentTime: time }, false, 'setCurrentTime'),
      setDuration: (duration) => set({ duration }, false, 'setDuration'),
      setVolume: (volume) => set({ volume }, false, 'setVolume'),

      // 切换播放模式
      togglePlayMode: () =>
        set(
          (state) => ({
            playMode:
              state.playMode === 'sequential'
                ? 'random'
                : state.playMode === 'random'
                ? 'loop'
                : 'sequential',
          }),
          false,
          'togglePlayMode'
        ),

      // 下一首
      nextSong: async () => {
        const { playlist, currentSong, playMode, index } = get();
        if (!playlist.length || !currentSong) return;

        const currentIndex = playlist.findIndex(
          (song) => song.id === currentSong.id
        );
        let nextIndex = index;

        if (playMode === 'random') {
          nextIndex = Math.floor(Math.random() * playlist.length);
        } else {
          nextIndex = (currentIndex + 1) % playlist.length;
        }

        await get().fetchCurrentSong(nextIndex);
      },

      // 上一首
      prevSong: async () => {
        const { playlist, currentSong, playMode } = get();
        if (!playlist.length || !currentSong) return;

        const currentIndex = playlist.findIndex(
          (song) => song.id === currentSong.id
        );
        let prevIndex;

        if (playMode === 'random') {
          prevIndex = Math.floor(Math.random() * playlist.length);
        } else {
          prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        }

        await get().fetchCurrentSong(prevIndex);
      },

      // 清除错误信息
      clearError: () =>
        set({ message: '', isInUrl: null }, false, 'clearError'),
    }),
    {
      name: 'music-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export default useMusicStore;
