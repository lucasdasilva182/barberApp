'use server';
import * as z from 'zod';

import { signIn } from '@/auth';
import { LoginSchema } from '@/schemas';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/app/_data/user';
import { sendVerificationEmail } from '@/app/_lib/mail';
import { generateVerificationToken } from '@/app/_lib/tokens';

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    // throw new Error('Invalid fields');
    return { error: 'Invalid fields!' };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist!' };
  }

  if (!existingUser.emailVerified) {
    const verificationtoken = await generateVerificationToken(existingUser.email);

    await sendVerificationEmail(verificationtoken.email, verificationtoken.token);

    return { success: 'E-mail de confirmação enviado!' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || '/',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' };
        default:
          return { error: 'Something went worng!' };
      }
    }

    throw error;
  }
};
