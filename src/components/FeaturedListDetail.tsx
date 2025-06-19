import { useParams, useSearchParams } from 'react-router-dom';
import { APIURL, IP } from '@/lib/constoct';
import { useEffect, useState } from 'react';
import Image from '@/components/ui/Image';

import { Skeleton } from '@/components/ui/skeleton';
import useMusicStore from '@/store/useMuisicStore';
import { formatDuration } from '@/lib/utils';
import { SongType } from '@/type/globle';
import { toast } from 'sonner';

const PlayList = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const imgUrl = searchParams.get('img');
  const playListName = searchParams.get('name');
  const timer = searchParams.get('createTime');
  const [loading, setLoading] = useState(true);
  const [createTime, setCreateTime] = useState('');
  const [thislist, setTishlist] = useState<SongType[]>([]);
  const {
    playlistId,
    playlist,
    setPlaylist,
    setCurrentSong,
    setIndex,
    playSong,
    setIsPlaying,
    setPlaylistId,
  } = useMusicStore();

  const getCreateTime = (createTime: number) => {
    const date = new Date(createTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  };

  const chakeSong = async (index: number) => {
    setPlaylistId(Number(id));
    if (playlistId !== Number(id)) {
      setPlaylist(thislist);
    }

    const songId = playlist[index].id;
    try {
      const res = await fetch(
        `${APIURL}/check/music/url?id=${songId}&realIP=${IP}`
      );
      const data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('播放歌曲失败:', error);
    }
  };

  const handlePlaySong = async (index: number) => {
    const res = await chakeSong(index);
    if (res.success) {
      try {
        setIsPlaying(false);
        await setIndex(index);
        setCurrentSong(index);
        playSong();
      } catch (error) {
        console.error('播放歌曲失败:', error);
      }
    } else {
      handlePlaySong(index + 1);
      toast.error('暂无版权，以为你播放下一首');
    }
  };

  const getPlaylist = async (id: string) => {
    try {
      const res = await fetch(`${APIURL}/playlist/track/all?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await res.json();
      return data.songs;
    } catch (error) {
      console.error('获取歌单失败:', error);
    }
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      const data = await await getPlaylist(id!);
      // setPlaylist(data);
      setTishlist(data);
      setCreateTime(getCreateTime(Number(timer)!));
      setLoading(false);
    }
    init();
  }, [id, imgUrl, playListName, timer]);

  return (
    <div className="w-full h-full flex flex-col gap-y-3">
      {loading ? (
        <DetialLoading />
      ) : (
        <>
          <div className="flex flex-row w-full h-42 gap-x-7">
            <Image src={imgUrl!} cover className="rounded-2xl w-42 h-42" />
            <div className="flex flex-col h-full space-y-3">
              <h2 className="text-xl font-bold text-violet-500 whitespace-nowrap">
                {playListName}
              </h2>
              <p className="text-sm text-gray-400">创建日期: {createTime}</p>
              <p className="text-sm text-gray-400">
                歌曲数量: {playlist.length}
              </p>
            </div>
          </div>
          <ul className="w-full flex-1  flex-col space-y-1 overflow-auto scrollbar-hide">
            {thislist.map((song: SongType, i: number) => {
              const songIndex = i + 1;
              return (
                <li
                  key={song.id}
                  onClick={() => handlePlaySong(i)}
                  className={`flex flex-row gap-x-2 items-center p-3 rounded-xl cursor-pointer hover:bg-violet-500`}
                >
                  <p className="text-sm">
                    {songIndex < 10 ? `0${songIndex}` : songIndex}
                  </p>
                  <Image
                    src={song.al.picUrl}
                    className="w-10 h-10 rounded-lg"
                  />
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm">{song.name}</p>
                    <p className="text-xs">
                      {song.ar.map((ar) => ar.name).join(' / ')}
                    </p>
                  </div>
                  <div className="text-md text-end flex-1 ">
                    {formatDuration(song.dt)}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

const DetialLoading = () => {
  return (
    <>
      <div className="flex flex-row w-full h-42 gap-x-7">
        <Skeleton className="w-42 h-42 rounded-2xl" />
        <div className="flex-1 flex-col h-full space-y-3">
          <h2 className="text-xl font-bold text-violet-500 whitespace-nowrap">
            <Skeleton className="w-50 h-7 rounded-2xl" />
          </h2>
          <p className="text-sm text-gray-400">
            <Skeleton className="w-30 h-4 rounded-2xl" />
          </p>
          <p className="text-sm text-gray-400">
            <Skeleton className="w-20 h-4 rounded-2xl" />
          </p>
        </div>
      </div>
      <ul className="w-full flex flex-col space-y-1 overflow-auto">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-13 rounded-xl space-y-2" />
        ))}
      </ul>
    </>
  );
};

const FeaturedListDetail = () => {
  return (
    <div className="w-full h-full overflow-auto">
      {/* <ScrollArea className='scroll-croll-area'> */}
      <PlayList />
      {/* </ScrollArea> */}
    </div>
  );
};

export default FeaturedListDetail;
