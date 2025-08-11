'use client';
import { Card, CardContent } from '@/app/_components/ui/card';
import { Service } from '@prisma/client';
import Image from 'next/image';
import { Check } from 'lucide-react';

interface ServiceItemProps {
  service: Service;
  selected?: boolean;
  onSelect: () => void;
}

const ServiceItem = ({ service, selected = false, onSelect }: ServiceItemProps) => {
  return (
    <Card
      className={`p-3 transition-all duration-200 cursor-pointer ${
        selected ? 'border !border-primary' : 'border border-border'
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-0">
        <div className="flex gap-4 items-center w-full">
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>

          <div className="flex flex-col w-full">
            <h2 className="font-bold">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>

            <div className="flex items-center justify-between mt-3 w-full relative">
              <p className="text-primary font-bold text-sm">
                {formatCurrency(Number(service.price))}
              </p>

              {selected && (
                <div className="flex items-center justify-center w-4 h-4 bg-primary rounded-full absolute right-0 bottom-0">
                  <span className="text-white text-sm font-bold">
                    <Check size={12} />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const formatCurrency = (amount: number) => {
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

export default ServiceItem;
