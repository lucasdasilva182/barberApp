export const PHONE_COUNTRIES = [
  { code: '55', country: 'BR' as const, name: 'Brasil' },
  { code: '1', country: 'US' as const, name: 'Estados Unidos' },
  { code: '1', country: 'CA' as const, name: 'Canadá' },
  { code: '351', country: 'PT' as const, name: 'Portugal' },
  { code: '44', country: 'GB' as const, name: 'Reino Unido' },
  { code: '49', country: 'DE' as const, name: 'Alemanha' },
  { code: '34', country: 'ES' as const, name: 'Espanha' },
  { code: '33', country: 'FR' as const, name: 'França' },
  { code: '39', country: 'IT' as const, name: 'Itália' },
  { code: '54', country: 'AR' as const, name: 'Argentina' },
  { code: '52', country: 'MX' as const, name: 'México' },
  { code: '51', country: 'PE' as const, name: 'Peru' },
] as const;

export type CountryCode = (typeof PHONE_COUNTRIES)[number]['country'];

export const getCallingCode = (country: CountryCode): string => {
  return PHONE_COUNTRIES.find((c) => c.country === country)?.code || '55';
};

export const getCountryByCallingCode = (code: string): CountryCode => {
  const found = PHONE_COUNTRIES.find((c) => c.code === code);
  return (found?.country || 'BR') as CountryCode;
};
