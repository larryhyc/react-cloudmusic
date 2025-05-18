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
  const { cookie } = useUserStore();
  const navigate = useNavigate();
  useEffect(() => {});

  const NoLogin = () => {
    return (
      <>
        <Avatar
          className="h-full cursor-pointer"
          onClick={() => navigate('/login')}
        >
          <AvatarImage src="" alt="@shadcn" className="h-8 w-8 rounded-full" />
          <AvatarFallback className="h-8 w-8 rounded-full">
            <User />
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
                <User />
              </AvatarFallback>
            </Avatar>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80"></PopoverContent>
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
