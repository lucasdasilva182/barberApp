import NextAuth, { DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
  id: string;
  isOAuth: boolean;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
