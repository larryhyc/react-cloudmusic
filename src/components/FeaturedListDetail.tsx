import { useParams, useSearchParams } from 'react-router-dom';
import { APIURL } from '@/lib/constoct';
import { useEffect, useMemo, useState } from 'react';
import Image from '@/components/ui/Image';
import { SongType } from '@/type/globle';
import { Skeleton } from '@/components/ui/skeleton';
import Pagin from './Pagin';
import useMusicStore from '@/store/useMuisicStore';
import { formatDuration } from '@/lib/utils';

const PlayList = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const imgUrl = searchParams.get('img');
  const playListName = searchParams.get('name');
  const timer = searchParams.get('createTime');
  const [loading, setLoading] = useState(true);
  const [createTime, setCreateTime] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const itemsPerPage = 5; // 每页显示5条数据
  const {
    playlist: allsongs,
    isInUrl,
    setPlaylist,
    fetchCurrentSong,
    chakedSong,
    setIndex,
    nextSong,
  } = useMusicStore();

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return allsongs.slice(start, start + itemsPerPage);
  }, [allsongs, currentPage, itemsPerPage]);

  const getCreateTime = (createTime: number) => {
    const date = new Date(createTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  };

  const handlePlaySong = async (index: number) => {
    try {
      setIndex(index);
      await chakedSong(index);
      await fetchCurrentSong(index);
      if (!isInUrl!.success) {
        console.log(isInUrl?.message);
        alert(`${isInUrl!.message}`);
      } else {
        setIndex(index + 1);
        nextSong();
      }
    } catch (error) {
      console.error('获取歌曲失败:', error);
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
      console.log(data);
      return data.songs;
    } catch (error) {
      console.error('获取歌单失败:', error);
    }
  };

  useEffect(() => {
    async function init() {
      const data = await await getPlaylist(id!);
      setPlaylist(data);
      // console.log(allsongs);
      setCreateTime(getCreateTime(Number(timer)!));
      setLoading(false);
      setTotalItems(data.length);
    }
    init();
  }, [id]);

  return (
    <div className="w-full h-full flex flex-col gap-y-3">
      <div className="flex flex-row w-full h-42 2xl:h-80 gap-x-7">
        <Image
          src={imgUrl!}
          cover
          className="rounded-2xl w-42 h-42 2xl:w-80 2xl:h-80"
        />
        <div className="flex-1 flex-col h-full space-y-3">
          <h2 className="text-xl 2xl:text-4xl font-bold text-violet-500 whitespace-nowrap">
            {playListName}
          </h2>
          <p className="text-sm text-gray-400 2xl:text-2xl">
            创建日期: {createTime}
          </p>
          <p className="text-sm text-gray-400 2xl:text-2xl">
            歌曲数量: {allsongs.length}
          </p>
        </div>
      </div>
      {loading ? (
        <DetialLoading />
      ) : (
        <>
          <ul className="w-full flex-1  flex-col space-y-1 overflow-auto">
            {currentPageData.map((song, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
              const songInxex = globalIndex - 1;
              return (
                <li
                  key={song.id}
                  onClick={() => handlePlaySong(songInxex)}
                  className="flex flex-row gap-x-2 2xl:gap-5 items-center p-3 rounded-xl cursor-pointer hover:bg-violet-500"
                >
                  <p className="text-sm 2xl:text-2xl">
                    {globalIndex < 10 ? `0${globalIndex}` : globalIndex}
                  </p>
                  <Image
                    src={song.al.picUrl}
                    className="w-10 h-10 rounded-lg 2xl:w-20 2xl:h-40"
                  />
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
              );
            })}
          </ul>
          <div className="w-full">
            <Pagin
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              maxVisiblePages={7}
            />
          </div>
        </>
      )}
    </div>
  );
};

const DetialLoading = () => {
  return (
    <ul className="w-full flex flex-col space-y-1 overflow-auto">
      {Array.from({ length: 7 }).map((_, index) => (
        <Skeleton key={index} className="w-full h-13 rounded-xl space-y-2" />
      ))}
    </ul>
  );
};

const FeaturedListDetail = () => {
  return (
    <div className="w-full h-full overflow-auto">
      <PlayList />
    </div>
  );
};

export default FeaturedListDetail;
