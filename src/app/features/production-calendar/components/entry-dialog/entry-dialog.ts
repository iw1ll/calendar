import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import {
  CalendarEntry,

  DAY_TYPE_OPTIONS,
  DayType,
  IsoDate,
} from '../../../../core/models/calendar.models';
import { fromIsoDate, toIsoDate } from '../../../../core/utils/date.utils';

/** С чем открыть диалог */
export type EntryDialogRequest =
  | { mode: 'create'; date: IsoDate | null; type: DayType }
  | { mode: 'edit'; entry: CalendarEntry };

/** Результат сохранения формы */
export interface EntryDialogResult {
  entry: CalendarEntry;
  /** Исходная дата при редактировании, если её поменяли */
  previousDate?: IsoDate;
}

/** Внутренняя модель формы диалога */
interface EntryFormModel {
  date: Date | null;
  type: DayType | null;
}

/** Создание/редактирование записи календаря */
@Component({
  selector: 'app-entry-dialog',
  imports: [
    FormField,
    ButtonModule,
    DatePickerModule,
    DialogModule,
    IftaLabelModule,
    MessageModule,
    SelectModule,
  ],
  templateUrl: './entry-dialog.html',
  styleUrl: './entry-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryDialog {
  /** `Диалог закрыт | иначе — с чем его открыть */
  readonly request = input<EntryDialogRequest | null>(null);
  /** Текущий выбранный год */
  readonly year = input.required<number>();
  /** Пользователь сохранил форму */
  readonly save = output<EntryDialogResult>();
  /** Пользователь закрыл диалог */
  readonly closed = output<void>();
  /** Опции селекта "Тип дня" */
  protected readonly typeOptions = DAY_TYPE_OPTIONS;
  /** Открыт ли диалог */
  protected readonly visible = computed(() => this.request() !== null);
  /** Режим редактирования (иначе — создание) */
  protected readonly isEdit = computed(() => this.request()?.mode === 'edit');
  /** Минимально допустимая дата */
  protected readonly minDate = computed(() => new Date(this.year(), 0, 1));
  /** Максимально допустимая дата */
  protected readonly maxDate = computed(() => new Date(this.year(), 11, 31));

  /** Модель формы */
  private readonly model = linkedSignal<EntryFormModel>(() => {
    const request = this.request();

    if (!request) {
      return { date: null, type: DayType.Working };
    }

    if (request.mode === 'edit') {
      return {
        date: fromIsoDate(request.entry.date),
        type: request.entry.type,
      };
    }

    return {
      date: request.date ? fromIsoDate(request.date) : null,
      type: request.type,
    };
  });

  /** Форма */
  protected readonly entryForm = form(this.model, (path) => {
    required(path.date, { message: 'Укажите дату' });
    required(path.type, { message: 'Выберите тип дня' });
  });

  /** Исходная дата записи при редактировании */
  private readonly originalDate = computed(() => {
    const request = this.request();
    return request?.mode === 'edit' ? request.entry.date : null;
  });


  /** Возвращает текст ошибки поля */
  protected errorOf(field: 'date' | 'type'): string | null {
    const state = this.entryForm[field]();

    if (!state.touched() || !state.invalid()) {
      return null;
    }

    return state.errors()[0]?.message ?? null;
  }

  /** Валидирует форму */
  protected async onSubmit(): Promise<void> {
    await submit(this.entryForm, async () => {
      const { date, type } = this.model();

      if (!date || type === null) {
        return;
      }

      const entry: CalendarEntry = { date: toIsoDate(date), type };
      const previousDate = this.originalDate();

      this.save.emit({
        entry,
        // Передаём прежнюю дату только если она реально изменилась
        previousDate: previousDate && previousDate !== entry.date ? previousDate : undefined,
      });
    });
  }

  /** Реагирует на закрытие диалога PrimeNG и эмитит `closed` наверх */
  protected onVisibleChange(visible: boolean): void {
    if (!visible) {
      this.closed.emit();
    }
  }
}
