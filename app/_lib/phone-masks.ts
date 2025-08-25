type Mask = {
  mask: string;
  placeholder: string;
};

export const PHONE_MASKS: Record<string, Mask> = {
  BR: {
    mask: '(00) 0 0000-0000',
    placeholder: '(00) 0 0000-0000',
  },
  US: {
    mask: '(000) 000-0000',
    placeholder: '(000) 000-0000',
  },
  CA: {
    mask: '(000) 000-0000',
    placeholder: '(000) 000-0000',
  },
  PT: {
    mask: '000 000 000',
    placeholder: '000 000 000',
  },
  GB: {
    mask: '00000 000000',
    placeholder: '00000 000000',
  },
  DE: {
    mask: '000 000000',
    placeholder: '000 000000',
  },
  ES: {
    mask: '000 000 000',
    placeholder: '000 000 000',
  },
  FR: {
    mask: '00 00 00 00 00',
    placeholder: '00 00 00 00 00',
  },
  IT: {
    mask: '000 000 0000',
    placeholder: '000 000 0000',
  },
  AR: {
    mask: '00 0000-0000',
    placeholder: '00 0000-0000',
  },
  MX: {
    mask: '000 000 0000',
    placeholder: '000 000 0000',
  },
  PE: {
    mask: '000 000 000',
    placeholder: '000 000 000',
  },
};

export const getPhoneMask = (country: string) => {
  return PHONE_MASKS[country] || { mask: '', placeholder: 'Digite o número' };
};
