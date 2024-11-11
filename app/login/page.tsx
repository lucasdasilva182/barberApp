'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { LoginSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
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
import { login } from '@/app/_actions/login';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const urlError =
    searchParams.get('error') == 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : '';

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setError(data.success);
          }
        })
        .catch(() => setError('Something went wrong!'));
    });
  };

  const onClickGoogle = (provider: 'google') => {
    signIn(provider, {
      callbackUrl: callbackUrl || '/',
    });
  };
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <div className="p-5 md:container">
        <Card className="flex flex-col justify-center items-center p-5">
          <Card className="flex flex-col">
            <CardTitle className="px-5 pt-5">Login</CardTitle>
            <CardContent className="flex flex-col gap-3">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-6">
                    <>
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
                            <Button size="sm" variant="link" asChild className="px-0 font-normal">
                              <Link href="/auth/reset">Esqueci minha senha</Link>
                            </Button>
                            <FormMessage {...field} />
                          </FormItem>
                        )}
                      />
                    </>
                  </div>
                  <FormError message={error || urlError} />
                  <FormSuccess message={success} />
                  <Button disabled={isPending} type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter>
              <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => onClickGoogle('google')}
              >
                <FcGoogle className="h-5 w-5" />
              </Button>
              <BackButton label={'Não tenho uma conta'} href={'/register'} />
            </CardFooter>
          </Card>
        </Card>
      </div>
    </Suspense>
  );
};

export default Login;
