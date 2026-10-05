import { CalendarEntry, DayType, IsoDate } from '../models/calendar.models';

/** Дополняет число нулем слева до 2 символов */
const pad = (value: number): string => String(value).padStart(2, '0');

/** Date → `YYYY-MM-DD` в локальной зоне. */
export function toIsoDate(date: Date): IsoDate {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** `YYYY-MM-DD` → Date в локальной полночи */
export function fromIsoDate(iso: IsoDate): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Собирает `YYYY-MM-DD` из отдельных чисел */
export function isoDateOf(year: number, month: number, day: number): IsoDate {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

/** Извлекает год из ISO-строки */
export function yearOf(iso: IsoDate): number {
  return Number(iso.slice(0, 4));
}

/** Определяет выходной день */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/** Определяет стандартный график */
export function defaultDayType(date: Date): DayType {
  return isWeekend(date) ? DayType.NonWorking : DayType.Working;
}

/** Сортирует записи по дате */
export function sortByDate(entries: readonly CalendarEntry[]): CalendarEntry[] {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date));
}
