import { Home, Heart } from 'lucide-react';
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
        // 使用函数式更新确保不丢失已有项
        setItems((prevItems) => [
          ...prevItems,
          {
            title: `${playlist[0].name}`,
            url: `/playlist/${playlist[0].id}?img=${playlist[0].coverImgUrl}&name=${playlist[0].name}&createTime=${playlist[0].createTime}`,
            icon: Heart,
          },
        ]);
      }
    };

    init();
  }, [userId, cookie]);

  return (
    <Sidebar>
      <SidebarContent>
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
