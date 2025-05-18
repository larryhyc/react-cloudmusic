import { useEffect, useState } from 'react';
import { APIURL } from '@/lib/constoct';
import { FeaturedListType, TagsType } from '@/type/globle';
import { Card, CardContent, CardFooter } from './ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import Image from './ui/Image';

const FeaturedList = () => {
  const [featured, setFeatured] = useState<FeaturedListType[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getTags = async () => {
    try {
      const res = await fetch(`${APIURL}/playlist/highquality/tags`);
      const data = await res.json();
      const tags: TagsType[] = data.tags;
      // 随机获得一个标签
      const randomTag = tags[Math.floor(Math.random() * tags.length)];
      // setTag(randomTag.name);
      return randomTag.name;
    } catch (error) {
      console.log('获取标签失败' + error);
    }
  };

  const getFeaturedList = async (tag: string) => {
    const time = new Date().getTime();
    // console.log(time);
    try {
      const res = await fetch(
        `${APIURL}/top/playlist/highquality?before=${time}&limit=12&cat=${'日语'}&timestamp=${Date.now()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      const data = await res.json();
      if (data.playlists.length < 12) {
        setLoading(true);
        const tag = await getTags();
        getFeaturedList(tag!);
      }
      setFeatured(data.playlists);
      setLoading(false);
    } catch (error) {
      console.log('获取推荐歌单列表失败' + error);
      setError('获取推荐歌单列表失败, 请刷新重试');
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const tag = await getTags();
      await getFeaturedList(tag!);
    };
    init();
  }, []);

  if (loading) {
    return (
      <>
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="w-44 max-w-44 h-44 rounded-2xl" />
        ))}
      </>
    );
  }
  if (error != '' || featured.length == 0) {
    return <div className="text-red-500 2xl:text-4xl">{error}</div>;
  }
  if (featured.length === 12) {
    return (
      <>
        {featured.map((item) => (
          <Card
            key={item.id}
            onClick={() =>
              navigate(
                `/playlist/${item.id}?img=${item.coverImgUrl}&name=${item.name}&createTime=${item.createTime}`
              )
            }
            className="w-full backdrop-sepia-50 overflow-hidden cursor-pointer text-sm text-violet-500/50 hover:bg-violet-950 hover:text-violet-300 duration-300 ease-in-out"
          >
            <CardContent>
              <Image
                src={item.coverImgUrl}
                alt=""
                className="w-full object-cover rounded-lg"
                cover
              />
            </CardContent>
            <CardFooter>
              <p className="truncate text-sm 2xl:text-2xl">{item.name}</p>
            </CardFooter>
          </Card>
        ))}
      </>
    );
  } else {
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="w-full h-44 rounded-2xl" />
      ))}
    </>;
  }
};

const Featured = () => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl 2xl:text-4xl font-bold text-violet-500">
        精选歌单
      </h2>
      <div className="grid grid-cols-6 gap-3 items-start">
        <FeaturedList />
      </div>
    </div>
  );
};

export default Featured;
