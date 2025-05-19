import { Search, User } from 'lucide-react';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avartar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useEffect, useState } from 'react';
import { APIURL } from '@/lib/constoct';
import Image from './ui/Image';
import useUserStore from '@/store/useUserStore';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const Head = () => {
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
                src=""
                alt="@shadcn"
                className="h-8 w-8 rounded-full"
              />
              <AvatarFallback className="h-8 w-8 rounded-full">
                <Image src={avatarUrl!} className="w-8 h-8 rounded-full" />
              </AvatarFallback>
            </Avatar>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex flex-col gap-3">
            <p>id: {userId}</p>
            <p>name: {nickname}</p>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="flex flex-row justify-center items-center gap-4">
      <div className="flex flex-row gap-3 items-center">
        <Search className="cursor-pointer 2xl:w-10 2xl:h-8" color="#8E51FF" />
        <Input
          type="search"
          placeholder="搜索音乐..."
          className="w-64 2xl:w-80 h-8"
        />
        {cookie ? <UserDetile /> : <NoLogin />}
      </div>
    </div>
  );
};

export default Head;
