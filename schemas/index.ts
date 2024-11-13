import * as z from 'zod';

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: 'Nova Senha é obrigatório!',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: 'Senha é obrigatório!',
      path: ['password'],
    }
  );

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'E-mail é obrigatório',
  }),
  password: z.string().min(1, {
    message: 'Senha é obrigatório',
  }),
  code: z.optional(z.string()),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'A senha precisa de no mínimo 6 caracteres',
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'E-mail é obrigatório',
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'E-mail é obrigatório',
  }),
  password: z.string().min(6, {
    message: 'A senha precisa de no mínimo 6 caracteres',
  }),
  name: z.string().min(1, {
    message: 'Nome é obrigatório',
  }),
});
