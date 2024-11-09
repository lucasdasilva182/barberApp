'use server';

import bcrypt from 'bcryptjs';
import * as z from 'zod';
import { RegisterSchema } from '@/schemas';
import { db } from '@/app/_lib/prisma';
import { getUserByEmail } from '@/app/_data/user';
import { generateVerificationToken } from '@/app/_lib/tokens';
import { sendVerificationEmail } from '@/app/_lib/mail';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    // throw new Error('Invalid fields');
    return { error: 'Campos inválidos!' };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Este e-mail já está em uso!' };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: 'E-mail de confirmação enviado!' };
};
