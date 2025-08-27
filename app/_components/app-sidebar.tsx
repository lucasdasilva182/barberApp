'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/app/_components/ui/sidebar';
import { LogOut, User, Calendar } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import SideMenuItems from './side-menu-items';

export function AppSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    signOut();
  };

  const [items, setItems] = useState([
    {
      title: 'Perfil',
      url: '/account/profile',
      icon: User,
      active: false,
    },
    {
      title: 'Agendamentos',
      url: '/account/bookings',
      icon: Calendar,
      active: false,
    },
    {
      title: 'Logout',
      url: '',
      icon: LogOut,
      active: false,
      action: () => {
        handleLogout();
      },
      itemClass: 'text-destructive hover:text-destructive',
    },
  ]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const updatedItems = items.map((item) => ({
      ...item,
      active: item.url === currentPath,
    }));
    setItems(updatedItems);
  }, [pathname]);

  return (
    <Sidebar className="mt-[80px]">
      <SidebarHeader className="flex justify-center items-center p-0"></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2">
              {/* {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={
                      'text-base ' +
                      item.itemClass +
                      (item.active
                        ? ' bg-primary/80 text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground'
                        : '')
                    }
                    onClick={item.action ? item.action : undefined}
                  >
                    <Link href={item.url}>
                      <item.icon size={30} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))} */}

              <SideMenuItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
