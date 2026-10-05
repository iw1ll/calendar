import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductionCalendar } from './features/production-calendar/production-calendar';

@Component({
  selector: 'app-root',
  imports: [ProductionCalendar],
  template: `
    <main class="page">
      <h1 class="page__title">Производственный календарь</h1>
      <app-production-calendar class="page__content" />
    </main>
  `,
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
