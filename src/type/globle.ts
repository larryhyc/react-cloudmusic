/**
 * 获取精品歌单类型
 */
export type FeaturedListType = {
  name: string;
  id: number;
  trackNumberUpdateTime: number;
  status: number;
  userId: number;
  createTime: number;
  updateTime: number;
  subscribedCount: number;
  trackCount: number;
  cloudTrackCount: number;
  coverImgUrl: string;
  coverImgId: number;
};

/**
 * 获取歌单标签列表类型
 */
export type TagsType = {
  id: number;
  name: string;
  type: number;
  category: number;
  hot: boolean;
};

/**
 * 获取歌曲类型
 */
export type SongType = {
  id: number;
  name: string;
  ar: [
    {
      id: number;
      name: string;
    }
  ];
  al: {
    id: number;
    name: string;
    picUrl: string;
  };
  dt: number;
  url?: string;
};

export type chakedSongType = {
  code: number;
  success: boolean;
  message: string;
};

export type isInUrl = {
  success: boolean;
  message: string;
};

export type myPlayListType = {
  id: number;
  name: string;
  coverImgUrl: string;
  playCount: number;
  createTime: number;
};

export type myPlayListSiderType = {
  title: string;
  url: string;
  img?: string;
};
