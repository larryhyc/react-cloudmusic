import { Search } from 'lucide-react';
import { Input } from './ui/input';

const Head = () => {
  return (
    <div className="flex flex-row justify-center items-center gap-4">
      <div className="flex flex-row gap-3 items-center">
        <Search className="cursor-pointer 2xl:w-10 2xl:h-8" color="#8E51FF" />
        <Input type="search" placeholder="搜索音乐..." className="w-64 2xl:w-80 h-8" />
      </div>
    </div>
  );
};

export default Head;
