import { Injectable, computed, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CalendarEntry, DayType, IsoDate } from '../../core/models/calendar.models';
import { CalendarMockService } from '../../core/services/calendar-mock.service';
import { defaultDayType, fromIsoDate, sortByDate, toIsoDate } from '../../core/utils/date.utils';

export interface YearStats {
  working: number;
  nonWorking: number;
}

/** Состояние экрана производственного календаря */
@Injectable()
export class ProductionCalendarStore {
  /** Мок-сервис для загрузки данных */
  private readonly api = inject(CalendarMockService);
  /** Сегодняшняя дата в ISO-формате */
  readonly today: IsoDate = toIsoDate(new Date());
  /** Список доступных годов */
  readonly years: number[] = [new Date().getFullYear(), new Date().getFullYear() + 1];
  /** Текущий выбранный год */
  readonly year = signal(this.years[0]);
  /** Асинхронный ресурс для загрузки записей календаря.*/
  private readonly remote = rxResource({
    params: () => this.year(),
    stream: ({ params: year }) => this.api.getYear(year),
  });
  /** Локальные правки пользователя по годам */
  private readonly localEdits = signal<ReadonlyMap<number, readonly CalendarEntry[]>>(new Map());
  /** Флаг загрузки данных */
  readonly loading = this.remote.isLoading;

  /** Записи выбранного года, отсортированные по дате */
  readonly entries = computed<readonly CalendarEntry[]>(() => {
    const year = this.year();
    const local = this.localEdits().get(year);

    if (local) {
      return local;
    }

    const response = this.remote.value();

    return response?.year === year ? sortByDate(response.entries) : [];
  });

  /** Индекс `date → type`, по которому календарь раскрашивает дни */
  readonly entryTypes = computed(() => new Map(this.entries().map((e) => [e.date, e.type])));

  /** Выбранная дата */
  readonly selectedDate = linkedSignal<number, IsoDate | null>({
    source: this.year,
    computation: () => null,
  });

  /** Запись, соответствующая выбранной дате */
  readonly selectedEntry = computed(() => {
    const date = this.selectedDate();

    if (!date) {
      return null;
    }

    return this.entries().find((e) => e.date === date) ?? null;
  });

  /** Итоговый тип дня: запись, если она есть, иначе стандартный график (Пн-Пт рабочие, Сб-Вс нерабочие). */
  dayTypeOf(date: IsoDate): DayType {
    return this.entryTypes().get(date) ?? defaultDayType(fromIsoDate(date));
  }

  /** Создаёт или обновляет запись */
  save(entry: CalendarEntry, previousDate?: IsoDate): void {
    this.updateEntries((entries) => [
      ...entries.filter((e) => e.date !== entry.date && e.date !== previousDate),
      entry,
    ]);
    // После сохранения выбираем дату сохраненной записи
    this.selectedDate.set(entry.date);
  }

  /** Удаляет запись по дате */
  remove(date: IsoDate): void {
    this.updateEntries((entries) => entries.filter((e) => e.date !== date));

    if (this.selectedDate() === date) {
      this.selectedDate.set(null);
    }
  }

  /** Вспомогательный метод для изменения записей */
  private updateEntries(change: (entries: readonly CalendarEntry[]) => CalendarEntry[]): void {
    const year = this.year();
    const next = sortByDate(change(this.entries()));
    this.localEdits.update((edits) => new Map(edits).set(year, next));
  }
}

