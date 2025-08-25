import { redirect } from 'next/navigation';
import { db } from '../../_lib/prisma';
import BookingItem from '../../_components/booking-item';
import { currentUser } from '../../_lib/auth';

const BookingsPage = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect('/auth/login');
  }

  const [confirmedBookings, finishedBookings] = await Promise.all([
    db.booking.findMany({
      where: {
        userId: (user as any).id,
        date: {
          gte: new Date(),
        },
      },
      include: {
        bookingServices: true,
        barbershop: true,
        barber: true,
      },
    }),
    db.booking.findMany({
      where: {
        userId: (user as any).id,
        date: {
          lt: new Date(),
        },
      },
      include: {
        bookingServices: true,
        barbershop: true,
        barber: true,
      },
    }),
  ]);

  return (
    <>
      <div className="container px-5 py-6 pt-[6.5rem]">
        <h1 className="text-xl font-bold">Agendamentos</h1>

        {confirmedBookings.length == 0 && (
          <div className="flex w-full">
            <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">
              Nenhum agendamento encontrado.
            </h2>
          </div>
        )}

        {confirmedBookings.length > 0 && (
          <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">Confirmados</h2>
        )}

        <div className="flex flex-col gap-3">
          {confirmedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>

        {finishedBookings.length > 0 && (
          <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">Finalizados</h2>
        )}

        <div className="flex flex-col gap-3">
          {finishedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </>
  );
};

export default BookingsPage;
