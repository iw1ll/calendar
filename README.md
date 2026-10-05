# Производственный календарь

Компонент для управления производственным календарём:
Стек: Angular 22.2, PrimeNG 22

## Запуск

```bash
npm install
npm start
npm run build
```

### Сборка и запуск в docker

```bash
# Собрать образ и запустить контейнер
docker compose up -d --build

# Приложение доступно на http://localhost:8081
```

### Остановка

```bash
# Остановить и удалить контейнер
docker compose down
```

### Логи

```bash
docker compose logs -f
```

### Пересборка после изменений

```bash
docker compose up -d --build
```

## Архитектура

```
src/app/
├── core/
│   ├── models/calendar.models.ts         # DayType, CalendarEntry, подписи
│   ├── services/calendar-mock.service.ts # mock API (HttpClient + JSON + задержка)
│   ├── utils/date.utils.ts               # ISO-даты без сдвига TZ, стандартный график
│   └── i18n/primeng-ru.ts                # русская локаль PrimeNG
└── features/production-calendar/
    ├── production-calendar.store.ts      # состояние экрана (signals)
    ├── production-calendar.ts            # контейнер: связывает store, диалог, уведомления
    └── components/                       # презентационные компоненты (input/model/output)
        ├── calendar-toolbar/             # тулбар: выбор года, кнопки "Добавить"/"Удалить"
        ├── entries-table/                # таблица записей: дата + тип, выбор, редактирование
        ├── year-calendar/                # календарь на год: 12 месяцев + автоскролл к месяцу
        ├── month-calendar/               # один месяц: раскраска дней, тултипы, статистика
        └── entry-dialog/                 # диалог создания/редактирования записи
```
