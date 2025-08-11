'use server';

import { db } from '@/app/_lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import { revalidatePath } from 'next/cache';

interface SaveBookingParams {
  barbershopId: string;
  barberId?: string | null;
  date: Date;
  userId: string;
  selectedServices: {
    serviceId: string;
    price: Decimal;
    name: string;
  }[];
}

export const SaveBooking = async (params: SaveBookingParams) => {
  console.log(params);

  await db.booking.create({
    data: {
      bookingServices: {
        create: params.selectedServices.map((service) => ({
          serviceId: service.serviceId,
          price: service.price,
          name: service.name,
        })),
      },
      user: {
        connect: {
          id: params.userId,
        },
      },
      date: params.date,
      barbershop: {
        connect: {
          id: params.barbershopId,
        },
      },
      ...(params.barberId && {
        barber: {
          connect: {
            id: params.barberId ?? undefined,
          },
        },
      }),
    },
  });

  revalidatePath('/');
  revalidatePath('/bookings');
};
