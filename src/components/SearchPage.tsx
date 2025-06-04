import { APIURL, IP } from '@/lib/constoct';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Skeleton } from './ui/skeleton';
import { formatDuration } from '@/lib/utils';
import { SongType } from '@/type/globle';
import Image from '@/components/ui/Image';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, seterror] = useState('');

  useEffect(() => {
    async function init() {
      try {
        if (!name) {
          return;
        }
        seterror('');
        setLoading(true);
        const res = await fetch(
          `${APIURL}/cloudsearch?keywords=${name}?realIP=${IP}`
        );

        const data = await res.json();
        console.log(data);
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
            // onClick={() => handlePlaySong(i)}
            className={`flex flex-row gap-x-2 2xl:gap-5 items-center p-3 rounded-xl cursor-pointer hover:bg-violet-500`}
          >
            <p className="text-sm 2xl:text-2xl">
              {songIndex + 1 < 10 ? `0${songIndex + 1}` : songIndex + 1}
            </p>
            <Image src={song.al.picUrl} className="w-10 h-10 rounded-lg" />
            <div className="flex flex-col space-y-1">
              <p className="text-sm 2xl:text-2xl ">{song.name}</p>
              <p className="text-xs 2xl:text-2x">
                {song.ar.map((ar) => ar.name).join(' / ')}
              </p>
            </div>
            <div className="text-md 2xl:text-2xl text-end flex-1 ">
              {formatDuration(song.dt)}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full h-full">
      <ul className="overflow-auto scrollbar-hide">
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
    </div>
  );
};

export default SearchPage;
