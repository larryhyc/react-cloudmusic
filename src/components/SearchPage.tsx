import { APIURL, IP } from '@/lib/constoct';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Skeleton } from './ui/skeleton';
import { formatDuration } from '@/lib/utils';
import { SongType } from '@/type/globle';
import Image from '@/components/ui/Image';
import useMusicStore from '@/store/useMuisicStore';
import { toast } from 'sonner';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SongType[]>([]);
  const [error, seterror] = useState('');
  const {
    playlist,
    setPlaylist,
    setCurrentSong,
    setIndex,
    playSong,
    setIsPlaying,
  } = useMusicStore();

  useEffect(() => {
    async function init() {
      try {
        if (!name) {
          return;
        }
        seterror('');
        setLoading(true);
        // console.log(name);
        const res = await fetch(
          `${APIURL}/cloudsearch?keywords=${name}?realIP=${IP}`
        );

        const data = await res.json();
        // console.log(data);
        setData(data.result.songs);
        setLoading(false);
      } catch (error) {
        console.log('获取列表失败' + error);
        seterror('获取列表失败');
        setLoading(false);
      }
    }
    init();
  }, [name]);

  const Searchlist = () => {
    // const id = Date.now();

    const chakeSong = async (index: number) => {
      // setPlaylistId(Number(id));
      // if (playlistId !== Number(id)) {
      //   setPlaylist(data);
      // }

      const songId = playlist[index].id;
      try {
        const res = await fetch(
          `${APIURL}/check/music/url?id=${songId}&realIP=${IP}`
        );
        const data = await res.json();
        // console.log(data);
        return data;
      } catch (error) {
        console.error('播放歌曲失败:', error);
      }
    };

    const handlePlaySong = async (index: number) => {
      await setPlaylist(data);
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

    if (loading) {
      return (
        <ul className="w-full flex flex-col space-y-1 overflow-auto">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-full h-13 rounded-xl space-y-2"
            />
          ))}
        </ul>
      );
    }

    if (error != '') {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-xl text-center text-red-500">{error}</p>
        </div>
      );
    }

    return (
      <ul className="overflow-auto scrollbar-hide">
        {data.map((song: SongType, songIndex: number) => (
          <li
            key={song.id}
            onClick={() => handlePlaySong(songIndex)}
            className={`flex flex-row gap-x-2 items-center p-3 rounded-xl cursor-pointer hover:bg-violet-500`}
          >
            <p className="text-sm">
              {songIndex + 1 < 10 ? `0${songIndex + 1}` : songIndex + 1}
            </p>
            <Image src={song.al.picUrl} className="w-10 h-10 rounded-lg" />
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
        ))}
      </ul>
    );
  };

  return (
    // <div className="w-full h-full">
    <ul className="overflow-auto scrollbar-hide w-full h-full">
      {loading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="w-full h-10 rounded-xl" />
          <Skeleton className="w-full h-10 rounded-xl" />
          <Skeleton className="w-full h-10 rounded-xl" />
        </div>
      ) : (
        <Searchlist />
      )}
    </ul>
    // </div>
  );
};

export default SearchPage;
