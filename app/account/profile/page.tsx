'use client';

import { currentUser } from '../../_lib/auth';
import { Card } from '@/app/_components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/_components/ui/avatar';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { UpdateProfileSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/_components/ui/form';
import { Input } from '@/app/_components/ui/input';
import { Button } from '@/app/_components/ui/button';
import { updateUser } from '@/app/_actions/update-user';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { CustomPhoneInput } from '@/app/_components/phone-input';
import { useSession } from 'next-auth/react';
import IMask from 'imask';
import { formatISODateToBR, parseBRDateToISO } from '@/app/_lib/dateUtils';
import { ExtendedUser } from '@/next-auth';

const AccountPage = () => {
  const session = useSession();

  const [user, setUser] = useState<ExtendedUser | undefined>(undefined);
  const [originalUserData, setOriginalUserData] = useState<z.infer<
    typeof UpdateProfileSchema
  > | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof UpdateProfileSchema>>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      birthDate: '',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      },
    },
  });

  const onSubmit = (values: z.infer<typeof UpdateProfileSchema>) => {
    if (!user) {
      return;
    }

    const { confirmPassword, ...updateData } = values;

    startTransition(() => {
      updateUser(user.id, {
        ...updateData,
        birthDate: updateData.birthDate ? parseBRDateToISO(updateData.birthDate) : undefined,
      })
        .then((data) => {
          if (data.success) {
            form.reset();
            session.update();
            getUser();
            toast('Cadastro atualizado com sucesso!');
          }
        })
        .catch((error) => {
          console.error('Unexpected error in onSubmit:', error);
          toast.error('Erro inesperado', {
            description: 'Falha ao atualizar o cadastro. Tente novamente.',
          });
        });
    });
  };

  const getUser = async () => {
    startTransition(async () => {
      setUser(await currentUser());
    });
  };

  const hasChanges = (): boolean => {
    if (!originalUserData) return false;

    const currentvalues = form.getValues();

    const isEqual = (a: any, b: any): boolean => {
      if (typeof a !== typeof b) return false;

      if (typeof a === 'object' && a !== null && b !== null) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) return false;

        for (let key of keysA) {
          if (!isEqual(a[key], b[key])) return false;
        }

        return true;
      }
      return a === b;
    };

    return !isEqual(currentvalues, originalUserData);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      const firstAddress = user.address?.[0] || null;

      const userData = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: formatISODateToBR(user.birthDate) || '',
        address: firstAddress
          ? {
              street: firstAddress.street,
              number: firstAddress.number,
              complement: firstAddress.complement || '',
              neighborhood: firstAddress.neighborhood,
              city: firstAddress.city,
              state: firstAddress.state,
              country: firstAddress.country,
              zipCode: firstAddress.zipCode,
            }
          : {
              street: '',
              number: '',
              complement: '',
              neighborhood: '',
              city: '',
              state: '',
              country: '',
              zipCode: '',
            },
      };

      form.reset(userData);
      setOriginalUserData(userData);
    }
  }, [user, form]);

  return (
    <>
      <div className="container px-5 py-6 pt-[6.5rem]">
        <h1 className="text-xl font-bold mb-4">Perfil</h1>

        {isPending && <div>Carregando...</div>}
        {!isPending && user && (
          <div className="flex flex-col gap-4">
            <Card className="flex gap-4 items-start p-4">
              <div className="flex flex-col items-start w-full">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                    <div className="flex flex-col lg:flex-row gap-8 w-full">
                      {/* Personal Info */}
                      <div className="space-y-6 w-full">
                        <>
                          <h3 className="text-lg font-semibold mb-4">Sobre você</h3>

                          <div className="flex gap-4 w-full">
                            <Avatar className="w-20 h-20">
                              <AvatarImage src={user?.image ?? ''} />
                              <AvatarFallback className="text-xl">
                                {user?.name?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormLabel>Nome completo</FormLabel>
                                  <FormControl>
                                    <Input disabled={isPending} {...field} placeholder="John Doe" />
                                  </FormControl>
                                  <FormMessage {...field} />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-12 gap-4 w-full">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-8">
                                  <FormLabel>E-mail</FormLabel>
                                  <FormControl>
                                    <Input
                                      disabled={isPending}
                                      {...field}
                                      placeholder="john.doe@example.com"
                                      type="email"
                                    />
                                  </FormControl>
                                  <FormMessage {...field} />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="birthDate"
                              render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-4">
                                  <FormLabel>Data de nascimento</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      ref={(input) => {
                                        field.ref(input);
                                        if (input) {
                                          const mask = IMask(input, {
                                            mask: '00/00/0000',
                                            lazy: false,
                                          });

                                          mask.on('accept', () => {
                                            field.onChange(mask.value);
                                          });

                                          // Cleanup
                                          return () => {
                                            mask.destroy();
                                          };
                                        }
                                      }}
                                      disabled={isPending}
                                      placeholder="00/00/0000"
                                      type="text"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <CustomPhoneInput
                                  label="Telefone"
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  disabled={isPending}
                                  error={form.formState.errors.phone?.message}
                                />
                              </FormItem>
                            )}
                          />

                          <p className="text-sm text-muted-foreground">
                            Para manter a senha atual, deixe em branco.
                          </p>
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem className="!mt-0">
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                  <Input
                                    disabled={isPending}
                                    {...field}
                                    placeholder="******"
                                    type="password"
                                  />
                                </FormControl>
                                <FormMessage {...field} />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirme a senha</FormLabel>
                                <FormControl>
                                  <Input
                                    disabled={isPending}
                                    {...field}
                                    placeholder="******"
                                    type="password"
                                  />
                                </FormControl>
                                <FormMessage {...field} />
                              </FormItem>
                            )}
                          />
                        </>
                      </div>

                      {/* Address */}
                      <div className="space-y-6 w-full">
                        <>
                          <h3 className="text-lg font-semibold mb-4">Endereço</h3>
                          <FormField
                            control={form.control}
                            name="address.zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CEP</FormLabel>
                                <FormControl>
                                  <Input disabled={isPending} {...field} placeholder="00000-000" />
                                </FormControl>
                                <FormMessage {...field} />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-6 gap-4">
                            <FormField
                              control={form.control}
                              name="address.street"
                              render={({ field }) => (
                                <FormItem className="col-span-4 w-full">
                                  <FormLabel>Rua</FormLabel>
                                  <FormControl>
                                    <Input disabled={isPending} {...field} placeholder="Rua" />
                                  </FormControl>
                                  <FormMessage {...field} />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="address.number"
                              render={({ field }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel>Número</FormLabel>
                                  <FormControl>
                                    <Input disabled={isPending} {...field} placeholder="0000" />
                                  </FormControl>
                                  <FormMessage {...field} />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-12 gap-4">
                            <FormField
                              control={form.control}
                              name="address.neighborhood"
                              render={({ field }) => (
                                <FormItem className="col-span-5 w-full">
                                  <FormLabel>Bairro</FormLabel>
                                  <FormControl>
                                    <Input disabled={isPending} {...field} placeholder="Bairro" />
                                  </FormControl>
                                  <FormMessage {...field} />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="address.city"
                              render={({ field }) => (
                                <FormItem className="col-span-5">
                                  <FormLabel>Cidade</FormLabel>
                                  <FormControl>
                                    <Input disabled={isPending} {...field} placeholder="Cidade" />
                                  </FormControl>
                                  <FormMessage {...field} />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="address.state"
                              render={({ field }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel>Estado</FormLabel>
                                  <FormControl>
                                    <Input disabled={isPending} {...field} placeholder="Estado" />
                                  </FormControl>
                                  <FormMessage {...field} />
                                </FormItem>
                              )}
                            />
                          </div>
                        </>
                      </div>
                    </div>

                    <Button disabled={isPending || !hasChanges()} type="submit" className="w-fit">
                      Enviar
                    </Button>
                  </form>
                </Form>
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default AccountPage;
