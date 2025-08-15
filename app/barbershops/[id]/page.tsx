'use client';
import BarbershopInfo from './_components/barbershop-info';
import ServiceItem from './_components/service-item';
import PhoneItem from '@/app/_components/phone-item';
import { Card, CardContent } from '@/app/_components/ui/card';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/_components/ui/avatar';
import { Separator } from '@/app/_components/ui/separator';
import { currentUser } from '@/app/_lib/auth';
import CreateBooking from './_components/create-booking';
import { GetBarbershop } from './actions/get-barbershop';
import { useEffect, useState } from 'react';
import { Service, WorkHour } from '@prisma/client';
import WeeklyWorkHour from '@/app/_components/work-hour';

interface Barbershop {
  id: string;
  name: string;
  phones: string[];
  description: string;
  address: string;
  imageUrl: string;
  services: Service[];
  workHours: WorkHour[];
}

interface BarbershopDetailsPageProps {
  params: {
    id?: string;
  };
}

const BarbershopDetailsPage = ({ params }: BarbershopDetailsPageProps) => {
  const [user, setUser] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await currentUser();
        setUser(userData);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (params.id) {
      const getBarbershop = async () => {
        const data = await GetBarbershop({ barbershopId: params.id! });
        setBarbershop(data);
      };
      getBarbershop();
    }
  }, [params.id]);

  if (!params.id) {
    // TODO redirecionar para home
    return null;
  }

  if (!barbershop) {
    // TODO redirecionar para home
    return null;
  }

  return (
    <>
      <div className="pt-24 md:pt-32 container flex flex-col md:grid md:grid-cols-12 gap-6 w-full">
        <div className="md:col-span-8">
          <BarbershopInfo barbershop={barbershop} />

          <div className="py-6">
            <p className="text-gray-400">Selecione os serviços desejados: </p>
            <div className="px-0 flex flex-col md:grid md:grid-cols-2 gap-4 pt-4">
              {barbershop.services.map((service) => (
                <ServiceItem
                  key={service.id}
                  service={service}
                  selected={selectedServices.some(
                    (selectedService) => selectedService.id === service.id
                  )}
                  onSelect={() => {
                    setSelectedServices((prev) =>
                      prev.some((selectedService) => selectedService.id === service.id)
                        ? prev.filter((selectedService) => selectedService.id !== service.id)
                        : [...prev, service]
                    );
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CONTATO */}
        <div className="col-span-4">
          <Card className="hidden md:flex">
            <CardContent className="flex flex-col gap-6 w-full pt-6">
              <div className="relative h-[180px] w-full">
                <Image
                  src="/barbershop-map.png"
                  fill
                  alt={barbershop.name}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                <div className="w-full absolute bottom-4 left-0 px-5">
                  <Card>
                    <CardContent className="p-3 flex flex-col lg:flex-row gap-2">
                      <Avatar>
                        <AvatarImage src={barbershop.imageUrl} />
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>

                      <div>
                        <h2 className="font-bold">{barbershop.name}</h2>
                        <h3 className="text-xs overflow-hidden text-nowrap text-ellipsis">
                          {barbershop.address}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div>
                <h2 className="font-semibold">SOBRE NÓS</h2>
                <p className="text-sm text-gray-400">{barbershop.description}</p>
              </div>
              <Separator />
              {barbershop.phones.map((phone) => (
                <PhoneItem key={phone + Math.random()} phone={phone} />
              ))}
              <Separator />
              <WeeklyWorkHour workHour={barbershop.workHours} />
            </CardContent>
          </Card>
        </div>
      </div>
      <CreateBooking
        barbershop={barbershop}
        selectedServices={selectedServices}
        isAuthenticated={!!user}
        barber={{
          id: '',
          name: '',
          image: null,
          barbershopId: '',
        }}
      />
    </>
  );
};

export default BarbershopDetailsPage;
