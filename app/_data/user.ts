import { db } from '@/app/_lib/prisma';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id }, include: { address: true } });

    return user;
  } catch {
    return null;
  }
};
