'use client';

import { toast } from 'sonner';
import { WorkHour } from '@prisma/client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/_components/ui/accordion';
import { useState } from 'react';

interface WorkHourProps {
  workHour: WorkHour[];
}

const WeeklyWorkHour = ({ workHour }: WorkHourProps) => {
  const [showToday, setShowToday] = useState(true);

  const dayOfWeekFormat = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  const today = new Date().getDay();

  const handleOpenChange = (value: string) => {
    if (value) {
      setShowToday(false);
    } else {
      setShowToday(true);
    }
  };

  return (
    <div className="flex flex-col">
      {showToday && (
        <div className="flex justify-between pb-2">
          <p className="text-sm font-medium">Hoje</p>
          <p className="text-sm">
            {workHour[today].openTime && workHour[today].closeTime
              ? `${workHour[today].openTime} - ${workHour[today].closeTime}`
              : 'Fechado'}
          </p>
        </div>
      )}
      <Accordion onValueChange={handleOpenChange} type="single" collapsible>
        <AccordionItem value="item-1" className="border-none">
          <div className="w-fit">
            <AccordionTrigger className="text-xs text-primary hover:no-underline gap-1 p-0">
              Ver semana completa
            </AccordionTrigger>
          </div>
          <AccordionContent className="flex flex-col gap-2 pb-0 pt-4">
            {workHour.map((eachDayWorkHour) => (
              <div className="flex justify-between gap-2" key={eachDayWorkHour.id}>
                <p className="text-sm">{dayOfWeekFormat[eachDayWorkHour.dayOfWeek]}</p>
                <p className="text-sm">
                  {eachDayWorkHour.openTime && eachDayWorkHour.closeTime
                    ? `${eachDayWorkHour.openTime} - ${eachDayWorkHour.closeTime}`
                    : 'Fechado'}
                </p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default WeeklyWorkHour;
