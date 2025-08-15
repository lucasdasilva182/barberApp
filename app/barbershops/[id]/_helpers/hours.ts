import { WorkHour } from '@prisma/client';
import {
  startOfDay,
  setHours,
  setMinutes,
  addMinutes,
  isBefore,
  isSameDay,
  format,
} from 'date-fns';

export interface WorkHourProps {
  selectedDate: Date;
  workHours: WorkHour[];
  serviceInterval?: number;
}

export function generateDayTimeList({
  selectedDate,
  workHours,
  serviceInterval = 45,
}: WorkHourProps): string[] {
  const dayOfWeek = selectedDate.getDay();
  const schedule = workHours.find((wh) => wh.dayOfWeek === dayOfWeek);

  if (!schedule?.openTime || !schedule.closeTime) return [];

  const openTime = parseTime(schedule.openTime);
  const closeTime = parseTime(schedule.closeTime);

  const opening = setHours(setMinutes(selectedDate, openTime.minutes), openTime.hours);
  const closing = setHours(setMinutes(selectedDate, closeTime.minutes), closeTime.hours);

  let startTime = isToday(selectedDate)
    ? getNextAvailableSlot(new Date(), opening, serviceInterval)
    : opening;

  if (isBefore(closing, startTime)) return [];

  const times: string[] = [];
  let current = startTime;

  while (isBefore(current, closing) || current.getTime() === closing.getTime()) {
    times.push(format(current, 'HH:mm'));
    current = addMinutes(current, serviceInterval);
  }

  return times;
}

function parseTime(time: string): { hours: number; minutes: number } {
  const [h, m] = time.split(':').map(Number);
  return { hours: h, minutes: m };
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function getNextAvailableSlot(now: Date, opening: Date, interval: number): Date {
  // Começa do próximo slot após "agora", mas não antes da abertura
  const dayStart = startOfDay(now);
  const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();

  // Arredonda para cima para o próximo múltiplo do intervalo
  const nextSlotMinutes = Math.ceil(minutesSinceMidnight / interval) * interval;

  // Converte de volta para data
  const nextSlot = addMinutes(setHours(setMinutes(dayStart, 0), 0), nextSlotMinutes);

  // Retorna o maior entre: próximo slot ou horário de abertura
  return nextSlot > opening ? nextSlot : opening;
}
