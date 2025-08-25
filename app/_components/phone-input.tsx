'use client';

import { useEffect, useRef, useState } from 'react';
import IMask, { InputMask } from 'imask';
import { FormLabel, FormMessage } from '@/app/_components/ui/form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import { Button } from '@/app/_components/ui/button';
import { ScrollArea } from '@/app/_components/ui/scroll-area';
import Image from 'next/image';

import { PHONE_COUNTRIES } from '@/app/_lib/phone-countries';
import { getCallingCode } from '@/app/_lib/phone-countries';
import { CountryCode } from '@/app/_types/phone';
import { getPhoneMask } from '@/app/_lib/phone-masks';

type PhoneInputProps = {
  label?: string;
  error?: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  onBlur?: () => void;
  disabled?: boolean;
};

export function CustomPhoneInput({
  label,
  error,
  value,
  onChange,
  onBlur,
  disabled,
}: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const maskRef = useRef<InputMask<any> | null>(null);
  const [country, setCountry] = useState<CountryCode>('BR');
  const { mask, placeholder } = getPhoneMask(country);

  useEffect(() => {
    if (!inputRef.current) return;

    if (maskRef.current) {
      maskRef.current.destroy();
    }

    if (mask) {
      maskRef.current = IMask(inputRef.current, {
        mask,
        lazy: false,
      });

      maskRef.current.on('accept', () => {
        const unmasked = maskRef.current?.unmaskedValue || '';
        if (unmasked) {
          onChange(`+${getCallingCode(country)}${unmasked}`);
        } else {
          onChange(undefined);
        }
      });

      if (value?.startsWith('+')) {
        const code = value.slice(1);
        const detected = PHONE_COUNTRIES.find((c) => code.startsWith(c.code));
        if (detected) {
          setCountry(detected.country as CountryCode);
          const localNumber = code.slice(detected.code.length);
          maskRef.current.unmaskedValue = localNumber;
          maskRef.current.updateValue();
        }
      }
    }

    return () => {
      if (maskRef.current) {
        maskRef.current.destroy();
      }
    };
  }, [country, mask]);

  useEffect(() => {
    if (!inputRef.current) return;

    if (maskRef.current) {
      maskRef.current.destroy();
    }

    if (mask) {
      maskRef.current = IMask(inputRef.current, {
        mask,
        lazy: false,
      });

      maskRef.current.on('accept', () => {
        const unmasked = maskRef.current?.unmaskedValue || '';
        if (unmasked) {
          onChange(`+${getCallingCode(country)}${unmasked}`);
        } else {
          onChange(undefined);
        }
      });
    }

    return () => {
      if (maskRef.current) {
        maskRef.current.destroy();
      }
    };
  }, [country, mask, onChange]);

  const onCountrySelect = (code: string, countryCode: CountryCode) => {
    setCountry(countryCode);
    if (maskRef.current) {
      maskRef.current.unmaskedValue = '';
      maskRef.current.updateValue();
    }
    onChange(undefined);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleBlur = () => {
    if (onBlur) onBlur();
  };

  return (
    <div className="space-y-2">
      {label && <FormLabel>{label}</FormLabel>}
      <div className="flex rounded-md border border-input overflow-hidden focus-visible:outline-none focus-visible:border-primary focus-visible:ring-0 focus-within:outline-none focus-within:border-primary focus-within:ring-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-1 px-3 py-2 border-r border-input bg-muted/30 rounded-none h-10 text-sm font-medium"
              disabled={disabled}
              type="button"
            >
              <Image
                alt={country}
                src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`}
                width={16}
                height={12}
                className="w-4 h-3 object-cover"
              />
              <span>+{getCallingCode(country)}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-60 overflow-hidden p-0">
            <ScrollArea className="h-60">
              {PHONE_COUNTRIES.map(({ country: c, name, code }) => (
                <DropdownMenuItem
                  key={c}
                  onClick={() => onCountrySelect(code, c as CountryCode)}
                  className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-accent"
                >
                  <Image
                    alt={name}
                    src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${c}.svg`}
                    width={16}
                    height={12}
                    className="w-4 h-3 object-cover"
                  />
                  <span className="text-sm">{name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">+{code}</span>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          ref={inputRef}
          type="text"
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className="flex h-10 w-full rounded-none border-0 bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 "
        />
      </div>
      {error && <FormMessage>{error}</FormMessage>}
    </div>
  );
}
