export type WorkHour = {
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
};

export function isOpenNow(
  workHours: WorkHour[],
  options: {
    timeZone?: string;
  } = {}
): boolean {
  const { timeZone = 'America/Sao_Paulo' } = options;

  const now = new Date();

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(now).map(({ type, value }) => [type, value])
  );

  const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const currentDayOfWeek = dayMap[parts.weekday as keyof typeof dayMap];
  const currentHour = parseInt(parts.hour);
  const currentMinute = parseInt(parts.minute);
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  const todaySchedule = workHours.find((wh) => wh.dayOfWeek === currentDayOfWeek);

  if (!todaySchedule || !todaySchedule.openTime || !todaySchedule.closeTime) {
    return false;
  }

  const [openHour, openMinute] = todaySchedule.openTime.split(':').map(Number);
  const [closeHour, closeMinute] = todaySchedule.closeTime.split(':').map(Number);

  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;

  if (closeTimeInMinutes < openTimeInMinutes) {
    return currentTimeInMinutes >= openTimeInMinutes || currentTimeInMinutes < closeTimeInMinutes;
  }

  return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes;
}
