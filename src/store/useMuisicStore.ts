// src/store/useMuisicStore.ts
import { create } from 'zustand';
import { SongType } from '@/type/globle';

type PlayMode = 'sequential' | 'random' | 'loop';

interface MusicState {
  currentSong: SongType | null;
  playlist: SongType[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playMode: PlayMode;
  
  setCurrentSong: (song: SongType | null) => void;
  setPlaylist: (songs: SongType[]) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  togglePlayMode: () => void;
  nextSong: () => void;
  prevSong: () => void;
}

const useMusicStore = create<MusicState>((set, get) => ({
  currentSong: null,
  playlist: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  playMode: 'sequential',
  
  setCurrentSong: (song) => set({ currentSong: song }),
  setPlaylist: (songs) => set({ playlist: songs }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  
  togglePlayMode: () => set((state) => ({
    playMode: 
      state.playMode === 'sequential' ? 'random' :
      state.playMode === 'random' ? 'loop' : 'sequential'
  })),
  
  nextSong: () => {
    const { playlist, currentSong, playMode } = get();
    if (!playlist.length || !currentSong) return;
    
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    let nextIndex;
    
    if (playMode === 'random') {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }
    
    set({ 
      currentSong: playlist[nextIndex],
      isPlaying: true,
      currentTime: 0
    });
  },
  
  prevSong: () => {
    const { playlist, currentSong, playMode } = get();
    if (!playlist.length || !currentSong) return;
    
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    let prevIndex;
    
    if (playMode === 'random') {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    }
    
    set({ 
      currentSong: playlist[prevIndex],
      isPlaying: true,
      currentTime: 0
    });
  }
}));

export default useMusicStore;
