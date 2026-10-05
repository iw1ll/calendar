import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import {
  CalendarEntry,
  DAY_TYPE_LABELS,
  DayType,
  IsoDate,
} from '../../core/models/calendar.models';
import { defaultDayType, fromIsoDate } from '../../core/utils/date.utils';
import { CalendarToolbar } from './components/calendar-toolbar/calendar-toolbar';
import { EntriesTable } from './components/entries-table/entries-table';
import {
  EntryDialog,
  EntryDialogRequest,
  EntryDialogResult,
} from './components/entry-dialog/entry-dialog';
import { YearCalendar } from './components/year-calendar/year-calendar';
import { ProductionCalendarStore } from './production-calendar.store';

/** Главный экран производственного календаря */
@Component({
  selector: 'app-production-calendar',
  imports: [
    ConfirmDialogModule,
    ProgressBarModule,
    ToastModule,
    CalendarToolbar,
    EntriesTable,
    EntryDialog,
    YearCalendar,
  ],
  providers: [ProductionCalendarStore, ConfirmationService, MessageService],
  templateUrl: './production-calendar.html',
  styleUrl: './production-calendar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionCalendar {
  /** Состояние экрана */
  protected readonly store = inject(ProductionCalendarStore);
  /** Сервис диалога подтверждения удаления */
  private readonly confirmation = inject(ConfirmationService);
  /** Сервис уведомлений */
  private readonly messages = inject(MessageService);
  /** Запрос на открытие диалога */
  protected readonly dialogRequest = signal<EntryDialogRequest | null>(null);

  /** Кнопка "Добавить" */
  protected openCreate(): void {
    const selected = this.store.selectedDate();
    const date = selected && !this.store.selectedEntry() ? selected : null;
    this.openForNewDate(date);
  }

  /** Открыть диалог редактирования существующей записи */
  protected openEdit(entry: CalendarEntry): void {
    this.dialogRequest.set({ mode: 'edit', entry });
  }

  /** Двойной клик по дню календаря */
  protected openForDate(date: IsoDate): void {
    const entry = this.store.entries().find((e) => e.date === date);
    if (entry) {
      this.openEdit(entry);
    } else {
      this.openForNewDate(date);
    }
  }

  /** Сохранение из диалога */
  protected onSave({ entry, previousDate }: EntryDialogResult): void {
    const isUpdate = this.store.entryTypes().has(entry.date) || !!previousDate;

    this.store.save(entry, previousDate);
    this.dialogRequest.set(null);

    this.messages.add({
      severity: 'success',
      summary: isUpdate ? 'Запись обновлена' : 'Запись добавлена',
      detail: `${formatDate(entry.date)} — ${DAY_TYPE_LABELS[entry.type]}`,
      life: 3500,
    });
  }

  /** Удаление записи с подтверждением */
  protected confirmRemove(entry: CalendarEntry | null = this.store.selectedEntry()): void {
    if (!entry) {
      return;
    }

    this.confirmation.confirm({
      header: 'Удалить запись?',
      message: `${formatDate(entry.date)} — ${DAY_TYPE_LABELS[entry.type]}. День вернётся к стандартному графику.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Удалить',
      rejectLabel: 'Отменить',
      acceptButtonProps: { severity: 'danger', size: 'small' },
      rejectButtonProps: { severity: 'secondary', size: 'small' },
      accept: () => {
        this.store.remove(entry.date);
        this.messages.add({
          severity: 'info',
          summary: 'Запись удалена',
          detail: formatDate(entry.date),
          life: 2500,
        });
      },
    });
  }

  /** Открыть диалог создания новой записи */
  private openForNewDate(date: IsoDate | null): void {
    const type =
      date && defaultDayType(fromIsoDate(date)) === DayType.Working
        ? DayType.NonWorking
        : DayType.Working;
    this.dialogRequest.set({ mode: 'create', date, type });
  }
}

/** Форматирует ISO-дату в русский формат для тостов и диалога */
function formatDate(iso: IsoDate): string {
  return fromIsoDate(iso).toLocaleDateString('ru-RU');
}
