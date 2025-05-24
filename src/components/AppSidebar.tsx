import { Home, Music } from 'lucide-react';
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
// import { myPlayListType } from '@/type/globle';

export function AppSidebar() {
  const { userId, cookie } = useUserStore();
  // const [likelist, setLikeList] = useState<myPlayListType[]>([]);
  const [items, setItems] = useState([
    {
      title: '首页',
      url: '/',
      icon: Home,
    },
  ]);

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
        const listItems = [] as myPlayListSiderType[];
        playlist.map((item: myPlayListType) => {
          listItems.push({
            title: item.name,
            url: `/playlist/${item.id}?img=${item.coverImgUrl}&name=${item.name}&createTime=${item.createTime}`,
            icon: Music,
          });
        });

        setItems((prevItems) => [...prevItems, ...listItems]);
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
