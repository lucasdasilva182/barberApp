'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { UpdateProfileSchema } from '@/schemas';
import { db } from '@/app/_lib/prisma';
import { getUserById } from '@/app/_data/user';
import { User } from '@prisma/client';

export const updateUser = async (id: string, values: z.infer<typeof UpdateProfileSchema>) => {
  const validatedFields = UpdateProfileSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Campos inválidos!' };
  }

  const existingUser = await getUserById(id);

  if (!existingUser) {
    return { error: 'Usuário não encontrado!' };
  }

  const { address, password, birthDate, ...userData } = validatedFields.data;

  const updateData: Partial<User> = {
    ...userData,
    birthDate: birthDate ? new Date(birthDate) : null,
  };

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateData.password = hashedPassword;
  }

  try {
    await db.user.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    const existingAddress = existingUser.address?.[0] || null;

    if (
      address === null ||
      (address && Object.values(address).every((v) => v === '' || v === null || v === undefined))
    ) {
      if (existingAddress) {
        await db.address.delete({
          where: { id: existingAddress.id },
        });
      }
    } else if (address) {
      const addressData = {
        ...address,
        userId: id,
      };

      if (existingAddress) {
        await db.address.update({
          where: { id: existingAddress.id },
          data: addressData,
        });
      } else {
        await db.address.create({
          data: addressData,
        });
      }
    }

    return { success: 'Usuário atualizado com sucesso!' };
  } catch (error) {
    console.error('Error updating user:', error);

    if (error instanceof Error) {
      return { error: `Falha ao atualizar usuário: ${error.message}` };
    }
    return { error: 'Falha ao atualizar usuário.' };
  }
};
