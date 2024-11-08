'use client';

import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Calendar, LogInIcon, MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import SideMenu from './side-menu';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import Search from '../(home)/_components/search';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarImage } from './ui/avatar';

const Header = () => {
  const handleLoginClick = () => signIn();
  const pathname = usePathname();
  const { data } = useSession();

  return (
    <header className="fixed w-full z-[100]">
      <Card>
        <CardContent className="container p-5 justify-between flex flex-row items-center gap-6">
          <Link href={'/'} className="w-[120px]">
            <Image src="/logo.png" alt="Logo" height={22} width={120} />
          </Link>

          {pathname != '/' && (
            <div className="hidden md:flex">
              <Search customClass={'w-full'} />
            </div>
          )}

          <div className="hidden md:flex gap-6">
            <Button asChild variant="ghost" className="justify-start gap-2">
              <Link href="/bookings">
                <Calendar size={16} />
                Agendamentos
              </Link>
            </Button>
            {data?.user ? (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 ">
                  <Avatar>
                    <AvatarImage src={data.user?.image ?? ''} />
                  </Avatar>
                  <h2 className="font-bold">{data.user.name}</h2>
                </div>
              </div>
            ) : (
              <Button className="w-full justify-start" onClick={handleLoginClick}>
                <LogInIcon className="mr-2" size={16} />
                Login
              </Button>
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

              <SheetContent className="p-0">
                <SideMenu />
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>
    </header>
  );
};

export default Header;
