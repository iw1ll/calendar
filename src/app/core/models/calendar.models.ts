/** Тип дня в формате */
export enum DayType {
  NonWorking = 0,
  Working = 1,
}

/** Словарь "Тип дня" */
export const DAY_TYPE_LABELS: Record<DayType, string> = {
  [DayType.Working]: 'Рабочий',
  [DayType.NonWorking]: 'Нерабочий',
};

/** Опции для выпадающего списка "Тип дня" */
export const DAY_TYPE_OPTIONS: { label: string; value: DayType }[] = [
  { label: DAY_TYPE_LABELS[DayType.Working], value: DayType.Working },
  { label: DAY_TYPE_LABELS[DayType.NonWorking], value: DayType.NonWorking },
];

/** ISO-дата без времени: `YYYY-MM-DD` */
export type IsoDate = string;

/** Запись в календаре */
export interface CalendarEntry {
  date: IsoDate;
  type: DayType;
}

/** Ответ API по годам */
export interface CalendarYearResponse {
  year: number;
  entries: CalendarEntry[];
}
