'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { LoginSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardFooter, CardTitle } from '@/app/_components/ui/card';
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
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { Separator } from '@radix-ui/react-dropdown-menu';
import Image from 'next/image';
import Header from '../_components/header';

const Login = () => {
  const [callbackUrl, setCallbackUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      setCallbackUrl(searchParams.get('callbackUrl') || '');
      setUrlError(
        searchParams.get('error') === 'OAuthAccountNotLinked'
          ? 'E-mail já está vinculado à algum provedor!'
          : ''
      );
    }
  }, []);

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
            setSuccess(data.success);
          }
        })
        .catch(() => setError('Algo deu errado!'));
    });
  };

  const onClickGoogle = (provider: 'google') => {
    signIn(provider, {
      callbackUrl: callbackUrl || '/',
    });
  };

  return (
    <>
      <Header />

      <div className="p-5 pt-28 md:pt-5 md:mt-[82px] container flex gap-10 justify-around items-center">
        <div className=" flex w-full max-w-[348px] flex-col gap-4 items-center justify-center">
          <div>
            <h2 className="text-xl font-bold text-center">Acesse sua conta</h2>
            <BackButton label={'Não tenho uma conta'} href={'/register'} />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
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
                        <FormMessage {...field} />
                        <Button size="sm" variant="link" asChild className="px-0 font-normal">
                          <Link href="/auth/reset">Esqueci minha senha</Link>
                        </Button>
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
          <Separator />
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="flex">
              <p>Se preferir faça login com: </p>
            </div>
            <Button
              size="lg"
              className="w-fit"
              variant="outline"
              onClick={() => onClickGoogle('google')}
            >
              <FcGoogle className="h-5 w-5" />
            </Button>
          </div>
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

export default Login;
