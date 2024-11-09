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
    <div className="p-5 md:container">
      <Card className="flex flex-col justify-center items-center p-5">
        <Card className="flex flex-col">
          <CardTitle className="px-5 pt-5">Criar um conta</CardTitle>
          <CardContent className="flex flex-col gap-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          </CardContent>
          <CardFooter>
            <BackButton label={'Já tenho uma conta'} href={'/login'} />
          </CardFooter>
        </Card>
      </Card>
    </div>
  );
};

export default Register;
