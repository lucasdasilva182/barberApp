import { Badge } from '@/app/_components/ui/badge';
import { Button } from '@/app/_components/ui/button';
import {
  Card,
  CardContent,
} from '@/app/_components/ui/card';
import { Barbershop } from '@prisma/client';
import { StarIcon } from 'lucide-react';
import Image from 'next/image';

interface BarbershopItemProps {
  barbershop: Barbershop;
}

const BarbershopItem = ({
  barbershop,
}: BarbershopItemProps) => {
  return (
    <Card className="min-w-[167px] max-w-[167px] rounded-2xl">
      <CardContent className="p-0">
        <div className="w-full h-[159px] relative">
          <div className="absolute top-2 left-2 z-50 ">
            <Badge
              variant="secondary"
              className="opacity-90 flex items-center justify-center gap-1"
            >
              <StarIcon
                size={12}
                className="fill-primary text-primary"
              />
              <span className="text-xs">5,0</span>
            </Badge>
          </div>
          <Image
            src={barbershop.imageUrl}
            style={{
              objectFit: 'cover',
            }}
            fill
            className="rounded-2xl"
            alt={barbershop.name}
          />
        </div>

        <div className="px-3 pb-3">
          <h2 className="font-bold overflow-hidden text-ellipsis text-nowrap">
            {barbershop.name}
          </h2>
          <p className="text-sm mt-2 text-grey-400 overflow-hidden text-ellipsis text-nowrap">
            {barbershop.address}
          </p>
          <Button
            className="w-full mt-3"
            variant="secondary"
          >
            Reservar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarbershopItem;
