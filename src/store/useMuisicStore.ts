// src/store/useMusicStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SongType } from '@/type/globle';
import { APIURL } from '@/lib/constoct';

interface MusicState {
  // 状态
  // 歌曲索引
  index: number | null;
  // 当前要播放的歌曲
  currentSong: SongType | null;
  // 当前播放歌曲的url
  url: string;
  // 歌曲列表
  playlist: SongType[];
  // 是否播放
  isPlaying: boolean;
  // 当前播放时长
  currentTime: number;
  // 总时长
  duration: number;
  // 音量
  volume: number;

  // 操作
  // 设置索引
  setIndex: (index: number) => void;
  // 设置当前播放歌曲
  setCurrentSong: (index: number) => void;
  // 设置播放列表
  setPlaylist: (playlist: SongType[]) => void;
  // 设置是否播放
  setIsPlaying: (playing: boolean) => void;
  // 设置当前播放时长
  setCurrentTime: (time: number) => void;
  // 设置总时长
  setDuration: (duration: number) => void;
  // 设置音量
  setVolume: (volume: number) => void;
  // 播放歌曲
  playSong: () => void;
}

const useMusicStore = create<MusicState>(
  devtools((set, get) => ({
    index: null,
    currentSong: null,
    url: '',
    playlist: [],
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.5,

    setIndex: (index: number) => set({ index }),
    setPlaylist: (playlist: SongType[]) => set({ playlist }),
    // 发送请求获取歌曲的url
    setCurrentSong: async (index: number) => {
      const { playlist } = get();
      const currentSong = playlist[index];
      const res = await fetch(
        `${APIURL}/song/url/v1?id=${currentSong.id}&level=lossless`
      );
      const data = await res.json();
      const url = data.data?.[0]?.url || '';
      set({ currentSong, url, index });
    },
    setIsPlaying: (isPlaying?: boolean) => set({ isPlaying: isPlaying }),
    setCurrentTime: (time: number) => {
      // 直接设置当前时间（单位：秒）
      set({ currentTime: time });
    },
    setDuration: (duration: number) => set({ duration }),
    setVolume: (volume: number) => {
      // 限制音量在0-1之间
      const clampedVolume = Math.max(0, Math.min(1, volume));
      set({ volume: clampedVolume });
    },
    playSong: () => {
      const { url, isPlaying } = get();
      const audio = document.querySelector('audio');
      if (audio && url) {
        audio.src = url;
        if (!isPlaying) {
          audio.play();
          set({ isPlaying: true });
        }
      }
    },
  }))
);

export default useMusicStore;
