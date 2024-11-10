'use server';

import { db } from '@/app/_lib/prisma';
import { revalidatePath } from 'next/cache';

interface SaveBookingParams {
  barbershopId: string;
  barberId?: string;
  serviceId: string;
  date: Date;
  userId: string;
}

export const SaveBooking = async (params: SaveBookingParams) => {
  await db.booking.create({
    data: {
      serviceId: params.serviceId,
      userId: params.userId,
      date: params.date,
      barbershopId: params.barbershopId,
      barberId: params.barberId ? params.barberId : '',
    },
  });

  revalidatePath('/');
  revalidatePath('/bookings');
};
