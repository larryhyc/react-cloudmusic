import { Home } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { APIURL } from '@/lib/constoct';
import useUserStore from '@/store/useUserStore';
import { useEffect, useState } from 'react';
import { myPlayListSiderType, myPlayListType } from '@/type/globle';
import Image from '@/components/ui/Image';
// import { myPlayListType } from '@/type/globle';

export function AppSidebar() {
  const { userId, cookie } = useUserStore();
  // const [likelist, setLikeList] = useState<myPlayListType[]>([]);
  const [items, setItems] = useState<myPlayListSiderType[]>([]);

  const getUserPlaylist = async (uid: number) => {
    try {
      const res = await fetch(
        `${APIURL}/user/playlist?uid=${uid}&timestamp=${Date.now()}`
      );
      const data = await res.json();
      return data.playlist || [];
    } catch (error) {
      console.error('获取播放列表失败:', error);
      return [];
    }
  };

  useEffect(() => {
    if (!cookie) {
      return;
    }

    const init = async () => {
      const playlist = await getUserPlaylist(userId!);

      if (playlist?.length > 0) {
        const listItems = playlist.map((item: myPlayListType) => ({
          title: item.name,
          url: `/playlist/${item.id}?img=${item.coverImgUrl}&name=${item.name}&createTime=${item.createTime}`,
          img: item.coverImgUrl,
        }));

        setItems(listItems);
      } else {
        setItems([]); // 如果没有数据，设置为空数组
      }
    };

    init();
  }, [userId, cookie]);

  return (
    <Sidebar>
      <SidebarContent className="overflow-auto scrollbar-hide">
        <SidebarGroup>
          <SidebarGroupLabel>react-网易云音乐</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to={'/'}>
                    <Home />
                    <span>首页</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroup>
            <SidebarGroupLabel>我的歌单</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {items.map((item: myPlayListSiderType) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url}>
                        <Image
                          src={item.img!}
                          className="w-12 h-12 rounded-2xl p-3"
                        />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
