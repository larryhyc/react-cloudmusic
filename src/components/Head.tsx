import { LogOut, Search, User } from 'lucide-react';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avartar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useEffect, useState } from 'react';
import { APIURL } from '@/lib/constoct';
import useUserStore from '@/store/useUserStore';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';

const Head = () => {
  const [search, setSearch] = useState('');
  let debounceTimer: NodeJS.Timeout | null = null;
  const {
    cookie,
    avatarUrl,
    nickname,
    userId,
    setCookie,
    setUserId,
    setNickname,
    setCreateTime,
    setAvatarUrl,
  } = useUserStore();
  const navigate = useNavigate();
  useEffect(() => {
    async function getLoginStatus() {
      const res = await fetch(
        `${APIURL}/login/status?timestamp=${Date.now()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      const data = await res.json();
      setCookie(localStorage.getItem('cloundmusic')!);
      setUserId(data.data.profile.userId);
      setAvatarUrl(data.data.profile.avatarUrl);
      setNickname(data.data.profile.nickname);
      setCreateTime(data.data.profile.createTime);
    }
    getLoginStatus();
  }, [cookie]);

  const logout = () => {
    localStorage.removeItem('cloundmusic');
    setCookie(null);
    setUserId(null);
    setAvatarUrl(null);
    setNickname(null);
    setCreateTime(null);
    window.location.reload();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 清除之前的定时器
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // 设置新的定时器
    debounceTimer = setTimeout(() => {
      setSearch(value);
    }, 300); // 300ms 延迟
  };

  // 统一搜索处理函数
  const handleSearch = () => {
    if (search) {
      navigate(`/search?name=${search}`);
    }
  };

  // 记得在组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, []);

  const NoLogin = () => {
    return (
      <>
        <Avatar
          className="h-full cursor-pointer"
          onClick={() => navigate('/login')}
        >
          <AvatarImage src="" alt="@shadcn" className="h-8 w-8 rounded-full" />
          <AvatarFallback className="w-8 h-8 rounded-full">
            <User size={18} />
          </AvatarFallback>
        </Avatar>
      </>
    );
  };

  const UserDetile = () => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex flex-row items-center cursor-pointer">
            <Avatar className="h-full">
              <AvatarImage
                src={avatarUrl!}
                alt="@shadcn"
                className="h-8 w-8 rounded-full"
              />
            </Avatar>
            <span className="text-sm">{nickname}</span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <Card className="flex flex-col gap-3">
            <CardHeader className="text-sm">
              <span>{nickname}</span>
              <span>uid:{userId}</span>
            </CardHeader>
            <CardContent>
              <Button
                onClick={logout}
                variant="destructive"
                className="cursor-pointer"
              >
                <LogOut />
                退出登录
              </Button>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="flex flex-row justify-center items-center gap-4">
      <div className="flex flex-row gap-3 items-center">
        <Search
          className="cursor-pointer"
          color="#8E51FF"
          onClick={handleSearch}
        />
        <Input
          type="search"
          placeholder="搜索音乐..."
          className="w-64"
          onChange={(e) => handleChange(e)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        {cookie ? <UserDetile /> : <NoLogin />}
      </div>
    </div>
  );
};

export default Head;
