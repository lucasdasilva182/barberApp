'use client';

import SideMenu from '@/app/_components/side-menu';
import { Button } from '@/app/_components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/app/_components/ui/sheet';
import { Barbershop } from '@prisma/client';
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface BarbershopInfoProps {
  barbershop: Barbershop;
}

const BarbershopInfo = ({ barbershop }: BarbershopInfoProps) => {
  const router = useRouter();
  const handleBackClick = () => {
    router.replace('/');
  };

  return (
    <div>
      <div className="h-[250px] rounded-lg overflow-hidden w-full relative">
        <Image
          src={barbershop.imageUrl}
          fill
          alt={barbershop.name}
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

      <div className="px-0 pt-3 pb-6 flex justify-between items-center border-b border-solid border-secondary">
        <div>
          <h1 className="text-xl font-bold">{barbershop.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <MapPinIcon size={18} className="text-primary" />
            <p className="text-sm">{barbershop.address}</p>
          </div>
        </div>
        <div className="flex flex-col py-2 px-4 rounded-lg bg-accent items-center gap-1 mt-2">
          <div className="text-lg flex  gap-2 items-center justify-center">
            <StarIcon size={18} fill="#8161ff" className="text-primary" />
            5,0
          </div>
          <p className="text-sm">899 avaliações</p>
        </div>
      </div>
    </div>
  );
};

export default BarbershopInfo;
