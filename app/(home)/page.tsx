import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Search from './_components/search';
import BookingItem from '../_components/booking-item';
import { db } from '../_lib/prisma';
import BarbershopItem from './_components/barbershop-item';
import { currentUser } from '@/app/_lib/auth';
import { CarouselItem } from '@/app/_components/ui/carousel';
import { FlexibleCarousel } from '../_components/carousel-item';
import { Barbershop } from '@prisma/client';

export default async function Home() {
  const user = await currentUser();

  const [barbershops, recomendenBarbershops, confirmedBookings] = await Promise.all([
    db.barbershop.findMany({}),
    db.barbershop.findMany({
      orderBy: {
        id: 'asc',
      },
    }),
    user
      ? await db.booking.findMany({
          where: {
            userId: (user as any).id,
            date: {
              gte: new Date(),
            },
            OR: [
              {
                status: null,
              },
              {
                status: {
                  not: 'CANCELLED',
                },
              },
            ],
          },
          include: {
            bookingServices: true,
            barbershop: true,
            barber: true,
          },
        })
      : Promise.resolve([]),
  ]);

  const renderBarbershopItem = (barbershop: Barbershop) => {
    return <BarbershopItem barbershop={barbershop} />;
  };
  return (
    <>
      <div className="container px-5 py-6 pt-20">
        <div className="py-6">
          <h2 className="text-xl font-bold">
            {user ? `Olá, ${user.name?.split(' ')[0]}` : 'Olá!'}
          </h2>
          <p className="capitalize text-sm">
            {format(new Date(), "EEEE',' dd 'de' MMMM", {
              locale: ptBR,
            })}
          </p>
        </div>

        <div className="px-0 mb-6 block md:hidden">
          <Search />
        </div>

        {confirmedBookings.length > 0 && (
          <>
            <div>
              <h2 className=" text-xs uppercase text-grey-400 font-bold mb-3">Agendamentos</h2>
              <div className="px-0 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {confirmedBookings.map((booking) => (
                  <BookingItem key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          </>
        )}

        <div className="mt-6">
          <h2 className="px-0 text-xs uppercase text-grey-400 font-bold mb-3">Recomendados</h2>
          <FlexibleCarousel className="py-4">
            {barbershops.map((barbershop) => (
              <CarouselItem key={barbershop.id} className="basis-1/2 md:basis-1/4 lg:basis-1/6">
                <BarbershopItem barbershop={barbershop} />
              </CarouselItem>
            ))}
          </FlexibleCarousel>
        </div>

        <div className="mt-6">
          <h2 className="px-0 text-xs uppercase text-grey-400 font-bold mb-3">Populares</h2>

          <FlexibleCarousel className="py-4">
            {recomendenBarbershops.map((barbershop) => (
              <CarouselItem key={barbershop.id} className="basis-1/2 md:basis-1/4 lg:basis-1/6">
                <BarbershopItem barbershop={barbershop} />
              </CarouselItem>
            ))}
          </FlexibleCarousel>
        </div>
      </div>
    </>
  );
}
