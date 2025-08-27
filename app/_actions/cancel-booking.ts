'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../_lib/prisma';

export const cancelBooking = async (bookingId: string) => {
  await db.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: 'CANCELLED',
    },
  });

  revalidatePath('/');
  revalidatePath('/account/bookings');
};
