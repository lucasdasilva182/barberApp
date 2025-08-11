'use client';

import { Copy, SmartphoneIcon } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface PhoneItemProps {
  phone: string;
}

const PhoneItem = ({ phone }: PhoneItemProps) => {
  const handleCopyPhoneClick = (phone: string) => {
    navigator.clipboard.writeText(phone);
    toast.success('Telefone copiado com sucesso!');
  };

  return (
    <div className="flex justify-start gap-2" key={phone}>
      <div className="flex items-center gap-2">
        <SmartphoneIcon />
        <p className="text-sm">{phone}</p>
      </div>
      <Button
        variant="ghost"
        className="p-2 h-fit"
        size="sm"
        onClick={() => handleCopyPhoneClick(phone)}
      >
        <Copy size={14} />
      </Button>
    </div>
  );
};

export default PhoneItem;
