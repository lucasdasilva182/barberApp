import parsePhoneNumber from 'libphonenumber-js';
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

export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: 'E-mail é obrigatório',
    }),
    password: z.string().min(6, {
      message: 'A senha precisa de no mínimo 6 caracteres',
    }),
    confirmPassword: z.string().min(6, { message: 'Confirme a senha' }),
    name: z.string().min(1, {
      message: 'Nome é obrigatório',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export const UpdateProfileSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('E-mail inválido'),
    phone: z.string().optional(),
    birthDate: z.string().optional(),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
    confirmPassword: z.string().optional(),
    address: z
      .object({
        street: z.string().min(1, 'Rua é obrigatória'),
        number: z.string().min(1, 'Número é obrigatório'),
        complement: z.string().optional(),
        neighborhood: z.string().min(1, 'Bairro é obrigatório'),
        city: z.string().min(1, 'Cidade é obrigatória'),
        state: z.string().min(1, 'Estado é obrigatório'),
        country: z.string().min(1, 'País é obrigatório'),
        zipCode: z.string().min(1, 'CEP é obrigatório'),
      })
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    }
  );
