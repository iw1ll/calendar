import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import {
  CalendarEntry,
  DAY_TYPE_LABELS,
  DayType,
  IsoDate,
} from '../../../../core/models/calendar.models';

/** Таблица записей календаря */
@Component({
  selector: 'app-entries-table',
  imports: [DatePipe, TableModule],
  templateUrl: './entries-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntriesTable {
  /** Записи для отображения */
  readonly entries = input.required<readonly CalendarEntry[]>();
  /** Идёт ли загрузка данных */
  readonly loading = input(false);
  /** Выбранная дата */
  readonly selectedDate = model<IsoDate | null>(null);
  /** Редактировать запись */
  readonly edit = output<CalendarEntry>();
  /** Удалить запись */
  readonly remove = output<CalendarEntry>();
  /** Enum в DayType */
  protected readonly DayType = DayType;
  /** Копия массива для p-table */
  protected readonly rows = computed(() => [...this.entries()]);
  /** Выбранная строка*/
  protected readonly selectedRow = computed(() => {
    const date = this.selectedDate();
    return this.entries().find((e) => e.date === date) ?? null;
  });
  /** Обработка типа дня */
  protected labelOf(type: DayType): string {
    return DAY_TYPE_LABELS[type];
  }
  /** Сохранение даты */
  protected onSelectionChange(row: CalendarEntry | null): void {
    this.selectedDate.set(row?.date ?? null);
  }
}
