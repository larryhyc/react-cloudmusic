import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserState {
  userId: number | null;
  nickname: string | null;
  avatarUrl: string | null;
  createTime: number | null;
  cookie: string | null;

  setUserId: (userId: number) => void;
  setNickname: (nickname: string) => void;
  setAvatarUrl: (avatarUrl: string) => void;
  setCreateTime: (createTime: number) => void;
  setCookie: (cookie: string) => void;
}
const useUserStore = create<UserState>(
  devtools((set) => ({
    userId: null,
    nickname: null,
    avatarUrl: null,
    createTime: null,
    cookie: localStorage.getItem('cloundmusic') || null,

    setUserId: (userId: number) => set({ userId }),
    setNickname: (nickname: string) => set({ nickname }),
    setAvatarUrl: (avatarUrl: string) => set({ avatarUrl }),
    setCreateTime: (createTime: number) => set({ createTime }),
    setCookie: (cookie: string | null) => set({ cookie }),
  }))
);

export default useUserStore;
