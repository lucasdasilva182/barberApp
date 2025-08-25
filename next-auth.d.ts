import NextAuth, { DefaultSession } from 'next-auth';

export type Address = {
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}[];

export type ExtendedUser = DefaultSession['user'] & {
  id: string;
  isOAuth: boolean;
  phone?: string;
  birthDate?: Date;
  address?: Address;
  createdAt: Date;
  updatedAt: Date;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
