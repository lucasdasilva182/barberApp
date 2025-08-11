import { Barbershop, Booking, Service, Barber } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Pencil } from 'lucide-react';
import { Separator } from './ui/separator';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Decimal } from '@prisma/client/runtime/library';

interface BookingService extends Service {
  id: string;
  name: string;
  price: Decimal;
  barbershopId: string;
  description: string;
  imageUrl: string;
}

interface BookingInfoProps {
  booking: Partial<Pick<Booking, 'date'>> & {
    barbershop: Pick<Barbershop, 'name'>;
    barber: Barber | undefined;
    bookingServices: BookingService[];
  };
  onOpenBarberSheet?: () => void;
}

const BookingInfo = ({ booking, onOpenBarberSheet }: BookingInfoProps) => {
  const actualRoute = usePathname();
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (actualRoute.includes('booking')) {
      setIsBooking(true);
    }
  }, [actualRoute]);

  return (
    <Card>
      <CardContent className="p-3 flex flex-col gap-3">
        {booking.bookingServices &&
          booking.bookingServices.length > 0 &&
          booking.bookingServices.map((bookingInfos, index) => (
            <div className="flex justify-between" key={bookingInfos.id ?? index}>
              <h2 className="font-bold text-sm">{bookingInfos.name}</h2>
              <h3 className="font-bold">
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(Number(bookingInfos.price))}
              </h3>
            </div>
          ))}
        {booking.date && (
          <>
            <div className="flex justify-between">
              <h3 className="text-gray-400 text-sm">Data:</h3>
              <h4 className="text-sm">{format(booking.date, "dd 'de' MMMM", { locale: ptBR })}</h4>
            </div>
            <div className="flex justify-between">
              <h3 className="text-gray-400 text-sm">Horário:</h3>
              <h4 className="text-sm">{format(booking.date, 'hh:mm', { locale: ptBR })}</h4>
            </div>
          </>
        )}

        <div className="flex justify-between">
          <h3 className="text-gray-400 text-sm">Barbearia:</h3>
          <h4 className="text-sm">{booking.barbershop.name}</h4>
        </div>

        <div className="flex flex-col  pt-3">
          <Separator />
          <div className="flex items-center justify-between pt-3">
            <div className="flex gap-2 justify-between w-full items-center">
              <div className="flex gap-2">
                <h3 className="text-gray-400 text-sm">Funcionário:</h3>
                <h4 className="text-sm">
                  {booking.barber ? booking.barber.name : 'Sem preferência'}
                </h4>
              </div>
              {!isBooking && (
                <>
                  <Button
                    variant="ghost"
                    type="button"
                    className="h-5 w-5 p-0"
                    onClick={onOpenBarberSheet}
                  >
                    <Pencil size={16} />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingInfo;
