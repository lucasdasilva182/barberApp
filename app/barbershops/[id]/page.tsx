import { db } from '@/app/_lib/prisma';
import BarbershopInfo from './_components/barbershop-info';
import ServiceItem from './_components/service-item';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/_lib/auth';
import Header from '@/app/_components/header';
import PhoneItem from '@/app/_components/phone-item';
import { Card, CardContent } from '@/app/_components/ui/card';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/_components/ui/avatar';
import { Separator } from '@/app/_components/ui/separator';

interface BarbershopDetailsPageProps {
  params: {
    id?: string;
  };
}

const BarbershopDetailsPage = async ({ params }: BarbershopDetailsPageProps) => {
  const session = await getServerSession(authOptions);

  if (!params.id) {
    // TODO redirecionar para home
    return null;
  }

  const barbershop = await db.barbershop.findUnique({
    where: { id: params.id },
    include: { services: true },
  });

  if (!barbershop) {
    // TODO redirecionar para home
    return null;
  }

  return (
    <div>
      <Header />
      <div className="pt-32 container grid grid-cols-[70%_30%] gap-6 w-full">
        <div>
          <BarbershopInfo barbershop={barbershop} />

          <div className="px-0 flex flex-col md:grid md:grid-cols-2 gap-4 py-6">
            {barbershop.services.map((service) => (
              <ServiceItem
                barbershop={barbershop}
                key={service.id}
                service={service}
                isAuthenticated={!!session?.user}
              />
            ))}
          </div>
        </div>

        {/* CONTATO */}
        <Card>
          <CardContent className="flex flex-col gap-6 w-full pt-6">
            <div className="relative h-[180px] w-full">
              <Image src="/barbershop-map.png" fill alt={barbershop.name} />

              <div className="w-full absolute bottom-4 left-0 px-5">
                <Card>
                  <CardContent className="p-3 flex gap-2">
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
              <PhoneItem key={phone} phone={phone} />
            ))}
            <Separator />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BarbershopDetailsPage;
