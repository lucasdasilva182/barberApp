'use client';

import { newVerification } from '@/app/_actions/new-verification';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { Card, CardContent, CardFooter, CardTitle } from '@/app/_components/ui/card';
import { BackButton } from '@/app/_components/auth/back-button';
import { FormError } from '@/app/_components/form-error';
import { FormSuccess } from '@/app/_components/form-success';

const NewVerificationPage = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      setToken(searchParams.get('token'));
    }
  }, []);

  const onSubmit = useCallback(() => {
    if (success || error || !token) return;

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError('Algo deu errado!');
      });
  }, [token, success, error]);

  useEffect(() => {
    if (token) {
      onSubmit();
    }
  }, [onSubmit, token]);

  return (
    <Card className="flex flex-col justify-center items-center p-5">
      <Card className="flex flex-col">
        <CardTitle className="px-5 pt-5">Criar uma conta</CardTitle>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-center w-full">
            {!success && !error && <BeatLoader />}
            <FormSuccess message={success} />
            {!success && <FormError message={error} />}
          </div>
        </CardContent>
        <CardFooter>
          <BackButton label={'Voltar ao login'} href={'/login'} />
        </CardFooter>
      </Card>
    </Card>
  );
};

export default NewVerificationPage;
