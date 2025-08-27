'use client';

import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { LogInIcon, MenuIcon, UserIcon } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import SideMenuItems from './side-menu-items';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Search from './search';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useEffect, useState } from 'react';
import { AppSidebar } from './app-sidebar';

const Header = () => {
  const { data } = useSession();

  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      setSearch(searchParams.get('search') || '');
    }
  }, []);

  return (
    <header className="fixed w-full z-[100]">
      <Card className="rounded-none">
        <CardContent className="container p-5 justify-between flex flex-row items-center gap-6">
          <Link href={'/'} className="w-[120px]">
            <Image
              src="/logo.png"
              alt="Logo"
              height={22}
              width={120}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>

          <div className="hidden md:flex">
            <Search defaultValues={{ search: search }} customClass={'w-full'} />
          </div>

          <div className="hidden md:flex gap-2">
            {data?.user ? (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 ">
                  <Link href="/account/profile">
                    <Avatar>
                      <AvatarImage src={data.user?.image ?? ''} />
                      <AvatarFallback className="">
                        {data.user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </div>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button className="w-full justify-start">
                  <LogInIcon className="mr-2" size={16} />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon />
                </Button>
              </SheetTrigger>

              <SheetContent className=" overflow-y-auto flex flex-col gap-1 px-4">
                <SheetHeader className="!p-0 !m-0">
                  <SheetTitle className="!p-0 !m-0"></SheetTitle>
                  <SheetDescription className="!p-0 !m-0"></SheetDescription>
                </SheetHeader>
                {data?.user ? (
                  <div className="flex justify-between pb-6 items-center">
                    <div className="flex items-center gap-3 ">
                      <Avatar>
                        <AvatarImage src={data.user?.image ?? ''} />
                        <AvatarFallback className="">
                          {data.user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="font-bold">{data.user.name}</h2>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 px-5 py-6 pb-3">
                    <div className="flex items-center gap-2">
                      <UserIcon size={32} />
                      <h2 className="font-bold">Olá, faça seu login!</h2>
                    </div>
                    <SheetClose asChild>
                      <Link href="/auth/login">
                        <Button className="w-full justify-start">
                          <LogInIcon className="mr-2" size={18} />
                          Fazer Login
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                )}
                <SideMenuItems isSheet={true} />
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>
    </header>
  );
};

export default Header;
