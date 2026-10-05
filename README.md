# Производственный календарь

Компонент для управления производственным календарём:
Стек: Angular 22.2, PrimeNG 22

## Запуск

```bash
npm install
npm start
npm run build
```

## Архитектура

```
src/app/
├── core/
│   ├── models/calendar.models.ts       # DayType, CalendarEntry, подписи
│   ├── services/calendar-mock.service.ts # mock API (HttpClient + JSON + задержка)
│   ├── utils/date.utils.ts             # ISO-даты без сдвига TZ, стандартный график
│   └── i18n/primeng-ru.ts              # русская локаль PrimeNG
└── features/production-calendar/
    ├── production-calendar.store.ts    # состояние экрана (signals)
    ├── production-calendar.ts          # контейнер: связывает store, диалог, уведомления
    └── components/                     # презентационные компоненты (input/model/output)
        ├── calendar-toolbar/
        ├── entries-table/
        ├── year-calendar/
        ├── month-calendar/
        └── entry-dialog/
```
