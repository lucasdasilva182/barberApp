'use client';

import { LogOut, User, Calendar } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SheetClose } from './ui/sheet';
import { cn } from '@/app/_lib/utils';
import { buttonVariants } from './ui/button';

interface SideMenuItemsProps {
  isSheet?: boolean;
}

const SideMenuItems = ({ isSheet = false }: SideMenuItemsProps) => {
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
      url: '#',
      icon: LogOut,
      active: false,
      action: () => {
        handleLogout();
      },
      itemClass: 'text-destructive hover:text-destructive',
    },
  ]);

  useEffect(() => {
    const updatedItems = items.map((item) => ({
      ...item,
      active: item.url === pathname,
    }));
    setItems(updatedItems);
  }, [pathname]);

  const MenuItem = ({ item }: { item: (typeof items)[0] }) => {
    const baseButtonClasses = cn(
      buttonVariants({ variant: 'ghost', size: 'default' }),
      'w-full justify-start gap-2 text-base',
      item.active
        ? 'bg-primary/80 text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground'
        : '',
      item.itemClass || ''
    );

    if (item.action && item.url === '#') {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            item.action?.();
          }}
          className={baseButtonClasses}
        >
          <item.icon size={20} />
          <span>{item.title}</span>
        </button>
      );
    }

    return isSheet ? (
      <SheetClose asChild>
        <Link href={item.url} className={`${baseButtonClasses}`}>
          <item.icon size={20} />
          <span>{item.title}</span>
        </Link>
      </SheetClose>
    ) : (
      <Link href={item.url} className={`text-sm ${baseButtonClasses}`}>
        <item.icon size={20} />
        <span>{item.title}</span>
      </Link>
    );
  };

  return (
    <>
      {items.map((item) => (
        <MenuItem key={item.title} item={item} />
      ))}
    </>
  );
};

export default SideMenuItems;
