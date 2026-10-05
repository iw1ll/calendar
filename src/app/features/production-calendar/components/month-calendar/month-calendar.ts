import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { DatePickerDateMeta } from 'primeng/types/datepicker';
import { DAY_TYPE_LABELS, DayType, IsoDate } from '../../../../core/models/calendar.models';
import { fromIsoDate, isWeekend, isoDateOf, toIsoDate } from '../../../../core/utils/date.utils';

/** Названия месяцев по индексу */
const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

/** Один месяц производственного календаря */
@Component({
  selector: 'app-month-calendar',
  imports: [FormsModule, DatePickerModule],
  templateUrl: './month-calendar.html',
  styleUrl: './month-calendar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  /** Host binding: вешаем data-month на корневой элемент */
  host: {
    '[attr.data-month]': 'month()',
  },
})
export class MonthCalendar {
  /** Год, к которому относится месяц */
  readonly year = input.required<number>();
  /** Номер месяца (0–11) */
  readonly month = input.required<number>();
  /** Карта date → type */
  readonly entryTypes = input.required<ReadonlyMap<IsoDate, DayType>>();
  /** Сегодняшняя дата (ISO) — для подсветки "сегодня" */
  readonly today = input.required<IsoDate>();
  /** Выбранная дата */
  readonly selectedDate = model<IsoDate | null>(null);
  /** Двойной клик по дню */
  readonly dateDblClick = output<IsoDate>();
  /** Название месяца для заголовка */
  protected readonly title = computed(() => MONTH_NAMES[this.month()]);
  /** Первое число месяца */
  protected readonly firstDay = computed(() => new Date(this.year(), this.month(), 1));
  /** Текущий месяц */
  protected readonly isCurrentMonth = computed(() => {
    const today = fromIsoDate(this.today());
    return today.getFullYear() === this.year() && today.getMonth() === this.month();
  });

  /** Fix для datepicker (переключает видимый месяц на месяц своего значения) */
  protected readonly value = computed(() => {
    const date = this.selectedDate();

    if (!date) {
      return null;
    }

    const parsed = fromIsoDate(date);
    return parsed.getFullYear() === this.year() && parsed.getMonth() === this.month()
      ? parsed
      : null;
  });

  /** Выбор дня в datepicker → пишем ISO в selectedDate */
  protected onSelect(date: Date | null): void {
    if (date) {
      this.selectedDate.set(toIsoDate(date));
    }
  }

  /** Преобразует метаданные ячейки p-datepicker в ISO-строку */
  protected isoOf(meta: DatePickerDateMeta): IsoDate {
    return isoDateOf(meta.year, meta.month, meta.day);
  }

  /** Классы для ячейки дня */
  protected dayClasses(meta: DatePickerDateMeta): Record<string, boolean> {
    const iso = this.isoOf(meta);
    const type = this.entryTypes().get(iso);
    return {
      day: true,
      'day--working': type === DayType.Working,
      'day--nonworking': type === DayType.NonWorking,
      'day--weekend': type === undefined && isWeekend(new Date(meta.year, meta.month, meta.day)),
      'day--today': iso === this.today() && !meta.otherMonth,
      'day--other-month': !!meta.otherMonth,
    };
  }

  /** Тултип над днём — что за день и что сделает двойной клик */
  protected dayHint(meta: DatePickerDateMeta): string {
    const iso = this.isoOf(meta);
    const type = this.entryTypes().get(iso);
    if (type !== undefined) {
      return `${DAY_TYPE_LABELS[type]} день (запись). Двойной клик — изменить`;
    }
    const label = isWeekend(new Date(meta.year, meta.month, meta.day)) ? 'Выходной день' : 'Рабочий день';
    return `${label} по графику. Двойной клик — добавить запись`;
  }

  /** Проверка на дни прошлого месяца */
  protected checkOtherMonth(meta: DatePickerDateMeta) {
    if (meta.otherMonth) {
      return;
    }

    this.dateDblClick.emit(this.isoOf(meta));
  }
 }
