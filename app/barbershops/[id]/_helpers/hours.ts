import {
  setHours,
  setMinutes,
  format,
  addMinutes,
  isFuture,
  getHours,
} from 'date-fns';

const now = new Date();

export function generateDayTimeList(date: Date): string[] {
  const startTime = isFuture(date)
    ? setMinutes(setHours(date, 9), 0)
    : setMinutes(setHours(date, getHours(now) > 9 ? getHours(now) + 1 : 9), 0);
  const endTime = setMinutes(setHours(date, 21), 0); // Set end time to 21:00
  const interval = 45; // interval in minutes
  const timeList: string[] = [];

  let currentTime = startTime;

  while (currentTime <= endTime) {
    timeList.push(format(currentTime, 'HH:mm'));
    currentTime = addMinutes(currentTime, interval);
  }

  return timeList;
}
