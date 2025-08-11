'use server';

import { db } from '@/app/_lib/prisma';

interface GetBarbershopParams {
  barbershopId: string;
}

export const GetBarbershop = async (params: GetBarbershopParams) => {
  return await db.barbershop.findUnique({
    where: { id: params.barbershopId },
    include: { services: true, barbers: true },
  });
};
