'use client';

import { Booking, Prisma } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { format, isFuture, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import Image from 'next/image';
import { Button } from './ui/button';
import { cancelBooking } from '../_actions/cancel-booking';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import BookingInfo from './booking-info';

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      bookingServices: true;
      barbershop: true;
      barber: true;
    };
  }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const isBookingConfirmed = isFuture(booking.date);

  const handleCancelClick = async () => {
    setIsDeleteLoading(true);
    try {
      await cancelBooking(booking.id);
      toast.success('Reserva cancelada com sucesso!');
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleteLoading(false);
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer">
        <Card className="min-w-full">
          <CardContent className="flex items-center p-0">
            <div className="flex flex-col gap-2 p-5 flex-1 md:flex-[3]">
              <Badge variant={isBookingConfirmed ? 'default' : 'secondary'} className="w-fit">
                {isBookingConfirmed ? 'Confirmado' : 'Finalizado'}
              </Badge>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={booking.barbershop.imageUrl} />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <h3 className="text-sm">{booking.barbershop.name}</h3>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center flex-1 border-l border-solid border-secondary">
              <p className="text-sm capitalize">{format(booking.date, 'MMMM', { locale: ptBR })}</p>
              <p className="text-2xl">{format(booking.date, 'dd')}</p>
              <p className="text-sm">{format(booking.date, 'HH:mm')}</p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent className="px-0 overflow-y-auto">
        <SheetHeader className="px-5 text-left pb-6 border-b border-solid border-secondary">
          <SheetTitle>Informações da Reserva</SheetTitle>
          <SheetDescription className="!p-0 !m-0"></SheetDescription>
        </SheetHeader>

        <div className="px-5">
          <div className="relative h-[180px] w-full mt-6">
            <Image
              src="/barbershop-map.png"
              fill
              alt={booking.barbershop.name}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            <div className="w-full absolute bottom-4 left-0 px-5">
              <Card>
                <CardContent className="p-3 flex gap-2">
                  <Avatar>
                    <AvatarImage src={booking.barbershop.imageUrl} />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>

                  <div>
                    <h2 className="font-bold">{booking.barbershop.name}</h2>
                    <h3 className="text-xs overflow-hidden text-nowrap text-ellipsis">
                      {booking.barbershop.address}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Badge variant={isBookingConfirmed ? 'default' : 'secondary'} className="w-fit mt-5 mb-3">
            {isBookingConfirmed ? 'Confirmado' : 'Finalizado'}
          </Badge>

          <BookingInfo
            booking={{
              ...booking,
              barbershop: {
                name: booking.barbershop.name,
              },
              bookingServices: booking.bookingServices.map((service) => ({
                ...service,
                barbershopId: booking.barbershop.id,
                description: booking.barbershop.description ?? '',
                imageUrl: booking.barbershop.imageUrl ?? '',
                name: service.name ?? '',
              })),
            }}
          />

          <SheetFooter className="flex-row gap-3 mt-6">
            <SheetClose asChild>
              <Button className="w-full" variant="secondary">
                Voltar
              </Button>
            </SheetClose>
            {isBookingConfirmed && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full" variant="destructive">
                    Cancelar Reservar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[90%]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja cancelar esse agendamento? Essa ação não poderá ser
                      desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-row gap-3">
                    <AlertDialogCancel className="w-full mt-0">Voltar</AlertDialogCancel>
                    <AlertDialogAction
                      className="w-full"
                      onClick={handleCancelClick}
                      disabled={isDeleteLoading}
                    >
                      {isDeleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookingItem;
