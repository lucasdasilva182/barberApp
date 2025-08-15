'use client';
import { Button } from '@/app/_components/ui/button';
import { Calendar } from '@/app/_components/ui/calendar';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/_components/ui/sheet';
import { Barbershop as PrismaBarbershop, Booking, Service, Barber } from '@prisma/client';
import { ptBR } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { generateDayTimeList } from '../_helpers/hours';
import { format, setHours, setMinutes } from 'date-fns';
import { SaveBooking } from '../actions/save-booking';
import { ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getDayBookings } from '../actions/get-day-bookings';
import BookingInfo from '@/app/_components/booking-info';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/_components/ui/avatar';
import { FaUser } from 'react-icons/fa';

interface Barbershop extends PrismaBarbershop {
  barbers?: { id: string; name: string; image: string | null; barbershopId: string }[];
  services: Service[];
}

interface CreateBookingProps {
  barbershop: Barbershop;
  barber?: Barber;
  selectedServices: Service[];
  isAuthenticated: boolean;
}

const CreateBooking = ({ selectedServices, isAuthenticated, barbershop }: CreateBookingProps) => {
  const router = useRouter();
  const { data } = useSession();

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState<string | undefined>();
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | undefined>();
  const [isBarberSheetOpen, setIsBarberSheetOpen] = useState(false);

  const openBarberSheet = () => setIsBarberSheetOpen(true);
  const closeBarberSheet = () => setIsBarberSheetOpen(false);

  const handleSelectBarber = (barber: Barber) => {
    setSelectedBarber(barber);
    closeBarberSheet();
  };

  const handleBookingClick = () => {
    // if (!isAuthenticated) {
    //   return signIn();
    // }
  };

  const handleBookingSubmit = async () => {
    setSubmitIsLoading(true);
    try {
      if (!hour || !date || !data?.user) {
        return;
      }

      const dateHour = Number(hour.split(':')[0]);
      const dateMinutes = Number(hour.split(':')[1]);

      const newDate = setMinutes(setHours(date, dateHour), dateMinutes);

      await SaveBooking({
        selectedServices: selectedServices.map((service) => ({
          serviceId: service.id,
          price: service.price,
          name: service.name,
        })),
        barbershopId: barbershop.id,
        barberId: selectedBarber?.id || null,
        date: newDate,
        userId: (data.user as any).id,
      });

      setSheetIsOpen(false);
      setHour(undefined);
      setDate(undefined);
      toast('Reserva realizada com sucesso!', {
        description: format(newDate, "'Para' dd 'de' MMMM 'às' HH':'mm'.'", {
          locale: ptBR,
        }),
        action: {
          label: 'Visualizar',
          onClick: () => router.push('/bookings'),
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitIsLoading(false);
    }
  };

  useEffect(() => {
    if (!date) {
      return;
    }

    const refreshAvailableHours = async () => {
      const _dayBookings = await getDayBookings(barbershop.id, date);

      setDayBookings(_dayBookings);
    };

    refreshAvailableHours();
  }, [date, barbershop.id]);

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
  };

  const handleHourClick = (time: string) => {
    setHour(time);
  };

  const timeList = useMemo(() => {
    if (!date) {
      return [];
    }

    return generateDayTimeList(date).filter((time) => {
      const timeHour = Number(time.split(':')[0]);
      const timeMinutes = Number(time.split(':')[1]);

      const booking = dayBookings.find((booking) => {
        const bookingHour = booking.date.getHours();
        const bookingMinutes = booking.date.getMinutes();

        return bookingHour === timeHour && bookingMinutes === timeMinutes;
      });

      if (!booking) {
        return true;
      }

      return false;
    });
  }, [date, dayBookings]);

  console.log(barbershop);

  return (
    <>
      <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
        {selectedServices.length > 0 && (
          <div className="container fixed bottom-10 z-[120] flex justify-end">
            <SheetTrigger asChild>
              <Button onClick={handleBookingClick}>
                Agendar <ArrowRight className="ml-1" size={18} />
              </Button>
            </SheetTrigger>
          </div>
        )}

        <SheetContent className="p-0 overflow-y-auto ">
          <SheetHeader className="text-left px-5 py-6 border-b border-solid border-secondary">
            <SheetTitle>Fazer reserva</SheetTitle>
          </SheetHeader>

          <div className="py-5">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateClick}
              locale={ptBR}
              fromDate={new Date()}
              styles={{
                head_cell: {
                  width: '100%',
                  textTransform: 'capitalize',
                },
                cell: {
                  width: '100%',
                },
                button: {
                  width: '100%',
                },
                nav_button_previous: {
                  width: '32px',
                  height: '32px',
                },
                nav_button_next: {
                  width: '32px',
                  height: '32px',
                },
                caption: {
                  textTransform: 'capitalize',
                },
              }}
            />
          </div>

          {date && (
            <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden py-6 px-5 border-t border-solid border-secondary">
              {timeList.map((time) => (
                <Button
                  key={time}
                  variant={hour === time ? 'default' : 'outline'}
                  className="mb-2 rounded-full"
                  onClick={() => handleHourClick(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          )}

          <div className="py-6 px-5 border-t border-solid border-secondary">
            <BookingInfo
              booking={{
                barbershop: barbershop,
                barber: selectedBarber,
                date:
                  date && hour
                    ? setMinutes(
                        setHours(date, Number(hour.split(':')[0])),
                        Number(hour.split(':')[1])
                      )
                    : undefined,
                bookingServices: selectedServices,
              }}
              onOpenBarberSheet={openBarberSheet}
            />
          </div>

          <SheetFooter className="px-5 pb-5">
            <Button
              variant="default"
              className="w-full"
              disabled={!hour || !date || submitIsLoading}
              onClick={handleBookingSubmit}
            >
              {submitIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar reserva
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={isBarberSheetOpen} onOpenChange={setIsBarberSheetOpen}>
        <SheetContent>
          <SheetHeader className="text-left px-5 py-6 border-b border-solid border-secondary">
            <SheetTitle>Escolha um funcionário</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4">
            {barbershop.barbers?.map((barber) => (
              <Button
                key={barber.id}
                variant="outline"
                className={'w-full p-4 flex gap-4 h-auto justify-start'}
                onClick={() => handleSelectBarber(barber)}
              >
                <Avatar>
                  <AvatarImage src={barber?.image ?? ''} />
                  <AvatarFallback className="bg-foreground">
                    <FaUser className="text-background" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-start items-start ">
                  <span className="font-bold text-sm">{barber.name}</span>
                  <span className="text-xs text-green-500">Disponível</span>
                </div>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CreateBooking;
