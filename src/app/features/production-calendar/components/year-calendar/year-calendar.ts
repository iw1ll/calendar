import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { DayType, IsoDate } from '../../../../core/models/calendar.models';
import { fromIsoDate } from '../../../../core/utils/date.utils';
import { MonthCalendar } from '../month-calendar/month-calendar';

/** Календарь на весь год */
@Component({
  selector: 'app-year-calendar',
  imports: [MonthCalendar],
  templateUrl: './year-calendar.html',
  styleUrl: './year-calendar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearCalendar {
  /** Ссылка на корневой DOM-элемент */
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  /** Год */
  readonly year = input.required<number>();
  /** Карта date → type */
  readonly entryTypes = input.required<ReadonlyMap<IsoDate, DayType>>();
  /** Сегодняшняя дата */
  readonly today = input.required<IsoDate>();
  /** Выбранная дата */
  readonly selectedDate = model<IsoDate | null>(null);
  /** Двойной клик по дню — эмитим дату родителю */
  readonly dateDblClick = output<IsoDate>();
  /** Индексы месяцев */
  protected readonly months = Array.from({ length: 12 }, (_, i) => i);

  constructor() {
    /**
     * Сменили год:
     * —> если это текущий год, скроллим к сегодняшнему месяцу
     * —> если другой год, скроллим к началу списка
     */
    afterRenderEffect(() => {
      const today = fromIsoDate(this.today());
      const host = this.host.nativeElement;

      if (today.getFullYear() !== this.year()) {
        host.scrollTo({ top: 0 });
        return;
      }

      host
        .querySelector(`app-month-calendar[data-month="${today.getMonth()}"]`)
        ?.scrollIntoView({ block: 'start' });
    });

    /** Выбрали строку в таблице или день в календаре -> скроллим к месяцу */
    afterRenderEffect(() => {
      const date = this.selectedDate();
      if (!date) return;

      const month = fromIsoDate(date).getMonth();
      this.host.nativeElement
        .querySelector(`app-month-calendar[data-month="${month}"]`)
        ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }
}
