'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { SheetHeader, SheetTitle } from './ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';

const SideMenu = () => {
  const { data } = useSession();

  const handleLogoutClick = () => signOut();

  return (
    <>
      <SheetHeader className="text-left border-b border-solid border-secondary p-5">
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>
      {data?.user ? (
        <div className="flex justify-between px-5 py-6 items-center">
          <div className="flex items-center gap-3 ">
            <Avatar>
              <AvatarImage src={data.user?.image ?? ''} />
              <AvatarFallback className="bg-foreground">
                <FaUser className="text-background" />
              </AvatarFallback>
            </Avatar>
            <h2 className="font-bold">{data.user.name}</h2>
          </div>

          <Button onClick={handleLogoutClick} variant="secondary" size="icon">
            <LogOutIcon size={16} />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-5 py-6">
          <div className="flex items-center gap-2">
            <UserIcon size={32} />
            <h2 className="font-bold">Olá, faça seu login!</h2>
          </div>
          <Link href="/login">
            <Button className="w-full justify-start">
              <LogInIcon className="mr-2" size={18} />
              Fazer Login
            </Button>
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3 px-5">
        <Button asChild variant="outline" className="justify-start">
          <Link href="/">
            <HomeIcon size={18} className="mr-2" /> Início
          </Link>
        </Button>

        {data?.user && (
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/bookings">
              <CalendarIcon size={18} className="mr-2" /> Agendamentos
            </Link>
          </Button>
        )}
      </div>
    </>
  );
};

export default SideMenu;
