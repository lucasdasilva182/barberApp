import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { db } from '@/app/_lib/prisma';
import authConfig from '@/auth.config';
import { getUserById } from '@/app/_data/user';
import { getAccountByUserId } from '@/app/_data/account';

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/error',
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true;

      const existingUser = await getUserById(user?.id ?? '');

      if (!existingUser?.emailVerified) return false;

      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.phone = token.phone as string | undefined;
        session.user.birthDate = token.birthDate as Date | undefined;
        session.user.address = token.address as string[] | undefined;

        session.user.createdAt = token.createdAt as Date;
        session.user.updatedAt = token.updatedAt as Date;
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.phone = existingUser.phone;
      token.birthDate = existingUser.birthDate;
      token.address = existingUser.address;
      token.createdAt = existingUser.createdAt;
      token.updatedAt = existingUser.updatedAt;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
