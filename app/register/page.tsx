'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { RegisterSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/_components/ui/card';
import { BackButton } from '@/app/_components/auth/back-button';
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
import { FormError } from '@/app/_components/form-error';
import { FormSuccess } from '@/app/_components/form-success';
import { register } from '@/app/_actions/register';
import { useState, useTransition } from 'react';
import Image from 'next/image';
import Header from '../_components/header';

const Register = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <>
      <Header />
      <div className="p-5 pt-28 md:pt-5 md:mt-[82px] container flex gap-10 justify-around items-center">
        <div className=" flex w-full max-w-[348px] flex-col gap-4 items-center">
          <div>
            <h2 className="text-xl font-bold text-center">Crie uma conta</h2>
            <BackButton label={'Já tenho uma conta'} href={'/login'} />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
              <div className="space-y-6">
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input disabled={isPending} {...field} placeholder="John Doe" />
                        </FormControl>
                        <FormMessage {...field} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
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
                </>
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button disabled={isPending} type="submit" className="w-full">
                Criar conta
              </Button>
            </form>
          </Form>
        </div>

        <Card className="hidden w-full max-w-[500px] lg:block">
          <Image
            src="/barber-items.png"
            style={{
              objectFit: 'cover',
            }}
            layout="responsive"
            width={500}
            height={500}
            className="rounded-2xl w-full h-auto"
            alt="Teste"
          />
          <div className="flex flex-col gap-4 p-11">
            <Image src="/logo.png" alt="Logo" height={32} width={130} />
            <p className="text-xl text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget nunc sed elit.
              Nullam eget nunc sed elit. Nullam eget nunc
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Register;
