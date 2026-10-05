import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

/** Панель инструментов производственного календаря.*/
@Component({
  selector: 'app-calendar-toolbar',
  imports: [FormsModule, ButtonModule, SelectModule, ToolbarModule, TooltipModule],
  templateUrl: './calendar-toolbar.html',
  styleUrl: './calendar-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarToolbar {
  /** Список доступных годов */
  readonly years = input.required<number[]>();
  /** Текущий выбранный год */
  readonly year = model.required<number>();
  /** Можно ли удалять записи */
  readonly canRemove = input(false);
  /** Лоадер */
  readonly loading = input(false);
  /** Добавить */
  readonly add = output<void>();
  /** Удалить */
  readonly remove = output<void>();
}
